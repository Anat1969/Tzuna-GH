// מפיק את creations.json מתוך הנתונים של האפליקציה (תקן "יצירות", AppOfApp-GH/docs/creations-standard.md).
// הרצה: node scripts/creations.mjs
// אחר כך ייצוא JPG לכל יצירה, מול שרת מקומי של הריפו (למשל python3 -m http.server 4175):
//   node <AppOfApp-GH>/tools/creations-render.cjs "http://localhost:4175/#/creations" creations.json creations
// כל טקסט נגזר מ-js/data: גילויים, צירופים, פרופילים, מדע ומעשה, צמח וגוף, שיטות ומתכונים.
// ההייקו הם הייקו מקוריים (כמו בדף השיטה), ומסומנים כך. אין כאן עובדה שלא נמצאת בדאטה.
import { writeFileSync, existsSync, readFileSync } from "fs";
import { FOODS } from "../js/data/foods.js";
import { PHOTOS } from "../js/data/photos.js";
import { SYNERGIES } from "../js/data/synergies.js";
import { PARTS } from "../js/data/plant.js";
import { RECIPES } from "../js/data/recipes.js";
import { SCIENCE } from "../js/data/science.js";
import { PROFILES } from "../js/data/profiles.js";
import { METHODS } from "../js/data/methods.js";
import { DISCOVERIES } from "../js/data/discoveries.js";

const OUT = "creations.json";
const by = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
const F = by(FOODS), S = by(SYNERGIES), P = by(PARTS), R = by(RECIPES), M = by(METHODS), D = by(DISCOVERIES);

// גילוי: הגוף והתובנה (==...==) בנפרד
const disc = (id) => { const t = D[id].t; const m = t.match(/==(.+?)==/); return { title: D[id].title, body: t.replace(/\s*==.+?==\s*/, " ").trim(), mark: m ? m[1] : "" }; };
const photo = (id) => PHOTOS[id]?.src;
const credit = (id) => (PHOTOS[id] ? `צילום: ${PHOTOS[id].credit} · ${PHOTOS[id].license}` : undefined);
const plain = (s) => s.replace(/\*\*|==/g, "");
const said = (id, ref) => F[id].layers.said.find((s) => s.ref === ref);
const practical = (id, label) => { const p = SCIENCE[id].practical.find((x) => x.startsWith(`**${label}**`)); return p ? p.replace(`**${label}**: `, "") : ""; };
const stepLines = (r) => R[r].steps.map((s) => s.t).join("\n");

// "פרי או זרע": נספר מצמח וגוף, מתוך המזונות שבגלריה
const gallery = new Set(FOODS.map((f) => f.id));
const fruitSeed = new Set([...P.fruit.foods, ...P.seed.foods].filter((id) => gallery.has(id)));
const mealList = (when) => FOODS.filter((f) => f.meal === when).map((f) => f.he).join(", ");

const seven = disc("seven-calendar"), meet = disc("tradition-meets-science"), combo = disc("combo-over-food"),
  fs = disc("fruit-seed"), ew = disc("east-west-heat"), ast = disc("rambam-astringency");
const TAGS = ["מזון_גוף_ונפש", "צירופים"];

