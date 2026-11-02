// בדיקת קצה לקצה: כל כפתור, שכבת הבטיחות, שמירה מקומית, מצב בכתובת, התקנה, הפחתת תנועה ו-RTL.
// usage: node tests/e2e.cjs [baseUrl]   (ברירת מחדל: שרת מקומי שעולה מהריפו)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) { pass++; console.log('  ok   ' + msg); } else { fail++; console.log('  FAIL ' + msg); } };

function serve() {
  return new Promise((res) => {
    const s = http.createServer((req, r) => {
      const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(ROOT, u === '/' ? 'index.html' : u);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(r);
    }).listen(0, () => res(s));
  });
}

(async () => {
  let server, base = process.argv[2];
  if (!base) { server = await serve(); base = `http://localhost:${server.address().port}/`; }
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/fonts|favicon|ERR_/.test(m.text())) errors.push(m.text()); });
  await p.route('**/appofapp-gh.vercel.app/ai-menu.js', (r) => r.fulfill({ path: path.join(__dirname, 'fixtures', 'ai-menu.js'), contentType: 'application/javascript' }));
  const go = async (h, wait = 700) => { await p.goto(base + h, { waitUntil: 'networkidle' }); await p.waitForTimeout(wait); };
  const hash = () => p.evaluate(() => location.hash);

  console.log('מעטפת');
  await go('');
  ok(await p.locator('ai-menu .logo').isVisible(), 'כפתור הלוגו A&I גלוי בסרגל');
  ok(!(await p.locator('header >> text=העתקת קישור').first().isVisible().catch(() => false)), 'אין כפתורי פיתוח חופשיים בסרגל');
  ok(await p.evaluate(() => document.documentElement.dir === 'rtl' && getComputedStyle(document.querySelector('.view-in')).direction === 'rtl'), 'RTL בשורש ובתצוגה');
  ok(!(await p.locator('.statusbar >> text=לא מאבחן').count()), 'בלי הצהרות ואזהרות בשורת המצב');
  ok(await p.locator('.statusbar a.quiet-link[href="#/method"]').count() === 1, 'קישור שקט אחד למקורות והערות');

  console.log('דף הבית');
  for (const k of ['known', 'said', 'believed']) {
    await p.click(`#demo [data-k="${k}"]`);
    ok(await p.locator(`#demo [data-k="${k}"].is-on`).count() === 1, `הדגמה: לחיצה על שכבת ${k} מסמנת אותה`);
  }
  await p.click('[data-mode="quiz"]');
  await p.click('#demo-body [data-a="known"]');
  ok(await p.locator('#next-q').isVisible(), 'מבחן דקה: תשובה מציגה משוב וכפתור "עוד טענה"');
  await p.click('#next-q');
  ok(await p.locator('#demo-body [data-a]').count() === 3, 'מבחן דקה: שאלה חדשה עם שלוש תשובות');
  await go('');
  await p.click('[data-mode="quiz"]');
  ok((await p.textContent('#demo-explain')).includes('מתוך'), 'מבחן דקה: הציון נשמר אחרי רענון');
  for (const [door, view] of [['הכר', 'foods'], ['הבן', 'plant'], ['השתמש', 'seasons']]) {
    await go('');
    await p.click(`.door:has-text("${door}")`);
    await p.waitForTimeout(300);
    ok((await hash()).startsWith('#/' + view), `דלת "${door}" מובילה ל-${view}`);
  }

  console.log('ניווט');
  for (const v of ['foods', 'plant', 'methods', 'seasons', 'recipes', 'compare']) {
    await p.click(`.tab[data-view="${v}"]`);
    await p.waitForTimeout(400);
    ok(await p.locator(`.tab[data-view="${v}"][aria-current="page"]`).count() === 1 && (await p.locator('#view').innerText()).length > 50, `לשונית ${v} נפתחת ומסומנת`);
  }
  await p.click('.brand');
  ok((await hash()) === '#/' || (await hash()) === '', 'שם האפליקציה מוביל לבית');

  console.log('מזון');
  await go('#/foods');
  ok(await p.locator('.food-card').count() === 34, '34 גיליונות בגלריה');
  ok(!(await p.locator('.food-card >> text=ג\'עדה').count()), 'צמח מהרשימה האדומה לא בגלריה');
  await p.click('.food-card[data-id="fig"]');
  ok((await hash()).includes('id=fig') && (await p.textContent('#sheet-title')).includes('תאנה'), 'בחירת כרטיס פותחת גיליון ושומרת בכתובת');
  ok(await p.locator('#sheet .stratum').count() >= 3, 'הגיליון מציג שלוש שכבות');
  ok(await p.locator('#sheet .unique').count() === 1 && await p.locator('#sheet .t-body').count() === 1 && await p.locator('#sheet .t-soul').count() === 1, 'ייחודיות, גוף ונפש בגיליון');
  ok(!(await p.locator('#sheet .safety-line, #sheet .tone-red').count()), 'בלי אזהרות שימוש בגיליון');
  ok(await p.locator('#sheet details.sources-box:not([open])').count() === 1, 'מקורות מקופלים במקום אחד');
  await p.click('#sheet [data-step="1"]');
  ok((await p.textContent('#sheet-title')).includes('רימון'), 'כפתור "הבא" עובר לפריט הבא');
  await p.click('#sheet [data-step="-1"]');
  ok((await p.textContent('#sheet-title')).includes('תאנה'), 'כפתור "הקודם" חוזר');
  await p.keyboard.press('ArrowLeft');
  ok((await p.textContent('#sheet-title')).includes('רימון'), 'חץ במקלדת עובר פריט');
  await p.click('#sheet [data-close]');
  ok(!(await p.locator('#sheet-title').count()), 'איקס סוגר את הגיליון');
  await p.click('[data-cat="legumes"]');
  ok(await p.locator('.food-card').count() === 4, 'בורר: "קטניות" מציג 4');
  await p.click('[data-add="nuts"]');
  ok(await p.locator('.food-card').count() === 7, 'בורר: "+" מוסיף אגוזים (7)');
  await p.click('[data-rem="nuts"]');
  ok(await p.locator('.food-card').count() === 4, 'בורר: "−" מסיר');
  await p.click('[data-cat="legumes"]');
  ok(await p.locator('.food-card').count() === 34, 'בורר: לחיצה על הבחירה היחידה מחזירה להכול');
  await p.click('[data-cat="seven"]');
  await p.click('[data-cat=""]');
  ok(await p.locator('.food-card').count() === 34, 'בורר: "הכול" מאפס');

  console.log('חיפוש ובטיחות');
  await p.fill('#q', 'תאנה');
  await p.waitForTimeout(200);
  ok(await p.locator('.food-card.hit').count() >= 1 && await p.locator('.food-card.dim').count() > 10, 'חיפוש מדגיש התאמות ומעמעם את השאר');
  await p.fill('#q', 'סוכ');
  await p.waitForTimeout(200);
  ok(await p.locator('.food-card.hit').count() === 0, 'מילה קצרה חייבת להיות שלמה ("סוכ" לא תופס "סוכר")');
  await p.click('#q-x');
  ok((await p.inputValue('#q')) === '' && await p.locator('.food-card.dim').count() === 0, 'איקס מאפס את החיפוש');
  for (const [q, expect] of [['כאב בחזה', '101'], ['הבן שלי בלע תרופה', '04-7771900'], ['הפסקתי לקחת את הכדורים', 'רופא'], ['מה המינון של מרווה', 'אין כאן מינונים'], ['כמה קלוריות בתמר', 'לא סופרים']]) {
    await p.fill('#q', '');
    await p.fill('#q', q);
    await p.waitForTimeout(250);
    const t = await p.locator('#safety-overlay').innerText().catch(() => '');
    ok(t.includes(expect), `"${q}" פותח מסך בטיחות (${expect})`);
    await p.keyboard.press('Escape');
  }
  await p.fill('#q', 'דיאטה ים תיכונית');
  await p.waitForTimeout(250);
  ok(!(await p.locator('#safety-overlay').count()), 'מונח מחקרי ("דיאטה ים תיכונית") לא מקפיץ אזהרה');
  await p.click('#q-x');

  console.log('התנגשויות');
  await go('#/foods?id=lentil');
  ok((await p.locator('#sheet .t-without').innerText()).includes('תה שחור'), 'עדשים: "לא הולך עם" תה שחור (ספיגת ברזל)');
  ok((await p.locator('#sheet .t-with').innerText()).includes('לימון'), 'עדשים: "הולך עם" לימון');
  await go('#/foods?id=grapefruit');
  ok((await p.locator('#sheet .t-without').innerText()).includes('תרופות'), 'אשכולית: התנגשות עם תרופות כתוכן');

  console.log('צמח וגוף');
  await go('#/plant');
  for (const id of ['stem', 'leaf', 'flower', 'fruit', 'seed', 'root']) {
    await p.click(`.pl-chips [data-part="${id}"]`);
    ok((await hash()).includes('p=' + id) && await p.locator(`.pl-svg .pz.on[data-part="${id}"]`).count() === 1 && await p.locator(`.bd-svg .bz.on[data-part="${id}"]`).count() === 1, `חלק ${id}: צמח וגוף מסונכרנים`);
  }
  await p.click('.pl-svg .pz[data-part="leaf"] path.f >> nth=0');
  ok((await p.textContent('#pl-title')).includes('עלה') && (await p.locator('#pl-aside').innerText()).includes('נשמה'), 'לחיצה על העלה בציור: ריאות ונשמה');
  ok((await p.locator('.pl-quote').innerText()).includes('Darwin'), 'ציטוט דרווין');
  await go('#/tree');
  ok((await p.locator('#pl-title').count()) === 1, 'הכתובת הישנה #/tree מובילה לצמח וגוף');

  console.log('שיטות');
  await go('#/methods');
  ok(await p.locator('.mt tbody tr').count() === 11 && await p.locator('.tl .tl-m').count() === 11, '11 שיטות בציר ובטבלה');
  await p.click('.mt tbody tr[data-m="ayurveda"]');
  ok((await p.textContent('#mt-title')).includes('איורוודה') && (await hash()).includes('m=ayurveda'), 'בחירת שיטה מהטבלה');
  await p.click('.tl .tl-m[data-m="washoku"]', { force: true });
  ok((await p.textContent('#mt-title')).includes('וושוקו'), 'בחירת שיטה מהציר');

  console.log('עונות');
  await go('#/seasons?m=6');
  ok((await p.textContent('#m-title')).includes('יוני'), 'חודש מהכתובת');
  ok(await p.locator('.yg').count() === 1, 'מפה שנתית כברירת מחדל');
  await p.click('.yg-m[data-m="9"]');
  ok(await p.locator('.yg i.col.on').count() >= 1, 'עמודת החודש מסומנת במפה');
  await p.click('[data-mode="wheel"]');
  ok(await p.locator('.wheel .msec').count() === 12 && (await hash()).includes('v=wheel'), 'מעבר לגלגל');
  await p.click('.msec[data-m="9"]');
  ok((await p.textContent('#m-title')).includes('ספטמבר') && (await hash()).includes('m=9'), 'לחיצה על חודש בגלגל');
  await p.click('[data-mstep="1"]');
  ok((await p.textContent('#m-title')).includes('אוקטובר'), 'כפתור החודש הבא');
  await p.click('.month-item >> nth=0');
  await p.waitForTimeout(300);
  ok((await hash()).startsWith('#/foods?id='), 'פריט בעונה פותח את הגיליון שלו');

  console.log('מתכונים');
  await go('#/recipes');
  ok(await p.locator('.recipe-card').count() === 20, '20 מתכונים');
  ok((await p.textContent('#r-title')).length > 2 && await p.locator('.r-steps li').count() <= 10, 'כרטיס מתכון עם עד 10 שלבים');
  await p.click('.recipe-card[data-id="ful"]');
  ok((await hash()).includes('id=ful') && (await p.locator('#r-sheet').innerText()).includes('G6PD'), 'פול מדמס: אזהרת G6PD');
  await p.click('.recipe-card[data-id="zaatar-bread"]');
  ok(/גלוטן/.test(await p.locator('#r-sheet').innerText()) && /שומשום/.test(await p.locator('#r-sheet').innerText()), 'אלרגנים נגזרים מהמזונות (גלוטן ושומשום)');
  await p.click('#r-sheet [data-step="1"]');
  ok((await hash()).includes('id=cabbage-pomegranate'), 'כפתור "הבא" במתכונים');
  await p.click('#r-sheet .r-ing >> nth=0');
  await p.waitForTimeout(300);
  ok((await hash()).startsWith('#/foods?id=cabbage'), 'מצרך פותח את גיליון המזון');
  ok(await p.locator('#sheet a[href*="recipes?id=cabbage-pomegranate"]').count() === 1, 'גיליון המזון מקשר למתכון');
  await go('#/recipes');
  await p.click('#f-season');
  const n = await p.locator('.recipe-card').count();
  ok(n >= 1 && n <= 20 && (await hash()).includes('season=1'), 'סינון "מתאים לעונה עכשיו"');

  console.log('השוואה');
  await go('#/compare');
  ok((await p.textContent('#shared')).includes('מפריד'), 'תאנה ורימון: הרמב"ם מפריד ביניהם');
  await p.selectOption('#b', 'grape');
  ok((await p.textContent('#shared')).includes('קודם'), 'החלפת מזון מעדכנת את "מה משותף"');
  await p.click('[data-pair="onion,garlic"]');
  ok((await p.textContent('#shared')).includes('במדבר יא ה') && (await hash()).includes('a=onion'), 'זוג מוצע: מקור משותף');

  console.log('מקורות והערות');
  await go('#/method');
  ok(await p.locator('#redlist').count() === 1 && await p.locator('.red-card').count() === 4, 'הרשימה האדומה במקום אחד, בדף המקורות');
  ok(await p.locator('a[href="tel:101"]').count() === 1, 'קווי העזרה בדף המקורות');
  await go('#/help');
  ok(await p.locator('a[href="tel:101"]').count() === 1 && await p.locator('a[href="tel:1201"]').count() === 1, 'קווי חירום כקישורי חיוג');
  await p.click('#wipe');
  ok(await p.evaluate(() => localStorage.getItem('tzuna.v1') === null), 'מחיקת כל מה שנשמר במכשיר');
  await go('#/method');
  await p.click('#copy-post');
  await p.waitForTimeout(200);
  ok(/הועתק|סומן/.test(await p.textContent('#copied')), 'העתקת הפוסט');
  const cdp = await ctx.newCDPSession(p);
  const inst = await cdp.send('Page.getInstallabilityErrors');
  ok(inst.installabilityErrors.length === 0, 'Page.getInstallabilityErrors ריק' + (inst.installabilityErrors.length ? ': ' + JSON.stringify(inst.installabilityErrors) : ''));

  console.log('הפחתת תנועה ונייד');
  const rm = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  rm.on('pageerror', (e) => errors.push(e.message));
  await rm.route('**/appofapp-gh.vercel.app/ai-menu.js', (r) => r.fulfill({ path: path.join(__dirname, 'fixtures', 'ai-menu.js'), contentType: 'application/javascript' }));
  for (const h of ['', '#/foods', '#/plant', '#/methods', '#/seasons', '#/recipes', '#/compare', '#/method']) {
    await rm.goto(base + h, { waitUntil: 'networkidle' });
    await rm.waitForTimeout(600);
    ok(!(await rm.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `נייד ${h || '#/'}: בלי גלילה אופקית`);
  }
  ok(await rm.evaluate(() => getComputedStyle(document.querySelector('.tab')).transitionDuration === '0s'), 'הפחתת תנועה מבטלת מעברים');

  ok(errors.length === 0, 'אין שגיאות JavaScript' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await b.close();
  server?.close();
  console.log(`\n${fail ? 'FAIL' : 'PASS'}: ${pass} עברו, ${fail} נכשלו`);
  process.exit(fail ? 1 : 0);
})();
