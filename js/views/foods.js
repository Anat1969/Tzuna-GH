// מזון: גלריה של צילומים (מוקד) וגיליון פריט (טור צד).
// גיליון: ייחודיות, גוף, נפש, עם מה כן ולא, שלוש שכבות ושימוש. המקורות מקופלים בתחתית, במקום אחד.
import { FOODS, CATEGORIES, ALLERGENS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { PHOTOS } from "../data/photos.js";
import { rich, stratum, LAYERS, esc, iconBtn, MONTHS, MONTHS_SHORT, nowMonth, sourcesBox } from "../ui.js";
import { plate } from "../plates.js";
import { patch } from "../route.js";
import { recipesWith, RECIPES } from "../data/recipes.js";
import { SCIENCE } from "../data/science.js";
import { synergiesFor } from "../data/synergies.js";
import { evMeter } from "../ui.js";
import { medicineFor } from "../data/medicine.js";
import { PARTS } from "../data/plant.js";
import { icon, timeBadge } from "../plantviz.js";
import { dock } from "../frame.js";
import { EVIDENCE } from "../data/sources.js";

export const title = "מזון";

let root, state;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.he || "";

// תמונה: צילום כשיש, ואחרת איור הרבריום.
export function foodImage(f, { big = false } = {}) {
  const p = PHOTOS[f.id];
  // בלי צילום נכון: כרטיס טיפוגרפי, לא איור (חור עדיף על תמונה מטעה, ואיור נראה ילדותי).
  if (!p) return `<span class="type-card" role="img" aria-label="${esc(f.he)}"><b>${esc(f.he)}</b><i>${esc(f.la)}</i></span>`;
  return `<img src="${p.src}" alt="${esc(f.he)}" loading="${big ? "eager" : "lazy"}" decoding="async" width="${p.w || 640}" height="${p.h || 480}">`;
}
export const photoCredit = (f) => { const p = PHOTOS[f.id]; return p ? `<span class="credit">${esc(p.credit)} · ${esc(p.license)}</span>` : ""; };

// חיפוש עברי. נרמול: בלי ניקוד, אותיות סופיות כרגילות, גרש וגרשיים אחידים.
const FINAL = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };
const norm = (s) => String(s || "").toLowerCase().replace(/[\u0591-\u05C7]/g, "").replace(/[ךםןףץ]/g, (c) => FINAL[c]).replace(/[׳`’]/g, "'").replace(/[״“”]/g, '"');
// לשם: בלי סימנים בכלל, כדי ש"ג'ינג'ר" ו"גינגר" ייפגשו.
const bare = (s) => norm(s).replace(/[^\u05D0-\u05EAa-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
// גזע גס: יחיד ורבים ("עדשה" ו"עדשים", "עגבנייה" ו"עגבניות").
const stem = (w) => (w.length > 3 ? w.replace(/(ים|ות|ה|ת)$/, "").replace(/י+$/, "") : w);
const namesOf = (f) => [f.he, f.en, ...(f.alt || [])].map(bare).filter(Boolean);

// ציון לכל מזון: שם מדויק, תחילת שם, מילה בשם, ואחר כך טקסט הגיליון.
// בטקסט: התאמה בתחילת מילה אחרי אותיות שימוש. מילה עד 3 אותיות חייבת להיות שלמה.
function scorer(q) {
  const qb = bare(q).replace(/^ה(?=[\u05D0-\u05EA]{3})/, "");
  if (!qb) return null;
  const t = norm(q).replace(/[^\u05D0-\u05EAa-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const res = words.map((w) => w.length <= 3
    ? new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}($|[^\\u0590-\\u05FFa-z])`, "i")
    : new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}`, "i"));
  return (f) => {
    let best = 0;
    for (const n of namesOf(f)) {
      if (n === qb) best = Math.max(best, 100);
      else if (stem(n) === stem(qb)) best = Math.max(best, 90);
      else if (qb.length >= 2 && n.startsWith(qb)) best = Math.max(best, 80);
      else if (qb.length >= 2 && n.split(" ").some((w) => w.startsWith(qb) || (qb.length >= 3 && stem(w) === stem(qb)))) best = Math.max(best, 60);
      else if (qb.length >= 3 && qb.startsWith(n + " ")) best = Math.max(best, 50);
    }
    if (best) return best;
    const pr = PROFILES[f.id] || {};
    const hay = norm([f.he, f.en, f.la, ...(f.alt || []), f.family, f.family_la, f.part, catName(f.cat), f.recognize.t, f.use.t, pr.unique, pr.body?.t, pr.soul?.t,
      ...(pr.with || []).map((x) => x.t), ...(pr.without || []).map((x) => x.t),
      ...LAYERS.flatMap((l) => f.layers[l.key].map((x) => `${x.t} ${x.trad || ""} ${x.ref || ""}`))].join(" ").replace(/\*\*|==/g, ""));
    return res.length && res.every((r) => r.test(hay)) ? 10 : 0;
  };
}
// המזון הכי מתאים לחיפוש, מכל הגלריה (לא רק מהקטגוריה שנבחרה).
export function bestMatch(q) {
  const sc = scorer(q || "");
  if (!sc) return null;
  let top = null, topScore = 0;
  for (const f of FOODS) { const s = sc(f); if (s > topScore) { top = f; topScore = s; } }
  return top;
}

const visible = () => FOODS.filter((f) => !state.cats.length || state.cats.includes(f.cat));

// קיבוץ הגלריה: לפי קטגוריה, עונה, חלק בצמח או עוצמת ראיה. בכל קבוצה מיון לפי השם.
const SEASON_OF = [["חורף", [12, 1, 2]], ["אביב", [3, 4, 5]], ["קיץ", [6, 7, 8]], ["סתיו", [9, 10, 11]]];
const GROUPS = {
  none: { he: "הכול" },
  cat: { he: "קטגוריה", key: (f) => catName(f.cat), order: CATEGORIES.map((c) => c.he) },
  season: { he: "עונה", key: (f) => { if (!f.months.length || f.months.length >= 11) return "כל השנה"; const best = SEASON_OF.map(([n, ms]) => [n, ms.filter((m) => f.months.includes(m)).length]).sort((a, b) => b[1] - a[1])[0]; return best[0]; }, order: ["חורף", "אביב", "קיץ", "סתיו", "כל השנה"] },
  part: { he: "חלק בצמח", key: (f) => PARTS.find((p) => p.foods.includes(f.id))?.he || "אחר", order: [...PARTS.map((p) => p.he), "אחר"] },
  ev: { he: "עוצמת ראיה", key: (f) => { const evs = f.layers.known.map((x) => EVIDENCE.indexOf(x.ev)).filter((i) => i >= 0); return evs.length ? "ראיה " + EVIDENCE[Math.min(...evs)] : "בלי מחקר"; }, order: [...EVIDENCE.map((e) => "ראיה " + e), "בלי מחקר"] }
};
function groups() {
  const list = visible(), g = GROUPS[state.g];
  if (!g || !g.key) return [[null, list]];
  const by = {};
  for (const f of list) (by[g.key(f)] ||= []).push(f);
  return g.order.filter((k) => by[k]).map((k) => [k, by[k].sort((a, b) => a.he.localeCompare(b.he, "he"))]);
}
// סדר התצוגה בפועל, גם לקודם והבא בגיליון.
const ordered = () => groups().flatMap(([, l]) => l);
// שפת הסימנים של המיון: אותו סימן בכפתור (מקרא חי), בכותרת הקבוצה ובאריח.
const CAT_VIS = { seven: ["#7a5b2a", "fruit"], grains: ["#c09a3a", "seed"], legumes: ["#9a5a32", "seed"], nuts: ["#6f4f2f", "seed"], veg: ["#5f8f3a", "leaf"], herbs: ["#3f7f5a", "leaf"], algae: ["#2f6f6a", "leaf"] };
const SEASON_VIS = { "חורף": ["#3d6f9e", "snow"], "אביב": ["#6fae5a", "bloom"], "קיץ": ["#d9a12a", "sun"], "סתיו": ["#b8642c", "leaffall"], "כל השנה": ["#84837d", "allyear"] };
const evBars = (i) => `<span class="evb" aria-hidden="true">${[0, 1, 2, 3, 4].map((j) => `<i class="${j < 5 - i ? "on" : ""}"></i>`).join("")}</span>`;
function groupMark(g, k) {
  if (g === "cat") { const c = CATEGORIES.find((x) => x.he === k); const [h, ic] = CAT_VIS[c?.id] || ["#888", "leaf"]; return `<span class="gm" style="color:${h}">${icon(ic)}</span>`; }
  if (g === "season") { const [h, ic] = SEASON_VIS[k] || ["#888", "allyear"]; return `<span class="gm" style="color:${h}">${icon(ic)}</span>`; }
  if (g === "part") { const p = PARTS.find((x) => x.he === k); return `<span class="gm" style="color:${p?.hue || "#888"}">${icon(p?.id || "plant")}</span>`; }
  if (g === "ev") { const i = EVIDENCE.findIndex((e) => "ראיה " + e === k); return evBars(i < 0 ? 5 : i); }
  return "";
}
function legendOf(g) {
  if (g === "cat") return CATEGORIES.map((c) => groupMark("cat", c.he)).join("");
  if (g === "season") return Object.keys(SEASON_VIS).map((k) => groupMark("season", k)).join("");
  if (g === "part") return PARTS.map((p) => groupMark("part", p.he)).join("");
  if (g === "ev") return evBars(0);
  return "";
}
function groupedHTML() {
  return groups().map(([k, l]) => (k ? `<h3 class="g-head">${groupMark(state.g, k)}<span>${esc(k)}</span><bdi class="num">${l.length}</bdi></h3>` : "") + l.map(cardHTML).join("")).join("");
}
// משפט תובנה לכל קיבוץ: מה הוא חושף.
function groupInsight() {
  const gs = groups(); if (gs.length < 2) return "";
  const big = [...gs].sort((a, b) => b[1].length - a[1].length)[0], small = [...gs].sort((a, b) => a[1].length - b[1].length)[0];
  const n = visible().length;
  const T = {
    cat: `==**${big[0]}** היא הקבוצה הגדולה==, **${big[1].length}** מתוך **${n}**.`,
    season: `==**${big[0]}** עשיר פי ${big[1].length >= small[1].length * 3 ? "שלושה ויותר" : "שניים"} מ${small[0]}.==`,
    part: `==**${big[0]}** מוביל==: **${big[1].length}** מתוך **${n}** מזונות.`,
    ev: (() => { const hi = gs.find(([k]) => k === "ראיה גבוהה"); return hi ? `==**${hi[1].length}** מתוך **${n}** נשענים על ראיה גבוהה.==` : ""; })()
  };
  return T[state.g] ? `<span class="g-ins">${rich(T[state.g])}</span>` : "";
}
// כפתורי המיון הם גם מקרא: כל כפתור מראה את הסימנים שלו. "הכול" בסוף השורה.
const groupChips = () => `<span class="label gb-title">מיון לפי</span>` + Object.entries(GROUPS).filter(([k]) => k !== "none").map(([k, g]) => `<button class="gb" data-group="${k}" aria-pressed="${state.g === k}"><b>${g.he}</b><span class="gb-k">${legendOf(k)}</span></button>`).join("")
  + `<button class="chip-all" data-group="none" aria-pressed="${state.g === "none"}">הכול</button>` + groupInsight();

