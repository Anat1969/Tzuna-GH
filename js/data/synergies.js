// צירופים מעצימים: מזון אחד מפעיל איכות של מזון אחר.
// a, b: מזונות מהגלריה (b יכול להיות null, ואז mate הוא מרכיב חיצוני).
// kind: "boost" (מעצים) או "block" (מחליש). how: המנגנון. dishes: מתכונים שבהם הצירוף קורה.

export const SYNERGIES = [
  {
    id: "turmeric-pepper", a: "turmeric", b: null, mate: "פלפל שחור", kind: "boost",
    title: "כורכום + פלפל שחור",
    how: "**פיפרין** מהפלפל משפר את **הזמינות הביולוגית** של הכורכומין, שנספג רע לבדו.",
    ev: "בינונית", src: "nccih-turmeric", suggest: "דאל, קארי, או אורז צהוב: כורכום, פלפל שחור ושמן באותו סיר.", dishes: ["dal"]
  },
  {
    id: "iron-vitc", a: "lentil", b: "tomato", mate: "לימון", kind: "boost",
    title: "קטניות + ויטמין C",
    how: "**ויטמין C** (לימון, עגבנייה) מגביר את ספיגת **הברזל** מהצומח.",
    ev: "גבוהה", src: "medlineplus-iron", suggest: "מג'דרה עם סלט עגבניות, חומוס עם לימון, טאבולה.", dishes: ["dal", "nezid", "ful", "hummus", "majadra", "tabbouleh", "stuffed-chard"]
  },
  {
    id: "lycopene-oil", a: "tomato", b: "olive", mate: null, kind: "boost",
    title: "עגבנייה + שמן זית + בישול",
    how: "**ליקופן** נספג יותר מעגבנייה **מבושלת**, ומסיס בשומן.",
    ev: "בינונית", src: ["gartner-1997", "unlu-2005"], suggest: "שקשוקה, רוטב עגבניות ארוך עם שמן זית.", dishes: ["shakshuka", "salad"]
  },
  {
    id: "grain-legume", a: "wheat", b: "lentil", mate: null, kind: "boost",
    title: "דגן + קטנייה",
    how: "חלבון הדגן חסר **ליזין**, וחלבון הקטניות חסר **מתיונין**. יחד הם **משלימים** זה את זה.",
    ev: "גבוהה", src: "who-protein-2007", suggest: "מג'דרה (עדשים ואורז), נזיד ולחם, חומוס ופיתה.", dishes: ["nezid", "majadra", "hummus"]
  },
  {
    id: "garlic-wait", a: "garlic", b: null, mate: "המתנה של 10 דקות", kind: "boost",
    title: "שום כתוש + המתנה",
    how: "כתישה מפעילה אנזים שיוצר **אליצין**. המתנה של **10 דקות** לפני חימום שומרת עליו.",
    ev: "ראשונית", src: "song-milner-2001", suggest: "כותשים שום ראשון, ומכינים את השאר בזמן ההמתנה.", dishes: ["ful", "hummus", "shakshuka"]
  },
  {
    id: "brassica-mustard", a: "cabbage", b: "mustard", mate: null, kind: "boost",
    title: "כרוב מבושל + זרעי חרדל",
    how: "בישול הורס את האנזים **מירוזינאז** בכרוב. זרעי חרדל מחזירים אותו, ואיתו את **סולפורפן**.",
    ev: "ראשונית", src: "okunade-2018", suggest: "כרוב מוקפץ עם זרעי חרדל קלויים, או כרוב מבושל עם רוטב חרדל.", dishes: []
  },
  {
    id: "sesame-chickpea", a: "chickpea", b: "sesame", mate: null, kind: "boost",
    title: "חומוס + טחינה",
    how: "קטנייה וזרע **משלימים חלבון**, ולימון מוסיף ויטמין C לספיגת ברזל.",
    ev: "גבוהה", src: ["who-protein-2007", "medlineplus-iron"], suggest: "חומוס עם טחינה ולימון.", dishes: ["hummus"]
  },
  {
    id: "tea-iron", a: "lentil", b: null, mate: "תה שחור", kind: "block",
    title: "קטניות + תה שחור",
    how: "תה שחור באותה ארוחה **מפחית** ספיגת ברזל מהצומח. שותים אותו **אחרי**.",
    ev: "גבוהה", src: "medlineplus-iron", suggest: "תה, שעה אחרי ארוחת קטניות.", dishes: []
  },
  {
    id: "oxalate-calcium", a: "chard", b: null, mate: "מוצרי חלב", kind: "block",
    title: "עלים עם חומצה אוקסלית + סידן",
    how: "**חומצה אוקסלית** בעלים כמו תרד ומנגולד **קושרת סידן** מאותה מנה.",
    ev: "גבוהה", src: "medlineplus-calcium", suggest: "מנגולד בנפרד ממנה של גבינה. את הסידן מקבלים ממקור אחר.", dishes: []
  },
  {
    id: "bran-calcium", a: "wheat", b: null, mate: "סובין + סידן", kind: "block",
    title: "סובין חיטה + סידן",
    how: "**סובין חיטה** קושר סידן ומפחית את ספיגתו מאותה ארוחה.",
    ev: "גבוהה", src: "medlineplus-calcium", suggest: "דגנים מלאים בארוחה אחרת מזו שבה סומכים על חלב כמקור סידן.", dishes: []
  },
  {
    id: "grapefruit-drugs", a: "grapefruit", b: null, mate: "תרופות מסוימות", kind: "block",
    title: "אשכולית + תרופות מסוימות",
    how: "האשכולית **מעכבת אנזים** שמפרק תרופות במעי, ומעלה את ריכוזן בדם.",
    ev: "גבוהה", src: "fda-grapefruit", suggest: "מי שנוטל תרופה קבועה בודק את העלון לפני אשכולית.", dishes: []
  },
  {
    id: "rambam-order", a: "fig", b: "pomegranate", mate: null, kind: "boost",
    title: "תאנה לפני, רימון אחרי",
    how: "הרמב\"ם: הפירות ה**משלשלין** קודם הארוחה, וה**מאמצין** תכף אחריה. ==סדר הוא צירוף בזמן.==",
    ev: "מסורת", src: "rambam-deot", suggest: "תאנים ושקדים בפתיחת הארוחה, סלט כרוב ורימון בסופה.", dishes: ["fig-almond", "cabbage-pomegranate"]
  }
];

export const synergiesFor = (foodId) => SYNERGIES.filter((s) => s.a === foodId || s.b === foodId);
export const synergiesInRecipe = (recipeId) => SYNERGIES.filter((s) => s.dishes.includes(recipeId));