const topics = [
  {
    id: "seven", zone: "ידע", title: "שבעת המינים הם לוח שנה",
    sub: seven.body,
    creations: [
      { id: "poster", style: "poster", title: seven.title, text: seven.body, image: photo("wheat"), credit: credit("wheat"), kicker: "גילוי · עובדה" },
      { id: "insight", style: "insight", title: "==הרשימה מכסה את כל עונת הקציר==", text: `מפסח ועד אחרי סוכות. **שעורה** ${plain(PROFILES.barley.unique).replace(/^הראשונה להבשיל: /, "")}`, kicker: "גילוי · עובדה" },
      { id: "quote", style: "quote", quote: "איש תחת גפנו ותחת תאנתו", who: "המקרא", cite: "מיכה ד ד", kicker: "גפן ותאנה: מנוחה בבית" },
      { id: "haiku", style: "haiku", lines: ["עלה זית כסוף", "הופך את גבו לשמש", "חוסך מים לדור"], text: "הייקו מקורי מדף השיטה. ==המבנה מסביר את ההישרדות.==", kicker: "זית" },
      { id: "essay", style: "essay", title: "שבעה מינים, שנה אחת", text: "כל מין נושא **גוף** וגם **סיפור**.", image: photo("barley"), credit: credit("barley"),
        body: ["barley", "wheat", "fig", "olive"].map((id) => `**${F[id].he}.** ${PROFILES[id].unique} ${PROFILES[id].soul.t}`), kicker: "שבעת המינים" }
    ]
  },
  {
    id: "meet", zone: "ידע", title: meet.title,
    sub: meet.body,
    creations: [
      { id: "veil", style: "veil", title: meet.title, text: "\"**ארץ זית שמן**\" ושמן זית כתית. \"**לחם ונזיד עדשים**\" והשלמת חלבון.", image: photo("olive"), credit: credit("olive"), kicker: "גילוי · פרשנות" },
      { id: "gradient", style: "gradient", title: "כ־7,400 משתתפים בניסוי אחד", text: "בניסוי **PREDIMED**, תפריט ים־תיכוני עם **שמן זית כתית** נקשר לפחות אירועי לב וכלי דם.", kicker: `ידוע · עוצמת ראיה ${SCIENCE.olive.studied[0].ev}` },
      { id: "fromto", style: "fromto", title: "לחם ונזיד: מהמקרא למעבדה", fromLabel: `נאמר · ${said("lentil", "בראשית כה לד").ref}`, from: "\"ויעקב נתן לעשו **לחם ונזיד עדשים**\".", toLabel: "ידוע · WHO", to: S["grain-legume"].how, text: "==אותה ארוחה, בשתי שפות.==", kicker: S["grain-legume"].title },
      { id: "quote", style: "quote", quote: "להצהיל פנים משמן, ולחם לבב אנוש יסעד", who: "המקרא", cite: "תהלים קד טו", kicker: "שמן ולחם" },
      { id: "insight", style: "insight", title: "==צירוף ודפוס, לא מזון בודד==", text: `${meet.mark}`, kicker: "גילוי · פרשנות" },
      { id: "post", style: "post", title: "המסורת אמרה, המדע מצא", image: photo("lentil"), credit: credit("lentil"), tags: ["מסורת", "מדע", ...TAGS],
        text: ["**נאמר:** \"ארץ זית שמן\".", "**נמצא:** שמן זית כתית ופחות אירועי לב.", "**נאמר:** לחם ונזיד עדשים.", "**נמצא:** דגן וקטנייה משלימים חלבון.", "==המפגש הוא על צירוף.=="].join("\n"), kicker: "פוסט" }
    ]
  },
  {
    id: "combo", zone: "הבנה", title: combo.title,
    sub: "בכל צירוף, מזון אחד **מפעיל** איכות של מזון אחר.",
    creations: [
      { id: "poster", style: "poster", title: combo.title, text: "כורכום **לבד** נספג רע, ועם **פלפל שחור** טוב.", image: photo("turmeric"), credit: credit("turmeric"), kicker: "גילוי · עובדה" },
      { id: "fromto", style: "fromto", title: "כורכום: מלבד אל ביחד", fromLabel: "לבד", from: SCIENCE.turmeric.why, toLabel: "עם פלפל שחור", to: S["turmeric-pepper"].how, text: S["turmeric-pepper"].suggest, kicker: S["turmeric-pepper"].title },
      { id: "essay", style: "essay", title: "ארבעה צירופים, ארבעה מנגנונים", text: "בכל צירוף, מזון אחד **מפעיל** איכות של מזון אחר.",
        body: ["turmeric-pepper", "iron-vitc", "lycopene-oil", "brassica-mustard"].map((id) => `**${S[id].title}.** ${S[id].how}`), kicker: "צירופים מעצימים" },
      { id: "gradient", style: "gradient", title: "גם צירוף יכול להחליש", text: S["oxalate-calcium"].how, kicker: S["oxalate-calcium"].title },
      { id: "insight", style: "insight", title: `==${combo.mark.replace(/\.$/, "")}==`, text: "עדשים עם **לימון** נותנות יותר ברזל, ועם **תה** פחות.", kicker: "גילוי · עובדה" },
      { id: "haiku", style: "haiku", lines: ["אבקה צהובה", "לבדה עוברת בשקט", "גרגר שחור פותח"], text: "הייקו מקורי על **כורכום ופלפל שחור**.", kicker: "צירוף" }
    ]
  },
  {
    id: "plant-body", zone: "הבנה", title: "צמח וגוף: אותו עיקרון, איבר אחר",
    sub: "שישה חלקים שיש כמעט לכל צמח, ו**המקבילה התפקודית** שלהם בגוף.",
    creations: [
      { id: "veil", style: "veil", title: `${P.root.he} ו${P.root.organ}: משטח ספיגה`, text: P.root.body.t, image: "img/plant-root.jpg", credit: "צילום: Diogo Luiz, iNaturalist · CC BY", kicker: "צמח וגוף · שורש" },
      { id: "quote", style: "quote", quote: plain(P.root.mind.t).replace(/^"|"\.?$/g, ""), who: "צ'ארלס דרווין", cite: "תנועה בצמחים, 1880", kicker: "שורש" },
      { id: "fromto", style: "fromto", title: `${P.leaf.he} ו${P.leaf.organ}: החלפה הפוכה`, fromLabel: `בצמח · ${P.leaf.he}`, from: P.leaf.plant.t, toLabel: `בגוף · ${P.leaf.organ}`, to: P.leaf.body.t, text: P.leaf.mind.t, kicker: "צמח וגוף · עלה" },
      { id: "insight", style: "insight", title: `==${fs.mark.replace(/\.$/, "")}==`, text: `**${fruitSeed.size} מתוך ${FOODS.length}** המזונות הם **פרי או זרע**: מאגר שהצמח הכין לדור הבא.`, kicker: "גילוי · עובדה" },
      { id: "gradient", style: "gradient", title: "הפרי: הזמנה לאכול", text: P.fruit.body.t, kicker: "צמח וגוף · פרי" },
      { id: "post", style: "post", title: "שישה חלקים, שש מקבילות", tags: ["צמח_וגוף", ...TAGS],
        text: PARTS.map((p) => `**${p.he}** ← ${p.organ}`).join("\n"), kicker: "פוסט" }
    ]
  },
  {
    id: "east-west", zone: "הבנה", title: ew.title,
    sub: ew.body,
    creations: [
      { id: "poster", style: "poster", title: ew.title, text: ew.body, image: photo("ginger"), credit: credit("ginger"), kicker: "גילוי · פרשנות" },
      { id: "fromto", style: "fromto", title: "שתי מסורות, אותה מסקנה", fromLabel: `${M.tcm.place} · ${M.tcm.he}`, from: M.tcm.unit, toLabel: `${M.rambam.place.split(",")[0]} · ${M.rambam.he}`, to: M.rambam.time, text: "==תבלין חריף לקור.==", kicker: "שיטות" },
      { id: "essay", style: "essay", title: "שפה של חום וקור", text: "שפה של **חום וקור** חוזרת במזרח ובמערב.",
        body: ["tcm", "galen", "hildegard", "rambam"].map((id) => `**${M[id].he}** (${M[id].place}). ${M[id].unit} ${M[id].time}`), kicker: "שיטות מכל העולם" },
      { id: "insight", style: "insight", title: "==תבלין חריף לקור==", text: "שתי מסורות בלי קשר, אותה מסקנה. **פרשנות** מתוך הצלבת השיטות.", kicker: "גילוי · פרשנות" },
      { id: "haiku", style: "haiku", lines: ["ג'ינג'ר בסין", "חרדל בפוסטאט בגשם", "אותו חום בפה"], text: "הייקו מקורי על **שתי מסורות** וחורף אחד.", kicker: "מזרח ומערב" }
    ]
  },
  {
    id: "morning", zone: "יישום", title: "מחר בבוקר: פול, שום ותה",
    sub: "שלושה מעשים קטנים במטבח, ולכל אחד **המנגנון** שלו.",
    creations: [
      { id: "poster", style: "poster", title: "פול מדמס לארוחת בוקר", text: F.fava.layers.said[0].t, image: photo("fava"), credit: credit("fava"), kicker: "נאמר · מסורת קולינרית" },
      { id: "post", style: "post", title: R.ful.he, text: stepLines("ful"), tags: ["ארוחת_בוקר", ...TAGS], kicker: "מתכון" },
      { id: "insight", style: "insight", title: "==כותשים שום ראשון==", text: S["garlic-wait"].how, kicker: S["garlic-wait"].title },
      { id: "fromto", style: "fromto", title: "תה: לא עם הארוחה, אחריה", fromLabel: "עם הארוחה", from: plain(S["tea-iron"].how).split(". ")[0].replace("מפחית", "**מפחית**") + ".", toLabel: "שעה אחרי", to: S["tea-iron"].suggest, text: "==אותו תה, זמן אחר.==", kicker: S["tea-iron"].title },
      { id: "gradient", style: "gradient", title: "לחם, שמן זית וזעתר", text: R["zaatar-bread"].tradition.t, kicker: "ארוחת בוקר בלבנט" }
    ]
  },
  {
    id: "market", zone: "יישום", title: "בשוק וברחוב: תורמוס, חומוס וטחינה",
    sub: "מה שהעיר כבר יודעת: **חטיף רחוב** ו**שולחן משותף**.",
    creations: [
      { id: "poster", style: "poster", title: "תורמוס בשקית נייר", text: F.lupin.layers.said[0].t, image: photo("lupin"), credit: credit("lupin"), kicker: "ברחוב" },
      { id: "fromto", style: "fromto", title: "מר בשדה, חטיף בשוק", fromLabel: "בשדה", from: PROFILES.lupin.unique, toLabel: "במטבח", to: practical("lupin", "הכנה"), text: `תורמוס: ${SCIENCE.lupin.why}`, kicker: "תורמוס" },
      { id: "veil", style: "veil", title: "חומוס: שולחן משותף", text: R.hummus.tradition.t, image: photo("chickpea"), credit: credit("chickpea"), kicker: "בעיר" },
      { id: "insight", style: "insight", title: "==חומוס עם טחינה ולימון==", text: S["sesame-chickpea"].how, kicker: S["sesame-chickpea"].title },
      { id: "post", style: "post", title: "מה בוחרים מחר בשוק", image: photo("pomegranate"), credit: credit("pomegranate"), tags: ["שוק", ...TAGS],
        text: ["olive", "pomegranate", "date", "garlic"].map((id) => `**${F[id].he}:** ${practical(id, "בחירה")}`).join("\n"), kicker: "פוסט" },
      { id: "haiku", style: "haiku", lines: ["שקית נייר חמה", "תורמוס מלוח בשוק", "מר שהפך לחג"], text: "הייקו מקורי על **חטיף של שוק וחג**.", kicker: "תורמוס" }
    ]
  },
  {
    id: "order", zone: "יישום", title: S["rambam-order"].title,
    sub: "הרמב\"ם: **סדר** הוא צירוף בזמן.",
    creations: [
      { id: "quote", style: "quote", quote: plain(said("fig", "הלכות דעות ד יא").t).replace(/^"|"\.?$/g, ""), who: "הרמב\"ם", cite: "משנה תורה, הלכות דעות ד יא", kicker: "פירות שלעולם טובים" },
      { id: "fromto", style: "fromto", title: "סדר הוא צירוף בזמן", fromLabel: "קודם הארוחה", from: `**${mealList("before")}**`, toLabel: "תכף לארוחה", to: `**${mealList("after")}**`, text: S["rambam-order"].suggest, kicker: "הלכות דעות ד ו" },
      { id: "poster", style: "poster", title: plain(PROFILES.fig.unique).split(":")[0], text: F.fig.layers.said[1].t, image: photo("fig"), credit: credit("fig"), kicker: "תאנה · לפני" },
      { id: "veil", style: "veil", title: "רימון בסוף הארוחה", text: F.pomegranate.layers.said[0].t, image: photo("pomegranate"), credit: credit("pomegranate"), kicker: "רימון · אחרי" },
      { id: "insight", style: "insight", title: ast.title, text: `==${ast.mark}== **פרשנות**.`, kicker: "גילוי · פרשנות" },
      { id: "post", style: "post", title: R["fig-almond"].he, text: stepLines("fig-almond"), image: photo("almond"), credit: credit("almond"), tags: ["הרמב\"ם", ...TAGS], kicker: "מתכון" }
    ]
  }
];

