# Micro UX audit: collapsible „išskleisti“ disorientacija

**Data:** 2026-03  
**Problema:** Paspaudus išskleisti (Šablonai / Generuok vaizdą / Pro režimas) turinys labai greitai „iššoka“ ir vartotojas nelabai supranta, kaip čia atsidūrę.

---

## 1. Diagnozė

| Vieta | Elgsena | Problema |
|------|---------|----------|
| **copy.js** `setAccordionItem()` | `body.hidden = !isOpen` – momentinis rodymas/slėpimas | Jokios animacijos – turinys „pops in“. |
| **copy.js** `openOnly()` | Atidaro sekciją, bet **nescrollina** | Kai vartotojas paspaudžia ant sekcijos antraštės (collapsible toggle), atsidariusio turinio nematyti arba layoutas staigiai peršoka – neaišku, kas atsidarė. |
| Hero nuorodos (1–4 žingsniai) | `openOnly()` + `scrollIntoView({ behavior: 'smooth' })` | Čia scroll yra – vartotojas orientuojasi. |
| Generator.js CTA („Perkelti į Pro“, „Pasirink generatorių“) | `openAccordionSection()` + savo `scrollIntoView()` | Scroll yra – OK. |
| Tiesioginis toggle mygtuko paspaudimas | Tik `openOnly()` | **Scroll nėra** – disorientacija. |

**Išvada:** Disorientaciją sukelia 1) momentinis atsidarymas be animacijos, 2) nes scrollinant į atidarytą sekciją, vartotojas nemato ryšio „paspaudžiau – atsidaro tai“.

---

## 2. Sprendimų planas

| # | Veiksmas | Tikslas |
|---|----------|--------|
| 1 | **Scroll į atidarytą sekciją** – kai atsidaro sekcija (toggle click), po atidarymo švelniai scrollinti į tą sekciją (`scrollIntoView({ behavior: 'smooth', block: 'start' })`). | Vartotojas mato: „čia atsidarė“ – aiški erdvinė nuoroda. |
| 2 | **Trumpa atidarymo animacija** – collapsible body naudoti su `transition` (opacity arba max-height), kad turinys nebe„šoktų“ vienu kadru. | Sumažina „labai greitai iššoka“ pojūtį. |
| 3 | (Pasirinktinai) **Focus** – atidarius sekciją, perkelti focus į pirmą interaktyvų elementą jos viduje (a11y). | Geriau klaviatūrai ir ekrano skaitytuvams. |

---

## 3. Įgyvendinimas

- **copy.js:** `openOnly()` – po atidarymo (kai `foundOpen && targetId`) vienu `requestAnimationFrame` arba `setTimeout(..., 0)` išsikviesti `document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' })`.
- **style.css:** Collapsible body – pridėti trumpą `transition` (pvz. opacity 0.15–0.25 s) atidarymo metu; jei reikia, naudoti helper klasę, kuri nustatoma prieš pašalinant `hidden`, kad animacija būtų matoma.
- **Build:** `lt/`, `en/` generuojami iš `index.html` – pakanka keisti šaltinį; build-locale-pages perrašo `lt/`, `en/`.

---

## 4. Rezultatas

- Paspaudus „Šablonai“ / „Generuok vaizdą“ / „Pro režimas“ atsidaro atitinkama sekcija, puslapis švelniai scrollina į ją, turinys gali atsirasti su trumpa animacija – vartotojas supranta, kur atsidūrė ir kas atsidarė.
