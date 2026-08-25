import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { posts } from '../src/content.js';

const configPath = new URL('../src/site.config.js', import.meta.url);
const configContent = readFileSync(configPath, 'utf8');
const urlMatch = configContent.match(/siteUrl:\s*'([^']+)'/);
const SITE = urlMatch ? urlMatch[1] : 'http://localhost:3000';
const nameMatch = configContent.match(/name:\s*'([^']+)'/);
const SITE_NAME = nameMatch ? nameMatch[1] : 'Portfolio';

const outDir = process.argv[2] || 'dist';

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

// '2026 · SIGNAL NN' → RFC-822 date for the NNth month of 2026, day 5.
function parsePubDate(dateStr) {
  const m = /(\d{4})\s*·\s*SIGNAL\s*(\d+)/i.exec(String(dateStr));
  if (!m) return null;
  const [, year, signal] = m;
  const d = new Date(Date.UTC(Number(year), Number(signal) - 1, 5));
  return Number.isNaN(d.getTime()) ? null : d.toUTCString();
}

const items = posts
  .map((post) => {
    const url = `${SITE}/journal/${post.id}`;
    const pubDate = parsePubDate(post.date);
    return [
      '    <item>',
      `      <title>${esc(post.title)}</title>`,
      `      <link>${esc(url)}</link>`,
      `      <guid isPermaLink="true">${esc(url)}</guid>`,
      `      <description>${esc(post.dek)}</description>`,
      ...(post.tags ?? []).map((tag) => `      <category>${esc(tag)}</category>`),
      ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
      '    </item>',
    ].join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Signal Journal</title>
    <link>${SITE}/journal</link>
    <description>Notes on security engineering, systems design, and building in public.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'feed.xml'), xml);
console.log(`feed.xml written to ${join(outDir, 'feed.xml')} (${posts.length} items)`);
