// עץ הזית: מסך הפיילוט. תלת־ממד (טעינה עצלנית) עם חמש נקודות לחיצה, וכל נקודה בשלוש שכבות.
import { TREE_POINTS } from "../data/tree.js";
import { rich, stratum, LAYERS, srcLine, esc } from "../ui.js";
import { plate } from "../plates.js";
import { patch } from "../route.js";

export const title = "עץ הזית";
const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";
// מיקום הנקודות בגיבוי ה-SVG (באחוזים מהבמה)
const FALLBACK_POS = { leaf: [30, 30], fruit: [62, 40], oil: [36, 80], trunk: [50, 62], roots: [56, 90] };

let root, state, engine;

function detailHTML(p) {
  const city = p.city ? `<div class="tone tone-insight" style="margin-top:8px"><p>${rich(p.city)}</p></div>` : "";
  return `<div class="panel-head"><div><span class="label">עץ הזית</span><h2 class="sheet-name" id="tree-title" style="margin-top:2px">${esc(p.he)}</h2></div>
      <div class="ops">${TREE_POINTS.map((x, i) => `<button class="chip" data-pt="${x.id}" aria-pressed="${x.id === p.id}"><bdi class="num" style="font-weight:400;font-size:11px">${i + 1}</bdi> ${esc(x.he)}</button>`).join("")}</div></div>
    <div class="panel-body scroll-in" style="flex:1">
      <section class="sec" style="margin-top:0"><div class="sec-h"><h3>הכרה</h3><span class="label">מה רואים</span></div>
        <p style="font-size:14.5px;line-height:1.6">${rich(p.recognize.t)} <span class="src">${srcLine(p.recognize.src)}</span></p>${city}</section>
      <section class="sec"><div class="sec-h"><h3>הבנה</h3><span class="label">שלוש שכבות</span></div>${LAYERS.map((l) => stratum(l.key, p.layers[l.key])).join("")}</section>
      <section class="sec"><div class="sec-h"><h3>מיקרו ומאקרו</h3><span class="label">איך החלקים מתחברים</span></div>
        <p class="lines" style="font-size:13.5px;line-height:1.6;color:var(--ink-soft)"><span>${rich("**שורשים** עמידים ליובש ← **גזע** שחי מאות שנים ← **עלה** כסוף שחוסך מים ← **פרי** מר ← **שמן**.")}</span><span>${rich("==עץ שבנוי לחסוך, ולכן מחזיק דורות.==")}</span></p>
        <a class="press btn" href="#/foods?id=olive" style="display:inline-block;margin-top:8px;text-decoration:none">לגיליון הזית</a>
      </section>
    </div>`;
}

function hotspotsHTML() {
  return TREE_POINTS.map((p, i) => `<button class="hotspot" data-pt="${p.id}" aria-pressed="${p.id === state.id}" aria-label="${esc(p.he)}"><span class="dot"></span><span class="tag"><bdi class="num" style="font-size:11px;opacity:.6">${i + 1}</bdi> ${esc(p.he)}</span></button>`).join("");
}

function select(id) {
  state.id = id;
  patch({ p: id });
  const p = TREE_POINTS.find((x) => x.id === id) || TREE_POINTS[0];
  root.querySelector("#tree-detail").innerHTML = detailHTML(p);
  root.querySelectorAll(".hotspot").forEach((h) => h.setAttribute("aria-pressed", String(h.dataset.pt === p.id)));
  engine?.focus(p);
}

function fallback(stage, reason) {
  stage.querySelector("canvas")?.remove();
  stage.insertAdjacentHTML("afterbegin", `<div class="tree-fallback">${plate("tree")}</div>`);
  stage.querySelectorAll(".hotspot").forEach((h) => { const [x, y] = FALLBACK_POS[h.dataset.pt]; h.style.left = x + "%"; h.style.top = y + "%"; });
  stage.querySelector(".tree-hint").textContent = reason;
}

export function mount(el, params) {
  root = el;
  state = { id: TREE_POINTS.some((p) => p.id === params.p) ? params.p : "fruit" };
  root.innerHTML = `<div class="view-in focus-aside">
    <section class="tree-stage" id="stage" aria-label="עץ זית בתלת־ממד. גררו לסיבוב, לחצו על נקודה.">
      <canvas id="tree-canvas"></canvas>
      ${hotspotsHTML()}
      <div class="tree-hint" id="tree-hint">טוען את העץ...</div>
    </section>
    <aside class="panel" id="tree-detail" aria-labelledby="tree-title"></aside>
  </div>`;
  const stage = root.querySelector("#stage");
  root.querySelector("#tree-detail").innerHTML = detailHTML(TREE_POINTS.find((p) => p.id === state.id));
  root.addEventListener("click", (e) => { const b = e.target.closest("[data-pt]"); if (b) select(b.dataset.pt); });

  let disposed = false;
  import(/* lazy */ THREE_URL).then((THREE) => {
    if (disposed) return;
    engine = buildTree(THREE, stage, () => state.id);
    if (!engine) return fallback(stage, "תלת־ממד לא זמין במכשיר הזה. מוצג איור.");
    root.querySelector("#tree-hint").textContent = "גררו לסיבוב. לחצו על נקודה.";
    engine.focus(TREE_POINTS.find((p) => p.id === state.id), true);
  }).catch(() => { if (!disposed) fallback(stage, "תלת־ממד לא נטען. מוצג איור, וכל המידע זמין."); });

  return () => { disposed = true; engine?.dispose(); engine = null; };
}

