// מזונות. מבנה לפי docs/DATA_MODEL.md, עם הרחבות לתצוגה (shape, hue, months).
// known: חייב src ו-ev. said: חייב src ו-trad. believed: חייב status.
// טקסט עשיר: **מודגש**, ==תובנה==. מספרים מודגשים אוטומטית.
// months: עונה בשדה בישראל. הערכה בלבד (source: season-est), לא עובדה.
// meal: before / after לפי הרמב"ם, הלכות דעות ד ו. null כשאין.
// concentrated: נצרך גם כחליטה או כתוסף. מפעיל מסך "קבוצות מיוחדות".

export const CATEGORIES = [
  { id: "seven", he: "שבעת המינים" },
  { id: "grains", he: "דגנים" },
  { id: "legumes", he: "קטניות" },
  { id: "nuts", he: "אגוזים וזרעים" },
  { id: "veg", he: "ירקות ופירות" },
  { id: "herbs", he: "תבלינים ועשבים" }
];

// 14 האלרגנים העיקריים (EU 1169/2011). רק אלה שרלוונטיים לדאטה מוצגים בסינון.
export const ALLERGENS = {
  gluten: "דגנים עם גלוטן",
  nuts: "אגוזים",
  sesame: "שומשום",
  lupin: "תורמוס",
  peanuts: "בוטנים",
  soy: "סויה",
  milk: "חלב",
  eggs: "ביצים",
  fish: "דגים",
  crustaceans: "סרטנים",
  molluscs: "רכיכות",
  celery: "סלרי",
  mustard: "חרדל",
  sulphites: "סולפיטים"
};

import { KITCHEN_FOODS } from "./kitchen.js";

