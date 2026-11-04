// אבות מזון וויטמינים: מה יש באיזה מזון, באיזה חלק של הצמח, ובאיזה חודש.
// קודם הגילויים מההצלבה (חלק בצמח × רכיב, עונה × רכיב), ואחר כך הכלי. בלי כמויות, בלי מינונים ובלי קלוריות.
import { NUTRIENTS, KIND_HE, KIND_INFO } from "../data/nutrients.js";
import { FOODS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { PARTS } from "../data/plant.js";
import { rich, esc, sourcesBox, MONTHS, MONTHS_SHORT, nowMonth } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { icon, ORGAN_ICON } from "../plantviz.js";
import { MONTH_HUE } from "./seasons.js";
import { dock } from "../frame.js";

export const title = "רכיבים";
let root, sel, part = null, open = null;

// מי מקור למה: לפי "גוף" בפרופיל, שכולו הרכב עם מקור.
const SOURCES_OF = Object.fromEntries(NUTRIENTS.map((n) => [n.id, FOODS.filter((f) => n.re.test(PROFILES[f.id]?.body?.t || ""))]));
const partOf = (f) => PARTS.find((p) => p.foods.includes(f.id));
const badge = (n, size = "") => n.sym
  ? `<span class="nb nb-${n.kind} ${size}"><b>${esc(n.sym)}</b></span>`
  : `<span class="nb nb-${n.kind} ${size}">${icon(n.ic)}</span>`;

// גילויים: איזה חלק בצמח מוביל כל רכיב, מה הכי נפוץ, ומתי בשנה.
export function discoveries() {
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

// טבלה אחת: רכיב × חלק בצמח. לכל סוג (אבות מזון, ויטמינים, מינרלים) כותרת והסבר, ומתחתיה השורות שלו.
// העיגול גדל עם מספר המקורות. לחיצה על מספר מסננת את הטור הצדדי לחלק הזה.
function tableHTML() {
  const max = Math.max(...NUTRIENTS.flatMap((n) => PARTS.map((p) => SOURCES_OF[n.id].filter((f) => partOf(f) === p).length)));
  const head = `<tr class="nt-head"><th></th>${PARTS.map((p) => `<th class="${part === p.id ? "c-on" : ""}"><button class="nt-col" data-col="${p.id}" aria-pressed="${part === p.id}"><span style="color:${p.hue}">${icon(p.id)}</span><b>${esc(p.he)}</b></button></th>`).join("")}<th><b>סה"כ</b></th></tr>`;
  const body = Object.keys(KIND_HE).map((k) => {
    const info = KIND_INFO[k], isOpen = open === k;
    return `<tr class="nt-kind"><th colspan="${PARTS.length + 2}"><button class="nt-k" data-kind="${k}" aria-expanded="${isOpen}"><span class="nb nb-${k} sm">${icon(k === "macro" ? "seed" : k === "vitamin" ? "sun" : "root")}</span><b>${esc(KIND_HE[k])}</b><span class="nt-short">${rich(info.short)}</span><span class="nt-more">${isOpen ? "פחות" : "למה זה חשוב"}</span></button>${isOpen ? `<p class="nt-long">${rich(info.long)}</p>` : ""}</th></tr>`
      + NUTRIENTS.filter((n) => n.kind === k).map((n) => `<tr class="nt-row ${n.id === sel ? "on" : ""}" data-n="${n.id}"><th><span class="nt-nm">${badge(n, "sm")}<span>${esc(n.he)}</span></span></th>${PARTS.map((p) => { const c = SOURCES_OF[n.id].filter((f) => partOf(f) === p).length; const on = n.id === sel && part === p.id; return `<td class="${part === p.id ? "c-on" : ""}">${c ? `<button class="nt-c ${on ? "on" : ""}" data-n="${n.id}" data-part="${p.id}" style="--h:${p.hue};--r:${(10 + 16 * Math.sqrt(c / max)).toFixed(1)}px" aria-label="${esc(n.he)} ב${esc(p.he)}: ${c}">${c}</button>` : ""}</td>`; }).join("")}<td class="nt-t"><button class="nt-c tot ${n.id === sel && !part ? "on" : ""}" data-n="${n.id}" data-part="">${SOURCES_OF[n.id].length}</button></td></tr>`).join("");
  }).join("");
  return `<table class="nt${part ? " has-col" : ""}">${head}${body}</table>`;
}

function seasonBar(n) {
  const fs = SOURCES_OF[n.id], now = nowMonth();
  const cnt = MONTHS.map((_, i) => fs.filter((f) => !f.months.length || f.months.includes(i + 1)).length), max = Math.max(1, ...cnt);
  return `<div class="nseason" aria-label="מקורות בעונה, לפי חודש">${cnt.map((c, i) => `<span class="${i + 1 === now ? "now" : ""}" style="--mh:${MONTH_HUE[i]}" title="${MONTHS[i]}: ${c}"><i style="height:${Math.round((c / max) * 100)}%"></i><b class="num">${c}</b><em>${MONTHS_SHORT[i]}</em></span>`).join("")}</div>`;
}

function asideHTML() {
  const n = NUTRIENTS.find((x) => x.id === sel), all = SOURCES_OF[n.id];
  const fs = part ? all.filter((f) => partOf(f)?.id === part) : all, P = PARTS.find((p) => p.id === part);
  const byPart = PARTS.map((p) => [p, fs.filter((f) => partOf(f) === p)]).filter(([, l]) => l.length);
  return `<div class="panel-body scroll-in" style="flex:1">
    <h2 class="sheet-name pl-name" id="n-title">${badge(n, "lg")}${esc(n.he)}<span class="label">${esc(KIND_HE[n.kind])}</span></h2>
    <div class="sec-h"><h3>מקורות בגלריה${P ? `: ${esc(P.he)}` : ""}</h3><span class="label"><bdi class="num">${fs.length}</bdi></span>${P ? `<button class="chip-all" data-n="${n.id}" data-part="">הכול</button>` : ""}</div>
    ${byPart.map(([p, l]) => `<h4 class="ml-h"><span style="color:${p.hue}">${icon(p.id)}</span>${esc(p.he)} <bdi class="num">${l.length}</bdi></h4><div class="pl-foods">${l.map((f) => `<a class="pl-food press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>`).join("")}</div>`).join("") || `<p class="hint">אין בגלריה.</p>`}
    ${sourcesBox([n.role.src, "usda-fdc"])}
  </div>`;
}

function render() {
  root.querySelector("#n-main").innerHTML = `
    <section class="mt-disc"><div class="sec-h"><h3>מה הטבלה מחביאה</h3><span class="label">גילויים מההצלבה</span></div>
      <ul class="disc-list one">${discoveries().map((d) => `<li class="disc-pick ${d.n.id === sel ? "on" : ""}" data-n="${d.n.id}" role="button" tabindex="0">${badge(d.n, "sm")}<span>${rich(d.t)}</span></li>`).join("")}</ul></section>
    <section><div class="sec-h"><h3>באיזה חלק של הצמח</h3><span class="label">עיגול גדול: יותר מקורות. לחיצה על מספר מציגה את המזונות.</span></div>${tableHTML()}</section>`;
  const aside = root.querySelector("#n-aside"), n = NUTRIENTS.find((x) => x.id === sel);
  aside.innerHTML = asideHTML();
  const f = SOURCES_OF[n.id].find((x) => PROFILES[x.id]?.soul), so = f && PROFILES[f.id].soul;
  dock(aside, { body: { t: n.role.t, sub: n.he }, soul: so ? { t: so.t, sub: `${f.he} · ${so.trad}` } : null, extra: `<div class="bs-x-h"><b>מתי בשנה</b><span>כמה מקורות בשדה בכל חודש</span></div>${seasonBar(n)}` });
}
function select(id) { sel = id; patch({ n: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = NUTRIENTS.some((n) => n.id === params.n) ? params.n : "protein";
  part = PARTS.some((p) => p.id === params.part) ? params.part : null;
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="n-h">
      <div class="gallery-tools"><div><h1 class="view-title" id="n-h">אבות מזון וויטמינים</h1>
        <p class="view-sub">${rich(`**${NUTRIENTS.length} רכיבים**, **${FOODS.length} מזונות**. ==כל חלק בצמח אוגר משהו אחר: הזרע חלבון, העלה ויטמין K.==`)}</p></div></div>
      <div class="mt-main n-main" id="n-main"></div>
    </section>
    <aside class="panel sheet" id="n-aside" aria-labelledby="n-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => {
    const k = e.target.closest("[data-kind]"); if (k) { open = open === k.dataset.kind ? null : k.dataset.kind; return render(); }
    // לחיצה על טור: החלק הזה בולט בכל הרכיבים, והשאר מוצנע. לחיצה שנייה מבטלת.
    const c = e.target.closest("[data-col]"); if (c) { part = part === c.dataset.col ? null : c.dataset.col; patch({ part: part || undefined }); return render(); }
    const t = e.target.closest("[data-n]"); if (!t) return;
    part = t.dataset.part || null; sel = t.dataset.n; patch({ n: sel, part: part || undefined }); render();
  });
}
export function update(params) { if (params.n && params.n !== sel) select(params.n); }
