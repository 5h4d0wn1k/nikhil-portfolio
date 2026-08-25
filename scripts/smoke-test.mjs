import { JSDOM } from 'jsdom';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const dist = join(process.cwd(), 'dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const routes = ['/', '/projects', '/projects/naavis', '/projects/aline2', '/projects/tcmone', '/projects/davcreations', '/projects/cuboidpilot', '/projects/comprehensive-pentest-framework', '/projects/esp32-csi-sensing', '/experience', '/experience/cuboidsoft', '/experience/pawan-technologies', '/experience/shadownik', '/experience/inlighnx-global', '/experience/internship-studio', '/achievements', '/publications', '/education', '/journal', '/journal/systems-over-features', '/about', '/now', '/contact'];
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  const candidate = join(dist, path);
  const target = existsSync(candidate) && extname(candidate) ? candidate : join(dist, 'index.html');
  try {
    res.writeHead(200, { 'content-type': mime[extname(target)] || 'text/html' });
    res.end(readFileSync(target));
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
await new Promise(r => server.listen(4199, r));

const expect = {
  '/': 'SELECTED SYSTEMS',
  '/projects': 'BUILD ARCHIVE', '/projects/naavis': 'NAAVIS', '/projects/aline2': 'ALINE2',
  '/projects/tcmone': 'TCMONE', '/projects/davcreations': 'DAVCREATIONS', '/projects/cuboidpilot': 'CUBOIDPILOT',
  '/projects/comprehensive-pentest-framework': 'PENTEST', '/projects/esp32-csi-sensing': 'ESP32',
  '/experience': 'Co-Founder & Technical Lead', '/experience/cuboidsoft': 'CUBOIDSOFT',
  '/experience/pawan-technologies': 'PAWAN', '/experience/shadownik': 'SHADOWNIK',
  '/experience/inlighnx-global': 'INLIGHNX', '/experience/internship-studio': 'INTERNSHIP',
  '/achievements': 'EC-COUNCIL', '/publications': 'Self-Cleaning Glasses Case System',
  '/education': 'B.TECH',
  '/journal': 'SIGNAL JOURNAL', '/journal/systems-over-features': 'invariants',
  '/about': 'One operator', '/now': 'CURRENTLY', '/contact': 'OPEN CHANNEL'
};
let failed = 0;
for (const route of routes) {
  const errors = [];
  let html = readFileSync(join(dist, 'index.html'), 'utf8').replace(/type="module"/g, '');
  const dom = new JSDOM(html, {
    url: `http://localhost:4199${route}`, runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) { w.addEventListener('error', e => errors.push(e.message)); }
  });
  await new Promise((done) => {
    const t = setTimeout(done, 6000);
    dom.window.addEventListener('load', () => setTimeout(() => { clearTimeout(t); done(); }, 600));
  });
  const text = dom.window.document.body.textContent || '';
  const ok = errors.length === 0 && text.toUpperCase().includes(expect[route].toUpperCase());
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${route}${errors.length ? ' ERRORS: ' + errors.join(' | ') : ''}`);
  dom.window.close();
}
server.close();
process.exit(failed ? 1 : 0);
