document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = [...document.querySelectorAll('[data-reveal]')];
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const header = document.querySelector('[data-header]');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
let menuCloseTimer;

function openMenu() {
  if (!menuToggle || !mobileMenu) return;
  window.clearTimeout(menuCloseTimer);
  mobileMenu.hidden = false;
  document.body.classList.add('menu-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation');
  requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
}

function closeMenu({ returnFocus = false } = {}) {
  if (!menuToggle || !mobileMenu || mobileMenu.hidden) return;
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuCloseTimer = window.setTimeout(() => {
    mobileMenu.hidden = true;
  }, reducedMotion ? 0 : 290);
  if (returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener('click', () => {
  if (menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
  else openMenu();
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu({ returnFocus: true });
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1040) closeMenu();
}, { passive: true });

document.querySelectorAll('[data-accordion]').forEach((accordion) => {
  accordion.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      accordion.querySelectorAll('details[open]').forEach((openDetails) => {
        if (openDetails !== details) openDetails.open = false;
      });
    });
  });
});

const visitForm = document.querySelector('[data-visit-form]');
if (visitForm) {
  const dateInput = visitForm.querySelector('input[type="date"]');
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput?.setAttribute('min', localToday);

  visitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!visitForm.reportValidity()) return;

    const data = new FormData(visitForm);
    const summary = visitForm.querySelector('[data-visit-summary]');
    if (!summary) return;

    const preferredDate = new Date(`${data.get('visitDate')}T12:00:00`);
    const formattedDate = Number.isNaN(preferredDate.getTime())
      ? String(data.get('visitDate'))
      : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(preferredDate);

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

    const printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.textContent = 'Print this visit plan';
    printButton.addEventListener('click', () => window.print());
    summary.append(printButton);

    summary.hidden = false;
    summary.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
}
