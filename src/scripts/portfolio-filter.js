const filterButtons = [...document.querySelectorAll('[data-project-filter]')];
const projectItems = [...document.querySelectorAll('[data-project-item]')];
const sections = [...document.querySelectorAll('[data-project-section]')];
const status = document.querySelector('[data-filter-status]');

if (filterButtons.length && projectItems.length) {
  const applyFilter = (filter) => {
    let visibleCount = 0;

    for (const item of projectItems) {
      const categories = (item.dataset.projectCategories ?? '').split(/\s+/).filter(Boolean);
      const visible = filter === 'todos' || categories.includes(filter);
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    for (const section of sections) {
      const hasVisibleItems = [...section.querySelectorAll('[data-project-item]')]
        .some(item => !item.hidden);
      section.hidden = !hasVisibleItems;
    }

    for (const button of filterButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.projectFilter === filter));
    }

    if (status) {
      status.textContent = filter === 'todos'
        ? `${visibleCount} elementos en la selección`
        : `${visibleCount} elementos para este filtro`;
    }
  };

  for (const button of filterButtons) {
    button.addEventListener('click', () => applyFilter(button.dataset.projectFilter ?? 'todos'));
  }

  applyFilter('todos');
}
