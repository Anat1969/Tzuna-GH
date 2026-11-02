// מתכונים: רשימה (מוקד) וכרטיס מתכון (טור צד). כל שלב עם איור של המזון שבו, ואלרגנים שנגזרים מהמזונות.
import { RECIPES } from "../data/recipes.js";
import { ALLERGENS, byId } from "../data/foods.js";
import { rich, stratum, esc, iconBtn, MONTHS, MONTHS_SHORT, nowMonth, triangle } from "../ui.js";
import { plate } from "../plates.js";
import { patch } from "../route.js";

export const title = "מתכונים";

let root, state;

const allergensOf = (r) => [...new Set(r.foods.flatMap((id) => byId(id).allergens))];
const inSeason = (r, m) => !r.months.length || r.months.includes(m);
function list() {
  return RECIPES.filter((r) => (!state.food || r.foods.includes(state.food)) && (!state.season || inSeason(r, nowMonth())));
}

function cardHTML(r) {
  const al = allergensOf(r);
  return `<button class="recipe-card press" data-id="${r.id}" aria-pressed="${state.id === r.id}">
    <span class="r-plates">${r.foods.slice(0, 4).map((id) => `<span>${plate(byId(id))}</span>`).join("")}</span>
    <span class="cap"><b>${esc(r.he)}</b>
      <span class="r-meta"><span>${esc(r.time)}</span><span><bdi class="num" style="font-weight:400">${r.steps.length}</bdi> שלבים</span>${al.length ? `<span class="warn">${esc(al.map((a) => ALLERGENS[a]).join(", "))}</span>` : ""}</span>
    </span>
  </button>`;
}

function monthsBar(r) {
  if (!r.months.length) return `<p style="font-size:14px">כל השנה.</p>`;
  const now = nowMonth();
  return `<div class="months">${MONTHS.map((m, i) => `<i class="${r.months.includes(i + 1) ? "on" : ""} ${i + 1 === now ? "now" : ""}" title="${m}"></i>`).join("")}</div>
    <div class="months-l">${MONTHS_SHORT.map((m) => `<span>${m}</span>`).join("")}</div><p class="src" style="margin-top:4px">הערכה כללית, לא נתון.</p>`;
}

function sheetHTML(r) {
  const L = list(); const idx = L.findIndex((x) => x.id === r.id);
  const al = allergensOf(r);
  return `<div class="panel-head"><div style="min-width:0"><span class="label">מתכון · ${esc(r.time)}</span><h2 class="sheet-name" id="r-title">${esc(r.he)}</h2></div>
      <div class="ops">${iconBtn("prev", "הקודם", `data-step="-1" ${idx <= 0 ? "disabled" : ""}`)}<span class="pos"><bdi class="num" style="font-weight:400">${idx + 1}/${L.length}</bdi></span>${iconBtn("next", "הבא", `data-step="1" ${idx >= L.length - 1 ? "disabled" : ""}`)}${iconBtn("print", "הדפסה", "data-print")}${iconBtn("x", "סגירה", "data-close")}</div></div>
    <div class="panel-body scroll-in" style="flex:1">
      ${stratum("said", [r.tradition])}
      ${r.note ? `<div class="tone tone-red" style="margin-top:8px"><p>${rich(r.note)}</p></div>` : ""}
      <section class="sec"><div class="sec-h"><h3>מצרכים</h3><span class="label">לחיצה פותחת את הגיליון</span></div>
        <div class="r-ings">${r.foods.map((id) => { const f = byId(id); return `<a class="r-ing press" href="#/foods?id=${f.id}">${plate(f)}<b>${esc(f.he)}</b></a>`; }).join("")}</div>
        <p style="font-size:13.5px;margin-top:6px;color:var(--ink-soft)">ועוד: ${esc(r.extra)}.</p>
      </section>
      <section class="sec"><div class="sec-h"><h3>שלבים</h3><span class="label"><bdi class="num" style="font-weight:400">${r.steps.length}</bdi> שלבים</span></div>
        <ol class="r-steps">${r.steps.map((st, i) => `<li><span class="r-n num">${i + 1}</span><span class="r-st">${rich(st.t)}</span><span class="r-pic">${st.food ? plate(byId(st.food)) : ""}</span></li>`).join("")}</ol>
      </section>
      <section class="sec"><div class="sec-h"><h3>עונה ואלרגנים</h3></div>
        ${monthsBar(r)}
        <p style="font-size:14px;margin-top:8px">${al.length ? `<b style="color:var(--red)">אלרגנים: ${esc(al.map((a) => ALLERGENS[a]).join(", "))}</b>. גם זיהום צולב.` : "בלי אלרגנים מהרשימה של 14 העיקריים, לפי המזונות במתכון."}</p>
      </section>
      <p class="safety-line">${triangle("var(--ink-mute)")}<span>${rich("מתכון ללמידה ולבישול. **אין כאן ערכים תזונתיים** ואין המלצה טיפולית.")}</span></p>
    </div>`;
}

