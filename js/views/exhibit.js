// שם הקובץ אינו creations.js בכוונה: כלי הייצוא מנתב כל בקשה ל-creations.js אל הרכיב המשותף.
// יצירות: כל נושא מהידע, ההבנה והיישום של האפליקציה הופך לחדר עם יצירות בעיצובים שונים.
// הרכיב המשותף <app-creations> (AppOfApp-GH/public/creations.js) מציג אותן, מדפיס A4 ומעלה לחדר ב-TAARUCHA.
// הנתונים: creations.json בשורש, נגזר מ-js/data ב-scripts/creations.mjs.
export const title = "יצירות";

export function mount(root) {
  // גופן סריף עברי ליצירות בלבד: נטען רק כשנכנסים לדף הזה
  if (!document.getElementById("cr-font")) {
    const l = document.createElement("link");
    l.id = "cr-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700&display=swap";
    document.head.appendChild(l);
  }
  // הדף נקרא בגלילה רגילה, לא בתוך מעטפת בגובה המסך
  const shell = document.querySelector(".app-shell");
  shell.classList.add("page-creations");
  root.innerHTML = `<div class="creations-page" dir="rtl"><app-creations src="./creations.json" heading="מה המזון יוצר: חדרים לתערוכה"></app-creations></div>`;
  return () => shell.classList.remove("page-creations");
}