function chipsHTML() {
  const all = `<button class="chip-all" data-cat="" aria-pressed="${!state.cats.length}">הכול<span class="count">${FOODS.length}</span></button>`;
  // "הכול" לא נראה כמו קטגוריה: קישור שקט בסוף השורה.
  return CATEGORIES.map((c) => {
    const on = state.cats.includes(c.id);
    const n = FOODS.filter((f) => f.cat === c.id).length;
    const add = state.cats.length && !on ? `<button class="chip-add" data-add="${c.id}" title="הוספה לבחירה" aria-label="הוספת ${c.he} לבחירה">+</button>` : "";
    const rem = on && state.cats.length > 1 ? `<button class="chip-add" data-rem="${c.id}" title="הסרה מהבחירה" aria-label="הסרת ${c.he} מהבחירה" style="opacity:1">−</button>` : "";
    return `<span class="chip-wrap"><button class="chip" data-cat="${c.id}" aria-pressed="${on}">${c.he}<span class="count">${n}</span></button>${add}${rem}</span>`;
  }).join("") + all;
}

// אייקון החלק בצמח ליד כל אריח, באותה שפה של המיון.
function partBadge(f) { const p = PARTS.find((x) => x.foods.includes(f.id)); return p ? `<span class="pb" style="color:${p.hue}" title="חלק בצמח: ${esc(p.he)}">${icon(p.id)}</span>` : ""; }
function cardHTML(f) {
  const marks = LAYERS.map((l) => `<i class="layer-mark lm-${l.key} ${f.layers[l.key].length ? "" : "off"}" title="${l.he}: ${f.layers[l.key].length}"></i>`).join("");
  return `<button class="food-card press ${PHOTOS[f.id] ? "has-photo" : ""}" data-id="${f.id}" aria-pressed="${state.id === f.id}" aria-label="${esc(f.he)}">
    <span class="thumb">${foodImage(f)}</span>
    <span class="cap"><b>${esc(f.he)}</b><span class="latin">${esc(f.la)}</span><span class="marks">${marks}${partBadge(f)}${timeBadge(f.months, f.meal ? (f.meal === "before" ? ", קודם הארוחה" : ", אחרי הארוחה") : "")}</span></span>
  </button>`;
}