// שנה במטבח: מתכון בכל שורה, חודש בכל עמודה. קומפוזיציה של סדרות קטנות.
function yearHTML() {
  const now = nowMonth();
  return `<div class="r-year"><div class="sec-h" style="margin:0 0 6px"><h3>שנה במטבח</h3><span class="label">מתי כל מתכון מתאים</span></div>
    <div class="r-year-grid" role="table" aria-label="מתכונים לפי חודש">
      <span></span>${MONTHS_SHORT.map((m, i) => `<span class="r-mh ${i + 1 === now ? "now" : ""}">${m}</span>`).join("")}
      ${list().map((r) => `<button class="r-yname" data-id="${r.id}" aria-pressed="${r.id === state.id}">${esc(r.he)}</button>${MONTHS.map((_, i) => `<i class="${inSeason(r, i + 1) ? (r.months.length ? "on" : "all") : ""} ${i + 1 === now ? "now" : ""}"></i>`).join("")}`).join("")}
    </div>
    <p class="src" style="margin-top:6px">${rich("כהה: עונה מתאימה. בהיר: כל השנה. **הערכה כללית**, לא נתון.")}</p></div>`;
}

function render() {
  const L = list();
  root.querySelector("#r-list").innerHTML = L.map(cardHTML).join("") || `<p class="src" style="padding:12px">אין מתכון שמתאים לסינון. <button class="chip" data-clear>ניקוי הסינון</button></p>`;
  root.querySelector("#r-year").innerHTML = yearHTML();
  root.querySelector("#r-hits").innerHTML = `<bdi class="num">${L.length}</bdi> מתכונים`;
  root.querySelector("#f-season").setAttribute("aria-pressed", String(state.season));
  root.querySelector("#f-food").innerHTML = state.food ? `<span class="chip-wrap"><button class="chip" aria-pressed="true" data-clear-food>עם ${esc(byId(state.food).he)} ×</button></span>` : "";
  if (state.id && !L.some((r) => r.id === state.id)) state.id = L[0]?.id || null;
  renderSheet();
}

function renderSheet() {
  const aside = root.querySelector("#r-sheet");
  const r = RECIPES.find((x) => x.id === state.id);
  root.querySelectorAll(".recipe-card").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.id === state.id)));
  aside.innerHTML = r ? sheetHTML(r) : `<div class="panel-body" style="display:grid;place-items:center;height:100%;color:var(--ink-soft)">${rich("**בחרו מתכון** מהרשימה.")}</div>`;
}

function select(id) { state.id = id; patch({ id: id || undefined }); renderSheet(); root.querySelector("#r-sheet .scroll-in")?.scrollTo(0, 0); }

export function mount(el, params) {
  root = el;
  state = { id: params.id || null, food: byId(params.food) ? params.food : null, season: params.season === "1" };
  if (!state.id) state.id = list()[0]?.id || null;
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="rl-title">
      <div class="gallery-tools">
        <div><h1 class="view-title" id="rl-title">מתכונים</h1><p class="view-sub">${rich("עד **10 שלבים**, עם מקור מסורת לכל מתכון. **בלי ערכים תזונתיים.**")}</p></div>
        <span class="src" id="r-hits" aria-live="polite"></span>
      </div>
      <div class="gallery-tools" style="padding-top:4px;padding-bottom:6px"><div class="chips"><button class="chip" id="f-season" data-season>מתאים לעונה עכשיו</button><span id="f-food"></span></div></div>
      <div class="scroll-in gallery-box" style="flex:1"><div class="recipe-grid" id="r-list"></div><div id="r-year" class="r-year-box"></div></div>
    </section>
    <aside class="panel" id="r-sheet" aria-labelledby="r-title"></aside>
  </div>`;
  render();
  root.addEventListener("click", (e) => {
    const c = e.target.closest(".recipe-card, .r-yname"); if (c) { select(c.dataset.id); root.querySelectorAll(".r-yname").forEach((y) => y.setAttribute("aria-pressed", String(y.dataset.id === state.id))); return; }
    if (e.target.closest("[data-season]")) { state.season = !state.season; patch({ season: state.season ? "1" : undefined }); return render(); }
    if (e.target.closest("[data-clear-food]") || e.target.closest("[data-clear]")) { state.food = null; state.season = false; patch({ food: undefined, season: undefined }); return render(); }
    const st = e.target.closest("[data-step]");
    if (st) { const L = list(); const i = L.findIndex((x) => x.id === state.id); const nx = L[i + Number(st.dataset.step)]; if (nx) select(nx.id); return; }
    if (e.target.closest("[data-print]")) return print();
    if (e.target.closest("[data-close]")) return select(null);
  });
}

export function update(params) {
  const food = byId(params.food) ? params.food : null;
  if (food !== state.food) { state.food = food; render(); }
  if ((params.id || null) !== state.id && params.id) select(params.id);
}
