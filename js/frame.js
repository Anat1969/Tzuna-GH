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

// דפדוף בתוך אותו פרק: הקודם והבא בין הרשומות של אותה קבוצה, עם שם הקבוצה.
// items: הרשומות. on: איך מזהים את הנבחרת. head: כותרות שמחלקות לפרקים. group: מיכל שמגדיר פרק (שמו ב-aria-label).
const PAGER = {
  foods: { items: ".food-card", on: '[aria-pressed="true"]', head: ".g-head", label: (g) => g.querySelector('#chips [aria-pressed="true"]:not([data-cat=""])')?.firstChild?.textContent?.trim() || "כל המזונות" },
  nutrients: { items: "tr.nt-row", on: ".on", head: "tr.nt-kind", label: () => "רכיבים" },
  plant: { items: ".pl-tab", on: '[aria-pressed="true"]', label: () => "חלקי הצמח" },
  methods: { items: "g.tl-m", on: ".on", label: () => "ציר הזמן" },
  seasons: { items: ".yg-m", on: '[aria-pressed="true"]', label: () => "חודשי השנה" },
  recipes: { items: ".recipe-card, .net .ne", on: '[aria-pressed="true"], .on', label: (g) => (g.querySelector(".net") ? "צירופים" : "מתכונים") },
  compare: { items: ".disc", on: '[aria-pressed="true"]', label: () => "גילויים" },
  articles: { items: ".seg-b[data-a]", on: '[aria-pressed="true"]', group: '[role="group"][aria-label]', label: () => "כתבות" }
};
const CHEV = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
function chapter(grid, cfg) {
  const all = [...grid.querySelectorAll(cfg.items)].filter((el) => !el.closest(".page-head") && el.getClientRects().length);
  const cur = all.find((el) => el.matches(cfg.on));
  if (!cur) return null;
  let list = all, label = cfg.label(grid);
  if (cfg.head) {
    const heads = [...grid.querySelectorAll(cfg.head)];
    const before = (h, el) => h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
    const own = heads.filter((h) => before(h, cur)).pop();
    if (own) {
      const next = heads[heads.indexOf(own) + 1];
      list = all.filter((el) => before(own, el) && (!next || !before(next, el)));
      label = [...own.querySelectorAll("b, span")].map((x) => x.textContent.trim()).find(Boolean) || own.textContent.trim();
    }
  } else if (cfg.group) {
    const box = cur.closest(cfg.group);
    if (box) { list = all.filter((el) => box.contains(el)); label = box.getAttribute("aria-label"); }
  }
  return { list, i: list.indexOf(cur), label };
}
function pager(grid, name) {
  const cfg = PAGER[name];
  if (!cfg) return null;
  const el = document.createElement("div");
  el.className = "ph-pager";
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", "דפדוף בתוך הפרק");
  const draw = () => {
    const c = chapter(grid, cfg);
    el.hidden = !c || c.list.length < 2;
    if (el.hidden) return;
    el.innerHTML = `<button type="button" data-pg="-1" aria-label="הקודם בפרק ${c.label}" ${c.i <= 0 ? "disabled" : ""}>${CHEV("M9 6l6 6-6 6")}</button><span class="pg-pos"><bdi class="num">${c.i + 1}/${c.list.length}</bdi><span>${c.label}</span></span><button type="button" data-pg="1" aria-label="הבא בפרק ${c.label}" ${c.i >= c.list.length - 1 ? "disabled" : ""}>${CHEV("M15 6l-6 6 6 6")}</button>`;
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pg]"); if (!b || b.disabled) return;
    const c = chapter(grid, cfg); if (!c) return;
    const target = c.list[c.i + Number(b.dataset.pg)];
    if (!target) return;
    target.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    target.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    requestAnimationFrame(draw);
  });
  let queued = false;
  new MutationObserver((recs) => { if (recs.every((r) => el.contains(r.target))) return; if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; draw(); }); })
    .observe(grid, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-pressed", "class"] });
  requestAnimationFrame(draw);
  return el;
}

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
  const pg = pager(grid, name);
  if (pg) head.insertBefore(pg, fb || head.querySelector(".ph-tips"));
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
