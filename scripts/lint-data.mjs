// בדיקת דאטה לפי docs/DATA_MODEL.md, docs/CONTENT_RULES.md ו-docs/SAFETY.md.
// usage: node scripts/lint-data.mjs   (יציאה 1 אם יש הפרה)
import { FOODS, CATEGORIES, ALLERGENS } from "../js/data/foods.js";
import { SOURCES, EVIDENCE } from "../js/data/sources.js";
import { REDLIST } from "../js/data/safety-data.js";
import { TREE_POINTS } from "../js/data/tree.js";

const FORBIDDEN = ["מרפא", "מרפאת", "מנקה רעלים", "מאזן הורמונים", "מחזק חיסון", "מוריד לחץ דם", "מוריד סוכר", "עוצמתי", "מטפל", "מבריא", "מבטיח"];
const BODY = ["קלוריות", "קלוריה", "BMI", "ירידה במשקל", "לרזות", "ניקוי רעלים"];
const DOSE = /\d+\s*(מ"ג|מ״ג|mg|גרם ליום|כפות ליום|כפיות ליום)/;
const FLAGS = ["red_list", "pregnancy", "medication_interaction", "allergen"];
const STATUS = ["לא נבדק", "לא אוששה", "לא נבדק בבני אדם"];
const PREFIX = "[והשבכלמ]{0,3}";

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const srcList = (s) => (Array.isArray(s) ? s : [s]);
const words = (re) => new RegExp(`(^|[^\\u0590-\\u05FF])${PREFIX}(${re})(?=$|[^\\u0590-\\u05FF])`);

function checkText(where, t) {
  if (typeof t !== "string" || !t.trim()) return err(where, "טקסט ריק");
  for (const w of FORBIDDEN) if (words(w).test(t)) err(where, `מילה אסורה "${w}"`);
  for (const w of BODY) if (t.includes(w)) err(where, `נושא גוף אסור "${w}"`);
  if (DOSE.test(t)) err(where, "נראה כמו מינון");
}
function checkSrc(where, s) {
  for (const id of srcList(s)) if (!SOURCES[id]) err(where, `מקור לא קיים "${id}"`);
}
function checkLayers(where, layers) {
  for (const k of ["known", "said", "believed"]) if (!Array.isArray(layers[k])) err(where, `חסרה שכבה ${k}`);
  layers.known.forEach((x, i) => {
    const w = `${where}.known[${i}]`;
    checkText(w, x.t);
    if (!x.src) err(w, "known בלי source_id");
    else checkSrc(w, x.src);
    if (!EVIDENCE.includes(x.ev)) err(w, `עוצמת ראיה לא חוקית "${x.ev}"`);
    if (srcList(x.src).some((id) => SOURCES[id]?.type === "הערכה")) err(w, "known שנשען על הערכה");
  });
  layers.said.forEach((x, i) => {
    const w = `${where}.said[${i}]`;
    checkText(w, x.t);
    if (!x.trad) err(w, "said בלי tradition");
    if (!x.src) err(w, "said בלי source_id");
    else checkSrc(w, x.src);
  });
  layers.believed.forEach((x, i) => {
    const w = `${where}.believed[${i}]`;
    checkText(w, x.t);
    if (!STATUS.includes(x.status)) err(w, `status לא חוקי "${x.status}"`);
  });
}

const ids = new Set();
const cats = new Set(CATEGORIES.map((c) => c.id));
for (const f of FOODS) {
  const w = `food:${f.id}`;
  if (ids.has(f.id)) err(w, "id כפול");
  ids.add(f.id);
  for (const k of ["he", "la", "family", "family_la", "part", "shape", "hue"]) if (!f[k]) err(w, `חסר ${k}`);
  if (!cats.has(f.cat)) err(w, `קטגוריה לא קיימת "${f.cat}"`);
  if (!Array.isArray(f.months) || f.months.some((m) => m < 1 || m > 12)) err(w, "חודשים לא חוקיים");
  if (![null, "before", "after"].includes(f.meal)) err(w, "meal לא חוקי");
  for (const a of f.allergens) if (!ALLERGENS[a]) err(w, `אלרגן לא מוכר "${a}"`);
  if (f.allergens.length && !f.safety.flags.includes("allergen")) err(w, "יש אלרגן בלי דגל allergen");
  for (const fl of f.safety.flags) if (!FLAGS.includes(fl)) err(w, `דגל לא חוקי "${fl}"`);
  if (f.safety.flags.includes("red_list")) err(w, "צמח מהרשימה האדומה בגלריה הרגילה");
  if (REDLIST.some((r) => r.la === f.la)) err(w, "שם מדעי של צמח מהרשימה האדומה בגלריה");
  if (f.meal && !f.layers.said.some((x) => srcList(x.src).includes("rambam-deot"))) err(w, "meal בלי מקור מהרמב\"ם");
  for (const k of ["recognize", "use"]) { checkText(`${w}.${k}`, f[k].t); checkSrc(`${w}.${k}`, f[k].src); }
  if (f.safety.note) checkText(`${w}.safety`, f.safety.note);
  checkLayers(w, f.layers);
}
for (const r of REDLIST) {
  const w = `red:${r.id}`;
  if (!r.sources.length) err(w, "רשומה אדומה בלי מקור");
  r.sources.forEach((s) => checkSrc(w, s));
  checkText(`${w}.risk`, r.risk);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.last_reviewed)) err(w, "last_reviewed לא חוקי");
}
for (const p of TREE_POINTS) {
  const w = `tree:${p.id}`;
  checkText(`${w}.recognize`, p.recognize.t);
  checkSrc(`${w}.recognize`, p.recognize.src);
  checkLayers(w, p.layers);
}

const counts = FOODS.reduce((a, f) => { for (const k of ["known", "said", "believed"]) a[k] += f.layers[k].length; return a; }, { known: 0, said: 0, believed: 0 });
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\nFAIL: ${errors.length} הפרות`);
  process.exit(1);
}
console.log(`ok: ${FOODS.length} מזונות, ${REDLIST.length} ברשימה האדומה, ${TREE_POINTS.length} נקודות בעץ, ${Object.keys(SOURCES).length} מקורות`);
console.log(`שכבות: ידוע ${counts.known}, נאמר ${counts.said}, מאמינים ${counts.believed}`);
