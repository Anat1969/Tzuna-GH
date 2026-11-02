// שיטות: ציר זמן לפי אזור (מוקד), טבלת השוואה (סדרות קטנות), וכרטיס שיטה (טור צד).
import { METHODS, REGIONS, TRAITS, MATRIX, METHOD_INSIGHTS } from "../data/methods.js";
import { byId } from "../data/foods.js";
import { rich, esc, sourcesBox } from "../ui.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";

export const title = "שיטות";
let root, sel;

// סקאלה מקוטעת: העבר הרחוק דחוס, המאה האחרונה פתוחה.
const SEG = [[-1100, -200, 0, 0.22], [-200, 1000, 0.22, 0.44], [1000, 1900, 0.44, 0.68], [1900, 2030, 0.68, 1]];
function x(year) {
  const s = SEG.find(([a, b]) => year >= a && year <= b) || SEG[SEG.length - 1];
  return s[2] + ((year - s[0]) / (s[1] - s[0])) * (s[3] - s[2]);
}
const TICKS = [-1000, -500, 0, 500, 1000, 1500, 1900, 2000];
const yearLabel = (y) => (y < 0 ? `${-y} לפנה"ס` : `${y}`);

function timelineSVG() {
  const W = 1000, laneH = 52, top = 30, H = top + REGIONS.length * laneH + 28;
  const lanes = REGIONS.map((r, i) => `<g><rect x="0" y="${top + i * laneH}" width="${W}" height="${laneH - 6}" fill="${i % 2 ? "#fafaf7" : "#fff"}"/><text x="${W - 6}" y="${top + i * laneH + 26}" text-anchor="end" font-size="12" fill="${r.hue}" font-family="IBM Plex Sans Hebrew" font-weight="600">${esc(r.he)}</text></g>`).join("");
  const ticks = TICKS.map((t) => { const px = 20 + x(t) * (W - 150); return `<line x1="${px}" x2="${px}" y1="${top - 4}" y2="${H - 24}" stroke="#ecebe6"/><text x="${px}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#84837D" font-family="IBM Plex Mono">${t < 0 ? -t + "-" : t}</text>`; }).join("");
  // תוויות שקרובות זו לזו באותו נתיב מתחלפות: מתחת לפס ומעליו (טקסט לא עולה על טקסט).
  const lastX = {}, flip = {};
  METHODS.slice().sort((a, b) => a.from - b.from).forEach((m) => {
    const cx = 20 + x((m.from + m.to) / 2) * (W - 150);
    flip[m.id] = lastX[m.region] !== undefined && cx - lastX[m.region].x < 110 ? !lastX[m.region].up : false;
    lastX[m.region] = { x: cx, up: flip[m.id] };
  });
  const marks = METHODS.map((m) => {
    const li = REGIONS.findIndex((r) => r.id === m.region), hue = REGIONS[li].hue;
    const x0 = 20 + x(m.from) * (W - 150), x1 = 20 + x(m.to) * (W - 150), w = Math.max(10, x1 - x0);
    const y = top + li * laneH + 16;
    const on = m.id === sel;
    return `<g class="tl-m ${on ? "on" : ""}" data-m="${m.id}" role="button" tabindex="0" aria-label="${esc(m.he)}">
      <rect x="${x0 - (w === 10 ? 5 : 0)}" y="${y}" width="${w}" height="12" fill="${hue}" opacity="${on ? 1 : .55}" ${m.approx ? 'stroke-dasharray="3 2" stroke="' + hue + '" fill-opacity=".45"' : ""}/>
      <text x="${x0 + w / 2}" y="${flip[m.id] ? y - 4 : y + 26}" text-anchor="middle" font-size="${on ? 13 : 11.5}" font-weight="${on ? 700 : 500}" fill="#1A1A18" font-family="IBM Plex Sans Hebrew" style="direction:rtl">${esc(m.he)}</text></g>`;
  }).join("");
  return `<svg class="tl" viewBox="0 0 ${W} ${H}" role="img" aria-label="ציר זמן של שיטות התזונה" style="direction:ltr">${lanes}${ticks}${marks}</svg>`;
}

