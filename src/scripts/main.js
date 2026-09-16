const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  if (!menuButton || !navLinks) return;
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(event.target) || menuButton.contains(event.target)) return;
    closeMenu();
  });
}

const revealElements = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -24px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

const visualThemeButtons = document.querySelectorAll('[data-visual-theme]');
const visualThemeStorageKey = 'vicente-visual-theme';

function setVisualTheme(theme, persist = false) {
  const activeTheme = theme === 'teal' ? 'teal' : 'comic';
  const activeThemeClass = activeTheme === 'teal' ? 'theme-teal' : 'theme-comic';

  document.documentElement.classList.remove('theme-teal', 'theme-comic');
  document.documentElement.classList.add(activeThemeClass);

  visualThemeButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.visualTheme === activeTheme));
  });

  if (!persist) return;

  try {
    localStorage.setItem(visualThemeStorageKey, activeTheme);
  } catch {}
}

if (visualThemeButtons.length > 0) {
  const initialTheme = document.documentElement.classList.contains('theme-teal') ? 'teal' : 'comic';
  setVisualTheme(initialTheme);

  visualThemeButtons.forEach(button => {
    button.addEventListener('click', () => {
      setVisualTheme(button.dataset.visualTheme, true);
    });
  });
}
