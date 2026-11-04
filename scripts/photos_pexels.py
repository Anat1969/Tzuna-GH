# צילומים מקצועיים מ-Pexels (רישיון Pexels: חופשי לשימוש, בלי חובת קרדיט; אנחנו נותנים קרדיט בכל זאת).
# שלב 1, מועמדים וגיליון בחירה:  python3 scripts/photos_pexels.py search
# שלב 2, הורדה ורישום:           python3 scripts/photos_pexels.py pick olive=3 wheat=0 ...
# המפתח נקרא מ-PEXELS_API_KEY בסביבה בלבד. לא שומרים אותו בקוד.
import json, os, sys, io, time, urllib.request, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.environ.get('PHOTO_WORK', '/tmp/pexels')
KEY = os.environ.get('PEXELS_API_KEY')
QUERIES = {
  "olive": "olives bowl", "wheat": "wheat ears close up", "barley": "barley grain", "grape": "grapes bunch", "fig": "fresh figs cut",
  "pomegranate": "pomegranate open", "date": "medjool dates", "lentil": "lentils", "chickpea": "chickpeas", "fava": "fava beans",
  "lupin": "lupini beans", "almond": "almonds", "walnut": "walnuts", "sesame": "sesame seeds", "watermelon": "watermelon slice",
  "cucumber": "cucumbers", "onion": "onions", "garlic": "garlic bulbs", "tomato": "tomatoes", "zaatar": "zaatar spice",
  "sage": "sage leaves", "ginger": "ginger root", "turmeric": "turmeric root", "grapefruit": "grapefruit", "carob": "carob pods",
  "oat": "rolled oats", "apple": "apples", "pear": "pears", "mulberry": "mulberries", "quince": "quince fruit",
  "cabbage": "cabbage", "chard": "swiss chard", "mustard": "mustard seeds", "fenugreek": "fenugreek seeds",
  "pea": "green peas pods", "bean": "white beans", "lemon": "lemons", "orange": "oranges fruit", "potato": "potatoes",
  "sweetpotato": "sweet potatoes", "eggplant": "eggplants", "pepper": "bell peppers", "zucchini": "zucchini", "spinach": "spinach leaves",
  "parsley": "parsley bunch", "mint": "mint leaves", "coriander": "cilantro", "cumin": "cumin seeds", "rice": "rice grains",
  "corn": "corn cobs", "avocado": "avocado halves", "banana": "bananas bunch"
}
# רק מזונות שעדיין אין להם צילום: python3 scripts/photos_pexels.py search missing
def api(q):
    url = 'https://api.pexels.com/v1/search?' + urllib.parse.urlencode({'query': q, 'per_page': 8, 'orientation': 'landscape'})
    req = urllib.request.Request(url, headers={'Authorization': KEY, 'User-Agent': 'TzunaApp/1.0'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read())
def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'TzunaApp/1.0'}), timeout=60).read()

if not KEY: sys.exit('חסר PEXELS_API_KEY בסביבה')
os.makedirs(WORK + '/thumbs', exist_ok=True)
if sys.argv[1] == 'search':
    from PIL import Image, ImageDraw
    cands = {}
    have = open(os.path.join(ROOT, 'js/data/photos.js'), encoding='utf-8').read()
    todo = {f: q for f, q in QUERIES.items() if not (len(sys.argv) > 2 and sys.argv[2] == 'missing' and f'"{f}":' in have)}
    for fid, q in todo.items():
        r = api(q); cands[fid] = r.get('photos', [])
        for k, p in enumerate(cands[fid]):
            open(f'{WORK}/thumbs/{fid}-{k}.jpg', 'wb').write(fetch(p['src']['small']))
        print(fid, len(cands[fid]), flush=True); time.sleep(0.4)
    json.dump(cands, open(WORK + '/cands.json', 'w'))
    ids = list(cands); T = 170
    for s in range(0, len(ids), 6):
        grp = ids[s:s + 6]; sheet = Image.new('RGB', (T * 8 + 110, (T + 4) * len(grp)), 'white'); d = ImageDraw.Draw(sheet)
        for r, fid in enumerate(grp):
            d.text((4, r * (T + 4) + 70), fid, fill='black')
            for k in range(8):
                try: im = Image.open(f'{WORK}/thumbs/{fid}-{k}.jpg').convert('RGB')
                except Exception: continue
                im.thumbnail((T, T)); sheet.paste(im, (110 + k * T, r * (T + 4))); d.text((112 + k * T, r * (T + 4) + 2), str(k), fill='yellow')
        sheet.save(f'{WORK}/sheet{s // 6}.jpg', quality=80)
    print('גיליונות בחירה ב-' + WORK)
elif sys.argv[1] == 'pick':
    from PIL import Image
    cands = json.load(open(WORK + '/cands.json'))
    pj = os.path.join(ROOT, 'js/data/photos.js')
    head, body = open(pj).read().split('export const PHOTOS = ')
    photos = json.loads(body.rstrip().rstrip(';'))
    for arg in sys.argv[2:]:
        fid, k = arg.split('='); p = cands[fid][int(k)]
        im = Image.open(io.BytesIO(fetch(p['src']['large2x']))).convert('RGB'); im.thumbnail((1200, 1200))
        rel = f'img/foods/{fid}.jpg'; im.save(os.path.join(ROOT, rel), quality=80, optimize=True, progressive=True)
        photos[fid] = dict(src=rel, w=im.width, h=im.height, credit=p['photographer'] + ', Pexels', license='Pexels License', page=p['url'])
        print(fid, im.size, p['photographer'])
    head = '// תמונות המזונות: צילומים מ-Pexels (רישיון Pexels) ומ-iNaturalist (CC BY, CC BY-SA, CC0), עם קרדיט לכל צילום.\n// מזון בלי צילום מתאים מציג איור הרבריום: חור עדיף על תמונה מטעה.\n'
    open(pj, 'w').write(head + 'export const PHOTOS = ' + json.dumps(photos, ensure_ascii=False, indent=1) + ';\n')