function monthsBar(f) {
  const now = nowMonth();
  return `<div class="months" aria-label="עונה">${MONTHS.map((m, i) => `<i class="${f.months.includes(i + 1) ? "on" : ""} ${i + 1 === now ? "now" : ""}" title="${m}${f.months.includes(i + 1) ? ": " + esc(f.season_kind) : ""}"></i>`).join("")}</div>
    <div class="months-l">${MONTHS_SHORT.map((m) => `<span>${m}</span>`).join("")}</div>`;
}

// מדע, צירופים מעצימים ומעשה: החלק שעונה על "למה זה חשוב, ועם מה, ולמה".
function scienceHTML(f) {
  const sc = SCIENCE[f.id];
  const syn = synergiesFor(f.id);
  const dish = (id) => RECIPES.find((r) => r.id === id);
  return `${sc ? `<section class="sec sci"><div class="sec-h"><h3>למה זה חשוב</h3><span class="label">מה המדע מצא</span></div>
      <p class="why">${rich(sc.why)}</p>
      ${sc.studied.map((x) => `<div class="found"><p>${rich(x.t)}</p>${evMeter(x.ev)}</div>`).join("")}
    </section>` : ""}
    ${syn.length ? `<section class="sec"><div class="sec-h"><h3>צירופים מעצימים</h3><span class="label">מה מפעיל את מה, ולמה</span></div>
      ${syn.map((x) => `<div class="syn ${x.kind}"><b class="syn-t">${x.kind === "boost" ? "מעצים" : "מחליש"} · ${esc(x.title)}</b><p>${rich(x.how)}</p>
        <p class="syn-dish"><span class="tile-l">בצלחת</span>${rich(x.suggest)}${x.dishes.length ? " " + x.dishes.map((d) => dish(d)).filter(Boolean).map((r) => `<a href="#/recipes?id=${r.id}">${esc(r.he)}</a>`).join(" · ") : ""}</p></div>`).join("")}
    </section>` : ""}
    ${sc ? `<section class="sec"><div class="sec-h"><h3>מעשי</h3><span class="label">בחירה, אחסון והכנה</span></div>
      <ul class="practical">${sc.practical.map((t) => `<li>${rich(t)}</li>`).join("")}</ul></section>` : ""}`;
}

