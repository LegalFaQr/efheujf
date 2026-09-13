// Preserve links bookmarked before the page split.
const movedAnchors = new Set(['programmes', 'programme-panel', 'experience', 'school-day', 'daycare', 'gallery', 'about', 'future']);
function followMovedAnchor() {
  const hash = location.hash.slice(1);
  if (document.body.dataset.page === 'home' && movedAnchors.has(hash)) {
    location.replace('experience.html' + location.hash);
  }
}
followMovedAnchor();
window.addEventListener('hashchange', followMovedAnchor);

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
const programmes = {
  'Pre-Nursery': {age:'PRE-NURSERY · 2+ YEARS', title:'Their first little world of learning.', description:'A gentle introduction to school, where feeling comfortable comes first. Through stories, sensory play and first friendships, children begin to find their confidence.', image:'story-v2.jpg', alt:'Illustrative storytelling with children and a teacher', skills:['Communication, listening & vocabulary','Sensory play, colours & shapes','Music, movement & motor skills','Friendships & simple self-help skills']},
  'Nursery': {age:'NURSERY · 3+ YEARS', title:'Curiosity takes root.', description:'As children become more expressive, they make connections through hands-on learning, conversation and creative activities. Each little discovery builds a foundation for independent learning.', image:'nature-v2.jpg', alt:'Illustrative nature discovery with children planting seedlings', skills:['Pre-reading & phonological awareness','Early numeracy & environmental awareness','Art, storytelling, music & movement','Social-emotional learning & motor skills']},
  'LKG': {age:'LKG · 4+ YEARS', title:'Confidence in every new step.', description:'A play-based approach strengthens academic readiness while preserving the joy of discovery. Children build language, reasoning and everyday independence.', image:'hero-v2.jpg', alt:'Illustrative hands-on block activity with children in Kabira uniforms', skills:['Phonics, letter sounds & blending readiness','Early reading & vocabulary','Number concepts & logical thinking','Writing readiness, expression & life skills']},
  'UKG': {age:'UKG · 5+ YEARS', title:'Ready for their next chapter.', description:'Children develop the foundations for a confident transition into primary school, supported by a balance of academics, creativity and growing independence.', image:'story-v2.jpg', alt:'Illustrative group reading activity with children and teacher', skills:['Reading fluency, phonics & blending','Sentence formation & writing development','Number operations & logical reasoning','General awareness & confident communication']}
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.querySelector('#programme-panel');
let animationTimer;
function selectProgramme(tab, focus = false) {
  const data = programmes[tab.dataset.programme];
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  panel.setAttribute('aria-labelledby', tab.id);
  document.querySelector('#programme-age').textContent = data.age;
  document.querySelector('#programme-title').textContent = data.title;
  document.querySelector('#programme-description').textContent = data.description;
  document.querySelector('#programme-skills').replaceChildren(...data.skills.map(skill => { const li = document.createElement('li'); li.textContent = skill; return li; }));
  const photo = document.querySelector('#programme-image');
  photo.src = 'assets/' + data.image;
  photo.srcset = 'assets/' + data.image.replace('.jpg', '-small.jpg') + ' 768w, assets/' + data.image + (data.image === 'hero-v2.jpg' ? ' 1536w' : ' 1448w');
  photo.alt = data.alt;
  panel.querySelector('figcaption').textContent = 'The ' + tab.dataset.programme + ' journey · Illustrative scene';
  panel.classList.remove('changing');
  void panel.offsetWidth;
  panel.classList.add('changing');
  clearTimeout(animationTimer);
  animationTimer = setTimeout(() => panel.classList.remove('changing'), 600);
  if(focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProgramme(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { e.preventDefault(); selectProgramme(tabs[next], true); }
  });
});
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
