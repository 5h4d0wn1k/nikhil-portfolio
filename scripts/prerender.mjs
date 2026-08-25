import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');
const distDir = join(rootDir, 'dist');
const shellPath = join(distDir, 'index.html');
const entryFile = join(scriptDir, 'prerender-entry.jsx');
const bundlePath = join(scriptDir, '.prerender-bundle.mjs');

const CANONICAL_BASE = 'https://cynik-operator.pages.dev';
const RSS_LINK =
  '<link rel="alternate" type="application/rss+xml" title="Signal Journal RSS" href="/feed.xml"/>';

const ROUTE_META = {
  '/': {
    title: 'Nikhil Nagpure — Security Engineer & Systems Builder',
    description:
      'Founder, security practitioner, and full-stack systems builder working across AI systems, application security, hardware research, and production platforms.',
  },
  '/projects': {
    title: 'Projects — Nikhil Nagpure',
    description:
      'Every system built or contributed to: open source security tools, AI experiments, production platforms, and hardware research.',
  },
  '/projects/naavis': {
    title: 'NAAVIS — Nikhil Nagpure',
    description:
      'A privacy-first autonomous intelligence system: persistent memory, consent-gated perception, action layers, and owner trust controls.',
  },
  '/projects/aline2': {
    title: 'ALine2 — Nikhil Nagpure',
    description:
      'Full-stack social-media platform: web app, backend API, Android app, and superadmin dashboard — live in production.',
  },
  '/projects/tcmone': {
    title: 'TCMONE — Nikhil Nagpure',
    description:
      'Ed-tech platform for virtual and physical classes, labs, and student workflows — live at thecodemunk.in.',
  },
  '/projects/davcreations': {
    title: 'DavCreations — Nikhil Nagpure',
    description:
      'Multivendor commerce platform with full CMS, ERP, and HRM modules — built under Shadownik.',
  },
  '/projects/cuboidpilot': {
    title: 'CuboidPilot — Nikhil Nagpure',
    description:
      'Company management operating system for CuboidSoft — admin workflows, dashboards, and operational tooling.',
  },
  '/projects/comprehensive-pentest-framework': {
    title: 'Comprehensive Pentest Framework — Nikhil Nagpure',
    description:
      'Multi-platform authorised security testing framework with 22+ modules.',
  },
  '/projects/esp32-csi-sensing': {
    title: 'ESP32 CSI Sensing — Nikhil Nagpure',
    description:
      'WiFi CSI capture, live visualisation, and presence detection.',
  },
  '/experience': {
    title: 'Work Experience — Nikhil Nagpure',
    description:
      'Verified roles: Co-Founder & Technical Lead at CuboidSoft, Founding Engineer at Pawan Technologies, Founder of Shadownik, offensive-security internships.',
  },
  '/experience/cuboidsoft': {
    title: 'CuboidSoft — Nikhil Nagpure',
    description:
      'Co-Founder & Technical Lead: engineering lead for production platforms, security-first architecture, and product delivery.',
  },
  '/experience/pawan-technologies': {
    title: 'Pawan Technologies — Nikhil Nagpure',
    description:
      'Founding Engineer: built the technical foundation, shipped the first production systems, and established engineering practices.',
  },
  '/experience/shadownik': {
    title: 'Shadownik — Nikhil Nagpure',
    description:
      'Founder: independent security and full-stack venture. DavCreations commerce platform and related systems.',
  },
  '/experience/inlighnx-global': {
    title: 'Inlighnx Global — Nikhil Nagpure',
    description:
      'Offensive Cybersecurity Intern: penetration testing, vulnerability assessment, and security reporting.',
  },
  '/experience/internship-studio': {
    title: 'Internship Studio — Nikhil Nagpure',
    description:
      'Ethical Hacking Intern: security fundamentals, lab exercises, and structured learning.',
  },
  '/achievements': {
    title: 'Achievements & Certifications — Nikhil Nagpure',
    description:
      'CEH, CNSP, PEH, IELTS 7.5 certifications; TryHackMe Top 25%; CyVIT CTF rank 36; bug bounty research.',
  },
  '/publications': {
    title: 'Publications & IP — Nikhil Nagpure',
    description:
      'Co-inventor on filed Indian patent application 202421032123 plus ongoing writing in the Signal Journal.',
  },
  '/journal': {
    title: 'Signal Journal — Nikhil Nagpure',
    description:
      'Notes from the edge of the build: systems design, security engineering, and building in public.',
  },
  '/journal/systems-over-features': {
    title: 'Systems over features — Signal Journal',
    description: 'Design for what must remain true when scale arrives.',
  },
  '/journal/security-as-design': {
    title: 'Security is a design material — Signal Journal',
    description: 'Good security makes the right action obvious.',
  },
  '/journal/build-log-protocol': {
    title: 'A build log is a force multiplier — Signal Journal',
    description: 'Small, specific notes compound into evidence of how you think.',
  },
  '/about': {
    title: 'Profile — Nikhil Nagpure',
    description:
      'One operator, many systems: founder, security practitioner, full-stack engineer, technical researcher.',
  },
  '/now': {
    title: 'Now — Nikhil Nagpure',
    description: 'Currently in motion: NAAVIS, wireless research, bug bounty, and open source.',
  },
  '/education': {
    title: 'Education — Nikhil Nagpure',
    description: 'B.Tech CSE Cybersecurity from VIT (CGPA 8.33), CEH, CNSP, PEH, IELTS 7.5 certifications.',
  },
  '/contact': {
    title: 'Contact — Nikhil Nagpure',
    description: 'For selected product, security, AI, and systems work.',
  },
};

