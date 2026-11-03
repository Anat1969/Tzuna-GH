// הגדלת תמונה בתוך הדף: לחיצה על תמונה בתוך .zoomable פותחת אותה גדולה, עם שם וקרדיט.
// סגירה באיקס, ב-Esc או בלחיצה על הרקע. המיקוד חוזר לתמונה.
import { esc, iconBtn } from "./ui.js";

let box = null, back = null;
function close() {
  if (!box) return;
  box.remove(); box = null;
  document.removeEventListener("keydown", onKey, true);
  back?.focus?.();
}
function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); close(); } }

export function openZoom(img, cap, credit) {
  close();
  back = img;
  box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", cap || "תמונה מוגדלת");
  box.innerHTML = `<figure class="lb-fig"><img src="${esc(img.currentSrc || img.src)}" alt="${esc(img.alt || cap)}">
    <figcaption><b>${esc(cap)}</b>${credit ? `<span class="credit">${esc(credit)}</span>` : ""}</figcaption>
    <div class="lb-ops">${iconBtn("x", "סגירה", "data-lb-close")}</div></figure>`;
  box.addEventListener("click", (e) => { if (e.target === box || e.target.closest("[data-lb-close]")) close(); });
  document.body.appendChild(box);
  document.addEventListener("keydown", onKey, true);
  box.querySelector("[data-lb-close]").focus();
}

export function initZoom() {
  addEventListener("hashchange", () => { back = null; close(); });
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".zoomable img");
    if (!img || e.target.closest("button, a, .ops")) return;
    const z = img.closest(".zoomable");
    openZoom(img, z.dataset.zoomCap || img.alt, z.querySelector(".credit")?.textContent || "");
  });
}
