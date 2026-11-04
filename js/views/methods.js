// שיטות: זמן ומקום הם ציר ומפה. מעליהם: גילויים מזוקקים מהטבלה, וכפתורי פרמטרים שממיינים ומדגישים.
// הדמויות בדיוקן אחיד, ולכל כלל אייקון שעוזר לזכור אותו (חם וקר, עונה, סדר, לשלב ולא לשלב).
import { METHODS, REGIONS, TRAITS, MATRIX, METHOD_INSIGHTS } from "../data/methods.js";
import { byId } from "../data/foods.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { icon, iconG } from "../plantviz.js";
import { setGeo, geoShell, attachGeo, focusGeo } from "../geoview.js";
import { IDEAS, CLIMATES } from "../data/method-ideas.js";
import { FOODS } from "../data/foods.js";
import { dock } from "../frame.js";

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
  if (sort === "lat") return list.sort((a, b) => (b.ll ? b.ll[1] : -99) - (a.ll ? a.ll[1] : -99));
  if (sort === "climate") { const order = Object.keys(CLIMATES); return list.sort((a, b) => order.indexOf(IDEAS[a.id].climate) - order.indexOf(IDEAS[b.id].climate) || a.from - b.from); }
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

// תובנה לפרמטר שנבחר: כמה, איפה, ומתי. ובמקום: קו רוחב ואקלים כפרמטרים.
function placeInsight() {
  const ms = METHODS.filter((m) => m.ll);
  if (sort === "lat") {
    const n = ms.reduce((a, b) => (b.ll[1] > a.ll[1] ? b : a)), so = ms.reduce((a, b) => (b.ll[1] < a.ll[1] ? b : a));
    return `<p class="mt-trait">${icon("local")}<span>${rich(`מ**${n.place}**, קו רוחב **${Math.round(n.ll[1])}°**, ועד **${so.place}**, **${Math.round(so.ll[1])}°**. ==הצפוניות מודדות מקומי ועונה קצרה, הדרומיות מודדות חום וקור.==`)}</span></p>`;
  }
  if (sort === "climate") {
    const temp = [...new Set(METHODS.filter((m) => has(m, "temp")).map((m) => CLIMATES[IDEAS[m.id].climate].he))];
    return `<p class="mt-trait">${icon("climate")}<span>${rich(`**${Object.keys(CLIMATES).length - 1} אקלימים.** **חם וקר** נולד ב${temp.join(", ")}. ==האקלים כתב את הכללים.==`)}</span></p>`;
  }
  return "";
}
function traitInsight() {
  const t = TRAITS.find((x) => x.id === sort);
  if (!t) return placeInsight();
  const A = METHODS.filter((m) => has(m, t.id)).sort((a, b) => a.from - b.from);
  const regs = [...new Set(A.map((m) => REGIONS.find((r) => r.id === m.region).he))];
  const mod = A.filter(modern).length;
  return `<p class="mt-trait">${icon(TRAIT_ICON[t.id])}<span>${rich(`**${t.he}**: **${A.length}** מתוך **${METHODS.length}** שיטות, מ**${A[0].he}** ועד **${A[A.length - 1].he}**. ${regs.join(", ")}. ${mod ? `==${mod === 1 ? "שיטה מודרנית אחת" : "חלקן מודרניות"}.==` : "==אף שיטה מודרנית.=="}`)}</span></p>`;
}

function sortBar() {
  const btn = (id, ic, he) => `<button class="mt-sort" data-sort="${id}" aria-pressed="${sort === id}">${icon(ic)}<span>${esc(he)}</span></button>`;
  return `<div class="mt-sorts" role="group" aria-label="מיון לפי פרמטר">
    <span class="mt-sorts-l">מיון</span>
    ${btn("time", "order", "זמן")}${btn("lat", "local", "קו רוחב")}${btn("climate", "climate", "אקלים")}
    <span class="mt-sep" aria-hidden="true"></span>
    ${TRAITS.map((t) => btn(t.id, TRAIT_ICON[t.id], t.he)).join("")}
    <button class="mt-all" data-sort="time" ${sort === "time" ? 'aria-current="true"' : ""}>הכול, לפי זמן</button>
  </div>`;
}

