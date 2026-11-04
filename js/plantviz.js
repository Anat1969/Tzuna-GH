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
const PLANT_AT = { flower: [468, 62], fruit: [528, 150], leaf: [408, 188], stem: [468, 250], seed: [404, 318], root: [470, 372] };
const BODY_AT = { flower: [150, 60], fruit: [150, 92], leaf: [160, 150], stem: [168, 182], seed: [158, 222], root: [156, 262] };

// מפת העל: הצמח מימין, הגוף משמאל, קו לכל זוג. הקו של החלק הנבחר נמשך כמו עט.
export function overviewSVG(parts, sel) {
  const links = parts.map((p) => {
    const [x1, y1] = PLANT_AT[p.id], [x2, y2] = BODY_AT[p.id], on = p.id === sel;
    const d = `M${x1} ${y1} C ${x1 - 120} ${y1}, ${x2 + 120} ${y2}, ${x2} ${y2}`;
    return `<g class="pv-link ${on ? "on" : ""}" data-part="${p.id}" role="button" tabindex="0" aria-label="${p.he}, בגוף: ${p.organ}">
      <path class="pv-hit" d="${d}"/>
      <path class="pv-line" d="${d}" stroke="${p.hue}"/>
      ${on ? `<path class="pv-flow" d="${d}" stroke="${p.hue}"/>` : ""}
      <circle cx="${x1}" cy="${y1}" r="${on ? 15 : 11}" fill="#fff" stroke="${p.hue}" stroke-width="${on ? 2.5 : 1.5}"/>
      <g transform="translate(${x1 - 8},${y1 - 8}) scale(.68)" style="color:${p.hue}">${iconG(p.id)}</g>
      <circle cx="${x2}" cy="${y2}" r="${on ? 15 : 11}" fill="#fff" stroke="${p.hue}" stroke-width="${on ? 2.5 : 1.5}"/>
      <g transform="translate(${x2 - 8},${y2 - 8}) scale(.68)" style="color:${p.hue}">${iconG(ORGAN_ICON[p.id])}</g>
      <text x="${x1 + 22}" y="${y1 + 4}" text-anchor="start" class="pv-t ${on ? "on" : ""}">${p.he}</text>
      <text x="${x2 - 22}" y="${y2 + 4}" text-anchor="end" class="pv-t ${on ? "on" : ""}">${p.organ}</text>
    </g>`;
  }).join("");
  return `<svg class="pv" viewBox="0 0 600 420" role="img" aria-label="מפה: כל חלק בצמח והאיבר המקביל בגוף" style="direction:ltr">
    <defs>
      <linearGradient id="pv-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c7a6"/><stop offset="1" stop-color="#8a6a4a"/></linearGradient>
      <linearGradient id="pv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4f9"/><stop offset="1" stop-color="#fbfaf6"/></linearGradient>
      <radialGradient id="pv-fruit" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#e98a6f"/><stop offset="1" stop-color="#9a2f28"/></radialGradient>
      <linearGradient id="pv-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fbf5a"/><stop offset="1" stop-color="#3f6f2a"/></linearGradient>
      <radialGradient id="pv-skin" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#f3ece2"/><stop offset="1" stop-color="#dccdb9"/></radialGradient>
      <filter id="pv-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".18"/></filter>
    </defs>
    <rect x="300" y="0" width="300" height="300" fill="url(#pv-sky)"/>
    <rect x="300" y="300" width="300" height="120" fill="url(#pv-soil)"/>
    <g class="pv-plant" filter="url(#pv-sh)">
      <path d="M470 300 L470 395 M470 330 Q450 360 430 395 M470 330 Q492 360 512 398 M470 350 Q478 380 492 410 M452 352 l-14 6 M488 356 l14 4" stroke="#6b4b2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M470 300 L470 78" stroke="#5a7a3a" stroke-width="6" stroke-linecap="round"/>
      <path d="M470 200 C440 170 410 175 398 190 C420 205 450 210 470 200z" fill="url(#pv-leaf)"/>
      <path d="M470 160 C500 130 530 135 542 150 C520 168 492 172 470 160z" fill="url(#pv-leaf)"/>
      <path d="M470 120 Q500 128 516 132" stroke="#5a7a3a" stroke-width="3" fill="none"/>
      <circle cx="528" cy="150" r="14" fill="url(#pv-fruit)"/>
      <g transform="translate(470 60)"><circle r="7" fill="#f2c14e"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="7" ry="13" transform="rotate(${a}) translate(0 -14)" fill="#e9a3c0" opacity=".92"/>`).join("")}<circle r="6" fill="#f2c14e"/></g>
      <ellipse cx="404" cy="318" rx="9" ry="6" fill="#c9a46a" stroke="#8a6a3a"/>
      <path d="M404 312 q-2 -10 6 -14" stroke="#7a9a3a" stroke-width="2" fill="none"/>
    </g>
    <g class="pv-body" filter="url(#pv-sh)">
      <circle cx="130" cy="64" r="30" fill="url(#pv-skin)"/>
      <path d="M130 100 c-34 0 -54 16 -56 44 l-8 110 c0 9 14 11 16 2 l10 -84 h4 v168 c0 11 18 11 18 0 l4 -104 h24 l4 104 c0 11 18 11 18 0 v-168 h4 l10 84 c2 9 16 7 16 -2 l-8 -110 c-2 -28 -22 -44 -56 -44z" fill="url(#pv-skin)"/>
    </g>
    <text x="450" y="22" class="pv-h" text-anchor="middle">צמח</text>
    <text x="130" y="22" class="pv-h" text-anchor="middle">גוף</text>
    ${links}
  </svg>`;
}

// תרשים מנגנון לכל חלק: בצמח ובגוף, זה ליד זה, עם תנועה שמראה את התפקוד.
const drops = (n, x, y0, y1, color, cls = "mv-up", r = 3) => Array.from({ length: n }, (_, i) =>
  `<circle class="${cls}" cx="${x + (i % 2 ? 6 : -6)}" cy="${y0}" r="${r}" fill="${color}" style="--d:${y1 - y0}px;animation-delay:${(i * 0.45).toFixed(2)}s"/>`).join("");

const MECH = {
  root: {
    plant: `<rect x="0" y="40" width="160" height="110" fill="url(#mv-soil)"/>
      <path d="M80 0 V130 M80 60 Q60 90 40 130 M80 60 Q100 90 122 132" stroke="#6b4b2a" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${[[66, 80], [94, 84], [56, 100], [104, 106], [48, 118], [114, 122]].map(([x, y]) => `<path d="M${x} ${y} l${x < 80 ? -10 : 10} -3 M${x} ${y} l${x < 80 ? -9 : 9} 5" stroke="#8a6a4a" stroke-width="1.2"/>`).join("")}
      ${drops(6, 80, 130, 10, "#4a90c8")}`,
    body: `<rect x="0" y="70" width="160" height="80" fill="#f3d9cf"/>
      <path d="M0 70 ${Array.from({ length: 8 }, (_, i) => `Q${i * 20 + 10} 20 ${i * 20 + 20} 70`).join(" ")}" fill="#e9b8a7" stroke="#b5735f" stroke-width="1.5"/>
      ${[10, 50, 90, 130].map((x, i) => `<circle class="mv-in" cx="${x + 10}" cy="12" r="3" fill="#c8892b" style="--d:46px;animation-delay:${i * 0.5}s"/>`).join("")}`,
    pcap: "שערות השורש מגדילות את השטח. המים עולים.", bcap: "סיסי המעי מגדילים את השטח. המזון נספג."
  },
  stem: {
    plant: `<rect x="56" y="0" width="48" height="150" rx="10" fill="#cfe0b8" stroke="#5a7a3a" stroke-width="2"/>
      <line x1="70" y1="0" x2="70" y2="150" stroke="#9fc2df" stroke-width="8"/><line x1="90" y1="0" x2="90" y2="150" stroke="#f0d9a0" stroke-width="8"/>
      ${drops(5, 70, 145, 5, "#2f78b8", "mv-up", 2.6).replace(/cx="(\d+)"/g, 'cx="70"')}
      ${drops(5, 90, 5, 145, "#c08a1e", "mv-down", 2.6).replace(/cx="(\d+)"/g, 'cx="90"')}`,
    body: `<path d="M0 50 H160" stroke="#c94a3a" stroke-width="14" stroke-linecap="round"/><path d="M0 100 H160" stroke="#4a6ab8" stroke-width="14" stroke-linecap="round"/>
      ${[0, 1, 2, 3].map((i) => `<circle class="mv-right" cx="6" cy="50" r="3" fill="#fff" style="--d:148px;animation-delay:${i * 0.6}s"/>`).join("")}
      ${[0, 1, 2, 3].map((i) => `<circle class="mv-left" cx="154" cy="100" r="3" fill="#fff" style="--d:-148px;animation-delay:${i * 0.6}s"/>`).join("")}`,
    pcap: "מים עולים (כחול), סוכר יורד (צהוב).", bcap: "עורק מוביל לגוף, וריד מחזיר ללב."
  },
  leaf: {
    plant: `<g class="mv-sun"><circle cx="20" cy="18" r="10" fill="#f2c14e"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="20" y1="18" x2="${20 + 18 * Math.cos(a * Math.PI / 180)}" y2="${18 + 18 * Math.sin(a * Math.PI / 180)}" stroke="#f2c14e" stroke-width="2"/>`).join("")}</g>
      <path d="M30 130 C30 70 80 35 150 30 C145 100 100 135 30 130z" fill="url(#mv-leaf)"/><path d="M30 130 L120 55" stroke="#2f5a1f" stroke-width="1.5"/>
      <text class="mv-gas mv-in2" x="138" y="120" fill="#555">CO₂</text><text class="mv-gas mv-out2" x="88" y="96" fill="#2f78b8">O₂</text>`,
    body: `<circle cx="60" cy="80" r="44" fill="#f5c9c0" stroke="#b5735f" stroke-width="2"/><circle cx="60" cy="80" r="30" fill="#fbe3dd"/>
      <path d="M104 80 H160" stroke="#b5735f" stroke-width="10" stroke-linecap="round"/>
      <text class="mv-gas mv-in2" x="132" y="58" fill="#2f78b8">O₂</text><text class="mv-gas mv-out2" x="44" y="86" fill="#555">CO₂</text>`,
    pcap: "קולט פחמן דו־חמצני, פולט חמצן.", bcap: "בנאדית הריאה: ההפך. קולטת חמצן."
  },
  flower: {
    plant: `<g transform="translate(50 80)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="10" ry="20" transform="rotate(${a}) translate(0 -20)" fill="#e9a3c0"/>`).join("")}<circle r="9" fill="#f2c14e"/></g>
      ${[0, 1, 2].map((i) => `<circle class="mv-wave" cx="50" cy="80" r="30" fill="none" stroke="#a8507a" stroke-width="1.5" style="animation-delay:${i * 0.8}s"/>`).join("")}
      <g transform="translate(130 70)"><ellipse rx="9" ry="6" fill="#f2c14e" stroke="#333"/><path d="M-3 -6 v12 M3 -6 v12" stroke="#333"/><ellipse cx="-2" cy="-8" rx="6" ry="4" fill="#dfe9f2" opacity=".9"/></g>`,
    body: `<path d="M20 80 S50 40 90 40 S150 80 150 80 S120 120 90 120 S20 80 20 80z" fill="#fff" stroke="#555" stroke-width="2"/>
      <circle cx="90" cy="80" r="22" fill="#5b7f3a"/><circle cx="90" cy="80" r="10" fill="#1a1a18"/><circle cx="84" cy="74" r="3" fill="#fff"/>
      ${[0, 1, 2].map((i) => `<path class="mv-wave2" d="M10 40 q-8 40 0 80" fill="none" stroke="#a8507a" stroke-width="1.5" style="animation-delay:${i * 0.8}s"/>`).join("")}`,
    pcap: "צבע וריח: אות שיוצא אל העולם.", bcap: "העין והאף: החושים שקולטים את האות."
  },
  fruit: {
    plant: `<path d="M80 0 V30" stroke="#5a7a3a" stroke-width="4"/><circle cx="80" cy="74" r="44" fill="url(#mv-fruit)"/>
      <ellipse cx="80" cy="74" rx="26" ry="20" fill="#f6d7c4" opacity=".8"/>${[[70, 70], [90, 70], [80, 82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="6" fill="#5b3a1a"/>`).join("")}
      <ellipse class="mv-fall" cx="80" cy="120" rx="4" ry="6" fill="#5b3a1a"/>`,
    body: `<path d="M20 70 Q80 30 140 70 Q80 130 20 70z" fill="#e88b84" stroke="#a24a44" stroke-width="2"/><path d="M80 52 V100" stroke="#a24a44" stroke-width="1.5"/>
      ${[[50, 64], [110, 64], [64, 84], [96, 84]].map(([x, y], i) => `<circle class="mv-pop" cx="${x}" cy="${y}" r="4" fill="#f2c14e" style="animation-delay:${i * 0.35}s"/>`).join("")}`,
    pcap: "מתיקות סביב הזרעים: הזמנה לאכול ולפזר.", bcap: "הלשון מזהה מתוק: ההזמנה מתקבלת."
  },
  seed: {
    plant: `<ellipse cx="80" cy="80" rx="54" ry="66" fill="#e2c48c" stroke="#8a6a3a" stroke-width="2"/>
      ${[48, 36, 24].map((r, i) => `<ellipse class="mv-ring" cx="80" cy="84" rx="${r}" ry="${r * 1.2}" fill="none" stroke="#b8862b" stroke-width="2" style="animation-delay:${i * 0.6}s"/>`).join("")}
      <path d="M80 30 q-12 14 0 26" stroke="#5a7a3a" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    body: `<rect x="40" y="20" width="80" height="120" rx="12" fill="#fff" stroke="#555" stroke-width="2"/><rect x="66" y="10" width="28" height="12" rx="3" fill="#555"/>
      <rect class="mv-fill" x="46" y="26" width="68" height="108" rx="8" fill="#b8862b"/>`,
    pcap: "עמילן, חלבון ושומן סביב הנבט.", bcap: "הגוף אוגר אנרגיה לימים בלי מזון."
  }
};
export function mechanismSVG(id, hue) {
  const m = MECH[id];
  if (!m) return "";
  return `<div class="mv" style="--hue:${hue}">
    <figure><svg viewBox="0 0 160 150" role="img" aria-label="בצמח: ${m.pcap}">
      <defs><linearGradient id="mv-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3d2b2"/><stop offset="1" stop-color="#9a7a55"/></linearGradient>
      <linearGradient id="mv-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ccc66"/><stop offset="1" stop-color="#3f6f2a"/></linearGradient>
      <radialGradient id="mv-fruit" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ef9a7a"/><stop offset="1" stop-color="#9a2f28"/></radialGradient></defs>
      ${m.plant}</svg><figcaption>${icon("plant")}<span>${m.pcap}</span></figcaption></figure>
    <span class="mv-eq" aria-hidden="true">↔</span>
    <figure><svg viewBox="0 0 160 150" role="img" aria-label="בגוף: ${m.bcap}">${m.body}</svg><figcaption>${icon("body")}<span>${m.bcap}</span></figcaption></figure>
  </div>`;
}
