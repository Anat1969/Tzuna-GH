// כתבות קומפקטיות: כל כתבה עמוד A4 אחד, מעוצב, ומודפס כמו שהוא. הכול נגזר מהדאטה.
// מבנה קבוע: כותרת, תת־כותרת, איור, שני טורים, ציטוט במירכאות ובניקוד, תובנה, ומקורות קטנים בתחתית.
// הכתבות מקובצות לפי ידע, הבנה ויישום. דף "יצירות" אוחד לכאן: כל חדר הוא כתבה, או חלק מכתבה קיימת.
import { PARTS } from "../data/plant.js";
import { FOODS, byId } from "../data/foods.js";
import { PROFILES } from "../data/profiles.js";
import { METHODS, MATRIX } from "../data/methods.js";
import { NUTRIENTS } from "../data/nutrients.js";
import { SYNERGIES } from "../data/synergies.js";
import { SCIENCE } from "../data/science.js";
import { RECIPES } from "../data/recipes.js";
import { DISCOVERIES } from "../data/discoveries.js";
import { PHOTOS } from "../data/photos.js";
import { rich, esc, srcLine, MONTHS, MONTHS_SHORT, nowMonth } from "../ui.js";
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
const syn = (id) => SYNERGIES.find((s) => s.id === id);
const recipe = (id) => RECIPES.find((r) => r.id === id);
const part = (id) => PARTS.find((p) => p.id === id);
const practical = (id, label) => (SCIENCE[id]?.practical.find((x) => x.startsWith(`**${label}**`)) || "").replace(`**${label}**: `, "");
// גילוי: הגוף והתובנה (==...==) בנפרד, כמו ב-scripts/creations.mjs
const disc = (id) => { const d = DISCOVERIES.find((x) => x.id === id); const m = d.t.match(/==(.+?)==/); return { title: d.title, body: d.t.replace(/\s*==.+?==\s*/, " ").trim(), mark: m ? m[1] : "" }; };
const noMark = (t) => t.replace(/\s*==.+?==\s*/, " ").trim();
const ph = (id) => `<span class="ph">${foodImage(byId(id))}</span>`;

const ZONES = ["ידע", "הבנה", "יישום"];
const SEVEN = ["barley", "wheat", "fig", "grape", "date", "pomegranate", "olive"];

// לוח השנה של שבעת המינים: שורה לכל מין, משבצת לכל חודש בצבע החודש. הזמן רץ מימין לשמאל.
function sevenCalendar() {
  const W = 600, L = 470, w = L / 12, x0 = 12, rowH = 23, top = 30;
  const X = (m) => x0 + L - m * w; // חודש 1 בימין, ליד השמות
  const rows = SEVEN.map((id) => byId(id)).sort((a, b) => a.months[0] - b.months[0]);
  const H = top + rows.length * rowH + 10;
  const head = MONTHS_SHORT.map((m, i) => `<text x="${X(i + 1) + w / 2}" y="18" text-anchor="middle" class="a4-cal-m">${m}</text>`).join("");
  const grid = MONTHS_SHORT.map((_, i) => `<line x1="${X(i + 1)}" x2="${X(i + 1)}" y1="${top - 4}" y2="${H - 8}" stroke="#E5E4E0" stroke-width=".6"/>`).join("") + `<line x1="${x0 + L}" x2="${x0 + L}" y1="${top - 4}" y2="${H - 8}" stroke="#E5E4E0" stroke-width=".6"/>`;
  const body = rows.map((f, r) => {
    const y = top + r * rowH, p = PHOTOS[f.id];
    const cells = f.months.map((m) => `<rect x="${X(m) + 1}" y="${y + 4}" width="${w - 2}" height="${rowH - 9}" fill="${MONTH_HUE[m - 1]}"/>`).join("");
    const img = p ? `<clipPath id="a4c-${f.id}"><circle cx="${x0 + L + 18}" cy="${y + rowH / 2 - 1}" r="9"/></clipPath><image href="${p.src}" x="${x0 + L + 9}" y="${y + rowH / 2 - 10}" width="18" height="18" preserveAspectRatio="xMidYMid slice" clip-path="url(#a4c-${f.id})"/>` : "";
    return `<g>${cells}${img}<text x="${W - 4}" y="${y + rowH / 2 + 4}" text-anchor="start" class="a4-cal-n">${esc(f.he)}</text></g>`;
  }).join("");
  return `<div class="a4-fig"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="שבעת המינים לפי חודשי הקציר" style="direction:ltr">${grid}${head}${body}</svg></div>`;
}

