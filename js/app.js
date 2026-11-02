// מעטפת: סרגל, ניתוב, חיפוש ושכבת בטיחות.
import { parse, go } from "./route.js";
import { legendHTML } from "./ui.js";
import { APP_MARK } from "./plates.js";
import { classify, showSafety } from "./safety.js";
import * as home from "./views/home.js";
import * as foods from "./views/foods.js";
import * as plant from "./views/plant.js";
import * as methods from "./views/methods.js";
import * as seasons from "./views/seasons.js";
import * as compare from "./views/compare.js";
import * as redlist from "./views/redlist.js";
import * as help from "./views/help.js";
import * as method from "./views/method.js";
import * as recipes from "./views/recipes.js";

const VIEWS = { home, foods, plant, methods, seasons, recipes, compare, redlist, help, method };
const ALIASES = { tree: "plant" };
const NAV = [
  ["foods", "מזון"], ["plant", "צמח וגוף"], ["methods", "שיטות"], ["seasons", "עונות"], ["recipes", "צירופים"], ["compare", "השוואה"]
];

const $ = (s) => document.querySelector(s);
let viewEl = $("#view");
let current = null;
let cleanup = null;

$("#brand-mark").innerHTML = APP_MARK;
$("#legend").innerHTML = legendHTML();
$("#tabs").innerHTML = NAV.map(([id, he, cls]) => `<a class="tab ${cls || ""}" href="#/${id}" data-view="${id}">${he}</a>`).join("");

function render() {
  const { view: raw, params } = parse();
  const view = ALIASES[raw] || raw;
  const name = VIEWS[view] ? view : "home";
  document.querySelectorAll(".tab").forEach((t) => { if (t.dataset.view === name) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
  // אותה תצוגה עם פרמטרים חדשים: עדכון במקום, בלי לבנות מחדש.
  if (current === name && VIEWS[name].update) { VIEWS[name].update(params); return; }
  if (cleanup) { try { cleanup(); } catch { /* ignore */ } cleanup = null; }
  current = name;
  // מיכל חדש בכל מעבר מסך, כדי שמאזינים של מסך קודם לא יצטברו.
  const fresh = viewEl.cloneNode(false);
  viewEl.replaceWith(fresh);
  viewEl = fresh;
  viewEl.dataset.view = name;
  cleanup = VIEWS[name].mount(viewEl, params, { query: $("#q").value.trim() }) || null;
  document.title = (VIEWS[name].title ? VIEWS[name].title + " · " : "") + "מזון, גוף ונפש";
}

// חיפוש: קבוע בסרגל. מילות חירום פותחות מיד את מסך העזרה.
const q = $("#q");
let lastSafety = "";
q.addEventListener("input", () => {
  const text = q.value.trim();
  const kind = classify(text);
  if (kind && kind !== lastSafety) { lastSafety = kind; showSafety(kind); }
  if (!kind) lastSafety = "";
  if (current === "foods") foods.search(text);
  else if (text.length >= 2 && !kind) go("foods", { q: text });
});
q.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { q.value = ""; q.dispatchEvent(new Event("input")); }
  if (e.key === "Enter" && current !== "foods") go("foods", { q: q.value.trim() });
});
q.addEventListener("focus", () => q.select());
$("#q-x").addEventListener("click", () => { q.value = ""; q.dispatchEvent(new Event("input")); q.focus(); });

addEventListener("hashchange", render);
render();

// התקנה: service worker רק כשהבסיס הוא שורש האתר (לא ב-raw.githack).
if ("serviceWorker" in navigator && location.protocol === "https:" && !location.hostname.includes("githack")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
