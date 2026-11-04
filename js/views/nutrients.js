// אבות מזון וויטמינים: מה יש באיזה מזון, באיזה חלק של הצמח, ובאיזה חודש.
// קודם הגילויים מההצלבה (חלק בצמח × רכיב, עונה × רכיב), ואחר כך הכלי. בלי כמויות, בלי מינונים ובלי קלוריות.
import { NUTRIENTS, KIND_HE } from "../data/nutrients.js";
import { FOODS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { PARTS } from "../data/plant.js";
import { rich, esc, sourcesBox, MONTHS, MONTHS_SHORT, nowMonth } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { icon, ORGAN_ICON } from "../plantviz.js";
import { MONTH_HUE } from "./seasons.js";

export const title = "רכיבים";
let root, sel;

// מי מקור למה: לפי "גוף" בפרופיל, שכולו הרכב עם מקור.
const SOURCES_OF = Object.fromEntries(NUTRIENTS.map((n) => [n.id, FOODS.filter((f) => n.re.test(PROFILES[f.id]?.body?.t || ""))]));
const partOf = (f) => PARTS.find((p) => p.foods.includes(f.id));
const badge = (n, size = "") => n.sym
  ? `<span class="nb nb-${n.kind} ${size}"><b>${esc(n.sym)}</b></span>`
  : `<span class="nb nb-${n.kind} ${size}">${icon(n.ic)}</span>`;

// גילויים: איזה חלק בצמח מוביל כל רכיב, מה הכי נפוץ, ומתי בשנה.
function discoveries() {
  const out = [];
  const lead = NUTRIENTS.map((n) => {
    const fs = SOURCES_OF[n.id];
    const by = PARTS.map((p) => [p, fs.filter((f) => partOf(f) === p).length]).sort((a, b) => b[1] - a[1])[0];
    return { n, p: by[0], k: by[1], all: fs.length };
  }).filter((x) => x.all >= 3);
  const pure = lead.filter((x) => x.k === x.all);
  for (const x of pure.slice(0, 2)) out.push({ n: x.n, t: `==כל ${x.all} המקורות ל**${x.n.he}** בגלריה הם **${x.p.he}**.==` });
  const top = [...lead].sort((a, b) => b.all - a.all)[0];
  out.push({ n: top.n, t: `**${top.n.he}** הוא הרכיב הנפוץ ביותר: **${top.all}** מתוך **${FOODS.length}** מזונות. ==${top.n.id === "fiber" ? "סיבים יש רק בצומח." : ""}==` });
  // עונה: החודש שבו הכי הרבה מקורות לוויטמין C בשדה
  const c = SOURCES_OF.vC.filter((f) => f.months.length && f.months.length < 11);
  const peak = MONTHS.map((_, i) => [i + 1, c.filter((f) => f.months.includes(i + 1)).length]).sort((a, b) => b[1] - a[1])[0];
  const low = MONTHS.map((_, i) => [i + 1, c.filter((f) => f.months.includes(i + 1)).length]).sort((a, b) => a[1] - b[1])[0];
  out.push({ n: NUTRIENTS.find((n) => n.id === "vC"), t: `**ויטמין C** בשיא ב**${MONTHS[peak[0] - 1]}**: **${peak[1]}** מקורות בשדה, ו**${low[1]}** בלבד ב${MONTHS[low[0] - 1]}. ==החורף הוא עונת ההדרים.==` });
  // ניגוד: ברזל מהצומח צריך ויטמין C, ושניהם מגיעים מחלקים שונים
  const fe = SOURCES_OF.iron.map((f) => f.he).join(" ו"), cc = SOURCES_OF.vC.length;
  out.push({ n: NUTRIENTS.find((n) => n.id === "iron"), t: `**ברזל** בגלריה רק ב${fe}, ו**ויטמין C** ב-**${cc}** מזונות. ==הצירוף הוא המפתח: קטנייה או עלה, עם פרי חמוץ.==` });
  return out;
}

// מפת חום: רכיב × חלק בצמח. רואים בעין שחלבון בזרע וויטמין K בעלה.
function heatHTML() {
  const max = Math.max(...NUTRIENTS.flatMap((n) => PARTS.map((p) => SOURCES_OF[n.id].filter((f) => partOf(f) === p).length)));
  return `<table class="nh" aria-label="רכיב לפי חלק בצמח"><thead><tr><th></th>${PARTS.map((p) => `<th><span style="color:${p.hue}">${icon(p.id)}</span><span>${esc(p.he)}</span></th>`).join("")}<th>סה"כ</th></tr></thead>
    <tbody>${NUTRIENTS.map((n) => `<tr class="${n.id === sel ? "on" : ""}" data-n="${n.id}"><th>${badge(n, "sm")}<span>${esc(n.he)}</span></th>${PARTS.map((p) => { const k = SOURCES_OF[n.id].filter((f) => partOf(f) === p).length; return `<td style="--a:${k / max};--h:${p.hue}">${k ? `<span>${k}</span>` : ""}</td>`; }).join("")}<td class="nh-t">${SOURCES_OF[n.id].length}</td></tr>`).join("")}</tbody></table>`;
}

// בועות: כל רכיב בגודל מספר המקורות שלו, בשלוש קבוצות.
function bubblesHTML() {
  return `<div class="nbub">${Object.entries(KIND_HE).map(([k, he]) => `<div class="nbub-g"><span class="label">${esc(he)}</span><div class="nbub-row">${NUTRIENTS.filter((n) => n.kind === k).map((n) => {
    const c = SOURCES_OF[n.id].length, d = 34 + Math.sqrt(c) * 13;
    return `<button class="nbub-b nb-${n.kind} ${n.id === sel ? "on" : ""}" data-n="${n.id}" style="--d:${d.toFixed(0)}px" aria-pressed="${n.id === sel}" aria-label="${esc(n.he)}: ${c} מזונות">${n.sym ? `<b>${esc(n.sym)}</b>` : icon(n.ic)}<span>${esc(n.he)}</span><i>${c}</i></button>`;
  }).join("")}</div></div>`).join("")}</div>`;
}

function seasonBar(n) {
  const fs = SOURCES_OF[n.id], now = nowMonth();
  const cnt = MONTHS.map((_, i) => fs.filter((f) => !f.months.length || f.months.includes(i + 1)).length), max = Math.max(1, ...cnt);
  return `<div class="nseason" aria-label="מקורות בעונה, לפי חודש">${cnt.map((c, i) => `<span class="${i + 1 === now ? "now" : ""}" style="--mh:${MONTH_HUE[i]}" title="${MONTHS[i]}: ${c}"><i style="height:${Math.round((c / max) * 100)}%"></i><b class="num">${c}</b><em>${MONTHS_SHORT[i]}</em></span>`).join("")}</div>`;
}

function asideHTML() {
  const n = NUTRIENTS.find((x) => x.id === sel), fs = SOURCES_OF[n.id];
  const parts = PARTS.map((p) => [p, fs.filter((f) => partOf(f) === p).length]).filter(([, k]) => k).sort((a, b) => b[1] - a[1]);
  return `<div class="panel-body scroll-in" style="flex:1">
    <h2 class="sheet-name pl-name" id="n-title">${badge(n, "lg")}${esc(n.he)}<span class="label">${esc(KIND_HE[n.kind])}</span></h2>
    <div class="essence pl-ess">
      <section class="ess ess-body"><header>${icon("body", "ess-ic")}<b class="ess-w">בגוף</b><span class="ess-s">מה הוא עושה</span></header><p>${rich(n.role.t)}</p></section>
      <section class="ess ess-plant" style="--c:${parts[0]?.[0].hue || "#5a7a3a"}"><header>${icon(parts[0]?.[0].id || "plant", "ess-ic")}<b class="ess-w">בצמח</b><span class="ess-s">איפה הוא</span></header>
        <p>${parts.length ? parts.map(([p, k]) => `<b>${esc(p.he)}</b> <bdi class="num">${k}</bdi>`).join(" · ") : "אין מקור בגלריה."}</p></section>
    </div>
    <div class="sec"><div class="sec-h"><h3>מתי בשנה</h3><span class="label">כמה מקורות בשדה בכל חודש</span></div>${seasonBar(n)}</div>
    <div class="sec"><div class="sec-h"><h3>מקורות בגלריה</h3><span class="label"><bdi class="num">${fs.length}</bdi></span></div>
      ${fs.length ? `<div class="pl-foods">${fs.map((f) => `<a class="pl-food press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>`).join("")}</div>` : `<p class="hint">אין בגלריה.</p>`}</div>
    ${sourcesBox([n.role.src, "usda-fdc"])}
  </div>`;
}

function render() {
  root.querySelector("#n-main").innerHTML = `
    <section class="mt-disc"><div class="sec-h"><h3>מה הטבלה מחביאה</h3><span class="label">גילויים מההצלבה</span></div>
      <ul class="disc-list">${discoveries().map((d) => `<li>${badge(d.n, "sm")}<span>${rich(d.t)}</span></li>`).join("")}</ul></section>
    <section><div class="sec-h"><h3>כמה מזונות לכל רכיב</h3><span class="label">גודל העיגול: מספר המקורות</span></div>${bubblesHTML()}</section>
    <section><div class="sec-h"><h3>באיזה חלק של הצמח</h3><span class="label">כהה יותר: יותר מקורות</span></div>${heatHTML()}</section>`;
  root.querySelector("#n-aside").innerHTML = asideHTML();
}
function select(id) { sel = id; patch({ n: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = NUTRIENTS.some((n) => n.id === params.n) ? params.n : "protein";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="n-h">
      <div class="gallery-tools"><div><h1 class="view-title" id="n-h">אבות מזון וויטמינים</h1>
        <p class="view-sub">${rich(`**${NUTRIENTS.length} רכיבים**, **${FOODS.length} מזונות**. ==כל חלק בצמח אוגר משהו אחר: הזרע חלבון, העלה ויטמין K.==`)}</p></div></div>
      <div class="scroll-in mt-main" id="n-main"></div>
    </section>
    <aside class="panel sheet" id="n-aside" aria-labelledby="n-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => { const t = e.target.closest("[data-n]"); if (t) select(t.dataset.n); });
}
export function update(params) { if (params.n && params.n !== sel) select(params.n); }
