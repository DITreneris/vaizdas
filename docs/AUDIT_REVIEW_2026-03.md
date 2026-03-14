# Audit Review 2026-03

## Status

2026-03 full audit fix batch įgyvendintas:

- P0 LT/EN first-paint ir active language būsena uždaryta
- P0 active prompt source ir copy/tools CTA logika padaryta deterministinė
- P0 build/test/deploy apsaugos išplėstos kritiniams locale/copy scenarijams
- P1/P2 golden path, recommended tool preselect, action-oriented quality feedback ir premium UI polish sluoksnis pritaikytas

## Scope

Peržiūrėtas:

- UI/UX srautas nuo `mini generatoriaus` iki `copy + open`
- LT/EN architektūra ir first-paint kokybė
- build/test/deploy patikimumas
- suderinamumas su įžvalgomis iš `2_UI_analis.txt`

Pagrindiniai failai:

- `index.html`
- `style.css`
- `generator.js`
- `copy.js`
- `scripts/build-locale-pages.js`
- `tests/structure.test.js`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `en/index.html`
- `lt/index.html`

## Executive Summary

Projektas turi gerą bazę:

- aiškų lightweight HTML/CSS/JS modelį
- veikiantį LT/EN locale sluoksnį runtime lygyje
- build-time generavimą į `lt/` ir `en/`
- bazinius testus ir CI

Tačiau auditui išryškėjo trys pagrindinės rizikų grupės:

1. EN first-paint nėra pilnai lokalizuotas.
2. Copy flow ir aktyvaus prompto logika nėra pakankamai aiški.
3. Testai ir build architektūra neapsaugo nuo svarbiausių regressions.

## P0 Findings

### P0.1 EN first-paint yra dalinai LT

`en/index.html` vis dar turi daug LT teksto dar prieš `generator.js` perrašo DOM.

Tai matosi jau pačiame sugeneruotame HTML:

- `skip-link` yra LT
- `nav aria-label` yra LT
- hero H1/subtitle/step tekstai yra LT
- dalis mini generatoriaus tekstų yra LT
- aktyvi kalba HTML lygyje rodo `LT`, ne `EN`

Tai yra problema:

- no-JS scenarijui
- lėtam first paint
- crawler / preview / static SEO kokybei
- bendram pasitikėjimui produktu

Susiję failai:

- `en/index.html`
- `index.html`
- `generator.js`
- `scripts/build-locale-pages.js`

Svarbi vieta:

`scripts/build-locale-pages.js` EN lokalizacijai naudoja tik ribotą `.replace()` sąrašą, todėl daug HTML turinio lieka nepergeneruota.

### P0.2 Neteisinga aktyvios kalbos būsena EN puslapyje

`en/index.html` pradžioje:

- `LT` mygtukas turi `is-active`
- `LT` turi `aria-pressed="true"`
- `EN` yra neaktyvus

Tai semantiškai ir vizualiai klaidina vartotoją net jei vėliau JS tai pataisytų.

Susiję failai:

- `en/index.html`
- `index.html`
- `generator.js`
- `scripts/build-locale-pages.js`

### P0.3 `Quick copy` gali kopijuoti ne tą promptą

`generator.js`:

- `getSmartPromptText()` grąžina Pro promptą vien pagal `state.object`
- `applyMiniPreset()` atnaujina ne tik `miniState`, bet ir `state`

Rezultatas:

- po preset naudojimo arba dalinio Pro darbo `Greitas copy` gali kopijuoti ne tą prompto versiją, kurią user’is šiuo metu laiko „aktyvia“
- copy source nėra pakankamai deterministinis

Susiję failai:

- `generator.js`
- `index.html`

### P0.4 Locale architektūra turi per daug tiesos šaltinių

Tekstai ir locale elgesys dabar išbarstyti per:

- `index.html`
- `generator.js`
- `scripts/build-locale-pages.js`
- `copy.js`
- hardcoded `en/privacy.html`

Tai daro sistemą trapią: mažas copy pakeitimas gali sulaužyti build replace logiką arba palikti LT/EN drift.

Susiję failai:

- `index.html`
- `generator.js`
- `copy.js`
- `scripts/build-locale-pages.js`
- `privatumas.html`
- `en/privacy.html`

## P1 Findings

### P1.1 Auksinis kelias dar nėra pakankamai vienas

Pagal `2_UI_analis.txt`, pagrindinis kelias turėtų būti:

`Šablonas -> Laukai -> Prompt preview -> Copy -> Pasirink generatorių`

Dabar vis dar yra per daug copy taškų:

- `Greitas copy`
- mini generatoriaus copy
- library kortelių copy
- Pro header copy
- Pro footer copy
- tools CTA copy

Tai silpnina CTA hierarchiją ir kelia klausimą „kur spausti dabar?“.

Susiję failai:

- `index.html`
- `generator.js`
- `copy.js`
- `style.css`

