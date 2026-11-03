// מתכונים: רשימה (מוקד) וכרטיס מתכון (טור צד). כל שלב עם איור של המזון שבו, ואלרגנים שנגזרים מהמזונות.
import { RECIPES } from "../data/recipes.js";
import { ALLERGENS, byId } from "../data/foods.js";
import { rich, stratum, esc, iconBtn, MONTHS, MONTHS_SHORT, nowMonth, triangle } from "../ui.js";
import { plate } from "../plates.js";
import { foodImage } from "./foods.js";
import { patch } from "../route.js";
import { synergiesInRecipe, SYNERGIES } from "../data/synergies.js";

export const title = "מתכונים";

let root, state;

const allergensOf = (r) => [...new Set([...r.foods.flatMap((id) => byId(id).allergens), ...(r.extraAllergens || [])])];
const inSeason = (r, m) => !r.months.length || r.months.includes(m);
function list() {
  return RECIPES.filter((r) => (!state.food || r.foods.includes(state.food)) && (!state.season || inSeason(r, nowMonth())));
}

function cardHTML(r) {
  const al = allergensOf(r);
  return `<button class="recipe-card press" data-id="${r.id}" aria-pressed="${state.id === r.id}">
    <span class="r-plates">${r.foods.slice(0, 4).map((id) => `<span>${foodImage(byId(id))}</span>`).join("")}</span>
    <span class="cap"><b>${esc(r.he)}</b>
      ${synergiesInRecipe(r.id).slice(0, 1).map((x) => `<span class="r-syn">${esc(x.title)}</span>`).join("")}
      <span class="r-meta"><span>${esc(r.time)}</span><span><bdi class="num" style="font-weight:400">${r.steps.length}</bdi> שלבים</span>${al.length ? `<span class="warn">${esc(al.map((a) => ALLERGENS[a]).join(", "))}</span>` : ""}</span>
    </span>
  </button>`;
}

function monthsBar(r) {
  if (!r.months.length) return `<p style="font-size:14px">כל השנה.</p>`;
  const now = nowMonth();
  return `<div class="months">${MONTHS.map((m, i) => `<i class="${r.months.includes(i + 1) ? "on" : ""} ${i + 1 === now ? "now" : ""}" title="${m}"></i>`).join("")}</div>
    <div class="months-l">${MONTHS_SHORT.map((m) => `<span>${m}</span>`).join("")}</div>`;
}

function sheetHTML(r) {
  const L = list(); const idx = L.findIndex((x) => x.id === r.id);
  const al = allergensOf(r);
  return `<div class="panel-head"><div style="min-width:0"><span class="label">מתכון · ${esc(r.time)}</span><h2 class="sheet-name" id="r-title">${esc(r.he)}</h2></div>
      <div class="ops">${iconBtn("prev", "הקודם", `data-step="-1" ${idx <= 0 ? "disabled" : ""}`)}<span class="pos"><bdi class="num" style="font-weight:400">${idx + 1}/${L.length}</bdi></span>${iconBtn("next", "הבא", `data-step="1" ${idx >= L.length - 1 ? "disabled" : ""}`)}${iconBtn("print", "הדפסה", "data-print")}${iconBtn("x", "סגירה", "data-close")}</div></div>
    <div class="panel-body scroll-in" style="flex:1">
      ${synergiesInRecipe(r.id).length ? `<section class="sec" style="margin-top:0"><div class="sec-h"><h3>מה מעצים את מה</h3><span class="label">הצירוף שבמתכון</span></div>
        ${synergiesInRecipe(r.id).map((x) => `<div class="syn ${x.kind}"><b class="syn-t">${esc(x.title)}</b><p>${rich(x.how)}</p></div>`).join("")}</section>` : ""}
      ${stratum("said", [r.tradition])}
      ${r.note ? `<div class="tile t-without" style="margin-top:8px"><span class="tile-l">לא הולך עם</span><p>${rich(r.note)}</p></div>` : ""}
      <section class="sec"><div class="sec-h"><h3>מצרכים</h3><span class="label">לחיצה פותחת את הגיליון</span></div>
        <div class="r-ings">${r.foods.map((id) => { const f = byId(id); return `<a class="r-ing press" href="#/foods?id=${f.id}">${foodImage(f)}<b>${esc(f.he)}</b></a>`; }).join("")}</div>
        <p style="font-size:13.5px;margin-top:6px;color:var(--ink-soft)">ועוד: ${esc(r.extra)}.</p>
      </section>
      <section class="sec"><div class="sec-h"><h3>שלבים</h3><span class="label"><bdi class="num" style="font-weight:400">${r.steps.length}</bdi> שלבים</span></div>
        <ol class="r-steps">${r.steps.map((st, i) => `<li><span class="r-n num">${i + 1}</span><span class="r-st">${rich(st.t)}</span><span class="r-pic">${st.food ? foodImage(byId(st.food)) : ""}</span></li>`).join("")}</ol>
      </section>
      <section class="sec"><div class="sec-h"><h3>עונה ואלרגנים</h3></div>
        ${monthsBar(r)}
        <p style="font-size:14px;margin-top:8px">${al.length ? `<b style="color:var(--red)">אלרגנים: ${esc(al.map((a) => ALLERGENS[a]).join(", "))}</b>. גם זיהום צולב.` : "בלי אלרגנים מהרשימה של 14 העיקריים, לפי המזונות במתכון."}</p>
      </section>
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
    <p class="hint" style="margin-top:6px">${rich("**כהה**: עונה מתאימה. **בהיר**: כל השנה.")}</p></div>`;
}

