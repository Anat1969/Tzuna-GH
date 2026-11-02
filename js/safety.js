// שכבת בטיחות: מילות חירום, הפסקת תרופה, שאלות מינון ונושאי גוף (docs/SAFETY.md).
import { EMERGENCY_WORDS, STOPPED_MED_WORDS, DOSE_WORDS, BODY_WORDS, LINES } from "./data/safety-data.js";
import { esc, iconBtn, rich } from "./ui.js";

const norm = (s) => ` ${String(s).toLowerCase().replace(/[^֐-׿a-z0-9"״ ]+/g, " ").replace(/\s+/g, " ").trim()} `;
// התאמה בתחילת מילה, אחרי עד שתי אותיות שימוש.
const has = (q, words) => words.some((w) => new RegExp(`\\s[והשבכלמ]{0,2}${w.replace(/["״]/g, "[\"״]")}(\\s|$)`).test(q));

export function classify(query) {
  const q = norm(query);
  if (q.trim().length < 2) return null;
  if (has(q, EMERGENCY_WORDS)) return "emergency";
  if (has(q, STOPPED_MED_WORDS)) return "stopped";
  if (has(q, DOSE_WORDS)) return "dose";
  if (has(q, BODY_WORDS)) return "body";
  return null;
}

const MESSAGES = {
  emergency: {
    title: "זה מצב לפנות לעזרה עכשיו.",
    body: "**אל תחכו.** התקשרו לאחד המספרים.\nאם מדובר בילד שבלע משהו: מרכז ההרעלות, גם בלי סימנים.",
    lines: ["mda", "poison", "eran"]
  },
  stopped: {
    title: "הפסקת תרופה: קודם רופא.",
    body: "**פנו לרופא המטפל** או לרוקח לפני כל שינוי.\nכאן לא ממשיכים לדבר על צמחים במקום תרופה.",
    lines: ["mda"]
  },
  dose: {
    title: "אין כאן מינונים.",
    body: "**מינון של צמח או תוסף** נקבע רק עם רופא או רוקח.\nאצל ילדים, בהריון ובהנקה: תמיד בייעוץ.",
    lines: []
  },
  body: {
    title: "כאן לא סופרים ולא שוקלים.",
    body: "האפליקציה **לא עוסקת** בקלוריות, במשקל או בניקוי.\nאם אכילה מעסיקה אתכם יותר מדי, יש עם מי לדבר.",
    lines: ["eran"]
  }
};

let lastFocus = null;
export function showSafety(type) {
  const m = MESSAGES[type];
  if (!m) return;
  closeSafety();
  lastFocus = document.activeElement;
  const box = document.createElement("div");
  box.className = "overlay";
  box.id = "safety-overlay";
  box.setAttribute("role", "alertdialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-labelledby", "safety-title");
  box.innerHTML = `<div class="overlay-box">
    <div class="head"><h2 id="safety-title">${esc(m.title)}</h2>${iconBtn("x", "סגירה", "data-close")}</div>
    <p class="lines">${m.body.split("\n").map((l) => `<span>${rich(l)}</span>`).join("")}</p>
    ${m.lines.length ? `<div class="lines-grid">${m.lines.map((id) => lineCard(LINES.find((l) => l.id === id))).join("")}</div>` : ""}
    <p class="src">האפליקציה לא מאבחנת ולא מחליפה רופא. <a href="#/help">כל קווי העזרה</a></p>
  </div>`;
  document.body.appendChild(box);
  box.addEventListener("click", (e) => { if (e.target === box || e.target.closest("[data-close]") || e.target.closest("a[href^='#']")) closeSafety(); });
  box.querySelector("[data-close]").focus();
}
export function closeSafety() {
  const o = document.getElementById("safety-overlay");
  if (o) { o.remove(); lastFocus?.focus?.(); }
}
export const lineCard = (l) => `<a class="line-card press" href="tel:${l.tel.replace(/\D/g, "")}"><span class="tel">${esc(l.tel)}</span><b>${esc(l.he)}</b><span>${esc(l.desc)}</span></a>`;
addEventListener("keydown", (e) => { if (e.key === "Escape") closeSafety(); });