// נאמר מול ידוע: שורה לכל מפגש, בקו של השכבה (נקודות לנאמר, רציף לידוע).
function meetRows() {
  const rows = [
    ["olive", said("olive", "דברים ח ח"), "דברים ח ח", SCIENCE.olive.studied[0].t, "PREDIMED"],
    ["wheat", said("wheat", "תהלים קד טו"), "תהלים קד טו", byId("wheat").layers.known[0].t, "משרד הבריאות, WHO"],
    ["lentil", said("lentil", "בראשית כה לד"), "בראשית כה לד", syn("grain-legume").how, "WHO"]
  ];
  return `<div class="a4-fig a4-ft">${rows.map(([id, s, ref, k, kref]) => `<div class="a4-ft-r">${ph(id)}
    <div class="a4-ft-s"><span class="a4-ft-l">נאמר · ${esc(ref)}</span>${rich(s)}</div>
    <span class="a4-ft-ar" aria-hidden="true">←</span>
    <div class="a4-ft-k"><span class="a4-ft-l">ידוע · ${esc(kref)}</span>${rich(k)}</div></div>`).join("")}</div>`;
}

// צירופים: מזון, קו (רציף ירוק מעצים, מקווקו אדום מחליש), שותף, ומנגנון.
const COMBOS = ["turmeric-pepper", "iron-vitc", "lycopene-oil", "brassica-mustard", "oxalate-calcium", "tea-iron"];
function comboPairs() {
  return `<div class="a4-fig a4-pairs">${COMBOS.map((id) => {
    const s = syn(id), mate = s.mate || byId(s.b).he;
    return `<div class="a4-pair ${s.kind}">${ph(s.a)}<b>${esc(byId(s.a).he.replace(/ \(.+\)$/, ""))}</b>
      <span class="a4-pair-l" aria-label="${s.kind === "boost" ? "מעצים" : "מחליש"}"><i>${s.kind === "boost" ? "מעצים" : "מחליש"}</i></span>
      <b>${esc(mate)}</b><p>${rich(s.how)}</p></div>`;
  }).join("")}</div>`;
}

// בוקר אחד על ציר זמן: כתישה, המתנה, ארוחה, ותה אחריה.
function morningLine() {
  const wait = (syn("garlic-wait").how.match(/\*\*(\d+) דקות/) || [])[1];
  const pts = [[560, "כותשים שום", "אליצין נוצר"], [400, `אחרי ${wait} דקות`, "מחממים"], [240, "פול, לימון, שמן זית", "ויטמין C וברזל"], [80, "שעה אחרי", "תה"]];
  const svg = `<svg viewBox="0 0 640 124" role="img" aria-label="ציר הבוקר" style="direction:ltr">
    <line x1="60" x2="590" y1="56" y2="56" stroke="#1A1A18" stroke-width="1.4"/>
    <path d="M60 56 l9 -5 v10 z" fill="#1A1A18"/>
    <rect x="400" y="51" width="160" height="10" fill="#1D9E75" opacity=".22"/>
    <line x1="120" x2="240" y1="56" y2="56" stroke="#A32D2D" stroke-width="2" stroke-dasharray="5 4"/>
    ${pts.map(([x, a, b], i) => `<g><circle cx="${x}" cy="56" r="${i === 2 ? 8 : 5.5}" fill="${i === 2 ? "#1A1A18" : "#fff"}" stroke="#1A1A18" stroke-width="1.6"/>
      <text x="${x}" y="34" text-anchor="middle" class="a4-tl-a">${esc(a)}</text><text x="${x}" y="84" text-anchor="middle" class="a4-tl-b">${esc(b)}</text></g>`).join("")}
    <text x="180" y="106" text-anchor="middle" class="a4-tl-c">לא תה עם הארוחה</text><text x="480" y="106" text-anchor="middle" class="a4-tl-c">המתנה לפני חימום</text>
  </svg>`;
  return `<div class="a4-fig a4-morning">${ph("fava")}${svg}</div>`;
}

// בשוק: צילום, שם וכלל הבחירה מ"מעשי".
const PICKS = ["olive", "pomegranate", "date", "garlic"];
const pickFig = () => `<div class="a4-fig a4-picks">${PICKS.map((id) => `<figure>${ph(id)}<figcaption><b>${esc(byId(id).he)}</b>${rich(practical(id, "בחירה"))}</figcaption></figure>`).join("")}</div>`;

