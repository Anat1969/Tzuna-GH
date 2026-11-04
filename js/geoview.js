// מפה וגלובוס עם עכבר: גלגלת מקרבת, גרירה מזיזה (במפה) או מסובבת (בגלובוס). בלי ספרייה.
// המפה: יבשה מוקרנת מראש (worldmap.js). הגלובוס: הקרנה אורתוגרפית מקווי אורך ורוחב (worldland.js).
import { MAP, project } from "./data/worldmap.js";
import { LAND } from "./data/worldland.js";

const RAD = Math.PI / 180;
// מבט פתיחה: העולם הישן במרכז. אפשר להזיז לאמריקה.
const HOME = () => { const [x, y] = project(62, 33); return { k: 1.65, cx: x, cy: y, gk: 1, rot: [-40, -28] }; };
const st = { mode: "map", ...HOME() };
let el, pts = [], onPick = () => {}, drag = null, moved = 0, bound = false;

// הקרנה אורתוגרפית: [x, y, נראה]
function ortho(lon, lat, R = 230 * st.gk, C = 250) {
  const l = (lon + st.rot[0]) * RAD, p = lat * RAD, p0 = -st.rot[1] * RAD;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  const x = R * Math.cos(p) * Math.sin(l), y = R * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
  return [C + x, C - y, cosc >= 0];
}
function globeLand() {
  const R = 230 * st.gk, C = 250;
  return LAND.map((ring) => {
    let d = "", vis = 0;
    for (let i = 0; i < ring.length; i += 2) {
      let [x, y, v] = ortho(ring[i], ring[i + 1]);
      if (v) vis++;
      else { const dx = x - C, dy = y - C, n = Math.hypot(dx, dy) || 1; x = C + dx / n * R; y = C + dy / n * R; } // נקודה מאחור נצמדת לשפת הכדור
      d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return vis ? d + "Z" : "";
  }).join("");
}
function graticule() {
  let d = "";
  const line = (fn) => { let open = false; for (let t = -180; t <= 180; t += 4) { const [x, y, v] = fn(t); if (v) { d += (open ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); open = true; } else open = false; } };
  for (let lon = -180; lon < 180; lon += 30) line((t) => ortho(lon, Math.max(-90, Math.min(90, t / 2))));
  for (let lat = -60; lat <= 60; lat += 30) line((t) => ortho(t, lat));
  return d;
}

// נקודות ותוויות בגודל קבוע על המסך (בפיקסלים), ותוויות שלא עולות זו על זו:
// לכל תווית ארבעה מקומות אפשריים (ימין, שמאל, מעל, מתחת). אם כולם תפוסים, השם מופיע בריחוף.
function pointsSVG(globe) {
  const box = el?.querySelector(".geo-stage");
  const wPx = box?.clientWidth || 800;
  const u = globe ? 500 / Math.min(wPx, 460) : (MAP.W / st.k) / wPx; // יחידות SVG לפיקסל אחד
  const placed = [], lab = [];
  const items = pts.map((p) => {
    let x, y, v = true;
    if (globe) [x, y, v] = ortho(p.ll[0], p.ll[1]); else [x, y] = project(p.ll[0], p.ll[1]);
    return { p, x, y, v };
  }).filter((o) => o.v).sort((a, b) => Number(b.p.on) - Number(a.p.on) || Number(a.p.dim) - Number(b.p.dim));
  for (const o of items) placed.push([o.x / u - 8, o.y / u - 8, 16, 16]); // הנקודות עצמן תפוסות
  const hit = (r) => placed.some((q) => r[0] < q[0] + q[2] && r[0] + r[2] > q[0] && r[1] < q[1] + q[3] && r[1] + r[3] > q[1]);
  for (const o of items) {
    const w = o.p.label.length * 7.4 + 6, h = 17, X = o.x / u, Y = o.y / u;
    const cands = [[10, -h / 2, "start"], [-10 - w, -h / 2, "end"], [-w / 2, -h - 9, "middle"], [-w / 2, 9, "middle"]];
    let got = null;
    for (const [dx, dy, a] of cands) { const r = [X + dx, Y + dy, w, h]; if (!hit(r)) { got = [dx, dy, a]; placed.push(r); break; } }
    lab.push({ ...o, got });
  }
  return lab.map(({ p, x, y, got }) => {
    const tx = got ? (got[2] === "start" ? got[0] : got[2] === "end" ? got[0] + p.label.length * 7.4 + 6 : 0) : 0, ty = got ? got[1] + 13 : 0;
    return `<g class="mp ${p.on ? "on" : ""} ${p.dim ? "dim" : ""}" data-m="${p.id}" role="button" tabindex="0" aria-label="${p.label}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${u.toFixed(4)})">
      ${p.on ? `<circle class="mp-ring" r="11" stroke="${p.hue}"/>` : ""}<circle r="${p.on ? 8 : 6}" fill="${p.hue}" stroke="#fff" stroke-width="2"/>
      ${got ? `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${got[2]}" class="mp-t">${p.label}</text>` : ""}<title>${p.label}</title></g>`;
  }).join("");
}

function draw() {
  if (!el) return;
  const box = el.querySelector(".geo-stage");
  if (st.mode === "map") {
    const w = MAP.W / st.k, h = MAP.H / st.k;
    box.innerHTML = `<svg class="mt-map" viewBox="${(st.cx - w / 2).toFixed(1)} ${(st.cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="מפה: איפה נולדה כל שיטה. גלגלת מקרבת, גרירה מזיזה" style="direction:ltr">
      <defs><linearGradient id="mp-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eef5"/><stop offset="1" stop-color="#f6f4ee"/></linearGradient>
      <linearGradient id="mp-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ede7d8"/><stop offset="1" stop-color="#dcd3bd"/></linearGradient></defs>
      <rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#mp-sea)"/>
      <path d="${MAP.d}" fill="url(#mp-land)" stroke="#b9ae94" stroke-width="${(.8 / st.k).toFixed(2)}"/>
      ${pointsSVG(false)}</svg>`;
  } else {
    box.innerHTML = `<svg class="mt-globe" viewBox="0 0 500 500" role="img" aria-label="גלובוס: גרירה מסובבת, גלגלת מקרבת" style="direction:ltr">
      <defs><radialGradient id="gl-sea" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#f3f7fb"/><stop offset=".75" stop-color="#d6e3ee"/><stop offset="1" stop-color="#a9bfd3"/></radialGradient>
      <radialGradient id="gl-shade" cx=".38" cy=".32" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a2238" stop-opacity=".28"/></radialGradient>
      <filter id="gl-sh"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".18"/></filter></defs>
      <circle cx="250" cy="250" r="${230 * st.gk}" fill="url(#gl-sea)" filter="url(#gl-sh)"/>
      <path d="${graticule()}" fill="none" stroke="#7f98ad" stroke-width=".4" stroke-opacity=".6"/>
      <path d="${globeLand()}" fill="#e7dfcb" stroke="#a89c80" stroke-width=".6"/>
      <circle cx="250" cy="250" r="${230 * st.gk}" fill="url(#gl-shade)" pointer-events="none"/>
      ${pointsSVG(true)}</svg>`;
  }
  el.querySelectorAll("[data-geo]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.geo === st.mode)));
}

// מצב מבחוץ: הנקודות, מי נבחר ומי מעומעם. המצב של הזום נשמר.
export function setGeo(points) { pts = points; draw(); }
export function geoShell() {
  return `<div class="geo" dir="rtl">
    <div class="geo-bar"><span class="seg"><button class="seg-b" data-geo="map">מפה</button><button class="seg-b" data-geo="globe">גלובוס</button></span>
      <span class="geo-zoom"><button class="geo-z" data-z="1.4" aria-label="קירוב">+</button><button class="geo-z" data-z="0.7" aria-label="ריחוק">−</button><button class="geo-z" data-z="0" aria-label="איפוס">איפוס</button></span>
      <span class="geo-hint">גלגלת: זום · גרירה: ${"<span class='geo-h-map'>הזזה</span><span class='geo-h-globe'>סיבוב</span>"}</span></div>
    <div class="geo-stage"></div></div>`;
}
const clampMap = () => { const w = MAP.W / st.k / 2, h = MAP.H / st.k / 2; st.cx = Math.max(w, Math.min(MAP.W - w, st.cx)); st.cy = Math.max(h, Math.min(MAP.H - h, st.cy)); };
const zoom = (f, px = .5, py = .5) => {
    if (st.mode === "map") {
      const k0 = st.k, k = Math.max(1, Math.min(8, k0 * f));
      // הזום סביב הסמן: הנקודה שמתחת לעכבר נשארת במקום
      const w0 = MAP.W / k0, h0 = MAP.H / k0, w = MAP.W / k, h = MAP.H / k;
      st.cx += (px - .5) * (w0 - w); st.cy += (py - .5) * (h0 - h); st.k = k;
      clampMap();
    } else st.gk = Math.max(.7, Math.min(4, st.gk * f));
    draw();
  };
export function attachGeo(container, pick) {
  el = container; onPick = pick;
  const stage = el.querySelector(".geo-stage");
  el.addEventListener("click", onClick);
  stage.addEventListener("wheel", (e) => { e.preventDefault(); const r = stage.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, { passive: false });
  stage.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; moved = 0; });
  if (bound) { draw(); return; }
  bound = true;
  addEventListener("pointermove", (e) => {
    if (!drag || !el) return;
    const stage = el.querySelector(".geo-stage");
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY }; moved += Math.abs(dx) + Math.abs(dy);
    if (moved < 4) return;
    stage.classList.add("dragging");
    const r = stage.getBoundingClientRect();
    if (st.mode === "map") { st.cx -= dx * (MAP.W / st.k) / r.width; st.cy -= dy * (MAP.H / st.k) / r.height; clampMap(); }
    else { st.rot[0] += dx * .4 / st.gk; st.rot[1] = Math.max(-80, Math.min(80, st.rot[1] - dy * .4 / st.gk)); }
    draw();
  });
  addEventListener("pointerup", () => { drag = null; el?.querySelector(".geo-stage")?.classList.remove("dragging"); });
  draw();
}
function onClick(e) {
  {
    const g = e.target.closest("[data-geo]"); if (g) { st.mode = g.dataset.geo; return draw(); }
    const z = e.target.closest("[data-z]"); if (z) { const f = Number(z.dataset.z); if (!f) { Object.assign(st, HOME()); return draw(); } return zoom(f); }
    const p = e.target.closest("[data-m]"); if (p && moved < 4) { e.stopPropagation(); onPick(p.dataset.m); }
  }
}
// הגלובוס מסתובב אל השיטה שנבחרה.
export function focusGeo(ll) { if (ll && st.mode === "globe") { st.rot = [-ll[0], -ll[1] + 10]; draw(); } }
