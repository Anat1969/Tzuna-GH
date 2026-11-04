// שיטות: זמן ומקום הם ציר ומפה. מעליהם: גילויים מזוקקים מהטבלה, וכפתורי פרמטרים שממיינים ומדגישים.
// הדמויות בדיוקן אחיד, ולכל כלל אייקון שעוזר לזכור אותו (חם וקר, עונה, סדר, לשלב ולא לשלב).
import { METHODS, REGIONS, TRAITS, MATRIX, METHOD_INSIGHTS } from "../data/methods.js";
import { byId } from "../data/foods.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { icon, iconG } from "../plantviz.js";
import { MAP, project } from "../data/worldmap.js";

export const title = "שיטות";
let root, sel, sort;

const TRAIT_ICON = { taste: "taste", temp: "temp", season: "season", order: "order", nutrient: "nutrient", local: "local", table: "table", mind: "mind" };
const has = (m, t) => (MATRIX[m.id] || []).includes(t);
const hue = (m) => REGIONS.find((r) => r.id === m.region).hue;
const yearLabel = (y) => (y < 0 ? `${-y} לפנה"ס` : `${y}`);
const modern = (m) => m.from >= 1900;

// סדר התצוגה לפי הכפתור שנבחר: זמן, מקום (מזרח למערב), או פרמטר (מי שיש לו קודם).
function ordered() {
  const list = METHODS.slice();
  if (sort === "place") return list.sort((a, b) => (b.ll ? b.ll[0] : 999) - (a.ll ? a.ll[0] : 999));
  list.sort((a, b) => a.from - b.from);
  if (TRAITS.some((t) => t.id === sort)) return list.sort((a, b) => Number(has(b, sort)) - Number(has(a, sort)));
  return list;
}
const dim = (m) => TRAITS.some((t) => t.id === sort) && !has(m, sort);

// גילויים מהטבלה: מה שהטבלה מחביאה. נגזר מהמטריצה, לא נכתב ביד.
function discoveries() {
  const out = [];
  const set = (t) => METHODS.filter((m) => has(m, t.id));
  // הכלה: כל מי שמודד א' מודד גם ב'
  for (const a of TRAITS) for (const b of TRAITS) {
    if (a.id === b.id) continue;
    const A = set(a), B = set(b);
    if (A.length >= 4 && A.every((m) => has(m, b.id)) && B.length > A.length) out.push({ ic: a.id, t: `==כל שיטה שמודדת **${a.he}** מודדת גם **${b.he}**== (${A.length} מתוך ${A.length}).` });
  }
  // ניגוד: מסורת מול מדע
  const trad = METHODS.filter((m) => !modern(m)), mod = METHODS.filter(modern);
  const onlyTrad = TRAITS.filter((t) => trad.some((m) => has(m, t.id)) && !mod.some((m) => has(m, t.id)));
  const onlyMod = TRAITS.filter((t) => mod.some((m) => has(m, t.id)) && !trad.some((m) => has(m, t.id)));
  if (onlyTrad.length) out.push({ ic: onlyTrad[0].id, t: `**${onlyTrad.map((t) => t.he).join(" ו")}**: רק בשיטות מלפני המאה העשרים. ==השיטות המודרניות ויתרו על זה.==` });
  if (onlyMod.length) out.push({ ic: onlyMod[0].id, t: `**${onlyMod.map((t) => t.he).join(" ו")}**: רק בשיטות מהמאה העשרים ואילך. ==המסורת לא מדדה את זה.==` });
  // דירוג: השיטה המקיפה ביותר והצרה ביותר
  const rank = METHODS.slice().sort((a, b) => (MATRIX[b.id] || []).length - (MATRIX[a.id] || []).length);
  const top = rank[0], low = rank[rank.length - 1];
  out.push({ ic: "order", t: `**${top.he}** שוקלת **${(MATRIX[top.id] || []).length}** מתוך ${TRAITS.length} פרמטרים, הכי הרבה. **${low.he}** שוקל **${(MATRIX[low.id] || []).length}**. ==מהמקיף אל הממוקד.==` });
  // הנפוץ ביותר
  const pop = TRAITS.map((t) => [t, set(t).length]).sort((a, b) => b[1] - a[1])[0];
  out.push({ ic: pop[0].id, t: `**${pop[0].he}** הוא הפרמטר הנפוץ ביותר: **${pop[1]}** מתוך **${METHODS.length}** שיטות.` });
  return out.slice(0, 4);
}

