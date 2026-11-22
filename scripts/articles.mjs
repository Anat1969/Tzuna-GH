// מפיק את articles.json: הכתבות כקובץ פתוח, שהמגזין "חוט" (MaAmarim-GH) קורא. הכתבה נשארת כאן, ושם אין עותק.
// הרצה: node scripts/articles.mjs   (אחרי כל שינוי בכתבה, או בנתונים שהיא נגזרת מהם)
// הכתבות נבנות בדפדפן (js/views/articles.js), ולכן הקובץ מופק מדפדפן, מול שרת מקומי של הריפו.
// tests/e2e.cjs נכשל כשהקובץ לא תואם את הכתבות שבדף, כך שאי אפשר לשכוח להריץ.
import { createServer } from "http";
import { createReadStream, existsSync, statSync, writeFileSync, readFileSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const URL_ = "https://tzuna-gh.vercel.app";
const TYPES = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
// התמונה של כל כתבה היא הצילום שכבר נבחר לה בדף היצירות (creations.json). כתבה בלי צילום נשארת בלי.
const ROOM = { "hot-cold": "east-west" };

export function withImages(list) {
  const rooms = JSON.parse(readFileSync(join(ROOT, "creations.json"), "utf8")).topics;
  return {
    app: { id: "tzuna", name: "מזון, גוף ונפש", url: URL_, repo: "Anat1969/Tzuna-GH" },
    articles: list.map((a) => {
      const room = rooms.find((t) => t.id === (ROOM[a.id] || a.id));
      const c = room?.creations.find((x) => x.image);
      return { id: a.id, url: `${URL_}/#/articles?a=${a.id}`, zone: a.zone, kicker: a.kicker, title: a.title, sub: a.sub, image: c ? `${URL_}/${c.image}` : null, credit: c?.credit || null, body: a.body, quote: a.quote, pull: a.pull, insight: a.insight, stats: a.stats, haiku: a.haiku, notes: a.notes };
    })
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { chromium } = createRequire(import.meta.url)("playwright");
  const server = await new Promise((res) => {
    const s = createServer((req, r) => {
      const u = decodeURIComponent(new URL(req.url, "http://x").pathname), f = join(ROOT, u === "/" ? "index.html" : u);
      if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream" });
      createReadStream(f).pipe(r);
    }).listen(0, () => res(s));
  });
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto(`http://localhost:${server.address().port}/#/articles`, { waitUntil: "networkidle" });
  const list = await p.evaluate(() => import("/js/views/articles.js").then((m) => m.articlesFeed()));
  await b.close(); server.close();
  const data = withImages(list);
  writeFileSync(join(ROOT, "articles.json"), JSON.stringify(data, null, 2) + "\n");
  console.log(`${data.articles.length} כתבות נכתבו ל-articles.json`);
}
