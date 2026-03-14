const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const PRIVACY_PATH = path.join(ROOT, 'privatumas.html');
const LT_DIR = path.join(ROOT, 'lt');
const EN_DIR = path.join(ROOT, 'en');

const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || '');
const SITE_ORIGIN = process.env.SITE_ORIGIN || '';

const INDEX_LOCALES = {
  lt: {
    lang: 'lt',
    title: 'DI Vaizdo Generatorius – rinkodaros vizualų promptai',
    description: 'Sukurkite DI vaizdų promptus rinkodaros vizualams: mini generatorius, šablonų biblioteka, Pro režimas ir greitas nukopijavimas į pasirinktą įrankį.',
    canonicalPath: '/lt/'
  },
  en: {
    lang: 'en',
    title: 'AI Visual Generator – marketing image prompts',
    description: 'Create AI image prompts for marketing visuals with a mini generator, template library, Pro mode, and quick copy to your chosen tool.',
    canonicalPath: '/en/'
  }
};

const EN_REPLACEMENTS = [
  ['Pereiti prie turinio', 'Skip to content'],
  ['Greita navigacija', 'Quick navigation'],
  ['Aktyvus promptas: Mini', 'Active prompt: Mini'],
  ['Pereiti prie prompto', 'Go to prompt'],
  ['Pereiti prie aktyvaus mini prompto', 'Jump to the active mini prompt'],
  ['Kopijuoti mini promptą', 'Copy mini prompt'],
  ['Kopijuoti aktyvų mini promptą', 'Copy the active mini prompt'],
  ['Kalbos pasirinkimas', 'Language selection'],
  ['Perjungti į lietuvių kalbą', 'Switch to Lithuanian'],
  ['Perjungti tamsų režimą', 'Switch to dark mode'],
  ['Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)', 'Full Prompt Anatomy – interactive learning (opens in a new tab)'],
  ['Promptų anatomija', 'Prompt Anatomy'],
  ['DI Vaizdo Generatorius, Spin-off Nr. 5', 'AI Visual Generator, Spin-off No. 5'],
  ['Spin-off Nr. 5', 'Spin-off No. 5'],
  ['DI Vaizdo Generatorius', 'AI Visual Generator'],
  ['Sukurk profesionalius rinkodaros vizualus per minutę su DI.', 'Create professional marketing visuals with AI in under a minute.'],
  ['Proceso žingsniai', 'Process steps'],
  ['Sukurk promptą', 'Create prompt'],
  ['Šablonai', 'Templates'],
  ['Generuok vaizdą', 'Generate the image'],
  ['Pro režimas', 'Pro mode'],
  ['Pradėti kurti – interaktyvus generatorius', 'Start creating with the interactive generator'],
  ['Peržiūrėti paruoštus šablonus', 'Browse ready-made templates'],
  ['Pradėti kurti', 'Start creating'],
  ['Paruošti šablonai ↓', 'Ready-made templates ↓'],
  ['Užpildyk laukus arba pasirink šabloną – promptas generuojamas automatiškai', 'Fill in the fields or choose a template — the prompt updates automatically'],
  ['Pradėk nuo šablono', 'Start from a template'],
  ['Renginys', 'Event'],
  ['Brand kampanija', 'Brand campaign'],
  ['Kas vaizduojama (objektas)', 'What is shown (main object)'],
  ['Aprašykite objektą', 'Describe the object'],
  ['Pvz.: Prabangus rankinis laikrodis ant marmurinio stalo', 'Example: Luxury wristwatch on a marble table'],
  ['Stilius', 'Style'],
  ['Apšvietimas', 'Lighting'],
  ['Platforma', 'Platform'],
  ['Nuo platformos priklauso formato ir stiliaus rekomendacijos', 'Platform affects the suggested format and visual treatment'],
  ['Dominuojanti spalva', 'Dominant color'],
  ['Spalvos pasirinkimas', 'Color selection'],
  ['Tikroviška nuotrauka: [Objektas]. Cinematic (Kino apšvietimas), itin detalu, aukščiausia kokybė, profesionali kompozicija, platformai Instagram.', 'Realistic photo: [Object]. Cinematic lighting, highly detailed, top quality, professional composition, designed for Instagram.'],
  ['Auksinė', 'Gold'],
  ['Šilti auksiniai tonai', 'Warm golden tones'],
  ['Mėlyna', 'Blue'],
  ['Gili mėlyna', 'Deep blue'],
  ['Pastelinė', 'Pastel'],
  ['Švelni pastelinė rožinė', 'Soft pastel pink'],
  ['Koralinė', 'Coral'],
  ['Ryški koralinė', 'Vivid coral'],
  ['Žalia gamtos', 'Nature green'],
  ['Žalia', 'Green'],
  ['Violetinė', 'Violet'],
  ['Neutralūs pilki tonai', 'Neutral grey tones'],
  ['Neutrali', 'Neutral'],
  ['Arba įveskite savo spalvą', 'Or enter your own color'],
  ['Mini generatoriaus promptas', 'Mini generator prompt'],
  ['Kopijuoti mini generatoriaus promptą', 'Copy the mini generator prompt'],
  ['KOPIJUOTI PROMPTĄ', 'COPY PROMPT'],
  ['Toliau: pasirink DI generatorių arba pereik į Pro režimą, jei reikia daugiau kontrolės.', 'Next: choose an AI image tool or move to Pro mode if you need more control.'],
  ['2. Pasirink generatorių', '2. Choose a tool'],
  ['Perkelti į Pro režimą', 'Move to Pro mode'],
  ['Pasiimk paruoštą promptą ir kopijuok per 1 paspaudimą', 'Pick a ready-made prompt and copy it in one click'],
  ['4 šablonai', '4 templates'],
  ['Pažymėti promptą ', 'Select prompt '],
  ['Pažymėti', 'Select'],
  ['Produkto nuotrauka (Close-up)', 'Product shot (close-up)'],
  ['Profesionali produkto nuotrauka su studijine kokybe', 'Professional product photography with studio quality'],
  ['Tikroviška nuotrauka: [objektas, pvz.: prabangus rankinis laikrodis] ant [paviršius, pvz.: tamsaus marmurinio stalo]. Close-up, Cinematic apšvietimas su švelniu rim light iš kairės, [spalvų gama, pvz.: šilti auksiniai tonai] spalvų gama, itin detalu, aukščiausia kokybė, profesionali kompozicija, shallow depth of field, bokeh fonas, studio quality, 8K resolution.', 'Realistic product photo: [object, e.g. a luxury wristwatch] on [surface, e.g. a dark marble table]. Close-up, cinematic lighting with a soft rim light from the left, [color palette, e.g. warm golden tones], highly detailed, top quality, professional composition, shallow depth of field, bokeh background, studio quality, 8K resolution.'],
  ['Pakeisk: [objektas], [paviršius], [spalvų gama] savo duomenimis.', 'Replace: [object], [surface], [color palette] with your details.'],
  ['Kopijuoti promptą ', 'Copy prompt '],
  [' į mainų atmintinę', ' to clipboard'],
  ['Kopijuoti promptą', 'Copy prompt'],
  ['Lifestyle / atmosferos vaizdas', 'Lifestyle / atmosphere visual'],
  ['Emocinis vaizdas su žmonėmis ir atmosfera', 'Emotional visual with people and mood'],
  ['Mados žurnalo stilius: [scena, pvz.: jauna moteris kavos bare su nešiojamu kompiuteriu, šypsosi]. Auksinė valanda (Golden Hour), platus kampas, šilti tonai, natūrali poza, candid photography style, editorial fashion magazine quality, soft golden backlight, [spalvų nuotaika, pvz.: šilti rudens tonai], professional lifestyle photography, high-end advertising quality.', 'Editorial magazine style: [scene, e.g. a young woman smiling in a coffee shop with a laptop]. Golden hour lighting, wide angle, warm tones, natural pose, candid photography style, editorial fashion magazine quality, soft golden backlight, [mood colors, e.g. warm autumn tones], professional lifestyle photography, high-end advertising quality.'],
  ['Mados žurnalo stilius: [scena, pvz.: jauna moteris kavos bare su nešiojamu kompiuteriu, šypsosi]. Auksinė valanda (Golden Hour), platus kampas, šilti tonai, natūrali poza, candid photography style, editorial fashion magazine quality, soft golden backlight, [spalvų nuotaika, pvz.: šilti rudens tonai], professional lifestyle photography, high-end advertising quality.', 'Editorial magazine style: [scene, e.g. a young woman smiling in a coffee shop with a laptop]. Golden hour lighting, wide angle, warm tones, natural pose, candid photography style, editorial fashion magazine quality, soft golden backlight, [mood colors, e.g. warm autumn tones], professional lifestyle photography, high-end advertising quality.'],
  ['Pakeisk: [scena], [spalvų nuotaika] savo duomenimis.', 'Replace: [scene], [mood colors] with your details.'],
  ['Reklaminis maketas su antrašte', 'Ad layout with headline'],
  ['Vaizdas su integruotu tekstu – paruoštas reklamai', 'Visual with integrated text, ready for ads'],
  ['Reklaminis maketas su integruotu tekstu: profesionalus vaizdas su [objektas/scena]. Antraštė: "[antraštė, pvz.: Pajuskite prabangą]" ir kvietimas veikti "[CTA, pvz.: Sužinoti daugiau]". Šrifto stilius: modernus sans-serif, bold. Teksto pozicija: [centras / viršutinė dalis / apatinis trečdalis]. Reikalavimas: aukštas kontrastas tarp teksto ir fono, švari erdvė aplink tekstą skaitomumui užtikrinti, clean negative space for text overlay, professional advertising layout, premium quality.', 'Advertising layout with integrated text: professional visual featuring [object/scene]. Headline: "[headline, e.g. Experience luxury]" and call to action "[CTA, e.g. Learn more]". Font style: modern sans-serif, bold. Text position: [center / top section / bottom third]. Requirement: strong contrast between text and background, clean space around the text for readability, clean negative space for text overlay, professional advertising layout, premium quality.'],
  ['Pakeisk: [objektas/scena], [antraštė], [CTA], teksto poziciją savo duomenimis.', 'Replace: [object/scene], [headline], [CTA], and text position with your details.'],
  ['LinkedIn / Web baneris', 'LinkedIn / web banner'],
  ['Profesionalus plačiaformatis baneris', 'Professional wide-format banner'],
  ['Profesionalus LinkedIn baneris: [paslaugos/produkto tema, pvz.: technologijų startupo komandos darbas]. Formatas 1200x627 (horizontalus), profesionali atmosfera, minkšta dienos šviesa, švarūs mėlyni-pilki tonai, corporate style, clean negative space kairėje pusėje teksto overlay, modern business photography, professional LinkedIn advertising format, subtle gradient background, premium B2B visual.', 'Professional LinkedIn banner: [service/product theme, e.g. a startup team at work]. Format 1200x627 (horizontal), professional atmosphere, soft daylight, clean blue-grey tones, corporate style, clean negative space on the left for text overlay, modern business photography, professional LinkedIn advertising format, subtle gradient background, premium B2B visual.'],
  ['Pakeisk: [paslaugos/produkto tema] savo duomenimis. Web hero – pakeisk formatą į 16:9.', 'Replace: [service/product theme] with your details. For web hero, switch the format to 16:9.'],
  ['DI vaizdo generavimo įrankiai', 'AI image generation tools'],
  ['Pasirink generatorių, tada kopijuok ir atidaryk vienu mygtuku', 'Choose a tool, then copy and open it with one button'],
  ['6 įrankiai', '6 tools'],
  ['Pasirinkite generatorių', 'Choose a generator'],
  ['1. Pasirinkite įrankį aukščiau. 2. Spauskite mygtuką žemiau – nukopijuosime promptą ir atidarysime įrankį naujame skirtuke.', '1. Choose a tool above. 2. Press the button below — we will copy the prompt and open the tool in a new tab.'],
  ['Pasirinkti ', 'Choose '],
  ['Rekomenduojama', 'Recommended'],
  ['Rekomenduojame pradėti nuo Ideogram, nes jis geriausiai tvarkosi su tekstu. Aktyvus promptas: mini promptas.', 'We recommend starting with Ideogram because it handles text especially well. Active prompt: mini prompt.'],
  ['Geriausias tekstui', 'Best for text'],
  ['geriausias tekstui', 'best for text'],
  ['Maksimali kontrolė', 'Maximum control'],
  ['maksimali kontrolė', 'maximum control'],
  ['Aukščiausia kokybė', 'Top quality'],
  ['aukščiausia kokybė', 'top quality'],
  ['Greitas ir paprastas', 'Fast and simple'],
  ['greitas ir paprastas', 'fast and simple'],
  ['Komerciniam naudojimui', 'Commercial use'],
  ['komerciniam naudojimui', 'commercial use'],
  ['Dizaino integracija', 'Design workflow'],
  ['dizaino integracija', 'design workflow'],
  ['Pasirinkite įrankį aukščiau', 'Choose a tool above'],
  ['1. Pasirinkite įrankį aukščiau', '1. Choose a tool above'],
  ['Kopijuoti promptą ir atidaryti pasirinktą įrankį', 'Copy prompt and open the selected tool'],
  ['Kopijuoti promptą ir atidaryti pasirinktą įrankį', 'Copy prompt and open the selected tool'],
  ['Kopijuoti + atidaryti', 'Copy + open'],
  ['Daugiau kontrolės: papildomi parametrai ir tikslumas', 'More control: extra parameters and higher precision'],
  ['Perkelti reikšmes iš mini generatoriaus', 'Import values from mini generator'],
  ['Išvalyti', 'Reset'],
  ['Interaktyvus vaizdo promptų generatorius', 'Interactive visual prompt generator'],
  ['1. Kampanijos kontekstas', '1. Campaign context'],
  ['2. Vizualo esmė', '2. Visual core'],
  ['3. Tekstų integracija', '3. Text integration'],
  ['Nepilna', 'Incomplete'],
  ['Kampanijos tikslas', 'Campaign goal'],
  ['Aprašykite tikslą', 'Describe the goal'],
  ['Pvz.: Naujo produkto pristatymas, Sezono išpardavimas', 'Example: Launching a new product, seasonal sale'],
  ['Tikslinė platforma', 'Target platform'],
  ['Auditorija', 'Audience'],
  ['Aprašykite auditoriją', 'Describe the audience'],
  ['Pvz.: Jaunos šeimos, Gen Z, 25-40 m. profesionalai', 'Example: Young families, Gen Z, professionals aged 25-40'],
  ['Prekės ženklo tonas', 'Brand tone'],
  ['Premium (Prabangus)', 'Premium'],
  ['Bold (Drąsus)', 'Bold'],
  ['Minimalistinis', 'Minimal'],
  ['Žaismingas', 'Playful'],
  ['Ekspertiškas', 'Expert'],
  ['Kas vaizduojama (pagrindinis objektas)', 'What is shown (main object)'],
  ['Aprašykite objektą detaliai', 'Describe the object in detail'],
  ['Pvz.: Prabangus rankinis laikrodis ant tamsaus marmurinio stalo', 'Example: Luxury wristwatch on a dark marble table'],
  ['Kameros kampas', 'Camera angle'],
  ['Tikroviška nuotrauka', 'Realistic photo'],
  ['3D Renderis (Studio)', '3D render (studio)'],
  ['Kinematografinis stilius', 'Cinematic style'],
  ['Mados žurnalo stilius', 'Editorial magazine style'],
  ['Minimalistinė iliustracija', 'Minimal illustration'],
  ['Cinematic (Kino apšvietimas)', 'Cinematic lighting'],
  ['Minkšta dienos šviesa', 'Soft daylight'],
  ['Auksinė valanda (Golden Hour)', 'Golden hour'],
  ['Studijinis apšvietimas', 'Studio lighting'],
  ['Neoninis apšvietimas', 'Neon lighting'],
  ['LinkedIn Postas', 'LinkedIn post'],
  ['Facebook Reklama', 'Facebook ad'],
  ['Web Hero Baneris', 'Web hero banner'],
  ['Lauko reklama (Print)', 'Outdoor print'],
  ['Close-up (Stambus planas)', 'Close-up'],
  ['Akių lygis (Eye level)', 'Eye level'],
  ['Iš viršaus (Flatlay)', 'Flat lay'],
  ['Platus kampas (Wide angle)', 'Wide angle'],
  ['Iš apačios (Hero shot)', 'Hero shot'],
  ['Antraštė (Headline)', 'Headline'],
  ['Įveskite antraštę', 'Enter a headline'],
  ['Pvz.: Pajuskite prabangą, Nauja kolekcija jau čia', 'Example: Experience luxury, New collection is here'],
  ['Kvietimas veikti (CTA)', 'Call to action (CTA)'],
  ['Įveskite CTA', 'Enter a CTA'],
  ['Pvz.: Pirkti dabar, Sužinoti daugiau, Registruotis', 'Example: Shop now, Learn more, Sign up'],
  ['Teksto pozicija', 'Text position'],
  ['Centras', 'Center'],
  ['Viršutinė dalis', 'Top section'],
  ['Apatinis trečdalis', 'Bottom third'],
  ['Dinaminis išdėstymas', 'Dynamic layout'],
  ['Šrifto stilius', 'Typography style'],
  ['Modernus Sans-serif', 'Modern sans-serif'],
  ['Prabangus Serif', 'Premium serif'],
  ['Rankraštinis', 'Handwritten'],
  ['Sugeneruotas promptas', 'Generated prompt'],
  ['Sugeneruotas Promptas', 'Generated Prompt'],
  ['Kopijuoti sugeneruotą promptą', 'Copy generated prompt'],
  ['Stiprumas: 0/7', 'Strength: 0/7'],
  ['Užpildykite daugiau laukų – stipresnis promptas', 'Fill in more fields for a stronger prompt'],
  ['Tikroviška nuotrauka: [Objektas]. Close-up (Stambus planas), Cinematic (Kino apšvietimas), itin detalu, aukščiausia kokybė, profesionali kompozicija. Sukurta rinkodaros tikslui: reklama, skirta tikslinė auditorija platformai Instagram. Nuotaika: Premium (Prabangus).', 'Realistic photo: [Object]. Close-up, cinematic lighting, highly detailed, top quality, professional composition. Created for the marketing goal of marketing campaign, aimed at target audience on Instagram. Tone: Premium.'],
  ['Tikroviška nuotrauka: [Objektas]. Close-up (Stambus planas), Cinematic (Kino apšvietimas), itin detalu, aukščiausia kokybė, profesionali kompozicija. Sukurta rinkodaros tikslui: reklama, skirta tikslinė auditorija platformai Instagram. Nuotaika: Premium (Prabangus).', 'Realistic photo: [Object]. Close-up, cinematic lighting, highly detailed, top quality, professional composition. Created for the marketing goal of marketing campaign, aimed at target audience on Instagram. Tone: Premium.'],
  ['Simboliu:', 'Characters:'],
  ['Nukopijuokite promptą ir įklijuokite į pasirinktą DI generatorių.', 'Copy the prompt and paste it into your chosen AI image generator.'],
  ['Kopijuoti promptą ir paruošti', 'Copy prompt and prepare it'],
  ['Eksperto patarimai', 'Expert tips'],
  ['<strong>Būkite konkretūs:</strong> Vietoj „gražus automobilis" rašykite „matinis juodas visureigis miško kelyje".', '<strong>Be specific:</strong> Instead of “nice car”, write “matte black SUV on a forest road”.'],
  ['<strong>Apšvietimas = 80% nuotaikos.</strong> Visada parinkite apšvietimo tipą – tai svarbiausia vizualo dalis.', '<strong>Lighting drives the mood.</strong> Always choose a lighting style — it is often the most important visual cue.'],
  ['<strong>Teksto erdvė:</strong> Jei planuojate dėti tekstą vėliau, prompt&#39;e nurodykite „clean negative space for text overlay".', '<strong>Leave room for text:</strong> If you plan to add text later, include “clean negative space for text overlay” in the prompt.'],
  ['Vizualai sukurti.<br>Nori daugiau?', 'Visuals done.<br>Want more?'],
  ['Atidaryti Promptų anatomija WhatsApp grupę naujame lange', 'Open the Prompt Anatomy WhatsApp group in a new tab'],
  ['Prisijungti prie WhatsApp grupės', 'Join the WhatsApp group'],
  ['Promptų anatomija →', 'Prompt Anatomy →'],
  ['Kurk vizualus su DI', 'Create visuals with AI'],
  ['Pakeisk <strong>[objektas]</strong>, <strong>[aplinka]</strong>, <strong>[spalvų gama]</strong>, <strong>[antraštė]</strong> ir kitus laukus savo duomenimis.', 'Replace <strong>[object]</strong>, <strong>[environment]</strong>, <strong>[color palette]</strong>, <strong>[headline]</strong> and the other fields with your own data.'],
  ['Tai Spin-off Nr. 5 iš „<a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">Promptų anatomijos</a>". Kontaktas: <a href="mailto:info@promptanatomy.app">info@promptanatomy.app</a>', 'This is Spin-off No. 5 from <a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">Prompt Anatomy</a>. Contact: <a href="mailto:info@promptanatomy.app">info@promptanatomy.app</a>'],
  ['Tai Spin-off Nr. 4 iš „Promptų anatomijos".', 'This is Spin-off No. 4 from “Prompt Anatomy”.'],
  ['DI vizualai', 'AI visuals'],
  ['Generatorius', 'Generator'],
  ['Rinkodaros vizualai', 'Marketing visuals'],
  ['Mokymų medžiaga. Visos teisės saugomos.', 'Training material. All rights reserved.'],
  ['Privatumas', 'Privacy'],
  ['Kopijuojamo teksto laukas', 'Copy helper field'],
  ['Kopijavimo pranešimas', 'Copy notification'],
  ['Nukopijuota.', 'Copied.']
];

