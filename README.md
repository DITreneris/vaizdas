# DI Vaizdo Generatorius – rinkodaros vizualų promptai

Statinė HTML aplikacija: mini generatorius, paruošti šablonai (4 kortelės), Pro režimas ir greitas kopijavimas į pasirinktą DI įrankį (6 įrankiai). Pagrindinis kelias: **šablonas / mini laukai → prompt preview → copy + open → generatorius**.

**Production:** [DITreneris/vaizdas](https://github.com/DITreneris/vaizdas) → https://ditreneris.github.io/vaizdas/

---

## Lokalus paleidimas

```bash
npm install
npm run build
npx serve -s . -l 3000
```

Arba atidaryk `index.html` tiesiogiai naršyklėje (locale puslapiai reikalauja build).

---

## Projekto struktūra

| Kelias | Aprašymas |
|--------|------------|
| `index.html` | Šaltinis šablonas (LT). Naudojamas kaip pagrindinis puslapis ir kaip įvestis build skriptui. |
| `lt/`, `en/` | Locale puslapiai: generuojami `npm run build` iš `index.html` ir `privatumas.html`. `lt/index.html`, `en/index.html`, `lt/privatumas.html`, `en/privacy.html`. |
| `generator.js` | Interaktyvus promptų generatorius: mini + Pro režimas, LT/EN perjungimas, `activePromptSource` (mini/full), state į `localStorage`, 6 įrankiai, kopijavimas. |
| `copy.js` | Kopijavimas į clipboard, toast pranešimai, `copyPrompt()` / `selectText()`, accordion būsena. |
| `style.css` | Dizainas, dark mode, responsive. |
| `scripts/build-locale-pages.js` | Build: generuoja `lt/` ir `en/` iš root šablono; naudoja `BASE_PATH` ir `SITE_ORIGIN` (CI/deploy). |
| `tests/structure.test.js` | Struktūriniai testai: ID, nuorodos, locale build išvestis, `generator.js` / `copy.js` priklausomybės. |
| `privatumas.html` | Root privatumo politika (be duomenų rinkimo). |

Ikonos: **Lucide** (CDN, `unpkg.com/lucide`).

---

## LT / EN

- Kalba: `/lt/`, `/en/` (path), `?lang=lt` / `?lang=en`, `localStorage` (`di_generator_locale_v1`), `navigator.language`.
- Root `index.html` turi `lang="lt"`, canonical/hreflang rodo į `./lt/` ir `./en/`.
- `/en/` first-paint – pilnas EN tekstas dar prieš `generator.js` (build laiko pakeitimai).
- Aktyvus prompto šaltinis (`mini` / `full`) saugomas ir naudojamas sticky/tools CTA; tools pagal nutylėjimą – **Ideogram** (rekomenduojama).

---

## NPM skriptai

| Skriptas | Veiksmai |
|----------|----------|
| `npm run build` | `node scripts/build-locale-pages.js` – generuoja `lt/`, `en/`. |
| `npm test` | Build → `tests/structure.test.js` → `lint:html` → `lint:js`. |
| `npm run test:structure` | Build + tik struktūros testai. |
| `npm run lint:html` | HTML validacija (W3C): `index.html`, `lt/index.html`, `en/index.html`, `privatumas.html`, `lt/privatumas.html`, `en/privacy.html`. |
| `npm run lint:js` | ESLint visiems `.js` failams. |

---

## QA (prieš deploy)

```bash
npm install
npm run build
npm test
```

Detaliau: [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md). A11y lokaliai: [DEPLOYMENT.md](DEPLOYMENT.md#prieš-deploy-lokaliai).

---

## Deploy

GitHub Pages per GitHub Actions. Instrukcijos, production URL ir cold deploy: [DEPLOYMENT.md](DEPLOYMENT.md), [COLD_DEPLOY.md](COLD_DEPLOY.md).

---

## Svarbiausi failai (santrauka)

- **UI / šablonas:** `index.html` (mini generatorius, 4 šablonai, tools sekcija, Pro režimas).
- **Logika:** `generator.js` (mini + full state, locale, activePromptSource, tools, copy integracija).
- **Kopijavimas / UX:** `copy.js` (toast, `copyPrompt`, `selectText`, hiddenTextarea).
- **Stiliai:** `style.css`.
- **Build:** `scripts/build-locale-pages.js` (BASE_PATH, SITE_ORIGIN).
- **Testai:** `tests/structure.test.js`.
- **Privatumas:** `privatumas.html` (root); locale variantai – build išvestis.
