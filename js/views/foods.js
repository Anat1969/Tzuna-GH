// מזון: גלריה של צילומים (מוקד) וגיליון פריט (טור צד).
// גיליון: ייחודיות, גוף, נפש, עם מה כן ולא, שלוש שכבות ושימוש. המקורות מקופלים בתחתית, במקום אחד.
import { FOODS, CATEGORIES, ALLERGENS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { PHOTOS } from "../data/photos.js";
import { rich, stratum, LAYERS, esc, iconBtn, MONTHS, MONTHS_SHORT, nowMonth, sourcesBox } from "../ui.js";
import { plate } from "../plates.js";
import { patch } from "../route.js";
import { recipesWith, RECIPES } from "../data/recipes.js";
import { SCIENCE } from "../data/science.js";
import { synergiesFor } from "../data/synergies.js";
import { evMeter } from "../ui.js";

export const title = "מזון";

let root, state;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.he || "";

// תמונה: צילום כשיש, ואחרת איור הרבריום.
export function foodImage(f, { big = false } = {}) {
  const p = PHOTOS[f.id];
  // בלי צילום נכון: כרטיס טיפוגרפי, לא איור (חור עדיף על תמונה מטעה, ואיור נראה ילדותי).
  if (!p) return `<span class="type-card" role="img" aria-label="${esc(f.he)}"><b>${esc(f.he)}</b><i>${esc(f.la)}</i></span>`;
  return `<img src="${p.src}" alt="${esc(f.he)}" loading="${big ? "eager" : "lazy"}" decoding="async" width="${p.w || 640}" height="${p.h || 480}">`;
}
export const photoCredit = (f) => { const p = PHOTOS[f.id]; return p ? `<span class="credit">${esc(p.credit)} · ${esc(p.license)}</span>` : ""; };

// חיפוש עברי: התאמה בתחילת מילה אחרי אותיות שימוש. מילה עד 3 אותיות חייבת להיות שלמה.
function matcher(q) {
  const t = q.trim().toLowerCase().replace(/[^֐-׿a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  const words = t.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const res = words.map((w) => w.length <= 3
    ? new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}($|[^\\u0590-\\u05FFa-z])`, "i")
    : new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}`, "i"));
  return (f) => {
    const pr = PROFILES[f.id] || {};
    const hay = [f.he, f.en, f.la, f.family, f.family_la, f.part, catName(f.cat), f.recognize.t, f.use.t, pr.unique, pr.body?.t, pr.soul?.t,
      ...(pr.with || []).map((x) => x.t), ...(pr.without || []).map((x) => x.t),
      ...LAYERS.flatMap((l) => f.layers[l.key].map((x) => `${x.t} ${x.trad || ""} ${x.ref || ""}`))].join(" ").replace(/\*\*|==/g, "").toLowerCase();
    return res.every((r) => r.test(hay));
  };
}

const visible = () => FOODS.filter((f) => !state.cats.length || state.cats.includes(f.cat));

function chipsHTML() {
  const all = `<span class="chip-wrap"><button class="chip" data-cat="" aria-pressed="${!state.cats.length}">הכול<span class="count">${FOODS.length}</span></button></span>`;
  return all + CATEGORIES.map((c) => {
    const on = state.cats.includes(c.id);
    const n = FOODS.filter((f) => f.cat === c.id).length;
    const add = state.cats.length && !on ? `<button class="chip-add" data-add="${c.id}" title="הוספה לבחירה" aria-label="הוספת ${c.he} לבחירה">+</button>` : "";
    const rem = on && state.cats.length > 1 ? `<button class="chip-add" data-rem="${c.id}" title="הסרה מהבחירה" aria-label="הסרת ${c.he} מהבחירה" style="opacity:1">−</button>` : "";
    return `<span class="chip-wrap"><button class="chip" data-cat="${c.id}" aria-pressed="${on}">${c.he}<span class="count">${n}</span></button>${add}${rem}</span>`;
  }).join("");
}

function cardHTML(f) {
  const marks = LAYERS.map((l) => `<i class="layer-mark lm-${l.key} ${f.layers[l.key].length ? "" : "off"}" title="${l.he}: ${f.layers[l.key].length}"></i>`).join("");
  return `<button class="food-card press ${PHOTOS[f.id] ? "has-photo" : ""}" data-id="${f.id}" aria-pressed="${state.id === f.id}" aria-label="${esc(f.he)}">
    <span class="thumb">${foodImage(f)}</span>
    <span class="cap"><b>${esc(f.he)}</b><span class="latin">${esc(f.la)}</span><span class="marks">${marks}</span></span>
  </button>`;
}

function monthsBar(f) {
  const now = nowMonth();
  return `<div class="months" aria-label="עונה">${MONTHS.map((m, i) => `<i class="${f.months.includes(i + 1) ? "on" : ""} ${i + 1 === now ? "now" : ""}" title="${m}${f.months.includes(i + 1) ? ": " + esc(f.season_kind) : ""}"></i>`).join("")}</div>
    <div class="months-l">${MONTHS_SHORT.map((m) => `<span>${m}</span>`).join("")}</div>`;
}

// מדע, צירופים מעצימים ומעשה: החלק שעונה על "למה זה חשוב, ועם מה, ולמה".
function scienceHTML(f) {
  const sc = SCIENCE[f.id];
  const syn = synergiesFor(f.id);
  const dish = (id) => RECIPES.find((r) => r.id === id);
  return `${sc ? `<section class="sec sci"><div class="sec-h"><h3>למה זה חשוב</h3><span class="label">מה המדע מצא</span></div>
      <p class="why">${rich(sc.why)}</p>
      ${sc.studied.map((x) => `<div class="found"><p>${rich(x.t)}</p>${evMeter(x.ev)}</div>`).join("")}
    </section>` : ""}
    ${syn.length ? `<section class="sec"><div class="sec-h"><h3>צירופים מעצימים</h3><span class="label">מה מפעיל את מה, ולמה</span></div>
      ${syn.map((x) => `<div class="syn ${x.kind}"><b class="syn-t">${x.kind === "boost" ? "מעצים" : "מחליש"} · ${esc(x.title)}</b><p>${rich(x.how)}</p>
        <p class="syn-dish"><span class="tile-l">בצלחת</span>${rich(x.suggest)}${x.dishes.length ? " " + x.dishes.map((d) => dish(d)).filter(Boolean).map((r) => `<a href="#/recipes?id=${r.id}">${esc(r.he)}</a>`).join(" · ") : ""}</p></div>`).join("")}
    </section>` : ""}
    ${sc ? `<section class="sec"><div class="sec-h"><h3>מעשי</h3><span class="label">בחירה, אחסון והכנה</span></div>
      <ul class="practical">${sc.practical.map((t) => `<li>${rich(t)}</li>`).join("")}</ul></section>` : ""}`;
}

const tile = (label, cls, body) => `<div class="tile ${cls}"><span class="tile-l">${label}</span>${body}</div>`;

function sheetHTML(f) {
  const list = visible();
  const idx = list.findIndex((x) => x.id === f.id);
  const pr = PROFILES[f.id] || {};
  const lines = (arr) => arr.map((x) => `<p>${rich(x.t)}</p>`).join("");
  const meal = f.meal ? `<dt>ארוחה</dt><dd>${rich(f.meal === "before" ? "**קודם** הארוחה, לפי הרמב\"ם" : "**תכף אחרי** הארוחה, לפי הרמב\"ם")}</dd>` : "";
  const allergens = f.allergens.length ? `<dt>אלרגנים</dt><dd><b>${esc(f.allergens.map((a) => ALLERGENS[a]).join(", "))}</b></dd>` : "";
  const recs = recipesWith(f.id);
  const months = f.months.length ? `${monthsBar(f)}<p class="hint">${esc(f.season_kind)}: <b>${esc(f.months.map((m) => MONTHS[m - 1]).join(", "))}</b></p>` : `<p style="font-size:14px">${rich("**כל השנה**, ביבוא.")}</p>`;
  const srcIds = [...(SCIENCE[f.id]?.studied || []).map((x) => x.src), ...synergiesFor(f.id).map((x) => x.src), f.recognize.src, f.use.src, pr.body?.src, pr.soul?.src, ...(pr.with || []).map((x) => x.src), ...(pr.without || []).map((x) => x.src),
    ...LAYERS.flatMap((l) => f.layers[l.key].map((x) => x.src)), "season-est"];
  return `<div class="sheet-hero">${foodImage(f, { big: true })}${photoCredit(f)}
      <div class="ops on-photo">${iconBtn("prev", "הקודם", `data-step="-1" ${idx <= 0 ? "disabled" : ""}`)}<span class="pos"><bdi class="num" style="font-weight:400">${idx + 1}/${list.length}</bdi></span>${iconBtn("next", "הבא", `data-step="1" ${idx >= list.length - 1 ? "disabled" : ""}`)}${iconBtn("x", "סגירה", "data-close")}</div>
    </div>
    <div class="panel-body scroll-in" style="flex:1">
      <h2 class="sheet-name" id="sheet-title">${esc(f.he)} <span class="latin">${esc(f.la)}</span></h2>
      <div class="sheet-tags"><span>${esc(catName(f.cat))}</span><span>משפחת ה<b>${esc(f.family)}</b></span><span>נאכל: <b>${esc(f.part)}</b></span></div>
      ${pr.unique ? `<p class="unique">${rich(pr.unique)}</p>` : ""}
      <div class="tiles">
        ${pr.body ? tile("לגוף", "t-body", `<p>${rich(pr.body.t)}</p>`) : ""}
        ${pr.soul ? tile("לנפש", "t-soul", `<p>${rich(pr.soul.t)}</p>`) : ""}
        ${pr.with?.length ? tile("הולך עם", "t-with", lines(pr.with)) : ""}
        ${pr.without?.length ? tile("לא הולך עם", "t-without", lines(pr.without)) : ""}
      </div>
      ${scienceHTML(f)}
      <section class="sec"><div class="sec-h"><h3>מה ידוע, מה נאמר, במה מאמינים</h3></div>
        ${LAYERS.map((l) => stratum(l.key, f.layers[l.key])).join("")}
      </section>
      <section class="sec"><div class="sec-h"><h3>הכרה ושימוש</h3></div>
        <dl class="row-kv"><dt>מבנה</dt><dd>${rich(f.recognize.t)}</dd><dt>במטבח</dt><dd>${rich(f.use.t)}</dd>${meal}${allergens}</dl>
        <div style="margin-top:10px">${months}</div>
        ${recs.length ? `<div style="margin-top:10px"><span class="label">מתכונים</span><div class="recipe-links" style="margin-top:4px">${recs.map((r) => `<a class="press btn" style="text-decoration:none;padding:6px 12px;font-size:13px" href="#/recipes?id=${r.id}">${esc(r.he)}</a>`).join("")}</div></div>` : ""}
      </section>
      ${sourcesBox(srcIds)}
    </div>`;
}

function renderGallery() {
  root.querySelector("#gallery").innerHTML = visible().map(cardHTML).join("");
  root.querySelector("#chips").innerHTML = chipsHTML();
  applySearch();
}

function renderSheet({ scroll = false } = {}) {
  const aside = root.querySelector("#sheet");
  const f = byId(state.id);
  if (!f) {
    aside.innerHTML = `<div class="panel-body" style="display:grid;place-items:center;height:100%;text-align:center;color:var(--ink-soft)"><p>${rich("**בחרו מזון** מהגלריה.")}</p></div>`;
    return;
  }
  aside.innerHTML = sheetHTML(f);
  root.querySelectorAll(".food-card").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.id === state.id)));
  if (scroll) aside.querySelector(".scroll-in")?.scrollTo(0, 0);
}

