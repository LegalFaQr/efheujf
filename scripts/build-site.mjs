import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const src = path.join(root, 'src');
const siteUrl = 'https://kabira-international-zirakpur.ritarattan17.chatgpt.site';

const pages = [
  { file: 'index.html', key: 'home', label: 'Home', title: 'Kabira The International School | Preschool Zirakpur', description: 'Discover Kabira in Zirakpur: Pre-Nursery to UKG, extended daycare, modern early learning, Indian values and experienced leadership.' },
  { file: 'about.html', key: 'about', label: 'About', title: 'About Kabira The International School, Zirakpur', description: 'Learn about Kabira’s Grow · Learn · Bloom philosophy, values inspired by Sant Kabir and vision for thoughtful early education in Zirakpur.' },
  { file: 'programs.html', key: 'programs', label: 'Programs', title: 'Preschool Programs in Zirakpur | Kabira School', description: 'Compare Pre-Nursery, Nursery, LKG and UKG, with age guidance and a child-centred approach to language, numeracy, creativity and confidence.' },
  { file: 'daycare.html', key: 'daycare', label: 'Daycare', title: 'Daycare in Zirakpur | Kabira International School', description: 'Explore Kabira’s extended daycare in Zirakpur, available from 7:00 AM to 7:00 PM with supervised play, rest and age-appropriate activities.' },
  { file: 'admissions.html', key: 'admissions', label: 'Admissions', title: 'Preschool Admissions 2026–27 | Kabira Zirakpur', description: 'Admissions are open for Pre-Nursery, Nursery, LKG, UKG and daycare at Kabira in Zirakpur. Review the process and plan a visit.' },
  { file: 'campus.html', key: 'campus', label: 'Campus', title: 'Preschool Campus & Facilities | Kabira Zirakpur', description: 'Explore Kabira’s planned child-friendly classrooms, activity areas, daycare rest space and calm navy, green and white campus design.' },
  { file: 'principal.html', key: 'principal', label: 'Principal', title: 'Dr. Rita Ratan, Principal | Kabira School Zirakpur', description: 'Meet Dr. Rita Ratan, Kabira’s educational leader, with nearly 28 years of experience in teaching, administration and school leadership.' },
  { file: 'contact.html', key: 'contact', label: 'Contact', title: 'Visit Kabira The International School | Zirakpur', description: 'Plan a visit to Kabira on Patiala Road, Zirakpur. Get directions and explore preschool or daycare admissions.' },
];

const navOrder = ['about', 'programs', 'daycare', 'campus', 'principal', 'admissions', 'contact'];
const mobileOrder = ['admissions', 'programs', 'daycare', 'campus', 'about', 'principal', 'contact'];

function pageByKey(key) {
  return pages.find((page) => page.key === key);
}

function hrefFor(key) {
  return pageByKey(key).file;
}

function navLink(key, active, compact = false) {
  const page = pageByKey(key);
  const label = key === 'admissions' && !compact ? 'Admissions 2026–27' : page.label;
  return `<a class="nav-link ${active === key ? 'is-active' : ''}" href="${page.file}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
}

function header(active) {
  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="admission-ribbon">
      <div class="shell ribbon-inner">
        <span>Admissions open · 2026–27</span>
        <a href="admissions.html">See the admission journey <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <header class="site-header" data-header>
      <div class="shell header-inner">
        <a class="brand" href="index.html" aria-label="Kabira The International School home">
          <img src="assets/kabira-mark.jpg" width="96" height="80" alt="" fetchpriority="high">
          <span class="brand-copy"><strong>Kabira</strong><small>The International School</small></span>
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          ${navOrder.map((key) => navLink(key, active, key !== 'admissions')).join('')}
          <a class="button button-small button-primary" href="contact.html#visit-planner">Plan a visit</a>
        </nav>
        <div class="mobile-header-actions">
          <a class="mobile-admission-pill" href="admissions.html">Admissions</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation" data-menu-toggle>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" hidden data-mobile-menu>
      <div class="mobile-menu-inner shell">
        <p class="mobile-menu-label">Explore Kabira</p>
        <nav aria-label="Mobile navigation">
          ${mobileOrder.map((key, index) => `<div style="--menu-index:${index}">${navLink(key, active, true)}</div>`).join('')}
        </nav>
        <div class="mobile-menu-cta">
          <p>Pre-Nursery to UKG · Daycare</p>
          <a class="button button-primary" href="contact.html#visit-planner">Plan a school visit <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div class="footer-brand">
          <a class="brand brand-light" href="index.html">
            <img src="assets/kabira-mark.jpg" width="96" height="80" alt="">
            <span class="brand-copy"><strong>Kabira</strong><small>The International School</small></span>
          </a>
          <p>A nurturing preschool and daycare in Zirakpur, built around joyful learning, thoughtful care, and Indian values.</p>
          <p class="footer-motto">Grow <i></i> Learn <i></i> Bloom</p>
        </div>
        <div>
          <p class="footer-heading">Explore</p>
          <ul class="footer-links">
            <li><a href="programs.html">Programs</a></li>
            <li><a href="daycare.html">Daycare</a></li>
            <li><a href="campus.html">Campus & Facilities</a></li>
            <li><a href="principal.html">Principal’s Message</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-heading">Begin</p>
          <ul class="footer-links">
            <li><a href="admissions.html">Admissions 2026–27</a></li>
            <li><a href="contact.html#visit-planner">Plan a School Visit</a></li>
            <li><a href="contact.html#directions">Get Directions</a></li>
            <li><a href="about.html">Our Story</a></li>
          </ul>
        </div>
        <div class="footer-address">
          <p class="footer-heading">Visit Kabira</p>
          <address>#1105, Dashmesh Colony<br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address>
          <a class="text-link text-link-light" href="contact.html">Visit details <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="shell footer-bottom">
        <span>© 2026 Kabira The International School</span>
        <span>Pre-Nursery · Nursery · LKG · UKG · Daycare</span>
      </div>
    </footer>
    <nav class="mobile-dock" aria-label="Quick actions">
      <a href="programs.html"><span>Explore</span><strong>Programs</strong></a>
      <a class="dock-primary" href="contact.html#visit-planner"><span>Next step</span><strong>Plan a visit</strong></a>
    </nav>`;
}

