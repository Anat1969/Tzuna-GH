// גשר לאפליקציה האחות "רפואה" (https://refua-gh.vercel.app). הכיוון ההפוך כבר קיים שם: #/foods?id=<id>.
// כאן אין טענה רפואית. התווית היא רק שם הכרטיס ברפואה, והעובדות והמקורות נמצאים שם.
// מקור יחיד: הגיליון מציג מכאן, והבודק מוודא שהמזון קיים ושהכתובת היא של "רפואה".
export const MEDICINE_BASE = "https://refua-gh.vercel.app/";

const HEART = { he: "מחלת לב איסכמית", href: "#s=cardio&v=disease&d=ischemic" };
const FIBER = { he: "סיבים תזונתיים וסרטן המעי הגס", href: "#s=digestive&v=disease&d=colorectal-cancer" };
const BONE = { he: "אוסטאופורוזיס", href: "#s=skeletal&v=disease&d=osteoporosis" };
const ALLERGY = { he: "אלרגיה ואנפילקסיס", href: "#s=immune&v=disease&d=allergy" };

export const MEDICINE = {
  olive: [HEART],
  turmeric: [{ he: "תוספי כורכום ברשימה האדומה", href: "#s=cardio&v=redlist&a=turmeric-supplements" }],
  wheat: [FIBER],
  barley: [FIBER],
  oat: [FIBER],
  lentil: [FIBER],
  chickpea: [FIBER],
  fava: [FIBER],
  sesame: [BONE, ALLERGY],
  // 04.11.2026: הרחבה משני הכיוונים. כל קישור נשען על טענה עם מקור בשתי האפליקציות:
  // PREDIMED (שמן זית ותערובת אגוזים), סיבים (קטניות ודגנים), סידן (תאנה, ותרד שהחומצה האוקסלית בו קושרת סידן),
  // ואלרגנים מסומנים (אגוזים, שומשום, תורמוס, חרדל) מול "אלרגיה ואנפילקסיס", שמזכיר מזון כגורם.
  almond: [HEART, ALLERGY],
  walnut: [HEART, ALLERGY],
  lupin: [ALLERGY],
  mustard: [ALLERGY],
  pea: [FIBER],
  bean: [FIBER],
  corn: [FIBER],
  fig: [BONE],
  spinach: [BONE],
  grape: [{ he: "אלכוהול וסרטן השד", href: "#s=reproductive&v=disease&d=breast-cancer" }],
};

export const medicineFor = (id) => (MEDICINE[id] || []).map((x) => ({ ...x, url: MEDICINE_BASE + x.href }));
