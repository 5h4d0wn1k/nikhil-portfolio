import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="bg" cx="65%" cy="45%" r="90%">
      <stop offset="0%" stop-color="#1a2240"/>
      <stop offset="55%" stop-color="#0d1120"/>
      <stop offset="100%" stop-color="#090b10"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1010" cy="120" r="220" fill="none" stroke="#d7ff3f" stroke-opacity="0.12" stroke-width="1.5"/>
  <circle cx="1010" cy="120" r="150" fill="none" stroke="#d7ff3f" stroke-opacity="0.18" stroke-width="1.5"/>
  <text x="80" y="180" font-family="Arial, sans-serif" font-size="26" letter-spacing="8" fill="#d7ff3f">SYSTEMS BUILDER · INDIA / WORLDWIDE</text>
  <text x="74" y="330" font-family="Arial Black, Arial, sans-serif" font-size="128" font-weight="900" letter-spacing="-4" fill="#f1ede4">NIKHIL</text>
  <text x="74" y="450" font-family="Arial Black, Arial, sans-serif" font-size="128" font-weight="900" letter-spacing="-4" fill="none" stroke="#f1ede4" stroke-opacity="0.85">NAGPURE</text>
  <text x="80" y="530" font-family="Arial, sans-serif" font-size="30" fill="#b8b3a6">Founder · Security practitioner · Full-stack systems architect.</text>
  <text x="80" y="578" font-family="Courier New, monospace" font-size="22" fill="#d7ff3f">cynik-operator.pages.dev</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
console.log('og-image.png generated');