function button(href, label, style = 'primary') {
  return `<a class="button button-${style}" href="${href}">${label} <span aria-hidden="true">→</span></a>`;
}

function picture(name, alt, options = {}) {
  const { className = '', eager = false, caption = '', contained = false } = options;
  return `<figure class="media-frame ${className} ${contained ? 'media-contained' : ''}">
    <picture>
      <source media="(max-width: 720px)" srcset="assets/${name}-small.jpg">
      <img src="assets/${name}.jpg" alt="${alt}" width="1536" height="1024" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </picture>
    ${caption ? `<figcaption>${caption}</figcaption>` : ''}
  </figure>`;
}

function portrait(options = {}) {
  const { className = '', eager = false, alt = 'Dr. Rita Ratan, Principal and Educational Leader at Kabira The International School' } = options;
  return `<figure class="portrait-frame ${className}">
    <picture>
      <source media="(max-width: 720px)" srcset="assets/dr-rita-ratan-small.jpg">
      <img src="assets/dr-rita-ratan.jpg" alt="${alt}" width="1200" height="1500" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </picture>
  </figure>`;
}

function eyebrow(text) {
  return `<p class="eyebrow"><span aria-hidden="true"></span>${text}</p>`;
}

function pageHero({ eyebrowText, title, copy, actions = '', media = '', modifier = '' }) {
  return `<section class="page-hero ${modifier}">
    <div class="shell page-hero-grid">
      <div class="page-hero-copy" data-reveal>
        ${eyebrow(eyebrowText)}
        <h1>${title}</h1>
        <p class="lead">${copy}</p>
        ${actions ? `<div class="button-row">${actions}</div>` : ''}
      </div>
      ${media ? `<div class="page-hero-media" data-reveal data-delay="1">${media}</div>` : ''}
    </div>
    <span class="hero-thread" aria-hidden="true"></span>
  </section>`;
}

function sectionHead({ overline, title, copy = '', align = 'left' }) {
  return `<div class="section-head section-head-${align}" data-reveal>
    ${overline ? eyebrow(overline) : ''}
    <h2>${title}</h2>
    ${copy ? `<p>${copy}</p>` : ''}
  </div>`;
}

function finalCta(title = 'Come see if Kabira feels right for your child.', copy = 'Visit us in Zirakpur and begin a thoughtful conversation about their first school years.') {
  return `<section class="final-cta">
    <div class="shell final-cta-inner" data-reveal>
      <div>
        ${eyebrow('Admissions 2026–27')}
        <h2>${title}</h2>
        <p>${copy}</p>
      </div>
      <div class="button-row">
        ${button('contact.html#visit-planner', 'Plan a school visit', 'light')}
        ${button('admissions.html', 'View admissions', 'outline-light')}
      </div>
    </div>
  </section>`;
}

