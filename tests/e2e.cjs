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
  // הרכיב המשותף <app-creations>: עותק מקומי מ-AppOfApp-GH כשקיים, אחרת מהרשת
  const CREATIONS_JS = process.env.CREATIONS_JS || path.join(ROOT, '..', 'appofapp-gh', 'public', 'creations.js');
  const routeCreations = (pg) => fs.existsSync(CREATIONS_JS) && pg.route('**/creations.js', (r) => r.fulfill({ path: CREATIONS_JS, contentType: 'application/javascript' }));
  await routeCreations(p);
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
  ok(await p.locator('.ht-food').count() >= 1 && await p.locator('.ht-syn').count() === 2 && await p.locator('.ht-disc').count() === 1, 'היום במטבח: עונה, צירוף וגילוי');
  for (const [door, view] of [['מזון', 'foods'], ['צמח וגוף', 'plant'], ['עונות', 'seasons'], ['שיטות', 'methods'], ['צירופים', 'recipes'], ['השוואה', 'compare']]) {
    await go('');
    await p.click(`.hdoor:has(b:text-is("${door}"))`);
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
  ok(await p.locator('.food-card').count() === 67, '67 גיליונות בגלריה');
  ok(!(await p.locator('.food-card >> text=ג\'עדה').count()), 'צמח מהרשימה האדומה לא בגלריה');
  await p.click('.food-card[data-id="fig"]');
  ok((await hash()).includes('id=fig') && (await p.textContent('#sheet-title')).includes('תאנה'), 'בחירת כרטיס פותחת גיליון ושומרת בכתובת');
  ok(await p.locator('#sheet .stratum').count() >= 3, 'הגיליון מציג שלוש שכבות');
  ok(await p.locator('#sheet .unique').count() === 1 && await p.locator('#sheet .bs-dock .bs-body p').count() === 1 && await p.locator('#sheet .bs-dock .bs-soul p').count() === 1, 'ייחודיות, וגוף ונפש במקום הקבוע בתחתית');
  ok(!(await p.locator('#sheet .safety-line, #sheet .tone-red').count()), 'בלי אזהרות שימוש בגיליון');
  await go('#/foods?id=cucumber');
  ok(await p.locator('#sheet .p-with .pi-f').count() === 3 && (await p.locator('#sheet .p-with .pi-f').evaluateAll((a) => a.map((x) => x.title))).join() === 'עגבנייה,זית,לימון', 'הולך עם: צילומי השותפים ליד ההסבר, בסדר הכתיבה');
  await p.click('#sheet .pi-f[href*="lemon"]');
  await p.waitForTimeout(200);
  ok((await p.textContent('#sheet-title')).includes('לימון'), 'לחיצה על שותף פותחת את הגיליון שלו');
  await go('#/foods?id=fig');
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
  ok(await p.locator('.food-card').count() === 7, 'בורר: "קטניות" מציג 7');
  await p.click('[data-add="nuts"]');
  ok(await p.locator('.food-card').count() === 17, 'בורר: "+" מוסיף אגוזים (17)');
  await p.click('[data-rem="nuts"]');
  ok(await p.locator('.food-card').count() === 7, 'בורר: "−" מסיר');
  await p.click('[data-cat="legumes"]');
  ok(await p.locator('.food-card').count() === 67, 'בורר: לחיצה על הבחירה היחידה מחזירה להכול');
  await p.click('[data-cat="seven"]');
  await p.click('[data-cat=""]');
  ok(await p.locator('.food-card').count() === 67, 'בורר: "הכול" מאפס');

  console.log('חיפוש ובטיחות');
  await p.fill('#q', 'תאנה');
  await p.waitForTimeout(200);
  ok(await p.locator('.food-card.hit').count() >= 1 && await p.locator('.food-card.dim').count() > 10, 'חיפוש מדגיש התאמות ומעמעם את השאר');
  await p.fill('#q', 'סוכ');
  await p.waitForTimeout(200);
  ok(await p.locator('.food-card.hit').count() === 0, 'מילה קצרה חייבת להיות שלמה ("סוכ" לא תופס "סוכר")');
  await p.click('#q-x');
  ok((await p.inputValue('#q')) === '' && await p.locator('.food-card.dim').count() === 0, 'איקס מאפס את החיפוש');
  for (const [q, id, he] of [['אפונה', 'pea', 'אפונה'], ['עגבניות', 'tomato', 'עגבנייה'], ['חצילים', 'eggplant', 'חציל'], ['גינגר', 'ginger', "ג'ינג'ר"], ['תפוחי אדמה', 'potato', 'תפוח אדמה']]) {
    await p.fill('#q', q);
    await p.waitForTimeout(200);
    ok((await hash()).includes('id=' + id) && (await p.textContent('#sheet-title')).includes(he), `חיפוש "${q}" פותח את הגיליון של ${he}`);
  }
  await p.click('[data-cat="seven"]');
  await p.fill('#q', 'אפונה');
  await p.waitForTimeout(200);
  ok((await p.textContent('#sheet-title')).includes('אפונה') && await p.locator('.food-card[data-id="pea"]').count() === 1, 'חיפוש מוצא מזון גם מחוץ לקטגוריה שנבחרה');
  await p.click('#q-x');
  await go('#/seasons');
  await p.fill('#q', 'אפונה');
  await p.waitForTimeout(300);
  ok((await hash()).startsWith('#/foods') && (await p.textContent('#sheet-title')).includes('אפונה'), 'חיפוש ממסך אחר פותח את גיליון המזון');
  await p.click('#q-x');
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

  console.log('מדע וצירופים');
  await go('#/foods?id=turmeric');
  ok((await p.locator('#sheet .why').count()) === 1 && (await p.locator('#sheet .syn').innerText()).includes('פיפרין'), 'כורכום: למה חשוב, ולמה עם פלפל');
  ok(await p.locator('#sheet .practical li').count() >= 2, 'מידע מעשי');
  // מזונות המטבח (js/data/kitchen.js) מחכים לצילום: סביבת הענן חוסמת את אתרי הצילומים. עד אז, כרטיס טיפוגרפי.
  ok(await p.locator('.food-card.has-photo').count() >= 33 && await p.locator('.food-card.has-photo .type-card').count() === 0, 'כל מזון עם צילום מציג אותו, ומזון בלי צילום מציג כרטיס');

  console.log('התנגשויות');
  await go('#/foods?id=lentil');
  ok((await p.locator('#sheet .p-without').textContent()).includes('תה שחור'), 'עדשים: "לא הולך עם" תה שחור (ספיגת ברזל)');
  ok((await p.locator('#sheet .p-with').textContent()).includes('לימון'), 'עדשים: "הולך עם" לימון');
  await go('#/foods?id=grapefruit');
  ok((await p.locator('#sheet .p-without').textContent()).includes('תרופות'), 'אשכולית: התנגשות עם תרופות כתוכן');

  console.log('צמח וגוף');
  await go('#/plant');
  ok(await p.locator('.pv .pv-link').count() === 6 && await p.locator('.pl-tab').count() === 6, 'מפה: שישה זוגות של צמח וגוף, ושישה כפתורי חלק');
  ok(await p.locator('#pl-aside .mv figure').count() === 2 && await p.locator('#pl-aside .ess').count() >= 2 && await p.locator('#pl-aside > .bs-dock:first-child').count() === 1, 'תרשים מנגנון, לוחות, וגוף ונפש בראש הטור');
  ok(await p.locator('.doctrines .dc').count() === 3, 'מאיזו תורה צמח הקשר: שלוש תורות');
  for (const id of ['stem', 'leaf', 'flower', 'fruit', 'seed', 'root']) {
    await p.click(`.pl-tab[data-part="${id}"]`);
    ok((await hash()).includes('p=' + id) && await p.locator(`.pl-tab[data-part="${id}"][aria-pressed="true"]`).count() === 1 && await p.locator(`.pv-link.on[data-part="${id}"]`).count() === 1, `חלק ${id} נפתח`);
  }
  await p.click('.pv-link[data-part="fruit"] .pv-hit', { force: true });
  ok((await hash()).includes('p=fruit'), 'לחיצה על קו במפה בוחרת חלק');
  await p.click('.pl-tab[data-part="leaf"]');
  ok((await p.locator('#pl-aside').innerText()).includes('נשמה'), 'העלה: ריאות ונשמה');
  ok((await p.locator('.pl-quote').innerText()).includes('דרווין'), 'ציטוט דרווין');
  await go('#/tree');
  ok((await p.locator('#pl-title').count()) === 1, 'הכתובת הישנה #/tree מובילה לצמח וגוף');

  console.log('שיטות');
  await go('#/methods');
  ok(await p.locator('.tl .tl-m').count() === 15, '15 שיטות בציר');
  ok(await p.locator('#mt-aside .ctx').count() === 1, 'הקשר תרבותי, גאוגרפי ואקלימי');
  await p.click('[data-tab="cmp"]');
  ok(await p.locator('.mx tbody tr').count() === 15 && await p.locator('.mt tbody tr').count() === 15, 'לשונית השוואה: מטריצה וטבלה');
  await p.click('.mx tbody tr[data-m="ayurveda"]');
  ok((await p.textContent('#mt-title')).includes('איורוודה') && (await hash()).includes('m=ayurveda'), 'בחירת שיטה מהטבלה');
  await p.click('[data-tab="who"]');
  ok(await p.locator('.mt-figs .mt-fig').count() >= 6, 'לשונית דמויות');
  await p.click('[data-tab="geo"]');
  ok(await p.locator('.mt-map .mp').count() === 14, 'מפה עם כל השיטות שיש להן מקום');
  ok(await p.locator('#mt-aside .ess-idea').count() === 1 && await p.locator('#mt-aside .mt-ideas > div').count() === 3, 'הרעיון של השיטה: למה, איך בוחרים, מתי');
  const vb0 = await p.locator('.mt-map').getAttribute('viewBox');
  await p.locator('.geo-stage').scrollIntoViewIfNeeded();
  const gb = await p.locator('.geo-stage').boundingBox();
  await p.mouse.move(gb.x + gb.width / 2, gb.y + gb.height / 2); await p.mouse.wheel(0, -300); await p.waitForTimeout(100);
  ok((await p.locator('.mt-map').getAttribute('viewBox')) !== vb0, 'גלגלת מקרבת את המפה');
  await p.click('[data-geo="globe"]');
  ok(await p.locator('.mt-globe').count() === 1, 'מעבר לגלובוס');
  await p.click('[data-geo="map"]');
  await p.click('.mt-sort[data-sort="climate"]');
  ok(await p.locator('.geo-legend span').count() >= 5 && (await p.locator('.mt-trait').innerText()).includes('אקלים'), 'מיון לפי אקלים: מקרא ותובנה');
  await p.click('.mt-all');
  await p.click('.mt-sort[data-sort="temp"]');
  ok((await hash()).includes('s=temp') && await p.locator('.mt-trait').count() === 1 && await p.locator('.mp.dim').count() >= 5, 'מיון לפי חם וקר: תובנה, והשאר מעומעמים');
  await p.click('[data-tab="cmp"]');
  ok((await p.locator('.mx tbody tr').first().getAttribute('class')).includes('hit'), 'מי שיש לו את הפרמטר עולה למעלה ומודגש');
  await p.click('.mt-all');
  ok(await p.locator('.mx tr.dim').count() === 0, '"הכול" מאפס את המיון');
  await p.click('[data-tab="disc"]');
  ok(await p.locator('.disc-list.one li').count() >= 8, 'גילויים ותובנות ברשימה אחת');
  await p.click('[data-tab="geo"]');
  await p.click('.tl .tl-m[data-m="washoku"]', { force: true });
  ok((await p.textContent('#mt-title')).includes('וושוקו'), 'בחירת שיטה מהציר');

  console.log('רכיבים');
  await go('#/nutrients');
  ok(await p.locator('.nt-row').count() === 13 && await p.locator('.nt-kind').count() === 3, 'רכיבים: טבלה אחת, כותרת לכל סוג');
  await p.click('.nt-row[data-n="vK"] th');
  ok((await p.textContent('#n-title')).includes('ויטמין K') && await p.locator('#n-aside .pl-food').count() >= 3 && await p.locator('#n-aside .bs-dock .nseason span').count() === 12, 'בחירת ויטמין K: מקורות, ומתי בשנה קבוע בראש');
  await p.click('.nt-c[data-n="protein"][data-part="seed"]');
  ok((await p.textContent('#n-aside .sec-h h3')).includes('זרע') && (await hash()).includes('part=seed'), 'לחיצה על מספר מסננת את הטור הצדדי');
  await p.click('[data-kind="vitamin"]');
  ok(await p.locator('.nt-long').count() === 1, 'לחיצה על סוג מסבירה למה הוא חשוב');
  ok((await p.locator('.disc-list').innerText()).includes('עלה'), 'גילוי: ויטמין K בעלים');
  await go('#/nutrients?n=mg');
  ok((await p.textContent('#n-title')).includes('מגנזיום') && await p.locator('#n-aside .pl-food[href="#/foods?id=spirulina"]').count() === 1 && await p.locator('#n-aside .pl-food').count() >= 6, 'מגנזיום: מקורות מהגוף בפרופיל, כולל ספירולינה ב"אחר"');

  console.log('גשר מארק ובינה');
  await p.goto(base + '?ab_q=' + encodeURIComponent('למה דווקא מגנזיום?') + '&ab_back=' + encodeURIComponent('https://arc-and-bina.vercel.app/#/client/alga') + '#/foods?id=spirulina', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  ok((await p.textContent('.sheet-name')).includes('ספירולינה') && (await p.evaluate(() => location.search)).includes('ab_q'), 'פרמטרים לפני ה-hash: הגיליון נפתח, והפרמטרים נשמרים');

  console.log('כתבות');
  await go('#/articles');
  ok(await p.locator('.a4').count() >= 10 && await p.locator('.a4-src').count() === await p.locator('.a4').count(), 'כל הכתבות בדף אחד, כל אחת עמוד A4, כולל היצירות');
  const a4 = await p.locator('.a4').first().boundingBox();
  ok(Math.abs(a4.height / a4.width - 297 / 210) < 0.02, 'יחס עמוד A4');
  ok(/[\u05B0-\u05BC]/.test(await p.locator('.a4-q').first().innerText()), 'ציטוט מהתנ"ך בניקוד');
  await p.click('.seg-b[data-a="hot-cold"]');
  ok((await hash()).includes('a=hot-cold'), 'קפיצה לכתבה');

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
  await go('#/foods?id=olive');
  const med = p.locator('#sheet .med-links a');
  ok(await med.count() === 1 && await med.getAttribute('href') === 'https://refua-gh.vercel.app/#s=cardio&v=disease&d=ischemic' && await med.getAttribute('target') === '_blank' && (await med.getAttribute('rel')).includes('noopener'), 'זית: קישור "ברפואה" למחלת לב איסכמית, בלשונית חדשה');
  await go('#/foods?id=pomegranate');
  ok(!(await p.locator('#sheet .med-links').count()), 'מזון בלי גשר: בלי בלוק "ברפואה"');
  await go('#/recipes');
  await p.click('#f-season');
  const n = await p.locator('.recipe-card').count();
  ok(n >= 1 && n <= 20 && (await hash()).includes('season=1'), 'סינון "מתאים לעונה עכשיו"');

  console.log('רשת הצירופים');
  await go('#/recipes?v=net');
  ok(await p.locator('.net .ne').count() === 12 && await p.locator('.net .ne.block').count() === 4, 'רשת: 12 קווים, 4 מחלישים');
  ok(await p.locator('.net-ins li').count() === 3, 'רשת: שלוש תובנות לפני הכלי');
  await p.click('.ne[data-syn="turmeric-pepper"] .ne-hit', { force: true });
  ok((await p.textContent('#r-sheet')).includes('פיפרין') && (await hash()).includes('syn=turmeric-pepper'), 'לחיצה על קו: המנגנון בטור הצד, בלי לעזוב את הדף');
  await p.click('#r-sheet [data-open-recipe="dal"]');
  ok(await p.locator('.recipe-card[aria-pressed="true"][data-id="dal"]').count() === 1, 'מנה מתוך הצירוף פותחת את המתכון באותו דף');
  await go('#/recipes?v=net');
  await p.click('.nn[data-node="lentil"]');
  ok(await p.locator('#r-sheet .syn').count() === 3, 'לחיצה על עדשים: שלושת הצירופים שלהן');
  await go('#/recipes?v=net');
  await p.click('[data-net-k="block"]');
  ok(await p.locator('.net .ne').count() === 4 && await p.locator('.net .ne.boost').count() === 0 && (await hash()).includes('k=block'), 'סינון ברשת: רק מחלישים');
  await p.click('[data-net-p="in"]');
  ok(await p.locator('.net .ne').count() === 0 && await p.locator('.net-box [data-net-k="all"]').count() >= 1, 'סינון ריק: הסבר וניקוי');
  await p.click('.net-box p [data-net-k="all"]');
  await p.click('[data-net-p="ext"]');
  ok(await p.locator('.net .ne').count() === 6, 'רק שותף חיצוני: 6');
  await p.click('[data-net-p="in"]');
  ok(await p.locator('.net .ne').count() === 6, 'רק מזון עם מזון: 6');

  console.log('קיבוץ והגדלה');
  await go('#/foods?id=olive');
  await p.click('[data-group="season"]');
  ok(await p.locator('.g-head').count() >= 3 && (await hash()).includes('g=season'), 'קיבוץ לפי עונה: כותרות לקבוצות');
  await p.click('[data-group="ev"]');
  ok((await p.textContent('.g-head')).includes('ראיה גבוהה'), 'קיבוץ לפי ראיה: גבוהה ראשונה');
  await p.click('[data-group="none"]');
  ok(await p.locator('.g-head').count() === 0, 'בלי קיבוץ');
  await p.click('#sheet .sheet-hero img');
  ok(await p.locator('.lightbox img').count() === 1 && (await p.textContent('.lightbox')).includes('זית'), 'לחיצה על צילום: הגדלה בתוך הדף');
  await p.keyboard.press('Escape');
  ok(await p.locator('.lightbox').count() === 0 && await p.locator('#sheet .sheet-hero img').count() === 1, 'Esc סוגר את ההגדלה, והגיליון נשאר');
  await p.click('#sheet .sheet-hero img');
  await p.evaluate(() => { location.hash = '#/plant'; });
  await p.waitForTimeout(400);
  ok(await p.locator('.lightbox').count() === 0, 'מעבר מסך סוגר את ההגדלה');

  await go('#/');
  ok(await p.locator('.hd-line mark').count() === 6, 'כל דלת: מספר עם תובנה');
  ok(/\d+\/(\d+)/.test(await p.textContent('#ht-disc')) && Number((await p.textContent('#ht-disc')).match(/\d+\/(\d+)/)[1]) >= 20, 'גילויים מכל האפליקציה מתחלפים, עם מונה');

  console.log('השוואה');
  await go('#/compare');
  ok((await p.textContent('#shared')).includes('מפריד'), 'תאנה ורימון: הרמב"ם מפריד ביניהם');
  await p.selectOption('#b', 'grape');
  ok((await p.textContent('#shared')).includes('קודם'), 'החלפת מזון מעדכנת את "מה משותף"');
  ok(await p.locator('.disc').count() === 10, '10 גילויים');
  await p.click('.disc[data-pair="cabbage,mustard"]');
  ok((await hash()).includes('a=cabbage') && (await p.textContent('#shared')).includes('מירוזינאז'), 'גילוי פותח זוג, עם הצירוף המעצים');

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

  console.log('יצירות הפכו לכתבות');
  await go('#/creations');
  ok(!(await p.locator('.tab[data-view="creations"]').count()) && await p.locator('.a4').count() >= 10, 'אין לשונית יצירות, והכתובת הישנה פותחת את הכתבות');

  console.log('הפחתת תנועה ונייד');
  const rm = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  rm.on('pageerror', (e) => errors.push(e.message));
  await rm.route('**/appofapp-gh.vercel.app/ai-menu.js', (r) => r.fulfill({ path: path.join(__dirname, 'fixtures', 'ai-menu.js'), contentType: 'application/javascript' }));
  await routeCreations(rm);
  for (const h of ['', '#/foods', '#/plant', '#/methods', '#/seasons', '#/recipes', '#/compare', '#/creations', '#/method']) {
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
