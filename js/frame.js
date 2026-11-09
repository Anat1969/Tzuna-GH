// מסגרת קבועה לכל מסך, בשלוש רמות:
// 1. כותרת הדף ועדשה: למה חשוב, מה דומה ומה שונה, איך בוחרים, ומתי. שורה אחת מעל הכול.
// 2. המוקד: הכלי החזותי של המסך (בתוך הפאנל הראשי).
// 3. הפרטים: הטור הצדדי, ובתחתיתו, תמיד באותו מקום, "גוף" ו"נפש" של הנושא שנבחר.
import { rich, esc, MONTHS, nowMonth } from "./ui.js";
import { icon } from "./plantviz.js";
import { LENSES } from "./data/lenses.js";
import { parse, patch } from "./route.js";

// מיקוד ברמת הדף: הכול, רק הכלי, או רק הגיליון. שם הכפתור אומר מה יוצג.
// sel: הפרמטר שמסמן בחירה בכלי. בחירה כשהכלי לבד עוברת לגיליון שלה (ובהשוואה, הפוך).
const FOCUS = {
  foods: { main: "גלריה", side: "גיליון", sel: ["id"] },
  nutrients: { main: "רכיבים", side: "כרטיס", sel: ["n"] },
  plant: { main: "השוואה", side: "חלק", sel: ["p"] },
  methods: { main: "מפה וזמן", side: "שיטה", sel: ["m"] },
  seasons: { main: "שנה", side: "חודש", sel: ["m"] },
  recipes: { main: "צירופים", side: "פירוט", sel: ["id", "syn"] },
  compare: { main: "השוואה", side: "גילויים", sel: ["a", "b"], from: "side", to: "main" }
};
const SVG = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="${d}"/></svg>`;
const F_ICON = { all: SVG("M3 5h18v14H3zM14 5v14"), main: SVG("M3 5h18v14H3z"), side: SVG("M7 4h10v16H7zM10 8h4M10 12h4M10 16h2") };

function focusBar(grid, name) {
  const cfg = FOCUS[name];
  if (!cfg || !grid.classList.contains("focus-aside")) return null;
  const bar = document.createElement("div");
  bar.className = "ph-focus";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "מיקוד התצוגה");
  bar.innerHTML = [["all", "הכול"], ["main", cfg.main], ["side", cfg.side]].map(([k, he]) => `<button type="button" data-focus="${k}" aria-pressed="false" title="${k === "all" ? "הכלי והגיליון יחד" : k === "main" ? "רק " + he + ", ברוחב מלא" : "רק " + he + ", ברוחב קריא"}">${F_ICON[k]}<span>${he}</span></button>`).join("");
  const apply = (f, save = true) => {
    f = f === "main" || f === "side" ? f : "all";
    grid.classList.toggle("f-main", f === "main");
    grid.classList.toggle("f-side", f === "side");
    bar.querySelectorAll("[data-focus]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.focus === f)));
    if (save) patch({ f: f === "all" ? undefined : f });
  };
  bar.addEventListener("click", (e) => { const b = e.target.closest("[data-focus]"); if (b) apply(b.dataset.focus); });
  // בחירה בתוך האזור המוצג לבד פותחת את האזור השני, כדי שלחיצה תמיד תראה תוצאה.
  const from = cfg.from || "main", to = cfg.to || "side";
  const selNow = () => { const p = parse().params; return cfg.sel.map((k) => p[k] || "").join("|"); };
  let before = "";
  grid.addEventListener("pointerdown", () => { before = selNow(); }, true);
  grid.addEventListener("click", (e) => {
    if (!grid.classList.contains("f-" + from) || e.target.closest(".ph-focus")) return;
    const zone = from === "main" ? "section.panel" : "aside.panel";
    if (!e.target.closest(zone)) return;
    setTimeout(() => { if (selNow() !== before) apply(to); }, 0);
  });
  apply(parse().params.f, false);
  currentApply = (f) => { if (bar.isConnected) apply(f, false); };
  return bar;
}
// קישור שמשנה את המיקוד בתוך אותו מסך (למשל מדף הבית) מעדכן את התצוגה גם בלי בנייה מחדש.
let currentApply = null;
addEventListener("hashchange", () => currentApply?.(parse().params.f));

const LENS_CELLS = [["why", "למה חשוב", "mind"], ["same", "מה דומה, מה שונה", "combine"], ["choose", "איך בוחרים", "taste"], ["when", "מתי", "order"]];

// רמה 1: מוציא את הכותרת מהפאנל הראשי לשורה מעל המסך, ומוסיף לה עדשה.
export function frame(viewEl, name) {
  const lens = LENSES[name];
  const grid = viewEl.querySelector(".view-in");
  if (!lens || !grid || grid.querySelector(".page-head")) return;
  const t = grid.querySelector(".view-title");
  const titleBox = t ? t.parentElement : null;
  const head = document.createElement("header");
  head.className = "page-head";
  // הכותרת בשורה אחת. ההסברים (למה, דומה ושונה, איך בוחרים, מתי, איך משתמשים) הם כפתורי אייקון שנפתחים בחלון קטן.
  const cells = [...LENS_CELLS, ["use", "איך משתמשים", "origin"]].filter(([k]) => lens[k]);
  head.innerHTML = `<div class="ph-title"></div><div class="ph-tips">${cells.map(([k, he, ic]) => `<details class="tip"><summary>${icon(ic)}<span>${he}</span></summary><div class="tip-pop">${rich(typeof lens[k] === "function" ? lens[k]() : lens[k])}</div></details>`).join("")}</div>`;
  const fb = focusBar(grid, name);
  if (fb) head.insertBefore(fb, head.querySelector(".ph-tips"));
  if (titleBox) {
    const tools = titleBox.parentElement;
    head.querySelector(".ph-title").append(titleBox);
    if (tools && tools.classList.contains("gallery-tools") && !tools.textContent.trim()) tools.remove();
  }
  // חלון אחד פתוח בכל פעם, ולחיצה בחוץ סוגרת
  head.addEventListener("toggle", (e) => { if (e.target.open) head.querySelectorAll("details.tip[open]").forEach((d) => d !== e.target && (d.open = false)); }, true);
  document.addEventListener("click", (e) => { if (!e.target.closest(".tip")) head.querySelectorAll("details.tip[open]").forEach((d) => (d.open = false)); });
  grid.prepend(head);
  grid.classList.add("framed");
}

// רמה 3: גוף ונפש, תמיד בראש הטור הצדדי ובאותו מקום. המידע משתנה לפי הנושא. מתחתם נגלל רק המידע הכמותי.
// body/soul: {t, sub} . sub הוא מאיפה המידע. extra: שורה קבועה נוספת (למשל "מתי בשנה").
export function dock(aside, { body, soul, extra = "" }) {
  if (!aside) return;
  aside.querySelector(".bs-dock")?.remove();
  const half = (cls, ic, word, x) => `<section class="bs-h ${cls}" aria-label="${word}"><header>${icon(ic)}<b>${word}</b>${x?.sub ? `<span>${esc(x.sub)}</span>` : ""}</header><p>${x ? rich(x.t) : `<span class="bs-empty">אין מידע לנושא הזה.</span>`}</p></section>`;
  const el = document.createElement("div");
  el.className = "bs-dock";
  el.innerHTML = `<div class="bs-pair">${half("bs-body", "body", "גוף", body) + half("bs-soul", "mind", "נפש", soul)}</div>${extra ? `<div class="bs-extra">${extra}</div>` : ""}`;
  aside.prepend(el);
}

export const monthName = () => MONTHS[nowMonth() - 1];
