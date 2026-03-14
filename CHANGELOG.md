# Changelog

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Nereleisuota]

### Prideta
- **UI/UX tobulinimai (vartotojo kelionė, premium SaaS):** Hero sumažintas (~25–35 %), CTA hierarchija (secondary outline vizualiai silpnesnis), sticky mygtukas pervadintas į „Pereiti prie prompto“ (scroll semantika), tools two-step aiškinimas (1. Pasirinkite įrankį, 2. Spauskite žemiau), Pro completion skaičiai (X/Y užpildyta, Paruošta X/Y), quality meter „Užpildyta: X/7“, copy success „Nukopijuota ✓“, badge sistema (info/success/warning/premium tokenai). Plačiau: [docs/UI_UX_MICRO_AUDIT_2026-03.md](docs/UI_UX_MICRO_AUDIT_2026-03.md) § Įgyvendinta.
- Dokumentacija: atnaujintas `README.md`, pridėti `todo.md` ir `roadmap.md`.
- LT/EN locale architektūra su `lang` perjungikliu, runtime lokalizacija ir build-time locale puslapiais (`lt/`, `en/`).
- `scripts/build-locale-pages.js`, kuris generuoja `lt/index.html`, `en/index.html`, `lt/privatumas.html`, `en/privacy.html`.
- Generatoriaus būsenos išsaugojimas per `localStorage` (mini + pro laukai, pasirinktas įrankis, kalba).
- Deterministinis `activePromptSource` modelis ir kontekstinis top-nav CTA, kuris veda prie aktyvaus prompto vietoj papildomo global copy mygtuko.
- Recommended tool golden path: `Ideogram` first-paint metu pažymėtas kaip default pasirinkimas su aiškesniu tools hint.

### Pakeista
- `README.md` sutvarkytas pagal dabartinį projektą (DI Vaizdo Generatorius).
- Patikslintas vartotojo flow: aiškesnis perėjimas iš mini generatoriaus į įrankių sekciją ir Pro režimą.
- Patobulinta a11y semantika: kalbos perjungiklis, theme toggle būsena, tool kortelių keyboard/radio elgsena, spalvų chip `aria-pressed`.
- Atnaujinti testai, CI ir deploy workflow, kad prieš validaciją būtų generuojami LT/EN puslapiai.
- EN static build dabar pilnai sugeneruojamas build metu, su teisinga first-paint kalba, active language būsena ir locale-aware canonical / hreflang nuorodomis.
- Quality / completion feedback perdirbtas į action-oriented modelį: rodoma ko trūksta toliau, o prompt preview highlight bei guidance blokai sušvelninti premium UI krypčiai.

---

## [1.2.0] - 2026-02-27

### Prideta
- **Tools „select then CTA"** – įrankių kortelės dabar veikia dviem žingsniais: 1) pasirinkti kortelę, 2) spausti „Kopijuoti + atidaryti" CTA mygtuką. Pašalintas pavojingas 1-click auto-copy+auto-open.
- **Smart prompt kopijavimas** – CTA mygtukas automatiškai parenka Pro promptą (jei užpildytas objektas) arba Mini promptą.
- **Helper text** – po pagrindiniais laukais (Mini + Pro) pridėtas pastovus pavyzdžių tekstas (`field-help`), placeholderiai sutrumpinti.
- **Spalvos chips** – 7 spalvos chips (Auksinė, Mėlyna, Pastelinė, Koralinė, Žalia, Violetinė, Neutrali) su spalvos žymekliais ir dvikrypte sinchronizacija su teksto lauku.
- **Completion x/y** – step status pakeistas iš binarinio „Nepilna/Atlikta" į „0/2 užpildyta" / „1/2 užpildyta" / „2/2 Atlikta" su trimis vizualinėmis būsenomis (info, partial, complete).
- **Stiprumo paaiškinimas** – po „Stiprumas X/7" pill pridėtas dinaminis hint tekstas, keičiantis pagal tier (Silpnas → Premium).
- **Semantinė pill sistema** – bendra `.pill` bazė su `--info`, `--warning`, `--success`, `--premium` modifikatoriais, dark mode palaikymas. Pritaikyta step statusams ir „Rekomenduojama" badge.
- **Prompt highlight diferenciacija** – naujas `.gen-key` (geltona, bold) kritiniams tokenams (stilius, platforma, tonas) ir `.gen-value` (balta, pabraukta) normaliems tokenams.

### Pakeista
- **Hero suspaustas** – sumažinti padding, H1 (52→40px), subtitle, CTA mygtukų dydžiai; container top padding sumažintas. Darbinė zona (mini generatorius) matoma pirmame ekrane.
- **Tipografijos hierarchija sustiprinita** – suderinti H1/H2/section title/step header/label dydžiai vienodesnei skalei.
- Tools sekcijos aprašomasis tekstas atnaujintas pagal naują select-then-CTA elgseną.
- Responsive taisyklės atnaujintos spalvos chips, action bar ir sutraukto hero komponentams.

---

## [1.1.0] - 2026-02-27

### Prideta
- **4 žingsnių proceso navigacija** hero viršuje (Sukurk promptą / Šablonai / Generuok vaizdą / Pro režimas) su aktyvaus žingsnio paryškinimu.
- **Step-badge numeracija** – kiekvieno bloko header'yje apskritas numeris (premium SaaS stilius), vertės eilutė ir nuoseklus vizualinis pattern'as.
- **Accordion (single-open) elgsena** – vienu metu atverta tik viena iš 3 suskleidžiamų sekcijų (Šablonai / Įrankiai / Pro režimas); būsena įsimenama per `localStorage`.
- **Įrankių sekcija padaryta collapsible** (nauja toggle struktūra su `toolsToggle` / `toolsBody`).
- **Hero žingsnių sinchronizacija** su accordion – paspaudus hero žingsnį atidaroma atitinkama sekcija, o atidarius sekciją pažymimas teisingas hero žingsnis.
- Bendra `.collapsible-toggle` CSS sistema – vienodas grid layout visiems toggle header'iams (badge / title / count / chevron / value).
- `.section-header-row` – premium header'is ne-collapsible blokui (mini generatorius).

### Pakeista
- „Ekspertinis generatorius" pervadintas į **„Pro režimas"** (aiškesnis pavadinimas vartotojui).
- Šablonų sekcija default uždaryta (anksčiau buvo atverta).
- `privatumas.html` – atnaujintas `localStorage` aprašas (tema + accordion būsena).
- Pašalinta nenaudojama `applyPreset()` funkcija (`generator.js`).
- HTML semantika sutvarkyta pagal W3C validator'ių (`h2 > button` vietoj `button > h2`; `role="region"` kur reikia).
- Responsive taisyklės atnaujintos naujam `.collapsible-toggle` / `.step-badge` layout'ui.

---

## [1.0.0] - 2026-02-27

### Prideta
- Spin-off Nr. 4: **DI Vaizdo Generatorius** (statinė HTML aplikacija).
- Mini generatorius su šablonais (preset’ai) ir gyva prompto išvestimi.
- Šablonų biblioteka (paruošti promptai) + kopijavimo UX.
- `generator.js` (generatoriaus logika) ir `copy.js` (kopijavimas + toast).
- `style.css` (dizainas + tamsus režimas).
- `tests/structure.test.js` (projekto struktūros testai).

### Pakeista
- `index.html`, `privatumas.html`, `favicon.svg` pritaikyti šiam projektui.