function select(id, opts) {
  state.id = id;
  patch({ id: id || undefined });
  renderSheet(opts);
}

let applySearch = () => {};
export function search(text) {
  state.q = text;
  patch({ q: text || undefined });
  applySearch();
}

export function mount(el, params, ctx) {
  root = el;
  state = {
    id: params.id || null,
    cats: (params.cat || "").split(",").filter((c) => CATEGORIES.some((x) => x.id === c)),
    q: params.q || ctx.query || ""
  };
  const qInput = document.querySelector("#q");
  if (state.q && qInput && qInput.value !== state.q) qInput.value = state.q;
  if (!state.id) state.id = (visible()[0] || {}).id;

  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="g-title">
      <div class="gallery-tools">
        <div style="min-width:0"><h1 class="view-title" id="g-title">המזונות</h1><p class="view-sub">${rich("לכל מזון: **ייחודיות**, **גוף**, **נפש**, ועם מה הוא הולך.")}</p></div>
        <span class="src" id="hits" aria-live="polite"></span>
      </div>
      <div class="gallery-tools" style="padding-top:4px;padding-bottom:6px"><div class="chips" id="chips" role="group" aria-label="קטגוריות"></div></div>
      <div class="scroll-in gallery-box" style="flex:1"><div class="gallery" id="gallery"></div></div>
    </section>
    <aside class="panel sheet" id="sheet" aria-labelledby="sheet-title"></aside>
  </div>`;

  applySearch = () => {
    const m = matcher(state.q);
    let n = 0;
    root.querySelectorAll(".food-card").forEach((c) => {
      const hit = !m || m(byId(c.dataset.id));
      if (hit && m) n++;
      c.classList.toggle("dim", !!m && !hit);
      c.classList.toggle("hit", !!m && hit);
    });
    root.querySelector("#hits").innerHTML = m ? (n ? `<bdi class="num">${n}</bdi> תוצאות ל"${esc(state.q)}"` : `אין תוצאות ל"${esc(state.q)}"`) : `<bdi class="num">${visible().length}</bdi> מזונות`;
  };

  renderGallery();
  renderSheet();

  root.addEventListener("click", (e) => {
    const card = e.target.closest(".food-card");
    if (card) return select(card.dataset.id, { scroll: true });
    const chip = e.target.closest("[data-cat]");
    if (chip) {
      const c = chip.dataset.cat;
      state.cats = !c || (state.cats.length === 1 && state.cats[0] === c) ? [] : [c];
      patch({ cat: state.cats.join(",") || undefined });
      return renderGallery();
    }
    const add = e.target.closest("[data-add]");
    if (add) { state.cats = [...state.cats, add.dataset.add]; patch({ cat: state.cats.join(",") }); return renderGallery(); }
    const rem = e.target.closest("[data-rem]");
    if (rem) { state.cats = state.cats.filter((c) => c !== rem.dataset.rem); patch({ cat: state.cats.join(",") || undefined }); return renderGallery(); }
    const step = e.target.closest("[data-step]");
    if (step) {
      const list = visible(); const i = list.findIndex((x) => x.id === state.id);
      const nx = list[i + Number(step.dataset.step)];
      if (nx) select(nx.id);
      return;
    }
    if (e.target.closest("[data-close]")) return select(null);
  });

  const onKey = (e) => {
    if (e.target.closest("input, textarea, select") || document.getElementById("safety-overlay")) return;
    if (!state.id) return;
    const list = visible(); const i = list.findIndex((x) => x.id === state.id);
    if (e.key === "ArrowLeft" && list[i + 1]) select(list[i + 1].id);
    if (e.key === "ArrowRight" && list[i - 1]) select(list[i - 1].id);
    if (e.key === "Escape") select(null);
  };
  addEventListener("keydown", onKey);
  return () => removeEventListener("keydown", onKey);
}

export function update(params) {
  if ((params.id || null) !== state.id) { state.id = params.id || null; renderSheet(); }
  const cats = (params.cat || "").split(",").filter(Boolean);
  if (cats.join() !== state.cats.join()) { state.cats = cats; renderGallery(); }
  if (params.q !== undefined && params.q !== state.q) { state.q = params.q; document.querySelector("#q").value = params.q; applySearch(); }
}
