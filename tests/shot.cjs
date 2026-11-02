// צילומי מסך של כל המסכים בשני רוחבים, ולוג של שגיאות JavaScript.
// usage: node tests/shot.cjs <baseUrl> <outDir> [width height]
const { chromium } = require('playwright');
const path = require('path');
const ROUTES = ['', 'foods', 'foods?id=lentil', 'plant', 'methods', 'seasons', 'recipes', 'compare', 'method'];
(async () => {
  const [base, out, w, h] = process.argv.slice(2);
  const sizes = w ? [[+w, +h]] : [[1440, 900], [390, 844]];
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [width, height] of sizes) {
    const p = await b.newPage({ viewport: { width, height } });
    p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
    await p.route('**/appofapp-gh.vercel.app/ai-menu.js', (r) => r.fulfill({ path: path.join(__dirname, 'fixtures', 'ai-menu.js'), contentType: 'application/javascript' }));
    for (const r of ROUTES) {
      await p.goto(base + '#/' + r, { waitUntil: 'networkidle' });
      await p.waitForTimeout(r.startsWith('tree') ? 3500 : 1300);
      const m = await p.evaluate(() => ({ ratio: +(document.documentElement.scrollHeight / innerHeight).toFixed(2), hs: document.documentElement.scrollWidth > innerWidth }));
      const file = `${out}/${width}-${(r || 'home').replace(/\W/g, '_')}.png`;
      await p.screenshot({ path: file });
      console.log(width, (r || 'home').padEnd(16), 'scroll', m.ratio, 'hscroll', m.hs);
    }
    await p.close();
  }
  await b.close();
})();
