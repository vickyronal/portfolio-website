// ─────────────────────────────────────────────────────────────
//  ALL SITE COPY LIVES HERE. Edit this file to update the site.
//  Images: drop files into /public/assets/images and set the paths below.
//    cover   → product image / screenshot used as the card thumbnail
//    logo    → used instead when there's no cover (SVG/PNG, shown centred
//              on a backdrop tinted with the project colour)
//    gallery → screens on the case-study page
//  While both cover and logo are null, a styled placeholder frame is shown.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Vignesh',
  role: 'Senior Visual Designer',
  location: 'Chennai, India',
  email: 'gvickyronal@gmail.com',
  behance: 'https://www.behance.net/4b80edfb',
  cv: '/assets/cv.pdf',
  // Cut-out photo (transparent PNG) the particles form during the prologue
  portrait: '/assets/images/portrait.png',
  current: 'Payan Design Studio',
  intro:
    'Senior Visual & UI Designer crafting intuitive digital experiences for startups and brands.',
  prologue:
    'Every interface begins as a single pixel. Mine began in 2018, cutting frames as a video editor. Then came shapes, then screens, then systems. Six years later, I lead visual design that turns briefs into stories people remember.',
};

// The Journey: one chapter per role. `shape` is the particle form shown behind it.
export const journey = [
  {
    year: '2018',
    title: 'The Frame',
    company: 'Prasad Studio',
    role: 'Video Editor · Internship',
    period: 'May 2018 – Feb 2019',
    story:
      'Where it began. Cutting footage taught me rhythm, pacing and how a story holds attention, one frame at a time.',
    points: ['Editing & post-production', 'Visual pacing and storytelling'],
  },
  {
    year: '2019',
    title: 'The Shape',
    company: 'CES Pvt. Ltd',
    role: 'Graphic Designer',
    period: 'Apr 2019 – Aug 2020',
    story:
      'Frames became forms. I designed brand materials, social graphics and campaign visuals, and learned that every shape has a job.',
    points: [
      'Marketing collateral & branding',
      'Icons, infographics & illustrations',
      'UI assets for web and mobile',
    ],
  },
  {
    year: '2020',
    title: 'The Screen',
    company: 'Pikture Associates',
    role: 'UI Designer',
    period: 'Aug 2020 – Jun 2022',
    story:
      'Shapes became screens. I designed responsive web and mobile interfaces, working with developers so every detail shipped as designed.',
    points: [
      'Responsive web & mobile UI',
      'Wireframes, prototypes & mockups',
      'Brand consistency across products',
    ],
  },
  {
    year: '2022',
    title: 'The System',
    company: 'Cloudrevel Innovations',
    role: 'Senior UI Designer',
    period: 'Nov 2022 – Feb 2026',
    story:
      'Screens became systems. I led UI for web and mobile products, grew design systems, and turned usability testing into better experiences.',
    points: [
      'Led UI for web & mobile apps',
      'Design systems at scale',
      'Usability testing & iteration',
    ],
  },
  {
    year: '2026',
    title: 'The Direction',
    company: 'Payan Design Studio',
    role: 'Senior Visual Designer',
    period: 'Feb 2026 – Present',
    story:
      'Systems became direction. Today I lead visual design across brand, campaign and digital work, turning business goals into clear creative directions.',
    points: [
      'Brand & campaign direction',
      'Client & stakeholder alignment',
      'Visual systems across touchpoints',
    ],
  },
];

