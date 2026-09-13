import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');
const siteUrl = 'https://kabira-international-zirakpur.ritarattan17.chatgpt.site';

const pages = [
  {
    file: 'index.html',
    key: 'home',
    label: 'Home',
    title: 'Kabira The International School | Preschool & Daycare Zirakpur',
    description: 'Kabira is a nurturing preschool and daycare in Zirakpur for Pre-Nursery to UKG, led by Dr. Rita Rattan with nearly 28 years in education.',
  },
  {
    file: 'experience.html',
    key: 'experience',
    label: 'The Kabira Experience',
    title: 'Programs, Daycare & Campus | Kabira School Zirakpur',
    description: 'Explore Kabira’s Pre-Nursery to UKG programs, daycare, learning approach, values, campus plan, and leadership in Zirakpur.',
  },
  {
    file: 'admissions.html',
    key: 'admissions',
    label: 'Admissions & Visit',
    title: 'Preschool Admissions 2026–27 | Kabira Zirakpur',
    description: 'Admissions are open for Pre-Nursery, Nursery, LKG, UKG, and daycare at Kabira in Zirakpur. Review the process and plan a school visit.',
  },
];

const programs = [
  {
    id: 'pre-nursery',
    name: 'Pre-Nursery',
    age: '2+',
    promise: 'Comfort, communication, and joyful discovery.',
    copy: 'A gentle introduction to school where children settle, connect, communicate, and explore through play.',
    items: ['Listening and vocabulary', 'Sensory exploration', 'Stories, rhymes, and movement', 'Motor development', 'Socialisation and self-help'],
  },
  {
    id: 'nursery',
    name: 'Nursery',
    age: '3+',
    promise: 'Curiosity, early concepts, and growing independence.',
    copy: 'Children become increasingly expressive while early language, number concepts, creativity, and relationships take shape.',
    items: ['Pre-reading awareness', 'Early numeracy', 'Conversation and vocabulary', 'Art, music, and movement', 'Social-emotional development'],
  },
  {
    id: 'lkg',
    name: 'LKG',
    age: '4+',
    promise: 'Phonics, number sense, and confident expression.',
    copy: 'LKG strengthens school readiness while keeping learning active, creative, and connected to real experiences.',
    items: ['Phonics and letter sounds', 'Blending readiness', 'Number concepts and reasoning', 'Writing readiness', 'Communication and life skills'],
  },
  {
    id: 'ukg',
    name: 'UKG',
    age: '5+',
    promise: 'Strong foundations for a smooth move to primary school.',
    copy: 'Children develop greater fluency, independence, reasoning, and confidence without losing the joy of discovery.',
    items: ['Reading and blending', 'Sentence and writing development', 'Number operations', 'Environmental awareness', 'Creativity and independence'],
  },
];

const faqs = [
  ['Which classes are currently available?', 'Current admissions are for Pre-Nursery, Nursery, LKG, UKG, and Daycare.'],
  ['What are the preschool timings?', 'Regular preschool timing is approximately 9:00 AM–12:30 PM.'],
  ['What are the daycare timings?', 'Daycare is available from 7:00 AM–7:00 PM.'],
  ['Does Kabira focus only on academics?', 'No. Language and numeracy are balanced with creativity, movement, confidence, social-emotional growth, life skills, and values.'],
  ['Is phonics part of the program?', 'Yes. Age-appropriate phonics and language development are integrated into the early-years journey.'],
  ['Can families visit before deciding?', 'Yes. A school visit is encouraged so families can understand the approach, discuss their child’s needs, and ask questions before admission.'],
];

function href(key) {
  return pages.find((page) => page.key === key).file;
}

function action(url, label, tone = 'primary') {
  return `<a class="button button-${tone}" href="${url}"><span>${label}</span><b aria-hidden="true">→</b></a>`;
}

function eyebrow(text) {
  return `<p class="eyebrow"><i aria-hidden="true"></i>${text}</p>`;
}

function navLink(page, active) {
  return `<a href="${page.file}"${page.key === active ? ' class="is-active" aria-current="page"' : ''}>${page.label}</a>`;
}

