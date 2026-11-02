// גלגל עונות: שנה מלאה. כל טבעת היא מזון אחד, כמו טבעות בגזע. החודש הנוכחי מסומן.
import { FOODS, CATEGORIES } from "../data/foods.js";
import { rich, esc, iconBtn, MONTHS, nowMonth } from "../ui.js";
import { plate } from "../plates.js";
import { foodImage } from "./foods.js";
import { MONTHS_SHORT } from "../ui.js";
import { patch } from "../route.js";

export const title = "עונות";

const C = 300, R_OUT = 292, R_MON = 252, R_IN = 74;
const SEASONAL = FOODS.filter((f) => f.months.length).sort((a, b) => CATEGORIES.findIndex((c) => c.id === a.cat) - CATEGORIES.findIndex((c) => c.id === b.cat) || a.months[0] - b.months[0]);
const STEP = (R_MON - 8 - R_IN) / SEASONAL.length;

// זווית לחודש: ינואר למעלה, עם כיוון השעון.
const ang = (m) => ((m - 1) / 12) * Math.PI * 2 - Math.PI / 2;
const pt = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
function arc(r, a0, a1) {
  const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
function sector(m) {
  const a0 = ang(m) + .004, a1 = ang(m + 1) - .004;
  const [x0, y0] = pt(R_OUT, a0), [x1, y1] = pt(R_OUT, a1), [x2, y2] = pt(R_MON, a1), [x3, y3] = pt(R_MON, a0);
  return `M${x0} ${y0}A${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${R_MON} ${R_MON} 0 0 0 ${x3} ${y3}Z`;
}
// חודשים רצופים לקטעים (כולל מעבר דצמבר-ינואר)
function runs(months) {
  const s = new Set(months), out = [];
  for (let m = 1; m <= 12; m++) if (s.has(m) && !s.has(((m + 10) % 12) + 1)) { let e = m; while (s.has((e % 12) + 1) && ((e % 12) + 1) !== m) e = (e % 12) + 1; out.push([m, e]); }
  if (!out.length && s.size === 12) out.push([1, 12]);
  return out;
}

// הרמב"ם, הלכות דעות ד ח: ימות החמה וימות הגשמים.
function rambamFor(m) {
  if ([5, 6, 7, 8, 9].includes(m)) return { kind: "ימות החמה", q: "\"בימות החמה אוכל מאכלים הקרים ולא ירבה בתבלים ואוכל את החומץ.\"" };
  if ([11, 12, 1, 2, 3].includes(m)) return { kind: "ימות הגשמים", q: "\"ובימות הגשמים אוכל מאכלים החמים ומרבה בתבלים.\"" };
  return { kind: "עונת מעבר", q: "\"ועל דרך זו הולך ועושה... בכל מקום ומקום הראוי לו.\"" };
}

let root, month, mode;

// מפה שנתית: מזון בכל שורה, חודש בכל עמודה, ממוין לפי תחילת העונה. קריאה ליניארית לאורך השנה.
const LINEAR = [...SEASONAL].sort((a, b) => a.months[0] - b.months[0] || a.months.length - b.months.length);
function gridHTML() {
  const now = nowMonth();
  return `<div class="yg" role="table" aria-label="מפה שנתית">
    <span class="yg-h"></span>${MONTHS_SHORT.map((m, i) => `<button class="yg-m ${i + 1 === month ? "sel" : ""} ${i + 1 === now ? "now" : ""}" data-m="${i + 1}" aria-pressed="${i + 1 === month}" aria-label="${MONTHS[i]}"><span class="ml">${m}</span><span class="mn">${i + 1}</span></button>`).join("")}
    ${LINEAR.map((f) => `<a class="yg-name" href="#/foods?id=${f.id}"><span class="yg-ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>${MONTHS.map((_, i) => `<i class="${f.months.includes(i + 1) ? "on" : ""} ${i + 1 === month ? "col" : ""}" title="${esc(f.he)}: ${MONTHS[i]}"></i>`).join("")}`).join("")}
  </div>`;
}

function wheelSVG() {
  const now = nowMonth();
  const rings = SEASONAL.map((f, i) => {
    const r = R_MON - 10 - i * STEP;
    const on = f.months.includes(month);
    const segs = runs(f.months).map(([s, e]) => `<path class="arc" d="${arc(r, ang(s) + .02, ang(e + 1) - .02)}" stroke="${on ? "#1A1A18" : "#D9D8D3"}" stroke-width="${Math.max(2.4, STEP - 2.2).toFixed(1)}"><title>${esc(f.he)}: ${esc(f.months.map((x) => MONTHS[x - 1]).join(", "))}</title></path>`).join("");
    return `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#F1F0EC" stroke-width=".6"/>${segs}`;
  }).join("");
  const secs = MONTHS.map((name, i) => {
    const m = i + 1, mid = (ang(m) + ang(m + 1)) / 2, [tx, ty] = pt((R_OUT + R_MON) / 2, mid);
    return `<g class="msec ${m === month ? "sel" : ""}" data-m="${m}" role="button" tabindex="0" aria-label="${name}" aria-pressed="${m === month}"><path d="${sector(m)}"/><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${name}</text></g>`;
  }).join("");
  const nowA0 = ang(now) + .03, nowA1 = ang(now + 1) - .03;
  const count = SEASONAL.filter((f) => f.months.includes(month)).length;
  return `<svg class="wheel" viewBox="0 0 600 600" role="img" aria-label="גלגל עונות" style="direction:ltr">
    ${rings}${secs}
    <path class="now-tick" d="${arc(R_OUT + 5, nowA0, nowA1)}" fill="none"/>
    <circle cx="${C}" cy="${C}" r="${R_IN - 6}" fill="#fff" stroke="#E5E4E0"/>
    <text x="${C}" y="${C - 14}" text-anchor="middle" font-family="IBM Plex Sans Hebrew" font-size="20" font-weight="600" fill="#1A1A18">${MONTHS[month - 1]}</text>
    <text x="${C}" y="${C + 14}" text-anchor="middle" font-family="IBM Plex Mono" font-size="22" font-weight="600" fill="#1A1A18">${count}</text>
    <text x="${C}" y="${C + 34}" text-anchor="middle" font-family="IBM Plex Sans Hebrew" font-size="10.5" fill="#84837D">בעונה</text>
  </svg>`;
}