function home() {
  const heroMedia = `<div class="hero-visual">
    ${picture('hero-v2', 'Young children learning together in Kabira navy and green uniforms', { eager: true, caption: 'Kabira learning experience · illustrative visual' })}
    <div class="experience-note"><strong>Nearly 28 years</strong><span>of educational leadership</span></div>
  </div>`;

  return `
    <section class="home-hero">
      <div class="shell home-hero-grid">
        <div class="home-hero-copy" data-reveal>
          ${eyebrow('Preschool & daycare · Zirakpur')}
          <h1>A confident beginning starts with <em>feeling at home.</em></h1>
          <p class="lead">For children from Pre-Nursery to UKG, Kabira brings caring early-years education, purposeful play, and Indian values together under experienced leadership.</p>
          <div class="button-row">
            ${button('contact.html#visit-planner', 'Plan a school visit')}
            ${button('programs.html', 'Explore programs', 'outline')}
          </div>
          <p class="hero-assurance"><span aria-hidden="true">✓</span> Admissions open for the 2026–27 session</p>
        </div>
        <div data-reveal data-delay="1">${heroMedia}</div>
      </div>
      <span class="hero-thread" aria-hidden="true"></span>
    </section>

    <section class="trust-strip" aria-label="Kabira at a glance">
      <div class="shell trust-grid">
        <div data-reveal><strong>Pre-Nursery–UKG</strong><span>Age-led programs</span></div>
        <div data-reveal data-delay="1"><strong>7 AM–7 PM</strong><span>Extended daycare</span></div>
        <div data-reveal data-delay="2"><strong>Nearly 28 years</strong><span>Educational leadership</span></div>
        <div data-reveal data-delay="3"><strong>Modern + rooted</strong><span>Learning with Indian values</span></div>
      </div>
    </section>

    <section class="section why-section">
      <div class="shell">
        ${sectionHead({ overline: 'Why parents choose Kabira', title: 'Everything a little learner needs to feel secure—and ready.', copy: 'Thoughtful early education starts by seeing the whole child: confidence, communication, curiosity, movement, relationships, and values.' })}
        <div class="choice-grid">
          <article class="choice-card" data-reveal><span class="choice-number">01</span><h3>Care comes first</h3><p>Children learn best when they feel safe, understood, and welcome.</p></article>
          <article class="choice-card" data-reveal data-delay="1"><span class="choice-number">02</span><h3>Learning has purpose</h3><p>Play, phonics, numeracy, movement, and creativity build a balanced foundation.</p></article>
          <article class="choice-card" data-reveal data-delay="2"><span class="choice-number">03</span><h3>Every child is seen</h3><p>Guidance respects each child’s pace, personality, and emerging strengths.</p></article>
          <article class="choice-card" data-reveal data-delay="3"><span class="choice-number">04</span><h3>Values live daily</h3><p>Kindness, gratitude, respect, and responsibility become part of everyday choices.</p></article>
        </div>
      </div>
    </section>

    <section class="section leader-home">
      <div class="shell leader-grid">
        <div data-reveal>${portrait()}</div>
        <div class="leader-copy" data-reveal data-delay="1">
          ${eyebrow('A new school · experienced leadership')}
          <h2>Nearly 28 years in education. One deeply personal promise.</h2>
          <blockquote>“Every child needs to feel loved and understood before meaningful learning can begin.”</blockquote>
          <p>Dr. Rita Ratan brings experience in teaching, school administration, and educational leadership to Kabira’s earliest years.</p>
          <p>Her vision is simple: children should enter happily, parents should leave with confidence, and teachers should become thoughtful guides.</p>
          ${button('principal.html', 'Read Dr. Ratan’s message', 'text')}
        </div>
      </div>
    </section>

    <section class="section programs-home">
      <div class="shell">
        <div class="head-with-action">
          ${sectionHead({ overline: 'Programs', title: 'The right beginning for every age.', copy: 'Each stage adds just enough challenge while leaving room for play, movement, imagination, and belonging.' })}
          ${button('programs.html', 'Compare all programs', 'outline')}
        </div>
        <div class="program-card-grid">
          <a class="program-card" href="programs.html#pre-nursery" data-reveal><span class="program-age">2+</span><p>Pre-Nursery</p><h3>Comfort & discovery</h3><span>Communication, sensory play, and first friendships.</span><i aria-hidden="true">→</i></a>
          <a class="program-card" href="programs.html#nursery" data-reveal data-delay="1"><span class="program-age">3+</span><p>Nursery</p><h3>Curiosity & concepts</h3><span>Early language, numeracy, creativity, and independence.</span><i aria-hidden="true">→</i></a>
          <a class="program-card" href="programs.html#lkg" data-reveal data-delay="2"><span class="program-age">4+</span><p>LKG</p><h3>Readiness & expression</h3><span>Phonics, number sense, reasoning, and confident speech.</span><i aria-hidden="true">→</i></a>
          <a class="program-card" href="programs.html#ukg" data-reveal data-delay="3"><span class="program-age">5+</span><p>UKG</p><h3>Confidence & transition</h3><span>Stronger reading, writing, mathematics, and independence.</span><i aria-hidden="true">→</i></a>
        </div>
        <a class="daycare-banner" href="daycare.html" data-reveal>
          <span><small>Daycare · 7:00 AM–7:00 PM</small><strong>A caring rhythm beyond preschool hours.</strong></span>
          <span>Explore daycare <b aria-hidden="true">→</b></span>
        </a>
      </div>
    </section>

    <section class="section campus-story-home">
      <div class="shell campus-story-grid">
        <div class="campus-panel" data-reveal>
          ${picture('nature-v2', 'Children learning about plants with a teacher in a warm early-years environment', { caption: 'Nature-led learning · illustrative visual' })}
          <div class="campus-panel-copy">
            ${eyebrow('Campus & facilities')}
            <h2>A calm space for busy little minds.</h2>
            <p>Kabira’s early-years environment is being shaped around children: welcoming classrooms, purposeful activity areas, and room to move, create, and belong.</p>
            ${button('campus.html', 'Explore the campus plan', 'text')}
          </div>
        </div>
        <div class="story-panel" data-reveal data-delay="1">
          <span class="woven-mark" aria-hidden="true"></span>
          ${eyebrow('The story behind Kabira')}
          <h2>A thread of wisdom through every school day.</h2>
          <p>Inspired by the values associated with Sant Kabir, Kabira brings simplicity, truth, compassion, equality, and self-awareness into a modern beginning.</p>
          <ul class="value-line" aria-label="Kabira values"><li>Kindness</li><li>Honesty</li><li>Gratitude</li><li>Respect</li></ul>
          ${button('about.html#kabira-story', 'Discover our story', 'light-text')}
        </div>
      </div>
    </section>

    <section class="section trust-visit">
      <div class="shell trust-visit-grid">
        <div data-reveal>
          ${eyebrow('Trust starts with openness')}
          <h2>See the school. Meet the people. Ask everything.</h2>
          <p>Your first visit should give you clarity, without pressure. Explore the approach, discuss your child’s needs, and understand the next steps before you decide.</p>
        </div>
        <div class="visit-proof" data-reveal data-delay="1">
          <div><span>01</span><strong>Meet the leadership</strong></div>
          <div><span>02</span><strong>Understand the program</strong></div>
          <div><span>03</span><strong>Explore the environment</strong></div>
        </div>
      </div>
    </section>

    ${finalCta()}`;
}