function header(active) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <div class="topline">
    <div class="shell topline-inner"><span>Admissions open for 2026–27</span><a href="admissions.html#visit">Plan a school visit <b aria-hidden="true">→</b></a></div>
  </div>
  <header class="site-header" data-header>
    <div class="shell header-inner">
      <a class="brand" href="index.html" aria-label="Kabira The International School home">
        <img src="assets/kabira-mark.jpg" alt="" width="512" height="512" fetchpriority="high">
        <span><strong>Kabira</strong><small>The International School</small></span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${pages.map((page) => navLink(page, active)).join('')}
        ${action('admissions.html#visit', 'Plan a visit', 'small')}
      </nav>
      <div class="mobile-actions">
        <a class="admission-pill" href="admissions.html">Admissions</a>
        <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-menu" data-menu-button><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" hidden data-mobile-menu>
    <div class="shell mobile-menu-inner">
      <p>Explore Kabira</p>
      <nav aria-label="Mobile navigation">${[pages[2], pages[1], pages[0]].map((page) => navLink(page, active)).join('')}</nav>
      <div class="mobile-menu-note"><strong>Pre-Nursery to UKG · Daycare</strong><span>Modern learning with Indian values in Zirakpur.</span>${action('admissions.html#visit', 'Plan a school visit', 'light')}</div>
    </div>
  </div>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="shell footer-main">
      <div class="footer-intro">
        <a class="brand brand-footer" href="index.html"><img src="assets/kabira-mark.jpg" alt="" width="512" height="512"><span><strong>Kabira</strong><small>The International School</small></span></a>
        <p>A nurturing preschool and daycare in Zirakpur where children learn with joy, grow with confidence, and belong from the beginning.</p>
        <span class="motto">Grow <i></i> Learn <i></i> Bloom</span>
      </div>
      <div><h2>Explore</h2><a href="experience.html#programs">Programs</a><a href="experience.html#daycare">Daycare</a><a href="experience.html#campus">Campus</a><a href="experience.html#leadership">Leadership</a></div>
      <div><h2>Begin</h2><a href="admissions.html">Admissions 2026–27</a><a href="admissions.html#process">Admission process</a><a href="admissions.html#visit">Plan a school visit</a><a href="admissions.html#directions">Directions</a></div>
      <div><h2>Visit Kabira</h2><address>#1105, Dashmesh Colony<br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address></div>
    </div>
    <div class="shell footer-bottom"><span>© 2026 Kabira The International School</span><span>Pre-Nursery · Nursery · LKG · UKG · Daycare</span></div>
  </footer>
  <nav class="mobile-dock" aria-label="Quick actions"><a href="experience.html#programs"><small>Discover</small><strong>Programs</strong></a><a href="admissions.html#visit"><small>Next step</small><strong>Plan a visit</strong></a></nav>`;
}

const imageDimensions = {
  'hero-v2': [1536, 1024],
  'nature-v2': [1448, 1086],
  'story-v2': [1448, 1086],
  'uniform-v2': [1536, 1024],
};

function visual(name, alt, { eager = false, caption = '', className = '' } = {}) {
  const [width, height] = imageDimensions[name];
  return `<figure class="visual ${className}"><picture><source media="(max-width: 720px)" srcset="assets/${name}-small.jpg"><img src="assets/${name}.jpg" alt="${alt}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
}

function portrait({ eager = false, caption = true } = {}) {
  return `<figure class="portrait"><picture><source media="(max-width: 720px)" srcset="assets/dr-rita-ratan-small.jpg"><img src="assets/dr-rita-ratan.jpg" alt="Dr. Rita Rattan, Director and Principal of Kabira The International School" width="1200" height="1500" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>${caption ? '<figcaption><strong>Dr. Rita Rattan</strong><span>Director & Principal</span></figcaption>' : ''}</figure>`;
}

function sectionHeading(kicker, title, copy = '') {
  return `<div class="section-heading" data-reveal>${eyebrow(kicker)}<h2>${title}</h2>${copy ? `<p>${copy}</p>` : ''}</div>`;
}

function finalCta(title, copy) {
  return `<section class="final-cta"><div class="shell final-cta-inner" data-reveal><div>${eyebrow('Admissions 2026–27')}<h2>${title}</h2><p>${copy}</p></div><div>${action('admissions.html#visit', 'Plan a school visit', 'light')}${action('admissions.html', 'View admissions', 'ghost-light')}</div></div><span class="weave-rule" aria-hidden="true"></span></section>`;
}