function asideHTML() {
  const inSeason = SEASONAL.filter((f) => f.months.includes(month));
  const always = FOODS.filter((f) => !f.months.length);
  const r = rambamFor(month);
  return `<div class="panel-head"><div><span class="label">${r.kind}</span><h2 class="sheet-name" id="m-title">${MONTHS[month - 1]}${month === nowMonth() ? ` <span class="label" style="background:var(--marker);color:var(--ink);padding:1px 6px">החודש</span>` : ""}</h2></div>
      <div class="ops">${iconBtn("prev", "החודש הקודם", "data-mstep=\"-1\"")}${iconBtn("next", "החודש הבא", "data-mstep=\"1\"")}</div></div>
    <div class="panel-body scroll-in" style="flex:1">
      <p class="unique" style="margin-top:0">${rich(`**${inSeason.length}** מזונות בשדה ב${MONTHS[month - 1]}.`)}</p>
      <div class="stratum st-said"><div class="st-name">נאמר</div><div class="st-text">${esc(r.q)}</div><div class="st-meta"><span class="src">הרמב"ם, הלכות דעות ד ח</span></div></div>
      <div class="sec"><div class="sec-h"><h3>בשדה עכשיו</h3><span class="label"><bdi class="num">${inSeason.length}</bdi> פריטים</span></div>
        <div class="month-list">${inSeason.map((f) => `<a class="month-item" href="#/foods?id=${f.id}">${foodImage(f)}<span><b>${esc(f.he)}</b> <span class="latin">${esc(f.la)}</span></span><span class="kind">${esc(f.season_kind)}</span></a>`).join("") || `<p class="src">אין פריטים בעונה בחודש הזה.</p>`}</div>
      </div>
      <div class="sec"><div class="sec-h"><h3>כל השנה</h3><span class="label">יבוא</span></div><p style="font-size:13.5px">${always.map((f) => `<a href="#/foods?id=${f.id}">${esc(f.he)}</a>`).join(", ")}</p></div>
    </div>`;
}

function render() {
  root.querySelector("#wheel").innerHTML = mode === "wheel" ? wheelSVG() : gridHTML();
  root.querySelector("#wheel").classList.toggle("is-grid", mode !== "wheel");
  root.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  root.querySelector("#m-aside").innerHTML = asideHTML();
}

function setMonth(m) {
  month = ((m - 1 + 12) % 12) + 1;
  patch({ m: month });
  render();
}

export function mount(el, params) {
  root = el;
  month = Number(params.m) >= 1 && Number(params.m) <= 12 ? Number(params.m) : nowMonth();
  mode = params.v === "wheel" ? "wheel" : "grid";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="w-title">
      <div class="gallery-tools"><div><h1 class="view-title" id="w-title">העונות</h1><p class="view-sub">${rich("**מפה שנתית** לקריאה לאורך השנה, או **גלגל** שבו כל טבעת היא מזון.")}</p></div>
        <span class="chips" role="group" aria-label="תצוגה"><button class="chip" data-mode="grid">מפה שנתית</button><button class="chip" data-mode="wheel">גלגל</button></span>
        <span class="legend" style="font-size:12px;color:var(--ink-soft)"><span><i class="layer-mark" style="border-color:#1A1A18"></i>בעונה</span><span><i class="layer-mark" style="border-color:#D9D8D3"></i>בחודש אחר</span><span><i class="layer-mark" style="border-color:var(--marker);border-top-width:6px"></i>היום</span></span></div>
      <div class="wheel-wrap" id="wheel" style="flex:1;border:0;box-shadow:none"></div>
    </section>
    <aside class="panel" id="m-aside" aria-labelledby="m-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => {
    const md = e.target.closest("[data-mode]"); if (md) { mode = md.dataset.mode; patch({ v: mode === "wheel" ? "wheel" : undefined }); return render(); }
    const s = e.target.closest("[data-m]"); if (s) return setMonth(Number(s.dataset.m));
    const st = e.target.closest("[data-mstep]"); if (st) return setMonth(month + Number(st.dataset.mstep));
  });
  root.addEventListener("keydown", (e) => { const s = e.target.closest("[data-m]"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setMonth(Number(s.dataset.m)); } });
}

export function update(params) { if (params.m && Number(params.m) !== month) setMonth(Number(params.m)); }