// תובנה לפרמטר שנבחר: כמה, איפה, ומתי.
function traitInsight() {
  const t = TRAITS.find((x) => x.id === sort);
  if (!t) return "";
  const A = METHODS.filter((m) => has(m, t.id)).sort((a, b) => a.from - b.from);
  const regs = [...new Set(A.map((m) => REGIONS.find((r) => r.id === m.region).he))];
  const mod = A.filter(modern).length;
  return `<p class="mt-trait">${icon(TRAIT_ICON[t.id])}<span>${rich(`**${t.he}**: **${A.length}** מתוך **${METHODS.length}** שיטות, מ**${A[0].he}** ועד **${A[A.length - 1].he}**. ${regs.join(", ")}. ${mod ? `==${mod === 1 ? "שיטה מודרנית אחת" : "חלקן מודרניות"}.==` : "==אף שיטה מודרנית.=="}`)}</span></p>`;
}

function sortBar() {
  const btn = (id, ic, he) => `<button class="mt-sort" data-sort="${id}" aria-pressed="${sort === id}">${icon(ic)}<span>${esc(he)}</span></button>`;
  return `<div class="mt-sorts" role="group" aria-label="מיון לפי פרמטר">
    <span class="mt-sorts-l">מיון</span>
    ${btn("time", "order", "זמן")}${btn("place", "local", "מקום")}
    <span class="mt-sep" aria-hidden="true"></span>
    ${TRAITS.map((t) => btn(t.id, TRAIT_ICON[t.id], t.he)).join("")}
    <button class="mt-all" data-sort="time" ${sort === "time" ? 'aria-current="true"' : ""}>הכול, לפי זמן</button>
  </div>`;
}

// מפה: יבשה אמיתית (Natural Earth), נקודה לכל שיטה, וטבעת שפועמת סביב הנבחרת.
const LABEL = { bible: [8, -10, "start"], rogel: [-10, -9, "end"], rambam: [-10, 17, "end"], hippocrates: [8, 14, "start"], med: [-8, -8, "end"], galen: [-8, 14, "end"], hildegard: [-8, -6, "end"], nordic: [8, -4, "start"], ayurveda: [8, 4, "start"], tcm: [8, 4, "start"], washoku: [-8, -10, "end"] };
function mapSVG() {
  const pts = METHODS.filter((m) => m.ll).map((m) => {
    const [x, y] = project(m.ll[0], m.ll[1]), on = m.id === sel, [dx, dy, a] = LABEL[m.id] || [8, 4, "start"];
    return `<g class="mp ${on ? "on" : ""} ${dim(m) ? "dim" : ""}" data-m="${m.id}" role="button" tabindex="0" aria-label="${esc(m.he)}, ${esc(m.place)}">
      ${on ? `<circle class="mp-ring" cx="${x}" cy="${y}" r="10" stroke="${hue(m)}"/>` : ""}
      <circle cx="${x}" cy="${y}" r="${on ? 7 : 5}" fill="${hue(m)}" stroke="#fff" stroke-width="1.5"/>
      <text x="${x + dx}" y="${y + dy}" text-anchor="${a}" class="mp-t">${esc(m.he)}</text></g>`;
  }).join("");
  const glob = METHODS.find((m) => !m.ll);
  return `<svg class="mt-map" viewBox="0 0 ${MAP.W} ${MAP.H}" role="img" aria-label="מפה: איפה נולדה כל שיטה" style="direction:ltr">
    <defs><linearGradient id="mp-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eef5"/><stop offset="1" stop-color="#f6f4ee"/></linearGradient>
      <linearGradient id="mp-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e3d3"/><stop offset="1" stop-color="#d8cfb8"/></linearGradient>
      <filter id="mp-sh"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity=".15"/></filter></defs>
    <rect width="${MAP.W}" height="${MAP.H}" fill="url(#mp-sea)"/>
    <path d="${MAP.d}" fill="url(#mp-land)" stroke="#bfb49a" stroke-width=".8" filter="url(#mp-sh)"/>
    ${pts}
    ${glob ? `<g class="mp ${glob.id === sel ? "on" : ""} ${dim(glob) ? "dim" : ""}" data-m="${glob.id}" role="button" tabindex="0" aria-label="${esc(glob.he)}"><g transform="translate(${MAP.W - 210} ${MAP.H - 44})"><rect width="196" height="32" rx="16" fill="#fff" stroke="${hue(glob)}"/><g transform="translate(166 4) scale(1)" style="color:${hue(glob)}">${iconG("globe")}</g><text x="156" y="21" text-anchor="end" class="mp-t">${esc(glob.he)}: בכל מקום</text></g></g>` : ""}
  </svg>`;
}

