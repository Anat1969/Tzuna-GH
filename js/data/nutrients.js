// אבות מזון, ויטמינים ומינרלים. התפקיד בגוף עם מקור. המזונות נגזרים מ"גוף" בפרופיל (הרכב, עם מקור), לא נכתבים ביד.
// בלי כמויות, בלי מינונים ובלי קלוריות.
export const NUTRIENTS = [
  { id: "carb", kind: "macro", he: "פחמימות", sym: "", ic: "seed", re: /עמילן|פחמימות|סוכר/, role: { t: "**מקור האנרגיה העיקרי** של הגוף: עמילן בדגנים ובפקעות, סוכר בפירות.", src: "medlineplus-carbs" } },
  { id: "protein", kind: "macro", he: "חלבון", sym: "", ic: "nutrient", re: /חלבון/, role: { t: "**חומר הבניין** של שרירים, עור ואנזימים.", src: "medlineplus-protein" } },
  { id: "fat", kind: "macro", he: "שומן", sym: "", ic: "taste", re: /שומן/, role: { t: "**נחוץ לספיגה** של ויטמינים A, D, E ו-K, ומקור אנרגיה.", src: "medlineplus-fats" } },
  { id: "fiber", kind: "macro", he: "סיבים", sym: "", ic: "gut", re: /סיבים|בטא־גלוקן/, role: { t: "**החלק שלא מתעכל**: תומך בפעילות המעי ובתחושת שובע.", src: "medlineplus-fiber" } },
  { id: "vA", kind: "vitamin", he: "ויטמין A", sym: "A", re: /ויטמין A|בטא־קרוטן/, role: { t: "**ראייה, עור** ותפקוד מערכת החיסון. בצומח הוא מגיע כ**בטא־קרוטן**.", src: "medlineplus-vitamins" } },
  { id: "vC", kind: "vitamin", he: "ויטמין C", sym: "C", re: /ויטמין C/, role: { t: "**בניית רקמות** וריפוי, ו**ספיגת ברזל** מהצומח.", src: ["medlineplus-vitamins", "medlineplus-iron"] } },
  { id: "vK", kind: "vitamin", he: "ויטמין K", sym: "K", re: /ויטמין K/, role: { t: "**קרישת הדם** ובריאות העצם.", src: "medlineplus-vitamins" } },
  { id: "vE", kind: "vitamin", he: "ויטמין E", sym: "E", re: /ויטמין E/, role: { t: "**נוגד חמצון**: מגן על התאים.", src: "medlineplus-vitamins" } },
  { id: "fol", kind: "vitamin", he: "חומצה פולית", sym: "B9", re: /חומצה פולית/, role: { t: "**יצירת תאים חדשים** ותאי דם.", src: "medlineplus-vitamins" } },
  { id: "iron", kind: "mineral", he: "ברזל", sym: "Fe", re: /ברזל/, role: { t: "**נשיאת חמצן** בדם. מהצומח הוא נספג טוב יותר עם ויטמין C.", src: "medlineplus-iron" } },
  { id: "ca", kind: "mineral", he: "סידן", sym: "Ca", re: /סידן/, role: { t: "**עצמות ושיניים**, ופעילות שרירים ועצבים.", src: "medlineplus-calcium" } },
  { id: "k", kind: "mineral", he: "אשלגן", sym: "K", re: /אשלגן/, role: { t: "**פעילות שרירים ועצבים** ואיזון נוזלים.", src: "medlineplus-minerals" } }
];
export const KIND_HE = { macro: "אבות מזון", vitamin: "ויטמינים", mineral: "מינרלים" };
// מה כל סוג, ולמה הוא חשוב. מוצג בלחיצה על שם הסוג.
export const KIND_INFO = {
  macro: { short: "מה שהגוף צורך **בכמות**: אנרגיה, בניין ומעי.", long: "**פחמימות ושומן** הם מקור האנרגיה. **חלבון** הוא חומר הבניין של שריר, עור ואנזימים. **סיבים** לא מתעכלים, ותומכים בפעילות המעי. בצומח הם נאגרים בעיקר ב**זרע** ובפקעת.", src: ["medlineplus-carbs", "medlineplus-protein", "medlineplus-fats", "medlineplus-fiber"] },
  vitamin: { short: "נדרשים **בכמות קטנה**, ומפעילים תהליכים.", long: "**ויטמינים** הם חומרים שהגוף לא מייצר בכמות מספקת, ולכן מגיעים מהמזון. כל אחד מפעיל תהליך אחר: **ראייה** (A), **בניית רקמות** וספיגת ברזל (C), **קרישת דם** (K), **הגנה על התא** (E) ו**יצירת תאים** (חומצה פולית).", src: "medlineplus-vitamins" },
  mineral: { short: "יסודות **מהאדמה**, שהצמח סופג בשורש.", long: "**מינרלים** הם יסודות שהצמח סופג מהאדמה, ומשם מגיעים אלינו. **ברזל** נושא חמצן בדם, **סידן** בונה עצם ושן, ו**אשלגן** פועל בשריר ובעצב. הצירוף קובע את הספיגה: ויטמין C מגביר ספיגת ברזל מהצומח.", src: ["medlineplus-minerals", "medlineplus-iron", "medlineplus-calcium"] }
};
