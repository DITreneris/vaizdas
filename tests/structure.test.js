/**
 * Struktūriniai testai – index.html
 * Tikrina root šabloną, LT/EN build puslapius ir privatumo puslapius.
 * Paleisti: npm run build && node tests/structure.test.js (arba npm test)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const PRIVATUMAS_PATH = path.join(__dirname, '..', 'privatumas.html');
const LT_INDEX_PATH = path.join(__dirname, '..', 'lt', 'index.html');
const EN_INDEX_PATH = path.join(__dirname, '..', 'en', 'index.html');
const LT_PRIVACY_PATH = path.join(__dirname, '..', 'lt', 'privatumas.html');
const EN_PRIVACY_PATH = path.join(__dirname, '..', 'en', 'privacy.html');
const STYLE_PATH = path.join(__dirname, '..', 'style.css');
const GENERATOR_PATH = path.join(__dirname, '..', 'generator.js');
const COPY_PATH = path.join(__dirname, '..', 'copy.js');

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ${message}`);
    return false;
  }
  console.log(`✅ ${message}`);
  return true;
}

function expectIncludes(content, fragment, message, counters) {
  if (assert(content.includes(fragment), message)) counters.passed++;
  else counters.failed++;
}

function expectExcludes(content, fragment, message, counters) {
  if (assert(!content.includes(fragment), message)) counters.passed++;
  else counters.failed++;
}

function run() {
  const counters = { passed: 0, failed: 0 };

  const html = readFile(INDEX_PATH);
  if (!html) {
    console.error('❌ index.html nerastas:', INDEX_PATH);
    process.exit(1);
  }

  // --- Root šablonas / pagrindinė struktūra ---
  for (let i = 1; i <= 4; i++) {
    expectIncludes(html, `id="prompt${i}"`, `Prompt ${i} ID (prompt${i}) egzistuoja`, counters);
  }
  for (let i = 1; i <= 4; i++) {
    expectIncludes(html, `id="block${i}"`, `Anchor block${i} egzistuoja`, counters);
  }

  const copyButtons = (html.match(/Kopijuoti promptą/g) || []).length;
  if (assert(copyButtons >= 4, `Kopijuoti promptą mygtukų: ${copyButtons} (>= 4)`)) counters.passed++;
  else counters.failed++;

  const codeBlocks = (html.match(/class="[^"]*code-block[^"]*"/g) || []).length;
  if (assert(codeBlocks >= 4, `Code-block elementų: ${codeBlocks} (>= 4)`)) counters.passed++;
  else counters.failed++;

  expectIncludes(html, 'id="miniGenerator"', 'Mini generatorius (miniGenerator) egzistuoja', counters);
  expectIncludes(html, 'id="miniGenOutput"', 'Mini generatoriaus output (miniGenOutput) egzistuoja', counters);
  expectIncludes(html, 'id="miniToToolsBtn"', 'Mini generatoriaus CTA į įrankius egzistuoja', counters);
  expectIncludes(html, 'id="miniToProBtn"', 'Mini generatoriaus CTA į Pro režimą egzistuoja', counters);
  expectIncludes(html, 'id="langLtBtn"', 'LT mygtukas navigacijoje egzistuoja', counters);
  expectIncludes(html, 'id="langEnBtn"', 'EN mygtukas navigacijoje egzistuoja', counters);
  expectIncludes(html, 'name="description"', 'Meta description egzistuoja', counters);
  expectIncludes(html, 'rel="canonical"', 'Canonical link egzistuoja', counters);
  expectIncludes(html, 'hreflang="en"', 'EN hreflang egzistuoja', counters);
  expectIncludes(html, 'href="./lt/"', 'Root HTML canonical/hreflang rodo į LT build', counters);
  expectIncludes(html, 'href="./en/"', 'Root HTML hreflang rodo į EN build', counters);

  expectIncludes(html, 'id="mini-object"', 'Mini gen laukas: mini-object', counters);
  expectIncludes(html, 'id="mini-style"', 'Mini gen laukas: mini-style', counters);
  expectIncludes(html, 'id="mini-lighting"', 'Mini gen laukas: mini-lighting', counters);
  expectIncludes(html, 'id="mini-platform"', 'Mini gen laukas: mini-platform', counters);
  expectIncludes(html, 'id="mini-color"', 'Mini gen laukas: mini-color', counters);

  const presetBtns = (html.match(/class="[^"]*mini-gen-preset-btn[^"]*"/g) || []).length;
  if (assert(presetBtns >= 4, `Mini gen preset mygtukai: ${presetBtns} (>= 4)`)) counters.passed++;
  else counters.failed++;

  expectIncludes(html, 'id="fullGenerator"', 'Pilnas generatorius (fullGenerator) egzistuoja', counters);
  expectIncludes(html, 'id="fullGenToggle"', 'Pilno generatoriaus toggle (fullGenToggle) egzistuoja', counters);

  if (assert(html.includes('href="#main-content"') && html.includes('skip-link'), 'Skip link į main-content')) counters.passed++;
  else counters.failed++;
  if (assert(html.includes('id="main-content"') && html.includes('<main'), 'Main region (main-content)')) counters.passed++;
  else counters.failed++;
  if (assert(html.includes('id="toast"') && html.includes('role="status"'), 'Toast pranešimas')) counters.passed++;
  else counters.failed++;
  if (assert(html.includes('privatumas.html'), 'Nuoroda į privatumas.html')) counters.passed++;
  else counters.failed++;

  if (assert(html.includes('copyPrompt') && html.includes('selectText'), 'Kopijavimo funkcijos naudojamos HTML')) counters.passed++;
  else counters.failed++;
  const generatorFile = readFile(GENERATOR_PATH);
  if (assert(generatorFile && generatorFile.includes('localStorage'), 'localStorage naudojamas (generator.js)')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile && generatorFile.includes('di_generator_locale_v1'), 'Locale key egzistuoja (generator.js)')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile && generatorFile.includes('activePromptSource'), 'Generatorius naudoja explicit activePromptSource modelį')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile && generatorFile.includes('getActivePromptText'), 'Generatorius turi vieną aktyvaus prompto getterį')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile && generatorFile.includes("copyText(getActivePromptText())"), 'Sticky/tools copy naudoja aktyvaus prompto getterį')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile && generatorFile.includes("setActivePromptSource('mini', false)") && generatorFile.includes("setActivePromptSource('full', false)"), 'Generatorius aiškiai perjungia activePromptSource pagal mini/full veiksmus')) counters.passed++;
  else counters.failed++;
  if (assert(html.includes('hiddenTextarea'), 'Fallback textarea kopijavimui')) counters.passed++;
  else counters.failed++;

  const privatumas = readFile(PRIVATUMAS_PATH);
  if (assert(privatumas !== null && privatumas.length > 0, 'privatumas.html egzistuoja')) counters.passed++;
  else counters.failed++;

  if (assert(html.includes('lang="lt"'), 'Root HTML lang="lt"')) counters.passed++;
  else counters.failed++;

  expectIncludes(html, 'href="style.css"', 'Link į style.css', counters);
  expectIncludes(html, 'src="generator.js"', 'Script src generator.js', counters);
  expectIncludes(html, 'src="copy.js"', 'Script src copy.js', counters);

  const styleFile = readFile(STYLE_PATH);
  if (assert(styleFile !== null && styleFile.length > 0, 'style.css failas egzistuoja')) counters.passed++;
  else counters.failed++;
  if (assert(generatorFile !== null && generatorFile.length > 0, 'generator.js failas egzistuoja')) counters.passed++;
  else counters.failed++;
  const copyFile = readFile(COPY_PATH);
  if (assert(copyFile !== null && copyFile.length > 0, 'copy.js failas egzistuoja')) counters.passed++;
  else counters.failed++;

  expectIncludes(html, 'id="generator"', 'Generator sekcija egzistuoja', counters);

  // --- Sugeneruoti LT/EN puslapiai ---
  const ltHtml = readFile(LT_INDEX_PATH);
  const enHtml = readFile(EN_INDEX_PATH);
  const ltPrivacy = readFile(LT_PRIVACY_PATH);
  const enPrivacy = readFile(EN_PRIVACY_PATH);

  if (assert(ltHtml !== null && ltHtml.length > 0, 'lt/index.html egzistuoja')) counters.passed++;
  else counters.failed++;
  if (assert(enHtml !== null && enHtml.length > 0, 'en/index.html egzistuoja')) counters.passed++;
  else counters.failed++;
  if (assert(ltPrivacy !== null && ltPrivacy.length > 0, 'lt/privatumas.html egzistuoja')) counters.passed++;
  else counters.failed++;
  if (assert(enPrivacy !== null && enPrivacy.length > 0, 'en/privacy.html egzistuoja')) counters.passed++;
  else counters.failed++;

  if (ltHtml) {
    expectIncludes(ltHtml, 'lang="lt"', 'LT build puslapis turi lang="lt"', counters);
    expectIncludes(ltHtml, 'href="../style.css"', 'LT build naudoja santykinį style.css kelią', counters);
    expectIncludes(ltHtml, 'src="../generator.js"', 'LT build naudoja santykinį generator.js kelią', counters);
    expectIncludes(ltHtml, 'href="privatumas.html"', 'LT build privatumo nuoroda veda į locale failą', counters);
    expectIncludes(ltHtml, 'aria-pressed="true">LT<', 'LT build aktyvi LT kalba first-paint metu', counters);
    expectIncludes(ltHtml, 'Aktyvus promptas: Mini', 'LT build sticky copy rodo mini source first-paint metu', counters);
    expectIncludes(ltHtml, 'tool-card tool-card-recommended is-selected', 'LT build recommended tool yra preselected first-paint metu', counters);
  }

  if (enHtml) {
    expectIncludes(enHtml, 'lang="en"', 'EN build puslapis turi lang="en"', counters);
    expectIncludes(enHtml, 'href="../style.css"', 'EN build naudoja santykinį style.css kelią', counters);
    expectIncludes(enHtml, 'src="../generator.js"', 'EN build naudoja santykinį generator.js kelią', counters);
    expectIncludes(enHtml, 'href="privacy.html"', 'EN build privatumo nuoroda veda į locale failą', counters);
    expectIncludes(enHtml, 'aria-pressed="true">EN<', 'EN build aktyvi EN kalba first-paint metu', counters);
    expectIncludes(enHtml, 'Active prompt: Mini', 'EN build sticky copy rodo mini source first-paint metu', counters);
    expectIncludes(enHtml, 'Go to prompt', 'EN build sticky CTA yra kontekstinis ir anglų kalba', counters);
    expectIncludes(enHtml, 'We recommend starting with Ideogram because it handles text especially well. Active prompt: mini prompt.', 'EN build rekomenduojamas tool hint yra anglų kalba', counters);
    expectIncludes(enHtml, 'tool-card tool-card-recommended is-selected', 'EN build recommended tool yra preselected first-paint metu', counters);
    ['Pereiti prie turinio', 'Sukurk promptą', 'Šablonai', 'Generuok vaizdą', 'Privatumas'].forEach((fragment) => {
      expectExcludes(enHtml, fragment, `EN build neturi LT fragmento: ${fragment}`, counters);
    });
  }

  console.log('\n---');
  console.log(`Rezultatas: ${counters.passed} praeina, ${counters.failed} nepraeina.`);
  if (counters.failed > 0) {
    process.exit(1);
  }
  console.log('Visi struktūriniai testai praeina.\n');
}

run();