// ציר זמן: סקאלה מקוטעת (העבר הרחוק דחוס), נתיב לכל אזור.
const SEG = [[-1100, -200, 0, 0.22], [-200, 1000, 0.22, 0.44], [1000, 1900, 0.44, 0.68], [1900, 2030, 0.68, 1]];
const tx = (year) => { const s = SEG.find(([a, b]) => year >= a && year <= b) || SEG[SEG.length - 1]; return s[2] + ((year - s[0]) / (s[1] - s[0])) * (s[3] - s[2]); };
function timelineSVG() {
  const W = 1000, laneH = 46, top = 22, H = top + REGIONS.length * laneH + 24, X = (y) => 20 + tx(y) * (W - 150);
  const lanes = REGIONS.map((r, i) => `<g><rect x="0" y="${top + i * laneH}" width="${W}" height="${laneH - 6}" fill="${i % 2 ? "#fafaf7" : "#fff"}"/><text x="${W - 6}" y="${top + i * laneH + 24}" text-anchor="end" font-size="12" fill="${r.hue}" font-family="IBM Plex Sans Hebrew" font-weight="600">${esc(r.he)}</text></g>`).join("");
  const ticks = [-1000, -500, 0, 500, 1000, 1500, 1900, 2000].map((t) => `<line x1="${X(t)}" x2="${X(t)}" y1="${top - 4}" y2="${H - 20}" stroke="#ecebe6"/><text x="${X(t)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#84837D" font-family="IBM Plex Mono">${t < 0 ? -t + "-" : t}</text>`).join("");
  const lastX = {}, flip = {};
  METHODS.slice().sort((a, b) => a.from - b.from).forEach((m) => {
    const cx = X((m.from + m.to) / 2);
    flip[m.id] = lastX[m.region] !== undefined && cx - lastX[m.region].x < 110 ? !lastX[m.region].up : false;
    lastX[m.region] = { x: cx, up: flip[m.id] };
  });
  const marks = METHODS.map((m) => {
    const li = REGIONS.findIndex((r) => r.id === m.region), x0 = X(m.from), w = Math.max(10, X(m.to) - x0), y = top + li * laneH + 14, on = m.id === sel;
    return `<g class="tl-m ${on ? "on" : ""} ${dim(m) ? "dim" : ""}" data-m="${m.id}" role="button" tabindex="0" aria-label="${esc(m.he)}">
      <rect x="${x0 - (w === 10 ? 5 : 0)}" y="${y}" width="${w}" height="12" rx="6" fill="${hue(m)}" opacity="${on ? 1 : .6}" ${m.approx ? `stroke-dasharray="3 2" stroke="${hue(m)}" fill-opacity=".45"` : ""}/>
      <text x="${x0 + w / 2}" y="${flip[m.id] ? y - 4 : y + 25}" text-anchor="middle" font-size="${on ? 13 : 11.5}" font-weight="${on ? 700 : 500}" fill="#1A1A18" font-family="IBM Plex Sans Hebrew" style="direction:rtl">${esc(m.he)}</text></g>`;
  }).join("");
  const now = X(2026);
  return `<svg class="tl" viewBox="0 0 ${W} ${H}" role="img" aria-label="ציר זמן של שיטות התזונה" style="direction:ltr">${lanes}${ticks}<line x1="${now}" x2="${now}" y1="${top - 8}" y2="${H - 20}" stroke="#7A1F2B" stroke-dasharray="2 3"/><text x="${now}" y="${top - 10}" text-anchor="middle" font-size="10.5" fill="#7A1F2B" font-family="IBM Plex Sans Hebrew">היום</text>${marks}</svg>`;
}

