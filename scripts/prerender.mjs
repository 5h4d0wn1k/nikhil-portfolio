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
  '/work': {
    title: 'Work — Nikhil Nagpure',
    description:
      'Selected systems: NAAVIS autonomous intelligence, API security platform, wireless hardware research, shipped product systems.',
  },
  '/work/naavis': {
    title: 'NAAVIS Case Study — Nikhil Nagpure',
    description:
      'A privacy-first autonomous intelligence system: persistent memory, consent-gated perception, action layers, and owner trust controls.',
  },
  '/projects': {
    title: 'Projects Archive — Nikhil Nagpure',
    description:
      'The public build archive: ~20 open-source security tools, AI experiments, Linux utilities, and product systems.',
  },
  '/experience': {
    title: 'Work Experience — Nikhil Nagpure',
    description:
      'Verified roles: Co-Founder & Technical Lead at CuboidSoft, Founding Engineer at Pawan Technologies, Founder of Shadownik, offensive-security internships.',
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
    description: 'Currently in motion: NAAVIS, API security, and ESP32 wireless research.',
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