function bundle() {
  const esbuildBin = join(rootDir, 'node_modules', '.bin', 'esbuild');
  if (!existsSync(esbuildBin)) {
    throw new Error(`esbuild not found at ${esbuildBin}. Run "npm install" first.`);
  }
  execFileSync(
    esbuildBin,
    [
      relative(rootDir, entryFile),
      '--bundle',
      '--format=esm',
      '--platform=node',
      '--jsx=automatic',
      '--loader:.css=empty',
      '--packages=external',
      `--outfile=${relative(rootDir, bundlePath)}`,
      '--log-level=warning',
    ],
    { cwd: rootDir, stdio: 'inherit' }
  );
}

const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s) => escapeText(s).replace(/"/g, '&quot;');

function replaceRootInner(html, markup) {
  const rootRe = /(<div id="root">)([\s\S]*)(<\/div>\s*<\/body>)/;
  if (!rootRe.test(html)) {
    throw new Error('Could not locate <div id="root">...</div> in the shell.');
  }
  return html.replace(rootRe, (_m, open, _old, tail) => `${open}\n${markup}\n${tail}`);
}

function swapOnce(html, pattern, replacementFactory, label, route) {
  const matches = html.match(pattern);
  if (!matches) {
    throw new Error(`Shell is missing ${label}; cannot prerender ${route}.`);
  }
  return html.replace(pattern, () => replacementFactory());
}

function applyHead(html, route, meta) {
  const canonicalUrl = CANONICAL_BASE + route + (route === "/" ? "" : "/");
  html = swapOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    () => `<title>${escapeText(meta.title)}</title>`,
    '<title>',
    route
  );
  html = swapOnce(
    html,
    /<meta\s+name="description"[^>]*>/,
    () => `<meta name="description" content="${escapeAttr(meta.description)}"/>`,
    '<meta name="description">',
    route
  );
  html = swapOnce(
    html,
    /<meta\s+property="og:title"[^>]*>/,
    () => `<meta property="og:title" content="${escapeAttr(meta.title)}"/>`,
    '<meta property="og:title">',
    route
  );
  html = swapOnce(
    html,
    /<meta\s+property="og:description"[^>]*>/,
    () => `<meta property="og:description" content="${escapeAttr(meta.description)}"/>`,
    '<meta property="og:description">',
    route
  );
  html = swapOnce(
    html,
    /<link\s+rel="canonical"[^>]*>/,
    () => `<link rel="canonical" href="${canonicalUrl}"/>`,
    '<link rel="canonical">',
    route
  );
  if (!html.includes('application/rss+xml')) {
    html = html.replace('</head>', `${RSS_LINK}\n</head>`);
  }
  return html;
}

async function main() {
  bundle();
  const { renderRoute } = await import(pathToFileURL(bundlePath).href);

  for (const [route, meta] of Object.entries(ROUTE_META)) {
    const shell = readFileSync(shellPath, 'utf8');
    const markup = renderRoute(route);
    if (!markup || !markup.includes('<')) {
      throw new Error(`renderRoute('${route}') produced empty markup.`);
    }
    let html = replaceRootInner(shell, markup);
    html = applyHead(html, route, meta);
    const outPath = route === '/' ? shellPath : join(distDir, route, 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log(`prerendered ${route} -> ${relative(distDir, outPath)} (${html.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exitCode = 1;
});
