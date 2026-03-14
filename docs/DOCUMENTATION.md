# Dokumentų valdymas

**Tikslas:** kad repozitorijoje liktų tik aktuali, trumpa dokumentacija, o „legacy“ versijos būtų aiškiai atskirtos archyve.

## Greita schema

| Sritis | Dokumentas | Kam skirta |
|--------|------------|------------|
| **Apžvalga** | `README.md` | Kas tai per projektas ir kaip naudoti |
| **Užduotys** | `todo.md`, `roadmap.md` | Kas daroma dabar ir kas vėliau |
| **Deploy** | `DEPLOYMENT.md` | Kaip deploy’inti į GitHub Pages |
| **Versijos** | `CHANGELOG.md` | Pakeitimų istorija (SemVer) |
| **Kokybė** | `docs/QA_STANDARTAS.md` | `npm test`, pa11y, kriterijai |
| **Testavimas** | `docs/TESTAVIMAS.md` | Gyvas testavimas po deploy |

## Archyvas

- `docs/archive/` – sena / nebeaktuali medžiaga (ankstesni projektai, konceptai, auditai).
  - Ten laikome „kad neprapultų“, bet **nebesiremiame** kasdieniam darbui.