function about() {
  return `
    ${pageHero({
      eyebrowText: 'About Kabira',
      title: 'A school built around how childhood truly grows.',
      copy: 'Kabira is being established in Zirakpur to give young children a caring, values-led, and professionally guided beginning.',
      actions: button('contact.html#visit-planner', 'Meet Kabira in person') + button('principal.html', 'Meet our principal', 'outline'),
      media: picture('story-v2', 'A teacher sharing a joyful learning moment with young children', { eager: true, caption: 'The Kabira learning experience · illustrative visual' }),
    })}

    <section class="section origin-section">
      <div class="shell two-column-copy">
        <div data-reveal>${eyebrow('Our beginning')}<h2>Created to feel warm. Built to be purposeful.</h2></div>
        <div class="rich-copy" data-reveal data-delay="1">
          <p>Kabira The International School is being established in Zirakpur under Bhattacharya Educational Trust to provide nurturing, values-based, and professionally guided early education.</p>
          <p>We believe the early years shape far more than school readiness. They shape a child’s confidence, language, relationships, habits, values, and lifelong response to learning.</p>
        </div>
      </div>
    </section>

    <section class="section motto-section">
      <div class="shell">
        ${sectionHead({ overline: 'Grow · Learn · Bloom', title: 'Three words. One complete childhood.', align: 'center' })}
        <div class="motto-grid">
          <article data-reveal><span>Grow</span><h3>With confidence</h3><p>Through movement, relationships, self-help, and small responsibilities.</p></article>
          <article data-reveal data-delay="1"><span>Learn</span><h3>With curiosity</h3><p>Through questions, stories, conversation, exploration, and purposeful play.</p></article>
          <article data-reveal data-delay="2"><span>Bloom</span><h3>In their own way</h3><p>With guidance that respects every child’s personality, pace, and strengths.</p></article>
        </div>
      </div>
    </section>

    <section class="section story-detail" id="kabira-story">
      <div class="shell story-detail-grid">
        <div class="story-art" data-reveal><span class="woven-mark woven-mark-large" aria-hidden="true"></span><p>Simple threads<br>become something<br>strong together.</p></div>
        <div data-reveal data-delay="1">
          ${eyebrow('The story behind “Kabira”')}
          <h2>A thread of wisdom. A modern beginning.</h2>
          <p>The name Kabira draws inspiration from the timeless values associated with Sant Kabir: simplicity, truth, compassion, equality, wisdom, and self-awareness.</p>
          <p>For us, education is more than collecting information. It is learning how to think, how to treat others, and how to become a better human being.</p>
          <ul class="value-chips"><li>Kindness</li><li>Honesty</li><li>Sharing</li><li>Gratitude</li><li>Respect</li><li>Patience</li><li>Compassion</li><li>Responsibility</li></ul>
        </div>
      </div>
    </section>

    <section class="section philosophy-section">
      <div class="shell">
        ${sectionHead({ overline: 'Our philosophy', title: 'Childhood should never be rushed.', copy: 'Academic preparation matters. It becomes more meaningful when balanced with creative, physical, emotional, social, and moral development.' })}
        <div class="pillar-grid">
          <article data-reveal><span>Explore</span><h3>Learning through experience</h3><p>Children touch, observe, experiment, communicate, imagine, and create.</p></article>
          <article data-reveal data-delay="1"><span>Belong</span><h3>Security before performance</h3><p>Warm relationships help children take healthy risks and express themselves.</p></article>
          <article data-reveal data-delay="2"><span>Become</span><h3>Values through everyday life</h3><p>Stories and classroom choices turn positive values into lived habits.</p></article>
        </div>
      </div>
    </section>

    <section class="section growth-vision">
      <div class="shell growth-card" data-reveal>
        <div><span class="growth-label">Long-term vision</span><h2>A preschool today. A school designed to grow thoughtfully.</h2></div>
        <div><p>Kabira’s long-term vision is to add one higher class progressively each academic year, subject to enrolment, infrastructure readiness, qualified staff, statutory requirements, and permissions.</p><p><strong>Current admissions:</strong> Pre-Nursery, Nursery, LKG, UKG, and Daycare.</p></div>
      </div>
    </section>
    ${finalCta('A beautiful beginning is best understood in person.', 'Visit Kabira, meet the people behind the vision, and see how the early-years journey is being shaped.')}`;
}

const programDetails = [
  { id: 'pre-nursery', age: '2+', name: 'Pre-Nursery', title: 'Comfort before confidence.', copy: 'A gentle introduction to school where children settle, connect, communicate, and discover through play.', items: ['Communication and listening', 'Colours, shapes, stories, and rhymes', 'Sensory exploration', 'Fine and gross motor development', 'Socialisation and self-help'] },
  { id: 'nursery', age: '3+', name: 'Nursery', title: 'Curiosity finds language.', copy: 'Children become more expressive while early concepts, creativity, and growing independence take shape.', items: ['Pre-reading and sound awareness', 'Early numeracy', 'Vocabulary and conversation', 'Art, music, and movement', 'Social-emotional development'] },
  { id: 'lkg', age: '4+', name: 'LKG', title: 'Readiness with room to play.', copy: 'A stronger foundation in language and number concepts, balanced with expression, movement, and discovery.', items: ['Phonics and letter sounds', 'Blending and early reading readiness', 'Number concepts and logical thinking', 'Writing readiness', 'Communication and life skills'] },
  { id: 'ukg', age: '5+', name: 'UKG', title: 'A confident bridge to primary school.', copy: 'Children strengthen academic readiness, independence, and the ability to express ideas with clarity.', items: ['Reading fluency and blending', 'Sentence and writing development', 'Number operations and reasoning', 'Environmental awareness', 'Creativity, confidence, and independence'] },
];

