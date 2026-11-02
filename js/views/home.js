// דף הבית: מצפן. שאלה אחת (מאיזו שכבה מגיעה הטענה?), הדגמה על שמן זית, מבחן דקה, ושלוש דלתות.
import { FOODS, byId } from "../data/foods.js";
import { SOURCES } from "../data/sources.js";
import { rich, stratum, LAYERS, esc } from "../ui.js";
import { plate } from "../plates.js";
import * as store from "../store.js";
import { RECIPES } from "../data/recipes.js";
import { foodImage, photoCredit } from "./foods.js";

export const title = "";

const EXPLAIN = {
  known: "**ידוע** נשען על מחקר. גם אז, עוצמת הראיה משתנה: כאן היא **בינונית**.",
  said: "**נאמר** לא מוכיח דבר על הגוף. הוא מספר מה **תרבות** ראתה בזית.",
  believed: "**מאמינים** מוצג בכבוד ובלי המלצה. אף אחד ==עוד לא בדק==."
};

// כל הטענות בדאטה, לבחינה עצמית.
const POOL = FOODS.flatMap((f) => LAYERS.flatMap((l) => f.layers[l.key].map((x) => ({ food: f.he, key: l.key, t: x.t }))));

export function mount(root) {
  const olive = byId("olive");
  const counts = POOL.length;
  const quiz = store.get("quiz", { right: 0, total: 0 });
  root.innerHTML = `<div class="view-in home">
    <section class="home-lead">
      <div class="rise">
        <div class="kicker">מזון, צומח ותזונה · הכרה, הבנה ושימוש</div>
        <h1 class="headline" style="margin-top:6px">כל מזון בשלוש שכבות: <span class="k">ידוע</span>, <span class="s">נאמר</span>, <span class="b">מאמינים</span>.</h1>
        <p class="lede"><span>${rich("לפני שמחליטים מה לאכול, שואלים **מאיזו שכבה** מגיעה הטענה.")}</span><span>${rich("==הכרה לפני עצה.==")}</span></p>
      </div>
      <div class="tone tone-insight rise" style="animation-delay:.1s;padding:8px 12px">
        <p class="lines" style="font-size:13.5px"><span>${rich("**מחקר**, **מסורת** ו**שמועה** מגיעים לרוב באותו משפט.")}</span><span>${rich("כאן לכל טענה יש **צבע**, **קו** ו**מקור** משלה.")}</span></p>
      </div>
      <div class="demo rise" id="demo" style="animation-delay:.18s">
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
      <nav class="compass rise" style="animation-delay:.26s" aria-label="שלוש דרכים להיכנס">
        <a class="door press" href="#/foods"><span class="label">הכר</span><b>מה זה</b><span>גיליון לכל מזון: מבנה, משפחה וחתך.</span></a>
        <a class="door press" href="#/plant"><span class="label">הבן</span><b>צמח וגוף</b><span>שורש, גבעול, עלה ופרי: מה דומה בגוף.</span></a>
        <a class="door press" href="#/seasons"><span class="label">השתמש</span><b>מה מתאים</b><span>מה בעונה עכשיו, ומה נאמר עליה.</span></a>
      </nav>
    </section>
    <section class="home-art">
      <figure class="plate-big rise" style="margin:0;animation-delay:.05s">
        ${foodImage(olive, { big: true })}${photoCredit(olive)}
        <figcaption class="plate-label"><b>זית</b><span class="latin">Olea europaea</span></figcaption>
      </figure>
      <blockquote class="quote rise" style="margin:0;animation-delay:.2s">"הואיל והיות הגוף בריא ושלם מדרכי השם הוא, שהרי אי אפשר שיבין או ידע... והוא חולה."<cite>הרמב"ם, משנה תורה, הלכות דעות ד א. הגוף כתנאי להבנה.</cite></blockquote>
      <div class="kpis rise" style="animation-delay:.3s">
        <div class="kpi"><span class="num">${FOODS.length}</span><span class="label">מזונות וצמחים</span></div>
        <div class="kpi"><span class="num">${counts}</span><span class="label">טענות בשכבות</span></div>
        <div class="kpi"><span class="num">${Object.keys(SOURCES).length}</span><span class="label">מקורות</span></div>
        <div class="kpi"><span class="num">${RECIPES.length}</span><span class="label">מתכונים</span></div>
      </div>
    </section>
  </div>`;

  // אורך קו לאנימציית ציור
  root.querySelectorAll(".draw path, .draw ellipse, .draw circle").forEach((el) => el.setAttribute("pathLength", "100"));
  root.querySelector(".draw")?.style.setProperty("--len", "100");

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
      explain.innerHTML = `<span>${ok ? "**נכון.**" : "**לא בדיוק.**"} ${esc("זו שכבת")} <b>${L.he}</b>: ${esc(L.what)}</span><span><button class="press btn" id="next-q" style="margin-top:6px">עוד טענה</button> <span class="src"><bdi class="num">${score.right}</bdi> מתוך <bdi class="num">${score.total}</bdi></span></span>`;
      explain.innerHTML = explain.innerHTML.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      explain.querySelector("#next-q").addEventListener("click", showQuiz);
    }));
  }

  root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    (b.dataset.mode === "quiz" ? showQuiz : showDemo)();
  }));
  showDemo();
}