function normalizeBasePath(input) {
  if (!input) return '';
  let out = String(input).trim();
  if (!out.startsWith('/')) out = '/' + out;
  return out.replace(/\/+$/, '');
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function pageUrl(localePath) {
  const joined = `${BASE_PATH}${localePath}`;
  if (SITE_ORIGIN) {
    return `${SITE_ORIGIN.replace(/\/+$/, '')}${joined}`;
  }
  return joined || '/';
}

function replaceHead(html, localeConfig) {
  return html
    .replace(/<html lang="[^"]+">/, `<html lang="${localeConfig.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${localeConfig.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${localeConfig.description}">`
    )
    .replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${pageUrl(localeConfig.canonicalPath)}">`
    )
    .replace(
      /<link rel="alternate" hreflang="lt" href="[^"]*">/,
      `<link rel="alternate" hreflang="lt" href="${pageUrl('/lt/')}">`
    )
    .replace(
      /<link rel="alternate" hreflang="en" href="[^"]*">/,
      `<link rel="alternate" hreflang="en" href="${pageUrl('/en/')}">`
    )
    .replace(
      /<link rel="alternate" hreflang="x-default" href="[^"]*">/,
      `<link rel="alternate" hreflang="x-default" href="${pageUrl('/lt/')}">`
    );
}

