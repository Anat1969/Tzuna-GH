// דף הבית: חזון, כלים ותוצאות במבט אחד.
// שכבות (הדגמה ומבחן דקה), "היום במטבח" (עונה, צירוף ומנה של החודש), גילוי היום, ושש דלתות עם צילום.
import { FOODS, byId } from "../data/foods.js";
import { rich, stratum, LAYERS, esc, MONTHS, nowMonth } from "../ui.js";
import * as store from "../store.js";
import { RECIPES } from "../data/recipes.js";
import { SYNERGIES } from "../data/synergies.js";
import { DISCOVERIES } from "../data/discoveries.js";
import { METHOD_INSIGHTS } from "../data/methods.js";
import { discoveries as nutrientDisc } from "./nutrients.js";

// מאגר גילויים מכל האפליקציה, בסדר אקראי בכל ביקור: זוגות, שיטות, רכיבים וחלקי צמח.
function discPool() {
  const all = [
    ...DISCOVERIES.map((d) => ({ title: d.title, t: d.t, type: d.type, href: `#/compare?a=${d.pair[0]}&b=${d.pair[1]}` })),
    ...METHOD_INSIGHTS.map((x) => ({ title: "שיטות מכל העולם", t: x.t, type: "פרשנות", href: "#/methods?t=disc" })),
    ...nutrientDisc().map((x) => ({ title: x.n.he, t: x.t, type: "עובדה", href: `#/nutrients?n=${x.n.id}` })),
    ...PARTS.filter((p) => p.note).map((p) => ({ title: `צמח וגוף: ${p.he}`, t: p.note, type: "עובדה", href: `#/plant?p=${p.id}` }))
  ];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all;
}
let POOLD = [];
import { METHODS } from "../data/methods.js";
import { PARTS } from "../data/plant.js";
import { PHOTOS } from "../data/photos.js";
import { foodImage } from "./foods.js";

export const title = "";

const EXPLAIN = {
  known: "**ידוע** נשען על מחקר. גם אז, עוצמת הראיה משתנה: כאן היא **בינונית**.",
  said: "**נאמר** לא מוכיח דבר על הגוף. הוא מספר מה **תרבות** ראתה בזית.",
  believed: "**מאמינים** מוצג בכבוד ובלי המלצה. אף אחד ==עוד לא בדק=="
};

// כל הטענות בדאטה, לבחינה עצמית.
const POOL = FOODS.flatMap((f) => LAYERS.flatMap((l) => f.layers[l.key].map((x) => ({ food: f.he, key: l.key, t: x.t }))));

// היום במטבח: מזונות בעונה, צירוף מעצים שאחד ממזונותיו בעונה, ומנה שמתאימה לחודש.
function today() {
  const m = nowMonth();
  const inSeason = FOODS.filter((f) => f.months.includes(m));
  const ids = new Set(inSeason.map((f) => f.id));
  const syn0 = SYNERGIES.find((s) => s.kind === "boost" && (ids.has(s.a) || ids.has(s.b))) || SYNERGIES[0];
  const dish = RECIPES.find((r) => r.months.includes(m) && r.foods.some((id) => ids.has(id))) || RECIPES.find((r) => !r.months.length);
  const boosts = SYNERGIES.filter((s) => s.kind === "boost" && (ids.has(s.a) || ids.has(s.b)));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const block = SYNERGIES.find((s) => s.kind === "block" && (ids.has(s.a) || ids.has(s.b))) || SYNERGIES.find((s) => s.kind === "block");
  const syn = boosts.length ? pick(boosts) : syn0;
  POOLD = discPool();
  const withPh = inSeason.filter((f) => PHOTOS[f.id]);
  const hero = withPh.length ? pick(withPh) : byId("olive");
  return { m, inSeason, syn, block, dish, start: 0, disc: POOLD[0], hero };
}

// כל מספר בדלת מגיע עם משפט שאומר מה הוא מלמד.
function doorLines(t) {
  const high = FOODS.filter((f) => f.layers.known.some((x) => x.ev === "גבוהה")).length;
  const fs = new Set(PARTS.filter((p) => p.id === "fruit" || p.id === "seed").flatMap((p) => p.foods));
  const byM = MONTHS.map((_, i) => FOODS.filter((f) => f.months.includes(i + 1)).length);
  const peak = byM.indexOf(Math.max(...byM));
  const block = SYNERGIES.filter((s) => s.kind === "block").length;
  const facts = DISCOVERIES.filter((d) => d.type === "עובדה").length;
  return {
    foods: `**${high}** עם ראיה גבוהה. ==השאר נשען על מסורת.==`,
    plant: `**${fs.size}** מהם פרי או זרע: ==מה שהצמח שומר לדור הבא.==`,
    methods: `**${METHODS.filter((m) => m.from < 1800).length}** קדמו למדע, ==ורובן מחפשות איזון.==`,
    seasons: peak + 1 === t.m ? `==עכשיו שיא השנה.==` : `ב${MONTHS[peak]} **${byM[peak]}**, ==${byM[peak] >= t.inSeason.length * 3 ? "פי שלושה ויותר מעכשיו" : byM[peak] >= t.inSeason.length * 2 ? "יותר מכפול מעכשיו" : "קרוב לעכשיו"}.==`,
    recipes: `ועוד **${block}** שלא לשלב. ==מחליש הוא מידע.==`,
    compare: `**${facts}** עובדות ו-**${DISCOVERIES.length - facts}** פרשנויות, ==מסומנות.==`
  };
}

