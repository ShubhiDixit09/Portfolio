const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.nav a');
const themeButton = document.querySelector('.theme-button');
const themeMenu = document.querySelector('.theme-menu');
const themeLabel = document.querySelector('.theme-button-label');
const themeOptions = document.querySelectorAll('[data-theme-option]');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const themes = {
  pearl: { label: 'Pearl', meta: '#f5f2ea' },
  sage: { label: 'Sage', meta: '#edf1ea' },
  lavender: { label: 'Lavender', meta: '#f1eef6' },
  graphite: { label: 'Graphite', meta: '#181a18' }
};

function applyTheme(theme) {
  const selected = themes[theme] ? theme : 'pearl';
  document.documentElement.dataset.theme = selected;
  localStorage.setItem('portfolio-theme', selected);
  if (themeLabel) themeLabel.textContent = themes[selected].label;
  if (themeMeta) themeMeta.setAttribute('content', themes[selected].meta);
  themeOptions.forEach(option => option.classList.toggle('active', option.dataset.themeOption === selected));
}

applyTheme(document.documentElement.dataset.theme || 'pearl');

themeButton?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = !themeMenu?.hidden;
  if (themeMenu) themeMenu.hidden = isOpen;
  themeButton.setAttribute('aria-expanded', String(!isOpen));
});

themeOptions.forEach(option => option.addEventListener('click', () => {
  applyTheme(option.dataset.themeOption);
  if (themeMenu) themeMenu.hidden = true;
  themeButton?.setAttribute('aria-expanded', 'false');
}));

document.addEventListener('click', (event) => {
  if (!event.target.closest('.theme-control') && themeMenu && !themeMenu.hidden) {
    themeMenu.hidden = true;
    themeButton?.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (themeMenu) themeMenu.hidden = true;
    themeButton?.setAttribute('aria-expanded', 'false');
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  }
});

menuButton?.addEventListener('click', () => {
  const isOpen = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navLinks.forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('.project-image-frame img').forEach((img) => {
  img.addEventListener('error', () => {
    img.closest('.project-image-frame')?.classList.add('image-missing');
    img.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.innerHTML = '<span>Project preview</span><strong>Open the GitHub repository to view the latest interface.</strong>';
    img.parentElement?.appendChild(fallback);
  }, { once: true });
});