// סדר הארוחה: מה לפני, הארוחה, ומה אחריה.
function orderFig() {
  const col = (when) => FOODS.filter((f) => f.meal === when);
  const cell = (f) => `<span>${ph(f.id)}<b>${esc(f.he)}</b></span>`;
  return `<div class="a4-fig a4-order">
    <div class="a4-or-c"><span class="a4-ft-l">קודם הארוחה · משלשלין</span><div>${col("before").map(cell).join("")}</div></div>
    <div class="a4-or-m"><span>הארוחה</span></div>
    <div class="a4-or-c"><span class="a4-ft-l">תכף לארוחה · מאמצין</span><div>${col("after").map(cell).join("")}</div></div>
  </div>`;
}

const seven = disc("seven-calendar"), meet = disc("tradition-meets-science"), combo = disc("combo-over-food"), ew = disc("east-west-heat"), ast = disc("rambam-astringency");

const ARTICLES = [
  // ===== ידע =====
  {
    id: "seven", zone: "ידע", ic: "season", kicker: "שבעת המינים", nav: "שבעת המינים", head: `${seven.title}.`,
    deck: seven.body,
    figure: sevenCalendar,
    body: () => ["barley", "wheat", "olive", "date"].map((id) => `**${byId(id).he}.** ${PROFILES[id].unique} ${PROFILES[id].soul.t}`),
    quote: () => ({ q: said("grape", "מיכה ד ד"), who: "מיכה ד ד" }),
    insight: `==${seven.mark}==`,
    stats: () => { const ms = SEVEN.flatMap((id) => byId(id).months); const a = Math.min(...ms), b = Math.max(...ms); return [[SEVEN.length, "מינים: שני דגנים וחמישה פירות"], [b - a + 1, `חודשי קציר, מ${MONTHS[a - 1]} עד ${MONTHS[b - 1]}`], [SEVEN.filter((id) => PHOTOS[id]).length, "צילומים, אחד לכל מין"]]; },
    haiku: ["שעורה באביב", "זית אחרון אחרי החג", "שנה בשבעה"],
    src: ["tanakh", "season-est", "cfr-101-81", "usda-fdc", "sa-oc-583", "bavli-keritot-6a"]
  },
  {
    id: "meet", zone: "ידע", ic: "origin", kicker: "מסורת ומדע", nav: "המסורת והמדע", head: `${meet.title}.`,
    deck: meet.body,
    figure: meetRows,
    body: () => [
      `בשכבת **נאמר**, הזית הוא אחד מ**שבעת המינים**, והשמן סימן ל**שמחה** ולרווחה.`,
      `בשכבת **ידוע**, ${SCIENCE.olive.studied[0].t}`,
      `${byId("wheat").he} ו${byId("lentil").he}: ${PROFILES.wheat.with[0].t.replace(/^\*\*עדשים\*\*: /, "")} ${syn("grain-legume").how}`,
      `המפגש הוא לא על **מזון בודד**, אלא על **דפוס** של ארוחה: שמן עם לחם, ודגן עם קטנייה.`
    ],
    insight: `==${meet.mark}==`,
    stats: () => [[(SCIENCE.olive.studied[0].t.match(/כ־([\d,]+)/) || [])[1], "משתתפים בניסוי PREDIMED"], [2, "חומצות אמינו שהשניים משלימים: ליזין ומתיונין"], [FOODS.filter((f) => f.layers.known.length && f.layers.said.length).length, "מזונות עם שכבת ידוע וגם נאמר"]],
    haiku: ["נזיד עדשים", "ולחם בוצע לידו", "שני חלבונים"],
    src: ["tanakh", "predimed-2018", "moh-2021", "who-2023", "who-protein-2007"]
  },
  {
    id: "how-we-know", zone: "ידע", ic: "lang", kicker: "שיטה", nav: "איך יודעים", head: "איך יודעים מה יודעים על מזון.",
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
  // ===== הבנה =====
  {
    id: "combo", zone: "הבנה", ic: "combine", kicker: "צירופים", nav: "הצירוף", head: `${combo.title}.`,
    deck: "בכל צירוף, מזון אחד **מפעיל** איכות של מזון אחר.",
    figure: comboPairs,
    body: () => {
      const b = SYNERGIES.filter((s) => s.kind === "boost").length, k = SYNERGIES.filter((s) => s.kind === "block").length;
      return [
        combo.body,
        `גם **בישול** הוא חלק מהצירוף. ${syn("lycopene-oil").suggest} ${syn("brassica-mustard").suggest}`,
        `וצירוף יכול גם **להחליש**. ${syn("oxalate-calcium").suggest}`,
        `בדאטה **${b}** צירופים מעצימים ו**${k}** מחלישים. לכל אחד **מנגנון** (למה) ו**מנה** (איפה).`
      ];
    },
    insight: `==${combo.mark}==`,
    stats: () => [[SYNERGIES.filter((s) => s.kind === "boost").length, "צירופים מעצימים"], [SYNERGIES.filter((s) => s.kind === "block").length, "צירופים מחלישים"], [new Set(SYNERGIES.flatMap((s) => s.dishes || [])).size, "מנות במתכונים שמממשות צירוף"]],
    haiku: ["אבקה צהובה", "לבדה עוברת בשקט", "גרגר שחור פותח"],
    src: ["nccih-turmeric", "medlineplus-iron", "gartner-1997", "unlu-2005", "okunade-2018", "medlineplus-calcium"]
  },
  {
    id: "plant-body", zone: "הבנה", ic: "plant", kicker: "צמח וגוף", nav: "צמח וגוף", head: "הזרע אוגר, העלה נושם.",
    deck: "שישה חלקים בכל צמח, ולכל אחד **מקבילה בתפקוד** בגוף. מה שהצמח עושה קובע מה יש בו.",
    figure: () => `<div class="a4-fig a4-fig-pb">${overviewSVG(PARTS, "seed")}</div>`,
    body: () => {
      const prot = sources(NUTRIENTS.find((n) => n.id === "protein")), k = sources(NUTRIENTS.find((n) => n.id === "vK"));
      return [
        `**השורש** סופג, **הגבעול** מוביל, **העלה** מחליף גזים. בגוף אותן משימות: **מעי**, **כלי דם**, **ריאות**.`,
        `ההשוואה היא של **תפקוד**, לא של צורה. זו ביולוגיה השוואתית, ולא "תורת הסימנים", שלפיה אגוז שדומה למוח מועיל למוח.`,
        `מכאן גם התפריט: **${prot.length} מתוך ${prot.length}** מקורות החלבון בגלריה הם **זרעים**, מאגר שהצמח הכין לנבט.`,
        `ו**${k.length} מתוך ${k.length}** מקורות ויטמין K הם **עלים**: החלק שעובד באור.`
      ];
    },
    quote: () => ({ q: part("root").mind.t, who: part("root").mind.who }),
    insight: "==מה שהצמח עושה בחלק, זה מה שהחלק נותן לנו.==",
    stats: () => { const fs = PARTS.filter((p) => p.id === "fruit" || p.id === "seed").reduce((n, p) => n + p.foods.length, 0); return [[6, "חלקים בכל צמח, ומקבילה לכל אחד"], [`${sources(NUTRIENTS.find((n) => n.id === "protein")).length}/${sources(NUTRIENTS.find((n) => n.id === "protein")).length}`, "מקורות החלבון הם זרעים"], [`${fs}/${FOODS.length}`, "מהמזונות הם פרי או זרע"]]; },
    haiku: ["הזרע שותק", "כל החורף הוא אוגר", "לחם של מחר"],
    src: ["campbell", "darwin-1880", "bennett-2007", "usda-fdc"]
  },
  {
    id: "hot-cold", zone: "הבנה", ic: "temp", kicker: "שיטות", nav: "חם וקר", head: "חם וקר: שפה אחת לאורך הדורות.",
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
        `${ew.title}: ${ew.body} ${ew.mark}`,
        `המדע של היום מודד **רכיבים**, ומתעלם כמעט מהעונה. שתי שפות, ושאלה אחת: מה מאזן.`
      ];
    },
    quote: () => ({ q: "\"בימות החמה אוכל מאכלים הקרים... ובימות הגשמים אוכל מאכלים החמים.\"", who: "הרמב\"ם, הלכות דעות ד ח" }),
    insight: "==האקלים כתב את הכללים: מקום חם מקרר, מקום קר מחמם.==",
    stats: () => { const ms = METHODS.filter((m) => (MATRIX[m.id] || []).includes("temp")); const span = Math.max(...ms.map((m) => m.to)) - Math.min(...ms.map((m) => m.from)); return [[ms.length, "שיטות ממיינות לפי חם וקר"], [`${Math.round(span / 100) * 100}`, "שנה של אותה שפה"], [0, "שיטות מודרניות שעושות זאת"]]; },
    haiku: ["ג'ינג'ר בסין", "חרדל בפוסטאט בגשם", "אותו חום בפה"],
    src: ["hippocrates", "galen", "rambam-deot", "charaka", "huangdi", "nccih-tcm"]
  },
  // ===== יישום =====
  {
    id: "month", zone: "יישום", ic: "season", kicker: "עונה", nav: "החודש", head: () => `${MONTHS[nowMonth() - 1]}: מה בשדה עכשיו.`,
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
  },
  {
    id: "morning", zone: "יישום", ic: "sun", kicker: "ארוחת בוקר", nav: "מחר בבוקר", head: "מחר בבוקר: פול, שום ותה.",
    deck: "שלושה מעשים קטנים במטבח, ולכל אחד **המנגנון** שלו.",
    figure: morningLine,
    body: () => {
      const r = recipe("ful");
      return [
        `${byId("fava").layers.said[0].t} ההכנה ב**${r.steps.length} שלבים**, ${r.time}. ${r.note}`,
        `**שום ראשון.** ${syn("garlic-wait").how} ${syn("garlic-wait").suggest}`,
        `**לימון.** ${PROFILES.fava.with[0].t.replace(/^\*\*לימון ושום\*\*: /, "")}`,
        `**תה אחרי.** ${syn("tea-iron").how}`
      ];
    },
    quote: () => ({ q: said("garlic", "במדבר יא ה"), who: "במדבר יא ה" }),
    insight: "==אותו תה, זמן אחר.==",
    stats: () => [[(syn("garlic-wait").how.match(/\*\*(\d+) דקות/) || [])[1], "דקות בין כתישה לחימום"], [recipe("ful").steps.length, "שלבים בפול מדמס"], [1, "שעה אחרי הארוחה, התה"]],
    haiku: ["שום כתוש מחכה", "עשר דקות על הקרש", "פול חם בצלחת"],
    src: ["culinary", "song-milner-2001", "medlineplus-iron", "medlineplus-g6pd", "tanakh"]
  },
  {
    id: "market", zone: "יישום", ic: "local", kicker: "בשוק וברחוב", nav: "בשוק", head: "בשוק וברחוב: תורמוס, חומוס וטחינה.",
    deck: "מה שהעיר כבר יודעת: **חטיף רחוב** ו**שולחן משותף**.",
    figure: pickFig,
    body: () => [
      `**תורמוס.** ${byId("lupin").layers.said[0].t} ובצלחת: אחת ${SCIENCE.lupin.why}`,
      `**חומוס.** ${recipe("hummus").tradition.t} ${syn("sesame-chickpea").how}`,
      `**בדוכן.** ${byId("lupin").layers.known[0].t} גם **שומשום** ביניהם, וגם **טחינה** מכילה אותו.`,
      `**בבחירה.** לרוב המזונות יש כלל קנייה קצר, שרואים בעין. למעלה ארבעה: **${PICKS.map((id) => byId(id).he).join(", ")}**.`
    ],
    pull: () => ({ fromL: "בשדה", from: PROFILES.lupin.unique, toL: "במטבח", to: practical("lupin", "הכנה") }),
    insight: "==העיר כבר יודעת לצרף: חומוס עם טחינה ולימון.==",
    stats: () => [[(byId("lupin").layers.known[0].t.match(/(\d+) האלרגנים/) || [])[1], "אלרגנים לסימון באירופה, תורמוס ושומשום ביניהם"], [Object.values(SCIENCE).filter((s) => s.practical?.some((p) => p.startsWith("**בחירה**"))).length, "מזונות עם כלל בחירה בשוק"], [recipe("hummus").steps.length, "שלבים בחומוס ביתי"]],
    haiku: ["שקית נייר חמה", "תורמוס מלוח בשוק", "מר שהפך לחג"],
    src: ["culinary", "usda-fdc", "who-protein-2007", "medlineplus-iron", "eu-1169"]
  },
  {
    id: "order", zone: "יישום", ic: "order", kicker: "הרמב\"ם", nav: "תאנה לפני", head: `${syn("rambam-order").title}.`,
    deck: "הרמב\"ם: **סדר** הוא צירוף בזמן. מה פותח את הארוחה, ומה סוגר אותה.",
    figure: orderFig,
    body: () => [
      noMark(syn("rambam-order").how),
      `${ast.body} ${ast.mark} (**פרשנות**)`,
      `**תאנה.** ${PROFILES.fig.unique} ${PROFILES.fig.without[0].t}`,
      `**ליישום.** ${syn("rambam-order").suggest}`
    ],
    quote: () => ({ q: said("fig", "הלכות דעות ד יא"), who: "הרמב\"ם, הלכות דעות ד יא" }),
    insight: "==סדר הוא צירוף בזמן.==",
    stats: () => [[FOODS.filter((f) => f.meal === "before").length, "פירות קודם הארוחה"], [FOODS.filter((f) => f.meal === "after").length, "פירות תכף לארוחה"], [3, "פירות ש\"לעולם טובים\": תאנים, ענבים ושקדים"]],
    haiku: ["תאנה פתוחה", "בראש השולחן, ורימון", "סוגר את הערב"],
    src: ["rambam-deot", "usda-fdc"]
  }
];
const val = (x) => (typeof x === "function" ? x() : x);

