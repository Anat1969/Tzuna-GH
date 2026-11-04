// צמח וגוף בגרפיקה: מפה אחת שמחברת כל חלק בצמח לאיבר המקביל בגוף, ותרשים מנגנון מונפש לכל חלק.
// להראות, לא רק להסביר: המים עולים בשורש, הזרם נע בגבעול, הגזים מתחלפים בעלה.
// התנועה רק כשאין "הפחתת תנועה" (css: @media prefers-reduced-motion).

// אייקונים מקצועיים בשפה אחת: קו 1.6, פינות מעוגלות, 24×24.
const I = {
  root: '<path d="M12 3v7"/><path d="M12 10c0 4-4 5-4 9"/><path d="M12 10c0 4 4 5 4 9"/><path d="M12 13c0 3 0 5 0 8"/><path d="M4 7h16" stroke-dasharray="2 2"/>',
  stem: '<path d="M12 21V3"/><path d="M9 8l3-3 3 3"/><path d="M9 16l3 3 3-3"/>',
  leaf: '<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z"/><path d="M5 19l9-9"/>',
  flower: '<circle cx="12" cy="10" r="2.2"/><path d="M12 7.8c0-3 3-4 3-1.5S13.5 9 12 7.8zM14.2 10c3 0 4 3 1.5 3S13 11.5 14.2 10zM12 12.2c0 3-3 4-3 1.5s1.5-2.7 3-1.5zM9.8 10c-3 0-4-3-1.5-3S11 8.5 9.8 10z"/><path d="M12 12.5V21"/>',
  fruit: '<circle cx="12" cy="14" r="6.5"/><path d="M12 7.5V4"/><path d="M12 5c2-2 4-2 5-1"/>',
  seed: '<ellipse cx="12" cy="12" rx="5" ry="7.5"/><path d="M12 6c-1.5 3-1.5 9 0 12"/>',
  gut: '<path d="M7 6h10a2 2 0 010 4H8a2 2 0 000 4h8a2 2 0 010 4H7"/>',
  vessel: '<path d="M12 20s-7-4.3-7-9.5A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.5c0 5.2-7 9.5-7 9.5z"/>',
  lungs: '<path d="M12 4v8"/><path d="M12 9c-2 0-3 1-4 3s-3 7-1 8 4-1 5-3"/><path d="M12 9c2 0 3 1 4 3s3 7 1 8-4-1-5-3"/>',
  senses: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  taste: '<path d="M5 9c2 6 12 6 14 0"/><path d="M9 12.5c0 3 6 3 6 0"/>',
  energy: '<rect x="4" y="7" width="15" height="10" rx="2"/><path d="M19 10.5h2v3h-2"/><path d="M7 10v4M10 10v4M13 10v4"/>',
  plant: '<path d="M12 21v-9"/><path d="M12 12C12 7 8 5 4 5c0 4 3 7 8 7z"/><path d="M12 14c0-4 3-6 7-6 0 4-3 6-7 6z"/>',
  body: '<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M8 10l4 2 4-2M9 21l3-6 3 6"/>',
  mind: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
  lang: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  origin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  // כללי התזונה: אייקון שעוזר לזכור כל כלל
  taste: '<path d="M12 3c3 5 6 8 6 12a6 6 0 01-12 0c0-4 3-7 6-12z"/>',
  temp: '<path d="M10 4a2 2 0 014 0v9.5a4 4 0 11-4 0z"/><path d="M12 10v6"/><path d="M17 5h3M17 9h2"/><path d="M4 6l2 1M4 10h2" stroke-dasharray="1 2"/>',
  season: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M7.5 9.5l-2-2M7.5 14.5l-2 2M8 12H5"/><path d="M15 9l2-1.5M15 15l2 1.5M16 12h3"/>',
  order: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4"/><path d="M4 4l2.5 2.5"/><path d="M20 4l-2.5 2.5"/>',
  nutrient: '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="9" r="2.5"/><circle cx="10" cy="17" r="2.5"/><path d="M9.3 8.2l5.4.5M8 9.3l1.4 5.3M15.6 11l-4 4.5"/>',
  local: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  table: '<path d="M3 10h18"/><path d="M6 10l-1 9M18 10l1 9"/><circle cx="8.5" cy="6.5" r="2"/><circle cx="15.5" cy="6.5" r="2"/>',
  combine: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  nocombine: '<circle cx="7.5" cy="12" r="4.5"/><circle cx="16.5" cy="12" r="4.5"/><path d="M12 5v14" stroke-dasharray="2 2"/>',
  culture: '<path d="M4 20h16M6 20V9M18 20V9M12 20V9M3 9l9-5 9 5z"/>',
  climate: '<circle cx="9" cy="9" r="3.5"/><path d="M9 2.5v1.5M2.5 9H4M4.5 4.5l1 1M13.5 4.5l-1 1"/><path d="M8 19h10a3.5 3.5 0 000-7 5 5 0 00-9.5 1.5A2.8 2.8 0 008 19z"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M10 4.5l2 2 2-2M10 19.5l2-2 2 2"/>',
  bloom: '<circle cx="12" cy="9" r="2"/><path d="M12 7c0-3 3-3 2 0M14 9c3 0 3 3 0 2M12 11c0 3-3 3-2 0M10 9c-3 0-3-3 0-2"/><path d="M12 11v10M12 17c-2-2-4-2-5-1M12 15c2-2 4-2 5-1"/>',
  leaffall: '<path d="M6 18c0-7 5-11 13-12-1 8-5 13-13 12z"/><path d="M6 18l8-8"/><path d="M4 21l2-3"/>',
  allyear: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 2"/><path d="M12 7v5l3 2"/>',
};
// הזמן הנכון של מזון או מנה: אייקון העונה העיקרית, או "כל השנה". חודשים 1-12.
const SEASONS4 = [["חורף", "snow", [12, 1, 2]], ["אביב", "bloom", [3, 4, 5]], ["קיץ", "sun", [6, 7, 8]], ["סתיו", "leaffall", [9, 10, 11]]];
const MONTH_NAMES = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
export function timeBadge(months, extra = "") {
  if (!months || !months.length || months.length >= 11) return `<span class="tb tb-all" title="כל השנה${extra}">${icon("allyear")}<span>כל השנה</span></span>`;
  const best = SEASONS4.map(([he, ic, ms]) => [he, ic, ms.filter((m) => months.includes(m)).length]).sort((a, b) => b[2] - a[2])[0];
  const rng = `${MONTH_NAMES[months[0] - 1]}${months.length > 1 ? "–" + MONTH_NAMES[months[months.length - 1] - 1] : ""}`;
  return `<span class="tb tb-${best[1]}" title="${best[0]}: ${rng}${extra}">${icon(best[1])}<span>${best[0]}</span></span>`;
}
// אייקון בתוך SVG אחר: אותו קו, בלי עטיפה.
export const iconG = (k) => `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${I[k] || ""}</g>`;
export const icon = (k, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${I[k] || ""}</svg>`;

// איבר בגוף לכל חלק, והמיקום שלו במפה.
export const ORGAN_ICON = { root: "gut", stem: "vessel", leaf: "lungs", flower: "senses", fruit: "taste", seed: "energy" };

// ===== גרפיקה מדעית: לוח בוטני ואטלס אנטומי, בקו דיו ובגוונים עמומים =====
const INK = "#2a2a26";
const NUM = { root: 1, stem: 2, leaf: 3, flower: 4, fruit: 5, seed: 6 };
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
// חלקיק שנע לאורך מסלול (SMIL). בלי תנועה כשמבקשים הפחתה.
const mover = (path, color, dur = 3, n = 3, r = 1.8) => reduced() ? "" : Array.from({ length: n }, (_, i) =>
  `<circle r="${r}" fill="${color}"><animateMotion dur="${dur}s" begin="${(-i * dur / n).toFixed(2)}s" repeatCount="indefinite" path="${path}"/></circle>`).join("");

// קו חלק דרך נקודות (Catmull-Rom), לצללית הגוף.
function smooth(pts, close = true) {
  const p = close ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    d += `C${(x1 + (x2 - x0) / 6).toFixed(1)} ${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)} ${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2} ${y2}`;
  }
  return d + (close ? "Z" : "");
}
// צללית אנטומית בפרופורציה של שמונה ראשים: חצי שמאלי, ומראה.
const HALF = [[143, 68], [141, 80], [122, 87], [104, 93], [94, 106], [89, 150], [85, 196], [81, 234], [79, 254], [85, 262], [91, 250], [97, 208], [101, 168], [105, 128], [111, 140], [112, 180], [109, 214], [106, 246], [107, 300], [109, 352], [111, 398], [127, 404], [131, 356], [135, 306], [141, 262], [150, 254]];
const BODY_D = smooth([...HALF, ...HALF.slice(0, -1).reverse().map(([x, y]) => [300 - x, y])]);

const PLANT_AT = { flower: [470, 48], fruit: [404, 112], leaf: [414, 184], stem: [496, 252], seed: [404, 330], root: [470, 392] };
const BODY_AT = { flower: [164, 38], fruit: [150, 59], leaf: [132, 122], stem: [158, 146], seed: [138, 180], root: [150, 216] };

// איברים בקו: עין, פה, ריאות, לב וכלי דם, כבד, מעיים. הגוון לפי החלק בצמח.
function organs(parts, sel) {
  const h = Object.fromEntries(parts.map((p) => [p.id, p.hue]));
  const op = (id) => (id === sel ? .62 : .2);
  return `<g stroke="${INK}" stroke-width=".8" stroke-linejoin="round">
    <g class="og" data-part="flower"><path d="M136 40q7-6 14 0q-7 5-14 0zM150 40q7-6 14 0q-7 5-14 0z" fill="${h.flower}" fill-opacity="${op("flower")}"/><circle cx="143" cy="40" r="1.8" fill="${INK}"/><circle cx="157" cy="40" r="1.8" fill="${INK}"/><path d="M150 44v6l-2 2h4" fill="none"/></g>
    <g class="og" data-part="fruit"><path d="M142 57q8 6 16 0q-8 3-16 0z" fill="${h.fruit}" fill-opacity="${Math.max(.35, op("fruit"))}"/></g>
    <g class="og" data-part="leaf"><path d="M147 98v14M147 112l-10 10M147 112l8 8" fill="none"/>
      <path d="M144 104c-10-2-20 8-22 24s-2 30 8 32 14-8 15-20 0-30-1-36z" fill="${h.leaf}" fill-opacity="${op("leaf")}"/>
      <path d="M156 104c10-2 20 8 22 24s2 30-8 32-12-6-13-14c4-4 2-10-2-14 0-10 0-24 1-28z" fill="${h.leaf}" fill-opacity="${op("leaf")}"/></g>
    <g class="og" data-part="stem"><path d="M150 132c-8-8-18 2-10 12l12 12 10-12c6-10-4-18-12-12z" fill="#b5473a" fill-opacity="${Math.max(.45, op("stem"))}"/>
      <path d="M152 156v84M152 240l-14 60-4 100M152 240l14 60 4 100M150 100l-34 4-14 60-10 80M154 100l34 4 14 60 10 80" fill="none" stroke="#b5473a" stroke-opacity="${sel === "stem" ? .9 : .35}" stroke-width="${sel === "stem" ? 1.4 : .9}"/></g>
    <g class="og" data-part="seed"><path d="M124 168c10-6 30-6 38 2-2 10-12 16-24 18s-16-8-14-20z" fill="${h.seed}" fill-opacity="${op("seed")}"/></g>
    <g class="og" data-part="root"><path d="M130 196h40v8h-40v8h40v8h-40v8h40" fill="none" stroke="${h.root}" stroke-opacity="${sel === "root" ? 1 : .55}" stroke-width="${sel === "root" ? 3.2 : 2.4}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M128 192c-4 18-4 34 2 44M172 192c4 18 4 34-2 44" fill="none" stroke="${h.root}" stroke-width="3" stroke-opacity="${sel === "root" ? .9 : .4}" stroke-linecap="round"/></g>
  </g>`;
}

// לוח בוטני: שורש בחתך קרקע, גבעול עם חתך רוחב, עלים עם עורקים, פרח, פרי וזרע נובט.
function plantDrawing(sel) {
  const leaf = (x0, y0, x1, y1, side) => {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, nx = (y1 - y0) * .32 * side, ny = -(x1 - x0) * .32 * side;
    const veins = [.25, .42, .58, .74].map((t) => { const vx = x0 + (x1 - x0) * t, vy = y0 + (y1 - y0) * t; return `M${vx} ${vy}l${(nx * .55 + (x1 - x0) * .08).toFixed(1)} ${(ny * .55 + (y1 - y0) * .08).toFixed(1)}M${vx} ${vy}l${(-nx * .55 + (x1 - x0) * .08).toFixed(1)} ${(-ny * .55 + (y1 - y0) * .08).toFixed(1)}`; }).join("");
    return `<path d="M${x0} ${y0}Q${mx + nx} ${my + ny} ${x1} ${y1}Q${mx - nx} ${my - ny} ${x0} ${y0}z" fill="url(#pv-leaf)" stroke="${INK}" stroke-width=".9"/><path d="M${x0} ${y0}L${x1} ${y1}${veins}" fill="none" stroke="${INK}" stroke-width=".5" stroke-opacity=".7"/>`;
  };
  return `<g class="pv-plant">
    <rect x="352" y="300" width="288" height="140" fill="url(#pv-soil)"/><rect x="352" y="300" width="288" height="140" fill="url(#pv-dots)"/>
    <path d="M352 300H640" stroke="${INK}" stroke-width="1"/>
    <g fill="none" stroke="#5b4630" stroke-linecap="round">
      <path d="M470 300C471 330 468 360 472 420" stroke-width="3"/>
      <path d="M470 320C455 330 440 344 424 372M470 334C488 348 504 360 520 392M471 360C462 376 452 392 448 414M471 372C482 386 494 400 498 424" stroke-width="1.6"/>
      <path d="M436 356l-6-3M432 362l-7 1M500 368l6-2M508 378l7 0M455 392l-6 2M490 404l6 1M444 349l-5-5M512 384l5-4" stroke-width=".6"/>
    </g>
    <path d="M467 300C466 240 469 160 468 70L472 70C473 160 474 240 473 300Z" fill="#a9bf88" stroke="${INK}" stroke-width=".9"/>
    <path d="M468 210h3M468 160h3M468 118h3" stroke="${INK}" stroke-width=".8"/>
    ${leaf(469, 210, 384, 170, 1)}${leaf(471, 160, 600, 128, -1)}
    <path d="M470 118C455 112 440 108 418 110" fill="none" stroke="${INK}" stroke-width="1"/>
    <circle cx="404" cy="116" r="15" fill="url(#pv-fruit)" stroke="${INK}" stroke-width=".9"/><path d="M398 108q4-3 9 0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/>
    <g transform="translate(470 54)">${[0, 72, 144, 216, 288].map((a) => `<g transform="rotate(${a})"><path d="M0 -4C-8 -10 -8 -22 0 -26C8 -22 8 -10 0 -4z" fill="#efd6e1" stroke="${INK}" stroke-width=".8"/><path d="M0 -6V-22M0 -10l-3 -6M0 -10l3 -6" stroke="${INK}" stroke-width=".35" fill="none"/></g>`).join("")}
      ${[20, 92, 164, 236, 308].map((a) => `<g transform="rotate(${a})"><path d="M0 0V-9" stroke="${INK}" stroke-width=".6"/><circle cy="-10" r="1.4" fill="#d9a12a" stroke="${INK}" stroke-width=".4"/></g>`).join("")}<circle r="3" fill="#e8c96a" stroke="${INK}" stroke-width=".6"/></g>
    <g transform="translate(404 326) rotate(-18)"><ellipse rx="12" ry="7.5" fill="#d8bf8e" stroke="${INK}" stroke-width=".9"/><path d="M-6 -1c3-4 9-4 12 0" fill="none" stroke="${INK}" stroke-width=".5"/><path d="M10 3c6 6 6 14 4 20" fill="none" stroke="#7a5b38" stroke-width="1.2"/><path d="M-4 -6c-2-8 2-14 8-16" fill="none" stroke="#6f8f47" stroke-width="1.4"/></g>
    <g transform="translate(580 252)"><circle r="22" fill="#e9f0dc" stroke="${INK}" stroke-width=".9"/><circle r="16" fill="none" stroke="${INK}" stroke-width=".4" stroke-dasharray="1.5 1.5"/>
      ${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, x = 13 * Math.cos(a), y = 13 * Math.sin(a); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#f0d79a" stroke="${INK}" stroke-width=".4"/><circle cx="${(x * .82).toFixed(1)}" cy="${(y * .82).toFixed(1)}" r="1.6" fill="#8fb4d6"/>`; }).join("")}
      <text y="36" text-anchor="middle" class="pv-cap">חתך רוחב בגבעול</text></g>
    <path d="M476 252H556" stroke="${INK}" stroke-width=".5" stroke-dasharray="2 2"/>
  </g>`;
}

// מפת העל: לוח מדעי. הצמח מימין, הגוף משמאל, ומספר לכל זוג (1 שורש ומעי, 2 גבעול וכלי דם...).
export function overviewSVG(parts, sel) {
  const links = parts.map((p) => {
    const [x1, y1] = PLANT_AT[p.id], [x2, y2] = BODY_AT[p.id], on = p.id === sel, n = NUM[p.id];
    const d = `M${x1} ${y1}C${x1 - 110} ${y1}, ${x2 + 110} ${y2}, ${x2} ${y2}`;
    const bub = (x, y) => `<g class="pv-num"><circle cx="${x}" cy="${y}" r="${on ? 10 : 8}" fill="${on ? p.hue : "#fff"}" stroke="${on ? p.hue : INK}" stroke-width="${on ? 1.5 : .9}"/><text x="${x}" y="${y + 3.6}" text-anchor="middle" class="pv-n ${on ? "on" : ""}">${n}</text></g>`;
    return `<g class="pv-link ${on ? "on" : ""}" data-part="${p.id}" role="button" tabindex="0" aria-label="${n}. ${p.he}, בגוף: ${p.organ}">
      <path class="pv-hit" d="${d}"/>
      <path class="pv-line" d="${d}" stroke="${on ? p.hue : INK}"/>
      ${on ? `<path class="pv-flow" d="${d}" stroke="${p.hue}"/>` : ""}
      ${bub(x1, y1)}${bub(x2, y2)}
      <text x="632" y="${y1 + 4}" text-anchor="end" class="pv-t ${on ? "on" : ""}">${p.he} <tspan class="pv-tn">${n}</tspan></text>
      <path d="M${x1 + 11} ${y1}H${590 - p.he.length * 6}" class="pv-lead"/>
      <text x="8" y="${y2 + 4}" text-anchor="start" class="pv-t ${on ? "on" : ""}"><tspan class="pv-tn">${n}</tspan> ${p.organ}</text>
      <path d="M${16 + p.organ.length * 6.4 + 14} ${y2}H${x2 - 11}" class="pv-lead"/>
    </g>`;
  }).join("");
  return `<svg class="pv pv-sci" viewBox="0 0 640 440" role="img" aria-label="לוח: כל חלק בצמח והאיבר המקביל בגוף, ממוספרים" style="direction:ltr">
    <defs>
      <linearGradient id="pv-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe6d4"/><stop offset="1" stop-color="#d9c8a6"/></linearGradient>
      <pattern id="pv-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#7a6142" fill-opacity=".45"/><circle cx="4.5" cy="4.5" r=".4" fill="#7a6142" fill-opacity=".35"/></pattern>
      <linearGradient id="pv-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d7e5bf"/><stop offset="1" stop-color="#a9c487"/></linearGradient>
      <radialGradient id="pv-fruit" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e7b49b"/><stop offset="1" stop-color="#a8513f"/></radialGradient>
      <linearGradient id="pv-skin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ece4d7"/><stop offset=".5" stop-color="#f8f4ee"/><stop offset="1" stop-color="#e6dccc"/></linearGradient>
      <pattern id="pv-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="4" stroke="${INK}" stroke-opacity=".08" stroke-width="1"/></pattern>
    </defs>
    <rect width="640" height="440" fill="#fcfbf8"/>
    <path d="M326 14V426" stroke="#e5e2da"/>
    <text x="482" y="20" class="pv-h" text-anchor="middle">צמח</text>
    <text x="150" y="20" class="pv-h" text-anchor="middle">גוף</text>
    <g class="pv-body"><ellipse cx="150" cy="44" rx="19" ry="24" fill="url(#pv-skin)" stroke="${INK}" stroke-width="1"/><path d="${BODY_D}" fill="url(#pv-skin)" stroke="${INK}" stroke-width="1"/><path d="${BODY_D}" fill="url(#pv-hatch)"/>${organs(parts, sel)}</g>
    ${plantDrawing(sel)}
    ${links}
    <text x="320" y="436" text-anchor="middle" class="pv-cap">השוואה של תפקוד, לא של צורה. מספר זהה: אותה משימה.</text>
  </svg>`;
}