// דיוקן בשפה אחידה: מדליון חרוט, צללית ראש וכתפיים, ושם מתחת. אותו עיצוב לכל דמות.
export function portrait(m, size = 56) {
  const h = hue(m), id = `pt-${m.id}`;
  return `<svg class="pt" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${esc(m.who.he)}">
    <defs><radialGradient id="${id}" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fbf8f1"/><stop offset="1" style="stop-color:color-mix(in srgb, ${h} 22%, #efe8da)"/></radialGradient>
    <pattern id="${id}-h" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="3" stroke="${h}" stroke-opacity=".18" stroke-width="1"/></pattern></defs>
    <circle cx="32" cy="32" r="30" fill="url(#${id})" stroke="${h}" stroke-width="2"/>
    <g fill="${h}" fill-opacity=".78"><circle cx="32" cy="25" r="10"/><path d="M12 56c2-12 10-17 20-17s18 5 20 17a30 30 0 01-40 0z"/></g>
    <circle cx="32" cy="32" r="30" fill="url(#${id}-h)"/>
  </svg>`;
}

function figuresHTML() {
  const ms = ordered().filter((m) => m.who);
  return `<div class="mt-figs" role="group" aria-label="דמויות">${ms.map((m) => `<button class="mt-fig ${m.id === sel ? "on" : ""} ${dim(m) ? "dim" : ""}" data-m="${m.id}">${portrait(m)}<b>${esc(m.who.he)}</b><span>${esc(m.who.role)} · ${yearLabel(m.from)}</span></button>`).join("")}</div>`;
}