function replaceSharedAssetPaths(html) {
  return html
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="style\.css"/g, 'href="../style.css"')
    .replace(/src="generator\.js"/g, 'src="../generator.js"')
    .replace(/src="copy\.js"/g, 'src="../copy.js"');
}

function replaceLanguageButtons(html, locale) {
  const ltButton = '<button type="button" class="top-nav-lang-btn is-active" id="langLtBtn" aria-label="Switch to Lithuanian" aria-pressed="true">LT</button>';
  const enButton = '<button type="button" class="top-nav-lang-btn" id="langEnBtn" aria-label="Switch to English" aria-pressed="false">EN</button>';
  if (locale === 'en') {
    return html
      .replace(ltButton, '<button type="button" class="top-nav-lang-btn" id="langLtBtn" aria-label="Switch to Lithuanian" aria-pressed="false">LT</button>')
      .replace(enButton, '<button type="button" class="top-nav-lang-btn is-active" id="langEnBtn" aria-label="Switch to English" aria-pressed="true">EN</button>');
  }
  return html
    .replace(ltButton, '<button type="button" class="top-nav-lang-btn is-active" id="langLtBtn" aria-label="Perjungti į lietuvių kalbą" aria-pressed="true">LT</button>')
    .replace(enButton, '<button type="button" class="top-nav-lang-btn" id="langEnBtn" aria-label="Switch to English" aria-pressed="false">EN</button>');
}