// ===== תרשימי מנגנון: חתך כמו בספר לימוד, עם תוויות, חצים וזרימה =====
const lb = (x, y, t, anchor = "start", tx, ty) => `${tx !== undefined ? `<path d="M${x} ${y}L${tx} ${ty}" class="mv-lead"/>` : ""}<text x="${x + (anchor === "start" ? 2 : anchor === "end" ? -2 : 0)}" y="${y - 2}" text-anchor="${anchor}" class="mv-lb">${t}</text>`;
const arrow = (d, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.2" marker-end="url(#mv-arr)" style="color:${c}"/>`;

const MECH = {
  root: {
    plant: `<rect width="200" height="150" fill="#f1e9d8"/><rect width="200" height="150" fill="url(#mv-dots)"/>
      <path d="M82 0V150M118 0V150" stroke="${INK}" stroke-width="1"/><rect x="82" y="0" width="36" height="150" fill="#e6efd6"/>
      <rect x="94" y="0" width="12" height="150" fill="#cfe0f0" stroke="${INK}" stroke-width=".6"/>
      ${[40, 62, 84, 106, 128].map((y) => `<path d="M82 ${y}c-14 -2 -26 4 -40 2M118 ${y + 8}c14 -2 26 4 40 2" fill="none" stroke="${INK}" stroke-width=".7"/>`).join("")}
      ${mover("M30 104C50 104 70 106 82 106L100 100L100 6", "#2f78b8", 3.4, 4, 2)}
      ${arrow("M100 40V14", "#2f78b8")}
      ${lb(150, 100, "שערת שורש", "middle", 150, 112)}${lb(122, 24, "עצה: מים למעלה", "start")}${lb(18, 96, "H₂O", "start")}`,
    body: `<rect width="200" height="150" fill="#fbf3ee"/>
      <path d="M0 150V100${[0, 1, 2, 3, 4].map((i) => `C${i * 40 + 6} 100 ${i * 40 + 6} 30 ${i * 40 + 20} 30C${i * 40 + 34} 30 ${i * 40 + 34} 100 ${i * 40 + 40} 100`).join("")}V150z" fill="#f3cfc2" stroke="${INK}" stroke-width=".9"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${i * 40 + 15} 110V48q5-8 10 0V110" fill="none" stroke="#b5473a" stroke-width=".8"/>`).join("")}
      ${mover("M60 4L60 22L58 60", "#c8892b", 2.8, 3, 2)}${mover("M140 4L140 22L142 60", "#c8892b", 2.8, 3, 2)}
      ${lb(104, 20, "חלל המעי", "middle")}${lb(186, 40, "סיס", "end", 175, 50)}${lb(186, 136, "נימי דם", "end", 166, 120)}`,
    pcap: "**שערות השורש** מגדילות את שטח המגע. המים נכנסים ועולים ב**עצה**.", bcap: "**סיסי המעי** מגדילים את השטח. המזון עובר ל**נימי הדם**."
  },
  stem: {
    plant: `<rect width="200" height="150" fill="#f7f8f2"/>
      <circle cx="70" cy="75" r="56" fill="#e3edd2" stroke="${INK}" stroke-width="1"/><circle cx="70" cy="75" r="50" fill="none" stroke="${INK}" stroke-width=".4" stroke-dasharray="2 2"/>
      ${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5, x = 70 + 38 * Math.cos(a), y = 75 + 38 * Math.sin(a); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a * 180 / Math.PI + 90).toFixed(0)})"><ellipse rx="6" ry="8" fill="#f2dfae" stroke="${INK}" stroke-width=".5"/><ellipse cy="3" rx="4" ry="3.6" fill="#b7d0e8" stroke="${INK}" stroke-width=".4"/></g>`; }).join("")}
      <rect x="150" y="10" width="14" height="130" fill="#cfe0f0" stroke="${INK}" stroke-width=".6"/><rect x="170" y="10" width="14" height="130" fill="#f2dfae" stroke="${INK}" stroke-width=".6"/>
      ${mover("M157 138V12", "#2f78b8", 3, 4)}${mover("M177 12V138", "#b0781e", 3, 4)}
      ${lb(70, 146, "צרור הובלה", "middle", 98, 104)}${lb(157, 8, "עצה ↑", "middle")}${lb(177, 148, "שיפה ↓", "middle")}`,
    body: `<rect width="200" height="150" fill="#fbf6f4"/>
      <circle cx="55" cy="60" r="34" fill="#e7a596" stroke="${INK}" stroke-width="1"/><circle cx="55" cy="60" r="18" fill="#c94a3a"/>
      <ellipse cx="148" cy="62" rx="36" ry="22" fill="#c9cfe6" stroke="${INK}" stroke-width="1"/><ellipse cx="148" cy="62" rx="30" ry="16" fill="#4a6ab8"/>
      <path d="M10 120H190" stroke="#c94a3a" stroke-width="7" stroke-linecap="round"/><path d="M10 138H190" stroke="#4a6ab8" stroke-width="7" stroke-linecap="round"/>
      ${mover("M14 120H186", "#fff", 2.2, 4, 1.6)}${mover("M186 138H14", "#fff", 2.2, 4, 1.6)}
      ${lb(55, 108, "עורק: דופן עבה", "middle")}${lb(148, 100, "וריד: דופן דקה", "middle")}`,
    pcap: "**מים עולים** בעצה, **סוכר יורד** בשיפה, בצרורות סביב הגבעול.", bcap: "**עורק** מוביל מהלב לגוף, **וריד** מחזיר ללב."
  },
  leaf: {
    plant: `<rect width="200" height="150" fill="#f8faf3"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<rect x="${10 + i * 18}" y="26" width="18" height="8" fill="#eef4e2" stroke="${INK}" stroke-width=".5"/><rect x="${12 + i * 18}" y="36" width="14" height="34" rx="6" fill="#b7d48e" stroke="${INK}" stroke-width=".5"/>`).join("")}
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${18 + (i % 7) * 26 + (i > 6 ? 12 : 0)}" cy="${86 + (i > 6 ? 18 : 0)}" r="9" fill="#d3e5b4" stroke="${INK}" stroke-width=".5"/>`).join("")}
      <path d="M10 124H86M114 124H190" stroke="${INK}" stroke-width=".8"/><ellipse cx="94" cy="126" rx="6" ry="4" fill="#b7d48e" stroke="${INK}" stroke-width=".6"/><ellipse cx="106" cy="126" rx="6" ry="4" fill="#b7d48e" stroke="${INK}" stroke-width=".6"/>
      <g class="mv-sun">${[30, 60, 90, 120, 150].map((x) => `<path d="M${x} 2L${x - 4} 20" stroke="#e0b030" stroke-width="1.2"/>`).join("")}</g>
      ${mover("M100 148V128L100 98", "#555", 3, 3, 1.8)}${mover("M100 98V128L118 148", "#2f78b8", 3, 3, 1.8)}
      ${lb(60, 146, "פיונית", "middle", 92, 130)}${lb(186, 54, "תאי עמוד", "end", 168, 52)}${lb(76, 144, "", "start")}<text x="128" y="146" class="mv-lb">CO₂ ↑ · O₂ ↓</text>`,
    body: `<rect width="200" height="150" fill="#fdf6f4"/>
      <circle cx="90" cy="75" r="50" fill="#fbe1da" stroke="${INK}" stroke-width="1"/>
      <path d="M40 75C40 30 140 30 140 75C140 120 40 120 40 75" fill="none" stroke="#c94a3a" stroke-width="5" stroke-opacity=".75"/>
      <path d="M140 75H196" stroke="${INK}" stroke-width="10" stroke-opacity=".15"/>
      ${mover("M90 75L60 40", "#2f78b8", 2.6, 3, 2)}${mover("M62 110L90 80", "#555", 2.6, 3, 2)}
      ${lb(90, 78, "נאדית", "middle")}${lb(186, 120, "נים", "end", 136, 100)}<text x="12" y="146" class="mv-lb">O₂ ↓ · CO₂ ↑</text>`,
    pcap: "**פיונית** נפתחת: נכנס פחמן דו־חמצני, יוצא חמצן. **תאי העמוד** קולטים אור.", bcap: "**בנאדית**: החמצן עובר לדם, והפחמן הדו־חמצני יוצא. **הכיוון הפוך**."
  },
  flower: {
    plant: `<rect width="200" height="150" fill="#fdf8fa"/>
      <path d="M100 150V110" stroke="#6f8f47" stroke-width="3"/><ellipse cx="100" cy="104" rx="12" ry="10" fill="#cfe0b0" stroke="${INK}" stroke-width=".8"/>
      <path d="M90 100C60 90 50 50 70 30C80 60 90 80 96 98zM110 100C140 90 150 50 130 30C120 60 110 80 104 98z" fill="#efd6e1" stroke="${INK}" stroke-width=".8"/>
      <path d="M100 98V52" stroke="${INK}" stroke-width="1.6"/><ellipse cx="100" cy="50" rx="5" ry="3" fill="#e0b84a" stroke="${INK}" stroke-width=".6"/>
      <path d="M94 98C90 80 86 70 84 60M106 98C110 80 114 70 116 60" fill="none" stroke="${INK}" stroke-width=".7"/><circle cx="84" cy="58" r="3" fill="#d9a12a" stroke="${INK}" stroke-width=".4"/><circle cx="116" cy="58" r="3" fill="#d9a12a" stroke="${INK}" stroke-width=".4"/>
      ${[0, 1, 2].map((i) => `<circle class="mv-wave" cx="100" cy="70" r="40" fill="none" stroke="#a8507a" stroke-width=".8" style="animation-delay:${i * .8}s"/>`).join("")}
      ${lb(186, 40, "עלה כותרת", "end", 136, 44)}${lb(14, 54, "אבקן", "start", 82, 58)}${lb(14, 112, "שחלה", "start", 90, 104)}`,
    body: `<rect width="200" height="150" fill="#f8f9fb"/>
      <circle cx="110" cy="75" r="50" fill="#fff" stroke="${INK}" stroke-width="1"/><path d="M62 52C52 64 52 86 62 98" fill="none" stroke="${INK}" stroke-width="1.4"/>
      <ellipse cx="72" cy="75" rx="7" ry="18" fill="#dfe9f4" stroke="${INK}" stroke-width=".8"/><path d="M158 40C168 60 168 90 158 110" fill="none" stroke="#c94a3a" stroke-width="3"/>
      ${[-14, 0, 14].map((dy) => `<path d="M6 ${75 + dy}L72 ${75 + dy * .6}L158 75" fill="none" stroke="#d9a12a" stroke-width=".7" stroke-dasharray="3 2"/>`).join("")}
      ${lb(72, 104, "עדשה", "middle")}${lb(186, 130, "רשתית", "end", 160, 104)}${lb(40, 30, "קרנית", "middle", 58, 52)}`,
    pcap: "**צבע וריח** יוצאים מהפרח: אות למאביקים.", bcap: "**העדשה** ממקדת את האור על **הרשתית**: כאן נקלט האות."
  },
  fruit: {
    plant: `<rect width="200" height="150" fill="#fdf7f3"/>
      <path d="M100 2V18" stroke="#6f8f47" stroke-width="3"/><circle cx="100" cy="80" r="62" fill="#c76a4e" stroke="${INK}" stroke-width="1"/><circle cx="100" cy="80" r="56" fill="#f4d3bd"/>
      <circle cx="100" cy="80" r="56" fill="url(#mv-sugar)"/>${[[86, 70], [114, 70], [100, 96], [86, 92], [114, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="8" fill="#5b3a1a" stroke="${INK}" stroke-width=".4"/>`).join("")}
      ${lb(186, 22, "קליפה", "end", 152, 44)}${lb(186, 140, "ציפה: סוכר", "end", 140, 118)}${lb(14, 140, "זרע", "start", 84, 96)}`,
    body: `<rect width="200" height="150" fill="#fdf7f6"/>
      <path d="M0 64H200V150H0z" fill="#f1c3bc"/><path d="M0 64H200" stroke="${INK}" stroke-width="1"/>
      <path d="M80 64C70 90 74 120 100 124C126 120 130 90 120 64z" fill="#f8e2dc" stroke="${INK}" stroke-width=".9"/>
      ${[86, 93, 100, 107, 114].map((x) => `<path d="M${x} 68C${x - 2} 90 ${x} 110 100 120" fill="none" stroke="${INK}" stroke-width=".5"/>`).join("")}
      <path d="M100 124V150" stroke="#d9a12a" stroke-width="2"/>
      ${mover("M100 10V66", "#d9a12a", 2.4, 3, 2.2)}
      ${lb(186, 92, "פקעית טעם", "end", 122, 90)}${lb(14, 140, "עצב", "start", 98, 140)}<text x="112" y="24" class="mv-lb">סוכר</text>`,
    pcap: "**הציפה המתוקה** עוטפת את הזרעים: הזמנה לאכול ולפזר.", bcap: "**פקעית הטעם** מזהה מתוק, ו**העצב** מעביר את האות."
  },
  seed: {
    plant: `<rect width="200" height="150" fill="#fbf8f1"/>
      <ellipse cx="100" cy="75" rx="70" ry="60" fill="#b7915e" stroke="${INK}" stroke-width="1"/><ellipse cx="100" cy="75" rx="64" ry="54" fill="#f2e3c2"/><ellipse cx="100" cy="75" rx="64" ry="54" fill="url(#mv-starch)"/>
      <path d="M58 110C70 96 90 90 110 92C96 104 76 112 58 110z" fill="#cfe0a8" stroke="${INK}" stroke-width=".7"/><path d="M58 110l-10 8" stroke="#7a5b38" stroke-width="2"/>
      ${[50, 40, 30].map((r, i) => `<ellipse class="mv-ring" cx="112" cy="66" rx="${r}" ry="${r * .8}" fill="none" stroke="#b8862b" stroke-width=".8" style="animation-delay:${i * .6}s"/>`).join("")}
      ${lb(186, 16, "קליפת הזרע", "end", 150, 32)}${lb(186, 140, "אנדוספרם: עמילן", "end", 140, 104)}${lb(14, 140, "עובר", "start", 62, 110)}`,
    body: `<rect width="200" height="150" fill="#fbf8f4"/>
      <path d="M10 20H96V130H10z" fill="#f2d2b8" stroke="${INK}" stroke-width=".9"/><circle cx="54" cy="60" r="12" fill="#e7b08f" stroke="${INK}" stroke-width=".6"/>
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${22 + (i % 7) * 10}" cy="${92 + Math.floor(i / 7) * 14}" r="3" fill="#b8862b"/>`).join("")}
      <circle cx="150" cy="75" r="44" fill="#fbf1d8" stroke="${INK}" stroke-width=".9"/><circle cx="150" cy="75" r="34" fill="#f2df9e"/><circle cx="178" cy="100" r="5" fill="#e7b08f" stroke="${INK}" stroke-width=".5"/>
      ${mover("M54 4V86", "#b8862b", 2.6, 3, 2)}
      ${lb(53, 146, "גליקוגן בכבד", "middle")}${lb(150, 146, "שומן בתא שומן", "middle")}`,
    pcap: "**עמילן, חלבון ושומן** סביב **העובר**: אוכל לדרך הראשונה.", bcap: "**גליקוגן** בכבד ו**שומן** בתאי שומן: מאגר לימים בלי מזון."
  }
};
export function mechanismSVG(id, hue) {
  const m = MECH[id];
  if (!m) return "";
  const defs = `<defs><marker id="mv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>
    <pattern id="mv-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#7a6142" fill-opacity=".4"/></pattern>
    <pattern id="mv-sugar" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#d9a12a" fill-opacity=".5"/></pattern>
    <pattern id="mv-starch" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="#fff" stroke="#c9a96a" stroke-width=".4"/></pattern></defs>`;
  return `<div class="mv mv-sci" style="--hue:${hue}">
    <figure><span class="mv-tag">${icon("plant")}בצמח</span><svg viewBox="0 0 200 150" role="img" aria-label="בצמח">${defs}${m.plant}</svg><figcaption>${m.pcap.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")}</figcaption></figure>
    <figure><span class="mv-tag">${icon("body")}בגוף</span><svg viewBox="0 0 200 150" role="img" aria-label="בגוף">${defs}${m.body}</svg><figcaption>${m.bcap.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")}</figcaption></figure>
  </div>`;
}
