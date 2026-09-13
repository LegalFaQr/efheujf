const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const header = document.querySelector('.header');
const mobile = window.matchMedia('(max-width: 760px)');
function closeMenu(returnFocus = false) {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation menu');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
mobile.addEventListener('change', () => closeMenu());
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 16);
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
const uniform = document.querySelector('#uniform-dialog');
const uniformButton = document.querySelector('#view-uniform');
if (uniform && uniformButton) {
uniformButton.addEventListener('click', () => { uniform.showModal(); document.body.classList.add('dialog-open'); });
uniform.querySelector('.close-dialog').addEventListener('click', () => uniform.close());
uniform.addEventListener('close', () => { document.body.classList.remove('dialog-open'); uniformButton.focus({preventScroll:true}); });
uniform.addEventListener('click', e => { if(e.target === uniform) { const r=uniform.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) uniform.close(); } });
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveals = [...document.querySelectorAll('.reveal')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:0.06,rootMargin:'0px 0px -20px 0px'});
  reveals.forEach((element,index) => { element.style.setProperty('--delay', (index % 3)*65+'ms'); observer.observe(element); });
  document.body.classList.add('motion-ready');
  reducedMotion.addEventListener('change', e => { if(e.matches) { document.body.classList.remove('motion-ready'); observer.disconnect(); } });
}