function programs() {
  return `
    ${pageHero({
      eyebrowText: 'Pre-Nursery to UKG',
      title: 'The right challenge. At the right age. With room to be a child.',
      copy: 'Kabira’s programs follow the way young children grow: from comfort and communication to confident school readiness.',
      actions: button('#program-guide', 'Find your child’s stage') + button('admissions.html', 'View admissions', 'outline'),
      media: picture('uniform-v2', 'Kabira summer and winter uniform visual with children in navy, green, and white', { eager: true, contained: true, caption: 'Kabira uniform visual · shown in full' }),
      modifier: 'programs-page-hero',
    })}

    <section class="section program-guide" id="program-guide">
      <div class="shell">
        ${sectionHead({ overline: 'Age at a glance', title: 'A clear path through the early years.', copy: 'Age ranges are guides. Suitable placement is confirmed during the admission interaction.' })}
        <nav class="age-jump" aria-label="Jump to a program">
          ${programDetails.map((program) => `<a href="#${program.id}"><strong>${program.age}</strong><span>${program.name}</span></a>`).join('')}
        </nav>
        <div class="program-detail-list">
          ${programDetails.map((program, index) => `<article class="program-detail" id="${program.id}" data-reveal>
            <div class="program-detail-title"><span>${program.age}</span><div><p>${program.name}</p><h2>${program.title}</h2></div></div>
            <div class="program-detail-copy"><p>${program.copy}</p><ul>${program.items.map((item) => `<li>${item}</li>`).join('')}</ul></div>
            <a href="contact.html#visit-planner" aria-label="Discuss ${program.name} during a school visit">Discuss this stage <span aria-hidden="true">→</span></a>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="section learning-methods">
      <div class="shell">
        ${sectionHead({ overline: 'How children learn', title: 'Learning that moves, speaks, builds, and wonders.', copy: 'Every concept is supported by active experiences that help children understand and remember.' })}
        <div class="method-marquee" aria-label="Learning methods"><span>Play</span><span>Exploration</span><span>Conversation</span><span>Storytelling</span><span>Nature</span><span>Music</span><span>Movement</span><span>Hands-on discovery</span></div>
        <div class="learning-grid">
          <article data-reveal><h3>Language & literacy</h3><p>Pronunciation, vocabulary, listening, speaking, phonics, reading, and writing readiness.</p></article>
          <article data-reveal data-delay="1"><h3>Thinking & numeracy</h3><p>Number concepts, patterns, comparison, problem-solving, and logical reasoning.</p></article>
          <article data-reveal data-delay="2"><h3>Body & creativity</h3><p>Movement, coordination, art, music, rhythm, imagination, and self-expression.</p></article>
          <article data-reveal data-delay="3"><h3>Self & community</h3><p>Emotions, relationships, independence, life skills, culture, and positive values.</p></article>
        </div>
      </div>
    </section>

    <section class="section day-flow">
      <div class="shell">
        ${sectionHead({ overline: 'A day at Kabira', title: 'A familiar rhythm. Something new every day.', align: 'center' })}
        <ol class="flow-steps">
          <li data-reveal><span>01</span><strong>Arrive & belong</strong><p>Welcome, settle, explore, and connect.</p></li>
          <li data-reveal data-delay="1"><span>02</span><strong>Discover & discuss</strong><p>Circle time and interactive concepts.</p></li>
          <li data-reveal data-delay="2"><span>03</span><strong>Move & share</strong><p>Snack, social time, and active play.</p></li>
          <li data-reveal data-delay="3"><span>04</span><strong>Create & reflect</strong><p>Stories, art, music, role play, and goodbye.</p></li>
        </ol>
      </div>
    </section>
    ${finalCta('Which stage feels right for your child?', 'Plan a visit to discuss age, readiness, settling-in needs, and the program that suits them best.')}`;
}

function daycare() {
  return `
    ${pageHero({
      eyebrowText: 'Daycare · 7:00 AM–7:00 PM',
      title: 'Care that fits your day. A place that feels familiar.',
      copy: 'Kabira’s extended daycare is designed for families who need dependable, comfortable care beyond preschool hours.',
      actions: button('contact.html#visit-planner', 'Discuss daycare during a visit') + button('#daily-rhythm', 'See the daily rhythm', 'outline'),
      media: picture('story-v2', 'A caring early-years educator engaging children through a story activity', { eager: true, caption: 'Caring engagement · illustrative visual' }),
    })}

    <section class="section daycare-intro">
      <div class="shell time-feature" data-reveal>
        <div><span>Open across the day</span><strong>7:00</strong><small>AM</small></div>
        <i aria-hidden="true"></i>
        <div><strong>7:00</strong><small>PM</small><span>A calm end to the day</span></div>
        <p>A consistent, caring rhythm of rest, play, creative activity, and individual attention.</p>
      </div>
    </section>

    <section class="section daycare-rhythm" id="daily-rhythm">
      <div class="shell daycare-grid">
        <div>
          ${sectionHead({ overline: 'A caring daily rhythm', title: 'Enough structure to feel secure. Enough freedom to feel at home.', copy: 'The exact flow adapts to age, energy, school hours, and individual needs.' })}
          <ol class="vertical-flow">
            <li data-reveal><span>Arrive</span><p>A warm handover and time to settle.</p></li>
            <li data-reveal><span>Play</span><p>Supervised free play and age-appropriate engagement.</p></li>
            <li data-reveal><span>Rest</span><p>Comfortable quiet time and gentle transitions.</p></li>
            <li data-reveal><span>Create</span><p>Art, stories, music, movement, and indoor activities.</p></li>
            <li data-reveal><span>Return</span><p>A calm goodbye and clear handover to family.</p></li>
          </ol>
        </div>
        <aside class="included-card" data-reveal data-delay="1">
          ${eyebrow('Designed to include')}
          <ul class="check-list"><li>Comfortable rest time</li><li>Supervised play</li><li>Creative activities</li><li>Storytelling and movement</li><li>Meal and snack support</li><li>Individual care and supervision</li><li>Homework support where age-appropriate</li></ul>
        </aside>
      </div>
    </section>

    <section class="section reassurance-section">
      <div class="shell reassurance-grid">
        <div data-reveal>${eyebrow('A home-away-from-home approach')}<h2>The little transitions matter.</h2><p>Children feel more secure when arrival, meals, rest, play, and departure are handled with warmth and consistency.</p></div>
        <div class="reassurance-points" data-reveal data-delay="1"><article><strong>Comfort</strong><p>Familiar routines and responsive care.</p></article><article><strong>Engagement</strong><p>Age-appropriate activities without over-scheduling.</p></article><article><strong>Supervision</strong><p>Attentive handovers and child-friendly routines.</p></article></div>
      </div>
    </section>

    <section class="section faq-section">
      <div class="shell faq-grid">
        ${sectionHead({ overline: 'Daycare questions', title: 'Useful things to discuss during your visit.' })}
        <div class="accordion" data-accordion>
          <details><summary>Can preschool and daycare be combined?<span></span></summary><p>Daycare is designed to support children beyond school hours. The suitable schedule can be discussed according to your child’s age and family routine.</p></details>
          <details><summary>How is settling-in supported?<span></span></summary><p>Comfort, familiar routines, patient transitions, and close observation help each child adjust at their own pace.</p></details>
          <details><summary>What should my child bring?<span></span></summary><p>Requirements can vary by age and routine. Families receive clear guidance during admission and before the first day.</p></details>
          <details><summary>Is homework support included?<span></span></summary><p>Age-appropriate homework assistance can be provided where applicable, alongside rest and play.</p></details>
        </div>
      </div>
    </section>
    ${finalCta('Let daycare feel like part of your child’s day.', 'Visit Kabira to discuss routines, settling in, rest, activities, and the care your family needs.')}`;
}

const faqs = [
  ['What programs are currently available?', 'Current admissions are for Pre-Nursery, Nursery, LKG, UKG, and Daycare.'],
  ['What are the preschool hours?', 'Regular preschool timing is approximately 9:00 AM–12:30 PM.'],
  ['What are the daycare hours?', 'Daycare is available from 7:00 AM–7:00 PM.'],
  ['Does Kabira focus only on academics?', 'No. The approach balances language, numeracy, creativity, movement, confidence, relationships, emotional development, life skills, and values.'],
  ['Is phonics included?', 'Yes. Age-appropriate phonics and language development are integrated into the early-years program.'],
  ['Can parents visit before deciding?', 'Yes. Families are encouraged to visit, discuss their child’s needs, and understand the environment and approach before completing admission.'],
];

function admissions() {
  return `
    ${pageHero({
      eyebrowText: 'Admissions open · 2026–27',
      title: 'A calm, clear start for your family.',
      copy: 'Explore the right program, visit the school, ask your questions, and decide with confidence.',
      actions: button('contact.html#visit-planner', 'Plan a school visit') + button('#admission-process', 'See the process', 'outline'),
      media: `<div class="admission-hero-card"><span>Now welcoming enquiries for</span><strong>Pre-Nursery</strong><strong>Nursery</strong><strong>LKG</strong><strong>UKG</strong><strong>Daycare</strong><a href="programs.html">Compare age groups <i aria-hidden="true">→</i></a></div>`,
      modifier: 'admissions-page-hero',
    })}

    <section class="section admission-process" id="admission-process">
      <div class="shell">
        ${sectionHead({ overline: 'Five simple steps', title: 'From first question to first school day.', copy: 'The process is designed to help both the family and the school understand what the child needs.' })}
        <ol class="process-list">
          <li data-reveal><span>01</span><div><h3>Explore</h3><p>Review the available programs and age guidance.</p></div></li>
          <li data-reveal data-delay="1"><span>02</span><div><h3>Visit</h3><p>Experience the environment and meet the people behind Kabira.</p></div></li>
          <li data-reveal data-delay="2"><span>03</span><div><h3>Talk</h3><p>Discuss readiness, routines, settling in, and the right stage.</p></div></li>
          <li data-reveal data-delay="3"><span>04</span><div><h3>Register</h3><p>Complete the admission form and provide the requested documents.</p></div></li>
          <li data-reveal><span>05</span><div><h3>Begin</h3><p>Prepare for a warm welcome into the Kabira family.</p></div></li>
        </ol>
      </div>
    </section>

    <section class="section visit-conversation">
      <div class="shell visit-conversation-grid">
        <div data-reveal>${eyebrow('Make the visit useful')}<h2>Bring the questions that matter to your family.</h2><p>A thoughtful admission conversation should help you understand fit, routine, expectations, and next steps.</p></div>
        <ul data-reveal data-delay="1"><li>Age and developmental readiness</li><li>Settling-in needs</li><li>Preschool or daycare routine</li><li>Learning approach and program fit</li><li>Documents, fees, and next steps</li></ul>
      </div>
    </section>

    <section class="section documents-section">
      <div class="shell">
        ${sectionHead({ overline: 'Documents', title: 'What families may be asked to provide.', copy: 'The final list is confirmed during the admission conversation.' })}
        <div class="document-grid">
          <span data-reveal>Child’s birth certificate</span><span data-reveal data-delay="1">Child and parent photographs</span><span data-reveal data-delay="2">Address proof</span><span data-reveal data-delay="3">Aadhaar copies, where applicable</span><span data-reveal>Previous school record, if relevant</span><span data-reveal data-delay="1">Pertinent medical information</span>
        </div>
      </div>
    </section>

    <section class="section faq-section">
      <div class="shell faq-grid">
        ${sectionHead({ overline: 'Admissions FAQ', title: 'Clear answers before you visit.' })}
        <div class="accordion" data-accordion>
          ${faqs.map(([question, answer]) => `<details><summary>${question}<span></span></summary><p>${answer}</p></details>`).join('')}
        </div>
      </div>
    </section>
    ${finalCta('Your first visit can answer more than a brochure.', 'Come see the approach, discuss your child’s stage, and understand the 2026–27 admission journey.')}`;
}

function campus() {
  return `
    ${pageHero({
      eyebrowText: 'Campus & facilities',
      title: 'A calm environment, designed around little learners.',
      copy: 'Kabira’s early-years spaces are being shaped to feel welcoming, purposeful, child-friendly, and free from visual overload.',
      actions: button('contact.html#visit-planner', 'Plan a campus visit') + button('#spaces', 'Explore planned spaces', 'outline'),
      media: picture('nature-v2', 'A teacher and children exploring plants in an early-years learning environment', { eager: true, caption: 'Nature-led learning · illustrative visual' }),
    })}

    <section class="section campus-principles">
      <div class="shell">
        ${sectionHead({ overline: 'Design philosophy', title: 'Designed at a child’s height.', copy: 'Every planned space begins with how a young child sees, moves, reaches, rests, plays, and feels.' })}
        <div class="principle-line"><span>Elegant</span><i></i><span>Calm</span><i></i><span>Natural</span><i></i><span>Modern</span><i></i><span>Child-friendly</span></div>
      </div>
    </section>

    <section class="section spaces-section" id="spaces">
      <div class="shell">
        ${sectionHead({ overline: 'Planned early-years spaces', title: 'Every corner should have a reason to exist.', copy: 'The campus plan prioritises the following spaces as the school develops.' })}
        <div class="space-grid">
          <article data-reveal><span>01</span><h3>Welcoming classrooms</h3><p>Child-scale furniture, learning corners, and room for conversation and exploration.</p></article>
          <article data-reveal data-delay="1"><span>02</span><h3>Activity & indoor play</h3><p>Flexible areas for movement, creative work, sensory learning, and group play.</p></article>
          <article data-reveal data-delay="2"><span>03</span><h3>Daycare rest area</h3><p>A calmer zone for quiet transitions, comfort, and age-appropriate rest.</p></article>
          <article data-reveal data-delay="3"><span>04</span><h3>Child-friendly washrooms</h3><p>Age-aware access and routines that support hygiene and growing independence.</p></article>
          <article data-reveal><span>05</span><h3>Reception & counselling</h3><p>A clear welcome point for secure arrivals, family conversations, and guidance.</p></article>
          <article data-reveal data-delay="1"><span>06</span><h3>Outdoor movement</h3><p>Planned opportunities for active play and nature, where space and safety permit.</p></article>
        </div>
      </div>
    </section>

    <section class="section visual-gallery">
      <div class="shell">
        ${sectionHead({ overline: 'The environment we are shaping', title: 'Warm, ordered, and ready for discovery.', copy: 'These illustrative visuals communicate the intended learning mood. Real campus photography will replace them as spaces are completed.' })}
        <div class="gallery-grid">
          ${picture('hero-v2', 'Children learning together in Kabira uniforms', { caption: 'Collaborative learning · illustrative visual' })}
          ${picture('nature-v2', 'Children exploring nature with an educator', { caption: 'Nature and observation · illustrative visual' })}
          ${picture('story-v2', 'A teacher reading and engaging young children', { caption: 'Stories and communication · illustrative visual' })}
        </div>
      </div>
    </section>

    <section class="section safety-section">
      <div class="shell safety-grid">
        <div data-reveal>${eyebrow('Health, safety & hygiene')}<h2>Care is designed into the routine.</h2><p>Families can discuss the school’s evolving safety and hygiene arrangements during a campus visit.</p></div>
        <div class="safety-list" data-reveal data-delay="1"><span>Controlled entry and visitor awareness</span><span>Supervised arrival and dispersal</span><span>Child-safe furniture and movement</span><span>Clean classrooms and washroom routines</span><span>Staff supervision and preparedness</span><span>Clear parent communication</span></div>
      </div>
    </section>

    <section class="section future-campus"><div class="shell growth-card" data-reveal><div><span class="growth-label">Future readiness</span><h2>Spaces will grow with the school.</h2></div><div><p>Facilities will develop progressively as additional classes are introduced, subject to enrolment, infrastructure readiness, and applicable requirements.</p></div></div></section>
    ${finalCta('The best way to understand a space is to experience it.', 'Plan a visit to see the setting, discuss safety and care, and ask what matters to your family.')}`;
}

function principal() {
  return `
    <section class="principal-hero">
      <div class="shell principal-hero-grid">
        <div class="principal-hero-copy" data-reveal>
          ${eyebrow('Principal & educational leader')}
          <h1>Nearly three decades in education. One deeply personal vision.</h1>
          <p class="lead">Dr. Rita Ratan brings nearly 28 years of experience across teaching, school administration, and educational leadership to Kabira.</p>
          <div class="principal-facts"><div><strong>Nearly 28</strong><span>years in education</span></div><div><strong>Teaching · Administration · Leadership</strong><span>experience across the school journey</span></div></div>
          ${button('#message', 'Read her message', 'outline')}
        </div>
        <div data-reveal data-delay="1">${portrait({ eager: true, className: 'principal-main-portrait' })}<p class="portrait-caption">Dr. Rita Ratan<br><span>Principal & Educational Leader</span></p></div>
      </div>
      <span class="hero-thread" aria-hidden="true"></span>
    </section>

    <section class="section principal-message" id="message">
      <div class="shell message-grid">
        <aside data-reveal><span class="quote-mark">“</span><blockquote>Every child needs to feel loved and understood before meaningful learning can begin.</blockquote><p>Dr. Rita Ratan</p></aside>
        <article class="letter" data-reveal data-delay="1">
          ${eyebrow('A message to parents')}
          <h2>Dear Parents,</h2>
          <p>For nearly three decades, education has been more than my profession. It has been my passion and my journey. One lesson has remained constant: every child needs to feel loved and understood before meaningful learning can begin.</p>
          <p>Kabira has been created from that belief. I want children to enter school happily, parents to leave with confidence, and teachers to become caring facilitators and emotional anchors.</p>
          <p>We aim to combine the warmth of home with the structure and quality of a professionally guided school. Academics matter, and childhood matters equally.</p>
          <p>Our children should learn to speak confidently, think independently, respect others, appreciate their culture, and ask questions without fear. Above all, they should carry joyful memories of their first school years.</p>
          <p>I warmly invite your family to visit Kabira and experience the vision behind it.</p>
          <p class="signature">Warm regards,<br><strong>Dr. Rita Ratan</strong><br><span>Principal & Educational Leader</span></p>
        </article>
      </div>
    </section>

    <section class="section leadership-scope">
      <div class="shell">
        ${sectionHead({ overline: 'Experienced guidance', title: 'Leadership that sees the whole school experience.', copy: 'Kabira’s educational direction is informed by experience across the work that families and children feel every day.' })}
        <div class="scope-grid"><span data-reveal>Teaching & academics</span><span data-reveal data-delay="1">School administration</span><span data-reveal data-delay="2">Educational leadership</span><span data-reveal data-delay="3">Teacher guidance</span><span data-reveal>Parent conversations</span><span data-reveal data-delay="1">Institutional planning</span></div>
      </div>
    </section>

    <section class="section child-feelings"><div class="shell child-feelings-inner" data-reveal><div>${eyebrow('What every child should feel')}<h2>Safe. Seen. Curious. Capable.</h2></div><p>Those four feelings shape how children participate, communicate, build confidence, and begin to love learning.</p></div></section>
    ${finalCta('Meet the people behind the promise.', 'Plan a school visit to talk about your child and the kind of beginning you want for them.')}`;
}

function contact() {
  const mapQuery = encodeURIComponent('#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road, Zirakpur, Punjab');
  return `
    ${pageHero({
      eyebrowText: 'Visit Kabira · Zirakpur',
      title: 'Come experience Kabira for yourself.',
      copy: 'A school visit gives you space to understand the approach, discuss your child’s needs, and decide with clarity.',
      actions: button('#visit-planner', 'Create a visit plan') + button('#directions', 'Get directions', 'outline'),
      media: `<div class="address-hero-card"><span>Visit address</span><strong>Kabira The International School</strong><address>#1105, Dashmesh Colony<br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address><div><p><b>Preschool</b>Approx. 9:00 AM–12:30 PM</p><p><b>Daycare</b>7:00 AM–7:00 PM</p></div></div>`,
      modifier: 'contact-page-hero',
    })}

    <section class="section visit-planner-section" id="visit-planner">
      <div class="shell planner-grid">
        <div data-reveal>
          ${eyebrow('Plan your school visit')}
          <h2>A few details make the conversation more useful.</h2>
          <p>Create a simple visit plan for your family. Your entries stay in this browser and are not sent or stored by the website.</p>
          <ul class="visit-benefits"><li>Identify the right program to discuss</li><li>Choose a preferred visit date</li><li>Keep your key questions together</li></ul>
        </div>
        <form class="visit-form" data-visit-form data-reveal data-delay="1">
          <div class="field-row">
            <label><span>Parent’s name</span><input type="text" name="parentName" autocomplete="name" required placeholder="Your name"></label>
            <label><span>Child’s name</span><input type="text" name="childName" required placeholder="Child’s name"></label>
          </div>
          <div class="field-row">
            <label><span>Child’s age</span><select name="childAge" required><option value="">Select age</option><option>Under 2 years</option><option>2 years</option><option>3 years</option><option>4 years</option><option>5 years</option><option>6+ years</option></select></label>
            <label><span>Interested in</span><select name="program" required><option value="">Select program</option><option>Pre-Nursery</option><option>Nursery</option><option>LKG</option><option>UKG</option><option>Daycare</option><option>Program guidance</option></select></label>
          </div>
          <label><span>Preferred visit date</span><input type="date" name="visitDate" required></label>
          <label><span>What would you like to discuss? <small>Optional</small></span><textarea name="questions" rows="4" placeholder="Settling in, learning approach, daycare routine, fees…"></textarea></label>
          <button class="button button-primary" type="submit">Create my visit plan <span aria-hidden="true">→</span></button>
          <p class="form-note">This planner works on your device only. It does not transmit personal information.</p>
          <div class="visit-summary" aria-live="polite" hidden data-visit-summary></div>
        </form>
      </div>
    </section>

    <section class="section directions-section" id="directions">
      <div class="shell directions-grid">
        <div class="map-frame" data-reveal>
          <iframe title="Map showing Kabira The International School area in Zirakpur" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <div data-reveal data-delay="1">
          ${eyebrow('Directions')}
          <h2>Patiala Road, Zirakpur.</h2>
          <address><strong>#1105, Dashmesh Colony</strong><br>Behind Pearlwood Hotel<br>Patiala Road, Zirakpur, Punjab</address>
          <p>Use the map to review the route before your visit.</p>
          <a class="button button-outline" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <section class="section prepare-section"><div class="shell"><div class="prepare-card" data-reveal><div>${eyebrow('Prepare for your visit')}<h2>Six useful topics to bring with you.</h2></div><ol><li>Program fit</li><li>Settling in</li><li>Learning approach</li><li>Daycare needs</li><li>Fees and documents</li><li>Next steps</li></ol></div></div></section>`;
}

const bodyByKey = { home, about, programs, daycare, admissions, campus, principal, contact };

function schemaFor(page) {
  const school = {
    '@context': 'https://schema.org',
    '@type': ['Preschool', 'EducationalOrganization'],
    name: 'Kabira The International School',
    alternateName: 'Kabira International',
    slogan: 'Grow · Learn · Bloom',
    url: `${siteUrl}/${page.file === 'index.html' ? '' : page.file}`,
    logo: `${siteUrl}/assets/kabira-logo-hd.jpg`,
    image: `${siteUrl}/assets/hero-v2.jpg`,
    description: page.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '#1105, Dashmesh Colony, Behind Pearlwood Hotel, Patiala Road',
      addressLocality: 'Zirakpur',
      addressRegion: 'Punjab',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: 'Zirakpur' },
    parentOrganization: { '@type': 'Organization', name: 'Bhattacharya Educational Trust' },
  };
  const graphs = [school];
  if (page.key === 'admissions') {
    graphs.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graphs.map(({ ['@context']: _, ...entry }) => entry) });
}

function layout(page, content) {
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
  <link rel="stylesheet" href="styles.css">
  <script type="application/ld+json">${schemaFor(page)}</script>
  <script src="app.js" defer></script>
</head>
<body data-page="${page.key}">
  ${header(page.key)}
  <main id="main">${content}</main>
  ${footer()}
</body>
</html>`;
}

await mkdir(dist, { recursive: true });
for (const page of pages) {
  await writeFile(path.join(dist, page.file), layout(page, bodyByKey[page.key]()), 'utf8');
}

await writeFile(path.join(dist, 'styles.css'), await readFile(path.join(src, 'site.css'), 'utf8'), 'utf8');
await writeFile(path.join(dist, 'app.js'), await readFile(path.join(src, 'site.js'), 'utf8'), 'utf8');

await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${siteUrl}/${page.file === 'index.html' ? '' : page.file}</loc></url>`).join('\n')}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, 'site.webmanifest'), JSON.stringify({ name: 'Kabira The International School', short_name: 'Kabira', start_url: './index.html', display: 'standalone', background_color: '#f8f3e9', theme_color: '#09285a', icons: [{ src: 'assets/kabira-mark.jpg', sizes: '512x512', type: 'image/jpeg' }] }, null, 2), 'utf8');

console.log(`Built ${pages.length} pages in ${dist}`);
