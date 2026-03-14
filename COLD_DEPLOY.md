# Cold deploy į švarų repozitoriją (vaizdas)

Šis dokumentas aprašo pirmą kartą (cold) deploy į tuščią GitHub repozitoriją [DITreneris/vaizdas](https://github.com/DITreneris/vaizdas).

## Tikslas

- Nukopijuoti visą projekto kodo bazę į `https://github.com/DITreneris/vaizdas`
- Po push – GitHub Actions automatiškai paleis testus ir deploy į GitHub Pages
- Production URL bus: **https://ditreneris.github.io/vaizdas/**

---

## 1. Prieš deploy (lokaliai)

Įsitikink, kad projektas build'inasi ir testai praeina:

```bash
npm install
npm run build
npm test
```

Jei viskas OK – galima daryti push.

---

## 2. Cold deploy – pridėti remote ir push

**Variantas A: dabartinis repo lieka kaip `origin`, vaizdas – kaip antras remote**

```bash
# Pridėti naują remote
git remote add vaizdas https://github.com/DITreneris/vaizdas.git

# Siųsti main į vaizdas (pirmas push)
git push -u vaizdas main
```

**Variantas B: visiškai perjungti į vaizdas kaip vienintelį origin (švarus deploy)**

```bash
# Pašalinti seną origin (jei nori tik vaizdas)
git remote remove origin

# Pridėti vaizdas kaip origin
git remote add origin https://github.com/DITreneris/vaizdas.git

# Pirmas push
git push -u origin main
```

**Variantas C: švarus istorija – tik šakos main turinys, be kitų šakų/istorijos**

Jei nori į tuščią repo įkelti tik `main` turinį be senos istorijos:

```bash
# Sukurti laikiną švarų clone (naujas katalogas)
git clone --single-branch --branch main . ../vaizdas-deploy
cd ../vaizdas-deploy

# Pakeisti origin į vaizdas
git remote remove origin
git remote add origin https://github.com/DITreneris/vaizdas.git

# Push
git push -u origin main
```

---

## 3. GitHub nustatymai po pirmo push

1. Eiti į **https://github.com/DITreneris/vaizdas** → **Settings** → **Pages**
2. **Build and deployment** → **Source**: pasirinkti **GitHub Actions**
3. Po to kiekvienas push į `main` paleis workflow iš `.github/workflows/deploy.yml` ir atidėliojas svetainę

---

## 4. Patikrinimas po deploy

- Svetainė: https://ditreneris.github.io/vaizdas/
- LT: https://ditreneris.github.io/vaizdas/lt/
- EN: https://ditreneris.github.io/vaizdas/en/
- Actions: https://github.com/DITreneris/vaizdas/actions

---

## 5. Vėlesni deploy (ne cold)

Kai repo jau turi `main` ir Pages įjungtas:

```bash
git push vaizdas main
# arba, jei vaizdas = origin:
git push origin main
```

---

## Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| `remote origin already exists` | Naudok `git remote add vaizdas ...` (Variantas A) arba `git remote set-url origin https://github.com/DITreneris/vaizdas.git` |
| Push atmeta (permission) | Reikia write teisės į DITreneris/vaizdas; patikrink GitHub token / SSH |
| Pages 404 | Settings → Pages → Source = **GitHub Actions** |
| Build klaida CI | Atidaryk Actions → paskutinis run → žiūrėk, kur nepraėjo `npm test` arba `npm run build` |
