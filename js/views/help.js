// עזרה: מתי לפנות לאיש מקצוע. קווי חירום גדולים, והצהרה.
import { LINES } from "../data/safety-data.js";
import { rich } from "../ui.js";
import { lineCard } from "../safety.js";
import * as store from "../store.js";

export const title = "עזרה";

const WHEN = [
  ["**קוצר נשימה**, התנפחות או **כאב בחזה**", "מד\"א 101, מיד."],
  ["**ילד בלע** צמח, תוסף או תרופה", "מרכז ההרעלות, גם בלי סימנים."],
  ["הפסקתם **תרופה**, או רוצים צמח במקומה", "רופא מטפל, לפני כל שינוי."],
  ["**הריון**, הנקה, ילדים, מחלת כליות או כבד", "רופא או רוקח לפני כל צמח מרוכז."],
  ["**אכילה** מעסיקה אתכם, מפחידה או שולטת", "ער\"ן 1201, רופא משפחה או דיאטנית קלינית."]
];

export function mount(root) {
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="h-title">
      <div class="gallery-tools"><div><h1 class="view-title" id="h-title">מתי לפנות לעזרה</h1><p class="view-sub">${rich("כאן **לומדים לקרוא** מזון. החלטה על הגוף היא של איש מקצוע.")}</p></div></div>
      <div class="scroll-in" style="flex:1;padding:12px 14px;display:grid;gap:12px;align-content:start">
        <div class="lines-grid">${LINES.map(lineCard).join("")}</div>
        <div>${WHEN.map(([w, who]) => `<div class="dense-row" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding:8px 0;border-bottom:1px solid var(--rule-soft);font-size:14.5px"><span>${rich(w)}</span><b>${rich(who)}</b></div>`).join("")}</div>
        <p class="src">מספרי הטלפון יאומתו שוב לפני השקה רשמית.</p>
      </div>
    </section>
    <aside class="panel" aria-labelledby="d-title">
      <div class="panel-head"><h2 class="sheet-name" id="d-title" style="font-size:20px">הצהרה</h2></div>
      <div class="panel-body scroll-in lines" style="flex:1;display:grid;gap:10px;align-content:start;font-size:14.5px;line-height:1.6">
        <span>${rich("האפליקציה **לא מאבחנת**, **לא מטפלת** ולא ממליצה על טיפול.")}</span>
        <span>${rich("אין כאן **מינונים**, ספירת קלוריות, משקל או יעדים על הגוף.")}</span>
        <span>${rich("אין תיוג של מזון \"טוב\" או \"רע\". יש **שכבות** ויש **מקורות**.")}</span>
        <div class="tone tone-insight"><p>${rich("==מידע על בריאות נשאר במכשיר שלכם.==")}</p></div>
        <span class="src">${rich("הסינון האישי ותוצאות המבחן נשמרים מקומית בלבד, לפי **תיקון 13** לחוק הגנת הפרטיות.")}</span>
        <button class="press btn" id="wipe" style="justify-self:start">מחיקת כל מה שנשמר במכשיר</button>
        <span class="src" id="wiped" aria-live="polite"></span>
      </div>
    </aside>
  </div>`;
  root.querySelector("#wipe").addEventListener("click", () => { store.clearAll(); root.querySelector("#wiped").textContent = "נמחק. שום דבר לא נשמר עכשיו."; });
}
