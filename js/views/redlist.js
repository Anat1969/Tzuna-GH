// רשימה אדומה: צמחים ותכשירים מסוכנים. לא מופיעים בגלריה. כל רשומה: שם מדעי, סיכון, מקור ותאריך בדיקה.
import { REDLIST, LINES } from "../data/safety-data.js";
import { rich, esc, srcLine, triangle } from "../ui.js";
import { lineCard } from "../safety.js";

export const title = "רשימה אדומה";

export function mount(root, params) {
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="r-title">
      <div class="gallery-tools" style="border-bottom:2px solid var(--red)">
        <div><h1 class="view-title" id="r-title" style="color:var(--red);display:flex;gap:8px;align-items:center">${triangle()} רשימה אדומה</h1>
        <p class="view-sub">${rich("צמחים ותכשירים עם **נזק מתועד**. הם לא מוצגים כמזון, ולא מופיעים בגלריה.")}</p></div>
      </div>
      <div class="scroll-in" style="flex:1;padding:12px 14px"><div class="red-grid">
        ${REDLIST.map((r) => `<article class="red-card ${params.id === r.id ? "is-target" : ""}" id="red-${r.id}">
          <h3>${triangle()}${esc(r.he)}</h3><div class="latin" style="font-size:13px">${esc(r.la)}</div>
          <p class="risk"><span class="label" style="color:var(--red)">סיכון</span><br>${rich(r.risk)}</p>
          <p class="said">${rich(r.said)}</p>
          <p class="src" style="margin-top:8px">${r.sources.map((s) => srcLine(s)).join(" · ")}<br>נבדק לאחרונה: <bdi class="num" style="font-weight:400">${esc(r.last_reviewed)}</bdi></p>
        </article>`).join("")}
      </div></div>
    </section>
    <aside class="panel" aria-labelledby="r-aside">
      <div class="panel-head"><h2 class="sheet-name" id="r-aside" style="font-size:20px">מה עושים</h2></div>
      <div class="panel-body scroll-in lines" style="flex:1;display:grid;gap:10px;align-content:start">
        <div class="tone tone-problem"><h4>הבעיה</h4><p>${rich("\"טבעי\" לא אומר **בטוח**. חלק מהנזקים מופיעים רק אחרי שבועות.")}</p></div>
        <div class="tone tone-solution"><h4>הפתרון</h4><p>${rich("לפני כל צמח מרוכז או תוסף: **רוקח או רופא**, עם רשימת התרופות.")}</p></div>
        <div class="tone tone-insight"><h4>התובנה</h4><p>${rich("==הסכנה היא בריכוז ובשילוב, לא בצמח בצלחת.==")}</p></div>
        <p class="src">${rich("הרשימה תתעדכן מול **LiverTox** ומקורות רשמיים.")}</p>
        ${lineCard(LINES.find((l) => l.id === "poison"))}
      </div>
    </aside>
  </div>`;
  if (params.id) root.querySelector(`#red-${CSS.escape(params.id)}`)?.scrollIntoView({ block: "center" });
}