function applyExactReplacements(html, replacements) {
  let out = html;
  replacements
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([from, to]) => {
    out = out.split(from).join(to);
    });
  return out;
}

function validateEnglishBuild(html) {
  const required = [
    'AI Visual Generator',
    'Active prompt: Mini',
    'Go to prompt',
    'Choose a generator',
    'Generated Prompt',
    'Prompt Anatomy →',
    'href="privacy.html"',
    'aria-pressed="true">EN<'
  ];
  const forbidden = [
    'Pereiti prie turinio',
    'Aktyvus promptas: Mini',
    'Sukurk promptą',
    'Šablonai',
    'Generuok vaizdą',
    'Privatumas'
  ];

  required.forEach((fragment) => {
    if (!html.includes(fragment)) {
      throw new Error(`EN build missing expected fragment: ${fragment}`);
    }
  });

  forbidden.forEach((fragment) => {
    if (html.includes(fragment)) {
      throw new Error(`EN build still contains LT fragment: ${fragment}`);
    }
  });
}

function buildLocalizedIndex(locale) {
  const localeConfig = INDEX_LOCALES[locale];
  let html = read(INDEX_PATH);
  html = replaceHead(html, localeConfig);
  html = replaceSharedAssetPaths(html);
  html = html.replace(/href="privatumas\.html"/g, `href="${locale === 'lt' ? 'privatumas.html' : 'privacy.html'}"`);

  if (locale === 'en') {
    html = applyExactReplacements(html, EN_REPLACEMENTS);
    html = replaceLanguageButtons(html, 'en');
    validateEnglishBuild(html);
    return html;
  }

  html = replaceLanguageButtons(html, 'lt');
  return html;
}

