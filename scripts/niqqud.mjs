// ניקוד לציטוטים מהתנ"ך, מתוך נוסח לנינגרד (WLC, נחלת הכלל) של Open Scriptures (חבילת npm ‏morphhb).
// לכל טקסט בדאטה שיש לו ref של ספר תנ"ך: הציטוט הראשון במירכאות נבדק אות באות מול הפסוק, ורק אז מנוקד.
// usage: node scripts/niqqud.mjs <path-to-morphhb> [path-to-mishna-text]   (npm i morphhb mishna-text בתיקייה זמנית)
// משנה: מהחבילה mishna-text (מנוקדת, מתוך ספריא). רמב"ם, תלמוד ושו"ע: עוד אין מקור מנוקד נגיש.
// ציטוט שלא תואם לפסוק לא נוגע בו, ומדווח. מקורות שאינם תנ"ך (רמב"ם, משנה, תלמוד, שו"ע) לא מנוקדים כאן.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const WLC = process.argv[2] + "/wlc";
const MISHNA = process.argv[3] ? process.argv[3] + "/data" : null;
const TRACTATES = { "חלה": "challah", "ברכות": "berakhot", "פאה": "peah", "כלאים": "kilayim", "שביעית": "sheviit", "מעשרות": "maasrot", "ביכורים": "bikkurim" };
const BOOKS = { "בראשית": "Gen", "שמות": "Exod", "ויקרא": "Lev", "במדבר": "Num", "דברים": "Deut", "רות": "Ruth", "מיכה": "Mic", "תהלים": "Ps", "שיר השירים": "Song", "ירמיהו": "Jer", "ישעיהו": "Isa", "משלי": "Prov", "קהלת": "Eccl", "יואל": "Joel", "חגי": "Hag" };
const GEM = { "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 20, "ל": 30, "מ": 40, "נ": 50, "ס": 60, "ע": 70, "פ": 80, "צ": 90, "ק": 100, "ר": 200, "ש": 300, "ת": 400 };
const num = (s) => [...s.replace(/["׳״']/g, "")].reduce((n, c) => n + (GEM[c] || 0), 0);
const FINAL = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
const cons = (w) => w.replace(/[֑-ׇ]/g, "").replace(/[ךםןףץ]/g, (c) => FINAL[c]).replace(/[^א-ת]/g, "");
const cache = {};
function verse(book, c, v) {
  const x = cache[book] ||= readFileSync(`${WLC}/${book}.xml`, "utf8");
  const m = x.match(new RegExp(`<verse osisID="${book}\\.${c}\\.${v}">([\\s\\S]*?)</verse>`));
  if (!m) return null;
  const seg = m[1].replace(/<note[\s\S]*?<\/note>/g, "");
  const words = [];
  for (const w of seg.matchAll(/<(w|seg)[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (w[1] === "seg") { if (w[2] === "־" && words.length) words[words.length - 1].maqaf = true; continue; }
    // בלי טעמים, מתג ופסק; הניקוד נשאר
    words.push({ w: w[2].replace(/\//g, "").replace(/[\u0591-\u05AF\u05BD\u05C0\u05C3]/g, ""), maqaf: false });
  }
  return words;
}
function mishna(ref) {
  if (!MISHNA) return null;
  const t = Object.keys(TRACTATES).find((k) => ref.startsWith(k + " "));
  if (!t) return null;
  const [p, m] = ref.slice(t.length + 1).trim().split(/\s+/).map(num);
  const d = JSON.parse(readFileSync(`${MISHNA}/${TRACTATES[t]}.json`, "utf8"));
  const h = d.perakim.find((x) => x.perek === p)?.mishnayot.find((x) => x.mishna === m)?.hebrew;
  return h ? h.split(/\s+/).map((w) => ({ w: w.replace(/[.,:;!?״"()]/g, ""), maqaf: false })) : null;
}
function verses(ref) {
  const mi = mishna(ref); if (mi) return mi;
  const b = Object.keys(BOOKS).sort((a, b) => b.length - a.length).find((k) => ref.startsWith(k + " "));
  if (!b) return null;
  const [c, vs] = ref.slice(b.length + 1).trim().split(/\s+/);
  const [v0, v1] = vs.split("-").map(num);
  const out = [];
  for (let v = v0; v <= (v1 || v0); v++) { const w = verse(BOOKS[b], num(c), v); if (!w) return null; out.push(...w); }
  return out;
}
// מנקד ציטוט: המילים מותאמות ברצף למילים בפסוק, מכל נקודת התחלה. פער מותר רק במקום "...". ** נשמר, ומקף חוזר.
function tryFrom(toks, words, start, k = 0, gap = false, prev = null, out = "") {
  if (k === toks.length) return out;
  const t = toks[k];
  if (t === "**" || /^\s+$/.test(t)) return tryFrom(toks, words, start, k + 1, gap, prev, out + t);
  if (t === "...") return tryFrom(toks, words, start, k + 1, true, prev, out + t);
  const c = cons(t);
  if (!c) return tryFrom(toks, words, start, k + 1, gap, prev, out + t);
  const cands = [];
  if (gap) { for (let j = start; j < words.length; j++) if (cons(words[j].w) === c) cands.push(j); }
  else if (start < words.length && cons(words[start].w) === c) cands.push(start);
  for (const j of cands) {
    // מקף בין שתי מילים צמודות בפסוק
    let o = out;
    if (prev !== null && prev === j - 1 && words[prev].maqaf) o = o.replace(/\s+(\**)$/, "־$1");
    const r = tryFrom(toks, words, j + 1, k + 1, false, j, o + words[j].w + t.slice(t.search(/[^א-ת]*$/)));
    if (r) return r;
  }
  return null;
}
function vocalize(q, words) {
  const toks = q.split(/(\*\*|\.\.\.|\s+)/).filter((t) => t !== "");
  for (let s0 = 0; s0 < words.length; s0++) { const r = tryFrom(toks, words, s0); if (r) return r; }
  return null;
}
const report = [];
let changed = 0;
for (const f of readdirSync("js/data").filter((x) => x.endsWith(".js"))) {
  const p = `js/data/${f}`;
  let s = readFileSync(p, "utf8");
  // רשומה עם t: "..." ואחריה ref: "..."
  s = s.replace(/(t: ")((?:[^"\\]|\\.)*)("(?:(?!\n\s*\{)[^\n])*?ref: ")([^"]*)(")/g, (all, a, t, mid, ref, z) => {
    const words = verses(ref);
    if (!words) return all;
    const m = t.match(/^((?:[^\\]|\\[^"])*?)\\"((?:[^\\]|\\[^"])+?)\\"/);
    if (!m) return all;
    const q = m[2];
    if (/[ְ-ּ]/.test(q)) return all; // כבר מנוקד
    const v = vocalize(q, words);
    if (!v) { report.push(`לא תואם: ${ref} | ${q}`); return all; }
    changed++;
    return a + t.replace(`\\"${q}\\"`, `\\"${v}\\"`) + mid + ref + z;
  });
  writeFileSync(p, s);
}
console.log(`נוקדו ${changed} ציטוטים`);
if (report.length) console.log(report.join("\n"));
