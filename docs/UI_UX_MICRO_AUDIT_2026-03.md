# UI/UX mikroauditas – vartotojo kelionė ir premium SaaS

**Projektas:** DI Vaizdo Generatorius (Spinoff Nr. 5)  
**Pagrindinė nuoroda:** [Promptų anatomija](http://promptanatomy.app/) · info@promptanatomy.app  
**Data:** 2026-03  
**Fokusas:** Vartotojo kelionė, kodas vs patirtis, neatitikimai, premium SaaS standartas.

---

## 1. Vartotojo kelionė (as-is)

| Žingsnis | Kas vyksta | Kas trikdo / neaišku |
|----------|------------|----------------------|
| **Įėjimas** | Hero + 4 žingsnių juosta (1–2–3–4) | Hero per didelis; pirmas ekranas be „darbinės zonos“. |
| **1. Sukurk promptą** | Mini generatorius: šablonai + laukai → live preview → KOPIJUOTI | „Eiti prie mini prompto“ viršuje – scroll į preview, ne copy; vartotojas gali manyti, kad tai copy. |
| **2. Šablonai** | Collapsible, 4 promptai, copy mygtukas | Uždaroma/atidaroma; nėra aiškios būsenos „ką jau naudojau“. |
| **3. Generuok vaizdą** | Pasirinkti įrankį → vienas CTA „Kopijuoti + atidaryti“ | **Rizika:** vienas paspaudimas = copy + new tab. Vartotojas negali „tik pasirinkti“ arba „tik kopijuoti“. |
| **4. Pro režimas** | Collapsible, daug laukų, „Stiprumas X/7“, copy | „Stiprumas“ neaiškus; trūksta completion (0/3 užpildyta) per sekcijas. |

---

## 2. Kodas vs patirtis – neatitikimai

| Vieta | Kodas / tekstas | Patirtis / problema |
|-------|------------------|---------------------|
| **Sticky nav mygtukas** | `#stickyCopyBtn` tekstas: „Eiti prie mini prompto“ | Veikia kaip scroll į sekciją, ne copy. Jei vartotojas nori copy – jis eina į mini sekciją. **Rekomendacija:** vienas „Copy“ prie preview arba sticky mygtukas tik scroll + tooltip „Pereiti prie prompto“. |
| **Žingsniai 1–4** | `header-step` su `is-active` (scroll) | Būsena tik „kur matau“, ne „ką jau padariau“. Nėra ✅ / ⚠ / completion. |
| **Tools CTA** | Vienas mygtukas: copy + open URL | Premium = kontrolė: pirmas click – pasirinkti įrankį, antras – „Kopijuoti + atidaryti“. Dabar abu vienu metu. |
| **Spin-off / nuorodos** | Kode: „Spin-off Nr. 4“, `ditreneris.github.io/anatomija` | **Atnaujinti:** Nr. **5**, pagrindinė nuoroda **http://promptanatomy.app/** ir **info@promptanatomy.app** visur, kur brandinama „Promptų anatomija“. |
| **Aktyvus promptas** | `stickyCopyMeta`: „Aktyvus promptas: Mini“ | OK, bet kartu su „Eiti prie mini prompto“ kyla painiava: ar kopijuoju, ar scrollinu. |

---

## 3. Kas trikdo (prioritetas)

1. **Hero per aukštas** – pirmas ekranas be inputų; vartotojas scrollina ieškodamas veiksmo.  
   → Sumažinti hero aukštį ~25–35 % arba į pirmą ekraną įtraukti „Pradėk nuo šablono“ + pirmą lauką.

2. **CTA hierarchija** – „Pradėti kurti“ ir „Paruošti šablonai“ abu atrodo svarbūs.  
   → Vienas primary (pvz. „Sukurti promptą“), kiti secondary/outline.

3. **„Kopijuoti“ skirtingose vietose** – mini output, šablonai, sticky, tools. Neaišku, *ką* kopijuoju (final prompt vs šablonas).  
   → Vienas aiškus „Copy“ prie aktyvaus prompto; sticky gali būti „Pereiti prie prompto“ (scroll).

4. **Generatorių pasirinkimas** – vienas click = copy + new tab.  
   → Two-step: pasirinkimas → atskiras CTA „Kopijuoti + atidaryti“ (jau yra, bet enabled tik po pasirinkimo – gerai; patikslinant tekstą „2. Spausk žemiau – nukopijuosime ir atidarysime“).

5. **Completion / progresas** – nėra „Kampanijos kontekstas 0/3“, „Vizualo esmė 1/2“.  
   → Įvesti completion indikatorius ir žingsnių būsenas (✅ atlikta / ⚠ trūksta).

---

## 4. Premium SaaS – low-hanging fruits

- **Vienas aukso kelias:** Šablonas → Laukai → Preview → Copy → Pasirink generatorių → Atidaryti.
- **Mygtukų sistema:** Primary (fill), Secondary (outline), Tertiary (ghost). „KOPIJUOTI PROMPTĄ“ – vienodas stilius + mikro-feedback („Nukopijuota ✅“ / toast).
- **Completion:** Sekcijose (ypač Pro) – „0/3 užpildyta“, „1/2“; žingsnių juostoje – būsenos.
- **Sticky copy:** Arba tik scroll į preview, arba vienas sticky „Copy“ su meta „Aktyvus: Mini“ – bet ne abu vardu „copy“.
- **Badge sistema:** Nuoseklūs tipai (info / success / warning / premium), ne atsitiktinės spalvos.

---

## 5. Branding – ką atnaujinti (Spinoff Nr. 5, promptanatomy.app)

- **Spin-off numeris:** Visur **Nr. 4 → Nr. 5** (hero badge, footer, generator.js, build-locale-pages.js, lt/, en/, privatumas, privacy).
- **Promptų anatomija nuoroda:** `https://ditreneris.github.io/anatomija/` → **http://promptanatomy.app/** (arba https, jei SSL).
- **Kontaktas:** Kur reikia (footer, privatumas, „Daugiau“) – pridėti **info@promptanatomy.app**.

Po atnaujinimo: build `npm run build`, kad lt/ ir en/ gautų naują turinį.

---

## 6. Santrauka

| Kryptis | Veiksmas |
|---------|----------|
| **Kelionė** | Sumažinti hero, vienas primary CTA, aiškus „Copy“ vienoje vietoje, tools: two-step (pasirinkti → tada copy+open). |
| **Neatitikimai** | Sticky mygtukas = „Pereiti prie prompto“ (scroll), ne „Copy“; Spin-off 5 + promptanatomy.app + email visur. |
| **Premium** | Completion (0/3, 1/2), vienoda mygtukų hierarchija, badge sistema, mikro-feedback po copy. |

Šis dokumentas gali būti naudojamas kaip pagrindas tolesniam UI/UX darbui (AGENTS.md – UI/UX Agent) ir release notes (CHANGELOG).

---

## 7. Įgyvendinta (2026-03)

Pagal šio audito ir plano [UI UX tobulinimų planas] įgyvendinta:

| Punktas | Kas padaryta |
|--------|----------------|
| **Hero mažinimas** | Sumažintas `.header` padding (22px 24px), margin-bottom, header-badges/steps/cta tarpai; responsive (768px, 480px) – mažesnis hero. |
| **CTA hierarchija** | `.cta-button-outline` vizualiai secondary: transparent background, mažesnis padding/font, border-only. |
| **Sticky nav** | Mygtuko tekstas pakeistas į „Pereiti prie prompto“ / „Go to prompt“; aria – scroll semantika („į viršų“ / „Scroll to the active…“). Root, lt/, en/, build-locale-pages.js atnaujinti. |
| **Tools two-step** | `defaultHint` ir `sectionText` (LT/EN) – aiškus „1. Pasirinkite įrankį aukščiau. 2. Spauskite žemiau – nukopijuosime ir atidarysime.“ |
| **Pro completion X/Y** | `updateStepCompletion()` rodo „X/Y užpildyta“, „Paruošta (X/Y)“; pridėtas `stepFilledLabel`, `meterLabel`. Quality meter: „Užpildyta: X/7 – [lygis]“. |
| **Mygtukų / copy feedback** | Copy success tekstas „Nukopijuota ✓“ / „Copied ✓“; CSS komentaras primary copy CTA vienodumui. |
| **Badge sistema** | `:root` – semantiniai tokenai `--badge-info-bg/text`, `--badge-success-*`, `--badge-warning-*`, `--badge-premium-*`. `.pill--*` ir `.step-status.is-partial|.is-complete` naudoja tokenus; `.tool-card-badge` naudoja `--accent-gold`. |