function home() {
  return `<section class="home-hero">
    <div class="shell hero-grid">
      <div class="hero-copy" data-reveal>
        ${eyebrow('Preschool & daycare · Zirakpur')}
        <h1>Where little minds feel safe enough to <em>bloom.</em></h1>
        <p class="lead">Kabira brings purposeful early learning, attentive care, and Indian values together for children from Pre-Nursery to UKG.</p>
        <div class="hero-actions">${action('admissions.html#visit', 'Plan a school visit')}${action('experience.html#programs', 'Explore programs', 'outline')}</div>
        <div class="hero-proof"><span><b>Admissions open</b>Session 2026–27</span><span><b>Led with experience</b>Nearly 28 years in education</span></div>
      </div>
      <div class="hero-media" data-reveal data-delay="1">${visual('hero-v2', 'Young children learning together in Kabira navy, green, and white uniforms', { eager: true, caption: 'Kabira learning experience · illustrative visual' })}<div class="hero-note"><strong>Learn · Grow · Belong</strong><span>A warm start for a bright future.</span></div></div>
    </div>
    <span class="weave-rule" aria-hidden="true"></span>
  </section>

  <section class="trust-band" aria-label="Kabira at a glance"><div class="shell trust-grid"><div data-reveal><strong>Pre-Nursery–UKG</strong><span>Age-led early-years programs</span></div><div data-reveal data-delay="1"><strong>7 AM–7 PM</strong><span>Extended daycare</span></div><div data-reveal data-delay="2"><strong>Nearly 28 years</strong><span>Educational leadership</span></div><div data-reveal data-delay="3"><strong>Modern + rooted</strong><span>Learning with Indian values</span></div></div></section>

  <section class="section choose-section">
    <div class="shell choose-layout">
      <div class="choose-visual" data-reveal>${visual('story-v2', 'A caring educator reading and talking with young children', { caption: 'Stories, relationships, and communication · illustrative visual' })}<p><strong>Care before performance.</strong> Children learn more freely when they feel understood.</p></div>
      <div><div class="section-heading compact" data-reveal>${eyebrow('Why parents choose Kabira')}<h2>A strong foundation begins with how a child feels.</h2><p>Kabira looks beyond worksheets to the complete early-years experience.</p></div>
        <div class="reason-grid"><article data-reveal><span>01</span><h3>Care comes first</h3><p>Warm, predictable routines help children feel secure and ready to participate.</p></article><article data-reveal data-delay="1"><span>02</span><h3>Every child is seen</h3><p>Guidance respects each child’s pace, personality, and emerging strengths.</p></article><article data-reveal data-delay="2"><span>03</span><h3>Play has purpose</h3><p>Language, numeracy, movement, and creativity grow through active experience.</p></article><article data-reveal data-delay="3"><span>04</span><h3>Values live daily</h3><p>Kindness, gratitude, respect, and responsibility become everyday habits.</p></article></div>
      </div>
    </div>
  </section>

  <section class="section program-preview" id="programs">
    <div class="shell"><div class="heading-row">${sectionHeading('Programs', 'The right beginning for every age.', 'Each stage adds just enough challenge while preserving play, movement, imagination, and belonging.')}${action('experience.html#programs', 'Compare programs', 'outline')}</div>
      <div class="program-grid">${programs.map((program, index) => `<a href="experience.html#${program.id}" class="program-card" data-reveal data-delay="${index % 4}"><span class="program-age">${program.age}</span><small>${program.name}</small><h3>${program.promise}</h3><p>${program.copy}</p><b aria-hidden="true">→</b></a>`).join('')}</div>
      <a class="daycare-strip" href="experience.html#daycare" data-reveal><span><small>Daycare · 7:00 AM–7:00 PM</small><strong>A caring rhythm beyond preschool hours.</strong></span><span>Explore daycare <b aria-hidden="true">→</b></span></a>
    </div>
  </section>

  <section class="section leadership-home">
    <div class="shell leadership-grid">
      <div data-reveal>${portrait()}</div>
      <div class="leadership-copy" data-reveal data-delay="1">${eyebrow('Experienced leadership')}<h2>Led with experience. Built with heart.</h2><blockquote>“Every child needs to feel loved and understood before meaningful learning can begin.”</blockquote><p>Dr. Rita Rattan brings nearly 28 years of experience in teaching, administration, and school leadership to Kabira.</p><p>As Director & Principal, her promise is to combine the warmth of a home with the structure and thoughtfulness of a professionally guided school.</p>${action('experience.html#leadership', 'Read her message', 'text')}</div>
    </div>
  </section>

  <section class="section experience-preview">
    <div class="shell"><div class="heading-row">${sectionHeading('The Kabira experience', 'Learning moves beyond books.', 'Children learn through conversation, stories, nature, creativity, movement, friendship, and simple responsibilities.')}${action('experience.html#learning', 'Explore the experience', 'outline')}</div>
      <div class="visual-story-grid">
        <div class="large-visual" data-reveal>${visual('nature-v2', 'Children discovering plants with an educator', { caption: 'Nature-led discovery · illustrative visual' })}<div><span>Observe</span><strong>Curiosity begins with noticing.</strong></div></div>
        <div class="small-visual" data-reveal data-delay="1">${visual('story-v2', 'Children listening to an educator during a story', { caption: 'Language and imagination · illustrative visual' })}<div><span>Express</span><strong>Stories give children words for their world.</strong></div></div>
        <div class="campus-note" data-reveal data-delay="2"><span>Campus & care</span><h3>Designed around little learners.</h3><p>Welcoming classrooms, thoughtful activity zones, safe movement, and calmer spaces are being shaped with young children in mind.</p>${action('experience.html#campus', 'See the campus plan', 'text')}</div>
      </div>
    </div>
  </section>

  <section class="section kabira-story">
    <div class="shell story-grid">
      <div data-reveal>${eyebrow('The story behind Kabira')}<h2>Every strong future begins with a few careful threads.</h2><p>The name Kabira draws inspiration from the timeless wisdom associated with Sant Kabir: simplicity, truth, compassion, equality, and self-awareness.</p><p>At Kabira, these values are woven quietly into stories, classroom choices, friendships, and everyday responsibilities.</p>${action('experience.html#philosophy', 'Discover our philosophy', 'text')}</div>
      <div class="values-panel" data-reveal data-delay="1"><span class="thread-lines" aria-hidden="true"></span><h3>Small values.<br>Lifelong lessons.</h3><ul><li>Kindness</li><li>Honesty</li><li>Sharing</li><li>Gratitude</li><li>Respect</li><li>Compassion</li></ul></div>
    </div>
  </section>

  <section class="section open-trust"><div class="shell open-trust-grid"><div data-reveal>${eyebrow('Trust starts with openness')}<h2>See the school. Meet the people. Ask everything.</h2><p>Your first visit should give you clarity without pressure. Understand the approach, discuss your child’s needs, and make an informed choice.</p></div><ol data-reveal data-delay="1"><li><span>01</span><strong>Meet the leadership</strong></li><li><span>02</span><strong>Understand the program</strong></li><li><span>03</span><strong>Explore the environment</strong></li></ol></div></section>
  ${finalCta('Come see if Kabira feels right for your child.', 'Visit us in Zirakpur and begin a thoughtful conversation about their first school years.')}`;
}

