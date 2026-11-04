// השוואה: שני מזונות בעמודות, שכבה מול שכבה, ושורת "מה משותף" שנגזרת מהדאטה.
import { FOODS, CATEGORIES, ALLERGENS, byId } from "../data/foods.js";
import { rich, stratum, LAYERS, esc, MONTHS } from "../ui.js";
import { plate } from "../plates.js";
import { foodImage } from "./foods.js";
import { DISCOVERIES } from "../data/discoveries.js";
import { SYNERGIES } from "../data/synergies.js";
import { patch } from "../route.js";

export const title = "השוואה";
const PAIRS = [["fig", "pomegranate", "לפני ואחרי הארוחה"], ["wheat", "barley", "שני דגנים"], ["almond", "walnut", "שני אגוזים"], ["onion", "garlic", "רשימת מצרים"], ["grapefruit", "garlic", "שתי אזהרות"]];

let root, a, b;

function shared(x, y) {
  const out = [];
  if (x.family_la === y.family_la) out.push(`שניהם ממשפחת ה**${x.family}**.`);
  if (x.cat === "seven" && y.cat === "seven") out.push("שניהם מ**שבעת המינים** (דברים ח ח).");
  if (x.meal && y.meal && x.meal !== y.meal) {
    const [first, second] = x.meal === "before" ? [x, y] : [y, x];
    out.push(`==הרמב"ם מפריד ביניהם:== **${first.he}** קודם הארוחה, **${second.he}** תכף אחריה.`);
  } else if (x.meal && x.meal === y.meal) out.push(`הרמב"ם ממקם את שניהם **${x.meal === "before" ? "קודם" : "אחרי"}** הארוחה.`);
  const both = x.months.filter((m) => y.months.includes(m));
  if (both.length) out.push(`עונה משותפת: **${both.map((m) => MONTHS[m - 1]).join(", ")}**.`);
  else if (x.months.length && y.months.length) out.push("**אין חפיפה** בעונה: הם לא בשדה באותו חודש.");
  const ref = (f) => new Set(f.layers.said.map((s) => s.ref).filter(Boolean));
  const commonRef = [...ref(x)].filter((r) => ref(y).has(r));
  if (commonRef.length) out.push(`שניהם באותו מקור: **${commonRef.join(", ")}**.`);
  const meds = [x, y].filter((f) => f.safety.flags.includes("medication_interaction"));
  if (meds.length) out.push(`**התנגשות עם תרופות**: ${meds.map((f) => f.he).join(" ו")}.`);
  const kx = x.layers.known.length, ky = y.layers.known.length;
  if (!kx || !ky) out.push(`לא לכל אחד יש **שכבת ידוע**: ${[x, y].filter((f) => !f.layers.known.length).map((f) => f.he).join(", ")} נשען על מסורת בלבד.`);
  return out.length ? out : ["אין קשר מתועד ביניהם. ההשוואה מראה הבדלים בלבד."];
}

const select = (id, name) => `<select class="field" id="${name}" aria-label="${name === "a" ? "מזון ראשון" : "מזון שני"}">${CATEGORIES.map((c) => `<optgroup label="${c.he}">${FOODS.filter((f) => f.cat === c.id).map((f) => `<option value="${f.id}" ${f.id === id ? "selected" : ""}>${esc(f.he)}</option>`).join("")}</optgroup>`).join("")}</select>`;

function months(f) {
  return f.months.length ? `<div class="months">${MONTHS.map((m, i) => `<i class="${f.months.includes(i + 1) ? "on" : ""}" title="${m}"></i>`).join("")}</div>` : `<span class="src">כל השנה, יבוא</span>`;
}

function table() {
  const x = byId(a), y = byId(b);
  const row = (label, fx) => `<div class="rh">${label}</div><div>${fx(x)}</div><div>${fx(y)}</div>`;
  return `<div class="cmp">
    <div class="rh ch"></div>
    ${[x, y].map((f) => `<div class="ch"><a href="#/foods?id=${f.id}" style="display:flex;gap:10px;align-items:center;text-decoration:none;color:inherit"><span style="width:56px;height:56px;background:var(--herb);border:1px solid var(--rule);display:grid;place-items:center;flex:0 0 auto">${foodImage(f)}</span><span><b style="font-size:19px">${esc(f.he)}</b><br><span class="latin">${esc(f.la)}</span></span></a></div>`).join("")}
    ${row("משפחה", (f) => `${esc(f.family)}`)}
    ${row("נאכל", (f) => `<b>${esc(f.part)}</b>`)}
    ${row("עונה", months)}
    ${row("ארוחה", (f) => f.meal ? rich(f.meal === "before" ? "**קודם** הארוחה" : "**אחרי** הארוחה") : `<span class="src">אין הוראה</span>`)}
    ${LAYERS.map((l) => row(`<i class="layer-mark lm-${l.key}" style="width:16px"></i> ${l.he}`, (f) => stratum(l.key, f.layers[l.key]))).join("")}
    ${row("אלרגנים", (f) => f.allergens.length ? `<b style="color:var(--red)">${esc(f.allergens.map((k) => ALLERGENS[k]).join(", "))}</b>` : `<span class="src">אין מהרשימה</span>`)}
  </div>`;
}

