// מקורות והערות: כל המקורות, הרשימה האדומה, קווי העזרה והפוסט. הכתבה עצמה בדף הכתבות, כעמוד A4.
import { SOURCES, EVIDENCE } from "../data/sources.js";
import { FOODS } from "../data/foods.js";
import { rich, stratum, srcLine, esc, iconBtn } from "../ui.js";
import { plate } from "../plates.js";
import { REDLIST, LINES } from "../data/safety-data.js";
import { lineCard } from "../safety.js";

export const title = "מקורות והערות";

const EV_TEXT = {
  "גבוהה": "הנחיה רשמית, מאגר הרכב, או הרבה מחקרים שמסכימים.",
  "בינונית": "ניסוי גדול אחד, או כמה מחקרים עם מגבלות.",
  "ראשונית": "ניסוי קטן או ראשון. כיוון, לא מסקנה.",
  "מקרי דיווח": "תיאורי מקרים של נזק. מספיק לאזהרה.",
  "אין": "לא נמצא מחקר. הטענה עוברת ל\"מאמינים\"."
};

const POST = [
  "האמונה ששמן זית על בטן ריקה מועיל לכבד מעולם לא נבדקה.",
  "מה שכן נבדק: בניסוי PREDIMED, דיאטה ים־תיכונית עם שמן זית כתית נקשרה לפחות אירועי לב וכלי דם.",
  "ובתהלים השמן הוא בכלל סימן לשמחה: \"להצהיל פנים משמן\".",
  "שלוש טענות על אותו מזון, ושלוש רמות של ודאות: ידוע, נאמר, מאמינים.",
  "ההבחנה הזו לא אומרת מה לאכול. היא אומרת איך לקרוא.",
  "איזו טענה על מזון שמעתם השבוע, ולאיזו שכבה היא שייכת?"
];

export function mount(root) {
  const olive = FOODS.find((f) => f.id === "olive");
  const byType = Object.entries(SOURCES).reduce((a, [id, s]) => { (a[s.type] ||= []).push([id, s]); return a; }, {});
  root.innerHTML = `<div class="scroll-in" style="height:100%"><article class="article" dir="rtl">
    <div class="label">מקורות והערות</div>
    <h1 style="margin-top:8px">מקורות והערות.</h1>
    <p class="deck">${rich("כל מקור, הרשימה האדומה וקווי העזרה, במקום אחד. הכתבה \"איך יודעים מה יודעים על מזון\" עברה ל**כתבות**, בעמוד A4 אחד.")} <a href="#/articles?a=how-we-know">לכתבה</a></p>

    <h2>פוסט, מוכן להעתקה</h2>
    <div class="post" id="post">${POST.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="copy-row"><button class="press btn" id="copy-post">העתקת הפוסט</button><span class="src" id="copied" aria-live="polite"></span>${iconBtn("print", "הדפסה ל-PDF", "id=\"print\"")}</div>

    <h2>מקורות</h2>
    <p class="body">${rich("כל עובדה בדאטה מקושרת למקור. **מקור בלי עוצמה לא נכנס**, וטענה בלי מקור עוברת ל\"מאמינים\".")}</p>
    ${Object.entries(byType).map(([type, list]) => `<h3 style="font-size:14px;margin:16px 0 6px;font-weight:600">${esc(type)}</h3><ol class="biblio">${list.map(([id]) => `<li>${srcLine(id)}${SOURCES[id].note ? ` <span>(${esc(SOURCES[id].note)})</span>` : ""}</li>`).join("")}</ol>`).join("")}
    <h2 id="redlist">רשימה אדומה</h2>
    <p class="body">${rich("צמחים ותכשירים עם **נזק מתועד**. הם לא מוצגים בגלריה.")}</p>
    <div class="red-grid" style="margin-top:10px">${REDLIST.map((r) => `<div class="red-card"><h3>${esc(r.he)}</h3><div class="latin">${esc(r.la)}</div><p class="risk">${rich(r.risk)}</p><p class="src" style="margin-top:6px">${r.sources.map((x) => srcLine(x)).join(" · ")}</p></div>`).join("")}</div>

    <h2 id="help">קווי עזרה</h2>
    <div class="lines-grid">${LINES.map(lineCard).join("")}</div>

    <h2>הערות עריכה</h2>
    <ul class="biblio" style="font-size:14px">
      <li>${rich("**העונות** הן הערכה כללית לישראל, לא נתון.")}</li>
      <li>${rich("**תמונות**: צילומים מ-Wikimedia Commons, עם רישיון וקרדיט על כל תמונה.")}</li>
      <li>${rich("**פרטיות**: תוצאות מבחן הדקה נשמרות במכשיר בלבד.")}</li>
      <li>${rich("**לפני השקה**: יועץ משפטי (תיקון 13), דיאטנית קלינית, ואימות קווי הסיוע.")}</li>
    </ul>
  </article></div>`;
  root.querySelector("#copy-post").addEventListener("click", async () => {
    const t = POST.join("\n\n");
    try { await navigator.clipboard.writeText(t); root.querySelector("#copied").textContent = "הועתק"; }
    catch { const r = document.createRange(); r.selectNodeContents(root.querySelector("#post")); getSelection().removeAllRanges(); getSelection().addRange(r); root.querySelector("#copied").textContent = "סומן. העתיקו עם Ctrl+C"; }
  });
  root.querySelector("#print").addEventListener("click", () => print());
}
