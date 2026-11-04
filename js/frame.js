// מסגרת קבועה לכל מסך, בשלוש רמות:
// 1. כותרת הדף ועדשה: למה חשוב, מה דומה ומה שונה, איך בוחרים, ומתי. שורה אחת מעל הכול.
// 2. המוקד: הכלי החזותי של המסך (בתוך הפאנל הראשי).
// 3. הפרטים: הטור הצדדי, ובתחתיתו, תמיד באותו מקום, "גוף" ו"נפש" של הנושא שנבחר.
import { rich, esc, MONTHS, nowMonth } from "./ui.js";
import { icon } from "./plantviz.js";
import { LENSES } from "./data/lenses.js";

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
  head.innerHTML = `<div class="ph-title"></div><dl class="lens">${LENS_CELLS.map(([k, he, ic]) => `<div class="lens-c lens-${k}">${icon(ic)}<dt>${he}</dt><dd>${rich(typeof lens[k] === "function" ? lens[k]() : lens[k])}</dd></div>`).join("")}</dl>`;
  if (titleBox) {
    const tools = titleBox.parentElement;
    head.querySelector(".ph-title").append(titleBox);
    if (tools && tools.classList.contains("gallery-tools") && !tools.textContent.trim()) tools.remove();
  }
  grid.prepend(head);
  grid.classList.add("framed");
}

// רמה 3: גוף ונפש, תמיד בתחתית הטור הצדדי. המידע משתנה לפי הנושא.
// body/soul: {t, sub} . sub הוא מאיפה המידע (שם המזון, המסורת, הפסוק).
export function dock(aside, { body, soul }) {
  if (!aside) return;
  aside.querySelector(".bs-dock")?.remove();
  const half = (cls, ic, word, x) => `<section class="bs-h ${cls}" aria-label="${word}"><header>${icon(ic)}<b>${word}</b>${x?.sub ? `<span>${esc(x.sub)}</span>` : ""}</header><p>${x ? rich(x.t) : `<span class="bs-empty">אין מידע לנושא הזה.</span>`}</p></section>`;
  const el = document.createElement("div");
  el.className = "bs-dock";
  el.innerHTML = half("bs-body", "body", "גוף", body) + half("bs-soul", "mind", "נפש", soul);
  aside.append(el);
}

export const monthName = () => MONTHS[nowMonth() - 1];
