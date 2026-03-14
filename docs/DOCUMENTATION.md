# Dokumentų valdymas

**Tikslas:** kad repozitorijoje liktų tik aktuali, trumpa dokumentacija, o „legacy“ versijos būtų aiškiai atskirtos archyve.

## Greita schema

| Sritis | Dokumentas | Kam skirta |
|--------|------------|------------|
| **Apžvalga** | `README.md` | Kas tai per projektas, struktūra, skriptai, kaip naudoti |
| **Užduotys** | `todo.md`, `roadmap.md` | Kas daroma dabar ir kas vėliau |
| **Deploy** | `DEPLOYMENT.md` | GitHub Pages (GitHub Actions), production: [vaizdas](https://github.com/DITreneris/vaizdas) |
| **Cold deploy** | `COLD_DEPLOY.md` | Pirmas deploy į švarų repo (vaizdas), skriptas scripts/cold-deploy.sh |
| **Versijos** | `CHANGELOG.md` | Pakeitimų istorija (SemVer) |
| **Kokybė** | `docs/QA_STANDARTAS.md` | `npm test`, lint:html (6 puslapių), lint:js, pa11y |
| **Testavimas** | `docs/TESTAVIMAS.md` | Gyvas testavimas po deploy |

## Archyvas

- `docs/archive/` – sena / nebeaktuali medžiaga (ankstesni projektai, konceptai, auditai).
  - Ten laikome „kad neprapultų“, bet **nebesiremiame** kasdieniam darbui.
