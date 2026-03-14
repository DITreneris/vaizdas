# Agentų Sistemos Modelis – Apžvalga

**Projektas:** DI Vaizdo Generatorius
**Versija:** 1.0  
**Kalba:** LT

---

## 1. Architektūra

```
ORCHESTRATOR AGENT (koordinacija)
    ├── Content Agent      (promptai, tekstai)
    ├── Curriculum Agent   (struktūra, logika, seka)
    ├── UI/UX Agent        (dizainas, a11y, UX)
    ├── QA Agent           (kodas + turinys)
    └── Feedback Store     (duomenys, metrikos)
            │
            └── GitHub / Version Control
```

---

## 2. Agentų rolės

### Content Agent
- **Tikslas:** Kuria ir prižiūri teksto turinį (promptus, aprašymus)
- **Įvestis:** Specifikacija, grįžtamasis ryšys, Curriculum rekomendacijos
- **Išvestis:** Turinio redagavimai, nauji promptai

### Curriculum Agent
- **Tikslas:** Nustato turinio struktūrą ir mokymosi logiką
- **Įvestis:** Tikslai, auditorija, roadmap.md
- **Išvestis:** Promptų seka, priklausomybių modelis

### UI/UX & Usability Agent
- **Tikslas:** Sąsajos kokybė, prieinamumas, vartotojo patirtis
- **Įvestis:** .cursorrules, WCAG AA, sesijų duomenys
- **Išvestis:** UI pakeitimai, CSS/HTML optimizacijos, a11y patikros

### QA Agent
- **Tikslas:** Tikrina kokybę – kodas ir turinys
- **Įvestis:** Pakeitimų diff, todo.md, test scenarijai
- **Išvestis:** Klaidų ataskaitos, acceptance checklist
- **Dokumentacija:** Prieš merge tikrina, ar pakeitimams atitinka dokumentacijos atnaujinimai (žr. [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)). Prieš release – ar CHANGELOG.md atnaujintas ir versija atitinka SemVer.

### Orchestrator Agent
- **Tikslas:** Koordinuoja agentus, prioritizuoja užduotis
- **Įvestis:** Verslo užduotys, Feedback Store metrikos
- **Išvestis:** Užduočių eilės, prioritetų planas

---

## 3. Workflow

1. **Vartotojas/Verslas** → Orchestrator: nauja užduotis
2. **Orchestrator** → Curriculum: struktūros rekomendacijos
3. **Curriculum** → Orchestrator: specifikacija
4. **Orchestrator** → Content: turinio kūrimas
5. **Content** → Orchestrator: turinio versija
6. **Orchestrator** → UI/UX: integracijos užduotis
7. **UI/UX** → Orchestrator: UI pakeitimai
8. **Orchestrator** → QA: validacija
9. **QA fail** → grąžinti Content/UI taisymams
10. **QA pass** → GitHub: PR sukūrimas

---

## 4. Loop logika

| Ciklas | Aprašymas |
|--------|-----------|
| Planavimo | Orchestrator → Curriculum → prioritetų sąrašas |
| Kūrimo | Content + UI/UX (lygiagrečiai, jei leidžia priklausomybės) |
| Validacijos | QA → fail = grąžinti; pass = merge |
| Įvertinimo | Release → Feedback Store → metrikos → nauji prioritetai |

---

## 5. Commit prefiksai (agentų)

- `[Content]` – turinio pakeitimai
- `[Curriculum]` – struktūros/sekos pakeitimai
- `[UI]` – dizainas, UX, a11y
- `[QA]` – testai, validacija, fix'ai
- `[Orchestrator]` – koordinacija, konfigūracija

---

## 6. Komandos (vykdomos prieš merge / lokaliai)

| Komanda | Paskirtis |
|---------|-----------|
| `npm install` | Įdiegti priklausomybes |
| `npm test` | Build + struktūros testai (tests/structure.test.js) + lint:html + lint:js |
| `npm run lint:html` | HTML validacija (6 puslapių: index, lt/, en/, privatumas) |
| `npm run lint:js` | ESLint visiems .js failams |
| CI (GitHub Actions) | Lint, test, pa11y a11y – automatiškai push/PR |

Prieš PR įsitikinti, kad `npm test` praeina. A11y tikrinimas – per CI arba lokaliai: `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/ --standard WCAG2AA`.

---

## 7. Release seka

1. Orchestrator → Curriculum: release scope (todo, roadmap).
2. Orchestrator → Content / UI/UX: reikiai (jei yra).
3. Orchestrator → QA: release validacija.
4. QA: `npm test`, CHANGELOG atnaujintas (SemVer), rankinis QA (naršyklės, mobilus, kopijavimas, a11y).
5. QA pass → tag (pvz. `v1.x.0`), deploy. Production repo: [DITreneris/vaizdas](https://github.com/DITreneris/vaizdas) → https://ditreneris.github.io/vaizdas/ . QA fail → grąžinti Content/UI.

---

## 8. Susiję dokumentai

- [.cursorrules](.cursorrules) – projekto taisyklės (saugumas, kokybė, dokumentacija)
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) – dokumentų valdymas, atsakomybės, archyvavimas
- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01))
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvo testavimo scenarijai ir žurnalas
- [DEPLOYMENT.md](DEPLOYMENT.md) – deploy (GitHub Actions → GitHub Pages), [COLD_DEPLOY.md](COLD_DEPLOY.md), post-deploy testavimas
- [CHANGELOG.md](CHANGELOG.md) – versijų pakeitimų istorija (Keep a Changelog)
- [todo.md](todo.md) – artimiausi darbai
- [roadmap.md](roadmap.md) – kryptis / vėlesni etapai

---

## 9. Užduočių seka ir golden standard

Keičiant **turinį** – atsakingas Content Agent; keičiant **struktūrą arba JS** – reikia QA patvirtinimo ir atnaujintų susijusių dokumentų.

| Etapas | Agentas | Užduotis | Įvestis | Išvestis |
|--------|---------|----------|---------|----------|
| 1 | **Orchestrator** | Prioritizuoja užduotį, nustato scope | Verslo užduotis, todo | Užduočių eilė, prioritetai |
| 2 | **Curriculum** | Nustato promptų seką, priklausomybes, mokymosi tikslus | Scope iš Orchestrator | Specifikacija: ką keisti, kokia seka |
| 3 | **Content** | Redaguoja tik turinį (promptai, antraštės, aprašymai, info boksai); **privalo laikytis** [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) | Specifikacija | Pakeisti tekstai; nekeičia id/klasės/JS |
| 4 | **UI/UX** | Keičia tik išvaizdą/a11y (CSS, ARIA, layout) – ne promptų teksto | Reikalavimai; golden standard struktūra | CSS/HTML pakeitimai, a11y patikros |
| 5 | **QA** | Vykdo `npm test`, pa11y, dokumentacijos atitikimą; prieš merge – diff vs „core docs“ | Pakeitimų diff, todo, docs/DOCUMENTATION.md | Ataskaita: pass / grąžinti Content/UI |

---

**Paskutinis atnaujinimas:** 2026-02-18