// מפה: יבשה אמיתית (Natural Earth), נקודה לכל שיטה, וטבעת שפועמת סביב הנבחרת.
const LABEL = { bible: [8, -10, "start"], rogel: [-10, -9, "end"], rambam: [-10, 17, "end"], hippocrates: [8, 14, "start"], med: [-8, -8, "end"], galen: [-8, 14, "end"], hildegard: [-8, -6, "end"], nordic: [8, -4, "start"], ayurveda: [8, 4, "start"], tcm: [8, 4, "start"], washoku: [-8, -10, "end"] };
// נקודות למפה ולגלובוס: צבע לפי אזור, או לפי אקלים כשממיינים לפי אקלים.
function geoPoints() {
  return METHODS.filter((m) => m.ll).map((m) => { const [dx, dy, anchor] = LABEL[m.id] || [8, 4, "start"]; return { id: m.id, ll: m.ll, label: esc(m.he), on: m.id === sel, dim: dim(m), hue: sort === "climate" ? CLIMATES[IDEAS[m.id].climate].hue : hue(m), dx, dy, anchor }; });
}
const climateLegend = () => sort === "climate" ? `<div class="legend geo-legend">${Object.entries(CLIMATES).filter(([k]) => k !== "global").map(([, c]) => `<span><i class="dot" style="background:${c.hue}"></i>${esc(c.he)}</span>`).join("")}</div>` : "";