function experience() {
  return `<section class="inner-hero"><div class="shell inner-hero-grid"><div data-reveal>${eyebrow('The Kabira Experience')}<h1>Everything a little learner needs in one thoughtful school day.</h1><p class="lead">A closer look at our programs, learning rhythm, daycare, environment, values, and experienced leadership.</p><div class="hero-actions">${action('#programs', 'Explore programs')}${action('admissions.html#visit', 'Plan a visit', 'outline')}</div></div><div data-reveal data-delay="1">${visual('nature-v2', 'An educator guiding young children during a nature activity', { eager: true, caption: 'Active, caring learning · illustrative visual' })}</div></div><span class="weave-rule" aria-hidden="true"></span></section>
  <nav class="section-nav" aria-label="On this page"><div class="shell"><a href="#approach">Our approach</a><a href="#programs">Programs</a><a href="#learning">Learning day</a><a href="#daycare">Daycare</a><a href="#campus">Campus</a><a href="#leadership">Leadership</a></div></nav>

  <section class="section approach-section" id="approach"><div class="shell approach-grid"><div data-reveal>${eyebrow('Our approach')}<h2>Childhood should never be rushed.</h2><p class="lead">Academic preparation matters. It becomes more meaningful when balanced with creativity, movement, emotional security, social confidence, and values.</p></div><div class="approach-copy" data-reveal data-delay="1"><p>Kabira The International School is being established in Zirakpur under Bhattacharya Educational Trust to provide nurturing, professionally guided early education.</p><p>We believe the early years shape much more than readiness for the next class. They shape how children communicate, make friends, approach challenges, understand themselves, and respond to learning.</p></div></div>
    <div class="shell motto-grid"><article data-reveal><span>Grow</span><h3>With confidence</h3><p>Through relationships, movement, self-help, and small responsibilities.</p></article><article data-reveal data-delay="1"><span>Learn</span><h3>With curiosity</h3><p>Through questions, stories, conversation, exploration, and purposeful play.</p></article><article data-reveal data-delay="2"><span>Bloom</span><h3>In their own way</h3><p>With guidance that respects each child’s pace, personality, and strengths.</p></article></div>
  </section>

  <section class="section programs-section" id="programs"><div class="shell">${sectionHeading('Pre-Nursery to UKG', 'The right challenge, at the right age.', 'Age ranges are guides. Suitable placement is confirmed during the admission conversation.')}
    <div class="program-detail-list">${programs.map((program, index) => `<article id="${program.id}" class="program-detail" data-reveal><header><span>${program.age}</span><div><small>${program.name}</small><h3>${program.promise}</h3></div></header><div><p>${program.copy}</p><ul>${program.items.map((item) => `<li>${item}</li>`).join('')}</ul></div><a href="admissions.html#visit">Discuss this stage <b aria-hidden="true">→</b></a></article>`).join('')}</div>
    <div class="uniform-feature" data-reveal><div>${eyebrow('Kabira identity')}<h2>A smart, calm uniform palette.</h2><p>Navy, green, and white create a consistent school identity while keeping children comfortable and ready to move.</p></div>${visual('uniform-v2', 'Complete Kabira summer and winter uniform visual shown without cropping', { caption: 'Kabira uniform visual · shown in full' })}</div>
  </div></section>

  <section class="section learning-section" id="learning"><div class="shell"><div class="heading-row">${sectionHeading('Learning beyond books', 'A familiar rhythm. Something new every day.', 'Children move between connection, concepts, active play, creative expression, and calm reflection.')}</div>
    <ol class="day-flow"><li data-reveal><span>01</span><h3>Arrive & belong</h3><p>A warm welcome, free exploration, and time to connect.</p></li><li data-reveal data-delay="1"><span>02</span><h3>Discover & discuss</h3><p>Circle time and interactive language, number, or theme concepts.</p></li><li data-reveal data-delay="2"><span>03</span><h3>Move & share</h3><p>Snack, friendship, movement, and active play.</p></li><li data-reveal data-delay="3"><span>04</span><h3>Create & reflect</h3><p>Stories, music, art, role play, and a positive goodbye.</p></li></ol>
    <div class="strand-grid"><article data-reveal><h3>Phonics & communication</h3><p>Listening, vocabulary, pronunciation, confidence, and early literacy.</p></article><article data-reveal data-delay="1"><h3>Thinking & numeracy</h3><p>Number concepts, patterns, comparison, problem-solving, and reasoning.</p></article><article data-reveal data-delay="2"><h3>Art, music & movement</h3><p>Coordination, rhythm, imagination, confidence, and creative expression.</p></article><article data-reveal data-delay="3"><h3>Nature & sensory learning</h3><p>Observation and discovery through touch, sight, sound, and movement.</p></article><article data-reveal><h3>Physical development</h3><p>Balance, coordination, active play, movement, and healthy habits.</p></article><article data-reveal data-delay="1"><h3>Social-emotional growth</h3><p>Understanding feelings, friendships, cooperation, and empathy.</p></article><article data-reveal data-delay="2"><h3>Life skills</h3><p>Independence through simple routines and everyday responsibilities.</p></article><article data-reveal data-delay="3"><h3>Culture & values</h3><p>Respect, gratitude, kindness, and meaningful Indian traditions.</p></article></div>
  </div></section>

  <section class="section daycare-section" id="daycare"><div class="shell daycare-layout"><div data-reveal>${visual('story-v2', 'A teacher sharing a story with children in a caring early-years setting', { caption: 'Caring engagement · illustrative visual' })}</div><div data-reveal data-delay="1">${eyebrow('Daycare · 7:00 AM–7:00 PM')}<h2>A caring rhythm beyond preschool hours.</h2><p>Daycare is designed to feel like a familiar extension of the child’s day, with a balanced rhythm of play, rest, stories, creativity, and individual attention.</p><ul class="feature-list"><li>Comfortable rest time</li><li>Supervised play and indoor activities</li><li>Creative engagement and storytelling</li><li>Meal and snack support</li><li>Homework assistance where age-appropriate</li><li>Calm arrival and departure transitions</li></ul>${action('admissions.html#visit', 'Discuss daycare during a visit', 'light')}</div></div></section>

  <section class="section campus-section" id="campus"><div class="shell">${sectionHeading('Campus & facilities', 'A calm environment, planned around little learners.', 'Kabira’s spaces are being shaped to feel welcoming, purposeful, child-friendly, and free from visual overload.')}
    <div class="campus-layout"><div class="campus-spaces"><article data-reveal><span>01</span><h3>Welcoming classrooms</h3><p>Child-scale furniture and flexible learning corners.</p></article><article data-reveal data-delay="1"><span>02</span><h3>Activity & play areas</h3><p>Space for movement, sensory learning, and creativity.</p></article><article data-reveal data-delay="2"><span>03</span><h3>Daycare rest space</h3><p>A calmer zone for rest and gentle transitions.</p></article><article data-reveal data-delay="3"><span>04</span><h3>Child-friendly routines</h3><p>Age-aware washrooms, movement, and supervised arrival.</p></article></div><div data-reveal>${visual('hero-v2', 'Children collaborating in a calm early-years classroom setting', { caption: 'Intended learning atmosphere · illustrative visual' })}<p class="visual-note">Real campus photography will replace illustrative visuals as spaces are completed.</p></div></div>
    <div class="safety-band" data-reveal><strong>Health, safety & hygiene</strong><span>Controlled entry</span><span>Supervised dispersal</span><span>Clean learning spaces</span><span>Child-safe movement</span><span>Parent communication</span></div>
  </div></section>

  <section class="section philosophy-section" id="philosophy"><div class="shell story-grid"><div data-reveal>${eyebrow('The story behind “Kabira”')}<h2>A thread of wisdom. A modern beginning.</h2><p>The name draws inspiration from values associated with Sant Kabir: simplicity, truth, compassion, equality, wisdom, and self-awareness.</p><p>Values are introduced gently through stories, activities, conversations, friendships, and everyday classroom choices.</p><ul class="value-chips"><li>Kindness</li><li>Honesty</li><li>Sharing</li><li>Gratitude</li><li>Respect</li><li>Patience</li><li>Compassion</li><li>Responsibility</li></ul></div><div class="future-card" data-reveal data-delay="1"><span>Long-term vision</span><h3>A preschool today. A school designed to grow thoughtfully.</h3><p>Kabira’s vision is to add one higher class progressively each academic year, subject to enrolment, infrastructure readiness, qualified staff, statutory requirements, and permissions.</p><p><strong>Current admissions:</strong> Pre-Nursery, Nursery, LKG, UKG, and Daycare.</p></div></div></section>

  <section class="section principal-section" id="leadership"><div class="shell leadership-grid"><div data-reveal>${portrait()}</div><article data-reveal data-delay="1">${eyebrow('From the Director & Principal')}<h2>Nearly three decades in education. One deeply personal vision.</h2><p>Dear Parents,</p><p>For nearly three decades, education has been more than my profession. It has been my passion and my journey. One lesson has remained constant: every child needs to feel loved and understood before meaningful learning can begin.</p><p>Kabira has been created from that belief. I want children to enter school happily, parents to leave with confidence, and teachers to become caring facilitators and emotional anchors.</p><p>We aim to combine the warmth of home with the structure and quality of a professionally guided school. Our children should speak confidently, think independently, respect others, appreciate their culture, and ask questions without fear.</p><p>I warmly invite your family to visit Kabira and experience the vision behind it.</p><p class="signature">Warm regards,<br><strong>Dr. Rita Rattan</strong><br><span>Director & Principal</span></p></article></div></section>
  ${finalCta('Experience the vision in person.', 'Visit Kabira to discuss your child’s stage, see the planned environment, and ask what matters to your family.')}`;
}

