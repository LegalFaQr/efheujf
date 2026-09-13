document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll('[data-reveal]')];

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.11, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => observer.observe(item));
}

const header = document.querySelector('[data-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
let closeTimer;

function openMenu() {
  if (!menuButton || !mobileMenu) return;
  window.clearTimeout(closeTimer);
  mobileMenu.hidden = false;
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation');
  requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
}

function closeMenu(returnFocus = false) {
  if (!menuButton || !mobileMenu || mobileMenu.hidden) return;
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  closeTimer = window.setTimeout(() => { mobileMenu.hidden = true; }, reducedMotion ? 0 : 250);
  if (returnFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
  else openMenu();
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) closeMenu();
}, { passive: true });

document.querySelectorAll('[data-accordion]').forEach((accordion) => {
  accordion.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      accordion.querySelectorAll('details[open]').forEach((openItem) => {
        if (openItem !== details) openItem.open = false;
      });
    });
  });
});

const visitForm = document.querySelector('[data-visit-form]');
if (visitForm) {
  const dateInput = visitForm.querySelector('input[type="date"]');
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput?.setAttribute('min', today);

  visitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!visitForm.reportValidity()) return;

    const data = new FormData(visitForm);
    const summary = visitForm.querySelector('[data-visit-summary]');
    if (!summary) return;

    const date = new Date(`${data.get('visitDate')}T12:00:00`);
    const formattedDate = Number.isNaN(date.getTime())
      ? String(data.get('visitDate'))
      : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

    summary.replaceChildren();

    const heading = document.createElement('h3');
    heading.textContent = 'Your visit plan is ready.';
    summary.append(heading);

    const intro = document.createElement('p');
    intro.textContent = `${data.get('parentName')}, you are planning a visit for ${data.get('childName')} on ${formattedDate}.`;
    summary.append(intro);

    const program = document.createElement('p');
    program.textContent = `Program to discuss: ${data.get('program')} · Child’s age: ${data.get('childAge')}.`;
    summary.append(program);

    const questionsValue = String(data.get('questions') || '').trim();
    if (questionsValue) {
      const questions = document.createElement('p');
      questions.textContent = `Questions to bring: ${questionsValue}`;
      summary.append(questions);
    }

    const note = document.createElement('p');
    note.textContent = 'Keep this page open or print the plan. No details have been sent or stored by the website.';
    summary.append(note);

    const print = document.createElement('button');
    print.type = 'button';
    print.textContent = 'Print this visit plan';
    print.addEventListener('click', () => window.print());
    summary.append(print);

    summary.hidden = false;
    summary.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
}
