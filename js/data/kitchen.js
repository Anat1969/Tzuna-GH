// מזונות המטבח: ירקות, פירות, קטניות, דגנים ותבלינים יומיומיים שנוספו לגלריה.
// לכל מזון במקום אחד: הגיליון (FOODS), הפרופיל (PROFILES) ומדע ומעשה (SCIENCE). הצילומים ב-photos.js.
// אותם כללים כמו ב-foods.js: known חייב src ו-ev, said חייב src ו-trad, believed חייב status.
// alt: שמות נוספים לחיפוש בלבד.

const food = (o) => ({ meal: null, allergens: [], safety: { flags: [], note: "" }, ...o });

export const KITCHEN = [
  {
    food: food({
      id: "pea", he: "אפונה", en: "Pea", la: "Pisum sativum", alt: ["אפון", "אפונה ירוקה", "אפונת גינה", "מרק אפונה"],
      family: "קטניות", family_la: "Fabaceae", part: "זרע",
      cat: "legumes", months: [3, 4, 5], season_kind: "ירוק", shape: "pod", hue: "#7a9a3a",
      recognize: { t: "**תרמיל** ירוק ובו שורת זרעים עגולים. על **אפונת גינה** גילה מנדל את חוקי התורשה.", src: ["powo", "campbell"] },
      use: { t: "**אורז עם אפונה**, מרק, ו**אפונה גרוסה** יבשה למרק סמיך.", src: "culinary" },
      layers: {
        known: [
          { t: "הנחיות משרד הבריאות ממליצות על **קטניות** כחלק קבוע מהתפריט.", ev: "גבוהה", src: "moh-2021" },
          { t: "אפונה ירוקה היא מקור ל**חלבון צמחי**, ל**סיבים** ול**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }
        ],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "הזרע שבו **מנדל** גילה את התורשה.",
      body: { t: "**חלבון צמחי**, **סיבים** ו**ויטמין C**.", src: "usda-fdc" },
      soul: { t: "**אורז עם אפונה**: תוספת של ארוחת שישי בבתים רבים.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**אורז**: חלבון מקטנייה ומדגן משלימים זה את זה.", src: "who-protein-2007" }],
      without: []
    },
    science: {
      why: "**חלבון וסיבים** בקטנייה שנאכלת ירוקה ומתוקה.",
      studied: [{ t: "הנחיות התזונה ממליצות על **קטניות** כחלק קבוע מהתפריט.", ev: "גבוהה", src: "moh-2021" }],
      practical: ["**קפואה**: נקטפת ומוקפאת מהר, ושומרת על המתיקות.", "**בישול**: דקות ספורות. בישול ארוך מאפיר את הצבע.", "**גרוסה**: לא צריכה השריה, ומתפרקת למרק."]
    }
  },
  {
    food: food({
      id: "bean", he: "שעועית", en: "Common bean", la: "Phaseolus vulgaris", alt: ["שעועית לבנה", "שעועית אדומה", "שעועית ירוקה", "שעועית יבשה"],
      family: "קטניות", family_la: "Fabaceae", part: "זרע ותרמיל",
      cat: "legumes", months: [6, 7, 8, 9], season_kind: "ירוק ובשל", shape: "pod", hue: "#8a3a2a",
      recognize: { t: "**תרמיל** שנאכל ירוק, או זרעים שמייבשים: לבנים, אדומים ומנומרים. מוצאה ב**אמריקה**.", src: "powo" },
      use: { t: "**שעועית לבנה ברוטב עגבניות**, ושעועית ירוקה מאודה.", src: "culinary" },
      layers: {
        known: [
          { t: "הנחיות משרד הבריאות ממליצות על **קטניות** כחלק קבוע מהתפריט.", ev: "גבוהה", src: "moh-2021" },
          { t: "**שעועית אדומה לא מבושלת** מכילה לקטין (PHA). **בישול מלא** מפרק אותו.", ev: "גבוהה", src: "fda-badbug" }
        ],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**תרמיל או זרע**: צמח אחד, שני מזונות.",
      body: { t: "**חלבון**, **סיבים** ו**חומצה פולית**.", src: "usda-fdc" },
      soul: { t: "**שעועית לבנה בעגבניות**: תבשיל חורף בישראל ובבלקן.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עגבנייה או לימון**: ויטמין C מגביר ספיגת **ברזל** מהצומח.", src: "medlineplus-iron" }],
      without: [{ t: "**תה שחור** באותה ארוחה מפחית ספיגת **ברזל**.", src: "medlineplus-iron" }]
    },
    science: {
      why: "**חלבון וסיבים** בקטנייה שנשמרת יבשה זמן רב.",
      studied: [{ t: "**שעועית אדומה** נאכלת רק אחרי **רתיחה מלאה**. בחום נמוך הלקטין לא מתפרק.", ev: "גבוהה", src: "fda-badbug" }],
      practical: ["**השריה**: לילה, ומים חדשים לבישול.", "**בישול**: רתיחה מלאה. סיר בישול איטי בחום נמוך לא מספיק לשעועית אדומה.", "**ירוקה**: אידוי קצר שומר על הצבע."]
    }
  },
  {
    food: food({
      id: "lemon", he: "לימון", en: "Lemon", la: "Citrus × limon", alt: ["לימונים", "מיץ לימון", "לימון כבוש"],
      family: "פיגמיים", family_la: "Rutaceae", part: "פרי",
      cat: "veg", months: [11, 12, 1, 2, 3, 4], season_kind: "פרי", shape: "citrus", hue: "#e0c23a",
      recognize: { t: "פרי הדר עם קליפה מבריקה ו**בלוטות שמן**. הריח בא מהקליפה.", src: "powo" },
      use: { t: "**מיץ** לסלט ולחומוס, קליפה מגוררת, ו**לימון כבוש**.", src: "culinary" },
      layers: {
        known: [{ t: "**ויטמין C** באותה ארוחה מגביר ספיגת **ברזל** מהצומח.", ev: "גבוהה", src: "medlineplus-iron" }],
        said: [{ t: "**לימון כבוש** במלח הוא יסוד במטבח המרוקאי.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: [{ t: "רווחת אמונה שמים עם לימון על בטן ריקה **מנקים את הגוף**.", status: "לא נבדק" }]
      }
    }),
    profile: {
      unique: "**חמוץ** שמגביר ספיגת ברזל.",
      body: { t: "**ויטמין C** ו**חומצת לימון**.", src: "usda-fdc" },
      soul: { t: "**לימון כבוש**: מתנה של המטבח המרוקאי לכל השולחן.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עדשים, חומוס ועלים ירוקים**: ויטמין C מגביר ספיגת **ברזל**.", src: "medlineplus-iron" }],
      without: []
    },
    science: {
      why: "**ויטמין C** שהופך ארוחה צמחית לעשירה יותר בברזל זמין.",
      studied: [{ t: "ויטמין C באותה ארוחה מגביר ספיגת **ברזל** מהצומח.", ev: "גבוהה", src: "medlineplus-iron" }],
      practical: ["**סחיטה**: לימון בטמפרטורת החדר נותן יותר מיץ.", "**קליפה**: מגררים רק את הצהוב. הלבן מר.", "**תזמון**: מוסיפים בסוף הבישול."]
    }
  },
  {
    food: food({
      id: "orange", he: "תפוז", en: "Orange", la: "Citrus × sinensis", alt: ["תפוזים", "מיץ תפוזים"],
      family: "פיגמיים", family_la: "Rutaceae", part: "פרי",
      cat: "veg", months: [12, 1, 2, 3, 4], season_kind: "פרי", shape: "citrus", hue: "#e8892a",
      recognize: { t: "**הכלאה** עתיקה של פומלה ומנדרינה.", src: "powo" },
      use: { t: "טרי, **מיץ**, ופלחים בסלט חורף.", src: "culinary" },
      layers: {
        known: [{ t: "תפוז הוא מקור ל**ויטמין C** ול**סיבים**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [{ t: "**תפוזי יפו** היו מותג הייצוא של ארץ ישראל.", trad: "היסטוריה", ref: "", src: "culinary" }],
        believed: [{ t: "רווחת אמונה שוויטמין C **מונע הצטננות**.", status: "לא אוששה" }]
      }
    }),
    profile: {
      unique: "**ויטמין C** בפלחים, יחד עם הסיבים.",
      body: { t: "**ויטמין C**, **סיבים** ו**חומצה פולית**.", src: "usda-fdc" },
      soul: { t: "**תפוז יפו**: סמל של ארץ ישראל בעולם.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עלים ירוקים**, בסלט: ויטמין C מגביר ספיגת **ברזל** מהעלים.", src: "medlineplus-iron" }],
      without: []
    },
    science: {
      why: "**ויטמין C** בפרי חורף, עם הסיבים שאין במיץ.",
      studied: [{ t: "לפי WHO, **מיץ פירות** נחשב סוכר חופשי, ופרי שלם לא.", ev: "גבוהה", src: "who-2023" }],
      practical: ["**בחירה**: כבד ביד, עם קליפה דקה.", "**אחסון**: שבוע בחוץ, יותר במקרר.", "**שלם**: פרי שלם עדיף על מיץ."]
    }
  },
  {
    food: food({
      id: "carrot", he: "גזר", en: "Carrot", la: "Daucus carota subsp. sativus", alt: ["גזרים", "סלט גזר"],
      family: "סוככיים", family_la: "Apiaceae", part: "שורש",
      cat: "veg", months: [11, 12, 1, 2, 3, 4, 5], season_kind: "חורף", shape: "long", hue: "#e07a2a",
      recognize: { t: "**שורש** מעובה. הצבע הכתום בא מ**בטא־קרוטן**.", src: ["powo", "usda-fdc"] },
      use: { t: "טרי, מבושל, ו**סלט גזר מרוקאי** בכמון.", src: "culinary" },
      layers: {
        known: [
          { t: "גזר עשיר ב**בטא־קרוטן**, שהגוף הופך ל**ויטמין A**.", ev: "גבוהה", src: "usda-fdc" },
          { t: "**שומן** באותה מנה מגביר ספיגת **קרוטנואידים** מירקות.", ev: "בינונית", src: "unlu-2005" }
        ],
        said: [],
        believed: [{ t: "רווחת אמונה שגזר **משפר ראיית לילה** אצל כל אחד.", status: "לא אוששה" }]
      }
    }),
    profile: {
      unique: "**שורש אמיתי**, כתום מבטא־קרוטן.",
      body: { t: "**בטא־קרוטן** ו**סיבים**.", src: "usda-fdc" },
      soul: { t: "**סלט גזר מרוקאי** בכמון ושום, על שולחן השבת.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**שמן זית**: שומן מגביר ספיגת **קרוטנואידים**.", src: "unlu-2005" }],
      without: []
    },
    science: {
      why: "**בטא־קרוטן** בשורש זול שנשמר שבועות.",
      studied: [{ t: "בניסוי, תוספת **אבוקדו** לסלט הגבירה ספיגת **קרוטנואידים**.", ev: "בינונית", src: "unlu-2005" }],
      practical: ["**קילוף**: לא חובה. שטיפה וקרצוף מספיקים.", "**שמן**: מעט שמן זית באותה מנה.", "**אחסון**: בלי העלים, במקרר."]
    }
  },
  {
    food: food({
      id: "potato", he: "תפוח אדמה", en: "Potato", la: "Solanum tuberosum", alt: ["תפוחי אדמה", "תפו\"א", "צ'יפס", "פירה"],
      family: "סולניים", family_la: "Solanaceae", part: "פקעת (גבעול)",
      cat: "veg", months: [3, 4, 5, 11, 12], season_kind: "קציר", shape: "round", hue: "#c9a46a",
      recognize: { t: "**פקעת**: גבעול תת־קרקעי, לא שורש. ה\"עיניים\" הן **ניצנים**.", src: "campbell" },
      use: { t: "מבושל, אפוי, ו**בחמין**.", src: "culinary" },
      layers: {
        known: [{ t: "תפוח אדמה מבושל בקליפה הוא מקור ל**אשלגן** ול**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [{ t: "**חמין**: תפוחי אדמה מתבשלים כל הלילה לשבת.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: []
      }
    }),
    profile: {
      unique: "**גבעול** שגדל מתחת לאדמה.",
      body: { t: "**עמילן**, **אשלגן** ו**ויטמין C**.", src: "usda-fdc" },
      soul: { t: "**חמין**: סיר שמתבשל כל הלילה לשבת.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**שמן זית ועשבי תיבול**, באפייה.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**אשלגן וויטמין C** במזון יסוד זול.",
      studied: [{ t: "במאגר USDA, תפוח אדמה מבושל בקליפה מכיל **אשלגן** ו**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**אחסון**: במקום חשוך וקריר, לא במקרר.", "**קליפה**: נאכלת. שטיפה וקרצוף.", "**ירוק**: חותכים את החלק הירוק ואת הנבטים."]
    }
  },
  {
    food: food({
      id: "sweetpotato", he: "בטטה", en: "Sweet potato", la: "Ipomoea batatas", alt: ["בטטות"],
      family: "חבלבליים", family_la: "Convolvulaceae", part: "שורש",
      cat: "veg", months: [9, 10, 11, 12], season_kind: "קציר", shape: "long", hue: "#c2603a",
      recognize: { t: "**שורש** מעובה. לא קרוב של תפוח האדמה: **משפחה אחרת**.", src: "powo" },
      use: { t: "**אפויה** בתנור, במרק ובפירה.", src: "culinary" },
      layers: {
        known: [{ t: "בטטה כתומה עשירה ב**בטא־קרוטן**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**שורש מתוק** ממשפחת החבלבל.",
      body: { t: "**בטא־קרוטן**, **סיבים** ו**אשלגן**.", src: "usda-fdc" },
      soul: { t: "**מזון של חורף**: אפויה בתנור, בקליפה.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**שמן זית**: שומן מגביר ספיגת **קרוטנואידים**.", src: "unlu-2005" }],
      without: []
    },
    science: {
      why: "**בטא־קרוטן** בשורש מתוק ומשביע.",
      studied: [{ t: "במאגר USDA, בטטה כתומה עשירה ב**ויטמין A** (כבטא־קרוטן).", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**אפייה**: בקליפה, עד שהמיץ מתקרמל.", "**אחסון**: בחוץ, לא במקרר.", "**קליפה**: נאכלת אחרי קרצוף."]
    }
  },
  {
    food: food({
      id: "eggplant", he: "חציל", en: "Eggplant", la: "Solanum melongena", alt: ["חצילים", "בבא גנוש", "סלט חצילים"],
      family: "סולניים", family_la: "Solanaceae", part: "פרי",
      cat: "veg", months: [6, 7, 8, 9, 10], season_kind: "פרי", shape: "long", hue: "#4a2a5a",
      recognize: { t: "**פרי** של צמח ממשפחת הסולניים, קרוב של העגבנייה.", src: "powo" },
      use: { t: "**קלוי על האש**, בבבא גנוש, בסלט חצילים ובמוסקה.", src: "culinary" },
      layers: {
        known: [{ t: "חציל הוא מקור ל**סיבים**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [{ t: "**חציל קלוי** על להבה הוא יסוד בסלטים של המטבח הישראלי.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: []
      }
    }),
    profile: {
      unique: "**סופג שמן** כמו ספוג.",
      body: { t: "**סיבים** ומעט **אשלגן**.", src: "usda-fdc" },
      soul: { t: "**בבא גנוש** וסלט חצילים: מטבח של בית ישראלי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**טחינה ולימון**, בחציל קלוי.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**ירק של קיץ** שהופך למנה בזכות האש.",
      studied: [{ t: "במאגר USDA, חציל דל בשומן ומכיל **סיבים**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**קלייה**: על להבה, עד שהקליפה נשרפת והפנים רך.", "**שמן**: אפייה בתנור סופגת פחות שמן מטיגון.", "**בחירה**: מבריק, וקל ביחס לגודל."]
    }
  },
  {
    food: food({
      id: "pepper", he: "פלפל", en: "Bell and chili pepper", la: "Capsicum annuum", alt: ["פלפלים", "גמבה", "פלפל אדום", "פלפל חריף", "צ'ילי"],
      family: "סולניים", family_la: "Solanaceae", part: "פרי",
      cat: "veg", months: [5, 6, 7, 8, 9, 10, 11], season_kind: "פרי", shape: "round", hue: "#c0302a",
      recognize: { t: "פרי חלול. ירוק הוא **לא בשל**, ואדום הוא **בשל**.", src: "powo" },
      use: { t: "טרי בסלט, **קלוי**, ו**ממולא**.", src: "culinary" },
      layers: {
        known: [{ t: "פלפל אדום עשיר ב**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**ירוק ואדום**: אותו פרי, בשלות אחרת.",
      body: { t: "**ויטמין C**, ובאדום גם **ויטמין A**.", src: "usda-fdc" },
      soul: { t: "**פלפלים ממולאים** במטבחי הבלקן והמזרח.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עדשים וחומוס**: ויטמין C מגביר ספיגת **ברזל**.", src: "medlineplus-iron" }],
      without: []
    },
    science: {
      why: "**ויטמין C**, גם בלי פרי הדר.",
      studied: [{ t: "במאגר USDA, פלפל אדום עשיר ב**ויטמין C** וב**ויטמין A**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**קלייה**: על אש עד השחרה, ואז קילוף בקופסה סגורה.", "**בחירה**: מבריק ומוצק.", "**אחסון**: במקרר, כשבוע."]
    }
  },
  {
    food: food({
      id: "zucchini", he: "קישוא", en: "Zucchini", la: "Cucurbita pepo", alt: ["קישואים", "זוקיני"],
      family: "דלועיים", family_la: "Cucurbitaceae", part: "פרי",
      cat: "veg", months: [3, 4, 5, 6, 7, 8, 9, 10], season_kind: "פרי", shape: "long", hue: "#5a8a3a",
      recognize: { t: "**דלעת צעירה** שנקטפת לפני שהבשילה.", src: "powo" },
      use: { t: "**ממולא**, בפשטידה ובקציצות.", src: "culinary" },
      layers: {
        known: [{ t: "קישוא מכיל **ויטמין C** ו**אשלגן**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**דלעת** שנקטפת צעירה.",
      body: { t: "הרבה **מים**, **ויטמין C** ו**אשלגן**.", src: "usda-fdc" },
      soul: { t: "**קישואים ממולאים**: מטבח של בית בכל המזרח.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עגבנייה ושמן זית**, בתבשיל.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**ירק קיץ** קל ומהיר, שמקבל כל תיבול.",
      studied: [{ t: "במאגר USDA, קישוא מכיל **ויטמין C** ו**אשלגן**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**בחירה**: קטן ומוצק. הגדולים מימיים.", "**פרחים**: נאכלים ממולאים.", "**בישול**: קצר, כדי שלא יתפרק."]
    }
  },
  {
    food: food({
      id: "spinach", he: "תרד", en: "Spinach", la: "Spinacia oleracea", alt: ["עלי תרד"],
      family: "ירבוזיים", family_la: "Amaranthaceae", part: "עלים",
      cat: "veg", months: [11, 12, 1, 2, 3], season_kind: "עלים", shape: "chard", hue: "#2f6a2a",
      recognize: { t: "**עלים** רכים, ממשפחה אחת עם הסלק והמנגולד.", src: "powo" },
      use: { t: "טרי בסלט, מאודה, וב**בורקס**.", src: "culinary" },
      layers: {
        known: [
          { t: "תרד עשיר ב**ויטמין K** וב**חומצה פולית**.", ev: "גבוהה", src: "usda-fdc" },
          { t: "**חומצה אוקסלית** בתרד קושרת **סידן** ומקטינה את ספיגתו.", ev: "גבוהה", src: "medlineplus-calcium" }
        ],
        said: [],
        believed: [{ t: "רווחת אמונה שתרד הוא **המקור הטוב ביותר לברזל**.", status: "לא אוששה" }]
      }
    }),
    profile: {
      unique: "**ברזל** מפורסם, וסידן שלא נספג.",
      body: { t: "**ויטמין K**, **חומצה פולית** ו**ברזל**.", src: "usda-fdc" },
      soul: { t: "**בורקס תרד**: מאפה של שבת בבוקר במטבח הספרדי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**לימון**: ויטמין C מגביר ספיגת **ברזל** מעלים ירוקים.", src: "medlineplus-iron" }],
      without: [{ t: "**מוצרי חלב** באותה מנה: **חומצה אוקסלית** בתרד קושרת סידן.", src: "medlineplus-calcium" }]
    },
    science: {
      why: "**ויטמין K וחומצה פולית** בעלים רכים.",
      studied: [{ t: "**חומצה אוקסלית** בתרד מקטינה את ספיגת ה**סידן** ממנו.", ev: "גבוהה", src: "medlineplus-calcium" }],
      practical: ["**נפח**: מחבת מלאה מצטמקת לקערה קטנה.", "**שטיפה**: בקערת מים, כי החול נשאר בעלים.", "**ספיגה**: לימון באותה מנה."]
    }
  },
  {
    food: food({
      id: "parsley", he: "פטרוזיליה", en: "Parsley", la: "Petroselinum crispum", alt: ["פטרוסיליה", "טאבולה"],
      family: "סוככיים", family_la: "Apiaceae", part: "עלים",
      cat: "herbs", months: [], season_kind: "עלים", shape: "herb", hue: "#3a7a2a",
      recognize: { t: "**עלים** מנוצים, חלקים או מסולסלים, ממשפחת הגזר.", src: "powo" },
      use: { t: "**טאבולה**, בקציצות, ובכל סלט.", src: "culinary" },
      layers: {
        known: [{ t: "פטרוזיליה עשירה ב**ויטמין K** וב**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**ירק של עלים**, לא רק קישוט.",
      body: { t: "**ויטמין K**, **ויטמין C** ו**ויטמין A**.", src: "usda-fdc" },
      soul: { t: "**טאבולה**: סלט ירוק של המטבח הלבנוני והסורי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**בורגול ולימון**, בטאבולה.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**ויטמין K וויטמין C** בעשב שקונים בצרור.",
      studied: [{ t: "במאגר USDA, פטרוזיליה עשירה ב**ויטמין K** וב**ויטמין C**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**אחסון**: כמו פרחים, בכוס מים במקרר.", "**קיצוץ**: סכין חדה, כדי שלא יתמעך.", "**גבעולים**: נכנסים למרק."]
    }
  },
  {
    food: food({
      id: "mint", he: "נענע", en: "Spearmint", la: "Mentha spicata", alt: ["נענה", "מנטה", "תה נענע"],
      family: "שפתניים", family_la: "Lamiaceae", part: "עלים",
      cat: "herbs", months: [], season_kind: "עלים", shape: "herb", hue: "#3a8a5a",
      recognize: { t: "**גבעול מרובע** ועלים נגדיים, כמו בכל השפתניים.", src: "powo" },
      use: { t: "**תה נענע**, בסלט ובלימונדה.", src: "culinary" },
      layers: {
        known: [],
        said: [{ t: "**תה מתוק עם נענע** הוא טקס של הכנסת אורחים במרוקו.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: [{ t: "רווחת אמונה שתה נענע **מרגיע את הבטן**.", status: "לא נבדק" }]
      }
    }),
    profile: {
      unique: "**גבעול מרובע** וריח שמתעורר במגע.",
      body: { t: "**עשב תיבול**: נאכל בכמויות קטנות.", src: "culinary" },
      soul: { t: "**תה נענע** כהכנסת אורחים, במרוקו ובבית הישראלי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**תה ירוק**, בתה המרוקאי.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**ריח** שהופך מים חמים לטקס.",
      studied: [],
      practical: ["**אחסון**: בכוס מים, מחוץ למקרר.", "**תה**: עלים טריים במים חמים.", "**גידול**: מתפשט, ולכן בעציץ נפרד."]
    }
  },
  {
    food: food({
      id: "coriander", he: "כוסברה", en: "Coriander", la: "Coriandrum sativum", alt: ["כוסבר", "זרעי כוסברה", "סחוג"],
      family: "סוככיים", family_la: "Apiaceae", part: "עלים וזרעים",
      cat: "herbs", months: [11, 12, 1, 2, 3, 4], season_kind: "עלים", shape: "herb", hue: "#4a8a3a",
      recognize: { t: "**עלים** ירוקים, ו**זרעים** עגולים ויבשים שהם תבלין אחר.", src: "powo" },
      use: { t: "עלים ב**סחוג** ובסלט, וזרעים טחונים בתבלינים.", src: "culinary" },
      layers: {
        known: [],
        said: [{ t: "**סחוג**: עלי כוסברה, פלפל חריף ושום, במטבח התימני.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: []
      }
    }),
    profile: {
      unique: "**עלים וזרעים**: שני תבלינים מצמח אחד.",
      body: { t: "**עשב תיבול**: נאכל בכמויות קטנות.", src: "culinary" },
      soul: { t: "**סחוג** תימני: כוסברה, שום ופלפל חריף.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**לימון ושום**, בסחוג ובסלט.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**שני טעמים** מצמח אחד: עלה רענן וזרע חמים.",
      studied: [],
      practical: ["**עלים**: מוסיפים בסוף הבישול.", "**זרעים**: קלייה יבשה לפני הטחינה.", "**אחסון**: עטופה במגבת לחה, במקרר."]
    }
  },
  {
    food: food({
      id: "cumin", he: "כמון", en: "Cumin", la: "Cuminum cyminum", alt: ["כמון טחון"],
      family: "סוככיים", family_la: "Apiaceae", part: "זרעים",
      cat: "herbs", months: [], season_kind: "יבוא", shape: "sesame", hue: "#9a6a3a",
      recognize: { t: "**זרעים** מוארכים ומפוספסים, ממשפחת הגזר.", src: "powo" },
      use: { t: "בחומוס, ב**סלט גזר** ובמג'דרה.", src: "culinary" },
      layers: {
        known: [],
        said: [{ t: "**כמון** הוא תבלין יסוד במטבחי המזרח התיכון, צפון אפריקה והודו.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: [{ t: "רווחת אמונה שכמון **מקל על גזים** אחרי קטניות.", status: "לא נבדק" }]
      }
    }),
    profile: {
      unique: "**הריח של החומוס** בא מזרע קטן.",
      body: { t: "**תבלין**: נאכל בכמויות קטנות.", src: "culinary" },
      soul: { t: "**כמון** בחומוס ובסלט גזר: הריח של המטבח המזרחי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**קטניות וגזר**, בבישול.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**תבלין** שמחבר קטניות וירקות שורש.",
      studied: [],
      practical: ["**קלייה**: יבשה, עד שהריח עולה.", "**טחינה**: טרייה, לפני השימוש.", "**אחסון**: זרעים שלמים שומרים ריח זמן רב יותר."]
    }
  },
  {
    food: food({
      id: "rice", he: "אורז", en: "Rice", la: "Oryza sativa", alt: ["אורז מלא", "אורז לבן", "מג'דרה"],
      family: "דגניים", family_la: "Poaceae", part: "גרעין",
      cat: "grains", months: [], season_kind: "יבוא", shape: "grain", hue: "#d8cca8",
      recognize: { t: "**גרעין** של דגן שגדל בשדות מוצפים.", src: "powo" },
      use: { t: "**מג'דרה**, אורז עם אפונה, וממולאים.", src: "culinary" },
      layers: {
        known: [
          { t: "**אורז מלא** שומר על הסובין והנבט, ויש בו יותר **סיבים** מבלבן.", ev: "גבוהה", src: "usda-fdc" },
          { t: "הנחיות התזונה ממליצות על **דגנים מלאים** על פני מזוקקים.", ev: "גבוהה", src: "moh-2021" }
        ],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**מלא או לבן**: הסובין עושה את ההבדל.",
      body: { t: "**עמילן**, ובאורז מלא גם **סיבים**.", src: "usda-fdc" },
      soul: { t: "**מג'דרה**: אורז ועדשים, ובצל מטוגן מעל.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עדשים**: חלבון מדגן ומקטנייה משלימים זה את זה.", src: "who-protein-2007" }],
      without: []
    },
    science: {
      why: "**מזון יסוד** של מטבחים רבים, מלא או לבן.",
      studied: [{ t: "הנחיות התזונה ממליצות על **דגנים מלאים** על פני מזוקקים.", ev: "גבוהה", src: "moh-2021" }],
      practical: ["**שטיפה**: עד שהמים צלולים, לאורז שלא נדבק.", "**מלא**: דורש יותר מים וזמן.", "**שאריות**: מקררים מהר, ולא משאירים בחוץ."]
    }
  },
  {
    food: food({
      id: "corn", he: "תירס", en: "Corn", la: "Zea mays", alt: ["קלח", "קלח תירס", "פופקורן"],
      family: "דגניים", family_la: "Poaceae", part: "גרעין",
      cat: "grains", months: [6, 7, 8, 9], season_kind: "קציר", shape: "grain", hue: "#e8c23a",
      recognize: { t: "**קלח** עטוף עלים, ובו שורות של גרעינים. מוצאו ב**אמריקה**.", src: "powo" },
      use: { t: "**קלח מבושל** בקיץ, פופקורן וקמח תירס.", src: "culinary" },
      layers: {
        known: [{ t: "תירס מתוק מכיל **סיבים** ו**לוטאין**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [{ t: "**קלח תירס** על הגחלים בחוף: מאכל של קיץ ישראלי.", trad: "מסורת קולינרית", ref: "", src: "culinary" }],
        believed: []
      }
    }),
    profile: {
      unique: "**שורות גרעינים** על קלח אחד.",
      body: { t: "**עמילן**, **סיבים** ו**לוטאין**.", src: "usda-fdc" },
      soul: { t: "**קלח על הגחלים** בחוף, בקיץ.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**שעועית**: דגן וקטנייה משלימים חלבון.", src: "who-protein-2007" }],
      without: []
    },
    science: {
      why: "**דגן של קיץ** שנאכל טרי, ישר מהקלח.",
      studied: [{ t: "במאגר USDA, תירס מתוק מכיל **סיבים** ו**לוטאין**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**קנייה**: עלים ירוקים ולחים, וציציות חומות.", "**בישול**: דקות ספורות במים רותחים.", "**גחלים**: עם העלים, כדי שלא יתייבש."]
    }
  },
  {
    food: food({
      id: "avocado", he: "אבוקדו", en: "Avocado", la: "Persea americana", alt: ["גוואקמולה"],
      family: "עריים", family_la: "Lauraceae", part: "פרי",
      cat: "veg", months: [10, 11, 12, 1, 2, 3], season_kind: "פרי", shape: "pear", hue: "#4a6a2a",
      recognize: { t: "**פרי** עם גלעין אחד גדול, שמבשיל רק **אחרי הקטיף**.", src: ["powo", "culinary"] },
      use: { t: "**על לחם**, בסלט ובגוואקמולה.", src: "culinary" },
      layers: {
        known: [{ t: "**אבוקדו** בסלט הגביר בניסוי את ספיגת ה**קרוטנואידים** מהירקות.", ev: "בינונית", src: "unlu-2005" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**פרי שומני** שמבשיל רק אחרי הקטיף.",
      body: { t: "**שומן חד־בלתי רווי**, **סיבים** ו**אשלגן**.", src: "usda-fdc" },
      soul: { t: "**אבוקדו על לחם**: ארוחת בוקר של חורף ישראלי.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**עגבנייה וגזר**: השומן מגביר ספיגת **קרוטנואידים**.", src: "unlu-2005" }],
      without: []
    },
    science: {
      why: "**שומן** שמגביר ספיגה מירקות אחרים.",
      studied: [{ t: "בניסוי, תוספת **אבוקדו** לסלט ולסלסה הגבירה ספיגת **קרוטנואידים**.", ev: "בינונית", src: "unlu-2005" }],
      practical: ["**הבשלה**: בחוץ, בשקית נייר עם תפוח.", "**השחרה**: לימון על החתך.", "**בחירה**: נכנע מעט ללחיצה ליד העוקץ."]
    }
  },
  {
    food: food({
      id: "banana", he: "בננה", en: "Banana", la: "Musa × paradisiaca", alt: ["בננות"],
      family: "מוזיים", family_la: "Musaceae", part: "פרי",
      cat: "veg", months: [], season_kind: "פרי", shape: "long", hue: "#e8c83a",
      recognize: { t: "**צמח עשבוני** ענק, לא עץ. הפרי גדל באשכולות.", src: "powo" },
      use: { t: "טרייה, **בשייק** ובעוגה.", src: "culinary" },
      layers: {
        known: [{ t: "בננה היא מקור ל**אשלגן**.", ev: "גבוהה", src: "usda-fdc" }],
        said: [],
        believed: []
      }
    }),
    profile: {
      unique: "**עשב ענק**, לא עץ.",
      body: { t: "**אשלגן**, **פחמימות** ו**סיבים**.", src: "usda-fdc" },
      soul: { t: "**פרי של עמק הירדן** ושל חוף הכנרת.", trad: "תרבות", ref: "", src: "culinary" },
      with: [{ t: "**טחינה ודבש**, על לחם.", src: "culinary" }],
      without: []
    },
    science: {
      why: "**אשלגן** בפרי שמגיע עטוף.",
      studied: [{ t: "במאגר USDA, בננה מכילה **אשלגן** ו**סיבים**.", ev: "גבוהה", src: "usda-fdc" }],
      practical: ["**הבשלה**: נקודות חומות פירושן מתוקה יותר.", "**אחסון**: מחוץ למקרר עד שמבשילה.", "**בשלה מדי**: לעוגה או לשייק קפוא."]
    }
  }
];

export const KITCHEN_FOODS = KITCHEN.map((k) => k.food);
export const KITCHEN_PROFILES = Object.fromEntries(KITCHEN.map((k) => [k.food.id, k.profile]));
export const KITCHEN_SCIENCE = Object.fromEntries(KITCHEN.map((k) => [k.food.id, k.science]));
// חלק בצמח, לדף "צמח וגוף".
export const KITCHEN_PARTS = {
  root: ["carrot", "sweetpotato"],
  stem: ["potato"],
  leaf: ["spinach", "parsley", "mint", "coriander"],
  fruit: ["lemon", "orange", "eggplant", "pepper", "zucchini", "avocado", "banana"],
  seed: ["pea", "bean", "rice", "corn", "cumin"]
};
