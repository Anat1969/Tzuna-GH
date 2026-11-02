// צמח וגוף: שישה חלקים, כל אחד בצילום אמיתי, ולצדו האיבר המקביל בגוף, הנפש והשפה.
// בלי איורים: צילום ליד טיפוגרפיה (הערת ענת על "גרפיקה ילדותית").
import { PARTS } from "../data/plant.js";
import { FOODS, byId } from "../data/foods.js";
import { PHOTOS } from "../data/photos.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";

export const title = "צמח וגוף";
let root, sel;

// צילום לכל חלק: שורש (גזר), גבעול (ג'ינג'ר), עלה (מנגולד), פרח (פריחת שקד), פרי (רימון), זרע (עדשים).
const PART_PHOTO = {
  root: { src: "img/plant-root.jpg", credit: "Diogo Luiz, iNaturalist · CC BY", caption: "גזר: שורש אמיתי" },
  stem: { food: "ginger", caption: "ג'ינג'ר: גבעול תת־קרקעי" },
  leaf: { food: "chard", caption: "מנגולד: עלה" },
  flower: { food: "almond", caption: "פריחת השקד" },
  fruit: { food: "pomegranate", caption: "רימון: פרי" },
  seed: { food: "lentil", caption: "עדשים: זרעים" }
};
function partPhoto(id) {
  const p = PART_PHOTO[id];
  if (p.src) return { src: p.src, credit: p.credit, caption: p.caption };
  const ph = PHOTOS[p.food];
  return ph ? { src: ph.src, credit: `${ph.credit} · ${ph.license}`, caption: p.caption } : null;
}

function cardHTML(p) {
  const ph = partPhoto(p.id);
  return `<button class="pcard press" data-part="${p.id}" aria-pressed="${p.id === sel}">
    <span class="pc-img">${ph ? `<img src="${ph.src}" alt="${esc(ph.caption)}" loading="lazy">` : ""}</span>
    <span class="pc-cap"><b>${esc(p.he)}</b><span class="pc-arrow">בגוף: <strong>${esc(p.organ)}</strong></span></span>
  </button>`;
}

function asideHTML() {
  const p = PARTS.find((x) => x.id === sel);
  const ph = partPhoto(p.id);
  const foods = p.foods.map(byId).filter(Boolean);
  return `<div class="sheet-hero">${ph ? `<img src="${ph.src}" alt="${esc(ph.caption)}"><span class="credit">${esc(ph.credit)}</span>` : ""}</div>
    <div class="panel-body scroll-in" style="flex:1">
      <h2 class="sheet-name" id="pl-title">${esc(p.he)} <span class="pl-organ">↔ ${esc(p.organ)}</span></h2>
      <p class="hint">${esc(ph?.caption || "")}</p>
      <div class="tiles" style="grid-template-columns:minmax(0,1fr);margin-top:10px">
        <div class="tile t-plant"><span class="tile-l">בצמח</span><p>${rich(p.plant.t)}</p></div>
        <div class="tile t-body"><span class="tile-l">בגוף: ${esc(p.organ)} · אנלוגיה של תפקוד</span><p>${rich(p.body.t)}</p></div>
        <div class="tile t-soul"><span class="tile-l">בנפש</span><p>${rich(p.mind.t)}</p>${p.mind.src ? `<p class="hint">${esc(p.mind.who)}. תרגום.</p>` : ""}</div>
        <div class="tile t-lang"><span class="tile-l">בשפה</span><p>${rich(p.lang)}</p></div>
      </div>
      ${p.note ? `<p class="unique" style="font-size:18px;margin:14px 0 8px">${rich(p.note)}</p>` : ""}
      <div class="sec"><div class="sec-h"><h3>מזונות שהם ${esc(p.he)}</h3><span class="label"><bdi class="num" style="font-weight:400">${foods.length}</bdi></span></div>
        ${foods.length ? `<div class="pl-foods">${foods.map((f) => `<a class="pl-food press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>`).join("")}</div>` : `<p class="hint">אין בגלריה.</p>`}
      </div>
      ${sourcesBox([p.plant.src, p.body.src, p.mind.src])}
    </div>`;
}

function render() {
  root.querySelectorAll(".pcard").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.part === sel)));
  root.querySelector("#pl-aside").innerHTML = asideHTML();
}
function select(id) { sel = id; patch({ p: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = PARTS.some((p) => p.id === params.p) ? params.p : "root";
  const fs = PARTS.filter((p) => p.id === "fruit" || p.id === "seed").reduce((n, p) => n + p.foods.length, 0);
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="pl-h">
      <div class="gallery-tools">
        <div><h1 class="view-title" id="pl-h">צמח וגוף</h1><p class="view-sub">${rich(`**שישה חלקים** כמעט בכל צמח, ולכל אחד **מקבילה בגוף**. ==${fs} מתוך ${FOODS.length} המזונות הם פרי או זרע: מאגר שהצמח הכין לדור הבא.==`)}</p></div>
      </div>
      <div class="pgrid scroll-in">${PARTS.map(cardHTML).join("")}</div>
      <blockquote class="pl-quote">"It is hardly an exaggeration to say that the tip of the radicle... acts like the brain of one of the lower animals."<cite>צ'ארלס דרווין (Charles Darwin), תנועה בצמחים, 1880: קצה השורש פועל כמו מוח.</cite></blockquote>
    </section>
    <aside class="panel sheet" id="pl-aside" aria-labelledby="pl-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => { const t = e.target.closest("[data-part]"); if (t) select(t.dataset.part); });
}
export function update(params) { if (params.p && params.p !== sel) select(params.p); }
