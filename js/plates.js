// גיליונות הרבריום: איור קו לכל מזון, נבנה בקוד (סעיף 7.3: בלי צילום מתאים, איור ברוח ה-DNA).
// שפה אחת: קו דיו דק, מילוי בגוון הפריט בשקיפות, עלים בירוק־אפור, וחתך כשהוא מלמד משהו על המבנה.
const INK = "#2a2a26";
const LEAF = "#9aa88a";
const LEAF_INK = "#4a5a3a";
const sw = 1.1;

const leaf = (x, y, len, w, ang, fill = LEAF, ink = LEAF_INK) =>
  `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M0 0Q${len * .45} ${-w} ${len} 0Q${len * .45} ${w} 0 0Z" fill="${fill}" fill-opacity=".55" stroke="${ink}" stroke-width="${sw}"/><path d="M0 0L${len * .9} 0" stroke="${ink}" stroke-width=".6" fill="none"/></g>`;
const stem = (d, w = 1.4) => `<path d="${d}" fill="none" stroke="${LEAF_INK}" stroke-width="${w}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill, op = .85, rot = 0) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="${fill}" fill-opacity="${op}" stroke="${INK}" stroke-width="${sw}"/>`;
const circ = (x, y, r, fill, op = .85) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" fill-opacity="${op}" stroke="${INK}" stroke-width="${sw}"/>`;
const line = (d, w = .7, c = INK) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const label = (t) => `<text x="60" y="116" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="5" fill="#84837D" style="direction:ltr">${t}</text>`;

function ear(x, y, n, h, fill, awn = 0, ang = 0) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const yy = y - i * (h / n);
    const side = i % 2 ? 1 : -1;
    s += ell(x + side * 3.2, yy, 2.6, 4.2, fill, .8, side * 22);
    if (awn) s += line(`M${x + side * 4} ${yy - 3}L${x + side * (6 + awn * .25)} ${yy - 3 - awn}`, .5);
  }
  return `<g transform="rotate(${ang} ${x} ${y})">${s}</g>`;
}

