// צמח וגוף: שישה חלקים, וכל אחד עם המקבילה בגוף, הקשר לנפש, והמזונות שהם החלק הזה.
// מוקד: צמח וגוף זה לצד זה, מסונכרנים. טור צד: החלק שנבחר.
import { PARTS } from "../data/plant.js";
import { FOODS, byId } from "../data/foods.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";

export const title = "צמח וגוף";
let root, sel;

const S = "#2a2a26";
// צמח: כל חלק בקבוצה משלו, לחיץ.
function plantSVG() {
  const g = (id, inner) => `<g class="pz" data-part="${id}" role="button" tabindex="0" aria-label="${esc(PARTS.find((p) => p.id === id).he)}">${inner}</g>`;
  return `<svg class="pl-svg" viewBox="0 0 300 520" role="img" aria-label="מבנה הצמח" style="direction:ltr">
    <rect x="0" y="330" width="300" height="190" fill="#f3efe6"/>
    <path d="M0 330H300" stroke="#c9bfa8" stroke-width="1.5"/>
    ${g("root", `<path class="z" d="M150 330C150 370 140 400 120 440M150 330C152 380 160 420 182 470M150 340C130 360 100 372 78 400M150 345C175 362 205 380 228 410M120 440C112 456 98 466 86 488M182 470C190 480 204 490 214 506M150 360C148 400 150 440 146 500" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/>`)}
    ${g("stem", `<path class="z" d="M150 330C148 280 152 220 150 120" fill="none" stroke="${S}" stroke-width="5" stroke-linecap="round"/><path d="M150 190C170 178 190 170 206 168" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/>`)}
    ${g("leaf", `<path class="z f" d="M150 268C120 252 92 256 70 274C96 288 126 286 150 268Z"/><path class="z f" d="M150 250C178 230 210 232 232 248C206 266 176 266 150 250Z"/><path class="z f" d="M150 214C128 198 104 198 86 210C106 224 130 226 150 214Z"/><path d="M150 268L82 272M150 250L222 248M150 214L94 210" stroke="${S}" stroke-width=".8" fill="none"/>`)}
    ${g("flower", `${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse class="z f" cx="150" cy="96" rx="11" ry="22" transform="rotate(${a} 150 118)"/>`).join("")}<circle cx="150" cy="118" r="9" fill="#e8c43a" stroke="${S}" stroke-width="1.5"/>`)}
    ${g("fruit", `<path d="M206 168C210 176 212 184 212 192" stroke="${S}" stroke-width="2" fill="none"/><circle class="z f" cx="212" cy="214" r="22"/>`)}
    ${g("seed", `<ellipse class="z f" cx="252" cy="210" rx="6" ry="9" transform="rotate(20 252 210)"/><ellipse class="z f" cx="266" cy="228" rx="6" ry="9" transform="rotate(-10 266 228)"/><ellipse class="z f" cx="248" cy="236" rx="6" ry="9" transform="rotate(40 248 236)"/><path d="M234 214L244 214" stroke="${S}" stroke-dasharray="2 2" stroke-width="1"/>`)}
    <g class="pl-labels" font-family="IBM Plex Sans Hebrew" font-size="15" fill="${S}" text-anchor="end">
      <text x="72" y="410">שורש</text><text x="138" y="300">גבעול</text><text x="64" y="268">עלה</text><text x="122" y="70">פרח</text><text x="236" y="186">פרי</text><text x="292" y="200">זרע</text>
    </g>
  </svg>`;
}
// גוף: אזורים שמקבילים לחלקי הצמח.
function bodySVG() {
  const g = (id, inner) => `<g class="bz" data-part="${id}">${inner}</g>`;
  return `<svg class="bd-svg" viewBox="0 0 220 520" role="img" aria-label="מקבילות בגוף" style="direction:ltr">
    <path d="M110 30c26 0 40 20 40 44s-14 46-40 46s-40-22-40-46s14-44 40-44zM96 120h28v18H96zM62 140c20-4 76-4 96 0c14 4 20 18 20 34l-6 150c0 14-8 22-20 24H68c-12-2-20-10-20-24l-6-150c0-16 6-30 20-34zM70 350l-4 150M150 350l4 150" fill="none" stroke="#b9b8b2" stroke-width="2"/>
    ${g("root", `<path class="z" d="M110 70c-14-14-34-4-30 12c-10 8-4 24 10 22c4 10 24 10 28 0c14 2 20-14 10-22c4-16-16-26-18-12z" fill="none" stroke-width="2"/><path class="z" d="M84 262c10-8 42-8 52 0c10 8 8 22-4 26c-12 4-30 4-42 0c-12-4-14-18-6-26zM88 280c-6 10-2 24 10 28h24c12-4 16-18 10-28" fill="none" stroke-width="2.4"/>`)}
    ${g("stem", `<path class="z" d="M110 150V340M110 170C90 190 80 220 78 330M110 170C130 190 140 220 142 330" fill="none" stroke-width="2"/>`)}
    ${g("leaf", `<path class="z f" d="M106 160c-24 0-40 22-40 54c0 18 10 28 24 26c10-2 16-12 16-28z"/><path class="z f" d="M114 160c24 0 40 22 40 54c0 18-10 28-24 26c-10-2-16-12-16-28z"/>`)}
    ${g("flower", `<circle class="z f" cx="96" cy="70" r="5"/><circle class="z f" cx="124" cy="70" r="5"/><path class="z" d="M104 96q6 6 12 0M110 76v10" fill="none" stroke-width="2"/>`)}
    ${g("fruit", `<path class="z" d="M98 104q12 10 24 0" fill="none" stroke-width="3"/>`)}
    ${g("seed", `<path class="z f" d="M120 236c18-6 34 2 34 14c0 10-14 14-34 8z"/>`)}
    <g font-family="IBM Plex Sans Hebrew" font-size="13" fill="#84837D" text-anchor="start" class="bd-labels">
      <text x="160" y="72">מוח</text><text x="160" y="196">ריאות</text><text x="160" y="250">כבד</text><text x="160" y="290">מעי</text>
    </g>
  </svg>`;
}

function asideHTML() {
  const p = PARTS.find((x) => x.id === sel);
  const foods = p.foods.map(byId).filter(Boolean);
  return `<div class="panel-head"><div><span class="label" style="color:${p.hue}">בצמח · בגוף: ${esc(p.organ)}</span><h2 class="sheet-name" id="pl-title" style="font-size:30px;font-weight:700">${esc(p.he)}</h2></div></div>
    <div class="panel-body scroll-in" style="flex:1">
      <div class="tiles" style="grid-template-columns:minmax(0,1fr)">
        <div class="tile t-plant"><span class="tile-l">בצמח</span><p>${rich(p.plant.t)}</p></div>
        <div class="tile t-body"><span class="tile-l">בגוף: ${esc(p.organ)} · אנלוגיה של תפקוד</span><p>${rich(p.body.t)}</p></div>
        <div class="tile t-soul"><span class="tile-l">בנפש</span><p>${rich(p.mind.t)}</p>${p.mind.who && p.mind.src ? `<p class="hint">${esc(p.mind.who)}. תרגום.</p>` : ""}</div>
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
  root.querySelectorAll("[data-part]").forEach((el) => {
    const on = el.dataset.part === sel;
    el.classList.toggle("on", on);
    if (el.matches("button, .pz")) el.setAttribute("aria-pressed", String(on));
  });
  const p = PARTS.find((x) => x.id === sel);
  root.querySelector(".pl-stage").style.setProperty("--part", p.hue);
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
      <div class="chips pl-chips" role="group" aria-label="חלקי הצמח">${PARTS.map((p) => `<button class="chip" data-part="${p.id}" aria-pressed="${p.id === sel}"><i style="display:inline-block;width:9px;height:9px;background:${p.hue};margin-inline-end:6px"></i>${esc(p.he)} <span class="count">${esc(p.organ)}</span></button>`).join("")}</div>
      <div class="pl-stage">
        <figure class="pl-fig">${plantSVG()}<figcaption>צמח</figcaption></figure>
        <div class="pl-arrow" aria-hidden="true"></div>
        <figure class="pl-fig">${bodySVG()}<figcaption>גוף</figcaption></figure>
      </div>
      <blockquote class="pl-quote">"It is hardly an exaggeration to say that the tip of the radicle... acts like the brain of one of the lower animals."<cite>צ'ארלס דרווין (Charles Darwin), תנועה בצמחים, 1880: קצה השורש פועל כמו מוח.</cite></blockquote>
    </section>
    <aside class="panel" id="pl-aside" aria-labelledby="pl-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => { const t = e.target.closest("[data-part]"); if (t) select(t.dataset.part); });
  root.addEventListener("keydown", (e) => { const t = e.target.closest(".pz"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.part); } });
}

export function update(params) { if (params.p && params.p !== sel) select(params.p); }