// רשת הצירופים: כל מזון צומת, כל צירוף קו. ירוק רציף מעצים, אדום מקווקו מחליש. לחיצה פותחת את המנגנון בטור הצד.
const nodeKey = (s, side) => side === "a" ? s.a : (s.b || "m:" + s.mate);
const nodeLabel = (k) => k.startsWith("m:") ? k.slice(2) : byId(k).he;
function netNodes() {
  const adj = {};
  for (const s of SYNERGIES) { const a = nodeKey(s, "a"), b = nodeKey(s, "b"); (adj[a] ||= []).push(b); (adj[b] ||= []).push(a); }
  // הצומת העמוס במרכז כעמוד שדרה, וכל זוג אחר כשורה אופקית משני הצדדים. כך כל קו נראה, ושום תווית לא עולה על אחרת.
  const keys = Object.keys(adj).sort((x, y) => adj[y].length - adj[x].length);
  const hub = keys[0], W = 840, H = 440, cx = W / 2, cy = H / 2, GAP = 46;
  const wOf = (k) => Math.max(44, nodeLabel(k).length * 9 + 18);
  const pos = { [hub]: { x: cx, y: cy } }, seen = new Set([hub]);
  for (const q = [hub]; q.length;) for (const n of adj[q.shift()]) if (!seen.has(n)) { seen.add(n); q.push(n); }
  const dirs = [[0, -1], [0, 1], [1, 0], [-1, 0]];
  adj[hub].forEach((n, i) => {
    const [dx, dy] = dirs[i % 4];
    pos[n] = { x: cx + dx * 130, y: cy + dy * 92 };
    adj[n].filter((m) => !pos[m]).forEach((m) => { pos[m] = { x: cx + dx * 250, y: cy + dy * 172 }; });
  });
  const comps = [];
  for (const k of keys) { if (seen.has(k)) continue; const c = [k]; seen.add(k); for (let i = 0; i < c.length; i++) for (const n of adj[c[i]]) if (!seen.has(n)) { seen.add(n); c.push(n); } comps.push(c); }
  const left = comps.filter((_, i) => i % 2 === 0), right = comps.filter((_, i) => i % 2 === 1);
  const rows = (n, avoid) => { const ys = []; for (let i = 0; i < n; i++) ys.push(40 + (i * (H - 80)) / Math.max(1, n - 1)); return avoid ? ys.map((y) => (Math.abs(y - cy) < 40 ? y + (y < cy ? -45 : 45) : y)) : ys; };
  const place = (list, side) => rows(list.length, true).forEach((y, i) => {
    const [inner, outer] = list[i]; const edge = side < 0 ? cx - 90 : cx + 90;
    const xi = edge + side * wOf(inner) / 2; pos[inner] = { x: xi, y };
    if (outer) pos[outer] = { x: xi + side * (wOf(inner) / 2 + GAP + wOf(outer) / 2), y };
  });
  place(left, -1); place(right, 1);
  return { W, H, adj, pos };
}
function netInsights(adj) {
  const hub = Object.keys(adj).filter((k) => !k.startsWith("m:")).sort((x, y) => adj[y].length - adj[x].length)[0];
  const hubSyn = SYNERGIES.filter((s) => s.a === hub || s.b === hub);
  const boost = SYNERGIES.filter((s) => s.kind === "boost").length, block = SYNERGIES.length - boost;
  const ext = SYNERGIES.filter((s) => !s.b && s.mate);
  return [
    { type: "עובדה", t: `**${SYNERGIES.length}** צירופים: ==**${boost}** מעצימים ו-**${block}** מחלישים.== מחליש הוא מידע באותה מידה כמו מעצים.` },
    { type: "פרשנות", t: `**${byId(hub).he}** הם הצומת העמוס, ב-**${hubSyn.length}** צירופים: ==מה שותים לידם חשוב כמו מה אוכלים איתם.==` },
    { type: "פרשנות", t: `ב-**${ext.length}** צירופים השותף אינו מזון מהגלריה: ==גם זמן, בישול ומשקה הם חלק מהצירוף.==` }
  ];
}
function netHTML() {
  const { W, H, adj, pos } = netNodes();
  const sel = state.syn;
  const edges = SYNERGIES.map((s) => { const a = pos[nodeKey(s, "a")], b = pos[nodeKey(s, "b")];
    return `<g class="ne ${s.kind} ${sel === s.id ? "on" : ""}" data-syn="${s.id}" tabindex="0" role="button" aria-label="${esc(s.title)}"><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="ne-hit"/><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="ne-l"/></g>`; }).join("");
  const nodes = Object.entries(pos).map(([k, p]) => { const ext = k.startsWith("m:"); const lab = nodeLabel(k); const w = Math.max(44, lab.length * 9 + 18);
    return `<g class="nn ${ext ? "ext" : ""}" data-node="${esc(k)}" tabindex="0" role="button" transform="translate(${p.x},${p.y})"><rect x="${-w / 2}" y="-13" width="${w}" height="26"/><text y="5">${esc(lab)}</text>${adj[k].length > 1 ? `<circle cx="${w / 2}" cy="-13" r="9"/><text class="nn-n" x="${w / 2}" y="-9">${adj[k].length}</text>` : ""}</g>`; }).join("");
  return `<div class="net-box">
    <ol class="insights net-ins">${netInsights(adj).map((x) => `<li><span class="label">${x.type}</span> ${rich(x.t)}</li>`).join("")}</ol>
    <div class="net-list" role="list">${SYNERGIES.map((s) => `<button class="net-row ${s.kind} ${sel === s.id ? "on" : ""}" data-syn="${s.id}" role="listitem"><b>${esc(nodeLabel(nodeKey(s, "a")))}</b><i></i><b>${esc(nodeLabel(nodeKey(s, "b")))}</b></button>`).join("")}</div>
    <svg class="net" viewBox="0 0 ${W} ${H}" role="img" aria-label="רשת הצירופים">${edges}${nodes}</svg>
    <p class="hint net-legend"><span class="lg boost"></span>מעצים <span class="lg block"></span>מחליש <span class="lg ext"></span>שותף שאינו בגלריה · לחיצה על קו או על מזון פותחת את המנגנון</p>
  </div>`;
}
function synSheetHTML() {
  const node = state.node, list = node ? SYNERGIES.filter((s) => nodeKey(s, "a") === node || nodeKey(s, "b") === node) : SYNERGIES.filter((s) => s.id === state.syn);
  if (!list.length) return `<div class="panel-body" style="display:grid;place-items:center;height:100%;color:var(--ink-soft);text-align:center">${rich("**לחצו על קו** כדי לראות למה הצירוף עובד,<br>ובאיזו מנה הוא קורה.")}</div>`;
  const head = node ? nodeLabel(node) : list[0].title;
  return `<div class="panel-head"><div style="min-width:0"><span class="label">${node ? "מזון ברשת" : "צירוף"}</span><h2 class="sheet-name" id="r-title">${esc(head)}</h2></div><div class="ops">${iconBtn("x", "סגירה", "data-net-close")}</div></div>
    <div class="panel-body scroll-in" style="flex:1">${list.map((s) => `<div class="syn ${s.kind}"><b class="syn-t">${s.kind === "boost" ? "מעצים" : "מחליש"} · ${esc(s.title)}</b><p>${rich(s.how)}</p><p class="syn-dish"><span class="tile-l">בצלחת</span>${rich(s.suggest)}</p>
      ${s.dishes.length ? `<div class="chips" style="margin-top:6px">${s.dishes.map((d) => { const r = RECIPES.find((x) => x.id === d); return r ? `<button class="chip" data-open-recipe="${r.id}">${esc(r.he)}</button>` : ""; }).join("")}</div>` : ""}
      <p class="hint" style="margin-top:4px">עוצמת ראיה: <b>${esc(s.ev)}</b></p></div>`).join("")}
      ${node && !node.startsWith("m:") ? `<p style="margin-top:10px"><a class="btn press" href="#/foods?id=${node}">לגיליון של ${esc(nodeLabel(node))} ←</a></p>` : ""}
    </div>`;
}

