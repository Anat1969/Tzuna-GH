// מסגרות לפי התוכן (החלטת ענת, 09.11.2026: "לא לקבע את המסגרות"): הדף נגלל כרגיל.
// הבדיקה: אין מסגרת עם גלילה אנכית פנימית, ואין גלילה אופקית. היחס לגובה המסך מדווח בלבד.
// usage: node tests/fit.cjs <baseUrl> <outPrefix>
const { chromium } = require('playwright');
const path = require('path');
const SIZES = [['1920', 1920, 1080], ['1440', 1440, 900], ['1280', 1280, 720], ['mob', 390, 844]];
const ROUTES = ['', 'foods', 'plant', 'methods', 'seasons', 'recipes', 'compare'];
const ARTICLE = ['method']; // כתבה: החריג שבסעיף 2.9 א, נקראת בגלילה
(async () => {
  const [base, out = require('os').tmpdir() + '/fit'] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let fail = 0;
  for (const [name, width, height] of SIZES) {
    const p = await b.newPage({ viewport: { width, height } });
    await p.route('**/appofapp-gh.vercel.app/ai-menu.js', (r) => r.fulfill({ path: path.join(__dirname, 'fixtures', 'ai-menu.js'), contentType: 'application/javascript' }));
    for (const h of [...ROUTES, ...ARTICLE]) {
      await p.goto(base + '#/' + h, { waitUntil: 'networkidle' });
      await p.waitForTimeout(h === 'tree' ? 2500 : 900);
      const m = await p.evaluate(() => {
        const H = innerHeight, W = innerWidth, v = document.querySelector('#view');
        const extra = Math.max(0, v.scrollHeight - v.clientHeight);
        let seen = 0;
        for (const el of document.querySelectorAll('h1,h2,h3,p,li,td,th,dd,dt,figure,svg,canvas,img,.num,[data-info],.stratum,.food-card')) {
          const r = el.getBoundingClientRect();
          if (r.width > 4 && r.height > 4 && r.top < H && r.bottom > 0 && r.left < W && r.right > 0) seen++;
        }
        const inner = [...v.querySelectorAll('*')].filter((el) => { const o = getComputedStyle(el).overflowY; return /(auto|scroll)/.test(o) && el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 40; }).map((el) => el.className.toString().split(' ')[0] || el.tagName);
        return { ratio: +((document.documentElement.scrollHeight + extra) / H).toFixed(2), hscroll: document.documentElement.scrollWidth > W, seen, inner };
      });
      const bad = m.hscroll || m.inner.length > 0;
      if (bad) fail++;
      const file = `${out}-${name}-${(h || 'home').replace(/\W/g, '')}.png`;
      await p.screenshot({ path: file });
      console.log(`${bad ? 'FAIL' : 'ok  '} ${name.padEnd(5)} ${(h || 'home').padEnd(9)} page ${String(m.ratio).padEnd(4)} hscroll ${m.hscroll}  inner-scroll ${m.inner.length ? m.inner.join(',') : 0}  info-in-view ${m.seen}`);
    }
    await p.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
