export default {
  // --- IDENTITY ---
  name: 'Nikhil Nagpure',
  initials: 'N.N',
  brand: 'CYNiK/OPERATOR',
  tagline: 'Founder · Security practitioner · full-stack systems builder.',
  email: 'nikhilnagpure203@gmail.com',
  github: '5h4d0wn1k',
  linkedin: 'nikhilnagpure24',
  tryhackme: '5H4D0WN1K',

  // --- DOMAIN ---
  siteUrl: 'https://cynik-operator.pages.dev',

  // --- D1 DATABASE (optional — remove if not using D1) ---
  d1DatabaseId: '', // fill in after running: wrangler d1 create portfolio-db

  // --- HOME PAGE STATS ---
  stats: [
    { value: '57', label: 'PUBLIC REPOSITORIES' },
    { value: '06', label: 'CONNECTED DISCIPLINES' },
    { value: '01', label: 'OPERATOR' },
  ],

  // --- NAVIGATION ---
  nav: [
    { href: '/projects', label: 'Projects' },
    { href: '/experience', label: 'Experience' },
    { href: '/achievements', label: 'Achievements' },
    { href: '/publications', label: 'Publications' },
    { href: '/education', label: 'Education' },
    { href: '/journal', label: 'Journal' },
    { href: '/about', label: 'Profile' },
  ],

  // --- FOOTER ---
  footer: {
    tagline: 'BUILD CAREFULLY. LEARN IN PUBLIC. <em>LEAVE SYSTEMS STRONGER.</em>',
    copyright: `© ${new Date().getFullYear()} YOUR NAME`,
  },
};