function render() {
  root.querySelectorAll("[data-v]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === state.v)));
  root.querySelector("#r-filters").hidden = state.v === "net";
  if (state.v === "net") {
    root.querySelector("#r-list").classList.add("is-net");
    root.querySelector("#r-list").innerHTML = netHTML();
    root.querySelector("#r-year").innerHTML = "";
    root.querySelector("#r-hits").innerHTML = `<bdi class="num">${SYNERGIES.length}</bdi> צירופים`;
    root.querySelector("#r-sheet").innerHTML = synSheetHTML();
    return;
  }
  const L = list();
  root.querySelector("#r-list").classList.remove("is-net");
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
  state = { id: params.id || null, food: byId(params.food) ? params.food : null, season: params.season === "1", v: params.v === "net" ? "net" : "list", syn: params.syn || null, node: null };
  if (!state.id) state.id = list()[0]?.id || null;
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="rl-title">
      <div class="gallery-tools">
        <div><h1 class="view-title" id="rl-title">צירופים מעצימים</h1><p class="view-sub">${rich("מתכון הוא **צירוף**: מזון אחד מפעיל איכות של אחר. ==ויטמין C פותח ברזל, פלפל פותח כורכום, שמן ובישול פותחים ליקופן.==")}</p></div>
        <span class="src" id="r-hits" aria-live="polite"></span>
      </div>
      <div class="gallery-tools" style="padding-top:4px;padding-bottom:6px"><div class="chips" role="group" aria-label="תצוגה"><button class="chip" data-v="list">מתכונים</button><button class="chip" data-v="net">רשת הצירופים</button></div><div class="chips" id="r-filters"><button class="chip" id="f-season" data-season>מתאים לעונה עכשיו</button><span id="f-food"></span></div></div>
      <div class="scroll-in gallery-box" style="flex:1"><div class="recipe-grid" id="r-list"></div><div id="r-year" class="r-year-box"></div></div>
    </section>
    <aside class="panel" id="r-sheet" aria-labelledby="r-title"></aside>
  </div>`;
  render();
  const pickNet = (el) => {
    if (el.dataset.syn) { state.syn = el.dataset.syn; state.node = null; } else { state.node = el.dataset.node; state.syn = null; }
    patch({ syn: state.syn || undefined }); render();
    if (matchMedia("(max-width: 920px)").matches) root.querySelector("#r-sheet").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };
  root.addEventListener("keydown", (e) => { const el = e.target.closest?.("[data-syn], [data-node]"); if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pickNet(el); } });
  root.addEventListener("click", (e) => {
    const vb = e.target.closest("[data-v]"); if (vb) { state.v = vb.dataset.v; patch({ v: state.v === "net" ? "net" : undefined, syn: undefined }); state.syn = null; state.node = null; return render(); }
    const ne = e.target.closest("[data-syn], [data-node]"); if (ne) return pickNet(ne);
    const orr = e.target.closest("[data-open-recipe]"); if (orr) { state.v = "list"; state.food = null; state.season = false; state.id = orr.dataset.openRecipe; patch({ v: undefined, syn: undefined, food: undefined, season: undefined, id: state.id }); return render(); }
    if (e.target.closest("[data-net-close]")) { state.syn = null; state.node = null; patch({ syn: undefined }); return render(); }
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
  const v = params.v === "net" ? "net" : "list";
  if (v !== state.v || (params.syn || null) !== state.syn) { state.v = v; state.syn = params.syn || null; state.node = null; return render(); }
  const food = byId(params.food) ? params.food : null;
  if (food !== state.food) { state.food = food; render(); }
  if ((params.id || null) !== state.id && params.id) select(params.id);
}
