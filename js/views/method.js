// שיטה ומקורות: כתבה מוזיאלית. נקראת בגלילה, כמו מגזין (החריג שבסעיף 2.9 א).
import { SOURCES, EVIDENCE } from "../data/sources.js";
import { FOODS } from "../data/foods.js";
import { rich, stratum, srcLine, esc, iconBtn } from "../ui.js";
import { plate } from "../plates.js";
import { REDLIST, LINES } from "../data/safety-data.js";
import { lineCard } from "../safety.js";

export const title = "שיטה ומקורות";

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
    <div class="label">כתבה · שיטה ומקורות</div>
    <h1 style="margin-top:8px">איך יודעים מה יודעים על מזון.</h1>
    <p class="deck">${rich("שמן זית, שבעת המינים וטבעות של עץ: **מדריך קצר** לקריאת טענה.")}</p>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:24px;align-items:center;margin-top:24px" class="split">
      <div>
        <p class="body dropcap">${rich("כל משפט על מזון מגיע ממקום אחר. **מחקר** מודד. **מסורת** זוכרת. **אמונה** עוברת מפה לאוזן.")}</p>
        <p class="body">${rich("הבעיה היא שהשלושה מגיעים לרוב **באותו משפט**, באותו טון ובאותו שלט בשוק.")}</p>
        <p class="body">${rich("==ההפרדה ביניהם היא הכלי, לא התוכן.==")}</p>
      </div>
      <figure style="margin:0;background:var(--herb);border:1px solid var(--rule);aspect-ratio:1;display:grid;place-items:center">${plate(olive)}<figcaption class="src" style="padding:6px 10px;align-self:end;justify-self:stretch;border-top:1px solid var(--rule);background:#fff">איור קו בקוד, בהשראת גיליונות Flora Graeca של פרדיננד באואר (Ferdinand Bauer), 1806–1840.</figcaption></figure>
    </div>

    <h2>שלוש שכבות, שלושה קווים</h2>
    <p class="body">${rich("לכל שכבה **צבע** ו**סוג קו** קבועים, בכל מסך. כך אפשר להבחין גם בלי לקרוא.")}</p>
    <div class="strata-figure">${["known", "said", "believed"].map((k) => stratum(k, [olive.layers[k][0]])).join("")}</div>

    <h2>עוצמת ראיה: חמש מדרגות</h2>
    <p class="body">${rich("גם \"ידוע\" הוא לא דבר אחד. **ניסוי קטן** ו**הנחיה לאומית** הם לא אותה ודאות.")}</p>
    <div class="ev-scale">${EVIDENCE.map((e, i) => `<div style="border-top-color:color-mix(in srgb, var(--known) ${100 - i * 20}%, #fff)"><b>${esc(e)}</b><br><span class="src">${esc(EV_TEXT[e])}</span></div>`).join("")}</div>

    <blockquote class="pull">"ויין ישמח לבב אנוש, להצהיל פנים משמן, ולחם לבב אנוש יסעד."<cite>תהלים קד טו. שלושה מזונות, ושלושתם על הלב ועל הפנים: מזון כעניין של נפש.</cite></blockquote>

    <h2>גוף ונפש</h2>
    <p class="body">${rich("בניסוי **SMILES**, ליווי תזונתי לדפוס ים־תיכוני, לצד הטיפול הקיים, נקשר לשיפור בתסמיני דיכאון.")}</p>
    <p class="body">${rich("המדגם **קטן**, וללא סמיות מלאה. לכן עוצמת הראיה כאן **ראשונית**, וזה לא תחליף לטיפול.")} <span class="src">${srcLine("smiles-2017")}</span></p>

    <h2>למה אין כאן קלוריות</h2>
    <p class="body">${rich("במחקר על אנשים עם **הפרעות אכילה**, רבים תיארו אפליקציית ספירת קלוריות כגורם שתרם להפרעה.")} <span class="src">${srcLine("levinson-2017")}</span></p>
    <p class="body">${rich("אי אפשר לדעת מי פגיע. לכן הכלל חל על **כולם**: בלי ספירה, בלי משקל ובלי \"חריגה\".")}</p>

    <h2>תרגיל לשוק</h2>
    <p class="body">בשוק העירוני הקרוב, ב<strong>אשדוד</strong> <span class="latin">Ashdod</span> או בכל עיר, בחרו שלט אחד.</p>
    <p class="body">${rich("סמנו כל טענה בו: **ידוע**, **נאמר** או **מאמינים**. רוב השלטים מערבבים את שלושתן.")}</p>

    <div class="haiku"><span>עלה זית כסוף</span><span>הופך את גבו לשמש</span><span>חוסך מים לדור</span><small>הייקו מקורי. מה הוא מאיר: ==המבנה מסביר את ההישרדות==, ולכן הכרה באה לפני הבנה.</small></div>

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
