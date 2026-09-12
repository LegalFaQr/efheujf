const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open));nav.classList.toggle('open',open);});
nav.addEventListener('click', e => {if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
const programmes = {
  'Pre-Nursery': {age:'2+ YEARS · A GENTLE BEGINNING',description:'Comfort, confidence and joyful exploration come first. Children gradually settle into a caring school environment and build the skills to discover a little more each day.',skills:['Listening, vocabulary and communication','Colours, shapes and sensory exploration','Fine and gross motor development','Stories, rhymes, music and movement','First friendships and simple self-help skills']},
  'Nursery': {age:'3+ YEARS · CURIOSITY TAKES ROOT',description:'As children become more expressive, they begin to make connections through hands-on learning, conversation and creative activities.',skills:['Pre-reading and phonological awareness','Early numeracy and environmental awareness','Art, storytelling, music and movement','Conversation and vocabulary development','Social-emotional learning and motor skills']},
  'LKG': {age:'4+ YEARS · CONFIDENCE IN EVERY STEP',description:'A play-based approach strengthens academic readiness while preserving the joy of discovery. Children build language, reasoning and everyday independence.',skills:['Phonics, letter sounds and blending readiness','Early reading and vocabulary','Number concepts and logical thinking','Writing readiness and creative expression','Communication, general awareness and life skills']},
  'UKG': {age:'5+ YEARS · READY FOR WHAT COMES NEXT',description:'Children develop the foundations for a confident transition into primary school, supported by a balance of academics, creativity and growing independence.',skills:['Reading fluency, phonics and blending','Sentence formation and writing development','Number operations and logical reasoning','Environmental awareness and general knowledge','Confident communication and independence']}
};
const programmeDialog = document.querySelector('#programme-dialog');
document.querySelectorAll('.programme-more').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.programme; const data=programmes[name];
  document.querySelector('#programme-title').textContent=name;
  document.querySelector('#programme-age').textContent=data.age;
  document.querySelector('#programme-description').textContent=data.description;
  document.querySelector('#programme-skills').replaceChildren(...data.skills.map(skill=>{const item=document.createElement('li');item.textContent=skill;return item;}));
  programmeDialog.showModal();document.body.classList.add('dialog-open');
}));
document.querySelector('#view-uniform').addEventListener('click',()=>{document.querySelector('#uniform-dialog').showModal();document.body.classList.add('dialog-open');});
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
});
document.querySelector('#programme-visit').addEventListener('click',()=>programmeDialog.close());
