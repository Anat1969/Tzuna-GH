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
  "culinary": { title: "מסורת קולינרית ותרבותית, ידע כללי", type: "מסורת", year: null, url: "" },

  "sa-oc-583": { title: "שולחן ערוך, אורח חיים, סימן תקפג (עם הגהות הרמ\"א)", type: "מסורת", year: 1565, url: "https://www.sefaria.org/Shulchan_Arukh%2C_Orach_Chayim.583" },
  "bavli-keritot-6a": { title: "תלמוד בבלי, כריתות ו ע\"א", type: "מסורת", year: 500, url: "https://www.sefaria.org/Keritot.6a" },
  "who-fruit-veg-2003": { title: "WHO/FAO, Diet, Nutrition and the Prevention of Chronic Diseases (TRS 916)", type: "הנחיה", year: 2003, url: "https://www.who.int/publications/i/item/924120916X" },
  "buettner-2005": { title: "Buettner, The Secrets of Long Life, National Geographic", type: "סקירה", year: 2005, url: "" },
  "morris-2015": { title: "Morris et al., MIND diet associated with reduced incidence of Alzheimer's disease, Alzheimer's & Dementia 11(9)", type: "ניסוי", year: 2015, url: "https://doi.org/10.1016/j.jalz.2014.11.009" },
  "beck-2018": { title: "Beck et al., Present and future Köppen-Geiger climate classification maps at 1-km resolution, Scientific Data 5", type: "מאגר", year: 2018, url: "https://doi.org/10.1038/sdata.2018.214" },
  "bennett-2007": { title: "Bennett, Doctrine of Signatures: An Explanation of Medicinal Plant Discovery or Dissemination of Knowledge?, Economic Botany 61(3)", type: "סקירה", year: 2007, url: "https://doi.org/10.1663/0013-0001(2007)61[246:DOSAEO]2.0.CO;2" },
  "darwin-1880": { title: "Charles Darwin, The Power of Movement in Plants", type: "מסורת", year: 1880, url: "https://www.gutenberg.org/ebooks/5605" },
  "charaka": { title: "צ'רקה סמהיטה (Charaka Samhita), הטקסט היסודי של האיורוודה", type: "מסורת", year: null, url: "" },
  "huangdi": { title: "הואנגדי ניי־ג'ינג (Huangdi Neijing), הקאנון של הקיסר הצהוב", type: "מסורת", year: null, url: "" },
  "hippocrates": { title: "היפוקרטס, על התזונה (Peri Diaites)", type: "מסורת", year: -400, url: "" },
  "galen": { title: "גלנוס, על תכונות המזונות (De alimentorum facultatibus)", type: "מסורת", year: 180, url: "" },
  "hildegard": { title: "הילדגרד מבינגן, פיזיקה (Physica)", type: "מסורת", year: 1150, url: "" },
  "unesco-med": { title: "UNESCO, Mediterranean diet, רשימת המורשת הבלתי מוחשית", type: "רגולציה", year: 2010, url: "https://ich.unesco.org/en/RL/mediterranean-diet-00884" },
  "unesco-washoku": { title: "UNESCO, Washoku, traditional dietary cultures of the Japanese", type: "רגולציה", year: 2013, url: "https://ich.unesco.org/en/RL/washoku-traditional-dietary-cultures-of-the-japanese-notably-for-the-celebration-of-new-year-00869" },
  "nccih-ayurveda": { title: "NCCIH, Ayurvedic Medicine: In Depth", type: "סקירה", year: 2019, url: "https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth" },
  "new-nordic-2004": { title: "Manifesto for the New Nordic Kitchen", type: "מסורת", year: 2004, url: "" },

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
  "medlineplus-carbs": { title: "MedlinePlus, Carbohydrates", type: "מאגר", year: 2024, url: "https://medlineplus.gov/carbohydrates.html" },
  "medlineplus-protein": { title: "MedlinePlus, Dietary Proteins", type: "מאגר", year: 2024, url: "https://medlineplus.gov/dietaryproteins.html" },
  "medlineplus-fats": { title: "MedlinePlus, Dietary Fats", type: "מאגר", year: 2024, url: "https://medlineplus.gov/dietaryfats.html" },
  "medlineplus-fiber": { title: "MedlinePlus, Dietary Fiber", type: "מאגר", year: 2024, url: "https://medlineplus.gov/dietaryfiber.html" },
  "medlineplus-vitamins": { title: "MedlinePlus, Vitamins", type: "מאגר", year: 2024, url: "https://medlineplus.gov/vitamins.html" },
  "medlineplus-minerals": { title: "MedlinePlus, Minerals", type: "מאגר", year: 2024, url: "https://medlineplus.gov/minerals.html" },
  "medlineplus-iron": { title: "MedlinePlus, Iron in diet", type: "מאגר", year: 2024, url: "https://medlineplus.gov/ency/article/002422.htm" },
  "medlineplus-calcium": { title: "MedlinePlus, Calcium in diet", type: "מאגר", year: 2024, url: "https://medlineplus.gov/ency/article/002412.htm" },
  "cfr-101-81": { title: "21 CFR 101.81, Soluble fiber from certain foods (oat and barley beta-glucan)", type: "רגולציה", year: 1997, url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-E/section-101.81" },
  "fda-badbug": { title: "FDA, Bad Bug Book, 2nd ed.: Phytohaemagglutinin (kidney bean lectin)", type: "מאגר", year: 2012, url: "https://www.fda.gov/food/foodborne-pathogens/bad-bug-book-second-edition" },
  "medlineplus-g6pd": { title: "MedlinePlus, G6PD deficiency", type: "מאגר", year: 2023, url: "https://medlineplus.gov/genetics/condition/glucose-6-phosphate-dehydrogenase-deficiency/" },

  // הרכב, בוטניקה ואלרגנים
  "campbell": { title: "Urry et al., Campbell Biology, 12th ed., Pearson", type: "סקירה", year: 2020, url: "" },
  "nccih-turmeric": { title: "NCCIH, Turmeric", type: "סקירה", year: 2024, url: "https://www.nccih.nih.gov/health/turmeric" },
  "nccih-ginger": { title: "NCCIH, Ginger", type: "סקירה", year: 2024, url: "https://www.nccih.nih.gov/health/ginger" },
  "nccih-fenugreek": { title: "NCCIH, Fenugreek", type: "סקירה", year: 2024, url: "https://www.nccih.nih.gov/health/fenugreek" },
  "nccih-pomegranate": { title: "NCCIH, Pomegranate", type: "סקירה", year: 2024, url: "https://www.nccih.nih.gov/health/pomegranate" },
  "nccih-sage": { title: "NCCIH, Sage", type: "סקירה", year: 2024, url: "https://www.nccih.nih.gov/health/sage" },
  "gartner-1997": { title: "Gärtner, Stahl, Sies, Lycopene is more bioavailable from tomato paste than from fresh tomatoes, Am J Clin Nutr", type: "ניסוי", year: 1997, url: "https://doi.org/10.1093/ajcn/66.1.116" },
  "unlu-2005": { title: "Unlu et al., Carotenoid absorption from salad and salsa is enhanced by the addition of avocado or avocado oil, J Nutr", type: "ניסוי", year: 2005, url: "https://doi.org/10.1093/jn/135.3.431" },
  "who-protein-2007": { title: "WHO/FAO/UNU, Protein and amino acid requirements in human nutrition (TRS 935)", type: "הנחיה", year: 2007, url: "https://iris.who.int/handle/10665/43411" },
  "song-milner-2001": { title: "Song & Milner, The influence of heating on the anticancer properties of garlic, J Nutr", type: "ניסוי", year: 2001, url: "https://doi.org/10.1093/jn/131.3.1054S" },
  "okunade-2018": { title: "Okunade et al., Exogenous myrosinase via mustard seeds and sulforaphane after cooked broccoli, Mol Nutr Food Res", type: "ניסוי", year: 2018, url: "" },
  "rogel": { title: "אילנה רוגל, על רוח וחומר: אנציקלופדיה לתזונה ורוחניות, הוצאת מגדלור (ynet)", type: "מסורת", year: null, url: "https://www.ynet.co.il/articles/0,7340,L-3414523,00.html" },
  "usda-fdc": { title: "USDA FoodData Central", type: "מאגר", year: 2024, url: "https://fdc.nal.usda.gov/" },
  "medlineplus-magnesium": { title: "MedlinePlus, Magnesium in diet", type: "מאגר", year: 2024, url: "https://medlineplus.gov/ency/article/002423.htm" },
  "bohn-2004": { title: "Bohn, Walczyk, Leisibach & Hurrell, Chlorophyll-bound magnesium in commonly consumed vegetables and fruits: relevance to magnesium nutrition, J Food Sci 69(9)", type: "ניסוי", year: 2004, url: "https://doi.org/10.1111/j.1365-2621.2004.tb09947.x" },
  "fao-spirulina-2008": { title: "Habib, Parvin, Huntington & Hasan, A review on culture, production and use of spirulina as food for humans and feeds for domestic animals, FAO Fisheries and Aquaculture Circular 1034", type: "סקירה", year: 2008, url: "https://www.fao.org/3/i0424e/i0424e00.htm" },
  "cfr-73-530": { title: "21 CFR 73.530, Spirulina extract (color additive; phycocyanins from Arthrospira platensis)", type: "רגולציה", year: 2013, url: "https://www.law.cornell.edu/cfr/text/21/73.530" },
  "watanabe-1999": { title: "Watanabe et al., Pseudovitamin B12 is the predominant cobamide of an algal health food, spirulina tablets, J Agric Food Chem 47(11)", type: "ניסוי", year: 1999, url: "https://doi.org/10.1021/jf990541b" },
  "powo": { title: "Plants of the World Online, Kew", type: "מאגר", year: 2024, url: "https://powo.science.kew.org/" },
  "zohary-2012": { title: "Zohary, Hopf & Weiss, Domestication of Plants in the Old World, 4th ed., Oxford University Press", type: "סקירה", year: 2012, url: "" },
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