const SHAPES = {
  olive: (h) => stem("M100 104Q70 80 52 52Q40 34 22 20") +
    leaf(84, 88, 26, 4.2, -150) + leaf(78, 82, 24, 4, -40) + leaf(62, 66, 26, 4.2, -160) + leaf(58, 60, 24, 4, -55) +
    leaf(44, 42, 24, 4, -170) + leaf(40, 36, 22, 3.8, -70) + leaf(28, 26, 20, 3.4, -130) +
    stem("M66 70Q70 76 70 82", .8) + ell(70, 87, 5.2, 7, h, .9, -10) + stem("M50 50Q54 56 56 60", .8) + ell(57, 65, 4.6, 6.4, h, .9, -18) +
    ell(83, 92, 4.4, 6, h, .75, 8) + line("M68 84q1.5-2 3 0", .6, "#fff"),
  grain: (h) => stem("M60 112Q60 80 60 46") + leaf(60, 92, 34, 3, -125) + leaf(60, 78, 30, 2.6, -60) + ear(60, 46, 10, 34, h, 3),
  barley: (h) => stem("M60 112Q61 80 60 50") + leaf(60, 94, 32, 3, -130) + leaf(60, 80, 28, 2.6, -55) + ear(60, 50, 9, 30, h, 14),
  oat: (h) => {
    let s = stem("M62 112Q60 70 60 22") + leaf(61, 96, 30, 2.6, -130);
    [[60, 30, -1], [60, 40, 1], [60, 50, -1], [60, 60, 1], [60, 70, -1]].forEach(([x, y, d], i) => {
      const ex = x + d * (16 + i * 2), ey = y + 8;
      s += line(`M${x} ${y}Q${x + d * 8} ${y - 2} ${ex} ${ey}`, .6, LEAF_INK) + ell(ex, ey + 5, 2.8, 6, h, .8, d * -12) + ell(ex + d * 3, ey + 6, 2.4, 5.4, h, .6, d * -20);
    });
    return s;
  },
  grape: (h) => {
    let s = stem("M70 14Q66 20 62 26") + line("M74 20q8 -2 6 6q-2 6 4 6", .7, LEAF_INK) +
      `<path d="M72 30q14-10 26 0q-2 8 6 14q-10 2-12 12q-8-6-16-2q0-10-8-14q6-4 4-10z" fill="${LEAF}" fill-opacity=".5" stroke="${LEAF_INK}" stroke-width="${sw}"/>` + line("M76 34L92 48M84 32l2 18", .5, LEAF_INK);
    const rows = [[56, 32, 3], [50, 41, 4], [46, 50, 4], [48, 59, 3], [52, 68, 3], [56, 77, 2], [60, 86, 1]];
    rows.forEach(([x, y, n]) => { for (let i = 0; i < n; i++) s += circ(x + i * 8.2 - (n > 3 ? 4 : 0), y, 4.8, h, .82); });
    return s;
  },
  fig: (h) => `<path d="M30 38q10-16 28-6q10-8 18 4q12 2 8 16q-8-4-14 2q4 10-6 16q-6-8-14-4q-2-10-12-10q4-8-8-18z" fill="${LEAF}" fill-opacity=".45" stroke="${LEAF_INK}" stroke-width="${sw}"/>` + line("M42 46L66 30M56 46l18-6", .5, LEAF_INK) +
    stem("M46 64L48 70", 1) + `<path d="M48 70c-14 6-16 30-2 34c10 3 18-4 16-16c-2-10-8-14-14-18z" fill="${h}" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>` + circ(52, 102, 1.2, "#fff", 1) +
    `<path d="M82 64c-12 4-16 28-4 34c10 4 20-4 18-16c-2-10-8-16-14-18z" fill="#f3e2d8" stroke="${INK}" stroke-width="${sw}"/>` +
    `<path d="M82 70c-6 6-8 18-2 22c6 2 10-4 10-10c0-6-4-10-8-12z" fill="${h}" fill-opacity=".55" stroke="none"/>` +
    [[80, 78], [84, 82], [78, 86], [86, 88], [82, 92], [88, 80]].map(([x, y]) => line(`M82 72L${x} ${y}`, .4)).join(""),
  pomegranate: (h) => stem("M62 18Q60 24 58 28") + leaf(62, 20, 20, 3.4, -20) +
    `<path d="M40 54c0-16 12-26 22-26s22 10 22 26c0 16-10 28-22 28S40 70 40 54z" fill="${h}" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>` +
    `<path d="M54 28l2-7 3 5 3-6 3 6 3-5 2 7z" fill="${h}" stroke="${INK}" stroke-width="${sw}"/>` +
    `<path d="M70 82c0-12 9-20 18-20s18 8 18 20c0 12-8 22-18 22s-18-10-18-22z" fill="#f7ece6" stroke="${INK}" stroke-width="${sw}"/>` +
    [[80, 74], [87, 72], [94, 75], [78, 82], [85, 81], [92, 83], [99, 80], [81, 90], [88, 90], [95, 91], [85, 97], [92, 98]].map(([x, y]) => ell(x, y, 2.6, 3.2, h, .9, 20)).join("") +
    line("M88 64L88 102M72 82L104 82", .5),
  date: (h) => {
    let s = stem("M60 10Q60 20 60 28", 2) + line("M60 28C40 40 30 60 28 80M60 28C52 44 48 64 48 86M60 28C66 46 70 66 72 90M60 28C78 40 88 58 92 80", .6, "#a07a40");
    [[28, 86], [30, 72], [48, 92], [46, 76], [52, 60], [72, 96], [70, 80], [66, 62], [92, 86], [88, 70], [80, 56], [38, 60]].forEach(([x, y], i) => { s += ell(x, y, 4, 6.8, h, .88, (i % 3 - 1) * 10); });
    return s;
  },
  legume: (h) => {
    let s = stem("M30 20Q50 40 60 70Q66 90 64 110") + leaf(44, 36, 14, 2.4, -150) + leaf(46, 38, 14, 2.4, -40) + leaf(56, 56, 14, 2.4, -160) + leaf(58, 58, 14, 2.4, -30);
    s += `<path d="M62 76q14-2 20 8q-12 4-20-8z" fill="${LEAF}" fill-opacity=".6" stroke="${LEAF_INK}" stroke-width="${sw}"/>` + ell(72, 81, 3.4, 2, h, .9, 18);
    [[30, 96], [42, 100], [36, 88], [50, 92], [88, 98], [96, 90], [84, 88]].forEach(([x, y], i) => { s += ell(x, y, 6, 3.4, h, .88, i * 25); });
    return s + line("M82 98q4 0 8 0", .4);
  },
  chickpea: (h) => stem("M62 14Q60 40 58 60") + leaf(60, 26, 12, 3, -150) + leaf(60, 30, 12, 3, -30) + leaf(59, 40, 12, 3, -160) + leaf(59, 44, 12, 3, -20) +
    `<path d="M58 60c-12 0-18 10-14 18c6 10 24 8 26-4c1-8-4-14-12-14z" fill="${LEAF}" fill-opacity=".55" stroke="${LEAF_INK}" stroke-width="${sw}"/>` +
    [[34, 96], [50, 100], [66, 96], [82, 100]].map(([x, y]) => `<path d="M${x} ${y - 7}c-6 0-9 4-9 8s4 7 9 7s8-3 8-7c0-3-2-5-4-6l-2-4z" fill="${h}" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>`).join(""),
  pod: (h) => `<path d="M26 30c20 0 40 14 60 46c8 14 4 24-6 20c-14-6-26-22-40-38c-10-12-20-22-14-28z" fill="${LEAF}" fill-opacity=".65" stroke="${LEAF_INK}" stroke-width="${sw}"/>` +
    line("M30 34c18 6 34 22 52 52", .6, LEAF_INK) + [[40, 42], [54, 54], [68, 70]].map(([x, y]) => ell(x, y, 6, 4.4, "#c8d4a8", .8, 40)).join("") +
    ell(34, 96, 9, 6.4, h, .85, -10) + ell(56, 100, 9, 6.4, h, .85, 8) + line("M28 96q6-3 12 0M50 100q6-3 12 0", .5),
  lupin: (h) => `<path d="M24 26c18 8 38 26 52 44c6 8 0 14-6 10c-16-12-30-28-46-46c-4-4-4-10 0-8z" fill="${LEAF}" fill-opacity=".55" stroke="${LEAF_INK}" stroke-width="${sw}"/>` +
    Array.from({ length: 16 }, (_, i) => line(`M${30 + i * 3} ${32 + i * 3}l-2 -4`, .4, LEAF_INK)).join("") +
    [[34, 96], [54, 92], [74, 98], [90, 90]].map(([x, y]) => circ(x, y, 7.6, h, .85) + circ(x - 2, y - 2, 1.4, "#fff", .7)).join(""),
  almond: (h) => stem("M20 30Q50 36 70 50") + `<g transform="translate(26 26)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-6" rx="4" ry="6" transform="rotate(${a})" fill="#fbeef0" stroke="${INK}" stroke-width=".9"/>`).join("")}<circle r="2" fill="#c4708a"/></g>` +
    leaf(52, 42, 22, 4, 30) + `<path d="M74 52c10 2 18 14 14 28c-12 2-22-8-20-20z" fill="${LEAF}" fill-opacity=".6" stroke="${LEAF_INK}" stroke-width="${sw}"/>` +
    `<path d="M50 72c10 0 16 14 12 30c-2 6-8 6-10 0c-6-14-8-30-2-30z" fill="${h}" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>` + line("M54 76q2 12 2 24", .5) +
    `<path d="M80 80c8 2 12 12 8 24c-2 4-6 4-8 0c-4-10-6-24 0-24z" fill="${h}" fill-opacity=".6" stroke="${INK}" stroke-width="${sw}"/>`,
  walnut: (h) => circ(44, 54, 22, "#7a9a5a", .55) + line("M44 32v44", .5) +
    `<path d="M72 74a20 18 0 0 1 40 0z" fill="#d8c4a4" stroke="${INK}" stroke-width="${sw}"/>` +
    `<path d="M76 74c0-10 6-14 10-12c2-4 8-4 10 0c4-2 10 2 10 12" fill="${h}" fill-opacity=".8" stroke="${INK}" stroke-width="${sw}"/>` + line("M92 62v12M82 68q4 2 8 0M96 68q4 2 8 0", .5) +
    circ(40, 96, 13, "#c8b08a", .8) + line("M40 83v26M30 92q4-3 6 2M44 100q4-3 6 2M32 102q3-2 5 1", .5),
  sesame: (h) => stem("M60 112Q60 70 60 18") + leaf(60, 94, 26, 4, -140) + leaf(60, 90, 26, 4, -40) +
    [[60, 30], [60, 50], [60, 70]].map(([x, y], i) => `<path d="M${x + (i % 2 ? 4 : -4)} ${y}l${i % 2 ? 8 : -8} -4l0 18l${i % 2 ? -8 : 8} 4z" fill="${LEAF}" fill-opacity=".6" stroke="${LEAF_INK}" stroke-width="${sw}"/>`).join("") +
    Array.from({ length: 14 }, (_, i) => ell(80 + (i % 4) * 7 + (i > 7 ? 3 : 0), 74 + Math.floor(i / 4) * 8, 1.8, 3, h, .9, i * 31)).join(""),
  round: (h) => `<ellipse cx="54" cy="54" rx="36" ry="28" fill="${h}" fill-opacity=".75" stroke="${INK}" stroke-width="${sw}"/>` +
    [-24, -12, 0, 12, 24].map((d) => line(`M${54 + d} 27q${d * .3} 27 0 54`, 1.4, "#1f4a2a")).join("") +
    `<path d="M66 86l40 0a20 20 0 0 1-40 0z" fill="#e0505a" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>` + line("M66 86h40", 2.4, "#3a7a4a") +
    [[78, 92], [86, 96], [94, 92], [88, 102]].map(([x, y]) => ell(x, y, 1, 1.8, INK, .9)).join(""),
  long: (h) => stem("M18 30Q40 24 56 30") + line("M46 28q-2 -8 4 -10q6 0 4 6", .7, LEAF_INK) + leaf(30, 28, 22, 6, -110) +
    `<path d="M30 40c30 2 64 26 76 52c4 8-2 12-8 8c-26-16-52-30-70-48c-4-4-4-12 2-12z" fill="${h}" fill-opacity=".8" stroke="${INK}" stroke-width="${sw}"/>` +
    Array.from({ length: 12 }, (_, i) => circ(40 + i * 5.4, 48 + i * 3.6 + (i % 2) * 3, .8, "#f0f0e0", 1)).join("") +
    `<g transform="translate(106 96)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-4" rx="2.4" ry="4" transform="rotate(${a})" fill="#f2d24a" stroke="${INK}" stroke-width=".6"/>`).join("")}</g>`,
  bulb: (h) => `<path d="M60 20c-2 14-24 30-24 54c0 16 10 24 24 24s24-8 24-24c0-24-22-40-24-54z" fill="${h}" fill-opacity=".7" stroke="${INK}" stroke-width="${sw}"/>` +
    [8, 15, 21].map((d) => `<path d="M60 ${30 + d}c-${16 - d * .5} 10-${18 - d * .5} 22-${18 - d * .5} 30c0 ${12 - d * .3} ${8} 16 ${18 - d * .5} 16" fill="none" stroke="${INK}" stroke-width=".5"/>`).join("") +
    line("M50 98l-6 12M56 98l-2 14M64 98l2 14M70 98l6 12", .6, "#8a7a5a"),
  garlic: (h) => `<path d="M60 22c-4 18-30 28-30 52c0 16 14 24 30 24s30-8 30-24c0-24-26-34-30-52z" fill="#f6f2ea" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M60 40c-10 14-14 30-10 56M60 40c10 14 14 30 10 56M60 40v58M44 54c-8 12-10 26-4 40M76 54c8 12 10 26 4 40", .6) +
    line("M48 98l-6 12M56 98l-2 14M64 98l2 14M72 98l6 12", .6, "#8a7a5a") +
    `<path d="M98 76c-6 4-8 16-2 22c4 2 8-2 8-8c0-6-2-12-6-14z" fill="#f6f2ea" stroke="${INK}" stroke-width="${sw}"/>` + line("M98 76l1 -4", .7),
  tomato: (h) => circ(42, 58, 26, h, .85) + `<path d="M42 32l4 8 8-2-6 6 6 6-8-2-4 8-4-8-8 2 6-6-6-6 8 2z" fill="${LEAF}" fill-opacity=".8" stroke="${LEAF_INK}" stroke-width=".9"/>` +
    circ(88, 84, 20, h, .45) + `<circle cx="88" cy="84" r="20" fill="none" stroke="${INK}" stroke-width="${sw}"/>` +
    [0, 90, 180, 270].map((a) => `<ellipse cx="88" cy="74" rx="5" ry="7" transform="rotate(${a} 88 84)" fill="#f4c2a0" stroke="${INK}" stroke-width=".5"/>`).join("") + circ(88, 84, 3, "#f8e8d0", 1),
  herb: (h) => {
    let s = stem("M60 112Q58 70 60 20");
    for (let i = 0; i < 7; i++) { const y = 98 - i * 11, l = 14 - i; s += ell(60 - l * .6, y, l * .55, 3.2, h, .55, -20) + ell(60 + l * .6, y, l * .55, 3.2, h, .55, 20); }
    s += Array.from({ length: 10 }, (_, i) => circ(60 + (i % 2 ? 2.4 : -2.4), 22 + i * 1.6, 1.6, "#f2f2f2", 1)).join("");
    return s + Array.from({ length: 18 }, (_, i) => line(`M${50 + (i % 6) * 4} ${40 + Math.floor(i / 6) * 22}l-1 -2`, .35)).join("");
  },
  herb2: (h) => {
    let s = stem("M60 112Q62 70 58 22");
    [[96, 30, -150], [96, 30, -30], [76, 28, -160], [76, 28, -20], [56, 24, -150], [56, 24, -30], [38, 18, -140], [38, 18, -40]].forEach(([y, l, a]) => { s += leaf(60, y, l, 5.4, a, h); });
    return s + Array.from({ length: 24 }, (_, i) => circ(36 + (i % 8) * 7, 60 + Math.floor(i / 8) * 18, .5, INK, .4)).join("");
  },
  rhizome: (h) => `<path d="M18 70c8-12 20-8 26-14c6-8 18-10 22-2c6-6 18-6 22 4c10-2 16 8 10 16c-6 8-16 4-22 8c-8 6-20 6-26 0c-8 6-22 6-28-2c-6-2-8-6-4-10z" fill="${h}" fill-opacity=".7" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M30 70q6 2 10-2M54 64q4 4 10 2M76 70q4-4 10 0", .5) + line("M44 56v-8M66 54v-10M88 60v-8", .8, LEAF_INK) +
    `<ellipse cx="88" cy="98" rx="14" ry="10" fill="#f0dcb0" stroke="${INK}" stroke-width="${sw}"/>` + Array.from({ length: 10 }, (_, i) => circ(80 + (i % 5) * 4, 95 + Math.floor(i / 5) * 6, .6, INK, .5)).join(""),
  rhizome2: (h) => `<path d="M14 64c10-10 22-4 30-10c8-6 20-6 24 2c8-4 20-2 22 8c8 0 12 10 6 16c-8 6-18 2-24 6c-10 6-22 4-28-2c-10 6-24 4-30-6c-4-4-4-10 0-14z" fill="#c4a880" fill-opacity=".8" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M26 64q6 2 10-2M54 60q4 4 10 2M78 66q4-4 10 0", .5) +
    `<ellipse cx="86" cy="98" rx="15" ry="11" fill="${h}" fill-opacity=".95" stroke="${INK}" stroke-width="${sw}"/>` + `<ellipse cx="86" cy="98" rx="10" ry="7" fill="none" stroke="#a86a10" stroke-width=".6"/>` +
    Array.from({ length: 8 }, (_, i) => circ(30 + i * 5, 100 + (i % 2) * 2, 1.6, h, .9)).join(""),
  citrus: (h) => stem("M48 18Q46 24 44 30") + leaf(48, 20, 20, 5, -20) + circ(42, 56, 26, h, .7) +
    Array.from({ length: 22 }, (_, i) => circ(30 + (i % 6) * 5, 42 + Math.floor(i / 6) * 8, .5, INK, .4)).join("") +
    circ(88, 86, 20, "#f8dcc8", 1) + `<circle cx="88" cy="86" r="20" fill="none" stroke="${INK}" stroke-width="${sw}"/>` + circ(88, 86, 17, h, .45) +
    Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return line(`M88 86L${(88 + 17 * Math.cos(a)).toFixed(1)} ${(86 + 17 * Math.sin(a)).toFixed(1)}`, .6); }).join("") + circ(88, 86, 2, "#fff", 1),
  carob: (h) => stem("M20 20Q40 24 52 34") + leaf(30, 22, 16, 6, -100) + leaf(40, 26, 16, 6, 70) +
    `<path d="M50 34c10 4 20 20 28 42c6 16 10 28 6 32c-4 4-10-2-14-12c-8-20-18-36-24-50c-2-6 0-12 4-12z" fill="${h}" fill-opacity=".88" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M54 40c8 14 16 34 24 62", .5, "#c8a888") + [[90, 52], [100, 60], [94, 66], [104, 72]].map(([x, y], i) => ell(x, y, 3, 4.4, "#7a4a2a", .95, i * 30)).join(""),
  apple: (h) => stem("M58 22Q60 28 60 34", 1.6) + leaf(60, 26, 22, 6, -30) +
    `<path d="M60 36c-10-8-30-4-32 16c-2 22 14 40 32 36c18 4 34-14 32-36c-2-20-22-24-32-16z" fill="${h}" fill-opacity=".82" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M44 50q-4 8-2 16", .6, "#fff") +
    `<path d="M74 92c0-8 6-12 12-12s12 4 12 12c0 9-5 16-12 16s-12-7-12-16z" fill="#f6ecd8" stroke="${INK}" stroke-width="${sw}"/>` +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="86" cy="88" rx="1.4" ry="3" transform="rotate(${a} 86 93)" fill="#5a3a2a"/>`).join(""),
  pear: (h) => stem("M60 16Q62 22 62 28", 1.6) + leaf(62, 20, 20, 5, -40) +
    `<path d="M62 28c-8 0-10 14-12 22c-10 8-16 18-14 30c2 14 14 22 26 22s24-8 26-22c2-12-4-22-14-30c-2-8-4-22-12-22z" fill="${h}" fill-opacity=".8" stroke="${INK}" stroke-width="${sw}"/>` +
    Array.from({ length: 18 }, (_, i) => circ(46 + (i % 6) * 6, 66 + Math.floor(i / 6) * 9, .6, INK, .35)).join(""),
  berry: (h) => stem("M40 16Q50 30 56 44") + leaf(46, 26, 26, 9, -150) + leaf(48, 30, 22, 8, 10) +
    Array.from({ length: 16 }, (_, i) => circ(56 + (i % 4) * 5.2 - (Math.floor(i / 4) % 2) * 2.6, 50 + Math.floor(i / 4) * 6, 3.4, h, .9)).join("") +
    Array.from({ length: 12 }, (_, i) => circ(84 + (i % 3) * 5, 84 + Math.floor(i / 3) * 5.5, 3, "#c84a6a", .85)).join(""),
  quince: (h) => stem("M60 18Q60 24 58 30", 1.6) + leaf(60, 22, 24, 7, -20) +
    `<path d="M58 30c-16 0-30 14-30 34c0 22 14 36 32 36s32-14 32-36c0-20-14-34-30-34c-1 0-3 0-4 0z" fill="${h}" fill-opacity=".85" stroke="${INK}" stroke-width="${sw}"/>` +
    line("M40 58q4-14 18-20M78 46q8 8 8 22", .6, "#8a7a2a") + circ(60, 100, 2.4, "#5a4a2a", 1) +
    Array.from({ length: 26 }, (_, i) => circ(36 + (i % 9) * 6, 50 + Math.floor(i / 9) * 14, .5, "#fff", .8)).join(""),
  cabbage: (h) => `<circle cx="60" cy="62" r="40" fill="${h}" fill-opacity=".55" stroke="${INK}" stroke-width="${sw}"/>` +
    [32, 25, 18, 11].map((r, i) => `<path d="M${60 - r} ${62 + i * 2}a${r} ${r} 0 0 1 ${r * 2} 0" fill="none" stroke="${LEAF_INK}" stroke-width=".8"/>`).join("") +
    line("M60 22v78M30 40l30 22M90 40L60 62M26 72l34-10M94 72L60 62", .5, LEAF_INK),
  chard: (h) => [[-22, "#c43a3a"], [0, "#e8c43a"], [22, "#f2f2e8"]].map(([a, c]) =>
    `<g transform="rotate(${a} 60 108)"><path d="M60 108V64" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M60 70c-22-4-26-30-14-48c6-8 22-8 28 0c12 18 8 44-14 48z" fill="${h}" fill-opacity=".6" stroke="${LEAF_INK}" stroke-width="${sw}"/>${line("M60 68V24M60 56l-10-8M60 46l10-8M60 36l-8-6", .6, c === "#f2f2e8" ? "#8a8a7a" : c)}</g>`).join(""),
  mustard: (h) => stem("M60 112Q58 70 60 30") + leaf(60, 96, 26, 8, -150) + leaf(60, 86, 22, 7, -30) +
    [[60, 26], [54, 32], [66, 32], [60, 36], [52, 22], [68, 22]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 90, 180, 270].map((a) => `<ellipse cx="0" cy="-2.6" rx="1.6" ry="2.6" transform="rotate(${a})" fill="${h}" stroke="${INK}" stroke-width=".5"/>`).join("")}</g>`).join("") +
    [[60, 50, -1], [60, 60, 1], [60, 70, -1]].map(([x, y, d]) => line(`M${x} ${y}l${d * 12} -10`, 1.4, LEAF_INK)).join("") +
    Array.from({ length: 14 }, (_, i) => circ(84 + (i % 5) * 4.4, 92 + Math.floor(i / 5) * 4.4, 1.6, "#6a4a1a", .9)).join(""),
  tree: () => `<path d="M60 112c-2-14 2-24-2-36c-4-12-14-16-12-28M60 112c4-10 2-22 8-30c6-8 16-10 18-20M58 80c-8-4-16-2-22-10" fill="none" stroke="#6a5a4a" stroke-width="4.2" stroke-linecap="round"/>` +
    [[30, 44, 22], [52, 32, 26], [78, 36, 24], [92, 54, 18], [40, 60, 16], [66, 54, 20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .62}" fill="#9aa88a" fill-opacity=".5" stroke="${LEAF_INK}" stroke-width="1"/>`).join("") +
    [[44, 40], [70, 44], [84, 58], [56, 58], [36, 54]].map(([x, y]) => ell(x, y, 2, 2.8, "#3a4a2a", .9)).join("")
};

