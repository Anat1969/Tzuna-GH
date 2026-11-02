// עזרי ממשק משותפים: טקסט עשיר, שכבות, מקורות, אייקוני קו.
import { SOURCES, EVIDENCE } from "./data/sources.js";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[c]));

// **מודגש**, ==תובנה==, ומספרים מודגשים אוטומטית בכיוון LTR מבודד.
const NUM = /(\d[\d,.]*%?)/g;
const nums = (s) => s.replace(NUM, "<bdi class=\"num\">$1</bdi>");
export function rich(text) {
  return esc(text).split(/(==[^=]+==|\*\*[^*]+\*\*)/g).map((p) => {
    if (p.startsWith("**")) return `<strong>${nums(p.slice(2, -2))}</strong>`;
    // הדגשה בתוך מרקר: **מילה** בתוך ==תובנה==
    if (p.startsWith("==")) return `<mark class="insight">${nums(p.slice(2, -2)).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</mark>`;
    return nums(p);
  }).join("");
}

export const LAYERS = [
  { key: "known", he: "ידוע", what: "ממצא מחקרי, עם מקור ועוצמת ראיה.", empty: "לא נמצא ממצא מחקרי מבוסס." },
  { key: "said", he: "נאמר", what: "מה שמסורת אמרה, מאיזה מקור ובאיזה הקשר.", empty: "לא נמצאה מסורת מתועדת." },
  { key: "believed", he: "מאמינים", what: "טענה רווחת שלא נבדקה או לא אוששה.", empty: "לא נרשמה אמונה רווחת." }
];

export const MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
export const MONTHS_SHORT = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"];

const srcIds = (s) => (Array.isArray(s) ? s : [s]).filter(Boolean);
export function srcLine(s) {
  return srcIds(s).map((id) => {
    const x = SOURCES[id];
    if (!x) return "";
    const t = esc(x.title) + (x.year ? `, <bdi class="num" style="font-weight:400">${x.year}</bdi>` : "");
    return `<bdi>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${t}</a>` : t}</bdi>`;
  }).join(" · ");
}

// מקור של "נאמר": הפסוק או ההלכה, עם קישור למקור עצמו.
function refLink(x) {
  const s = SOURCES[srcIds(x.src)[0]];
  return s?.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(x.ref)}</a>` : esc(x.ref);
}

export function evMeter(ev) {
  const i = EVIDENCE.indexOf(ev);
  const on = i < 0 ? 0 : EVIDENCE.length - 1 - i;
  return `<span class="ev" title="עוצמת ראיה: ${esc(ev)}" aria-label="עוצמת ראיה: ${esc(ev)}">${[0, 1, 2, 3].map((k) => `<i class="${k < on ? "on" : ""}"></i>`).join("")}<em>${esc(ev)}</em></span>`;
}

// שכבה אחת: קו בצד, שם השכבה, הטקסט, ומטא (ראיה / מסורת / סטטוס) עם מקור קטן ואפור.
export function stratum(key, items) {
  const L = LAYERS.find((l) => l.key === key);
  if (!items || !items.length) {
    return `<div class="stratum st-${key} empty"><div class="st-name">${L.he}</div><div class="st-text">${L.empty}</div></div>`;
  }
  return items.map((x) => {
    let meta = "";
    // מקורות לא מוצגים ליד הטענה (החלטת ענת, 02.11.2026): הם מרוכזים במקום אחד, מקופל.
    if (key === "known") meta = evMeter(x.ev);
    if (key === "said") meta = `<span class="src">${esc(x.trad)}${x.ref ? `, ${esc(x.ref)}` : ""}</span>`;
    if (key === "believed") meta = `<span class="status-pill">${esc(x.status)}</span>`;
    return `<div class="stratum st-${key}"><div class="st-name">${L.he}</div><div class="st-text">${rich(x.t)}</div><div class="st-meta">${meta}</div></div>`;
  }).join("");
}

export const ICONS = {
  x: "<path d=\"M6 6l12 12M18 6L6 18\"/>",
  prev: "<path d=\"M9 6l6 6-6 6\"/>",
  next: "<path d=\"M15 6l-6 6 6 6\"/>",
  copy: "<rect x=\"8\" y=\"8\" width=\"12\" height=\"12\"/><path d=\"M16 8V4H4v12h4\"/>",
  sliders: "<path d=\"M4 7h10M18 7h2M4 17h4M12 17h8\"/><rect x=\"14\" y=\"5\" width=\"4\" height=\"4\"/><rect x=\"8\" y=\"15\" width=\"4\" height=\"4\"/>",
  reset: "<path d=\"M5 12a7 7 0 1 0 2-5\"/><path d=\"M5 4v4h4\"/>",
  print: "<path d=\"M7 9V3h10v6\"/><rect x=\"4\" y=\"9\" width=\"16\" height=\"8\"/><path d=\"M7 14h10v7H7z\"/>"
};
export const icon = (name, label) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg><span class="sr">${esc(label || "")}</span>`;
export const iconBtn = (name, label, attrs = "") => `<button class="icon-btn" type="button" title="${esc(label)}" aria-label="${esc(label)}" ${attrs}><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg></button>`;

export const triangle = (color = "var(--red)") => `<svg class="tri" viewBox="0 0 14 13" aria-hidden="true"><path d="M7 1L13 12H1z" fill="none" stroke="${color}" stroke-width="1.6"/><path d="M7 5v3.2M7 9.6v.6" stroke="${color}" stroke-width="1.6"/></svg>`;

export const legendHTML = () => LAYERS.map((l) => `<span><i class="layer-mark lm-${l.key}"></i>${l.he}</span>`).join("") + `<span><i class="layer-mark lm-red" style="border-top-style:solid"></i>רשימה אדומה</span>`;

export function nowMonth() { return new Date().getMonth() + 1; }

// כל המקורות של פריט, לרשימה אחת מקופלת בתחתית.
export function sourcesBox(ids) {
  const uniq = [...new Set(ids.flatMap((s) => (Array.isArray(s) ? s : [s])).filter(Boolean))];
  if (!uniq.length) return "";
  return `<details class="sources-box"><summary>מקורות (<bdi>${uniq.length}</bdi>)</summary><ol>${uniq.map((id) => `<li>${srcLine(id)}</li>`).join("")}</ol></details>`;
}
