# Gyvo testavimo dokumentacija – DI Vaizdo Generatorius

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)  
**Deploy:** `DEPLOYMENT.md`

## 1. Testavimo aplinka

| Laukas | Reikšmė |
|--------|--------|
| Production URL | `https://<org-or-username>.github.io/<repo-name>/` |
| Naršyklė(ės) | Chrome, Firefox, Edge (pasirinktinai: Safari) |
| Mobilus | Chrome Mobile / iOS Safari (pasirinktinai) |

## 2. Scenarijai (checklist)

### Funkcionalumas

- [ ] **Mini generatorius:** preset’ai veikia, `MiniGenOutput` atsinaujina, „KOPIJUOTI PROMPTĄ“ kopijuoja tekstą.
- [ ] **Šablonai:** kiekvieno šablono „Kopijuoti promptą“ kopijuoja teisingą `<pre>` tekstą.
- [ ] **Viršutinis mygtukas:** „Kopijuoti promptą“ (sticky) veikia.
- [ ] **Dark mode:** perjungimas veikia, kontrastas OK, focus-visible matomas.
- [ ] **Privatumas:** nuoroda į `privatumas.html` veikia; turinys atsidaro.

### Prieinamumas (a11y)

- [ ] Tab navigacija per pagrindinius elementus (CTA, generatorius, kopijavimas) be įstrigimo.
- [ ] Klaviatūra: Enter/Space ant interaktyvių elementų veikia.

### Responsive

- [ ] 320–375px: nėra horizontal scroll (išskyrus code-block, jei ilga eilutė).
- [ ] Touch target’ai: pagrindiniai mygtukai patogūs spausti.

### Kiti

- [ ] Nėra console klaidų po kelių kopijavimų.

## 3. Testavimo žurnalas

```markdown
## YYYY-MM-DD – po deploy

- **URL:** https://...
- **Naršyklė:** ...
- **Rezultatas:** ✅ OK | ⚠️ problema: ...
```