export function update(params) {
  if (params.p && params.p !== state.id) select(params.p);
}

// ---------- בניית העץ ----------
function buildTree(THREE, stage, currentId) {
  const canvas = stage.querySelector("canvas");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true }); } catch { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // אור מקור אחד עקבי, משמאל למעלה, ואור שמיים רך.
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.25));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-4, 8, 6);
  scene.add(sun);

  const tree = new THREE.Group();
  scene.add(tree);

  // אקראיות קבועה, כדי שהעץ ייראה אותו דבר בכל טעינה ובכל צילום.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // חתך קרקע: גוש אדמה עם שכבות, כמו חתך ארכאולוגי.
  const soil = new THREE.Group();
  [[0, -.1, .2, 0xe9e3d6], [0, -.38, .36, 0xddd3c0], [0, -.78, .44, 0xcfc3ab]].forEach(([, y, h, c]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, h, 64, 1, false), new THREE.MeshStandardMaterial({ color: c, roughness: 1, transparent: true, opacity: .55 }));
    m.position.y = y - h / 2 + .1;
    soil.add(m);
  });
  const top = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshStandardMaterial({ color: 0xf2eee5, roughness: 1 }));
  top.rotation.x = -Math.PI / 2; top.position.y = .101;
  soil.add(top);
  tree.add(soil);

  const bark = new THREE.MeshStandardMaterial({ color: 0x7a6e60, roughness: .95, metalness: 0 });
  const tube = (pts, r, mat = bark, seg = 40) => {
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 10, false);
    const m = new THREE.Mesh(g, mat);
    tree.add(m);
    return m;
  };

  // גזע: שלושה גדילים שמתפתלים זה סביב זה, כמו זית ותיק.
  for (let k = 0; k < 3; k++) {
    const a0 = (k / 3) * Math.PI * 2;
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, a = a0 + t * 2.4, r = .2 * (1 - t * .55);
      pts.push(V(Math.cos(a) * r + Math.sin(t * 3) * .12, .05 + t * 1.9, Math.sin(a) * r));
    }
    tube(pts, .17 - k * .02);
  }

  // ענפים ונקודות קצה לצמרת
  const tips = [];
  const branchFrom = [[0, 1.85, 0]];
  const dirs = 7;
  for (let i = 0; i < dirs; i++) {
    const a = (i / dirs) * Math.PI * 2 + rnd() * .5;
    const len = 1.1 + rnd() * .6;
    const s = V(...branchFrom[0]);
    const m = V(Math.cos(a) * len * .5, 2.3 + rnd() * .3, Math.sin(a) * len * .5);
    const e = V(Math.cos(a) * len, 2.7 + rnd() * .7, Math.sin(a) * len);
    tube([s, m, e], .07, bark, 16);
    tips.push(e, m.clone().lerp(e, .5));
  }
  tips.push(V(0, 3.4, 0), V(.3, 3.2, -.4));

  // שורשים בתוך החתך
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + .3;
    tube([V(0, .1, 0), V(Math.cos(a) * .6, -.25, Math.sin(a) * .6), V(Math.cos(a) * 1.4, -.55 - rnd() * .3, Math.sin(a) * 1.4)], .05, new THREE.MeshStandardMaterial({ color: 0x8a7258, roughness: 1 }), 14);
  }

  // עלים: צד עליון ירוק־אפור, צד תחתון כסוף. InstancedMesh אחד לכל צד.
  const leafGeo = new THREE.SphereGeometry(1, 6, 4);
  leafGeo.scale(.16, .012, .035);
  const leafTop = new THREE.MeshStandardMaterial({ color: 0x5e6e4e, roughness: .8 });
  const leafUnder = new THREE.MeshStandardMaterial({ color: 0xb9c0ae, roughness: .5 });
  const N = 1400;
  const iTop = new THREE.InstancedMesh(leafGeo, leafTop, N);
  const iUnder = new THREE.InstancedMesh(leafGeo, leafUnder, N);
  const dummy = new THREE.Object3D();
  let a = 0, b = 0;
  for (let i = 0; i < N * 2; i++) {
    const tip = tips[i % tips.length];
    const r = .55 + rnd() * .35;
    const th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
    dummy.position.set(tip.x + r * Math.sin(ph) * Math.cos(th), tip.y + r * .62 * Math.cos(ph), tip.z + r * Math.sin(ph) * Math.sin(th));
    dummy.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    dummy.updateMatrix();
    if (i % 2 && a < N) iTop.setMatrixAt(a++, dummy.matrix); else if (b < N) iUnder.setMatrixAt(b++, dummy.matrix);
  }
  tree.add(iTop, iUnder);

  // זיתים: חלקם ירוקים וחלקם בשלים
  const oliveGeo = new THREE.SphereGeometry(1, 12, 8);
  oliveGeo.scale(.05, .065, .05);
  const ripe = new THREE.InstancedMesh(oliveGeo, new THREE.MeshStandardMaterial({ color: 0x3a2a3a, roughness: .35 }), 50);
  const green = new THREE.InstancedMesh(oliveGeo, new THREE.MeshStandardMaterial({ color: 0x7a8a3a, roughness: .45 }), 40);
  for (let i = 0; i < 90; i++) {
    const tip = tips[i % tips.length];
    const r = .5 + rnd() * .3, th = rnd() * Math.PI * 2;
    dummy.position.set(tip.x + r * Math.cos(th), tip.y - .15 - rnd() * .3, tip.z + r * Math.sin(th));
    dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
    (i < 50 ? ripe : green).setMatrixAt(i < 50 ? i : i - 50, dummy.matrix);
  }
  tree.add(ripe, green);

  // כד שמן קטן ליד הגזע, לנקודת "שמן"
  const jarPts = [[0, 0], [.16, .02], [.2, .14], [.17, .3], [.09, .38], [.07, .46], [.1, .5]].map(([x, y]) => new THREE.Vector2(x, y));
  const jar = new THREE.Mesh(new THREE.LatheGeometry(jarPts, 32), new THREE.MeshStandardMaterial({ color: 0xc89a6a, roughness: .9 }));
  jar.position.set(1.35, .1, 1.05);
  tree.add(jar);

  // מצלמה, גרירה וזום
  let rotY = -.5, targetRot = rotY, dist = 10, dragging = false, lastX = 0, idle = 0;
  const look = V(0, 1.45, 0);
  function placeCamera() { camera.position.set(0, 3.1, dist); camera.lookAt(look); }
  placeCamera();
  const onDown = (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (!dragging) return; targetRot += (e.clientX - lastX) * .008; lastX = e.clientX; idle = 0; };
  const onUp = () => { dragging = false; };
  const onWheel = (e) => { e.preventDefault(); dist = Math.min(13, Math.max(6, dist + e.deltaY * .004)); placeCamera(); };
  canvas.addEventListener("pointerdown", onDown);
  addEventListener("pointermove", onMove);
  addEventListener("pointerup", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const ro = new ResizeObserver(() => {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    dist = w / h < .9 ? 12.5 : 10;
    placeCamera();
    camera.updateProjectionMatrix();
  });
  ro.observe(stage);

  const hot = [...stage.querySelectorAll(".hotspot")];
  const v = new THREE.Vector3();
  function placeHotspots() {
    const w = stage.clientWidth, h = stage.clientHeight;
    hot.forEach((el) => {
      const p = TREE_POINTS.find((x) => x.id === el.dataset.pt);
      v.set(...p.pos).applyMatrix4(tree.matrixWorld).project(camera);
      el.style.left = ((v.x + 1) / 2 * w).toFixed(1) + "px";
      el.style.top = ((1 - v.y) / 2 * h).toFixed(1) + "px";
      const world = new THREE.Vector3(...p.pos).applyMatrix4(tree.matrixWorld);
      el.style.opacity = world.z < -.4 && p.id !== currentId() ? ".35" : "1";
    });
  }

  let raf = 0;
  function frame() {
    idle++;
    if (!reduce && !dragging && idle > 240) targetRot += .0016;
    rotY += (targetRot - rotY) * .08;
    tree.rotation.y = rotY;
    tree.updateMatrixWorld();
    renderer.render(scene, camera);
    placeHotspots();
    raf = requestAnimationFrame(frame);
  }
  frame();

  return {
    focus(p, instant) {
      // מסובב את העץ כך שהנקודה פונה אל המצלמה
      const ang = -Math.atan2(p.pos[0], p.pos[2]);
      let d = ang - targetRot;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      targetRot += d;
      idle = 0;
      if (instant || reduce) rotY = targetRot;
    },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("pointerup", onUp);
      renderer.dispose();
    }
  };
}