// Selected work. `color` tints the placeholder frames and accents.
export const projects = [
  {
    slug: 'moneytrace',
    title: 'Moneytrace',
    category: 'Product Design',
    color: '#3DDC97',
    role: 'UX / UI Designer',
    duration: '—', // TODO(vignesh): add duration
    platform: 'Web dashboard',
    pitch:
      'A smart, real-time financial dashboard that turns complex data into clear, actionable insight.',
    brief:
      'Moneytrace helps businesses and individuals track key financial metrics and forecast trends, all from one real-time dashboard.',
    problem:
      'Financial data lived in scattered sources and manual reports. Without real-time insight, managing money and planning ahead was slow and unclear.',
    story: null, // TODO(vignesh): add your story
    process: [], // TODO(vignesh): add process steps
    competitors: [],
    tags: ['Dashboard', 'Data viz', 'Fintech'],
    cover: null,
    logo: null,
    gallery: [null, null, null],
  },
  {
    slug: 'hostengine',
    title: 'Hostengine',
    category: 'Product Design',
    color: '#5B8CFF',
    role: 'UX / UI Designer',
    duration: '6 Months',
    platform: 'Web platform',
    pitch:
      'An all-in-one hosting platform that lets startups and enterprises launch and manage websites without technical expertise.',
    brief:
      'Hostengine is a domain registrar and web-hosting provider offering domain registration, hosting, professional email and SSL certificates.',
    problem:
      'Domains, hosting, email and SSL are technical by nature. The challenge was to make all of it feel simple for people with no technical background.',
    story:
      'I had no background in web hosting. So I started by listening: asking questions and understanding how the business works. Then I designed a concept platform around what I learned.',
    process: [
      { title: 'Competitor analysis', text: 'Studied how the market leaders structure plans, onboarding and dashboards.' },
      { title: 'Information architecture', text: 'Organised domains, hosting, email and SSL into one clear structure.' },
      { title: 'User flows', text: 'Mapped key journeys, from searching for a domain to going live.' },
      { title: 'Affinity mapping', text: 'Grouped insights and pain points to set design priorities.' },
      { title: 'Wireframes', text: 'Explored layouts quickly before committing to visuals.' },
      { title: 'Hi-fi prototypes', text: 'Stakeholders were non-technical and wireframes didn’t land, so I moved to high-fidelity prototypes for clearer feedback.' },
    ],
    competitors: ['GoDaddy', 'Bluehost', 'Hostinger'],
    tags: ['Web app', 'IA', 'Prototyping'],
    cover: null,
    logo: null,
    gallery: [null, null, null],
  },
  {
    slug: 'whats-new',
    title: 'What’s New',
    category: 'App Design',
    color: '#FF6B4A',
    role: 'UI Designer', // TODO(vignesh): confirm
    duration: '—',
    platform: 'Mobile app',
    pitch: 'A mobile app design exploration. Full case study coming soon.', // TODO(vignesh)
    brief: null,
    problem: null,
    story: null,
    process: [],
    competitors: [],
    tags: ['Mobile', 'App UI'],
    cover: null,
    logo: null,
    gallery: [null, null, null],
  },
  {
    slug: 'styling-elements',
    title: 'Styling Elements',
    category: 'Visual Design',
    color: '#B49BFF',
    role: 'Visual Designer', // TODO(vignesh): confirm
    duration: '—',
    platform: 'UI elements',
    pitch: 'A study in visual styling and UI elements. Full case study coming soon.', // TODO(vignesh)
    brief: null,
    problem: null,
    story: null,
    process: [],
    competitors: [],
    tags: ['UI kit', 'Visual style'],
    cover: null,
    logo: null,
    gallery: [null, null, null],
  },
];

export const skills = [
  {
    title: 'Visual & Brand',
    items: ['Brand identity', 'Visual systems', 'Art direction', 'Campaign design', 'Presentation design'],
  },
  {
    title: 'UI / UX',
    items: ['Wireframing', 'Prototyping', 'Responsive design', 'Design systems', 'Usability testing'],
  },
  {
    title: 'Graphic',
    items: ['Logo design', 'Social media creatives', 'Marketing collateral', 'Banners', 'Infographics'],
  },
  {
    title: 'Motion',
    items: ['Micro-interactions', 'Icon animation', 'GIF animation', 'Video editing', '3D with Spline'],
  },
];

export const tools = ['Figma', 'Framer', 'Adobe XD', 'Spline', 'Photoshop', 'Illustrator', 'After Effects', 'SVGator'];

export const stats = [
  { value: 6, suffix: '+', label: 'Years designing' },
  { value: 5, suffix: '', label: 'Studios & teams' },
  { value: 4, suffix: '', label: 'Disciplines' },
  { value: 1, suffix: 'px', label: 'At a time' },
];
