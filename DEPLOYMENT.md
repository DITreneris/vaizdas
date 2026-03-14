# Deployment – DI Vaizdo Generatorius

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

**Production repo:** [DITreneris/vaizdas](https://github.com/DITreneris/vaizdas) → **https://ditreneris.github.io/vaizdas/**

## Cold deploy (pirmas deploy į švarų repo)

Žr. **[COLD_DEPLOY.md](COLD_DEPLOY.md)** – žingsniai ir skriptas `scripts/cold-deploy.sh` push į vaizdas.

## Production URL

- GitHub Pages URL priklauso nuo repo pavadinimo: `https://<org-or-username>.github.io/<repo-name>/`
- Vaizdas: `https://ditreneris.github.io/vaizdas/`

## GitHub Pages (GitHub Actions)

1. Repo Settings → Pages → **Build and deployment** → Source: **GitHub Actions**
2. Push į `main` automatiškai paleidžia:
   - build (`npm run build`)
   - testus (`npm test`)
   - deploy į GitHub Pages (žr. `.github/workflows/deploy.yml`)

## Prieš deploy (lokaliai)

```bash
npm install
npm run build
npm test
```

Pasirinktinai a11y:

```bash
npx serve -s . -l 3000
# Kitoje terminale:
npx pa11y http://localhost:3000/ --config .pa11yrc.json
npx pa11y http://localhost:3000/lt/ --config .pa11yrc.json
npx pa11y http://localhost:3000/en/ --config .pa11yrc.json
npx pa11y http://localhost:3000/privatumas.html --config .pa11yrc.json
npx pa11y http://localhost:3000/lt/privatumas.html --config .pa11yrc.json
npx pa11y http://localhost:3000/en/privacy.html --config .pa11yrc.json
```

## Locale build

- `npm run build` generuoja:
  - `lt/index.html`
  - `en/index.html`
  - `lt/privatumas.html`
  - `en/privacy.html`
- GitHub Actions perduoda `BASE_PATH=/<repo-name>`, todėl canonical ir locale nuorodos veikia GitHub Pages project site režime.
- GitHub Actions taip pat perduoda `SITE_ORIGIN=https://<owner>.github.io`, todėl sugeneruoti locale puslapiai turi pilnus absolute canonical / hreflang URL.
- Struktūriniai testai tikrina build artifact kokybę: EN first-paint, aktyvios kalbos būseną, active prompt source modelį ir recommended tool preselect būseną.

## Po deploy

- Gyvas testavimas: `docs/TESTAVIMAS.md`

## Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| Pages rodo 404 | Patikrinti, ar Pages šaltinis = **GitHub Actions**. |
| Nepraeina deploy | Actions → atidaryti run → pirmiausia sutaisyti `npm test`. |