// השוואות מובנות: זוגות שכדאי להעמיד זה מול זה, ולמה.
const BUILT = [
  ["spinach", "chard", "**שני עלים** מאותה משפחה, ואותה חומצה אוקסלית."],
  ["lemon", "orange", "**שני הדרים**: חמוץ מול מתוק."],
  ["potato", "sweetpotato", "**גבעול מול שורש**: שני \"תפוחי אדמה\" ממשפחות שונות."],
  ["lentil", "chickpea", "**שתי קטניות היסוד** של המטבח המזרחי."],
  ["wheat", "spelt", "**דגן מודרני מול עתיק**: חיטה וכוסמין."],
  ["olive", "avocado", "**שני פירות שומניים**: עולם ישן מול עולם חדש."],
  ["tomato", "pepper", "**שני סולניים**: ליקופן מול ויטמין C."],
  ["almond", "walnut", "**שני אגוזים** מהמקרא: שקד בירמיהו, אגוז בשיר השירים."],
  ["fava", "pea", "**שתי קטניות ירוקות** של אביב."],
  ["cumin", "coriander", "**שני זרעים של סוככיים**: שני תבלינים מאותה משפחה."]
].filter(([x, y]) => byId(x) && byId(y));
const pairsHTML = () => `<div class="cmp-pairs" role="group" aria-label="השוואות מובנות">${BUILT.map(([x, y, t]) => `<button class="cp" data-pair="${x},${y}"><span class="cp-ph"><span>${foodImage(byId(x))}</span><span>${foodImage(byId(y))}</span></span><b>${esc(byId(x).he)} מול ${esc(byId(y).he)}</b><span class="cp-t">${rich(t)}</span></button>`).join("")}</div>`;

function render() {
  const syn = SYNERGIES.filter((x) => [x.a, x.b].includes(a) && [x.a, x.b].includes(b));
  root.querySelector("#shared").innerHTML = shared(byId(a), byId(b)).map((s) => `<span>${rich(s)}</span>`).join("")
    + syn.map((x) => `<span class="syn ${x.kind}" style="display:block;margin-top:6px"><b class="syn-t">${x.kind === "boost" ? "צירוף מעצים" : "צירוף מחליש"}</b> ${rich(x.how)}</span>`).join("");
  root.querySelector("#cmp").innerHTML = table();
  root.querySelectorAll("[data-pair]").forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.pair === `${a},${b}`)));
}

export function mount(el, params) {
  root = el;
  a = byId(params.a) ? params.a : "fig";
  b = byId(params.b) ? params.b : "pomegranate";
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="panel" aria-labelledby="c-title">
      <div class="gallery-tools">
        <div><h1 class="view-title" id="c-title">השוואה, שכבה מול שכבה</h1><p class="view-sub">${rich("שני מזונות. **אותן שורות**, כדי לראות מה ייחודי.")}</p></div>
        <div class="cmp-pick">${select(a, "a")}<span class="label">מול</span>${select(b, "b")}</div>
      </div>
      <div class="scroll-in" style="flex:1;padding:0 14px 14px"><div class="sec-h" style="margin-top:12px"><h3>השוואות מובנות</h3><span class="label">לחיצה על זוג מעמידה אותו בטבלה</span></div>${pairsHTML()}<div id="cmp"></div></div>
    </section>
    <aside class="panel" aria-labelledby="s-title">
      <div class="panel-head"><div><span class="label">השוואות שעשיתי בשבילך</span><h2 class="sheet-name" id="s-title" style="font-size:24px;font-weight:700">גילויים</h2></div></div>
      <div class="panel-body scroll-in" style="flex:1">
        <div class="disc-list">${DISCOVERIES.map((d, i) => `<button class="disc press" data-pair="${d.pair.join(",")}"><span class="disc-n num">${i + 1}</span><span><b>${esc(d.title)}</b><span class="disc-t">${rich(d.t)}</span><span class="disc-type ${d.type === "פרשנות" ? "interp" : ""}">${esc(d.type)}</span></span></button>`).join("")}</div>
        <div class="sec"><div class="sec-h"><h3>בזוג שנבחר</h3><span class="label">מה משותף, ומה מפעיל את מה</span></div><p class="shared lines" id="shared"></p></div>
      </div>
    </aside>
  </div>`;
  render();
  root.addEventListener("change", (e) => {
    if (e.target.id === "a") a = e.target.value;
    if (e.target.id === "b") b = e.target.value;
    patch({ a, b }); render();
  });
  root.addEventListener("click", (e) => {
    const p = e.target.closest("[data-pair]");
    if (!p) return;
    [a, b] = p.dataset.pair.split(",");
    root.querySelector("#a").value = a; root.querySelector("#b").value = b;
    patch({ a, b }); render();
  });
}

export function update(params) {
  if ((params.a && params.a !== a) || (params.b && params.b !== b)) { a = params.a || a; b = params.b || b; root.querySelector("#a").value = a; root.querySelector("#b").value = b; render(); }
}
