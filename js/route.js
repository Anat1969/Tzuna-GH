// ניתוב hash עם פרמטרים: #/foods?id=olive&cat=seven
export function parse() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const params = Object.fromEntries(new URLSearchParams(qs || ""));
  return { view: path || "home", params };
}
export function href(view, params = {}) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));
  const qs = new URLSearchParams(clean).toString();
  return `#/${view === "home" ? "" : view}${qs ? "?" + qs : ""}`;
}
export function go(view, params, { replace = false } = {}) {
  const h = href(view, params);
  if (replace) history.replaceState(null, "", h);
  else location.hash = h;
  if (replace) window.dispatchEvent(new HashChangeEvent("hashchange"));
}
// מעדכן פרמטרים בלי רשומה חדשה בהיסטוריה, ובלי רינדור מחדש של התצוגה.
export function patch(params) {
  const { view, params: cur } = parse();
  history.replaceState(null, "", href(view, { ...cur, ...params }));
}