function tableHTML() {
  const cols = [["unit", "מה ממיינים"], ["principle", "מה זה איזון"], ["time", "זמן ועונה"], ["conflict", "מה לא משלבים"]];
  return `<table class="mt"><thead><tr><th>שיטה</th>${cols.map(([, h]) => `<th>${h}</th>`).join("")}</tr></thead><tbody>
    ${METHODS.map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""}"><th><b>${esc(m.he)}</b><span class="mt-y">${yearLabel(m.from)}</span></th>${cols.map(([k]) => `<td>${rich(m[k])}</td>`).join("")}</tr>`).join("")}
  </tbody></table>`;
}

// מה דומה ומה שונה: תובנות, ומטריצה של מה כל שיטה שוקלת.
function compareHTML() {
  const count = (t) => METHODS.filter((m) => (MATRIX[m.id] || []).includes(t)).length;
  return `<section class="mt-cmp"><div class="sec-h"><h3>מה דומה ומה שונה</h3><span class="label">התובנות שלי מההשוואה</span></div>
    <ul class="insights">${METHOD_INSIGHTS.map((x) => `<li>${rich(x.t)}</li>`).join("")}</ul>
    <table class="mx"><thead><tr><th></th>${TRAITS.map((t) => `<th>${esc(t.he)}<span class="mx-n">${count(t.id)}</span></th>`).join("")}</tr></thead>
    <tbody>${METHODS.map((m) => `<tr data-m="${m.id}" class="${m.id === sel ? "on" : ""}"><th>${esc(m.he)}</th>${TRAITS.map((t) => `<td>${(MATRIX[m.id] || []).includes(t.id) ? `<i class="dot" style="background:${REGIONS.find((r) => r.id === m.region).hue}"></i>` : ""}</td>`).join("")}</tr>`).join("")}</tbody></table>
  </section>`;
}

function asideHTML() {
  const m = METHODS.find((x) => x.id === sel), r = REGIONS.find((x) => x.id === m.region), f = byId(m.example.food);
  const when = m.from === m.to ? yearLabel(m.from) : `${yearLabel(m.from)} עד ${yearLabel(m.to)}`;
  return `<div class="panel-head"><div><span class="label" style="color:${r.hue}">${esc(r.he)}</span><h2 class="sheet-name" id="mt-title" style="font-size:30px;font-weight:700">${esc(m.he)}</h2>
      <div class="sheet-tags"><span><b>${esc(m.place)}</b> <span class="latin">${esc(m.place_la)}</span></span><span><b>${when}</b>${m.approx ? " (בערך)" : ""}</span></div></div></div>
    <div class="panel-body scroll-in" style="flex:1">
      ${m.layer === "believed" ? `<p class="believed-badge"><i class="layer-mark lm-believed"></i>${rich("שכבת **מאמינים**: חלק מהמידע נמסר בתקשור, ולא נבדק במחקר.")}</p>` : ""}
      <p class="unique" style="margin-top:0">${rich(m.principle)}</p>
      ${m.context ? `<div class="ctx"><div><span class="tile-l">תרבות</span>${rich(m.context.culture)}</div><div><span class="tile-l">מקום</span>${rich(m.context.geo)}</div><div><span class="tile-l">אקלים</span>${rich(m.context.climate)}</div></div>` : ""}
      <div class="tiles" style="grid-template-columns:minmax(0,1fr)">
        <div class="tile t-body"><span class="tile-l">מה ממיינים</span><p>${rich(m.unit)}</p></div>
        <div class="tile t-soul"><span class="tile-l">זמן ועונה</span><p>${rich(m.time)}</p></div>
        <div class="tile t-without"><span class="tile-l">מה לא משלבים</span><p>${rich(m.conflict)}</p></div>
      </div>
      ${f ? `<a class="mt-ex press" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><span><span class="tile-l">דוגמה מהגלריה</span><b>${esc(f.he)}</b><br>${rich(m.example.t)}</span></a>` : ""}
      ${sourcesBox([m.src])}
    </div>`;
}

function render() {
  root.querySelector("#tl").innerHTML = timelineSVG();
  root.querySelector("#mt").innerHTML = compareHTML() + tableHTML();
  root.querySelector("#mt-aside").innerHTML = asideHTML();
}
function select(id) { sel = id; patch({ m: id }); render(); }

export function mount(el, params) {
  root = el;
  sel = METHODS.some((m) => m.id === params.m) ? params.m : "rambam";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="mt-h">
      <div class="gallery-tools"><div><h1 class="view-title" id="mt-h">שיטות מכל העולם, בכל הזמנים</h1>
        <p class="view-sub">${rich(`**${METHODS.length} שיטות**, **3000 שנה**. ==כמעט כולן מחפשות איזון, ונבדלות במה שהן מודדות.==`)}</p></div>
        <span class="legend" style="font-size:12px">${REGIONS.map((r) => `<span><i class="layer-mark" style="border-color:${r.hue};border-top-width:6px"></i>${esc(r.he)}</span>`).join("")}</span></div>
      <div id="tl" class="tl-box"></div>
      <div class="scroll-in" style="flex:1;padding:0 14px 14px" id="mt"></div>
    </section>
    <aside class="panel" id="mt-aside" aria-labelledby="mt-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => { const t = e.target.closest("[data-m]"); if (t) select(t.dataset.m); });
  root.addEventListener("keydown", (e) => { const t = e.target.closest(".tl-m"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(t.dataset.m); } });
}
export function update(params) { if (params.m && params.m !== sel) select(params.m); }
