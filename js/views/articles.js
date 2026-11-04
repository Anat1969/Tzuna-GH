// כתבות קומפקטיות: כל כתבה עמוד A4 אחד, מעוצב, ומודפס כמו שהוא. הכול נגזר מהדאטה.
// מבנה קבוע: כותרת, תת־כותרת, איור, שני טורים, ציטוט במירכאות ובניקוד, תובנה, ומקורות קטנים בתחתית.
import { PARTS } from "../data/plant.js";
import { FOODS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { METHODS, MATRIX } from "../data/methods.js";
import { NUTRIENTS } from "../data/nutrients.js";
import { rich, esc, srcLine, MONTHS, nowMonth } from "../ui.js";
import { overviewSVG, icon } from "../plantviz.js";
import { foodImage } from "./foods.js";
import { MONTH_HUE, SEASON_OF } from "./seasons.js";
import { patch } from "../route.js";
import { stratum } from "../ui.js";
import { SOURCES, EVIDENCE } from "../data/sources.js";

export const title = "כתבות";
let root, sel;

const sources = (f) => FOODS.filter((x) => f.re.test(PROFILES[x.id]?.body?.t || ""));
const partOf = (f) => PARTS.find((p) => p.foods.includes(f.id));
const said = (id, ref) => byId(id).layers.said.find((x) => x.ref === ref)?.t || "";

const ARTICLES = [
  {
    id: "how-we-know", kicker: "שיטה", head: "איך יודעים מה יודעים על מזון.",
    deck: "שמן זית, שלוש טענות ושלוש רמות של ודאות: **מדריך קצר** לקריאת טענה.",
    figure: () => { const o = byId("olive"); return `<div class="a4-fig a4-strata">${["known", "said", "believed"].map((k) => stratum(k, [o.layers[k][0]])).join("")}</div>`; },
    body: () => [
      "כל משפט על מזון מגיע ממקום אחר. **מחקר** מודד. **מסורת** זוכרת. **אמונה** עוברת מפה לאוזן.",
      "הבעיה היא שהשלושה מגיעים לרוב **באותו משפט**, באותו טון ובאותו שלט בשוק.",
      `לכל שכבה **צבע וקו** קבועים: רציף לידוע, נקודות לנאמר, מקווקו למאמינים. וגם בתוך "ידוע" יש **${EVIDENCE.length} מדרגות** של ראיה.`,
      "תרגיל לשוק, ב**אשדוד** או בכל עיר: בחרו שלט אחד, וסמנו כל טענה בו. רוב השלטים מערבבים את שלושתן."
    ],
    quote: () => ({ q: "\"וְיַיִן יְשַׂמַּח לְבַב־אֱנוֹשׁ לְהַצְהִיל פָּנִים מִשָּׁמֶן וְלֶחֶם לְבַב־אֱנוֹשׁ יִסְעָד\"", who: "תהלים קד טו" }),
    insight: "==ההפרדה ביניהן היא הכלי, לא התוכן.==",
    stats: () => [[3, "שכבות: ידוע, נאמר, מאמינים"], [EVIDENCE.length, "מדרגות של עוצמת ראיה"], [Object.keys(SOURCES).length, "מקורות בדאטה"]],
    haiku: ["עלה זית כסוף", "הופך את גבו לשמש", "חוסך מים לדור"],
    src: ["predimed-2018", "tanakh", "smiles-2017"]
  },
  {
    id: "plant-body", kicker: "צמח וגוף", head: "הזרע אוגר, העלה נושם.",
    deck: "שישה חלקים בכל צמח, ולכל אחד **מקבילה בתפקוד** בגוף. מה שהצמח עושה קובע מה יש בו.",
    figure: () => `<div class="a4-fig">${overviewSVG(PARTS, "seed")}</div>`,
    body: () => {
      const prot = sources(NUTRIENTS.find((n) => n.id === "protein")), k = sources(NUTRIENTS.find((n) => n.id === "vK"));
      return [
        `**השורש** סופג, **הגבעול** מוביל, **העלה** מחליף גזים. בגוף אותן משימות: **מעי**, **כלי דם**, **ריאות**.`,
        `ההשוואה היא של **תפקוד**, לא של צורה. זו ביולוגיה השוואתית, ולא "תורת הסימנים", שלפיה אגוז שדומה למוח מועיל למוח.`,
        `מכאן גם התפריט: **${prot.length} מתוך ${prot.length}** מקורות החלבון בגלריה הם **זרעים**, מאגר שהצמח הכין לנבט.`,
        `ו**${k.length} מתוך ${k.length}** מקורות ויטמין K הם **עלים**: החלק שעובד באור.`
      ];
    },
    quote: () => ({ q: said("wheat", "תהלים קד טו") || "", who: "תהלים קד טו" }),
    insight: "==מה שהצמח עושה בחלק, זה מה שהחלק נותן לנו.==",
    stats: () => { const fs = PARTS.filter((p) => p.id === "fruit" || p.id === "seed").reduce((n, p) => n + p.foods.length, 0); return [[6, "חלקים בכל צמח, ומקבילה לכל אחד"], [`${sources(NUTRIENTS.find((n) => n.id === "protein")).length}/${sources(NUTRIENTS.find((n) => n.id === "protein")).length}`, "מקורות החלבון הם זרעים"], [`${fs}/${FOODS.length}`, "מהמזונות הם פרי או זרע"]]; },
    haiku: ["הזרע שותק", "כל החורף הוא אוגר", "לחם של מחר"],
    src: ["campbell", "bennett-2007", "usda-fdc", "tanakh"]
  },
  {
    id: "hot-cold", kicker: "שיטות", head: "חם וקר: שפה אחת לאורך הדורות.",
    deck: "מיוון, דרך הודו וסין, ועד הרמב\"ם במצרים: **אותו כלל**, מזון לפי העונה.",
    figure: () => {
      const ms = METHODS.filter((m) => (MATRIX[m.id] || []).includes("temp")).sort((a, b) => a.from - b.from);
      const min = -500, max = 1250, X = (y) => 20 + ((y - min) / (max - min)) * 560;
      return `<div class="a4-fig"><svg viewBox="0 0 600 150" role="img" aria-label="ציר: השיטות שמודדות חם וקר" style="direction:ltr">
        <defs><linearGradient id="a4-hc" x1="0" x2="1"><stop offset="0" stop-color="#3d6f9e"/><stop offset="1" stop-color="#e0842a"/></linearGradient></defs>
        <rect x="20" y="70" width="560" height="8" rx="4" fill="url(#a4-hc)"/>
        ${ms.map((m, i) => `<g><circle cx="${X(m.from)}" cy="74" r="9" fill="#fff" stroke="#1A1A18" stroke-width="2"/><text x="${X(m.from)}" y="${i % 2 ? 112 : 50}" text-anchor="middle" font-family="IBM Plex Sans Hebrew" font-size="13" font-weight="700" style="direction:rtl">${esc(m.he)}</text><text x="${X(m.from)}" y="${i % 2 ? 128 : 34}" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#84837D">${m.from < 0 ? -m.from + "-" : m.from}</text></g>`).join("")}
      </svg></div>`;
    },
    body: () => {
      const ms = METHODS.filter((m) => (MATRIX[m.id] || []).includes("temp"));
      return [
        `**${ms.length} שיטות** מתוך ${METHODS.length} ממיינות מזון לפי **חם וקר**. כולן מסורתיות, ואף אחת מודרנית.`,
        `כל אחת מהן מודדת גם **עונה**. החום והקור הם לא של הצלחת, אלא של **הגוף ביחס לאקלים**.`,
        `גלנוס דירג במדרגות. הרפואה הערבית העבירה הלאה, והרמב"ם כתב את זה לחיי היום־יום בפוסטאט.`,
        `המדע של היום מודד **רכיבים**, ומתעלם כמעט מהעונה. שתי שפות, ושאלה אחת: מה מאזן.`
      ];
    },
    quote: () => ({ q: "\"בימות החמה אוכל מאכלים הקרים... ובימות הגשמים אוכל מאכלים החמים.\"", who: "הרמב\"ם, הלכות דעות ד ח" }),
    insight: "==האקלים כתב את הכללים: מקום חם מקרר, מקום קר מחמם.==",
    stats: () => { const ms = METHODS.filter((m) => (MATRIX[m.id] || []).includes("temp")); const span = Math.max(...ms.map((m) => m.to)) - Math.min(...ms.map((m) => m.from)); return [[ms.length, "שיטות ממיינות לפי חם וקר"], [`${Math.round(span / 100) * 100}`, "שנה של אותה שפה"], [0, "שיטות מודרניות שעושות זאת"]]; },
    haiku: ["קיץ בפוסטאט", "קערה של מלפפונים", "וחומץ צונן"],
    src: ["hippocrates", "galen", "rambam-deot", "charaka", "huangdi"]
  },
  {
    id: "month", kicker: "עונה", head: () => `${MONTHS[nowMonth() - 1]}: מה בשדה עכשיו.`,
    deck: () => `**ישראל**, ${SEASON_OF(nowMonth()).he}. מה נקטף, מה בשיא, ומה המסורת אמרה על הזמן הזה.`,
    figure: () => {
      const m = nowMonth(), inS = FOODS.filter((f) => f.months.includes(m)).slice(0, 8);
      return `<div class="a4-fig a4-strip" style="--mh:${MONTH_HUE[m - 1]}">${inS.map((f) => `<span><span class="ph">${foodImage(f)}</span><b>${esc(f.he)}</b></span>`).join("")}</div>`;
    },
    body: () => {
      const m = nowMonth(), inS = FOODS.filter((f) => f.months.includes(m));
      const c = sources(NUTRIENTS.find((n) => n.id === "vC")).filter((f) => f.months.includes(m));
      const parts = PARTS.map((p) => [p, inS.filter((f) => partOf(f) === p).length]).sort((a, b) => b[1] - a[1]);
      return [
        `ב${MONTHS[m - 1]} **${inS.length}** מזונות מהגלריה בשדה. הרוב: **${parts[0][0].he}** (${parts[0][1]}).`,
        `**${c.length}** מהם מקור ל**ויטמין C**: ${c.slice(0, 4).map((f) => f.he).join(", ")}. החורף הוא עונת ההדרים.`,
        `הצירוף של העונה: **עדשים או עלים ירוקים**, עם **לימון**. ויטמין C מגביר ספיגת ברזל מהצומח.`,
        `ולפי הרמב"ם, ${[11, 12, 1, 2, 3].includes(m) ? "בימות הגשמים אוכלים **חם** ומרבים בתבלינים" : "בימות החמה אוכלים **קר**"}.`
      ];
    },
    quote: () => ({ q: said("olive", "דברים ח ח") || "", who: "דברים ח ח" }),
    insight: "==העונה היא המתכון הראשון.==",
    stats: () => { const m = nowMonth(), inS = FOODS.filter((f) => f.months.includes(m)); const c = sources(NUTRIENTS.find((n) => n.id === "vC")).filter((f) => f.months.includes(m)); return [[inS.length, "מזונות בשדה החודש"], [c.length, "מהם מקור לוויטמין C"], [FOODS.filter((f) => !f.months.length).length, "מזונות כל השנה, ביבוא"]]; },
    haiku: ["גשם ראשון", "לימון על עדשים חמות", "ברזל של חורף"],
    src: ["season-est", "usda-fdc", "medlineplus-iron", "rambam-deot", "tanakh"]
  }
];
const val = (x) => (typeof x === "function" ? x() : x);

