// מדד "בגודל המסך" (סעיף 2.9 א), לפי templates/fit.cjs של Claude-GH, עם תוספת:
// בנייד התצוגה גוללת בתוך #view, ולכן היחס נמדד גם על הגלילה הפנימית, כדי לא להסתיר גלילה.
// usage: node tests/fit.cjs <baseUrl> <outPrefix>
const { chromium } = require('playwright');
const path = require('path');
const SIZES = [['1920', 1920, 1080], ['1440', 1440, 900], ['1280', 1280, 720], ['mob', 390, 844]];
const ROUTES = ['', 'foods', 'tree', 'seasons', 'compare', 'redlist', 'help'];
const ARTICLE = ['method']; // כתבה: החריג שבסעיף 2.9 א, נקראת בגלילה
(async () => {
  const [base, out] = process.argv.slice(2);
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
        return { ratio: +((document.documentElement.scrollHeight + extra) / H).toFixed(2), hscroll: document.documentElement.scrollWidth > W, seen };
      });
      const limit = ARTICLE.includes(h) ? Infinity : name === 'mob' ? 1.5 : 1.0;
      const bad = m.hscroll || m.ratio > limit;
      if (bad) fail++;
      const file = `${out}-${name}-${(h || 'home').replace(/\W/g, '')}.png`;
      await p.screenshot({ path: file });
      console.log(`${bad ? 'FAIL' : 'ok  '} ${name.padEnd(5)} ${(h || 'home').padEnd(9)} scroll ${String(m.ratio).padEnd(4)} (max ${limit === Infinity ? 'כתבה' : limit})  hscroll ${m.hscroll}  info-in-view ${m.seen}`);
    }
    await p.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