// הולך עם: המזונות מהגלריה שמוזכרים בהדגשה (לפני הנקודתיים) מופיעים בצילום ליד ההסבר.
const STOP = ["פלפל שחור", "תה שחור", "תה ירוק", "עלים ירוקים", "דבש תמרים"];
const NAME_INDEX = FOODS.flatMap((f) => [f.he, f.he.replace(/\s*\(.*\)/, ""), (f.he.match(/\((.*)\)/) || [])[1], ...(f.alt || [])]
  .filter(Boolean).map((n) => [bare(n), f.id])).sort((a, b) => b[0].length - a[0].length);
export function partnersOf(t, selfId) {
  const head = t.split(":")[0];
  let txt = " " + bare((head.match(/\*\*[^*]+\*\*/g) || [head]).join(" , ")) + " ";
  for (const w of STOP) txt = txt.split(bare(w)).join(" ");
  const hits = [];
  for (const [n, id] of NAME_INDEX) {
    const re = new RegExp(`(^|[^\u05D0-\u05EA])[ובהל]?${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^\u05D0-\u05EA])`);
    const m = txt.match(re);
    if (!m) continue;
    // מחליפים ברווחים באותו אורך, כדי שהמיקום של השאר יישמר.
    txt = txt.slice(0, m.index) + " ".repeat(m[0].length) + txt.slice(m.index + m[0].length);
    if (id !== selfId && !hits.some((h) => h.id === id)) hits.push({ id, at: m.index });
  }
  // בסדר שבו הם כתובים.
  return hits.sort((a, b) => a.at - b.at).map((h) => byId(h.id));
}
// הולך עם ולא הולך עם: שורה קצרה (מה שלפני הנקודתיים) עם צילומי השותפים. לחיצה פותחת את המנגנון.
function pairHTML(f, arr) {
  return arr.map((x) => {
    const ps = partnersOf(x.t, f.id);
    const i = x.t.indexOf(":");
    const head = i > 0 ? x.t.slice(0, i) : x.t;
    const rest = i > 0 ? x.t.slice(i + 1).trim() : "";
    const bubbles = ps.length ? `<span class="pi-ph">${ps.map((p) => `<a class="pi-f" href="#/foods?id=${p.id}" title="${esc(p.he)}" aria-label="${esc(p.he)}, לגיליון">${foodImage(p)}</a>`).join("")}</span>` : "";
    return `<div class="pi${rest ? " has-more" : ""}">${bubbles}<div class="pi-t"${rest ? ` role="button" tabindex="0" aria-expanded="false"` : ""}><span class="pi-h">${rich(head)}</span>${rest ? `<span class="pi-more">${rich(rest)}</span>` : ""}</div></div>`;
  }).join("");
}

