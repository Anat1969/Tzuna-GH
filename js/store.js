// שמירה מקומית בלבד (תיקון 13: מידע בריאותי לא עולה לשרת).
const KEY = "tzuna.v1";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
export function get(k, fallback) { const v = read()[k]; return v === undefined ? fallback : v; }
export function set(k, v) {
  try { const all = read(); all[k] = v; localStorage.setItem(KEY, JSON.stringify(all)); return true; } catch { return false; }
}
export function clearAll() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