const BASE_FOODS = [
  {
    id: "olive", he: "זית", en: "Olive", la: "Olea europaea", alt: ["זיתים", "שמן זית"],
    family: "זיתיים", family_la: "Oleaceae", part: "פרי ושמן",
    cat: "seven", months: [10, 11, 12], season_kind: "מסיק", meal: null,
    allergens: [], shape: "olive", hue: "#5b7f3a",
    recognize: { t: "פרי **בית־גלעין**: ציפה עשירה בשמן סביב גלעין קשה.", src: "powo" },
    use: { t: "**כבוש** כמזון, ו**שמן** לבישול ולתיבול.", src: "culinary" },
    layers: {
      known: [{ t: "בניסוי **PREDIMED**, דיאטה ים־תיכונית עם **שמן זית כתית** נקשרה לפחות אירועי לב וכלי דם, בהשוואה לדיאטה דלת שומן.", ev: "בינונית", src: "predimed-2018" }],
      said: [
        { t: "\"ארץ זית שמן ודבש\": הזית הוא אחד מ**שבעת המינים**.", trad: "מקרא", ref: "דברים ח ח", src: "tanakh" },
        { t: "\"להצהיל פנים משמן\": השמן כסימן ל**שמחה** ולרווחה.", trad: "מקרא", ref: "תהלים קד טו", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה שכף שמן זית על בטן ריקה בבוקר **מועילה לכבד**.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "wheat", he: "חיטה", en: "Wheat", la: "Triticum aestivum", alt: ["חיטים", "בורגול", "קמח"],
    family: "דגניים", family_la: "Poaceae", part: "גרעין",
    cat: "seven", months: [5, 6], season_kind: "קציר", meal: null,
    allergens: ["gluten"], shape: "grain", hue: "#b8862b",
    recognize: { t: "**גרעין שלם**: סובין, נבט ואנדוספרם. בקמח מזוקק נשאר בעיקר האנדוספרם.", src: "moh-2021" },
    use: { t: "**לחם**, פתיתים, בורגול ופריקה.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות משרד הבריאות ו־WHO ממליצות להעדיף **דגנים מלאים** על פני דגנים מזוקקים.", ev: "גבוהה", src: ["moh-2021", "who-2023"] }],
      said: [
        { t: "\"ולחם לבב אנוש יסעד\": הלחם כמזון ש**תומך בלב**.", trad: "מקרא", ref: "תהלים קד טו", src: "tanakh" },
        { t: "החיטה **פותחת** את רשימת שבעת המינים.", trad: "מקרא", ref: "דברים ח ח", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה שלחם **מחמצת** מתאים למי שחולה בצליאק.", status: "לא אוששה" }]
    },
    safety: { flags: ["allergen"], note: "לחם מחמצת מחיטה מכיל **גלוטן**." }
  },
  {
    id: "barley", he: "שעורה", en: "Barley", la: "Hordeum vulgare",
    family: "דגניים", family_la: "Poaceae", part: "גרעין",
    cat: "seven", months: [3, 4], season_kind: "קציר", meal: null,
    allergens: ["gluten"], shape: "barley", hue: "#c49a3a",
    recognize: { t: "שיבולת עם **מלענים** ארוכים: זיפים דקים שבולטים מכל גרעין.", src: "powo" },
    use: { t: "**גריסים** במרק ובתבשיל.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות משרד הבריאות ממליצות להעדיף **דגנים מלאים**, ושעורה נמנית ביניהם.", ev: "גבוהה", src: "moh-2021" }],
      said: [
        { t: "\"בתחלת קציר שערים\": רות ונעמי מגיעות ל**בית לחם**.", trad: "מקרא", ref: "רות א כב", src: "tanakh" },
        { t: "השעורה היא **השנייה** בשבעת המינים, והראשונה להבשיל.", trad: "מקרא", ref: "דברים ח ח", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה ש**מי שעורים** מועילים לכליות.", status: "לא נבדק" }]
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "grape", he: "ענבים", en: "Grape", la: "Vitis vinifera", alt: ["ענב", "צימוקים", "גפן"],
    family: "גפניים", family_la: "Vitaceae", part: "פרי",
    cat: "seven", months: [7, 8, 9], season_kind: "בציר", meal: "before",
    allergens: [], shape: "grape", hue: "#6b3a6e",
    recognize: { t: "**אשכול** של ענבות, על גפן מטפסת.", src: "powo" },
    use: { t: "טרי, **צימוקים**, ועלי גפן ממולאים.", src: "culinary" },
    layers: {
      known: [{ t: "WHO ממליצה על **פרי שלם**. סוכר ב**מיץ פירות** נחשב סוכר חופשי, כמו סוכר מוסף.", ev: "גבוהה", src: "who-2023" }],
      said: [
        { t: "ענבים נמנים בין הפירות \"המשלשלין\": אוכלים אותם **קודם הארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" },
        { t: "\"איש תחת גפנו ותחת תאנתו\": הגפן כדימוי ל**שלום**.", trad: "מקרא", ref: "מיכה ד ד", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה שענבים אדומים **שומרים על הלב** כמו יין אדום.", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "fig", he: "תאנה", en: "Fig", la: "Ficus carica", alt: ["תאנים"],
    family: "תותיים", family_la: "Moraceae", part: "פרי",
    cat: "seven", months: [6, 7, 8, 9], season_kind: "פרי", meal: "before",
    allergens: [], shape: "fig", hue: "#7a4a5a",
    recognize: { t: "התאנה היא **פגה**: תפרחת סגורה, והפרחים נמצאים בתוכה.", src: "powo" },
    use: { t: "טרייה, **מיובשת**, ובריבה.", src: "culinary" },
    layers: {
      known: [{ t: "תאנה מיובשת היא מקור ל**סיבים תזונתיים**.", ev: "גבוהה", src: "usda-fdc" }],
      said: [
        { t: "\"התאנים והענבים והשקדים **לעולם טובים**\".", trad: "הרמב\"ם", ref: "הלכות דעות ד יא", src: "rambam-deot" },
        { t: "תאנים נאכלות **קודם הארוחה**, כמו ענבים.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }
      ],
      believed: [{ t: "רווחת אמונה שתאנה **מקלה על שיעול**.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "pomegranate", he: "רימון", en: "Pomegranate", la: "Punica granatum", alt: ["רימונים"],
    family: "כופריים", family_la: "Lythraceae", part: "זרעים עטופי ציפה",
    cat: "seven", months: [9, 10, 11], season_kind: "פרי", meal: "after",
    allergens: [], shape: "pomegranate", hue: "#a32d3a",
    recognize: { t: "קליפה עבה ו**כתר** של עלי גביע. בפנים מאות זרעים עטופי ציפה.", src: "powo" },
    use: { t: "גרגרים טריים, **סירופ רימונים** ומיץ.", src: "culinary" },
    layers: {
      known: [{ t: "גרגרי רימון מכילים **סיבים תזונתיים** ו**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
      said: [
        { t: "רימונים נמנים בין הפירות \"המאמצין\": אוכלים אותם **תכף לארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" },
        { t: "\"כפלח הרמון רקתך\": הרימון כדימוי ל**יופי**.", trad: "מקרא", ref: "שיר השירים ד ג", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה שרימון **מגן מפני סרטן**.", status: "לא נבדק בבני אדם" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "date", he: "תמר", en: "Date", la: "Phoenix dactylifera", alt: ["תמרים", "סילאן"],
    family: "דקליים", family_la: "Arecaceae", part: "פרי",
    cat: "seven", months: [8, 9, 10], season_kind: "פרי", meal: null,
    allergens: [], shape: "date", hue: "#8a5a2b",
    recognize: { t: "פרי עם **זרע אחד**, באשכולות גדולים על דקל.", src: "powo" },
    use: { t: "טרי, מיובש, ו**סילאן**.", src: "culinary" },
    layers: {
      known: [{ t: "**סילאן** ודבש נחשבים לפי WHO ל**סוכר חופשי**, כמו סוכר מוסף.", ev: "גבוהה", src: "who-2023" }],
      said: [{ t: "\"ארץ זית שמן ודבש\": במסורת הפרשנית, ה\"דבש\" בפסוק הוא **דבש תמרים**.", trad: "פרשנות מסורתית", ref: "דברים ח ח", src: "tanakh" }],
      believed: [{ t: "רווחת אמונה שסילאן הוא \"**סוכר בריא**\" שאין צורך להגביל.", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "lentil", he: "עדשים", en: "Lentil", la: "Lens culinaris", alt: ["עדשה", "מג'דרה"],
    family: "קטניות", family_la: "Fabaceae", part: "זרע",
    cat: "legumes", months: [4, 5], season_kind: "קציר", meal: null,
    allergens: [], shape: "legume", hue: "#9a6a3a",
    recognize: { t: "זרע **עדשתי**. המילה \"עדשה\" באופטיקה באה ממנו, בעברית ובלטינית (lens).", src: "powo" },
    use: { t: "**מג'דרה**, מרק עדשים וסלט.", src: "culinary" },
    layers: {
      known: [
        { t: "הנחיות משרד הבריאות ממליצות על **קטניות** כחלק קבוע מהתפריט.", ev: "גבוהה", src: "moh-2021" },
        { t: "עדשים הן מקור ל**חלבון צמחי** ול**סיבים**.", ev: "גבוהה", src: "usda-fdc" }
      ],
      said: [{ t: "\"ויעקב נתן לעשו לחם ונזיד עדשים\": התבשיל שעליו נמכרה **הבכורה**.", trad: "מקרא", ref: "בראשית כה לד", src: "tanakh" }],
      believed: [{ t: "רווחת אמונה שמרק עדשים **מחמם את הגוף** בחורף.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "chickpea", he: "חומוס", en: "Chickpea", la: "Cicer arietinum", alt: ["גרגרי חומוס"],
    family: "קטניות", family_la: "Fabaceae", part: "זרע",
    cat: "legumes", months: [3, 4], season_kind: "ירוק", meal: null,
    allergens: [], shape: "chickpea", hue: "#c4a46a",
    recognize: { t: "זרע עם מקור קטן, כמו ראש של **איל**. מכאן השם arietinum.", src: "powo" },
    use: { t: "**חומוס**, פלאפל ומרק. באביב נאכל ירוק וטרי.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות משרד הבריאות ממליצות על **קטניות**, וחומוס נמנה ביניהן.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "חומוס הוא **בסיס של ארוחה ביתית** במטבח המזרח־תיכוני.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "fava", he: "פול", en: "Fava bean", la: "Vicia faba", alt: ["פול מדמס"],
    family: "קטניות", family_la: "Fabaceae", part: "זרע",
    cat: "legumes", months: [2, 3, 4], season_kind: "ירוק", meal: null,
    allergens: [], shape: "pod", hue: "#6a8a3a",
    recognize: { t: "**תרמיל** עבה, ובתוכו זרעים גדולים ושטוחים.", src: "powo" },
    use: { t: "**פול מדמס**, ופול ירוק באביב.", src: "culinary" },
    layers: {
      known: [{ t: "אצל אנשים עם **חסר G6PD**, אכילת פול עלולה לגרום לפירוק תאי דם אדומים (**פביזם**).", ev: "גבוהה", src: "medlineplus-g6pd" }],
      said: [{ t: "**פול מדמס** הוא ארוחת בוקר מסורתית במצרים ובארץ ישראל.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
      believed: [{ t: "רווחת אמונה שפול ירוק בטוח לכולם כי הוא **טרי**.", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "**חסר G6PD**: לא אוכלים פול, גם לא ירוק. בירור אצל רופא." }
  },
  {
    id: "lupin", he: "תורמוס", en: "Lupin", la: "Lupinus albus", alt: ["תורמוסים"],
    family: "קטניות", family_la: "Fabaceae", part: "זרע",
    cat: "legumes", months: [4, 5], season_kind: "קציר", meal: null,
    allergens: ["lupin"], shape: "lupin", hue: "#d1b45a",
    recognize: { t: "תרמיל שעיר, וזרעים **שטוחים ועגולים**.", src: "powo" },
    use: { t: "**כבוש** במלח, כחטיף. נאכל רק אחרי השריה ושטיפה ממושכות.", src: "culinary" },
    layers: {
      known: [{ t: "**תורמוס** נמנה בין 14 האלרגנים שחובה לסמן באירופה.", ev: "גבוהה", src: "eu-1169" }],
      said: [{ t: "חטיף רחוב **ים־תיכוני**: במצרים, בלבנון ובישראל.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
      believed: []
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "almond", he: "שקד", en: "Almond", la: "Prunus amygdalus", alt: ["שקדים"],
    family: "ורדיים", family_la: "Rosaceae", part: "זרע",
    cat: "nuts", months: [3, 4, 7, 8], season_kind: "ירוק ובשל", meal: null,
    allergens: ["nuts"], shape: "almond", hue: "#a8784a",
    recognize: { t: "השקד הוא **זרע** של פרי בית־גלעין. הקליפה הירוקה נפתחת כשהוא מבשיל.", src: "powo" },
    use: { t: "קלוי, **שקדים ירוקים** באביב, וחלב שקדים.", src: "culinary" },
    layers: {
      known: [{ t: "בניסוי **PREDIMED**, דיאטה ים־תיכונית עם **אגוזים** (שקדים, אגוזי מלך ולוז) נקשרה לפחות אירועי לב וכלי דם.", ev: "בינונית", src: "predimed-2018" }],
      said: [
        { t: "\"ויצץ ציץ ויגמל שקדים\": **מטה אהרן** פורח.", trad: "מקרא", ref: "במדבר יז כג", src: "tanakh" },
        { t: "\"מקל שקד אני ראה\": השקד ב**חזון** הנביא.", trad: "מקרא", ref: "ירמיהו א יא", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה שחמישה שקדים בבוקר **משפרים את הזיכרון**.", status: "לא נבדק" }]
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "walnut", he: "אגוז מלך", en: "Walnut", la: "Juglans regia", alt: ["אגוזים", "אגוזי מלך", "אגוז"],
    family: "אגוזיים", family_la: "Juglandaceae", part: "זרע",
    cat: "nuts", months: [9, 10], season_kind: "פרי", meal: null,
    allergens: ["nuts"], shape: "walnut", hue: "#7a5a3a",
    recognize: { t: "גרעין מקומט בתוך קליפה קשה. הקליפה הירוקה החיצונית **מכתימה** את הידיים.", src: "powo" },
    use: { t: "קלוי, במאפים ובסלט.", src: "culinary" },
    layers: {
      known: [{ t: "אגוזי מלך היו חלק מ**תערובת האגוזים** בניסוי PREDIMED, שנקשרה לפחות אירועי לב וכלי דם.", ev: "בינונית", src: "predimed-2018" }],
      said: [{ t: "\"אל גנת אגוז ירדתי\": **גינת האגוז** כמקום של התחדשות.", trad: "מקרא", ref: "שיר השירים ו יא", src: "tanakh" }],
      believed: [{ t: "רווחת אמונה שאגוז מלך **טוב למוח** כי הוא נראה כמו מוח.", status: "לא נבדק" }]
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "sesame", he: "שומשום", en: "Sesame", la: "Sesamum indicum", alt: ["טחינה", "שומשומין"],
    family: "שומשומיים", family_la: "Pedaliaceae", part: "זרע",
    cat: "nuts", months: [8, 9], season_kind: "קציר", meal: null,
    allergens: ["sesame"], shape: "sesame", hue: "#c8a868",
    recognize: { t: "**הלקט** שנפתח כשהוא מבשיל, ומפזר זרעים זעירים.", src: "powo" },
    use: { t: "**טחינה**, חלבה ותערובת זעתר.", src: "culinary" },
    layers: {
      known: [{ t: "**שומשום** נמנה בין 14 האלרגנים העיקריים, וגם **טחינה** מכילה אותו.", ev: "גבוהה", src: "eu-1169" }],
      said: [{ t: "טחינה היא **רוטב יסוד** במטבח הישראלי והלבנטיני.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
      believed: []
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "watermelon", he: "אבטיח", en: "Watermelon", la: "Citrullus lanatus", alt: ["אבטיחים"],
    family: "דלועיים", family_la: "Cucurbitaceae", part: "פרי",
    cat: "veg", months: [6, 7, 8], season_kind: "פרי", meal: "before",
    allergens: [], shape: "round", hue: "#3a7a4a",
    recognize: { t: "פרי גדול של צמח **זוחל**, עם קליפה עבה.", src: "powo" },
    use: { t: "טרי, עם **גבינה בולגרית** בקיץ.", src: "culinary" },
    layers: {
      known: [{ t: "אבטיח הוא בעיקר **מים**: כ־90% ממשקלו.", ev: "גבוהה", src: "usda-fdc" }],
      said: [
        { t: "\"זכרנו... את הקשאים ואת האבטחים\": המזון שבני ישראל **זכרו ממצרים**.", trad: "מקרא", ref: "במדבר יא ה", src: "tanakh" },
        { t: "אבטיחים נמנים בין \"המשלשלין\": אוכלים אותם **קודם הארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }
      ],
      believed: [{ t: "רווחת אמונה שאבטיח עם **מים** גורם לכאבי בטן.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "cucumber", he: "מלפפון", en: "Cucumber", la: "Cucumis sativus", alt: ["מלפפונים"],
    family: "דלועיים", family_la: "Cucurbitaceae", part: "פרי",
    cat: "veg", months: [4, 5, 6, 7, 8, 9, 10], season_kind: "פרי", meal: "before",
    allergens: [], shape: "long", hue: "#4a7a3a",
    recognize: { t: "פרי של צמח **מטפס**, שנקטף לפני שהוא מבשיל.", src: "powo" },
    use: { t: "**סלט קצוץ** וחמוצים.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **ירקות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "\"מיני קישואים ומיני מלפפונות\" נאכלים **קודם הארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }],
      believed: [{ t: "רווחת אמונה שפרוסות מלפפון על העיניים **מצעירות את העור**.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "onion", he: "בצל", en: "Onion", la: "Allium cepa", alt: ["בצלים"],
    family: "נרקיסיים", family_la: "Amaryllidaceae", part: "בצל (גבעול ועלים)",
    cat: "veg", months: [4, 5, 6], season_kind: "אסיף", meal: null,
    allergens: [], shape: "bulb", hue: "#a8643a",
    recognize: { t: "הבצל הוא **גבעול מקוצר**. השכבות הן עלים עבים שאוגרים מזון.", src: "powo" },
    use: { t: "בסיס של **כמעט כל תבשיל**.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **ירקות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "\"ואת הבצלים ואת השומים\": עוד מזון ש**זכרו ממצרים**.", trad: "מקרא", ref: "במדבר יא ה", src: "tanakh" }],
      believed: [{ t: "רווחת אמונה שבצל חתוך בחדר **סופג חיידקים** מהאוויר.", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "garlic", he: "שום", en: "Garlic", la: "Allium sativum",
    family: "נרקיסיים", family_la: "Amaryllidaceae", part: "בצל (שיניים)",
    cat: "veg", months: [3, 4, 5], season_kind: "טרי", meal: null,
    allergens: [], shape: "garlic", hue: "#9a8a7a",
    recognize: { t: "ראש שום עשוי **שיניים**. כל שן היא ניצן שיכול לצמוח לצמח חדש.", src: "powo" },
    use: { t: "טרי או קלוי, **בתיבול**.", src: "culinary" },
    layers: {
      known: [{ t: "**תוספי שום** עלולים להגביר סיכון לדימום אצל מי שנוטל **מדללי דם**.", ev: "בינונית", src: "nccih-garlic" }],
      said: [{ t: "\"ואת הבצלים ואת השומים\": השום ב**רשימת מצרים**.", trad: "מקרא", ref: "במדבר יא ה", src: "tanakh" }],
      believed: [{ t: "רווחת אמונה ששום **מונע הצטננות**.", status: "לא אוששה" }]
    },
    safety: { flags: ["medication_interaction"], note: "תוספי שום ו**מדללי דם**: לבדוק עם רוקח." }
  },
  {
    id: "tomato", he: "עגבנייה", en: "Tomato", la: "Solanum lycopersicum", alt: ["עגבניות", "רסק עגבניות"],
    family: "סולניים", family_la: "Solanaceae", part: "פרי",
    cat: "veg", months: [5, 6, 7, 8, 9, 10], season_kind: "פרי", meal: null,
    allergens: [], shape: "tomato", hue: "#c43a2a",
    recognize: { t: "מקורה ב**דרום אמריקה**. לכן אין לה זכר במקרא ובתלמוד.", src: "powo" },
    use: { t: "סלט, **שקשוקה** ורוטב.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **ירקות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "zaatar", he: "זעתר (אזוב)", en: "Syrian oregano", la: "Origanum syriacum", alt: ["זעתר", "אזוב"],
    family: "שפתניים", family_la: "Lamiaceae", part: "עלים",
    cat: "herbs", months: [3, 4, 5, 6], season_kind: "עלים", meal: null,
    allergens: [], shape: "herb", hue: "#5a7a4a", concentrated: true,
    recognize: { t: "שיח נמוך עם עלים **שעירים ואפרפרים** וריח חריף.", src: "flora-il" },
    use: { t: "תערובת **זעתר** עם שומשום ושמן זית, ועלים טריים במאפה.", src: "culinary" },
    layers: {
      known: [],
      said: [
        { t: "\"ולקחתם אגדת אזוב\": האזוב בטקס **הפסח**.", trad: "מקרא", ref: "שמות יב כב", src: "tanakh" },
        { t: "רס\"ג תרגם \"אזוב\" ל**צעתר**. מכאן הזיהוי המקובל עם הזעתר.", trad: "פרשנות מסורתית", ref: "", src: "saadia-tafsir" }
      ],
      believed: [{ t: "רווחת אמונה שזעתר בבוקר **מחדד את הזיכרון** לפני מבחן.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "sage", he: "מרווה", en: "Greek sage", la: "Salvia fruticosa", alt: ["מרמיה"],
    family: "שפתניים", family_la: "Lamiaceae", part: "עלים",
    cat: "herbs", months: [3, 4, 5], season_kind: "עלים", meal: null,
    allergens: [], shape: "herb2", hue: "#7a8a7a", concentrated: true,
    recognize: { t: "שיח עם עלים **רכים ואפורים**, ולעתים זוג אוזניות קטנות בבסיס העלה.", src: "flora-il" },
    use: { t: "**חליטה**, ותיבול.", src: "culinary" },
    layers: {
      known: [],
      said: [{ t: "חליטת מרווה מתועדת ב**רפואה העממית** בישראל ובגליל.", trad: "רפואה עממית", ref: "", src: "said-2002" }],
      believed: [{ t: "רווחת אמונה שתה מרווה **מרגיע כאבי בטן**.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "ginger", he: "ג'ינג'ר", en: "Ginger", la: "Zingiber officinale",
    family: "זנגביליים", family_la: "Zingiberaceae", part: "קנה שורש",
    cat: "herbs", months: [], season_kind: "יבוא", meal: null,
    allergens: [], shape: "rhizome", hue: "#c49a5a", concentrated: true,
    recognize: { t: "**קנה שורש**: גבעול שגדל מתחת לאדמה, לא שורש.", src: "powo" },
    use: { t: "טרי בתבשיל, **חליטה**, וכבוש.", src: "culinary" },
    layers: {
      known: [],
      said: [{ t: "ברפואה הסינית ג'ינג'ר נחשב **מחמם**.", trad: "רפואה סינית", ref: "", src: "nccih-tcm" }],
      believed: [{ t: "רווחת אמונה שתה ג'ינג'ר **מגן מהצטננות**.", status: "לא נבדק בבני אדם" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "turmeric", he: "כורכום (תבלין)", en: "Turmeric", la: "Curcuma longa", alt: ["כורכום"],
    family: "זנגביליים", family_la: "Zingiberaceae", part: "קנה שורש",
    cat: "herbs", months: [], season_kind: "יבוא", meal: null,
    allergens: [], shape: "rhizome2", hue: "#d49a1a", concentrated: true,
    recognize: { t: "קנה שורש **כתום** מבפנים. נטחן לאבקה צהובה.", src: "powo" },
    use: { t: "תבלין צהוב ב**קארי** ובאורז.", src: "culinary" },
    layers: {
      known: [{ t: "פגיעה כבדית דווחה בעיקר ב**תוספים מרוכזים**, לא בכורכום **כתבלין במזון**.", ev: "מקרי דיווח", src: "livertox-turmeric" }],
      said: [{ t: "כורכום הוא תבלין יסוד ב**מטבח ההודי**.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
      believed: [{ t: "רווחת אמונה שכורכום במינון גבוה **מועיל לדלקות**.", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "**תוסף** כורכום מרוכז נמצא ברשימה האדומה.", redlink: "turmeric-supp" }
  },
  {
    id: "grapefruit", he: "אשכולית", en: "Grapefruit", la: "Citrus × paradisi", alt: ["אשכוליות"],
    family: "פיגמיים", family_la: "Rutaceae", part: "פרי",
    cat: "veg", months: [11, 12, 1, 2, 3], season_kind: "פרי", meal: null,
    allergens: [], shape: "citrus", hue: "#d4704a",
    recognize: { t: "הכלאה של **פומלה** ו**תפוז**.", src: "powo" },
    use: { t: "טרייה, **מיץ**, ובסלט חורף.", src: "culinary" },
    layers: {
      known: [{ t: "אשכולית ומיצה משנים את פירוק **תרופות מסוימות** בגוף, ועלולים להגביר את ריכוזן.", ev: "גבוהה", src: "fda-grapefruit" }],
      said: [],
      believed: []
    },
    safety: { flags: ["medication_interaction"], note: "נוטלים תרופות קבועות? לשאול **רוקח** לפני אשכולית." }
  },
  {
    id: "carob", he: "חרוב", en: "Carob", la: "Ceratonia siliqua", alt: ["חרובים"],
    family: "קטניות", family_la: "Fabaceae", part: "תרמיל",
    cat: "veg", months: [8, 9, 10], season_kind: "פרי", meal: null,
    allergens: [], shape: "carob", hue: "#5a3a2a",
    recognize: { t: "**תרמיל** חום וארוך. הזרעים קשים ונראים אחידים.", src: "powo" },
    use: { t: "**דבש חרובים**, קמח חרובים, ותרמילים לנשנוש.", src: "culinary" },
    layers: {
      known: [{ t: "תרמיל החרוב **מתוק**, ומכיל סיבים תזונתיים.", ev: "גבוהה", src: "usda-fdc" }],
      said: [{ t: "\"כי היכי דשתלו לי אבהתי, שתלי נמי לבראי\": חוני המעגל פוגש אדם ש**נוטע חרוב לנכדיו**.", trad: "תלמוד", ref: "תענית כג ע\"א", src: "bavli-taanit-23a" }],
      believed: [{ t: "רווחת אמונה שזרעי החרוב **שוקלים תמיד אותו משקל**, ולכן שימשו למידת ה\"קרט\".", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "oat", he: "שיבולת שועל", en: "Oat", la: "Avena sativa", alt: ["קוואקר", "שיבולת"],
    family: "דגניים", family_la: "Poaceae", part: "גרעין",
    cat: "grains", months: [4, 5], season_kind: "קציר", meal: null,
    allergens: ["gluten"], shape: "oat", hue: "#b4a46a",
    recognize: { t: "**מכבד** פתוח: גרעינים תלויים על זרועות דקות, לא שיבולת צפופה.", src: "powo" },
    use: { t: "**דייסה**, גרנולה ועוגיות.", src: "culinary" },
    layers: {
      known: [
        { t: "הנחיות משרד הבריאות ממליצות להעדיף **דגנים מלאים**.", ev: "גבוהה", src: "moh-2021" },
        { t: "שיבולת שועל נכללת ב**דגנים עם גלוטן** לצורך סימון אלרגנים.", ev: "גבוהה", src: "eu-1169" }
      ],
      said: [{ t: "\"החטים והשעורים והכסמין ושבלת שועל ושיפון\": **חמשת מיני דגן**. הזיהוי עם oat שנוי במחלוקת.", trad: "משנה", ref: "חלה א א", src: "mishnah-challah" }],
      believed: []
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "apple", he: "תפוח", en: "Apple", la: "Malus domestica", alt: ["תפוחים"],
    family: "ורדיים", family_la: "Rosaceae", part: "פרי",
    cat: "veg", months: [8, 9, 10], season_kind: "פרי", meal: "after",
    allergens: [], shape: "apple", hue: "#b8403a",
    recognize: { t: "פרי **מדומה**: רוב הציפה מתפתחת מבסיס הפרח, לא מהשחלה.", src: "powo" },
    use: { t: "טרי, אפוי, ו**ריבה**.", src: "culinary" },
    layers: {
      known: [{ t: "WHO ממליצה על **פרי שלם**. סוכר ב**מיץ פירות** נחשב סוכר חופשי.", ev: "גבוהה", src: "who-2023" }],
      said: [
        { t: "תפוחים נמנים בין \"המאמצין\": אוכלים אותם **תכף לארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" },
        { t: "\"כתפוח בעצי היער\": התפוח כדימוי ל**אהוב**, ופריו \"מתוק לחכי\".", trad: "מקרא", ref: "שיר השירים ב ג", src: "tanakh" }
      ],
      believed: [{ t: "רווחת אמונה ש\"**תפוח ביום** מרחיק רופא\".", status: "לא אוששה" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "pear", he: "אגס", en: "Pear", la: "Pyrus communis", alt: ["אגסים"],
    family: "ורדיים", family_la: "Rosaceae", part: "פרי",
    cat: "veg", months: [7, 8, 9], season_kind: "פרי", meal: "before",
    allergens: [], shape: "pear", hue: "#a8a43a",
    recognize: { t: "פרי מדומה, כמו התפוח, עם **תאי אבן** שנותנים מרקם גרגרי.", src: "powo" },
    use: { t: "טרי, **מבושל ביין** או אפוי.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **פירות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "אגסים נמנים בין \"המשלשלין\": אוכלים אותם **קודם הארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "mulberry", he: "תות עץ", en: "Black mulberry", la: "Morus nigra",
    family: "תותיים", family_la: "Moraceae", part: "פרי מורכב",
    cat: "veg", months: [5, 6], season_kind: "פרי", meal: "before",
    allergens: [], shape: "berry", hue: "#4a1f3a",
    recognize: { t: "**פרי מורכב**: כל \"גרגר\" הוא פרי קטן מפרח נפרד. ה\"תותים\" של הרמב\"ם הם פירות העץ הזה, לא תות שדה.", src: "powo" },
    use: { t: "טרי מהעץ, **מיץ** וריבה.", src: "culinary" },
    layers: {
      known: [],
      said: [{ t: "תותים נמנים בין \"המשלשלין\": אוכלים אותם **קודם הארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }],
      believed: [{ t: "רווחת אמונה שכתם של תות עץ יורד רק עם **תות ירוק**.", status: "לא נבדק" }]
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "quince", he: "חבוש", en: "Quince", la: "Cydonia oblonga", alt: ["חבושים"],
    family: "ורדיים", family_la: "Rosaceae", part: "פרי",
    cat: "veg", months: [9, 10, 11], season_kind: "פרי", meal: "after",
    allergens: [], shape: "quince", hue: "#d8b43a",
    recognize: { t: "פרי **קשה ועפיץ**, שכמעט לא נאכל טרי. בבישול הוא משנה צבע לוורוד.", src: "culinary" },
    use: { t: "**ריבת חבושים**, אפוי, ובתבשיל עם בשר.", src: "culinary" },
    layers: {
      known: [],
      said: [{ t: "\"פרישים\", כלומר חבושים, נמנים בין \"המאמצין\": אוכלים אותם **תכף לארוחה**.", trad: "הרמב\"ם", ref: "הלכות דעות ד ו", src: "rambam-deot" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "cabbage", he: "כרוב", en: "Cabbage", la: "Brassica oleracea", alt: ["כרוב לבן", "כרוב סגול"],
    family: "מצליבים", family_la: "Brassicaceae", part: "עלים (ניצן)",
    cat: "veg", months: [11, 12, 1, 2, 3], season_kind: "חורף", meal: null,
    allergens: [], shape: "cabbage", hue: "#7a9a6a",
    recognize: { t: "ראש הכרוב הוא **ניצן ענק**: עלים צפופים סביב גבעול קצר.", src: "powo" },
    use: { t: "סלט, **כרוב ממולא**, וכבוש.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **ירקות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "הרמב\"ם מזכיר **מי שלק של כרוב** בשמן זית ובמלח, לבחור צעיר בבוקר.", trad: "הרמב\"ם", ref: "הלכות דעות ד יג", src: "rambam-deot" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "chard", he: "מנגולד (תרדין)", en: "Chard", la: "Beta vulgaris var. cicla", alt: ["מנגולד", "תרדין", "סלקא"],
    family: "ירבוזיים", family_la: "Amaranthaceae", part: "עלים",
    cat: "veg", months: [11, 12, 1, 2, 3, 4], season_kind: "חורף", meal: null,
    allergens: [], shape: "chard", hue: "#5a8a4a",
    recognize: { t: "אותו מין כמו **סלק אדום**, שגודל לעלים במקום לשורש.", src: "powo" },
    use: { t: "**ממולאים**, בתבשיל ובמרק.", src: "culinary" },
    layers: {
      known: [{ t: "הנחיות התזונה ממליצות על **ירקות** מגוונים בכל יום.", ev: "גבוהה", src: "moh-2021" }],
      said: [{ t: "הרמב\"ם מזכיר **מי שלק של תרדין** בשמן זית ובמלח, לצד הכרוב.", trad: "הרמב\"ם", ref: "הלכות דעות ד יג", src: "rambam-deot" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  },
  {
    id: "mustard", he: "חרדל", en: "Black mustard", la: "Brassica nigra",
    family: "מצליבים", family_la: "Brassicaceae", part: "זרעים",
    cat: "herbs", months: [3, 4], season_kind: "פריחה", meal: null,
    allergens: ["mustard"], shape: "mustard", hue: "#c8a41a",
    recognize: { t: "**פרחים צהובים** בקצה הגבעול, וזרעים זעירים בתרמילים דקים.", src: "flora-il" },
    use: { t: "**ממרח חרדל**, וזרעים בכבישה.", src: "culinary" },
    layers: {
      known: [{ t: "**חרדל** נמנה בין 14 האלרגנים שחובה לסמן באירופה.", ev: "גבוהה", src: "eu-1169" }],
      said: [{ t: "\"ובימות הגשמים... ואוכל מעט מן **החרדל**\": תבלין לחורף.", trad: "הרמב\"ם", ref: "הלכות דעות ד ח", src: "rambam-deot" }],
      believed: []
    },
    safety: { flags: ["allergen"], note: "" }
  },
  {
    id: "fenugreek", he: "חילבה (תלתן)", en: "Fenugreek", la: "Trigonella foenum-graecum", alt: ["חילבה", "תלתן"],
    family: "קטניות", family_la: "Fabaceae", part: "זרעים ועלים",
    cat: "herbs", months: [3, 4], season_kind: "פריחה", meal: null,
    allergens: [], shape: "pod", hue: "#c8a43a", concentrated: true,
    recognize: { t: "**תרמיל** ארוך ודק, וזרעים צהבהבים קשים.", src: "powo" },
    use: { t: "**חילבה** תימנית, וזרעים טחונים בתבלינים.", src: "culinary" },
    layers: {
      known: [],
      said: [{ t: "\"רוביא דהיינו **תלתן**\": סימן בליל ראש השנה, \"שירבו זכיותינו\".", trad: "שולחן ערוך", ref: "אורח חיים תקפג א", src: "sa-oc-583" }],
      believed: []
    },
    safety: { flags: [], note: "" }
  }
];

// מזונות המטבח (js/data/kitchen.js) מצטרפים לגלריה.
export const FOODS = [...BASE_FOODS, ...KITCHEN_FOODS];

export const byId = (id) => FOODS.find((f) => f.id === id);
