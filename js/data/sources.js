// מקורות. כל source_id בדאטה חייב להופיע כאן (נבדק ב-scripts/lint-data.mjs).
// type: מסורת | הנחיה | ניסוי | סקירה | מאגר | רגולציה | הערכה
export const SOURCES = {
  // מסורת
  "tanakh": { title: "תנ\"ך", type: "מסורת", year: null, url: "https://www.sefaria.org/texts/Tanakh" },
  "rambam-deot": { title: "הרמב\"ם, משנה תורה, הלכות דעות, פרק ד", type: "מסורת", year: 1180, url: "https://www.sefaria.org/Mishneh_Torah,_Human_Dispositions.4" },
  "rambam-health": { title: "הרמב\"ם, הנהגת הבריאות", type: "מסורת", year: 1198, url: "" },
  "mishnah-challah": { title: "משנה, מסכת חלה, פרק א, משנה א", type: "מסורת", year: 200, url: "https://www.sefaria.org/Mishnah_Challah.1.1" },
  "bavli-taanit-23a": { title: "תלמוד בבלי, תענית כג ע\"א", type: "מסורת", year: 500, url: "https://www.sefaria.org/Taanit.23a" },
  "saadia-tafsir": { title: "רס\"ג, תרגום התורה לערבית (תפסיר)", type: "מסורת", year: 930, url: "" },
  "nccih-tcm": { title: "NCCIH, Traditional Chinese Medicine: What You Need To Know", type: "סקירה", year: 2019, url: "https://www.nccih.nih.gov/health/traditional-chinese-medicine-what-you-need-to-know" },
  "said-2002": { title: "Said et al., Ethnopharmacological survey of medicinal herbs in Israel, the Golan Heights and the West Bank, J Ethnopharmacol", type: "סקירה", year: 2002, url: "" },
  "culinary": { title: "מסורת קולינרית, ידע כללי", type: "מסורת", year: null, url: "" },

  // הנחיות
  "moh-2021": { title: "משרד הבריאות, הנחיות התזונה הלאומיות וקשת המזון", type: "הנחיה", year: 2021, url: "https://www.health.gov.il/" },
  "who-2023": { title: "WHO, Healthy diet (fact sheet)", type: "הנחיה", year: 2023, url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" },
  "dga-2025": { title: "Dietary Guidelines for Americans 2025–2030", type: "הנחיה", year: 2026, url: "https://www.dietaryguidelines.gov/", note: "שנוי במחלוקת: ראו תגובת ASN" },

  // ניסויים
  "predimed-2018": { title: "Estruch et al., PREDIMED (פרסום מחודש), NEJM", type: "ניסוי", year: 2018, url: "https://doi.org/10.1056/NEJMoa1800389" },
  "dash-2001": { title: "Sacks et al., DASH-Sodium, NEJM", type: "ניסוי", year: 2001, url: "https://doi.org/10.1056/NEJM200101043440101" },
  "smiles-2017": { title: "Jacka et al., SMILES, BMC Medicine", type: "ניסוי", year: 2017, url: "https://doi.org/10.1186/s12916-017-0791-y", note: "מדגם קטן, ללא סמיות מלאה" },
  "segal-blazer-2020": { title: "Segal & Blazer, Rambam Maimonides Medical Journal", type: "סקירה", year: 2020, url: "https://www.rmmj.org.il/" },

  // נזקים
  "saper-2008": { title: "Saper et al., Lead, mercury and arsenic in Ayurvedic medicines sold via the Internet, JAMA", type: "סקירה", year: 2008, url: "https://doi.org/10.1001/jama.300.8.915" },
  "debelle-2008": { title: "Debelle, Vanherweghem, Nortier, Aristolochic acid nephropathy, Kidney International", type: "סקירה", year: 2008, url: "" },
  "iarc-82": { title: "IARC Monographs vol. 82: Aristolochia", type: "סקירה", year: 2002, url: "https://publications.iarc.who.int/" },
  "livertox-turmeric": { title: "LiverTox (NIH) and DILIN: Turmeric", type: "מאגר", year: 2024, url: "https://www.ncbi.nlm.nih.gov/books/NBK547852/" },
  "ghassa-2024": { title: "Ghassa et al., Teucrium polium and DKA, Annals of Medicine & Surgery", type: "סקירה", year: 2024, url: "" },
  "fda-grapefruit": { title: "FDA, Grapefruit Juice and Some Drugs Don't Mix", type: "רגולציה", year: 2021, url: "https://www.fda.gov/consumers/consumer-updates/grapefruit-juice-and-some-drugs-dont-mix" },
  "nccih-garlic": { title: "NCCIH, Garlic", type: "סקירה", year: 2020, url: "https://www.nccih.nih.gov/health/garlic" },
  "medlineplus-g6pd": { title: "MedlinePlus, G6PD deficiency", type: "מאגר", year: 2023, url: "https://medlineplus.gov/genetics/condition/glucose-6-phosphate-dehydrogenase-deficiency/" },

  // הרכב, בוטניקה ואלרגנים
  "usda-fdc": { title: "USDA FoodData Central", type: "מאגר", year: 2024, url: "https://fdc.nal.usda.gov/" },
  "powo": { title: "Plants of the World Online, Kew", type: "מאגר", year: 2024, url: "https://powo.science.kew.org/" },
  "flora-il": { title: "צמחיית ישראל ברשת (Flora of Israel Online)", type: "מאגר", year: 2024, url: "https://flora.org.il/" },
  "eu-1169": { title: "EU Regulation 1169/2011, Annex II: 14 האלרגנים העיקריים", type: "רגולציה", year: 2011, url: "https://eur-lex.europa.eu/eli/reg/2011/1169/oj" },

  // אפליקציות והפרעות אכילה
  "levinson-2017": { title: "Levinson et al., My Fitness Pal calorie tracker usage in the eating disorders, Eating Behaviors", type: "ניסוי", year: 2017, url: "" },
  "hahn-2021": { title: "Hahn et al., low-risk population trial", type: "ניסוי", year: 2021, url: "" },

  // רגולציה
  "privacy-13": { title: "תיקון 13 לחוק הגנת הפרטיות, בתוקף מ-14.8.2025", type: "רגולציה", year: 2025, url: "" },

  // הערכה, לא עובדה
  "season-est": { title: "הערכת עונה כללית לישראל. לאימות מול מועצת הצמחים", type: "הערכה", year: null, url: "" }
};

// סולם עוצמת ראיה, מהחזק לחלש. מוצג כמדרג גוונים של נייבי.
export const EVIDENCE = ["גבוהה", "בינונית", "ראשונית", "מקרי דיווח", "אין"];