const tile = (label, cls, body) => `<div class="tile ${cls}"><span class="tile-l">${label}</span>${body}</div>`;

function sheetHTML(f) {
  const list = ordered();
  const idx = list.findIndex((x) => x.id === f.id);
  const pr = PROFILES[f.id] || {};
  const meal = f.meal ? `<dt>ארוחה</dt><dd>${rich(f.meal === "before" ? "**קודם** הארוחה, לפי הרמב\"ם" : "**תכף אחרי** הארוחה, לפי הרמב\"ם")}</dd>` : "";
  const allergens = f.allergens.length ? `<dt>אלרגנים</dt><dd><b>${esc(f.allergens.map((a) => ALLERGENS[a]).join(", "))}</b></dd>` : "";
  const recs = recipesWith(f.id);
  const med = medicineFor(f.id);
  const months = f.months.length ? `${monthsBar(f)}<p class="hint">${esc(f.season_kind)}: <b>${esc(f.months.map((m) => MONTHS[m - 1]).join(", "))}</b></p>` : `<p style="font-size:14px">${rich("**כל השנה**, ביבוא.")}</p>`;
  const srcIds = [...(SCIENCE[f.id]?.studied || []).map((x) => x.src), ...synergiesFor(f.id).map((x) => x.src), f.recognize.src, f.use.src, pr.body?.src, pr.soul?.src, ...(pr.with || []).map((x) => x.src), ...(pr.without || []).map((x) => x.src),
    ...LAYERS.flatMap((l) => f.layers[l.key].map((x) => x.src)), "season-est"];
  // תמונה, שם, ייחודיות ו"הולך עם" במבט אחד: השם והמשפט על הצילום, והצירופים מיד מתחתיו.
  return `<div class="sheet-hero zoomable" data-zoom-cap="${esc(f.he)}">${foodImage(f, { big: true })}${photoCredit(f)}
      <div class="ops on-photo">${iconBtn("prev", "הקודם", `data-step="-1" ${idx <= 0 ? "disabled" : ""}`)}<span class="pos"><bdi class="num" style="font-weight:400">${idx + 1}/${list.length}</bdi></span>${iconBtn("next", "הבא", `data-step="1" ${idx >= list.length - 1 ? "disabled" : ""}`)}${iconBtn("x", "סגירה", "data-close")}</div>
      <div class="hero-cap">
        <h2 class="sheet-name" id="sheet-title">${esc(f.he)} <span class="latin">${esc(f.la)}</span></h2>
        <div class="sheet-tags"><span>${esc(catName(f.cat))}</span><span>משפחת ה<b>${esc(f.family)}</b></span><span>נאכל: <b>${esc(f.part)}</b></span></div>
        ${pr.unique ? `<p class="unique">${rich(pr.unique)}</p>` : ""}
      </div>
    </div>
    <div class="panel-body scroll-in" style="flex:1">
      ${pr.with?.length || pr.without?.length ? `<div class="pairs">
        ${pr.with?.length ? `<section class="pair p-with"><h4>הולך עם</h4>${pairHTML(f, pr.with)}</section>` : ""}
        ${pr.without?.length ? `<section class="pair p-without"><h4>לא הולך עם</h4>${pairHTML(f, pr.without)}</section>` : ""}
      </div>` : ""}
      ${scienceHTML(f)}
      <section class="sec"><div class="sec-h"><h3>מה ידוע, מה נאמר, במה מאמינים</h3></div>
        ${LAYERS.map((l) => stratum(l.key, f.layers[l.key])).join("")}
      </section>
      <section class="sec"><div class="sec-h"><h3>הכרה ושימוש</h3></div>
        <dl class="row-kv"><dt>מבנה</dt><dd>${rich(f.recognize.t)}</dd><dt>במטבח</dt><dd>${rich(f.use.t)}</dd>${meal}${allergens}</dl>
        <div style="margin-top:10px">${months}</div>
        ${recs.length ? `<div style="margin-top:10px"><span class="label">מתכונים</span><div class="recipe-links" style="margin-top:4px">${recs.map((r) => `<a class="press btn" style="text-decoration:none;padding:6px 12px;font-size:13px" href="#/recipes?id=${r.id}">${esc(r.he)}</a>`).join("")}</div></div>` : ""}
        ${med.length ? `<div class="med-links" style="margin-top:10px"><span class="label">ברפואה</span><div class="recipe-links" style="margin-top:4px">${med.map((m) => `<a class="press btn" style="text-decoration:none;padding:6px 12px;font-size:13px" href="${esc(m.url)}" target="_blank" rel="noopener" aria-label="${esc(m.he)}, באפליקציה רפואה, נפתח בלשונית חדשה">${esc(m.he)}</a>`).join("")}</div></div>` : ""}
      </section>
      ${sourcesBox(srcIds)}
    </div>`;
}

