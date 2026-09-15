interface HtmlBlock {
  html: string;
  tagName?: string;
  attributes?: string;
  innerHtml?: string;
}

export type TeachingMarkdownPart =
  | { type: 'html'; html: string }
  | {
      type: 'profile';
      id?: string;
      titleHtml: string;
      periodHtml?: string;
      teaserHtml?: string;
      contentHtml: string;
    };

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]);

function findTagEnd(html: string, start: number) {
  let quote: '"' | "'" | undefined;

  for (let index = start + 1; index < html.length; index += 1) {
    const character = html[index];

    if (quote) {
      if (character === quote) quote = undefined;
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }

  return html.length - 1;
}

function readTag(html: string, start: number) {
  if (html.startsWith('<!--', start)) {
    const commentEnd = html.indexOf('-->', start + 4);
    return {
      end: commentEnd === -1 ? html.length - 1 : commentEnd + 2,
      special: true
    };
  }

  const end = findTagEnd(html, start);
  const raw = html.slice(start, end + 1);
  const match = raw.match(/^<\s*(\/?)\s*([A-Za-z][\w:-]*)\b([\s\S]*?)>$/);

  if (!match) return { end, special: true };

  const name = match[2].toLowerCase();
  return {
    end,
    name,
    closing: match[1] === '/',
    selfClosing: /\/\s*>$/.test(raw) || VOID_ELEMENTS.has(name),
    attributes: match[3].replace(/\/\s*$/, '').trim()
  };
}

function splitTopLevelHtml(html: string): HtmlBlock[] {
  const blocks: HtmlBlock[] = [];
  let cursor = 0;

  while (cursor < html.length) {
    const opening = html.indexOf('<', cursor);

    if (opening === -1) {
      blocks.push({ html: html.slice(cursor) });
      break;
    }

    if (opening > cursor) {
      blocks.push({ html: html.slice(cursor, opening) });
      cursor = opening;
      continue;
    }

    const rootTag = readTag(html, opening);
    if (rootTag.special || rootTag.closing || !rootTag.name) {
      blocks.push({ html: html.slice(opening, rootTag.end + 1) });
      cursor = rootTag.end + 1;
      continue;
    }

    if (rootTag.selfClosing) {
      blocks.push({
        html: html.slice(opening, rootTag.end + 1),
        tagName: rootTag.name,
        attributes: rootTag.attributes,
        innerHtml: ''
      });
      cursor = rootTag.end + 1;
      continue;
    }

    let depth = 1;
    let scan = rootTag.end + 1;
    let closingStart = scan;
    let blockEnd = html.length;

    while (scan < html.length && depth > 0) {
      const nextTagStart = html.indexOf('<', scan);
      if (nextTagStart === -1) break;

      const nestedTag = readTag(html, nextTagStart);
      if (!nestedTag.special && nestedTag.name === rootTag.name) {
        if (nestedTag.closing) {
          depth -= 1;
          if (depth === 0) {
            closingStart = nextTagStart;
            blockEnd = nestedTag.end + 1;
            break;
          }
        } else if (!nestedTag.selfClosing) {
          depth += 1;
        }
      }

      scan = nestedTag.end + 1;
    }

    blocks.push({
      html: html.slice(opening, blockEnd),
      tagName: rootTag.name,
      attributes: rootTag.attributes,
      innerHtml: html.slice(rootTag.end + 1, closingStart)
    });
    cursor = blockEnd;
  }

  return blocks;
}

function isWhitespace(block: HtmlBlock) {
  return !block.tagName && block.html.trim() === '';
}

function isPeriodParagraph(block: HtmlBlock) {
  if (block.tagName !== 'p' || block.innerHtml === undefined) return false;
  return /^<strong>[\s\S]*<\/strong>$/.test(block.innerHtml.trim());
}

function headingId(attributes = '') {
  const match = attributes.match(/\bid\s*=\s*(["'])(.*?)\1/i);
  return match?.[2];
}

function profileFromBlocks(heading: HtmlBlock, body: HtmlBlock[]): TeachingMarkdownPart {
  const meaningful = body.filter((block) => !isWhitespace(block));
  const period = meaningful[0] && isPeriodParagraph(meaningful[0]) ? meaningful[0] : undefined;
  const teaserStart = period ? 1 : 0;
  const teaser = meaningful[teaserStart]?.tagName === 'p' ? meaningful[teaserStart] : undefined;
  const hidden = new Set([period, teaser].filter(Boolean));

  return {
    type: 'profile',
    id: headingId(heading.attributes),
    titleHtml: heading.innerHtml ?? '',
    periodHtml: period?.innerHtml,
    teaserHtml: teaser?.innerHtml,
    contentHtml: body
      .filter((block) => !hidden.has(block))
      .map((block) => block.html)
      .join('')
      .trim()
  };
}

export function createCollapsibleTeachingProfiles(html: string): TeachingMarkdownPart[] {
  const blocks = splitTopLevelHtml(html);
  const profileCount = blocks.filter((block) => block.tagName === 'h3').length;

  if (profileCount === 0) return [{ type: 'html', html }];

  const parts: TeachingMarkdownPart[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.tagName !== 'h3') {
      const previous = parts.at(-1);
      if (previous?.type === 'html') previous.html += block.html;
      else parts.push({ type: 'html', html: block.html });
      index += 1;
      continue;
    }

    const body: HtmlBlock[] = [];
    index += 1;

    while (
      index < blocks.length
      && blocks[index].tagName !== 'h2'
      && blocks[index].tagName !== 'h3'
    ) {
      body.push(blocks[index]);
      index += 1;
    }

    parts.push(profileFromBlocks(block, body));
  }

  return parts;
}
