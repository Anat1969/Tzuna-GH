// גשר לאפליקציה האחות "רפואה" (https://refua-gh.vercel.app). הכיוון ההפוך כבר קיים שם: #/foods?id=<id>.
// כאן אין טענה רפואית. התווית היא רק שם הכרטיס ברפואה, והעובדות והמקורות נמצאים שם.
// מקור יחיד: הגיליון מציג מכאן, והבודק מוודא שהמזון קיים ושהכתובת היא של "רפואה".
export const MEDICINE_BASE = "https://refua-gh.vercel.app/";

const HEART = { he: "מחלת לב איסכמית", href: "#s=cardio&v=disease&d=ischemic" };
const FIBER = { he: "סיבים תזונתיים וסרטן המעי הגס", href: "#s=digestive&v=disease&d=colorectal-cancer" };

export const MEDICINE = {
  olive: [HEART],
  turmeric: [{ he: "תוספי כורכום ברשימה האדומה", href: "#s=cardio&v=redlist&a=turmeric-supplements" }],
  wheat: [FIBER],
  barley: [FIBER],
  oat: [FIBER],
  lentil: [FIBER],
  chickpea: [FIBER],
  fava: [FIBER],
  sesame: [{ he: "השלד והעצם", href: "#s=skeletal&v=disease&d=osteoporosis" }],
  grape: [{ he: "אלכוהול וסרטן השד", href: "#s=reproductive&v=disease&d=breast-cancer" }],
};

export const medicineFor = (id) => (MEDICINE[id] || []).map((x) => ({ ...x, url: MEDICINE_BASE + x.href }));
