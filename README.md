# DI Vaizdo Generatorius – rinkodaros vizualų promptai

Statinė HTML aplikacija: mini generatorius + paruošti šablonai rinkodaros vizualams. Pagrindinis kelias dabar yra `šablonas -> laukai -> prompt preview -> copy + open -> generatorius`.

## Lokalus paleidimas

- Atidaryk `index.html` naršyklėje, arba:

```bash
npm install
npm run build
npx serve -s . -l 3000
```

## LT / EN puslapiai

- Root šablonas: `index.html`
- LT build puslapis: `lt/index.html`
- EN build puslapis: `en/index.html`
- LT privatumas: `lt/privatumas.html`
- EN privacy: `en/privacy.html`

Kalba sprendžiama taip:

- `/lt/` arba `/en/` locale path
- `?lang=lt` arba `?lang=en`
- `localStorage`
- `navigator.language`

Papildomai:

- `/en/` first-paint yra pilnai sugeneruotas anglų kalba dar prieš `generator.js`
- root puslapis canonical/hreflang lygyje rodo į locale build puslapius
- aktyvus prompto šaltinis (`mini` / `Pro`) saugomas aiškiai ir naudojamas tools CTA logikai
- tools sekcijoje pagal nutylėjimą parenkamas `Ideogram` kaip rekomenduojamas starto įrankis

## QA (prieš deploy)

```bash
npm install
npm run build
npm test
```

## Deploy

Deploy per GitHub Pages (GitHub Actions). Instrukcijos ir production URL: `DEPLOYMENT.md`.

## Svarbiausi failai

- `index.html`: UI (mini generatorius + šablonų biblioteka)
- `generator.js`: interaktyvus promptų generatorius, LT/EN locale logika, active prompt source modelis, state išsaugojimas
- `copy.js`: kopijavimas + toast + UX
- `style.css`: dizaino sistema + dark mode
- `scripts/build-locale-pages.js`: build-time LT/EN puslapių generavimas
- `privatumas.html`: root privatumo politika (be duomenų rinkimo)