function matrixHTML() {
  const count = (t) => METHODS.filter((m) => has(m, t.id)).length;
  return `<table class="mx"><thead><tr><th></th>${TRAITS.map((t) => `<th><button class="mx-h ${sort === t.id ? "on" : ""}" data-sort="${t.id}" title="מיון לפי ${esc(t.he)}">${icon(TRAIT_ICON[t.id])}<span>${esc(t.he)}</span><span class="mx-n">${count(t)}</span></button></th>`).join("")}</tr></thead>
    <tbody>${ordered().map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""} ${dim(m) ? "dim" : ""}"><th>${esc(m.he)}</th>${TRAITS.map((t) => `<td class="${sort === t.id ? "col-on" : ""}">${has(m, t.id) ? `<i class="dot" style="background:${hue(m)}"></i>` : ""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function tableHTML() {
  const cols = [["unit", "מה ממיינים"], ["principle", "מה זה איזון"], ["time", "זמן ועונה"], ["conflict", "מה לא משלבים"]];
  return `<details class="mt-full"><summary>הטבלה המלאה, במילים</summary><table class="mt"><thead><tr><th>שיטה</th>${cols.map(([, h]) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
    ${ordered().map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""}"><th><b>${esc(m.he)}</b><span class="mt-y">${yearLabel(m.from)}</span></th>${cols.map(([k]) => `<td>${rich(m[k])}</td>`).join("")}</tr>`).join("")}
  </tbody></table></details>`;
}

function mainHTML() {
  return `${sortBar()}${traitInsight()}
    <section class="mt-disc"><div class="sec-h"><h3>מה הטבלה מחביאה</h3><span class="label">גילויים מההצלבה</span></div>
      <ul class="disc-list">${discoveries().map((d) => `<li>${icon(TRAIT_ICON[d.ic] || d.ic)}<span>${rich(d.t)}</span></li>`).join("")}</ul></section>
    <div class="mt-geo">
      <figure class="mt-fig-map"><figcaption>${icon("local")}מקום</figcaption>${mapSVG()}</figure>
      <figure class="mt-fig-tl"><figcaption>${icon("order")}זמן</figcaption>${timelineSVG()}</figure>
    </div>
    <section><div class="sec-h"><h3>דמויות</h3><span class="label">מי ניסח את השיטה</span></div>${figuresHTML()}</section>
    <section class="mt-cmp"><div class="sec-h"><h3>מה כל שיטה שוקלת</h3><span class="label">לחיצה על פרמטר ממיינת</span></div>${matrixHTML()}</section>
    <section class="mt-cmp"><div class="sec-h"><h3>מה דומה ומה שונה</h3><span class="label">התובנות שלי מההשוואה</span></div>
      <ul class="insights">${METHOD_INSIGHTS.map((x) => `<li>${rich(x.t)}</li>`).join("")}</ul></section>
    ${tableHTML()}`;
}

const panel = (cls, ic, word, sub, html) => `<section class="ess ${cls}"><header>${icon(ic, "ess-ic")}<b class="ess-w">${word}</b><span class="ess-s">${sub}</span></header><p>${html}</p></section>`;

function asideHTML() {
  const m = METHODS.find((x) => x.id === sel), r = REGIONS.find((x) => x.id === m.region), f = byId(m.example.food);
  const when = m.from === m.to ? yearLabel(m.from) : `${yearLabel(m.from)} עד ${yearLabel(m.to)}`;
  const traits = TRAITS.filter((t) => has(m, t.id));
  return `<div class="panel-head mt-head"><div class="mt-head-in">${m.who ? portrait(m, 64) : `<span class="mt-noportrait" style="color:${r.hue}">${icon(m.ll ? "culture" : "globe")}</span>`}
      <div><span class="label" style="color:${r.hue}">${esc(r.he)}</span><h2 class="sheet-name" id="mt-title" style="font-size:28px;font-weight:700">${esc(m.he)}</h2>
      ${m.who ? `<p class="mt-who">${esc(m.who.he)} <span class="latin">${esc(m.who.la)}</span></p>` : ""}</div></div>
      <div class="mt-when"><span>${icon("local")}<b>${esc(m.place)}</b> <span class="latin">${esc(m.place_la)}</span></span><span>${icon("order")}<b>${when}</b>${m.approx ? " (בערך)" : ""}</span></div></div>
    <div class="panel-body scroll-in" style="flex:1">
      ${m.layer === "believed" ? `<p class="believed-badge"><i class="layer-mark lm-believed"></i>${rich("שכבת **מאמינים**: חלק מהמידע נמסר בתקשור, ולא נבדק במחקר.")}</p>` : ""}
      <p class="unique" style="margin-top:0">${rich(m.principle)}</p>
      <div class="mt-rules" aria-label="הכללים בשיטה">${traits.map((t) => `<span class="mt-rule">${icon(TRAIT_ICON[t.id])}${esc(t.he)}</span>`).join("")}</div>
      <div class="essence pl-ess">
        ${panel("ess-body", "taste", "ממיינים", "יחידת המיון", rich(m.unit))}
        ${panel("ess-soul", "season", "זמן", "עונה ושעה", rich(m.time))}
        ${panel("ess-no", "nocombine", "לא משלבים", "התנגשות", rich(m.conflict))}
      </div>
      ${m.context ? `<div class="ctx ctx-ic"><div>${icon("culture")}<span><span class="tile-l">תרבות</span>${rich(m.context.culture)}</span></div><div>${icon("local")}<span><span class="tile-l">מקום</span>${rich(m.context.geo)}</span></div><div>${icon("climate")}<span><span class="tile-l">אקלים</span>${rich(m.context.climate)}</span></div></div>` : ""}
      ${f ? `<a class="mt-ex press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><span><span class="tile-l">דוגמה מהגלריה</span><b>${esc(f.he)}</b><br>${rich(m.example.t)}</span></a>` : ""}
      ${sourcesBox([m.src])}
    </div>`;
}

function render() {
  root.querySelector("#mt-main").innerHTML = mainHTML();
  root.querySelector("#mt-aside").innerHTML = asideHTML();
}
function select(id) { sel = id; patch({ m: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = METHODS.some((m) => m.id === params.m) ? params.m : "rambam";
  sort = params.s && (params.s === "place" || TRAITS.some((t) => t.id === params.s)) ? params.s : "time";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="mt-h">
      <div class="gallery-tools"><div><h1 class="view-title" id="mt-h">שיטות מכל העולם, בכל הזמנים</h1>
        <p class="view-sub">${rich(`**${METHODS.length} שיטות**, **3000 שנה**, **${new Set(METHODS.map((m) => m.place)).size} מקומות**. ==כמעט כולן מחפשות איזון, ונבדלות במה שהן מודדות.==`)}</p></div>
        <span class="legend" style="font-size:12px">${REGIONS.map((r) => `<span><i class="layer-mark" style="border-color:${r.hue};border-top-width:6px"></i>${esc(r.he)}</span>`).join("")}</span></div>
      <div class="scroll-in mt-main" id="mt-main"></div>
    </section>
    <aside class="panel" id="mt-aside" aria-labelledby="mt-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => {
    const s = e.target.closest("[data-sort]");
    if (s) { sort = s.dataset.sort; patch({ s: sort === "time" ? undefined : sort }); return render(); }
    const t = e.target.closest("[data-m]");
    if (t) select(t.dataset.m);
  });
  root.addEventListener("keydown", (e) => { const t = e.target.closest(".tl-m, .mp"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.m); } });
}
export function update(params) { if (params.m && params.m !== sel) select(params.m); }