const door = (href, label, title, n, unit, photoId, line) => {
  const ph = PHOTOS[photoId];
  return `<a class="hdoor press" href="${href}">
    <span class="hd-img">${ph ? `<img src="${ph.src}" alt="" loading="lazy">` : ""}</span>
    <span class="hd-cap"><span class="label">${label}</span><b>${title}</b><span class="hd-n"><bdi class="num">${n}</bdi> ${unit}</span><span class="hd-line">${rich(line)}</span></span>
  </a>`;
};

const discInner = (d, i) => `<span class="tile-l">גילוי · <bdi class="num">${i + 1}/${POOLD.length}</bdi> · ${esc(d.type)}</span><b>${esc(d.title)}</b><span>${rich(d.t)}</span>`;
let timer = null;

export function mount(root) {
  clearInterval(timer);
  const olive = byId("olive");
  const quiz = store.get("quiz", { right: 0, total: 0 });
  const t = today();
  const synCount = SYNERGIES.filter((s) => s.kind === "boost").length;
  const L = doorLines(t);
  root.innerHTML = `<div class="view-in home2">
    <section class="h-lead">
      <div class="h-bg" aria-hidden="true" style="background-image:url('${(PHOTOS[t.hero.id] || PHOTOS.olive).src}')"></div>
      <a class="h-orb" href="#/foods?id=${t.hero.id}" aria-label="${esc(t.hero.he)}, לגיליון"><span class="h-orb-ring"></span>${foodImage(t.hero)}<span class="h-orb-tag"><span>בעונה עכשיו</span><b>${esc(t.hero.he)}</b></span></a>
      <div class="rise h-copy">
        <div class="kicker">מזון, גוף ונפש · הכרה, הבנה ושימוש</div>
        <h1 class="headline" style="margin-top:6px">כל מזון בשלוש שכבות, <span class="k">וכל ארוחה צירוף</span>.</h1>
        <p class="lede"><span>${rich("**ידוע, נאמר ומאמינים**: מאיזו שכבה מגיעה הטענה.")}</span><span>${rich("==ואז: עם מה המזון מתעצם, ולמה.==")}</span></p>
      </div>
      <div class="demo rise" id="demo" style="animation-delay:.12s">
        <div class="demo-head">
          <span class="demo-q" id="demo-q">דוגמה: שמן זית. לחצו על שכבה.</span>
          <span class="chips" role="group" aria-label="מצב">
            <button class="chip" aria-pressed="true" data-mode="demo">דוגמה</button>
            <button class="chip" aria-pressed="false" data-mode="quiz">מבחן דקה</button>
          </span>
        </div>
        <div id="demo-body"></div>
        <p class="demo-explain lines" id="demo-explain" aria-live="polite"></p>
      </div>
    </section>
    <section class="h-today rise" style="animation-delay:.06s" aria-labelledby="today-h">
      <div class="sec-h" style="margin:0 0 8px"><h2 id="today-h" class="ht-title">היום במטבח · ${MONTHS[t.m - 1]}</h2><span class="label"><bdi class="num">${t.inSeason.length}</bdi> בעונה</span></div>
      <div class="ht-strip">${t.inSeason.slice(0, 6).map((f) => `<a class="ht-food" href="#/foods?id=${f.id}"><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></a>`).join("")}</div>
      <a class="syn boost ht-syn" href="#/recipes${t.syn.dishes[0] ? "?id=" + t.syn.dishes[0] : ""}"><b class="syn-t">צירוף מעצים · ${esc(t.syn.title)}</b><p>${rich(t.syn.how)}</p><p class="syn-dish"><span class="tile-l">בצלחת</span>${rich(t.syn.suggest)}</p></a>
      <a class="syn block ht-syn" href="#/foods?id=${t.block.a}"><b class="syn-t">לא לשלב · ${esc(t.block.title)}</b><p>${rich(t.block.how)}</p></a>
      ${t.dish ? `<a class="ht-dish press" href="#/recipes?id=${t.dish.id}"><span class="tile-l">מנה לחודש</span><b>${esc(t.dish.he)}</b><span class="hint">${esc(t.dish.time)} · ${t.dish.steps.length} שלבים</span></a>` : ""}
      <a class="ht-disc" id="ht-disc" href="${t.disc.href}" aria-live="polite">${discInner(t.disc, t.start)}</a>
    </section>
    <nav class="h-doors" aria-label="מפת האפליקציה">
      ${door("#/foods", "הכר", "מזון", FOODS.length, "מזונות", "pomegranate", L.foods)}
      ${door("#/plant", "הבן", "צמח וגוף", PARTS.length, "חלקים", "chard", L.plant)}
      ${door("#/methods", "הבן", "שיטות", METHODS.length, "שיטות", "olive", L.methods)}
      ${door("#/seasons", "השתמש", "עונות", t.inSeason.length, "בעונה עכשיו", "watermelon", L.seasons)}
      ${door("#/recipes?v=net", "השתמש", "צירופים", synCount, "צירופים מעצימים", "lentil", L.recipes)}
      ${door("#/compare", "גלה", "השוואה", DISCOVERIES.length, "גילויים", "fig", L.compare)}
    </nav>
  </div>`;

  const body = root.querySelector("#demo-body");
  const explain = root.querySelector("#demo-explain");
  const demoQ = root.querySelector("#demo-q");
  const demo = root.querySelector("#demo");

  function showDemo() {
    demo.classList.remove("has-on");
    demoQ.textContent = "דוגמה: שמן זית. לחצו על שכבה.";
    body.innerHTML = LAYERS.map((l) => stratum(l.key, [olive.layers[l.key][0]]).replace("class=\"stratum", `data-k="${l.key}" tabindex="0" role="button" class="stratum`)).join("");
    explain.innerHTML = `<span>${rich("שלוש טענות על **אותו מזון**, ושלוש רמות של ודאות.")}</span>`;
    body.querySelectorAll("[data-k]").forEach((s) => {
      const pick = () => {
        body.querySelectorAll("[data-k]").forEach((x) => x.classList.toggle("is-on", x === s));
        demo.classList.add("has-on");
        explain.innerHTML = `<span>${rich(EXPLAIN[s.dataset.k])}</span>`;
      };
      s.addEventListener("click", pick);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
  }

  let score = quiz;
  function showQuiz() {
    demo.classList.remove("has-on");
    const item = POOL[Math.floor(Math.random() * POOL.length)];
    demoQ.textContent = `${item.food}: לאיזו שכבה שייכת הטענה?`;
    body.innerHTML = `<div class="stratum" style="border-right:4px solid var(--ink);background:#fff;box-shadow:var(--shadow-1)"><div class="st-text">${rich(item.t.replace(/\*\*/g, ""))}</div></div>
      <div class="chips" style="margin-top:8px;gap:8px" role="group" aria-label="תשובה">${LAYERS.map((l) => `<button class="press btn" data-a="${l.key}"><i class="layer-mark lm-${l.key}" style="width:16px;margin-inline-end:6px"></i>${l.he}</button>`).join("")}</div>`;
    explain.innerHTML = `<span class="src">${score.total ? `עד עכשיו: <bdi class="num">${score.right}</bdi> מתוך <bdi class="num">${score.total}</bdi>. נשמר במכשיר בלבד.` : "שאלה אחת בכל פעם. אין ציון לגוף, רק לקריאה."}</span>`;
    body.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
      const ok = b.dataset.a === item.key;
      score = { right: score.right + (ok ? 1 : 0), total: score.total + 1 };
      store.set("quiz", score);
      const L = LAYERS.find((l) => l.key === item.key);
      body.querySelectorAll("[data-a]").forEach((x) => { x.disabled = true; if (x.dataset.a === item.key) x.setAttribute("aria-pressed", "true"); });
      explain.innerHTML = `<span>${rich(ok ? "**נכון.**" : "**לא בדיוק.**")} זו שכבת <b>${L.he}</b>: ${esc(L.what)}</span><span><button class="press btn" id="next-q" style="margin-top:6px">עוד טענה</button> <span class="src"><bdi class="num">${score.right}</bdi> מתוך <bdi class="num">${score.total}</bdi></span></span>`;
      explain.querySelector("#next-q").addEventListener("click", showQuiz);
    }));
  }

  root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    (b.dataset.mode === "quiz" ? showQuiz : showDemo)();
  }));
  showDemo();

  // דף בית מתחלף: הגילוי מתחיל ממקום אקראי ומתחלף כל 9 שניות. עוצר בריחוף ובהפחתת תנועה.
  const discEl = root.querySelector("#ht-disc");
  let i = t.start, hold = false;
  discEl.addEventListener("mouseenter", () => { hold = true; });
  discEl.addEventListener("mouseleave", () => { hold = false; });
  discEl.addEventListener("focus", () => { hold = true; });
  discEl.addEventListener("blur", () => { hold = false; });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => {
    if (!discEl.isConnected) return clearInterval(timer);
    if (hold || document.hidden) return;
    i = (i + 1) % POOLD.length; const d = POOLD[i];
    discEl.classList.add("swap");
    setTimeout(() => { discEl.href = d.href; discEl.innerHTML = discInner(d, i); discEl.classList.remove("swap"); }, 250);
  }, 9000);
}
