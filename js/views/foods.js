// מזון: גלריית גיליונות (מוקד) וגיליון פריט (טור צד). הכרה, הבנה ושימוש לכל פריט.
import { FOODS, CATEGORIES, ALLERGENS, byId } from "../data/foods.js";
import { SPECIAL_GROUPS } from "../data/safety-data.js";
import { rich, stratum, LAYERS, esc, iconBtn, srcLine, MONTHS, MONTHS_SHORT, nowMonth, triangle } from "../ui.js";
import { plate } from "../plates.js";
import { patch } from "../route.js";
import * as store from "../store.js";
import { recipesWith } from "../data/recipes.js";

export const title = "מזון";

let root, state;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.he || "";

// חיפוש עברי: התאמה בתחילת מילה אחרי אותיות שימוש. מילה עד 3 אותיות חייבת להיות שלמה.
function matcher(q) {
  const t = q.trim().toLowerCase().replace(/[^֐-׿a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  const words = t.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const res = words.map((w) => w.length <= 3
    ? new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}($|[^\\u0590-\\u05FFa-z])`, "i")
    : new RegExp(`(^|[^\\u0590-\\u05FFa-z])[והשבכלמ]{0,2}${w}`, "i"));
  return (f) => {
    const hay = [f.he, f.en, f.la, f.family, f.family_la, f.part, catName(f.cat), f.recognize.t, f.use.t,
      ...LAYERS.flatMap((l) => f.layers[l.key].map((x) => `${x.t} ${x.trad || ""} ${x.ref || ""}`))].join(" ").replace(/\*\*|==/g, "").toLowerCase();
    return res.every((r) => r.test(hay));
  };
}

function visible() {
  return FOODS.filter((f) => !state.cats.length || state.cats.includes(f.cat));
}

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
  const mine = f.allergens.filter((a) => state.allergens.includes(a));
  const warn = mine.length ? `<span class="warn">${esc(mine.map((a) => ALLERGENS[a]).join(", "))}</span>` : (f.safety.flags.includes("medication_interaction") ? `<span class="warn" title="אינטראקציה עם תרופות">תרופות</span>` : "");
  return `<button class="food-card press" data-id="${f.id}" aria-pressed="${state.id === f.id}" aria-label="${esc(f.he)}">
    <span class="thumb">${plate(f)}</span>
    <span class="cap"><b>${esc(f.he)}</b><span class="latin">${esc(f.la)}</span><span class="marks">${marks}${warn}</span></span>
  </button>`;
}

function monthsBar(f) {
  const now = nowMonth();
  return `<div class="months" aria-label="עונה">${MONTHS.map((m, i) => `<i class="${f.months.includes(i + 1) ? "on" : ""} ${i + 1 === now ? "now" : ""}" title="${m}${f.months.includes(i + 1) ? ": " + esc(f.season_kind) : ""}"></i>`).join("")}</div>
    <div class="months-l">${MONTHS_SHORT.map((m) => `<span>${m}</span>`).join("")}</div>`;
}

function sheetHTML(f) {
  const list = visible();
  const idx = list.findIndex((x) => x.id === f.id);
  const meal = f.meal ? `<dt>ארוחה</dt><dd>${rich(f.meal === "before" ? "**קודם** הארוחה" : "**תכף אחרי** הארוחה")} <span class="src">לפי הרמב"ם, הלכות דעות ד ו. מסורת, לא הנחיה.</span></dd>` : "";
  const allergens = f.allergens.length ? `<dt>אלרגנים</dt><dd><b style="color:var(--red)">${esc(f.allergens.map((a) => ALLERGENS[a]).join(", "))}</b>. <span class="src">סימון לפי ${srcLine("eu-1169")}. גם זיהום צולב.</span></dd>` : `<dt>אלרגנים</dt><dd>לא מהרשימה של 14 העיקריים.</dd>`;
  const groups = f.concentrated && state.groups.length
    ? `<div class="tone tone-red" style="margin-top:8px"><h4>${esc(state.groups.map((g) => SPECIAL_GROUPS.find((x) => x.id === g)?.he).join(", "))}</h4><p>${rich("חליטה מרוכזת או תוסף: **לא מתאים בלי ייעוץ** רופא או רוקח.")}</p></div>` : "";
  const red = f.safety.redlink ? `<a href="#/redlist?id=${f.safety.redlink}" style="color:var(--red)">לרשימה האדומה</a>` : "";
  const note = f.safety.note ? `<div class="tone tone-red" style="margin-top:8px"><p>${rich(f.safety.note)} ${red}</p></div>` : "";
  const months = f.months.length ? `${monthsBar(f)}<p class="src" style="margin-top:4px">${esc(f.season_kind)} בישראל, ${esc(f.months.map((m) => MONTHS[m - 1]).join(", "))}. הערכה כללית, לא נתון.</p>` : `<p style="font-size:14px">${esc(f.season_kind)}: זמין כל השנה, לא גדל כאן בהיקף.</p>`;
  return `<div class="panel-head">
      <div class="sheet-head" style="width:100%">
        <span class="thumb">${plate(f)}</span>
        <div style="min-width:0">
          <h2 class="sheet-name" id="sheet-title">${esc(f.he)}<span class="latin">${esc(f.la)}</span></h2>
          <div class="sheet-tags"><span>${esc(catName(f.cat))}</span><span>משפחת ה<b>${esc(f.family)}</b> <span class="latin">${esc(f.family_la)}</span></span></div>
        </div>
        <div class="ops">${iconBtn("prev", "הקודם", `data-step="-1" ${idx <= 0 ? "disabled" : ""}`)}<span class="pos"><bdi class="num" style="font-weight:400">${idx + 1}/${list.length}</bdi></span>${iconBtn("next", "הבא", `data-step="1" ${idx >= list.length - 1 ? "disabled" : ""}`)}${iconBtn("x", "סגירה", "data-close")}</div>
      </div>
    </div>
    <div class="panel-body scroll-in" style="flex:1">
      <section class="sec" style="margin-top:0"><div class="sec-h"><h3>הכרה</h3><span class="label">מה זה</span></div>
        <dl class="row-kv"><dt>נאכל</dt><dd><b>${esc(f.part)}</b></dd><dt>מבנה</dt><dd>${rich(f.recognize.t)} <span class="src">${srcLine(f.recognize.src)}</span></dd></dl>
      </section>
      <section class="sec"><div class="sec-h"><h3>הבנה</h3><span class="label">מה ידוע, מה נאמר, במה מאמינים</span></div>
        ${LAYERS.map((l) => stratum(l.key, f.layers[l.key])).join("")}
      </section>
      <section class="sec"><div class="sec-h"><h3>שימוש</h3><span class="label">מתי ולמה</span></div>
        ${months}
        <dl class="row-kv" style="margin-top:8px"><dt>במטבח</dt><dd>${rich(f.use.t)}</dd>${meal}${allergens}</dl>
        ${note}${groups}
        ${recipesWith(f.id).length ? `<div style="margin-top:10px"><span class="label">מתכונים עם ${esc(f.he)}</span><div class="recipe-links" style="margin-top:4px">${recipesWith(f.id).map((r) => `<a class="press btn" style="text-decoration:none;padding:6px 12px;font-size:13px" href="#/recipes?id=${r.id}">${esc(r.he)}</a>`).join("")}</div></div>` : ""}
      </section>
      <p class="safety-line">${triangle("var(--ink-mute)")}<span>${rich("לפני שימוש בצמח, בחליטה או בתוסף: **בדקו אינטראקציה עם תרופות** אצל רוקח. האפליקציה לא מאבחנת ולא מטפלת.")}</span></p>
    </div>`;
}

function personalHTML() {
  const used = [...new Set(FOODS.flatMap((f) => f.allergens))];
  return `<div class="personal" id="personal" ${state.personalOpen ? "" : "hidden"}>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h4>סינון אישי</h4><span class="saved" id="saved" aria-live="polite"></span></div>
    <div><span class="label">אלרגנים לסימון</span><div class="chips">${used.map((a) => `<button class="chip" data-al="${a}" aria-pressed="${state.allergens.includes(a)}">${esc(ALLERGENS[a])}</button>`).join("")}</div></div>
    <div><span class="label">קבוצות שדורשות ייעוץ</span><div class="chips">${SPECIAL_GROUPS.map((g) => `<button class="chip" data-gr="${g.id}" aria-pressed="${state.groups.includes(g.id)}">${esc(g.he)}</button>`).join("")}</div></div>
    <p class="src">נשמר רק במכשיר הזה. שום פרט לא נשלח לשרת (תיקון 13 לחוק הגנת הפרטיות).</p>
  </div>`;
}

function renderGallery() {
  const g = root.querySelector("#gallery");
  g.innerHTML = visible().map(cardHTML).join("");
  root.querySelector("#chips").innerHTML = chipsHTML();
  applySearch();
}

function renderSheet({ scroll = false } = {}) {
  const aside = root.querySelector("#sheet");
  const f = byId(state.id);
  if (!f) {
    aside.innerHTML = `<div class="panel-body" style="display:grid;place-items:center;height:100%;text-align:center;color:var(--ink-soft)"><div class="lines"><span>${rich("**בחרו מזון** מהגלריה.")}</span><span class="src">כל גיליון בשלוש שכבות: הכרה, הבנה ושימוש.</span></div></div>`;
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
    q: params.q || ctx.query || "",
    allergens: store.get("allergens", []),
    groups: store.get("groups", []),
    personalOpen: false
  };
  const qInput = document.querySelector("#q");
  if (state.q && qInput && qInput.value !== state.q) qInput.value = state.q;
  if (!state.id) state.id = (visible()[0] || {}).id;

  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="g-title">
      <div class="gallery-tools">
        <div style="min-width:0"><h1 class="view-title" id="g-title">גיליונות המזון</h1><p class="view-sub" id="g-sub">כל מזון: איור, שם מדעי ושלוש שכבות. ${rich("**קו מלא** = ידוע.")}</p></div>
        <div style="display:flex;gap:6px;align-items:center">${iconBtn("sliders", "סינון אישי: אלרגנים וקבוצות", "id=\"btn-personal\" aria-expanded=\"false\"")}</div>
      </div>
      <div class="gallery-tools" style="padding-top:4px;padding-bottom:6px"><div class="chips" id="chips" role="group" aria-label="קטגוריות"></div><span class="src" id="hits" aria-live="polite"></span></div>
      ${personalHTML()}
      <div class="scroll-in gallery-box" style="flex:1"><div class="gallery" id="gallery"></div></div>
    </section>
    <aside class="panel" id="sheet" aria-labelledby="sheet-title"></aside>
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
    root.querySelector("#hits").innerHTML = m ? (n ? `<bdi class="num">${n}</bdi> תוצאות ל"${esc(state.q)}"` : `אין תוצאות ל"${esc(state.q)}". נסו שם אחר, או <a href="#/redlist">הרשימה האדומה</a>.`) : `<bdi class="num">${visible().length}</bdi> פריטים`;
  };

  renderGallery();
  renderSheet();

  const flash = () => { const s = root.querySelector("#saved"); if (s) { s.textContent = "נשמר"; clearTimeout(flash.t); flash.t = setTimeout(() => (s.textContent = ""), 1600); } };

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
    if (e.target.closest("#btn-personal")) {
      state.personalOpen = !state.personalOpen;
      root.querySelector("#personal").hidden = !state.personalOpen;
      root.querySelector("#btn-personal").setAttribute("aria-expanded", String(state.personalOpen));
      return;
    }
    const al = e.target.closest("[data-al]");
    if (al) {
      const a = al.dataset.al;
      state.allergens = state.allergens.includes(a) ? state.allergens.filter((x) => x !== a) : [...state.allergens, a];
      store.set("allergens", state.allergens); al.setAttribute("aria-pressed", String(state.allergens.includes(a)));
      flash(); renderGallery(); return renderSheet();
    }
    const gr = e.target.closest("[data-gr]");
    if (gr) {
      const g = gr.dataset.gr;
      state.groups = state.groups.includes(g) ? state.groups.filter((x) => x !== g) : [...state.groups, g];
      store.set("groups", state.groups); gr.setAttribute("aria-pressed", String(state.groups.includes(g)));
      flash(); return renderSheet();
    }
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