function admissions() {
  const mapQuery = encodeURIComponent('#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road, Zirakpur, Punjab');
  return `<section class="admissions-hero"><div class="shell admissions-hero-grid"><div data-reveal>${eyebrow('Admissions open · 2026–27')}<h1>A calm, clear start for your family.</h1><p class="lead">Explore the right program, visit the school, ask your questions, and make an informed decision.</p><div class="hero-actions">${action('#visit', 'Plan a school visit')}${action('#process', 'See the admission process', 'outline-light')}</div></div><div class="intake-card" data-reveal data-delay="1"><span>Currently welcoming enquiries for</span>${programs.map((program) => `<strong>${program.name}<b>${program.age}</b></strong>`).join('')}<strong>Daycare<b>7 AM–7 PM</b></strong></div></div><span class="weave-rule" aria-hidden="true"></span></section>

  <section class="section age-guide"><div class="shell">${sectionHeading('Find the right starting point', 'A simple guide to current programs.', 'Age ranges are guides. Placement is discussed with the family during admission.')}<div class="age-grid">${programs.map((program, index) => `<a href="experience.html#${program.id}" data-reveal data-delay="${index}"><strong>${program.age}</strong><span>${program.name}</span><p>${program.promise}</p><b aria-hidden="true">→</b></a>`).join('')}</div></div></section>

  <section class="section process-section" id="process"><div class="shell">${sectionHeading('Five simple steps', 'From first question to first school day.', 'The process helps the family and the school understand what the child needs.')}<ol class="process-list"><li data-reveal><span>01</span><h3>Explore</h3><p>Review the programs and age guidance.</p></li><li data-reveal data-delay="1"><span>02</span><h3>Visit</h3><p>Experience the environment and meet the team.</p></li><li data-reveal data-delay="2"><span>03</span><h3>Talk</h3><p>Discuss readiness, routines, and program fit.</p></li><li data-reveal data-delay="3"><span>04</span><h3>Register</h3><p>Complete the form and requested documents.</p></li><li data-reveal><span>05</span><h3>Begin</h3><p>Prepare for a warm first day at Kabira.</p></li></ol></div></section>

  <section class="section visit-conversation"><div class="shell conversation-grid"><div data-reveal>${eyebrow('Make the visit useful')}<h2>Bring the questions that matter to your family.</h2><p>A thoughtful conversation should help you understand fit, routine, expectations, and next steps.</p></div><ul data-reveal data-delay="1"><li>Age and developmental readiness</li><li>Settling-in needs</li><li>Preschool or daycare routine</li><li>Learning approach and values</li><li>Fees, documents, and next steps</li></ul></div></section>

  <section class="section documents-faq"><div class="shell documents-faq-grid"><div><div class="section-heading compact" data-reveal>${eyebrow('Documents')}<h2>What families may be asked to provide.</h2><p>The final list is confirmed during the admission conversation.</p></div><ul class="documents" data-reveal><li>Child’s birth certificate</li><li>Child and parent photographs</li><li>Address proof</li><li>Aadhaar copies, where applicable</li><li>Previous school record, if relevant</li><li>Pertinent medical information</li></ul></div><div><div class="section-heading compact" data-reveal>${eyebrow('Admissions FAQ')}<h2>Clear answers before you visit.</h2></div><div class="accordion" data-accordion>${faqs.map(([question, answer]) => `<details><summary>${question}<span aria-hidden="true"></span></summary><p>${answer}</p></details>`).join('')}</div></div></div></section>

  <section class="section visit-section" id="visit"><div class="shell visit-grid"><div data-reveal>${eyebrow('Plan your school visit')}<h2>A few details make the conversation more useful.</h2><p>Create a simple visit plan for your family. Your entries stay in this browser and are not sent or stored by the website.</p><div class="address-card"><span>Visit Kabira</span><strong>Kabira The International School</strong><address>#1105, Dashmesh Colony<br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address><div><p><b>Preschool</b>Approx. 9:00 AM–12:30 PM</p><p><b>Daycare</b>7:00 AM–7:00 PM</p></div></div></div>
    <form class="visit-form" data-visit-form data-reveal data-delay="1"><div class="field-row"><label><span>Parent’s name</span><input name="parentName" type="text" autocomplete="name" required placeholder="Your name"></label><label><span>Child’s name</span><input name="childName" type="text" required placeholder="Child’s name"></label></div><div class="field-row"><label><span>Child’s age</span><select name="childAge" required><option value="">Select age</option><option>Under 2 years</option><option>2 years</option><option>3 years</option><option>4 years</option><option>5 years</option><option>6+ years</option></select></label><label><span>Interested in</span><select name="program" required><option value="">Select program</option><option>Pre-Nursery</option><option>Nursery</option><option>LKG</option><option>UKG</option><option>Daycare</option><option>Program guidance</option></select></label></div><label><span>Preferred visit date</span><input name="visitDate" type="date" required></label><label><span>What would you like to discuss? <small>Optional</small></span><textarea name="questions" rows="4" placeholder="Settling in, learning approach, daycare, fees…"></textarea></label><button class="button button-primary" type="submit"><span>Create my visit plan</span><b aria-hidden="true">→</b></button><p class="form-note">This planner works on your device only. It does not transmit personal information.</p><div class="visit-summary" aria-live="polite" hidden data-visit-summary></div></form>
  </div></section>

  <section class="section directions-section" id="directions"><div class="shell directions-grid"><div class="map-frame" data-reveal><iframe title="Map showing the Kabira school area in Zirakpur" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><div data-reveal data-delay="1">${eyebrow('Directions')}<h2>Patiala Road, Zirakpur.</h2><address><strong>#1105, Dashmesh Colony</strong><br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address><p>Use the map to review the route before your visit.</p><a class="button button-outline" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener"><span>Open in Google Maps</span><b aria-hidden="true">↗</b></a></div></div></section>`;
}