// ציר זמן: סקאלה מקוטעת (העבר הרחוק דחוס), נתיב לכל אזור.
const SEG = [[-1100, -200, 0, 0.22], [-200, 1000, 0.22, 0.44], [1000, 1900, 0.44, 0.68], [1900, 2030, 0.68, 1]];
const tx = (year) => { const s = SEG.find(([a, b]) => year >= a && year <= b) || SEG[SEG.length - 1]; return s[2] + ((year - s[0]) / (s[1] - s[0])) * (s[3] - s[2]); };
function timelineSVG() {
  const W = 1000, top = 56, X = (y) => 24 + tx(y) * (W - 160);
  // תוויות בלי חפיפה: לכל נתיב ארבעה מקומות (מתחת, מעל, מתחת 2, מעל 2). הנתיב גדל לפי הצורך.
  const SLOT = [[24, 37], [52, 65], [80, 93]], slot = {}, used = {};
  METHODS.slice().sort((a, b) => a.from - b.from).forEach((m) => {
    const x0 = X(m.from), w = Math.max(10, X(m.to) - x0), cx = x0 + w / 2, half = Math.max(m.he.length * 3.8, 30) + 6;
    const L = (used[m.region] ||= [[], [], []]);
    let k = L.findIndex((iv) => iv.every(([a, b]) => cx + half < a || cx - half > b));
    if (k < 0) k = 0;
    L[k].push([cx - half, cx + half]); slot[m.id] = k;
  });
  const extra = (r) => { const L = used[r.id] || []; return (L[1]?.length ? 28 : 0) + (L[2]?.length ? 28 : 0); };
  const laneTop = []; let acc = top;
  REGIONS.forEach((r) => { laneTop.push(acc); acc += 64 + extra(r); });
  const H = acc + 40;
  const yr = (y, x, yy, big, on) => `<text x="${x}" y="${yy}" text-anchor="middle" class="tl-y ${big ? "big" : ""} ${on ? "on" : ""}">${Math.abs(y)}${y < 0 ? `<tspan class="tl-bce" dx="2">לפנה"ס</tspan>` : ""}</text>`;
  const era = `<rect x="${X(-1100)}" y="8" width="${X(0) - X(-1100)}" height="18" fill="#efe9dc"/><rect x="${X(0)}" y="8" width="${X(2030) - X(0)}" height="18" fill="#e6edf3"/>
    <text x="${(X(-1100) + X(0)) / 2}" y="21" text-anchor="middle" class="tl-era">לפני הספירה</text><text x="${(X(0) + X(2030)) / 2}" y="21" text-anchor="middle" class="tl-era">לספירה</text>`;
  const lanes = REGIONS.map((r, i) => { const y0 = laneTop[i], h = 56 + extra(r); return `<g><rect x="0" y="${y0}" width="${W}" height="${h}" fill="${i % 2 ? "#fafaf7" : "#fff"}"/><text x="${W - 8}" y="${laneTop[i] + 32}" text-anchor="end" class="tl-lane" fill="${r.hue}">${esc(r.he)}</text></g>`; }).join("");
  const ticks = [-1000, -500, 0, 500, 1000, 1500, 1900, 2000].map((t) => `<line x1="${X(t)}" x2="${X(t)}" y1="${top - 6}" y2="${H - 30}" stroke="${t === 0 ? "#bdb8ab" : "#ecebe6"}" stroke-width="${t === 0 ? 1.2 : 1}"/>${yr(t, X(t), H - 10, true, false)}`).join("");
  const marks = METHODS.map((m) => {
    const li = REGIONS.findIndex((r) => r.id === m.region), x0 = X(m.from), w = Math.max(10, X(m.to) - x0), y = laneTop[li] + 24, on = m.id === sel, cx = x0 + w / 2, [ny, yy] = SLOT[slot[m.id]];
    return `<g class="tl-m ${on ? "on" : ""} ${dim(m) ? "dim" : ""}" data-m="${m.id}" role="button" tabindex="0" aria-label="${esc(m.he)}, ${yearLabel(m.from)}">
      <rect x="${x0 - (w === 10 ? 5 : 0)}" y="${y}" width="${w}" height="10" rx="5" fill="${hue(m)}" opacity="${on ? 1 : .6}" ${m.approx ? `stroke-dasharray="3 2" stroke="${hue(m)}" fill-opacity=".45"` : ""}/>
      <text x="${cx}" y="${y + ny}" text-anchor="middle" class="tl-n ${on ? "on" : ""}" style="direction:rtl">${esc(m.he)}</text>
      ${yr(m.from, cx, y + yy, false, on)}</g>`;
  }).join("");
  const now = X(2026);
  return `<svg class="tl" viewBox="0 0 ${W} ${H}" role="img" aria-label="ציר זמן של שיטות התזונה" style="direction:ltr">${era}${lanes}${ticks}<line x1="${now}" x2="${now}" y1="${top - 6}" y2="${H - 30}" stroke="#7A1F2B" stroke-dasharray="2 3"/><text x="${now - 4}" y="${top - 10}" text-anchor="end" class="tl-now">היום</text>${marks}</svg>`;
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
    <tbody>${ordered().map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""} ${dim(m) ? "dim" : ""} ${TRAITS.some((t) => t.id === sort) && has(m, sort) ? "hit" : ""}"><th>${esc(m.he)}</th>${TRAITS.map((t) => `<td class="${sort === t.id ? "col-on" : ""}">${has(m, t.id) ? `<i class="dot" style="background:${hue(m)}"></i>` : ""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function tableHTML() {
  const cols = [["unit", "מה ממיינים"], ["principle", "מה זה איזון"], ["time", "זמן ועונה"], ["conflict", "מה לא משלבים"]];
  return `<details class="mt-full"><summary>הטבלה המלאה, במילים</summary><table class="mt"><thead><tr><th>שיטה</th>${cols.map(([, h]) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
    ${ordered().map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""}"><th><b>${esc(m.he)}</b><span class="mt-y">${yearLabel(m.from)}</span></th>${cols.map(([k]) => `<td>${rich(m[k])}</td>`).join("")}</tr>`).join("")}
  </tbody></table></details>`;
}

function topHTML() { return `${sortBar()}${traitInsight()}`; }
// הדף מפוצל ללשוניות: מקום וזמן, גילויים, מה כל שיטה שוקלת, ודמויות. מידע מאותו סוג ברשימה אחת.
let tab = "geo";
const TABS = [["geo", "מקום וזמן", "local"], ["disc", "גילויים", "mind"], ["cmp", "מה כל שיטה שוקלת", "nutrient"], ["who", "דמויות", "body"]];
const tabsHTML = () => `<div class="mt-tabs" role="tablist">${TABS.map(([k, he, ic]) => `<button class="mt-tab" role="tab" data-tab="${k}" aria-selected="${tab === k}">${icon(ic)}${he}</button>`).join("")}</div>`;
function restHTML() {
  if (tab === "disc") return `<section class="mt-disc"><div class="sec-h"><h3>מה הטבלה מחביאה, ומה דומה ומה שונה</h3><span class="label">גילויים מההצלבה</span></div>
      <ul class="disc-list one">${discoveries().map((d) => `<li>${icon(TRAIT_ICON[d.ic] || d.ic)}<span>${rich(d.t)}</span></li>`).join("")}${METHOD_INSIGHTS.map((x) => `<li>${icon("combine")}<span>${rich(x.t)}</span></li>`).join("")}</ul></section>`;
  if (tab === "cmp") return `<section class="mt-cmp"><div class="sec-h"><h3>מה כל שיטה שוקלת</h3><span class="label">לחיצה על פרמטר ממיינת ומדגישה את השורות</span></div>${matrixHTML()}</section>${tableHTML()}`;
  if (tab === "who") return `<section><div class="sec-h"><h3>דמויות</h3><span class="label">מי ניסח את השיטה</span></div>${figuresHTML()}</section>`;
  return "";
}

// תרשים של הרעיון: ארבע הליחות, שלוש הדושות, חמש התמורות, וסדר הארוחה של הרמב"ם.
function conceptSVG(id) {
  const T = (x, y, t, cls = "cs-t", a = "middle") => `<text x="${x}" y="${y}" text-anchor="${a}" class="${cls}">${t}</text>`;
  if (id === "galen") return `<svg viewBox="0 0 240 170" class="cs" role="img" aria-label="ארבע הליחות"><g stroke="#2a2a26" stroke-width=".8">
    <rect x="40" y="20" width="80" height="60" fill="#f6d9cf"/><rect x="120" y="20" width="80" height="60" fill="#f6ebc8"/><rect x="40" y="80" width="80" height="60" fill="#dfe6ef"/><rect x="120" y="80" width="80" height="60" fill="#e4e1da"/></g>
    ${T(80, 48, "דם")}${T(80, 64, "חם · לח", "cs-s")}${T(160, 48, "מרה צהובה")}${T(160, 64, "חם · יבש", "cs-s")}${T(80, 108, "ליחה")}${T(80, 124, "קר · לח", "cs-s")}${T(160, 108, "מרה שחורה")}${T(160, 124, "קר · יבש", "cs-s")}
    ${T(120, 14, "חם", "cs-a")}${T(120, 158, "קר", "cs-a")}${T(30, 84, "לח", "cs-a", "end")}${T(210, 84, "יבש", "cs-a", "start")}</svg>`;
  if (id === "ayurveda") { const c = [[120, 52, "ואטה", "אוויר וחלל", "#dfe6ef"], [84, 112, "קאפה", "מים ואדמה", "#e3ecd6"], [156, 112, "פיטה", "אש ומים", "#f6d9cf"]];
    return `<svg viewBox="0 0 240 170" class="cs" role="img" aria-label="שלוש הדושות">${c.map(([x, y, , , f]) => `<circle cx="${x}" cy="${y}" r="44" fill="${f}" fill-opacity=".85" stroke="#2a2a26" stroke-width=".8"/>`).join("")}${c.map(([x, y, n, s2]) => `${T(x + (x - 120) * .35, y + (y - 92) * .35 - 2, n)}${T(x + (x - 120) * .35, y + (y - 92) * .35 + 12, s2, "cs-s")}`).join("")}${T(120, 96, "איזון", "cs-a")}</svg>`; }
  if (id === "tcm") { const ph = [["עץ", "כבד · חמוץ", "#cfe0b0"], ["אש", "לב · מר", "#f2c2b0"], ["אדמה", "טחול · מתוק", "#ecd9a8"], ["מתכת", "ריאות · חריף", "#e1e1e1"], ["מים", "כליות · מלוח", "#c9d8ea"]];
    const P = ph.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [120 + 62 * Math.cos(a), 88 + 62 * Math.sin(a)]; });
    return `<svg viewBox="0 0 240 170" class="cs" role="img" aria-label="חמש התמורות"><path d="${P.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("")}Z" fill="none" stroke="#2a2a26" stroke-width=".6" stroke-dasharray="3 2"/>
      ${ph.map(([n, s2, f], i) => `<circle cx="${P[i][0].toFixed(1)}" cy="${P[i][1].toFixed(1)}" r="20" fill="${f}" stroke="#2a2a26" stroke-width=".8"/>${T(P[i][0], P[i][1] + 4, n)}${T(P[i][0], P[i][1] + 30, s2, "cs-s")}`).join("")}</svg>`; }
  if (id === "rambam") { const before = FOODS.filter((f) => f.meal === "before").map((f) => f.he), after = FOODS.filter((f) => f.meal === "after").map((f) => f.he);
    return `<svg viewBox="0 0 240 170" class="cs" role="img" aria-label="סדר הארוחה של הרמב&quot;ם"><g stroke="#2a2a26" stroke-width=".8"><rect x="160" y="40" width="70" height="56" fill="#e3ecd6"/><rect x="85" y="40" width="70" height="56" fill="#f4efe4"/><rect x="10" y="40" width="70" height="56" fill="#f6dfd6"/></g>
      ${T(195, 32, "קודם", "cs-a")}${T(120, 32, "הארוחה", "cs-a")}${T(45, 32, "אחרי", "cs-a")}
      ${before.slice(0, 4).map((n, i) => T(195, 56 + i * 12, n, "cs-s")).join("")}${T(120, 72, "המזון העיקרי", "cs-s")}${after.slice(0, 4).map((n, i) => T(45, 56 + i * 12, n, "cs-s")).join("")}
      <path d="M158 68l-4 -3v6zM83 68l-4 -3v6z" fill="#2a2a26"/>
      ${T(120, 124, "קיץ: מאכלים קרים · חורף: חמים ותבלינים", "cs-s")}${T(120, 142, "הלכות דעות ד", "cs-s")}</svg>`; }
  return "";
}


const panel = (cls, ic, word, sub, html) => `<section class="ess ${cls}"><header>${icon(ic, "ess-ic")}<b class="ess-w">${word}</b><span class="ess-s">${sub}</span></header><p>${html}</p></section>`;

function asideHTML() {
  const m = METHODS.find((x) => x.id === sel), r = REGIONS.find((x) => x.id === m.region), f = byId(m.example.food);
  const when = m.from === m.to ? yearLabel(m.from) : `${yearLabel(m.from)} עד ${yearLabel(m.to)}`;
  const traits = TRAITS.filter((t) => has(m, t.id));
  return `<div class="panel-head mt-head"><div class="mt-head-in">${m.who ? portrait(m, 64) : `<span class="mt-noportrait" style="color:${r.hue}">${icon(m.ll ? "culture" : "globe")}</span>`}
      <div><span class="label" style="color:${r.hue}">${esc(r.he)}</span><h2 class="sheet-name" id="mt-title" style="font-size:28px;font-weight:700">${esc(m.he)}</h2>
      ${m.who ? `<p class="mt-who">${esc(m.who.he)}</p>` : ""}</div></div>
      <div class="mt-when"><span>${icon("local")}<b>${esc(m.place)}</b></span><span>${icon("order")}<b>${when}</b>${m.approx ? " (בערך)" : ""}</span><span>${icon("climate")}<b>${esc(CLIMATES[IDEAS[m.id].climate].he)}</b>${m.ll ? ` · ${Math.round(m.ll[1])}°` : ""}</span></div></div>
    <div class="panel-body scroll-in" style="flex:1">
      ${m.layer === "believed" ? `<p class="believed-badge"><i class="layer-mark lm-believed"></i>${rich("שכבת **מאמינים**: חלק מהמידע נמסר בתקשור, ולא נבדק במחקר.")}</p>` : ""}
      <p class="unique" style="margin-top:0">${rich(m.principle)}</p>
      <section class="ess ess-idea"><header>${icon("mind", "ess-ic")}<b class="ess-w">הרעיון</b><span class="ess-s">מה השיטה רואה</span></header><p>${rich(IDEAS[m.id].idea)}</p>${conceptSVG(m.id)}</section>
      <dl class="mt-ideas">
        <div>${icon("origin")}<dt>למה</dt><dd>${rich(IDEAS[m.id].why)}</dd></div>
        <div>${icon("taste")}<dt>איך בוחרים</dt><dd>${rich(IDEAS[m.id].choose)}</dd></div>
        <div>${icon("order")}<dt>מתי</dt><dd>${rich(IDEAS[m.id].when)}</dd></div>
      </dl>
      <div class="mt-rules" aria-label="הכללים בשיטה">${traits.map((t) => `<span class="mt-rule">${icon(TRAIT_ICON[t.id])}${esc(t.he)}</span>`).join("")}</div>
      <div class="essence pl-ess">
        ${panel("ess-soul", "season", "זמן", "עונה ושעה", rich(m.time))}
        ${panel("ess-no", "nocombine", "לא משלבים", "התנגשות", rich(m.conflict))}
      </div>
      ${m.context ? `<div class="ctx ctx-ic"><div>${icon("culture")}<span><span class="tile-l">תרבות</span>${rich(m.context.culture)}</span></div><div>${icon("local")}<span><span class="tile-l">מקום</span>${rich(m.context.geo)}</span></div><div>${icon("climate")}<span><span class="tile-l">אקלים</span>${rich(m.context.climate)}</span></div></div>` : ""}
      ${f ? `<a class="mt-ex press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><span><span class="tile-l">דוגמה מהגלריה</span><b>${esc(f.he)}</b><br>${rich(m.example.t)}</span></a>` : ""}
      ${sourcesBox([m.src])}
    </div>`;
}

function render() {
  root.querySelector("#mt-top").innerHTML = topHTML() + tabsHTML();
  root.querySelector(".mt-geo").hidden = tab !== "geo";
  root.querySelector("#mt-tl").innerHTML = timelineSVG();
  root.querySelector("#mt-rest").innerHTML = restHTML();
  root.querySelector("#mt-geo-legend").innerHTML = climateLegend();
  setGeo(geoPoints());
  focusGeo(METHODS.find((x) => x.id === sel)?.ll);
  const aside = root.querySelector("#mt-aside"), m = METHODS.find((x) => x.id === sel);
  aside.innerHTML = asideHTML();
  dock(aside, { body: { t: m.unit, sub: "מה השיטה מודדת" }, soul: m.context ? { t: m.context.culture, sub: "תרבות" } : null });
}
function select(id) { sel = id; patch({ m: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = METHODS.some((m) => m.id === params.m) ? params.m : "rambam";
  tab = TABS.some(([k]) => k === params.t) ? params.t : "geo";
  sort = params.s && (["lat", "climate"].includes(params.s) || TRAITS.some((t) => t.id === params.s)) ? params.s : "time";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="mt-h">
      <div class="gallery-tools"><div><h1 class="view-title" id="mt-h">שיטות מכל העולם, בכל הזמנים</h1>
        <p class="view-sub">${rich(`**${METHODS.length} שיטות**, **3000 שנה**, **${new Set(METHODS.map((m) => m.place)).size} מקומות**. ==כמעט כולן מחפשות איזון, ונבדלות במה שהן מודדות.==`)}</p></div>
        <span class="legend" style="font-size:12px">${REGIONS.map((r) => `<span><i class="layer-mark" style="border-color:${r.hue};border-top-width:6px"></i>${esc(r.he)}</span>`).join("")}</span></div>
      <div class="scroll-in mt-main" id="mt-main"><div id="mt-top" class="mt-stack"></div>
        <div class="mt-geo">
          <figure class="mt-fig-map"><figcaption>${icon("local")}מקום</figcaption><div id="mt-geo">${geoShell()}</div><div id="mt-geo-legend"></div></figure>
          <figure class="mt-fig-tl"><figcaption>${icon("order")}זמן</figcaption><div id="mt-tl"></div></figure>
        </div>
        <div id="mt-rest" class="mt-stack"></div></div>
    </section>
    <aside class="panel" id="mt-aside" aria-labelledby="mt-title"></aside>
  </div>`;
  attachGeo(root.querySelector("#mt-geo"), select);
  render();
  root.addEventListener("click", (e) => {
    const tb = e.target.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; patch({ t: tab === "geo" ? undefined : tab }); return render(); }
    const s = e.target.closest("[data-sort]");
    if (s) { sort = s.dataset.sort; patch({ s: sort === "time" ? undefined : sort }); return render(); }
    const t = e.target.closest("[data-m]");
    if (t) select(t.dataset.m);
  });
  root.addEventListener("keydown", (e) => { const t = e.target.closest(".tl-m, .mp"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.m); } });
}
export function update(params) { if (params.m && params.m !== sel) select(params.m); }