function renderGallery() {
  root.querySelector("#gallery").innerHTML = groupedHTML();
  root.querySelector("#gchips").innerHTML = groupChips();
  root.querySelector("#chips").innerHTML = chipsHTML();
  applySearch();
}

// תוכן הגיליון: כפתור לכל סעיף, וחצים שעוברים מסעיף לסעיף. הגיליון ארוך מאז שהמסגרות לפי התוכן.
function sheetToc(aside) {
  const body = aside.querySelector(".panel-body"); if (!body) return;
  const parts = [...body.querySelectorAll(":scope > .pairs, :scope > section.sec, :scope > details.sources-box")].map((el) => ({
    el, he: el.classList.contains("pairs") ? "עם ובלי" : el.matches("details") ? "מקורות" : (el.querySelector(".sec-h h3")?.textContent.trim() || "").replace("מה ידוע, מה נאמר, במה מאמינים", "שלוש שכבות")
  })).filter((p) => p.he);
  if (parts.length < 3) return;
  const nav = document.createElement("nav");
  nav.className = "sheet-toc";
  nav.setAttribute("aria-label", "סעיפי הגיליון");
  let at = -1;
  const go = (i) => {
    at = Math.max(0, Math.min(parts.length - 1, i));
    const t = parts[at].el; if (t.matches("details")) t.open = true;
    const bar = (document.querySelector(".topbar")?.offsetHeight || 0) + 8;
    scrollTo({ top: scrollY + t.getBoundingClientRect().top - bar, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    nav.querySelectorAll("[data-toc]").forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.toc) === at)));
  };
  nav.innerHTML = `<button type="button" class="toc-step" data-toc-step="-1" aria-label="הסעיף הקודם">›</button>${parts.map((p, i) => `<button type="button" data-toc="${i}" aria-current="false">${esc(p.he)}</button>`).join("")}<button type="button" class="toc-step" data-toc-step="1" aria-label="הסעיף הבא">‹</button>`;
  nav.addEventListener("click", (e) => {
    const b = e.target.closest("[data-toc]"); if (b) return go(Number(b.dataset.toc));
    const st = e.target.closest("[data-toc-step]"); if (st) go(at + Number(st.dataset.tocStep));
  });
  body.prepend(nav);
}