### P1.2 Completion logika yra per silpna

`updateStepCompletion()` ir `updateQualityMeter()` skaičiuoja tik mažą dalį laukų, todėl:

- statusai labiau dekoratyvūs nei vedantys
- nėra aiškaus „ko trūksta toliau“
- nėra tikro „active / incomplete / done“ modelio

Tai tiesiogiai sutampa su `2_UI_analis.txt` kritika.

Susiję failai:

- `generator.js`
- `copy.js`

### P1.3 Hero vis dar vizualiai per sunkus

Nors jis geresnis nei ankstesnėje analizėje aprašytas variantas, jis vis dar:

- stipriai dominuoja virš darbinės zonos
- konkuruoja su turiniu
- labiau „effect-driven“ nei „authoritative“

Pagal premium kryptį reikėtų daugiau struktūros, mažiau dekoratyvaus dominavimo.

Susiję failai:

- `index.html`
- `style.css`

### P1.4 Tool pasirinkimo UX dar gali būti aiškesnis

Pozityvu:

- nebėra 1-click auto-open elgsenos

Bet vis dar trūksta:

- recommended tool preselection
- aiškesnio „kodėl šis rekomenduojamas“
- stipresnio ryšio tarp aktyvaus prompto ir tools CTA

Susiję failai:

- `index.html`
- `generator.js`
- `style.css`

## P2 Findings

### P2.1 Badge sistema nėra iki galo sisteminė

Yra bendra pill logika, bet kai kurios vietos vis dar „iškrenta“:

- `.tool-card-badge` turi savitą vizualą
- badge stilius ne visur išlaiko tą pačią semantinę sistemą

Susiję failai:

- `style.css`
- `index.html`

### P2.2 Prompt preview akcentai per ryškūs

`gen-key` geltonas akcentas vis dar per stipriai traukia dėmesį ir kai kur mažina premium/enterprise toną.

Tai nėra funkcijos klaida, bet yra polish lygio estetinis neatitikimas su `2_UI_analis.txt`.

Susiję failai:

- `style.css`
- `generator.js`

### P2.3 `Eksperto patarimai` blokas per mažai išskirtas

Šiuo metu jis funkciškai yra geras, bet vizualiai dar neatrodo kaip svarbus premium guidance blokas.

Susiję failai:

- `index.html`
- `style.css`

## Techninis Review

### Build

`scripts/build-locale-pages.js` šiuo metu yra pagrindinis trapumo taškas:

- lokalizuoja per literal `replace()`
- jautrus tekstų pakeitimams
- negeneruoja pilnai savarankiško EN HTML

### Tests

`tests/structure.test.js` tikrina daugiausia:

- failų buvimą
- string presence
- bazines žymas

Bet netikrina:

- pilno LT/EN vertimo completeness
- first-paint kalbos būsenos
- copy source elgesio
- canonical/hreflang korektiškumo skirtinguose scenarijuose

### CI / Deploy

CI ir deploy jau turi build, bet regresijų aptikimas vis dar silpnas, nes trūksta browser-level patikrų dėl:

- locale first paint
- kalbos perjungimo
- sticky copy logikos
- tools CTA logikos

## Rekomenduojamas Backlogas

### Pirmas paketas

1. Pilnai išspręsti EN static build.
2. Sutaisyti active language state `en/index.html`.
3. Padaryti deterministinį `Quick copy` šaltinį.

### Antras paketas

1. Peržiūrėti completion / quality modelį.
2. Preselectinti recommended tool.
3. Sustiprinti ryšį tarp preview ir tools CTA.

### Trečias paketas

1. Suvienodinti badge sistemą.
2. Suvaldyti hero vizualinį svorį.
3. Sušvelninti prompt highlight ir pagerinti premium polish.

## Siūlomas Review Checklist kitam ciklui

- Patikrinti `en/index.html` kaip statinį failą be JS pagalbos.
- Patikrinti `LT/EN` toggle active state visose locale versijose.
- Patikrinti `Greitas copy` su šiais scenarijais:
  - tik mini generatorius
  - mini + preset
  - mini + Pro atidarytas
  - po `Perkelti į Pro režimą`
- Patikrinti ar `recommended` tool turėtų būti auto-preselected.
- Įdėti bent vieną browser lygio smoke testą LT ir EN keliui.

## Bottom Line

Didžiausias neatitikimas dabar nėra bendras dizaino lygis, o tai, kad:

- EN patirtis dar nėra pilnai statinė ir patikima
- UX dar neturi vieno aiškaus copy kelio
- testai neapsaugo nuo svarbiausių locale/SEO/flow regresijų

Jei taisytume tik 3 dalykus pirmiausia, imčiau:

1. `en/index.html` first-paint lokalizaciją
2. `Quick copy` source taisyklingumą
3. browser-level LT/EN smoke testą