const content = { home, experience, admissions };

function schema(page) {
  const graph = [{
    '@type': ['Preschool', 'EducationalOrganization'],
    name: 'Kabira The International School',
    alternateName: 'Kabira International',
    slogan: 'Grow · Learn · Bloom',
    url: `${siteUrl}/${page.file === 'index.html' ? '' : page.file}`,
    logo: `${siteUrl}/assets/kabira-logo-hd.jpg`,
    image: `${siteUrl}/assets/hero-v2.jpg`,
    description: page.description,
    employee: { '@type': 'Person', name: 'Dr. Rita Rattan', jobTitle: 'Director & Principal' },
    address: { '@type': 'PostalAddress', streetAddress: '#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road', addressLocality: 'Zirakpur', addressRegion: 'Punjab', addressCountry: 'IN' },
    areaServed: { '@type': 'City', name: 'Zirakpur' },
    parentOrganization: { '@type': 'Organization', name: 'Bhattacharya Educational Trust' },
  }];
  if (page.key === 'admissions') graph.push({ '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function layout(page) {
  const canonical = `${siteUrl}/${page.file === 'index.html' ? '' : page.file}`;
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="theme-color" content="#09285a">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Kabira The International School">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/hero-v2.jpg">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/kabira-mark.jpg" type="image/jpeg">
  <link rel="manifest" href="site.webmanifest">
  ${page.key === 'home' ? '<link rel="preload" as="image" href="assets/hero-v2-small.jpg" media="(max-width: 720px)"><link rel="preload" as="image" href="assets/hero-v2.jpg" media="(min-width: 721px)">' : ''}
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">${schema(page)}</script>
  <script src="app.js" defer></script>
</head>
<body data-page="${page.key}">
  ${header(page.key)}
  <main id="main">${content[page.key]()}</main>
  ${footer()}
</body>
</html>`;
}

await mkdir(dist, { recursive: true });
for (const obsolete of ['about.html', 'programs.html', 'daycare.html', 'campus.html', 'principal.html', 'contact.html']) {
  await rm(path.join(dist, obsolete), { force: true });
}
for (const page of pages) {
  const html = layout(page).replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
  await writeFile(path.join(dist, page.file), html, 'utf8');
}
await writeFile(path.join(dist, 'styles.css'), await readFile(path.join(src, 'final.css'), 'utf8'), 'utf8');
await writeFile(path.join(dist, 'app.js'), await readFile(path.join(src, 'final.js'), 'utf8'), 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${siteUrl}/${page.file === 'index.html' ? '' : page.file}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({ name: 'Kabira The International School', short_name: 'Kabira', start_url: './index.html', display: 'standalone', background_color: '#f8f3e9', theme_color: '#09285a', icons: [{ src: 'assets/kabira-mark.jpg', sizes: '512x512', type: 'image/jpeg' }] }, null, 2), 'utf8');

console.log(`Built final ${pages.length}-page Kabira website in ${dist}`);
