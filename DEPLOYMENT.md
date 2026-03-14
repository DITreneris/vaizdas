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
2. Push į `main` automatiškai paleidžia workflow `.github/workflows/deploy.yml`:
   - job **test**: `npm test` (build + structure testai + lint:html + lint:js)
   - job **deploy**: build, upload-pages-artifact, deploy-pages
   - Runner naudoja **Node 24** ir `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` (žr. workflow)

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
| Pages rodo 404 | Repo **Settings → Pages** → Source: **GitHub Actions**. Jei deploy 404: [vaizdas/settings/pages](https://github.com/DITreneris/vaizdas/settings/pages). |
| Deploy 404 „Creating Pages deployment failed“ | Pages dar neįjungtas šiam repo. Įjunk **Settings → Pages → Source: GitHub Actions**, tada per paleisk workflow. |
| Nepraeina deploy | Actions → atidaryti run → pirmiausia sutaisyti `npm test` (struktūra, lint:html, lint:js). |