function pageHTML(a) {
  const q = a.quote ? a.quote() : { q: "", who: "" }, qText = (String(q.q || "").match(/^(\\?"[^"]+")/) || [q.q])[0];
  const body = a.body(), pull = a.pull?.();
  return `<article class="a4" dir="rtl" aria-labelledby="a4-h-${a.id}">
    <header class="a4-top"><span class="a4-k">${icon(a.ic || "leaf")} <span class="a4-zone">${esc(a.zone)}</span> ${esc(a.kicker)}</span><span class="a4-n">צומחה · כתבה</span></header>
    <h1 id="a4-h-${a.id}">${esc(val(a.head))}</h1>
    <p class="a4-deck">${rich(val(a.deck))}</p>
    ${a.figure()}
    <div class="a4-cols">${body.map((t, i) => `<p class="${i === 0 ? "dropcap" : ""}">${rich(t)}</p>`).join("")}</div>
    ${pull ? `<div class="a4-pull"><div><span class="a4-ft-l">${esc(pull.fromL)}</span>${rich(pull.from)}</div><span class="a4-ft-ar" aria-hidden="true">←</span><div><span class="a4-ft-l">${esc(pull.toL)}</span>${rich(pull.to)}</div></div>` : ""}
    ${qText ? `<blockquote class="a4-q">${rich(qText)}<cite>${esc(q.who)}</cite></blockquote>` : ""}
    <div class="a4-stats">${a.stats().map(([n, t]) => `<div><b class="num">${esc(String(n))}</b><span>${esc(t)}</span></div>`).join("")}</div>
    <div class="a4-end"><p class="a4-ins">${rich(a.insight)}</p><p class="a4-haiku lines">${a.haiku.map((l) => `<span>${esc(l)}</span>`).join("")}<em>הייקו מקורי</em></p></div>
    <footer class="a4-src">מקורות: ${srcLine(a.src)}</footer>
  </article>`;
}

// כל הכתבות בדף אחד, כל אחת עמוד A4. התפריט מקובץ לפי ידע, הבנה ויישום, וקופץ לכתבה. ההדפסה מוציאה עמוד לכל כתבה.
function render() {
  root.querySelector("#a4-tabs").innerHTML = ZONES.map((z) => `<div class="a4-grp" role="group" aria-label="${z}"><span class="a4-zl">${z}</span>${ARTICLES.filter((x) => x.zone === z).map((x) => `<button class="seg-b" data-a="${x.id}" aria-pressed="${x.id === sel}">${esc(x.nav)}</button>`).join("")}</div>`).join("");
  root.querySelector("#a4-page").innerHTML = ARTICLES.map((a) => `<div class="a4-slot" id="art-${a.id}">${pageHTML(a)}</div>`).join("");
}
function jump(id, smooth = true) { root.querySelector(`#art-${id}`)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }); }

export function mount(el, params) {
  root = el;
  sel = ARTICLES.some((a) => a.id === params.a) ? params.a : ARTICLES[0].id;
  root.innerHTML = `<div class="a4-view scroll-in">
    <div class="a4-bar"><nav class="a4-menu" id="a4-tabs" aria-label="כתבות"></nav><button class="a4-print press btn" data-print>הדפסה, A4</button></div>
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
