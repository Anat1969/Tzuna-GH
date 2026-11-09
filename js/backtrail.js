// "חזרה למקום שממנו הגעתי": כל קפיצה בין דפים או בין רמות נרשמת עם שם המקום.
// הכפתור תמיד באותו מקום, ואומר לאן הוא מחזיר. חזרה מחזירה גם את הבחירה, הסינון והמיקוד שהיו שם.

const MAX = 30;
let stack = [];
let lastHref = location.href;
let goingBack = false;
let titles = {};

// patch() משנה את הכתובת בלי אירוע. כך הכתובת האחרונה תמיד מעודכנת, כולל בחירה וסינון.
const origReplace = history.replaceState.bind(history);
history.replaceState = (...a) => { origReplace(...a); lastHref = location.href; };

function label(href = location.href) {
  const h = new URL(href).hash.replace(/^#\/?/, "").split("?")[0];
  const view = h || "home";
  const page = titles[view] || (view === "home" ? "דף הבית" : view);
  const el = document.querySelector("#view aside .sheet-name, #view aside h2, #view aside .panel-head h2");
  let item = "";
  if (el) { const c = el.cloneNode(true); c.querySelectorAll("i, em, small, .latin, [lang]").forEach((x) => x.remove()); item = c.textContent.replace(/\s+/g, " ").trim(); }
  return item && item !== page ? `${page} · ${item.slice(0, 28)}` : page;
}

const btn = document.createElement("button");
btn.type = "button";
btn.className = "back-trail";
btn.hidden = true;
btn.innerHTML = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14l-5-5 5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg><span class="bt-l">חזרה אל</span><b></b>`;
function draw() {
  const top = stack[stack.length - 1];
  btn.hidden = !top;
  if (!top) return;
  btn.querySelector("b").textContent = top.label;
  btn.setAttribute("aria-label", `חזרה אל ${top.label}`);
  btn.title = stack.length > 1 ? `ועוד ${stack.length - 1} צעדים אחורה` : "";
}
btn.addEventListener("click", () => {
  const top = stack.pop();
  if (!top) return;
  goingBack = true;
  draw();
  location.href = top.href;
});

export function initBackTrail(viewTitles) {
  titles = viewTitles;
  // בשורת המצב: מקום קבוע שלא מכסה תוכן.
  const bar = document.querySelector(".statusbar");
  if (bar) bar.insertBefore(btn, bar.lastElementChild); else document.body.appendChild(btn);
  // נרשם לפני הרינדור, כדי שהשם יילקח מהמסך שעוזבים.
  addEventListener("hashchange", () => {
    const here = location.href;
    const from = { href: lastHref, label: label(lastHref) };
    if (goingBack) goingBack = false;
    else if (stack.length && stack[stack.length - 1].href === here) stack.pop(); // כפתור "אחורה" של הדפדפן
    else if (from.href !== here) { stack.push(from); if (stack.length > MAX) stack.shift(); }
    lastHref = here;
    draw();
  });
}
