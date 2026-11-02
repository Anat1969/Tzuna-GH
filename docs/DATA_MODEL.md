# מבנה נתונים

## פריט מזון (food)
```json
{
  "id": "olive-oil",
  "name_he": "שמן זית",
  "name_en": "Olive oil",
  "category": "שמנים",
  "season": ["כל השנה"],
  "layers": {
    "known": [
      {
        "text_he": "בדיאטה ים-תיכונית עשירה בשמן זית נמצא שיעור נמוך יותר של אירועי לב.",
        "evidence": "בינונית",
        "source_id": "predimed-2018"
      }
    ],
    "said": [
      {
        "text_he": "בתנ\"ך שמן זית מסמל ברכה ואור.",
        "tradition": "מקרא",
        "source_id": "tanakh"
      }
    ],
    "believed": [
      {
        "text_he": "שמן זית על בטן ריקה מנקה את הכבד.",
        "status": "לא נבדק"
      }
    ]
  },
  "safety": {
    "flags": [],
    "notes_he": ""
  }
}
```

## כללים
- layers.known: חייב source_id ו-evidence.
- layers.said: חייב tradition ו-source_id.
- layers.believed: חייב status (לא נבדק / לא אוששה).
- safety.flags: ריק, או אחד מ: "red_list", "pregnancy", "medication_interaction", "allergen".
- אין שדות של מינון, קלוריות או "השפעה" כמותית.

## מקור (source)
```json
{
  "id": "predimed-2018",
  "title": "PREDIMED",
  "type": "ניסוי מבוקר",
  "year": 2018,
  "url": "..."
}
```

## רשימה אדומה (redlist)
```json
{
  "id": "teucrium-polium",
  "name_he": "ג'עדה",
  "name_la": "Teucrium polium",
  "risk": "פגיעה כבדית; סיכון בשילוב אינסולין",
  "sources": ["..."],
  "last_reviewed": "YYYY-MM-DD"
}
```

## מימוש בגרסה 1
הדאטה נמצאת ב-`js/data/` כמודולים של JavaScript, ולא כ-JSON, כדי לטעון בלי שלב בנייה. המבנה שומר על המודל שלמעלה, בשמות קצרים:

| במודל | בקוד | הערה |
|---|---|---|
| `name_he` | `he` | |
| `layers.known[].text_he` | `layers.known[].t` | טקסט עשיר: `**מודגש**`, `==תובנה==` |
| `layers.known[].evidence` | `layers.known[].ev` | גבוהה, בינונית, ראשונית, מקרי דיווח, אין |
| `layers.known[].source_id` | `layers.known[].src` | מחרוזת או מערך |
| `layers.said[].tradition` | `layers.said[].trad` | ועוד `ref`: פסוק או הלכה |
| `layers.believed[].status` | `layers.believed[].status` | לא נבדק, לא אוששה, לא נבדק בבני אדם |

שדות תצוגה שנוספו (לא טענות על הגוף):
- `la`, `family`, `family_la`, `part`: הכרה. `recognize: {t, src}`: מבנה, עם מקור.
- `months`, `season_kind`: עונה בשדה. **הערכה** (`season-est`), לא עובדה.
- `meal`: `before` או `after`, רק לפי הרמב"ם, הלכות דעות ד ו. הבודק דורש שכבת "נאמר" מהרמב"ם כשהשדה קיים.
- `use: {t, src}`: שימוש במטבח. `allergens`: מתוך 14 האלרגנים.
- `concentrated`: נצרך גם כחליטה או כתוסף. מפעיל "לא מתאים בלי ייעוץ" לקבוצות מיוחדות.
- `shape`, `hue`: איור ההרבריום.
- `safety.redlink`: קישור לרשומה ברשימה האדומה.

אין שדה של מינון, קלוריות, משקל או "השפעה" כמותית. `scripts/lint-data.mjs` נכשל אם מופיע טקסט שנראה כמו מינון.

## מתכון (recipe), `js/data/recipes.js`
- `foods`: מזהי מזונות מהגלריה. **האלרגנים נגזרים מהם**, לא נכתבים ידנית.
- `extra`: מצרכים שאינם בגלריה (מים, מלח, אורז), כטקסט.
- `tradition: {t, trad, ref, src}`: מסורת מקור, כמו שכבת "נאמר". חובה.
- `steps: [{t, food?}]`: עד 10 שלבים. `food` מציג את איור המזון ליד השלב.
- `months`: עונה מתאימה, הערכה. ריק: כל השנה.
- `note`: אזהרה. חובה במתכון עם פול (G6PD).
- אין ערכים תזונתיים, קלוריות או "השפעה".

## פרופיל מזון, `js/data/profiles.js`
- `unique`: שורת זיקוק, עד 8 מילים (נבדק).
- `body: {t, src}`: **הרכב** (מה יש בו), לא "מה הוא עושה".
- `soul: {t, trad, ref, src}`: משמעות, טקס ותרבות. כמו שכבת "נאמר".
- `with[]`, `without[]`: `{t, src, said?}`. `without` רק להתנגשות אמיתית, עם מקור.

## צילומים, `js/data/photos.js`
`{src, w, h, credit, license, page}`. רק CC BY, CC BY-SA או CC0. הבודק מוודא שהקובץ קיים ושיש קרדיט.

## צמח וגוף, `js/data/plant.js`; שיטות, `js/data/methods.js`
חלק צמח: `plant`, `body` (אנלוגיה של תפקוד), `mind`, `lang`, `foods`. שיטה: מקום, זמן (`from`, `to`, `approx`), `unit`, `principle`, `time`, `conflict`, `example`, `src`.

## גרסה 3
- `js/data/science.js`: `{why, studied:[{t, ev, src}], practical:[...]}` לכל מזון.
- `js/data/synergies.js`: `{a, b, mate, kind: boost|block, title, how, suggest, ev, src, dishes}`. מוצג בגיליון, במתכון ובהשוואה.
- `js/data/discoveries.js`: גילויים מהצלבת הדאטה, `type: עובדה | פרשנות`, ו-`pair` שנפתח בהשוואה.
- `methods.js`: `context: {culture, geo, climate}`, `layer: "believed"` לשיטה שלא נבדקה, `TRAITS`, `MATRIX`, `METHOD_INSIGHTS`.
