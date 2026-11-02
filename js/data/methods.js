// שיטות תזונה מכל העולם ובכל הזמנים. לכל שיטה: מקום, זמן, יחידת המיון, עיקרון, התנגשויות ומקור.
// from/to: שנים (שלילי = לפני הספירה). approx: תיארוך משוער.
export const REGIONS = [
  { id: "me", he: "מזרח תיכון", hue: "#8a6a2a" },
  { id: "asia", he: "אסיה", hue: "#a83a3a" },
  { id: "eu", he: "אירופה והים התיכון", hue: "#1F4E79" },
  { id: "global", he: "מדע עולמי", hue: "#2a2a26" }
];

export const METHODS = [
  {
    id: "bible", he: "המקרא", place: "ארץ ישראל", place_la: "Land of Israel", region: "me", from: -1000, to: -400, approx: true,
    unit: "**מינים וברכה**: שבעת המינים.", principle: "מזון כ**ברכה של הארץ** ושל העונה.",
    time: "**חגים לפי קציר**: שעורה בפסח, חיטה בשבועות.", conflict: "**כשרות**: מה מותר ומה אסור.",
    example: { food: "olive", t: "\"ארץ **זית שמן** ודבש\"." }, src: "tanakh"
  },
  {
    id: "ayurveda", he: "איורוודה", place: "הודו", place_la: "India", region: "asia", from: -200, to: 200, approx: true,
    unit: "**שישה טעמים**: מתוק, חמוץ, מלוח, חריף, מר, עפיץ.", principle: "איזון בין **שלוש דושות**: ואטה, פיטה וקאפה.",
    time: "**לפי עונה ושעה ביום**.", conflict: "**ויירודהה אהרה**: מזונות שלא משלבים, כמו **חלב ודג**.",
    example: { food: "turmeric", t: "**כורכום** הוא תבלין יסוד במטבח ההודי." }, src: ["charaka", "nccih-ayurveda"]
  },
  {
    id: "tcm", he: "רפואה סינית", place: "סין", place_la: "China", region: "asia", from: -200, to: -100, approx: true,
    unit: "**חמישה טעמים**, ומזון **חם, ניטרלי או קר**.", principle: "איזון **יין ויאנג**.",
    time: "**חמש עונות** וחמש תמורות.", conflict: "**עודף קור או חום** בארוחה.",
    example: { food: "ginger", t: "**ג'ינג'ר** נחשב מחמם." }, src: ["huangdi", "nccih-tcm"]
  },
  {
    id: "hippocrates", he: "היפוקרטס", place: "יוון", place_la: "Greece", region: "eu", from: -420, to: -370, approx: true,
    unit: "**מזון ותנועה** כשני כוחות שצריך לאזן.", principle: "**בריאות כמשטר יומי**: מזון, שינה ופעילות.",
    time: "**לפי עונה, גיל ומקום**.", conflict: "**חוסר איזון** בין אכילה למאמץ.",
    example: { food: "barley", t: "**מי שעורה** (פטיסאנה) בכתבי היפוקרטס." }, src: "hippocrates"
  },
  {
    id: "galen", he: "גלנוס", place: "רומא", place_la: "Rome", region: "eu", from: 160, to: 200, approx: true,
    unit: "**ארבע איכויות**: חם, קר, לח, יבש, במדרגות.", principle: "איזון **ארבע הליחות**.",
    time: "**מזון חם בחורף, קר בקיץ**.", conflict: "מזון ש**מגביר** את מה שכבר עודף בגוף.",
    example: { food: "wheat", t: "**לחם** מדורג לפי סוג הקמח ואופן האפייה." }, src: "galen"
  },
  {
    id: "rambam", he: "הרמב\"ם", place: "פוסטאט, מצרים", place_la: "Fustat, Egypt", region: "me", from: 1180, to: 1198,
    unit: "**סדר ועונה**: מה לפני הארוחה, מה אחריה, מה בחמה ומה בגשמים.", principle: "**הגוף כתנאי להבנה**.",
    time: "\"בימות החמה **מאכלים הקרים**, ובימות הגשמים **החמים**\".", conflict: "**משלשלין עם המזון**: לא מערבבים.",
    example: { food: "fig", t: "**תאנה קודם** הארוחה, **רימון אחריה**." }, src: "rambam-deot"
  },
  {
    id: "hildegard", he: "הילדגרד מבינגן", place: "בינגן, גרמניה", place_la: "Bingen, Germany", region: "eu", from: 1150, to: 1160, approx: true,
    unit: "**חם וקר** לכל צמח, ברוח גלנוס.", principle: "**ויררידיטאס**: כוח הירוק והצמיחה.",
    time: "**מחזור השנה** במנזר.", conflict: "מזון ש**מגביר** חום או קור עודפים, לפי שיטת גלנוס.",
    example: { food: "sage", t: "**מרווה** בגינת התבלינים של המנזר." }, src: "hildegard"
  },
  {
    id: "washoku", he: "וושוקו", place: "יפן", place_la: "Japan", region: "asia", from: 2013, to: 2013,
    unit: "**מרק ושלוש מנות** (איצ'יג'ו סנסאי).", principle: "**כבוד לעונה ולטבע**.",
    time: "**שון**: כל מזון ברגע השיא שלו.", conflict: "**אחידות**: אותו טעם, צבע ושיטת בישול בכל המנות.",
    example: { food: "sesame", t: "**שומשום** קלוי, ברוטב גומה.", }, src: "unesco-washoku"
  },
  {
    id: "med", he: "התזונה הים־תיכונית", place: "אגן הים התיכון", place_la: "Mediterranean", region: "eu", from: 2010, to: 2018,
    unit: "**דפוס**, לא מזון בודד: שמן זית, קטניות, ירקות.", principle: "**השולחן המשותף** הוא חלק מהתזונה.",
    time: "**מקומי ועונתי**.", conflict: "**מזון מעובד** במקום מזון שלם.",
    example: { food: "olive", t: "**שמן זית כתית** בניסוי PREDIMED." }, src: ["unesco-med", "predimed-2018"]
  },
  {
    id: "nordic", he: "המטבח הנורדי החדש", place: "קופנהגן, דנמרק", place_la: "Copenhagen, Denmark", region: "eu", from: 2004, to: 2004,
    unit: "**מקומי ועונתי**.", principle: "**טוהר, פשטות וטריות**.",
    time: "**עונות הצפון**, עם שימור וכבישה.", conflict: "**מזון מיובא** מרחוק.",
    example: { food: "cabbage", t: "**כרוב כבוש** לחורף ארוך." }, src: "new-nordic-2004"
  },
  {
    id: "science", he: "מדע התזונה", place: "עולמי", place_la: "Global", region: "global", from: 2023, to: 2026,
    unit: "**רכיבים ודפוסים**: סיבים, סוכר חופשי, נתרן.", principle: "**ראיות**, ועוצמת ראיה.",
    time: "**לאורך החיים**, לא לפי עונה.", conflict: "**אינטראקציות** בין מזון לתרופה, וספיגה בין מזונות.",
    example: { food: "lentil", t: "**לימון עם עדשים**: ויטמין C מגביר ספיגת ברזל." }, src: ["who-2023", "medlineplus-iron"]
  }
];