function renderSheet({ scroll = false } = {}) {
  const aside = root.querySelector("#sheet");
  const f = byId(state.id);
  if (!f) {
    aside.innerHTML = `<div class="panel-body" style="display:grid;place-items:center;height:100%;text-align:center;color:var(--ink-soft)"><p>${rich("**בחרו מזון** מהגלריה.")}</p></div>`;
    return;
  }
  aside.innerHTML = sheetHTML(f);
  sheetToc(aside);
  // לחיצה על צירוף פותחת את המנגנון שלו, ומצניעה את האחרים.
  aside.querySelectorAll(".pi.has-more .pi-t").forEach((t) => {
    const go = () => { const on = t.getAttribute("aria-expanded") !== "true"; aside.querySelectorAll(".pi-t[aria-expanded]").forEach((o) => o.setAttribute("aria-expanded", "false")); t.setAttribute("aria-expanded", String(on)); aside.querySelector(".pairs").classList.toggle("focus", on); };
    t.addEventListener("click", go);
    t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
  const pr = PROFILES[f.id] || {};
  dock(aside, { body: pr.body && { t: pr.body.t, sub: f.he }, soul: pr.soul && { t: pr.soul.t, sub: [pr.soul.trad, pr.soul.ref].filter(Boolean).join(" · ") } });
  root.querySelectorAll(".food-card").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.id === state.id)));
  if (scroll) aside.querySelector(".scroll-in")?.scrollTo(0, 0);
}

function select(id, opts) {
  state.id = id;
  patch({ id: id || undefined });
  renderSheet(opts);
}

