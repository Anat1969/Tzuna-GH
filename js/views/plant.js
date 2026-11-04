// צמח וגוף: מפה אחת שקוראים בעיניים (צמח מימין, גוף משמאל, קו לכל זוג), ותרשים מנגנון מונפש לכל חלק.
// הנושא מוצג בתרשים של הנושא עצמו, לא בצילום של מזון בודד שמתחזה לו. המזונות הם דוגמאות, בסוף.
// הלוחות באותו פורמט כמו "גוף" ו"נפש" בגיליון המזון.
import { PARTS, DOCTRINES } from "../data/plant.js";
import { FOODS, byId } from "../data/foods.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { overviewSVG, mechanismSVG, icon, ORGAN_ICON } from "../plantviz.js";
import { dock } from "../frame.js";

export const title = "צמח וגוף";
let root, sel;

const LAYER_HE = { known: "ידוע", said: "נאמר", believed: "מאמינים" };

// לוח בפורמט של גוף ונפש: אייקון, מילה גדולה, שורת משנה וטקסט.
const panel = (cls, ic, word, sub, html, foot = "", style = "") =>
  `<section class="ess ${cls}" ${style}><header>${icon(ic, "ess-ic")}<b class="ess-w">${word}</b><span class="ess-s">${sub}</span></header>${html}${foot ? `<footer>${foot}</footer>` : ""}</section>`;

function asideHTML() {
  const p = PARTS.find((x) => x.id === sel);
  const foods = p.foods.map(byId).filter(Boolean);
  return `<div class="panel-body scroll-in" style="flex:1">
      <h2 class="sheet-name pl-name" id="pl-title"><span class="pl-chip" style="color:${p.hue}">${icon(p.id)}</span>${esc(p.he)}
        <span class="pl-organ">↔</span><span class="pl-chip" style="color:${p.hue}">${icon(ORGAN_ICON[p.id])}</span>${esc(p.organ)}</h2>
      ${mechanismSVG(p.id, p.hue)}
      <div class="essence pl-ess">
        ${panel("ess-plant", "plant", "בצמח", "מה הוא עושה", `<p>${rich(p.plant.t)}</p>`, "", `style="--c:${p.hue}"`)}
      </div>
      <div class="ess ess-origin">${`<header>${icon("origin", "ess-ic")}<b class="ess-w">הקשר</b><span class="ess-s">מאיפה ההשוואה</span></header><p>${rich(p.origin.t)}</p><footer>ביולוגיה השוואתית · שכבת ידוע</footer>`}</div>
      ${p.note ? `<p class="unique" style="font-size:18px;margin:14px 0 8px">${rich(p.note)}</p>` : ""}
      <div class="sec"><div class="sec-h"><h3>דוגמאות: מזונות שהם ${esc(p.he)}</h3><span class="label"><bdi class="num" style="font-weight:400">${foods.length}</bdi></span></div>
        ${foods.length ? `<div class="pl-foods">${foods.map((f) => `<a class="pl-food press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>`).join("")}</div>` : `<p class="hint">אין בגלריה.</p>`}
      </div>
      ${sourcesBox([p.plant.src, p.body.src, p.mind.src, p.origin.src])}
    </div>`;
}

function doctrinesHTML() {
  return `<section class="doctrines" aria-labelledby="dc-h"><div class="sec-h"><h3 id="dc-h">מאיזו תורה צמח הקשר</h3><span class="label">שלוש דרכים להשוות צמח לגוף</span></div>
    <div class="dc-row">${DOCTRINES.map((d) => `<div class="dc dc-${d.layer}"><span class="dc-l"><i class="layer-mark lm-${d.layer}"></i>${LAYER_HE[d.layer]}</span><b>${esc(d.he)}</b><span class="dc-w">${esc(d.when)}</span><p>${rich(d.t)}</p></div>`).join("")}</div>
  </section>`;
}

function render() {
  root.querySelector("#pv-box").innerHTML = overviewSVG(PARTS, sel);
  const aside = root.querySelector("#pl-aside"), p = PARTS.find((x) => x.id === sel);
  aside.innerHTML = asideHTML();
  dock(aside, { body: { t: p.body.t, sub: p.organ }, soul: { t: p.mind.t, sub: p.mind.who + (p.mind.src ? ". תרגום" : "") } });
  root.querySelectorAll(".pl-tab").forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.part === sel)));
}
function select(id) { sel = id; patch({ p: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = PARTS.some((p) => p.id === params.p) ? params.p : "root";
  const fs = PARTS.filter((p) => p.id === "fruit" || p.id === "seed").reduce((n, p) => n + p.foods.length, 0);
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="pl-h">
      <div class="gallery-tools">
        <div><h1 class="view-title" id="pl-h">צמח וגוף</h1><p class="view-sub">${rich(`**שישה חלקים** כמעט בכל צמח, ולכל אחד **מקבילה בתפקוד** בגוף. ==${fs} מתוך ${FOODS.length} המזונות הם פרי או זרע: מאגר שהצמח הכין לדור הבא.==`)}</p></div>
      </div>
      <div class="scroll-in pl-main">
        <div class="pl-tabs" role="group" aria-label="חלקי הצמח">${PARTS.map((p) => `<button class="pl-tab" data-part="${p.id}" style="--c:${p.hue}">${icon(p.id)}<b>${esc(p.he)}</b><span>${icon(ORGAN_ICON[p.id])}${esc(p.organ)}</span></button>`).join("")}</div>
        <div id="pv-box" class="pv-box"></div>
        ${doctrinesHTML()}
        <blockquote class="pl-quote">${rich("\"קצה השורש... פועל כמו **המוח** של אחד מבעלי החיים הנמוכים.\"")}<cite>צ'ארלס דרווין, תנועה בצמחים, 1880. תרגום.</cite></blockquote>
      </div>
    </section>
    <aside class="panel sheet" id="pl-aside" aria-labelledby="pl-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => { const t = e.target.closest("[data-part]"); if (t) select(t.dataset.part); });
  root.addEventListener("keydown", (e) => { const t = e.target.closest(".pv-link"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.part); } });
}
export function update(params) { if (params.p && params.p !== sel) select(params.p); }
