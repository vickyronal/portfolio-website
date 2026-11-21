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
  cv: '/assets/Vignesh-G-Senior-Visual-Designer-Resume.pdf',
  // Cut-out photo (transparent PNG) the particles form during the prologue
  portrait: '/assets/images/portrait.png',
  current: 'Payan Design Studio',
  intro:
    'Senior Visual & UI Designer crafting intuitive digital experiences for startups and brands.',
  prologue:
    'Every interface begins as a single pixel. Mine began in 2018, cutting frames as a video editor. Then came shapes, then screens, then systems. Today, I lead visual design that turns briefs into stories people remember.',
};

// The Journey (experience). One chapter per role.
// HR reads: company → role → dates first. `title` is the story theme (shown small).
// type: 'Internship' etc. (a role with 'Present' is marked Current automatically)
// tools: shown as chips · work: project slugs from `projects`, linked as case studies
export const journey = [
  {
    year: '2018',
    title: 'The Frame',
    company: 'Prasad Studio',
    short: 'Prasad Studio',
    type: 'Internship',
    tools: ['After Effects', 'Photoshop'], // TODO(vignesh): confirm
    work: [],
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
    short: 'CES',
    tools: ['Photoshop', 'Illustrator'],
    work: [],
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
    short: 'Pikture',
    tools: ['Adobe XD', 'Figma', 'Photoshop'],
    work: [],
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
    short: 'Cloudrevel',
    tools: ['Figma', 'Framer', 'Spline'],
    work: ['spacira', 'hostengine'],
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
    short: 'Payan',
    tools: ['Figma', 'Illustrator', 'Photoshop'],
    work: ['edge-branding', 'edge-landing-page', 'meridian'],
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

// All projects. The first ones marked `featured` (default true) show on the
// home page; every project appears on the All work page (/work/).
// To add a project: add an entry here, then run
//   npm run new-project <slug> "<Title>"
// which creates its case-study page. Set `featured: false` to keep it off the home page.
// `color` tints accents and placeholders.
// Fields: company, role, platform, duration ('—' hides it), link (live site),
// pitch, brief, problem, solution, story, scope[], highlights[], process[],
// competitors[], tags[], cover / logo (card thumbnail), gallery[] (case-study screens).
export const projects = [
  {
    slug: 'edge-branding',
    featured: false, // shown on the All work page only
    title: 'Edge Branding',
    category: 'Brand Identity',
    company: 'Payan Design Studio',
    color: '#2F5BFF',
    role: 'Senior Visual Designer',
    platform: 'Logo + brand identity',
    duration: '—', // TODO(vignesh)
    link: 'https://www.thunai.ai/edge',
    pitch: 'A logo and identity built from the product’s story: a monitor that captures, a dot that thinks.',
    // Short one-line headings shown above each case-study section
    headlines: {
      brief: "A private AI notetaker that lives on your desktop.",
      problem: "A brand-new product with no identity yet.",
      solution: "A symbol that tells the product’s story.",
      role: "From a blank page to a brand system.",
    },
    brief:
      'Edge is a cross-platform app from Thunai that records calls and meetings, capturing audio and screen. It creates summaries, action items and next steps using local AI models that keep conversations on your device.',
    problem:
      'A brand-new product needed an identity from scratch. It had to say “private, local AI that takes your notes” at a glance, and stay sharp everywhere from an app icon to a stage screen.',
    solution:
      'The symbol is the story: a monitor (capture) plus a dot (intelligence) equals the Edge symbol (AI notes). It sits inside the wordmark, set in Poppins with Edge blue #0028F5, and is backed by clear-space rules, three logo versions and a full set of brand applications.',
    story:
      'We started from a blank page. I studied what the product is really trying to say, turned that idea into the mark, and then built the system around it. This logo is what opened the door to designing the Edge website as well.',
    scope: ['Logo concept', 'Brand identity', 'Typography & colour', 'Brand guidelines', 'Applications & merch'],
    highlights: [
      { title: 'Monitor + dot = Edge', text: 'Capture and intelligence combined into one simple symbol that explains the product without words.' },
      { title: 'Three versions, one logo', text: 'Primary on white, secondary on Edge blue, and black & white, each with a clear-space rule of one “e” height.' },
      { title: 'Built to travel', text: 'App icon, product UI, merch, ID cards and event screens all carry the same calm, private, sharp voice.' },
    ],
    process: [],
    competitors: [],
    tags: ['Logo', 'Identity', 'Guidelines'],
    cover: '/assets/images/edge-branding/cover.jpg',
    logo: null,
    gallery: ["/assets/images/edge-branding/gallery-01.jpg", "/assets/images/edge-branding/gallery-02.jpg", "/assets/images/edge-branding/gallery-03.jpg", "/assets/images/edge-branding/gallery-04.jpg", "/assets/images/edge-branding/gallery-05.jpg", "/assets/images/edge-branding/gallery-06.jpg", "/assets/images/edge-branding/gallery-07.jpg", "/assets/images/edge-branding/gallery-08.jpg"],
  },
  {
    slug: 'edge-landing-page',
    title: 'Edge Landing Page',
    category: 'Web Design',
    company: 'Payan Design Studio',
    color: '#3DDC97',
    role: 'Senior Visual Designer',
    platform: 'Landing page · desktop & mobile',
    duration: '—', // TODO(vignesh)
    link: 'https://www.thunai.ai/edge',
    pitch: 'Less integration. More action. A landing page that makes local-first AI for contact centres instantly clear.',
    // Short one-line headings shown above each case-study section
    headlines: {
      brief: "A desktop AI companion for contact centres.",
      problem: "AI stacks are expensive, and hard to explain.",
      solution: "One page, one clear story.",
      role: "Designing the story after the brand.",
    },
    brief:
      'Edge is a desktop AI companion by Thunai. It quietly captures meetings, calls and on-screen work with no bots joining the call, and turns conversations into notes, action items and finished workflows using local, cloud or hybrid AI.',
    problem:
      'Typical AI stacks cost too much: every tool brings its own connectors, middleware and per-minute fees. The page had to make “local-first AI” understandable, and trustworthy, for support teams and CX leaders.',
    solution:
      'A story-led page: the problem with typical AI stacks, who Edge is for, the core features (audio & screen, Edge Actions, manual trigger, local AI, cloud or hybrid), how it works (Capture. Act. Learn.), security, and a clear path to download.',
    story:
      'After the branding, we designed the website as one continuous story rather than a list of features, starting from the real job to be done: after a one-minute support call, the summary, ticket notes and next step are ready before the next call starts.',
    scope: ['Landing page UX & UI', 'Desktop & mobile', 'Product storytelling', 'Type & colour system'],
    highlights: [
      { title: 'Designed for who’s on the call', text: 'Support reps and CX leaders come first; product managers, doctors and sales reps who want private notes come second.' },
      { title: 'Problem before features', text: 'The page opens with the cost of a typical AI stack, so “zero integration” lands before any feature list.' },
      { title: 'Calm, editorial type', text: 'Bricolage Grotesque with Instrument Sans: precise and calm, matching a product that turns messy conversations into clean updates.' },
    ],
    process: [],
    competitors: [],
    tags: ['Landing page', 'AI product', 'Responsive'],
    cover: '/assets/images/edge-landing-page/cover.jpg',
    logo: null,
    gallery: ["/assets/images/edge-landing-page/gallery-01.jpg", "/assets/images/edge-landing-page/gallery-02.jpg", "/assets/images/edge-landing-page/gallery-03.jpg", "/assets/images/edge-landing-page/gallery-04.jpg", "/assets/images/edge-landing-page/gallery-05.jpg", "/assets/images/edge-landing-page/gallery-06.jpg", "/assets/images/edge-landing-page/gallery-07.jpg", "/assets/images/edge-landing-page/gallery-08.jpg", "/assets/images/edge-landing-page/gallery-09.jpg", "/assets/images/edge-landing-page/gallery-10.jpg"],
  },
  {
    slug: 'meridian',
    title: 'Meridian',
    category: 'Web Design',
    company: 'Payan Design Studio',
    color: '#5B8CFF',
    role: 'Senior Visual Designer',
    platform: 'Website redesign',
    duration: '—', // TODO(vignesh)
    link: 'https://onmeridian.com/',
    pitch: 'A full website redesign for an enterprise cloud & AI partner, from the home page to a licence-buying journey.',
    // Short one-line headings shown above each case-study section
    headlines: {
      brief: "One partner for cloud, security, data & AI.",
      problem: "Too many services, too much complexity.",
      solution: "Clear paths: understand, explore, buy.",
      role: "A complete website redesign.",
    },
    brief:
      'Meridian is a Microsoft Tier 1 and AWS partner that helps enterprises with cloud infrastructure, security, data & AI, workplace productivity, and a cloud marketplace for buying software licences.',
    problem:
      'Meridian offers a wide range of complex services across many industries. The website had to make it easy to understand what they do, who it is for, and how to buy, without drowning visitors in technical detail.',
    solution:
      'A capability-led structure with a confident home page, six service pages, industry solutions, an Agentic AI Playground showcase, and a product page with a licence purchase flow. Every path ends in a clear next step: talk to an expert, or buy.',
    story:
      'We redesigned the website end to end at Payan Design Studio. It wasn’t a full product build: our scope was the home page, six inner pages and the product page, including the journey for purchasing licences from the marketplace.',
    scope: ['Home page', '6 inner pages', 'Product page', 'Licence purchase flow'],
    highlights: [
      { title: 'One partner, one story', text: 'Cloud, security, data & AI and productivity presented as one connected ecosystem instead of separate offerings.' },
      { title: 'Industry entry points', text: 'Manufacturing, retail, healthcare and BFSI each get a direct path to the solutions that matter to them.' },
      { title: 'From browsing to buying', text: 'A product journey that takes a visitor from exploring a licence to choosing a plan and purchasing.' },
    ],
    process: [],
    competitors: [],
    tags: ['Enterprise', 'Cloud & AI', 'Website'],
    cover: '/assets/images/meridian/cover.jpg',
    logo: null,
    gallery: ["/assets/images/meridian/gallery-01.jpg", "/assets/images/meridian/gallery-02.jpg", "/assets/images/meridian/gallery-03.jpg", "/assets/images/meridian/gallery-04.jpg", "/assets/images/meridian/gallery-05.jpg", "/assets/images/meridian/gallery-06.jpg", "/assets/images/meridian/gallery-07.jpg", "/assets/images/meridian/gallery-08.jpg", "/assets/images/meridian/gallery-09.jpg"],
  },
  {
    slug: 'spacira',
    title: 'Spacira',
    category: 'Product Design',
    company: 'Cloudrevel Innovations',
    color: '#FF7A3D',
    role: 'Senior UI Designer',
    platform: 'Web platform + dashboards',
    duration: '—', // TODO(vignesh)
    link: 'https://spacira.com/',
    pitch: 'Dubai’s first AI-powered property platform, connecting owners, tenants and developers in one place.',
    // Short one-line headings shown above each case-study section
    headlines: {
      brief: "Dubai’s first AI-powered property platform.",
      problem: "Property deals are slow and hard to trust.",
      solution: "One trustworthy hub for every step.",
      role: "The complete product, end to end.",
    },
    brief:
      'Spacira lets people buy, sell, rent and manage property in Dubai. Owners list and verify properties, tenants get AI-matched homes, and leases, payments and services all happen on one platform.',
    problem:
      'Property deals in Dubai involve brokers, paperwork and scattered tools. Listings aren’t always trustworthy, fees are unclear, and owners juggle leases, payments and maintenance across different systems.',
    solution:
      'One trustworthy hub: verified listings, AI property matching, zero-brokerage deals, a four-step journey from listing to secure contract, and a single dashboard for leases, payments and home services.',
    story:
      'I designed the complete product, from the marketing website to the owner and tenant dashboards. The goal was to make a big, high-trust decision feel calm, clear and transparent at every step.',
    scope: ['End-to-end product design', 'Marketing website', 'Owner & tenant dashboards', 'Listing → contract flows'],
    highlights: [
      { title: '4 steps, zero stress', text: 'List the property, get verified, match tenants and sign a secure contract, each step simple on its own.' },
      { title: 'Trust built in', text: 'Verified listings, transparent pricing and secure documents are surfaced up front, not hidden in fine print.' },
      { title: 'AI that explains itself', text: 'Matching, insights and the 24/7 assistant are presented in plain language, so the AI feels helpful, not mysterious.' },
    ],
    process: [],
    competitors: [],
    tags: ['Proptech', 'AI', 'Web app'],
    cover: '/assets/images/spacira/cover.jpg',
    logo: null,
    gallery: ['/assets/images/spacira/gallery-1.jpg', '/assets/images/spacira/gallery-2.jpg', '/assets/images/spacira/gallery-3.jpg'],
  },
  {
    slug: 'hostengine',
    title: 'Hostengine',
    category: 'Product Design',
    company: 'Cloudrevel Innovations',
    color: '#6C6BFF',
    role: 'UX / UI Designer',
    platform: 'Web platform',
    duration: '6 Months',
    link: 'https://hostengine.com/',
    pitch: 'A domain & DNS platform that lets startups and enterprises launch and manage websites without technical expertise.',
    // Short one-line headings shown above each case-study section
    headlines: {
      brief: "Domains, DNS and hosting in one place.",
      problem: "Technical services, for non-technical people.",
      solution: "Friendly design in plain language.",
      role: "Learning a new world by listening first.",
    },
    brief:
      'Hostengine is a domain registrar and DNS provider: domain registration, DNS management, CDN, website hosting and load balancing, all managed from one interface.',
    problem:
      'Domains, DNS, hosting and SSL are technical by nature. The challenge was to make all of it feel simple, and even friendly, for people with no technical background.',
    solution:
      'A colourful, approachable identity instead of a cold technical one: search-first domain discovery, services explained in plain language, clear plan comparison, and FAQs that answer the questions people are afraid to ask.',
    story:
      'I had no background in web hosting. So I started by listening: asking questions and understanding how the business works. Then I designed a concept platform around what I learned.',
    scope: ['Product UX/UI', 'Marketing website', 'Domain search & purchase', 'Pricing & plans'],
    highlights: [],
    process: [
      { title: 'Competitor analysis', text: 'Studied how the market leaders structure plans, onboarding and dashboards.' },
      { title: 'Information architecture', text: 'Organised domains, hosting, email and SSL into one clear structure.' },
      { title: 'User flows', text: 'Mapped key journeys, from searching for a domain to going live.' },
      { title: 'Affinity mapping', text: 'Grouped insights and pain points to set design priorities.' },
      { title: 'Wireframes', text: 'Explored layouts quickly before committing to visuals.' },
      { title: 'Hi-fi prototypes', text: 'Stakeholders were non-technical and wireframes didn’t land, so I moved to high-fidelity prototypes for clearer feedback.' },
    ],
    competitors: ['GoDaddy', 'Bluehost', 'Hostinger'],
    tags: ['Domains & DNS', 'IA', 'Prototyping'],
    cover: '/assets/images/hostengine/cover.jpg',
    logo: null,
    gallery: ['/assets/images/hostengine/gallery-1.jpg', '/assets/images/hostengine/gallery-2.jpg', '/assets/images/hostengine/gallery-3.jpg'],
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
  { value: 7, suffix: '+', label: 'Years designing' },
  { value: 5, suffix: '', label: 'Studios & teams' },
  { value: 4, suffix: '', label: 'Disciplines' },
  { value: 1, suffix: 'px', label: 'At a time' },
];