function pageHTML(a) {
  const q = a.quote(), qText = (q.q.match(/^(\\?"[^"]+")/) || [q.q])[0];
  const body = a.body();
  return `<article class="a4" dir="rtl" aria-labelledby="a4-h-${a.id}">
    <header class="a4-top"><span class="a4-k">${icon("leaf")} ${esc(a.kicker)}</span><span class="a4-n">צומחה · כתבה</span></header>
    <h1 id="a4-h-${a.id}">${esc(val(a.head))}</h1>
    <p class="a4-deck">${rich(val(a.deck))}</p>
    ${a.figure()}
    <div class="a4-cols">${body.map((t, i) => `<p class="${i === 0 ? "dropcap" : ""}">${rich(t)}</p>`).join("")}</div>
    ${qText ? `<blockquote class="a4-q">${rich(qText)}<cite>${esc(q.who)}</cite></blockquote>` : ""}
    <div class="a4-stats">${a.stats().map(([n, t]) => `<div><b class="num">${esc(String(n))}</b><span>${esc(t)}</span></div>`).join("")}</div>
    <div class="a4-end"><p class="a4-ins">${rich(a.insight)}</p><p class="a4-haiku lines">${a.haiku.map((l) => `<span>${esc(l)}</span>`).join("")}<em>הייקו מקורי</em></p></div>
    <footer class="a4-src">מקורות: ${srcLine(a.src)}</footer>
  </article>`;
}

// כל הכתבות בדף אחד, כל אחת עמוד A4. התפריט קופץ לכתבה, וההדפסה מוציאה עמוד לכל כתבה.
function render() {
  root.querySelector("#a4-tabs").innerHTML = ARTICLES.map((x) => `<button class="seg-b" data-a="${x.id}" aria-pressed="${x.id === sel}">${esc(val(x.head))}</button>`).join("");
  root.querySelector("#a4-page").innerHTML = ARTICLES.map((a) => `<div class="a4-slot" id="art-${a.id}">${pageHTML(a)}</div>`).join("");
}
function jump(id, smooth = true) { root.querySelector(`#art-${id}`)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }); }

export function mount(el, params) {
  root = el;
  sel = ARTICLES.some((a) => a.id === params.a) ? params.a : ARTICLES[0].id;
  root.innerHTML = `<div class="a4-view scroll-in">
    <div class="a4-bar"><span class="seg" id="a4-tabs" role="group" aria-label="כתבות"></span><button class="a4-print press btn" data-print>הדפסה, A4</button></div>
    <div class="a4-stage" id="a4-page"></div>
  </div>`;
  render();
  if (params.a) requestAnimationFrame(() => jump(sel, false));
  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-print]")) return window.print();
    const t = e.target.closest("[data-a]"); if (t) { sel = t.dataset.a; patch({ a: sel }); root.querySelectorAll("[data-a]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.a === sel))); jump(sel); }
  });
}
export function update(params) { if (params.a && params.a !== sel) { sel = params.a; jump(sel); } }