// בדיקות התקן: מילים אסורות (כמו ב-lint-data), עיצוב לא חוזר בחדר, אורך כותרת והייקו, תמונה קיימת
const FORBIDDEN = ["מרפא", "מרפאת", "מנקה רעלים", "מאזן הורמונים", "מחזק חיסון", "מוריד לחץ דם", "מוריד סוכר", "עוצמתי", "מטפל", "מבריא", "מבטיח", "קלוריות", "BMI"];
const errs = [];
const words = (s) => plain(s || "").split(/\s+/).filter(Boolean).length;
for (const t of topics) {
  const styles = t.creations.map((c) => c.style);
  if (new Set(styles).size !== styles.length) errs.push(`${t.id}: עיצוב חוזר בחדר`);
  if (t.creations.length < 4 || t.creations.length > 6) errs.push(`${t.id}: ${t.creations.length} יצירות`);
  for (const c of t.creations) {
    const all = JSON.stringify(c);
    for (const w of FORBIDDEN) if (all.includes(w)) errs.push(`${t.id}/${c.id}: מילה אסורה ${w}`);
    if (c.title && words(c.title) > 8) errs.push(`${t.id}/${c.id}: כותרת ארוכה (${words(c.title)} מילים)`);
    if (c.style === "haiku" && c.lines.length !== 3) errs.push(`${t.id}/${c.id}: הייקו בלי 3 שורות`);
    if (c.style === "post" && c.text.split("\n").length > 6) errs.push(`${t.id}/${c.id}: פוסט ארוך`);
    if (c.image && !existsSync(c.image)) errs.push(`${t.id}/${c.id}: תמונה חסרה ${c.image}`);
    for (const k of Object.keys(c)) if (c[k] === undefined || c[k] === "") delete c[k];
  }
}
const used = new Set(topics.flatMap((t) => t.creations.map((c) => c.style)));
if (used.size < 7) errs.push(`רק ${used.size} עיצובים באפליקציה`);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }

// שומרים את ה-png ואת חדר התערוכה מהריצה הקודמת
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
for (const t of topics) {
  const pt = prev?.topics?.find((x) => x.id === t.id);
  if (pt?.room) t.room = pt.room;
  for (const c of t.creations) { const pc = pt?.creations?.find((x) => x.id === c.id); if (pc?.png) c.png = pc.png; }
}
const data = {
  app: {
    id: "tzuna", name: "מזון, גוף ונפש", url: "https://tzuna-gh.vercel.app", repo: "Anat1969/Tzuna-GH",
    palette: {
      a: "#1F4E79", b: "#5B7F3A", c: "#7A7A7A", s: "#5B7F3A", accent: "#1F4E79", marker: "#FFE45C",
      paper: "#FFFFFF", paper2: "#FAFAF7", ink: "#1A1A18", "b-wash": "#EFF4E8", "s-wash": "#EFF4E8",
      serif: "\"Frank Ruhl Libre\", \"IBM Plex Serif\", \"IBM Plex Sans Hebrew\", serif"
    }
  },
  topics
};
writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`${topics.length} חדרים, ${topics.reduce((n, t) => n + t.creations.length, 0)} יצירות, ${used.size} עיצובים → ${OUT}`);