export function plate(food, { big = false, draw = false } = {}) {
  const f = typeof food === "string" ? { shape: food, hue: "#5b7f3a", la: "" } : food;
  const body = (SHAPES[f.shape] || SHAPES.olive)(f.hue);
  return `<svg class="plate${draw ? " draw" : ""}" viewBox="0 0 120 120" style="direction:ltr" role="img" aria-label="${f.he ? "איור: " + f.he : "איור"}">${body}${big && f.la ? label(f.la) : ""}</svg>`;
}

// סימן האפליקציה: שלוש שכבות של קרקע, וזית שצומח מהן. בלי טקסט.
export const APP_MARK = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" fill="#fff" stroke="#1A1A18" stroke-width="2"/><path d="M10 40h44" stroke="#1F4E79" stroke-width="4"/><path d="M10 48h44" stroke="#5B7F3A" stroke-width="4" stroke-dasharray="1 5" stroke-linecap="round"/><path d="M10 55h44" stroke="#7A7A7A" stroke-width="3" stroke-dasharray="6 4"/><path d="M32 40C32 30 30 22 22 14" fill="none" stroke="#4a5a3a" stroke-width="2"/><path d="M27 21q-9-4-13 2q8 4 13-2z" fill="#9aa88a" stroke="#4a5a3a" stroke-width="1.2"/><path d="M30 28q8-6 14-2q-6 6-14 2z" fill="#9aa88a" stroke="#4a5a3a" stroke-width="1.2"/><ellipse cx="35" cy="34" rx="3.4" ry="4.4" fill="#5B7F3A" stroke="#1A1A18" stroke-width="1"/></svg>`;