let applySearch = () => {};
export function search(text, { commit = false } = {}) {
  state.q = text;
  const top = bestMatch(text);
  // ההתאמה מחוץ לקטגוריה שנבחרה: מבטלים את הסינון, כדי שהיא תופיע.
  if (top && state.cats.length && !state.cats.includes(top.cat)) { state.cats = []; renderGallery(); }
  if (top && top.id !== state.id) { state.id = top.id; renderSheet({ scroll: true }); }
  patch({ q: text || undefined, id: state.id || undefined, cat: state.cats.join(",") || undefined });
  applySearch();
  if (top) root.querySelector(`.food-card[data-id="${top.id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  if (commit && top) document.querySelector("#q")?.blur();
}

export function mount(el, params, ctx) {
  root = el;
  state = {
    id: params.id || null,
    cats: (params.cat || "").split(",").filter((c) => CATEGORIES.some((x) => x.id === c)),
    q: params.q || ctx.query || "",
    g: GROUPS[params.g] ? params.g : "none"
  };
  const qInput = document.querySelector("#q");
  if (state.q && qInput && qInput.value !== state.q) qInput.value = state.q;
  // חיפוש שהגיע ממסך אחר: הגיליון נפתח על ההתאמה הטובה.
  const top = !params.id && bestMatch(state.q);
  if (top) { state.id = top.id; if (state.cats.length && !state.cats.includes(top.cat)) state.cats = []; }
  if (!state.id) state.id = (visible()[0] || {}).id;

  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="g-title">
      <div class="gallery-tools">
        <div style="min-width:0"><h1 class="view-title" id="g-title">המזונות</h1><p class="view-sub">${rich("לכל מזון: **ייחודיות**, **גוף**, **נפש**, ועם מה הוא הולך.")}</p></div>
        <span class="src" id="hits" aria-live="polite"></span>
      </div>
      <div class="gallery-tools" style="padding-top:4px;padding-bottom:6px"><div class="chips" id="chips" role="group" aria-label="קטגוריות"></div></div>
      <div class="gallery-tools g-tools"><div class="chips" id="gchips" role="group" aria-label="קיבוץ"></div></div>
      <div class="scroll-in gallery-box" style="flex:1"><div class="gallery" id="gallery"></div></div>
    </section>
    <aside class="panel sheet" id="sheet" aria-labelledby="sheet-title"></aside>
  </div>`;

  applySearch = () => {
    const m = scorer(state.q);
    let n = 0;
    root.querySelectorAll(".food-card").forEach((c) => {
      const hit = !m || m(byId(c.dataset.id)) > 0;
      if (hit && m) n++;
      c.classList.toggle("dim", !!m && !hit);
      c.classList.toggle("hit", !!m && hit);
    });
    root.querySelector("#hits").innerHTML = m ? (n ? `<bdi class="num">${n}</bdi> תוצאות ל"${esc(state.q)}"` : `אין עדיין גיליון ל"${esc(state.q)}"`) : `<bdi class="num">${visible().length}</bdi> מזונות`;
  };

  renderGallery();
  renderSheet();
  if (top) requestAnimationFrame(() => root.querySelector(`.food-card[data-id="${top.id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" }));

  root.addEventListener("click", (e) => {
    const card = e.target.closest(".food-card");
    if (card) return select(card.dataset.id, { scroll: true });
    const gb = e.target.closest("[data-group]");
    if (gb) { state.g = gb.dataset.group; patch({ g: state.g === "none" ? undefined : state.g }); return renderGallery(); }
    const chip = e.target.closest("[data-cat]");
    if (chip) {
      const c = chip.dataset.cat;
      state.cats = !c || (state.cats.length === 1 && state.cats[0] === c) ? [] : [c];
      patch({ cat: state.cats.join(",") || undefined });
      return renderGallery();
    }
    const add = e.target.closest("[data-add]");
    if (add) { state.cats = [...state.cats, add.dataset.add]; patch({ cat: state.cats.join(",") }); return renderGallery(); }
    const rem = e.target.closest("[data-rem]");
    if (rem) { state.cats = state.cats.filter((c) => c !== rem.dataset.rem); patch({ cat: state.cats.join(",") || undefined }); return renderGallery(); }
    const step = e.target.closest("[data-step]");
    if (step) {
      const list = ordered(); const i = list.findIndex((x) => x.id === state.id);
      const nx = list[i + Number(step.dataset.step)];
      if (nx) select(nx.id);
      return;
    }
    if (e.target.closest("[data-close]")) return select(null);
  });

  const onKey = (e) => {
    if (e.target.closest("input, textarea, select") || document.getElementById("safety-overlay")) return;
    if (!state.id) return;
    // החצים עברו לדפדוף המשותף בתוך הפרק (js/frame.js). כאן נשאר רק Esc.
    if (e.key === "Escape") select(null);
  };
  addEventListener("keydown", onKey);
  return () => removeEventListener("keydown", onKey);
}

export function update(params) {
  if ((params.id || null) !== state.id) { state.id = params.id || null; renderSheet(); }
  const g = GROUPS[params.g] ? params.g : "none";
  if (g !== state.g) { state.g = g; renderGallery(); }
  const cats = (params.cat || "").split(",").filter(Boolean);
  if (cats.join() !== state.cats.join()) { state.cats = cats; renderGallery(); }
  if (params.q !== undefined && params.q !== state.q) { state.q = params.q; document.querySelector("#q").value = params.q; applySearch(); }
}