function buildLocalizedPrivacy(locale) {
  let html = read(PRIVACY_PATH);
  html = html.replace(/href="favicon\.svg"/g, 'href="../favicon.svg"');

  if (locale === 'lt') {
    html = html
      .replace(/<html lang="[^"]+">/, '<html lang="lt">')
      .replace(/<title>[\s\S]*?<\/title>/, '<title>Privatumo politika – DI Vaizdo Generatorius</title>')
      .replace(/href="index\.html"/g, 'href="index.html"');
    return html;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy policy – AI Visual Generator</title>
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #F7F8FA; color: #1A202C; line-height: 1.6; padding: 24px; max-width: 720px; margin: 0 auto; }
        h1 { font-size: 1.75rem; margin-bottom: 1rem; }
        h2 { font-size: 1.15rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        p, ul { margin-bottom: 0.75rem; }
        ul { margin-left: 1.5rem; }
        a { color: #1E3A5F; }
        .back { display: inline-block; margin-bottom: 1.5rem; padding: 10px 20px; background: #1E3A5F; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; min-height: 44px; min-width: 44px; line-height: 24px; }
        .back:hover { background: #162D4A; }
        .back:focus-visible { outline: 3px solid #1E3A5F; outline-offset: 2px; }
    </style>
</head>
<body>
    <a href="index.html" class="back">&larr; Back to generator</a>
    <h1>Privacy policy</h1>
    <p><strong>AI Visual Generator</strong> (Spin-off No. 5 – marketing visual prompt system) is a minimal app. Here is a quick overview of your data.</p>

    <h2>Do we collect your data?</h2>
    <p><strong>No.</strong> At the moment, we do not collect any personal data. There is no form submission, email capture, or data sent to servers.</p>

    <h2>What stays on your device?</h2>
    <p>Only browser <strong>localStorage</strong> is used: your selected theme, chosen language, last open section, active generator state, and selected tool can be saved locally in your browser. The data stays on your device only.</p>

    <h2>If a form is added later</h2>
    <p>If we later add a contact form or similar feature, this privacy policy will be updated clearly to explain what is collected and how it is used.</p>

    <p style="margin-top: 2rem;"><a href="index.html">&larr; Back to AI Visual Generator</a></p>
</body>
</html>
`;
}

write(path.join(LT_DIR, 'index.html'), buildLocalizedIndex('lt'));
write(path.join(EN_DIR, 'index.html'), buildLocalizedIndex('en'));
write(path.join(LT_DIR, 'privatumas.html'), buildLocalizedPrivacy('lt'));
write(path.join(EN_DIR, 'privacy.html'), buildLocalizedPrivacy('en'));

console.log('Generated locale pages:', ['lt/index.html', 'en/index.html', 'lt/privatumas.html', 'en/privacy.html'].join(', '));
