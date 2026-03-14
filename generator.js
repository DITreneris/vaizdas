(function () {
    'use strict';

    var THEME_KEY = 'di_generator_theme_v1';
    var LANG_KEY = 'di_generator_locale_v1';
    var APP_STATE_KEY = 'di_generator_state_v2';

    var defaultState = {
        goal: '',
        audience: '',
        platform: 'instagram',
        tone: 'premium',
        object: '',
        camera: 'closeup',
        lighting: 'cinematic',
        color: '',
        style: 'photo',
        headline: '',
        cta: '',
        textPosition: 'center',
        typography: 'sans'
    };

    var defaultMiniState = {
        object: '',
        style: 'photo',
        lighting: 'cinematic',
        platform: 'instagram',
        color: ''
    };

    var state = Object.assign({}, defaultState);
    var miniState = Object.assign({}, defaultMiniState);
    var locale = 'lt';
    var activePromptSource = 'mini';
    var selectedToolUrl = '';
    var selectedToolKey = '';
    var trackedFields = ['goal', 'audience', 'platform', 'object', 'style', 'lighting', 'color'];

    var TOOL_ORDER = ['ideogram', 'leonardo', 'midjourney', 'chatgpt', 'firefly', 'canva'];

    var TOOLS = {
        ideogram: { name: 'Ideogram', url: 'https://ideogram.ai/' },
        leonardo: { name: 'Leonardo.ai', url: 'https://leonardo.ai/' },
        midjourney: { name: 'Midjourney', url: 'https://www.midjourney.com/' },
        chatgpt: { name: 'ChatGPT / DALL-E', url: 'https://chat.openai.com/' },
        firefly: { name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
        canva: { name: 'Canva Magic', url: 'https://www.canva.com/' }
    };

    var COLOR_PRESETS = {
        gold: {
            lt: { chip: 'Auksinė', value: 'Šilti auksiniai tonai' },
            en: { chip: 'Gold', value: 'Warm golden tones' }
        },
        blue: {
            lt: { chip: 'Mėlyna', value: 'Gili mėlyna' },
            en: { chip: 'Blue', value: 'Deep blue' }
        },
        pastel: {
            lt: { chip: 'Pastelinė', value: 'Švelni pastelinė rožinė' },
            en: { chip: 'Pastel', value: 'Soft pastel pink' }
        },
        coral: {
            lt: { chip: 'Koralinė', value: 'Ryški koralinė' },
            en: { chip: 'Coral', value: 'Vivid coral' }
        },
        green: {
            lt: { chip: 'Žalia', value: 'Žalia gamtos' },
            en: { chip: 'Green', value: 'Nature green' }
        },
        violet: {
            lt: { chip: 'Violetinė', value: 'Violetinė' },
            en: { chip: 'Violet', value: 'Violet' }
        },
        neutral: {
            lt: { chip: 'Neutrali', value: 'Neutralūs pilki tonai' },
            en: { chip: 'Neutral', value: 'Neutral grey tones' }
        }
    };

    var OPTION_LABELS = {
        lt: {
            style: {
                photo: 'Tikroviška nuotrauka',
                render3d: '3D Renderis (Studio)',
                cinematic: 'Kinematografinis stilius',
                editorial: 'Mados žurnalo stilius',
                illustration: 'Minimalistinė iliustracija'
            },
            lighting: {
                cinematic: 'Cinematic (Kino apšvietimas)',
                soft_daylight: 'Minkšta dienos šviesa',
                golden_hour: 'Auksinė valanda (Golden Hour)',
                studio: 'Studijinis apšvietimas',
                neon: 'Neoninis apšvietimas'
            },
            platform: {
                instagram: 'Instagram',
                linkedin: 'LinkedIn Postas',
                facebook: 'Facebook Reklama',
                web_hero: 'Web Hero Baneris',
                print: 'Lauko reklama (Print)'
            },
            tone: {
                premium: 'Premium (Prabangus)',
                bold: 'Bold (Drąsus)',
                minimal: 'Minimalistinis',
                playful: 'Žaismingas',
                expert: 'Ekspertiškas'
            },
            camera: {
                closeup: 'Close-up (Stambus planas)',
                eye_level: 'Akių lygis (Eye level)',
                flatlay: 'Iš viršaus (Flatlay)',
                wide_angle: 'Platus kampas (Wide angle)',
                hero_shot: 'Iš apačios (Hero shot)'
            },
            textPosition: {
                center: 'Centras',
                top: 'Viršutinė dalis',
                bottom_third: 'Apatinis trečdalis',
                dynamic: 'Dinaminis išdėstymas'
            },
            typography: {
                sans: 'Modernus Sans-serif',
                serif: 'Prabangus Serif',
                minimal: 'Minimalistinis',
                script: 'Rankraštinis'
            }
        },
        en: {
            style: {
                photo: 'Realistic photo',
                render3d: '3D render (studio)',
                cinematic: 'Cinematic style',
                editorial: 'Editorial magazine style',
                illustration: 'Minimal illustration'
            },
            lighting: {
                cinematic: 'Cinematic lighting',
                soft_daylight: 'Soft daylight',
                golden_hour: 'Golden hour',
                studio: 'Studio lighting',
                neon: 'Neon lighting'
            },
            platform: {
                instagram: 'Instagram',
                linkedin: 'LinkedIn post',
                facebook: 'Facebook ad',
                web_hero: 'Web hero banner',
                print: 'Outdoor print'
            },
            tone: {
                premium: 'Premium',
                bold: 'Bold',
                minimal: 'Minimal',
                playful: 'Playful',
                expert: 'Expert'
            },
            camera: {
                closeup: 'Close-up',
                eye_level: 'Eye level',
                flatlay: 'Flat lay',
                wide_angle: 'Wide angle',
                hero_shot: 'Hero shot'
            },
            textPosition: {
                center: 'Center',
                top: 'Top section',
                bottom_third: 'Bottom third',
                dynamic: 'Dynamic layout'
            },
            typography: {
                sans: 'Modern sans-serif',
                serif: 'Premium serif',
                minimal: 'Minimal',
                script: 'Handwritten'
            }
        }
    };

    var PRESETS = {
        ecommerce: {
            lt: {
                goal: 'Naujo produkto pristatymas',
                audience: '25-40 m. e-komercijos pirkėjai',
                platform: 'instagram',
                tone: 'premium',
                object: 'Prabangus odinis rankinis ant šviesaus akmens paviršiaus',
                style: 'photo',
                lighting: 'studio',
                camera: 'closeup',
                color: 'Šilti auksiniai tonai',
                headline: 'Nauja kolekcija jau čia',
                cta: 'Pirkti dabar',
                textPosition: 'bottom_third',
                typography: 'sans'
            },
            en: {
                goal: 'Launch a new product',
                audience: '25-40 e-commerce shoppers',
                platform: 'instagram',
                tone: 'premium',
                object: 'Luxury leather handbag on a light stone surface',
                style: 'photo',
                lighting: 'studio',
                camera: 'closeup',
                color: 'Warm golden tones',
                headline: 'The new collection is here',
                cta: 'Shop now',
                textPosition: 'bottom_third',
                typography: 'sans'
            }
        },
        events: {
            lt: {
                goal: 'Renginio registracijų augimas',
                audience: 'Marketingo specialistai ir verslo atstovai',
                platform: 'linkedin',
                tone: 'bold',
                object: 'Konferencijos scena su LED ekranu ir auditorija',
                style: 'cinematic',
                lighting: 'neon',
                camera: 'wide_angle',
                color: 'Elektrinė mėlyna ir violetinė',
                headline: 'Didžiausias metų renginys',
                cta: 'Registruokis',
                textPosition: 'top',
                typography: 'sans'
            },
            en: {
                goal: 'Increase event registrations',
                audience: 'Marketing specialists and business leaders',
                platform: 'linkedin',
                tone: 'bold',
                object: 'Conference stage with an LED wall and audience',
                style: 'cinematic',
                lighting: 'neon',
                camera: 'wide_angle',
                color: 'Electric blue and violet',
                headline: 'The biggest event of the year',
                cta: 'Register now',
                textPosition: 'top',
                typography: 'sans'
            }
        },
        brand: {
            lt: {
                goal: 'Prekės ženklo žinomumo didinimas',
                audience: 'Kūrybiška miesto auditorija',
                platform: 'web_hero',
                tone: 'expert',
                object: 'Minimalistinis produktas ant skaidraus stiklo podiumo',
                style: 'editorial',
                lighting: 'soft_daylight',
                camera: 'eye_level',
                color: 'Gili indigo su gintaro akcentais',
                headline: 'Atpažink premium kokybę',
                cta: 'Sužinoti daugiau',
                textPosition: 'center',
                typography: 'serif'
            },
            en: {
                goal: 'Increase brand awareness',
                audience: 'Creative urban audience',
                platform: 'web_hero',
                tone: 'expert',
                object: 'Minimal product placed on a transparent glass podium',
                style: 'editorial',
                lighting: 'soft_daylight',
                camera: 'eye_level',
                color: 'Deep indigo with amber accents',
                headline: 'Recognize premium quality',
                cta: 'Learn more',
                textPosition: 'center',
                typography: 'serif'
            }
        },
        social: {
            lt: {
                goal: 'Aktyvumo didinimas socialiniuose tinkluose',
                audience: 'Gen Z ir jaunos šeimos',
                platform: 'facebook',
                tone: 'playful',
                object: 'Džiaugsminga pora su produktu miesto aplinkoje',
                style: 'photo',
                lighting: 'golden_hour',
                camera: 'flatlay',
                color: 'Ryškus koralinis ir švelni mėlyna',
                headline: 'Pajusk naują energiją',
                cta: 'Išbandyk dabar',
                textPosition: 'dynamic',
                typography: 'sans'
            },
            en: {
                goal: 'Increase social engagement',
                audience: 'Gen Z and young families',
                platform: 'facebook',
                tone: 'playful',
                object: 'A joyful couple with the product in an urban setting',
                style: 'photo',
                lighting: 'golden_hour',
                camera: 'flatlay',
                color: 'Bright coral with soft blue',
                headline: 'Feel the new energy',
                cta: 'Try it now',
                textPosition: 'dynamic',
                typography: 'sans'
            }
        }
    };

    var LIBRARY_PROMPTS = {
        lt: [
            {
                title: 'Produkto nuotrauka (Close-up)',
                desc: 'Profesionali produkto nuotrauka su studijine kokybe',
                prompt: 'Tikroviška nuotrauka: [objektas, pvz.: prabangus rankinis laikrodis] ant [paviršius, pvz.: tamsaus marmurinio stalo]. Close-up, Cinematic apšvietimas su švelniu rim light iš kairės, [spalvų gama, pvz.: šilti auksiniai tonai] spalvų gama, itin detalu, aukščiausia kokybė, profesionali kompozicija, shallow depth of field, bokeh fonas, studio quality, 8K resolution.',
                hint: 'Pakeisk: [objektas], [paviršius], [spalvų gama] savo duomenimis.'
            },
            {
                title: 'Lifestyle / atmosferos vaizdas',
                desc: 'Emocinis vaizdas su žmonėmis ir atmosfera',
                prompt: 'Mados žurnalo stilius: [scena, pvz.: jauna moteris kavos bare su nešiojamu kompiuteriu, šypsosi]. Auksinė valanda (Golden Hour), platus kampas, šilti tonai, natūrali poza, candid photography style, editorial fashion magazine quality, soft golden backlight, [spalvų nuotaika, pvz.: šilti rudens tonai], professional lifestyle photography, high-end advertising quality.',
                hint: 'Pakeisk: [scena], [spalvų nuotaika] savo duomenimis.'
            },
            {
                title: 'Reklaminis maketas su antrašte',
                desc: 'Vaizdas su integruotu tekstu – paruoštas reklamai',
                prompt: 'Reklaminis maketas su integruotu tekstu: profesionalus vaizdas su [objektas/scena]. Antraštė: "[antraštė, pvz.: Pajuskite prabangą]" ir kvietimas veikti "[CTA, pvz.: Sužinoti daugiau]". Šrifto stilius: modernus sans-serif, bold. Teksto pozicija: [centras / viršutinė dalis / apatinis trečdalis]. Reikalavimas: aukštas kontrastas tarp teksto ir fono, švari erdvė aplink tekstą skaitomumui užtikrinti, clean negative space for text overlay, professional advertising layout, premium quality.',
                hint: 'Pakeisk: [objektas/scena], [antraštė], [CTA], teksto poziciją savo duomenimis.'
            },
            {
                title: 'LinkedIn / Web baneris',
                desc: 'Profesionalus plačiaformatis baneris',
                prompt: 'Profesionalus LinkedIn baneris: [paslaugos/produkto tema, pvz.: technologijų startupo komandos darbas]. Formatas 1200x627 (horizontalus), profesionali atmosfera, minkšta dienos šviesa, švarūs mėlyni-pilki tonai, corporate style, clean negative space kairėje pusėje teksto overlay, modern business photography, professional LinkedIn advertising format, subtle gradient background, premium B2B visual.',
                hint: 'Pakeisk: [paslaugos/produkto tema] savo duomenimis. Web hero – pakeisk formatą į 16:9.'
            }
        ],
        en: [
            {
                title: 'Product shot (close-up)',
                desc: 'Professional product photography with studio quality',
                prompt: 'Realistic product photo: [object, e.g. a luxury wristwatch] on [surface, e.g. a dark marble table]. Close-up, cinematic lighting with a soft rim light from the left, [color palette, e.g. warm golden tones], highly detailed, top quality, professional composition, shallow depth of field, bokeh background, studio quality, 8K resolution.',
                hint: 'Replace: [object], [surface], [color palette] with your details.'
            },
            {
                title: 'Lifestyle / atmosphere visual',
                desc: 'Emotional visual with people and mood',
                prompt: 'Editorial magazine style: [scene, e.g. a young woman smiling in a coffee shop with a laptop]. Golden hour lighting, wide angle, warm tones, natural pose, candid photography style, editorial fashion magazine quality, soft golden backlight, [mood colors, e.g. warm autumn tones], professional lifestyle photography, high-end advertising quality.',
                hint: 'Replace: [scene], [mood colors] with your details.'
            },
            {
                title: 'Ad layout with headline',
                desc: 'Visual with integrated text, ready for ads',
                prompt: 'Advertising layout with integrated text: professional visual featuring [object/scene]. Headline: "[headline, e.g. Experience luxury]" and call to action "[CTA, e.g. Learn more]". Font style: modern sans-serif, bold. Text position: [center / top section / bottom third]. Requirement: strong contrast between text and background, clean space around the text for readability, clean negative space for text overlay, professional advertising layout, premium quality.',
                hint: 'Replace: [object/scene], [headline], [CTA], and text position with your details.'
            },
            {
                title: 'LinkedIn / web banner',
                desc: 'Professional wide-format banner',
                prompt: 'Professional LinkedIn banner: [service/product theme, e.g. a startup team at work]. Format 1200x627 (horizontal), professional atmosphere, soft daylight, clean blue-grey tones, corporate style, clean negative space on the left for text overlay, modern business photography, professional LinkedIn advertising format, subtle gradient background, premium B2B visual.',
                hint: 'Replace: [service/product theme] with your details. For web hero, switch the format to 16:9.'
            }
        ]
    };

    var UI_TEXT = {
        lt: {
            documentTitle: 'DI Vaizdo Generatorius – rinkodaros vizualų promptai',
            metaDescription: 'Sukurkite DI vaizdų promptus rinkodaros vizualams: mini generatorius, šablonų biblioteka, Pro režimas ir greitas nukopijavimas į pasirinktą įrankį.',
            nav: {
                navLabel: 'Greita navigacija',
                brand: 'DI Vaizdo Generatorius',
                stickyCopyMini: 'Pereiti prie prompto',
                stickyCopyFull: 'Pereiti prie Pro prompto',
                stickyCopyMiniAria: 'Pereiti prie aktyvaus mini prompto (į viršų)',
                stickyCopyFullAria: 'Pereiti prie aktyvaus Pro prompto (į viršų)',
                stickyMetaMini: 'Aktyvus promptas: Mini',
                stickyMetaFull: 'Aktyvus promptas: Pro',
                promptSourceMini: 'mini promptą',
                promptSourceFull: 'Pro promptą',
                promptSourceMiniLabel: 'mini promptas',
                promptSourceFullLabel: 'Pro promptas',
                langGroup: 'Kalbos pasirinkimas',
                langLt: 'LT',
                langEn: 'EN',
                langLtAria: 'Perjungti į lietuvių kalbą',
                langEnAria: 'Switch to English'
            },
            accessibility: {
                skipLink: 'Pereiti prie turinio',
                hiddenTextarea: 'Kopijuojamo teksto laukas',
                toastAria: 'Kopijavimo pranešimas',
                themeLight: 'Perjungti į tamsų režimą',
                themeDark: 'Perjungti į šviesų režimą'
            },
            hero: {
                anatomyLabel: 'Promptų anatomija',
                anatomyAria: 'Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)',
                spinoffAria: 'DI Vaizdo Generatorius, Spin-off Nr. 5',
                title: 'DI Vaizdo Generatorius',
                subtitle: 'Sukurk profesionalius rinkodaros vizualus per minutę su DI.',
                stepsLabel: 'Proceso žingsniai',
                steps: ['Sukurk promptą', 'Šablonai', 'Generuok vaizdą', 'Pro režimas'],
                primaryCta: 'Pradėti kurti',
                primaryCtaAria: 'Pradėti kurti – interaktyvus generatorius',
                secondaryCta: 'Paruošti šablonai ↓',
                secondaryCtaAria: 'Peržiūrėti paruoštus šablonus'
            },
            mini: {
                title: 'Sukurk promptą',
                value: 'Užpildyk laukus arba pasirink šabloną – promptas generuojamas automatiškai',
                presetsTitle: 'Pradėk nuo šablono',
                presetLabels: {
                    ecommerce: 'E-commerce',
                    events: 'Renginys',
                    brand: 'Brand kampanija',
                    social: 'Social media'
                },
                objectLabel: 'Kas vaizduojama (objektas)',
                objectPlaceholder: 'Aprašykite objektą',
                objectHelp: 'Pvz.: Prabangus rankinis laikrodis ant marmurinio stalo',
                styleLabel: 'Stilius',
                lightingLabel: 'Apšvietimas',
                platformLabel: 'Platforma',
                platformHelp: 'Nuo platformos priklauso formato ir stiliaus rekomendacijos',
                colorLabel: 'Dominuojanti spalva',
                colorGroup: 'Spalvos pasirinkimas',
                colorPlaceholder: 'Arba įveskite savo spalvą',
                outputAria: 'Mini generatoriaus promptas',
                copyAria: 'Kopijuoti mini generatoriaus promptą',
                copyButton: 'KOPIJUOTI PROMPTĄ',
                nextLabel: 'Toliau: pasirink DI generatorių arba pereik į Pro režimą, jei reikia daugiau kontrolės.',
                nextTools: '2. Pasirink generatorių',
                nextPro: 'Perkelti į Pro režimą',
                fallbackObject: '[Objektas]'
            },
            library: {
                title: 'Šablonai',
                value: 'Pasiimk paruoštą promptą ir kopijuok per 1 paspaudimą',
                count: '4 šablonai',
                markText: 'Pažymėti',
                codeBlockAria: 'Pažymėti promptą ',
                copyButton: 'Kopijuoti promptą',
                copyAria: 'Kopijuoti promptą '
            },
            tools: {
                title: 'Generuok vaizdą',
                value: 'Pasirink generatorių, tada kopijuok ir atidaryk vienu mygtuku',
                count: '6 įrankiai',
                sectionTitle: 'Pasirinkite generatorių',
                sectionText: '1. Pasirinkite įrankį aukščiau. 2. Spauskite mygtuką žemiau – nukopijuosime promptą ir atidarysime įrankį naujame skirtuke.',
                groupAria: 'DI vaizdo generavimo įrankiai',
                recommended: 'Rekomenduojama',
                defaultHint: '1. Pasirinkite įrankį aukščiau. 2. Spauskite žemiau – nukopijuosime promptą ir atidarysime įrankį.',
                selectedHint: '2. Nukopijuosime ',
                selectedHintSuffix: ' ir atidarysime ',
                selectedPrefix: 'Pasirinktas ',
                recommendedPrefix: 'Rekomenduojame ',
                recommendedReason: ', nes jis geriausiai tinka tekstui ir aiškiems baneriams.',
                sourceHintPrefix: 'Aktyvus promptas: ',
                ctaBase: 'Kopijuoti + atidaryti',
                ctaAria: 'Kopijuoti promptą ir atidaryti pasirinktą įrankį',
                toolDescs: {
                    ideogram: 'Geriausias tekstui',
                    leonardo: 'Maksimali kontrolė',
                    midjourney: 'Aukščiausia kokybė',
                    chatgpt: 'Greitas ir paprastas',
                    firefly: 'Komerciniam naudojimui',
                    canva: 'Dizaino integracija'
                },
                toolAriaPrefix: 'Pasirinkti '
            },
            full: {
                title: 'Pro režimas',
                value: 'Daugiau kontrolės: papildomi parametrai ir tikslumas',
                transferBtn: 'Perkelti reikšmes iš mini generatoriaus',
                resetBtn: 'Išvalyti',
                regionAria: 'Interaktyvus vaizdo promptų generatorius',
                step1: '1. Kampanijos kontekstas',
                step2: '2. Vizualo esmė',
                step3: '3. Tekstų integracija',
                stepEmpty: 'Nepilna',
                goalLabel: 'Kampanijos tikslas',
                goalPlaceholder: 'Aprašykite tikslą',
                goalHelp: 'Pvz.: Naujo produkto pristatymas, Sezono išpardavimas',
                audienceLabel: 'Auditorija',
                audiencePlaceholder: 'Aprašykite auditoriją',
                audienceHelp: 'Pvz.: Jaunos šeimos, Gen Z, 25-40 m. profesionalai',
                toneLabel: 'Prekės ženklo tonas',
                objectLabel: 'Kas vaizduojama (pagrindinis objektas)',
                objectPlaceholder: 'Aprašykite objektą detaliai',
                objectHelp: 'Pvz.: Prabangus rankinis laikrodis ant tamsaus marmurinio stalo',
                cameraLabel: 'Kameros kampas',
                headlineLabel: 'Antraštė (Headline)',
                headlinePlaceholder: 'Įveskite antraštę',
                headlineHelp: 'Pvz.: Pajuskite prabangą, Nauja kolekcija jau čia',
                ctaLabel: 'Kvietimas veikti (CTA)',
                ctaPlaceholder: 'Įveskite CTA',
                ctaHelp: 'Pvz.: Pirkti dabar, Sužinoti daugiau, Registruotis',
                textPositionLabel: 'Teksto pozicija',
                typographyLabel: 'Šrifto stilius',
                outputAria: 'Sugeneruotas promptas',
                outputBadge: 'Sugeneruotas Promptas',
                copyAria: 'Kopijuoti sugeneruotą promptą',
                charsLabel: 'Simbolių:',
                outputHint: 'Nukopijuokite promptą ir įklijuokite į pasirinktą DI generatorių.',
                outputCta: 'KOPIJUOTI PROMPTĄ',
                outputCtaAria: 'Kopijuoti promptą ir paruošti',
                tipsLabel: 'Eksperto patarimai',
                tips: [
                    '<strong>Būkite konkretūs:</strong> Vietoj „gražus automobilis“ rašykite „matinis juodas visureigis miško kelyje“.',
                    '<strong>Apšvietimas = 80% nuotaikos.</strong> Visada parinkite apšvietimo tipą – tai svarbiausia vizualo dalis.',
                    '<strong>Teksto erdvė:</strong> Jei planuojate dėti tekstą vėliau, prompt&#39;e nurodykite „clean negative space for text overlay“.'
                ],
                fallbackObject: '[Objektas]'
            },
            quality: {
                title: 'Parengtis',
                meterLabel: 'Užpildyta',
                levels: {
                    weak: { label: 'Pradžia' },
                    medium: { label: 'Kryptis aiški' },
                    good: { label: 'Beveik paruošta' },
                    premium: { label: 'Paruošta kopijavimui' }
                },
                readyHint: 'Promptas paruoštas kopijuoti ir atidaryti pasirinktame įrankyje.',
                missingPrefix: 'Trūksta: ',
                improvePrefix: 'Sustiprins: ',
                stepReady: 'Paruošta',
                stepFilledLabel: 'užpildyta',
                stepOptional: 'Pasirinktinai',
                stepNeeds: 'Reikia',
                stepMissing: 'Trūksta',
                fieldNames: {
                    goal: 'tikslas',
                    audience: 'auditorija',
                    platform: 'platforma',
                    object: 'objektas',
                    style: 'stilius',
                    lighting: 'apšvietimas',
                    color: 'spalva',
                    headline: 'antraštė',
                    cta: 'CTA'
                }
            },
            community: {
                title: 'Vizualai sukurti.<br>Nori daugiau?',
                primary: 'Prisijungti prie WhatsApp grupės',
                primaryAria: 'Atidaryti Promptų anatomija WhatsApp grupę naujame lange',
                secondary: 'Promptų anatomija →',
                secondaryAria: 'Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)'
            },
            footer: {
                title: 'Kurk vizualus su DI',
                text: 'Pakeisk <strong>[objektas]</strong>, <strong>[aplinka]</strong>, <strong>[spalvų gama]</strong>, <strong>[antraštė]</strong> ir kitus laukus savo duomenimis.',
                product: 'Tai Spin-off Nr. 5 iš „Promptų anatomijos".',
                tags: ['DI vizualai', '4 šablonai', 'Generatorius', 'Rinkodaros vizualai'],
                privacy: 'Privatumas',
                copyright: '&copy; 2026 Tomas Staniulis. Mokymų medžiaga. Visos teisės saugomos.'
            }
        },
        en: {
            documentTitle: 'AI Visual Generator – marketing image prompts',
            metaDescription: 'Create AI image prompts for marketing visuals with a mini generator, template library, Pro mode, and quick copy to your chosen tool.',
            nav: {
                navLabel: 'Quick navigation',
                brand: 'AI Visual Generator',
                stickyCopyMini: 'Go to prompt',
                stickyCopyFull: 'Go to Pro prompt',
                stickyCopyMiniAria: 'Scroll to the active mini prompt',
                stickyCopyFullAria: 'Scroll to the active Pro prompt',
                stickyMetaMini: 'Active prompt: Mini',
                stickyMetaFull: 'Active prompt: Pro',
                promptSourceMini: 'the mini prompt',
                promptSourceFull: 'the Pro prompt',
                promptSourceMiniLabel: 'mini prompt',
                promptSourceFullLabel: 'Pro prompt',
                langGroup: 'Language selection',
                langLt: 'LT',
                langEn: 'EN',
                langLtAria: 'Switch to Lithuanian',
                langEnAria: 'Switch to English'
            },
            accessibility: {
                skipLink: 'Skip to content',
                hiddenTextarea: 'Copy helper field',
                toastAria: 'Copy notification',
                themeLight: 'Switch to dark mode',
                themeDark: 'Switch to light mode'
            },
            hero: {
                anatomyLabel: 'Prompt Anatomy',
                anatomyAria: 'Full Prompt Anatomy – interactive learning (opens in a new tab)',
                spinoffAria: 'AI Visual Generator, Spin-off No. 5',
                title: 'AI Visual Generator',
                subtitle: 'Create professional marketing visuals with AI in under a minute.',
                stepsLabel: 'Process steps',
                steps: ['Create prompt', 'Templates', 'Generate image', 'Pro mode'],
                primaryCta: 'Start creating',
                primaryCtaAria: 'Start creating with the interactive generator',
                secondaryCta: 'Ready-made templates ↓',
                secondaryCtaAria: 'Browse ready-made templates'
            },
            mini: {
                title: 'Create a prompt',
                value: 'Fill in the fields or choose a template — the prompt updates automatically',
                presetsTitle: 'Start from a template',
                presetLabels: {
                    ecommerce: 'E-commerce',
                    events: 'Event',
                    brand: 'Brand campaign',
                    social: 'Social media'
                },
                objectLabel: 'What is shown (main object)',
                objectPlaceholder: 'Describe the object',
                objectHelp: 'Example: Luxury wristwatch on a marble table',
                styleLabel: 'Style',
                lightingLabel: 'Lighting',
                platformLabel: 'Platform',
                platformHelp: 'Platform affects the suggested format and visual treatment',
                colorLabel: 'Dominant color',
                colorGroup: 'Color selection',
                colorPlaceholder: 'Or enter your own color',
                outputAria: 'Mini generator prompt',
                copyAria: 'Copy the mini generator prompt',
                copyButton: 'COPY PROMPT',
                nextLabel: 'Next: choose an AI image tool or move to Pro mode if you need more control.',
                nextTools: '2. Choose a tool',
                nextPro: 'Move to Pro mode',
                fallbackObject: '[Object]'
            },
            library: {
                title: 'Templates',
                value: 'Pick a ready-made prompt and copy it in one click',
                count: '4 templates',
                markText: 'Select',
                codeBlockAria: 'Select prompt ',
                copyButton: 'Copy prompt',
                copyAria: 'Copy prompt '
            },
            tools: {
                title: 'Generate the image',
                value: 'Choose a tool, then copy and open it with one button',
                count: '6 tools',
                sectionTitle: 'Choose a generator',
                sectionText: '1. Choose a tool above. 2. Press the button below — we will copy the prompt and open the tool in a new tab.',
                groupAria: 'AI image generation tools',
                recommended: 'Recommended',
                defaultHint: '1. Choose a tool above. 2. Press below — we will copy the prompt and open the tool.',
                selectedHint: '2. We will copy ',
                selectedHintSuffix: ' and open ',
                selectedPrefix: 'Selected ',
                recommendedPrefix: 'We recommend ',
                recommendedReason: ' because it handles text and clean banners especially well.',
                sourceHintPrefix: 'Active prompt: ',
                ctaBase: 'Copy + open',
                ctaAria: 'Copy prompt and open the selected tool',
                toolDescs: {
                    ideogram: 'Best for text',
                    leonardo: 'Maximum control',
                    midjourney: 'Top quality',
                    chatgpt: 'Fast and simple',
                    firefly: 'Commercial use',
                    canva: 'Design workflow'
                },
                toolAriaPrefix: 'Choose '
            },
            full: {
                title: 'Pro mode',
                value: 'More control: extra parameters and higher precision',
                transferBtn: 'Import values from mini generator',
                resetBtn: 'Reset',
                regionAria: 'Interactive visual prompt generator',
                step1: '1. Campaign context',
                step2: '2. Visual core',
                step3: '3. Text integration',
                stepEmpty: 'Incomplete',
                goalLabel: 'Campaign goal',
                goalPlaceholder: 'Describe the goal',
                goalHelp: 'Example: Launching a new product, seasonal sale',
                audienceLabel: 'Audience',
                audiencePlaceholder: 'Describe the audience',
                audienceHelp: 'Example: Young families, Gen Z, professionals aged 25-40',
                toneLabel: 'Brand tone',
                objectLabel: 'What is shown (main object)',
                objectPlaceholder: 'Describe the object in detail',
                objectHelp: 'Example: Luxury wristwatch on a dark marble table',
                cameraLabel: 'Camera angle',
                headlineLabel: 'Headline',
                headlinePlaceholder: 'Enter a headline',
                headlineHelp: 'Example: Experience luxury, New collection is here',
                ctaLabel: 'Call to action (CTA)',
                ctaPlaceholder: 'Enter a CTA',
                ctaHelp: 'Example: Shop now, Learn more, Sign up',
                textPositionLabel: 'Text position',
                typographyLabel: 'Typography style',
                outputAria: 'Generated prompt',
                outputBadge: 'Generated Prompt',
                copyAria: 'Copy generated prompt',
                charsLabel: 'Characters:',
                outputHint: 'Copy the prompt and paste it into your chosen AI image generator.',
                outputCta: 'COPY PROMPT',
                outputCtaAria: 'Copy prompt and prepare it',
                tipsLabel: 'Expert tips',
                tips: [
                    '<strong>Be specific:</strong> Instead of “nice car”, write “matte black SUV on a forest road”.',
                    '<strong>Lighting drives the mood.</strong> Always choose a lighting style — it is often the most important visual cue.',
                    '<strong>Leave room for text:</strong> If you plan to add text later, include “clean negative space for text overlay” in the prompt.'
                ],
                fallbackObject: '[Object]'
            },
            quality: {
                title: 'Readiness',
                meterLabel: 'Filled',
                levels: {
                    weak: { label: 'Getting started' },
                    medium: { label: 'Clear direction' },
                    good: { label: 'Almost ready' },
                    premium: { label: 'Ready to copy' }
                },
                readyHint: 'The prompt is ready to copy and open in your selected tool.',
                missingPrefix: 'Missing: ',
                improvePrefix: 'Improve with: ',
                stepReady: 'Ready',
                stepFilledLabel: 'filled',
                stepOptional: 'Optional',
                stepNeeds: 'Needs',
                stepMissing: 'Missing',
                fieldNames: {
                    goal: 'goal',
                    audience: 'audience',
                    platform: 'platform',
                    object: 'object',
                    style: 'style',
                    lighting: 'lighting',
                    color: 'color',
                    headline: 'headline',
                    cta: 'CTA'
                }
            },
            community: {
                title: 'Visuals done.<br>Want more?',
                primary: 'Join the WhatsApp group',
                primaryAria: 'Open the Prompt Anatomy WhatsApp group in a new tab',
                secondary: 'Prompt Anatomy →',
                secondaryAria: 'Full Prompt Anatomy – interactive learning (opens in a new tab)'
            },
            footer: {
                title: 'Create visuals with AI',
                text: 'Replace <strong>[object]</strong>, <strong>[environment]</strong>, <strong>[color palette]</strong>, <strong>[headline]</strong> and the other fields with your own data.',
                product: 'This is Spin-off No. 5 from “Prompt Anatomy”.',
                tags: ['AI visuals', '4 templates', 'Generator', 'Marketing visuals'],
                privacy: 'Privacy',
                copyright: '&copy; 2026 Tomas Staniulis. Training material. All rights reserved.'
            }
        }
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function highlightValue(value, fallback) {
        var out = value || fallback;
        return '<span class="gen-value">' + escapeHtml(out) + '</span>';
    }

    function highlightKey(value, fallback) {
        var out = value || fallback;
        return '<span class="gen-key">' + escapeHtml(out) + '</span>';
    }

    function isFilled(value) {
        return String(value || '').trim().length > 0;
    }

    function getLocaleFromPathname() {
        var path = (window.location.pathname || '').toLowerCase();
        if (/\/lt(?:\/|$)/.test(path)) return 'lt';
        if (/\/en(?:\/|$)/.test(path)) return 'en';
        return '';
    }

    function resolveLocale() {
        var fromPath = getLocaleFromPathname();
        if (fromPath) return fromPath;

        try {
            var params = new URLSearchParams(window.location.search || '');
            var fromQuery = (params.get('lang') || '').toLowerCase();
            if (fromQuery === 'lt' || fromQuery === 'en') return fromQuery;
        } catch (_) { /* ignore */ }

        try {
            var stored = localStorage.getItem(LANG_KEY);
            if (stored === 'lt' || stored === 'en') return stored;
        } catch (_) { /* ignore */ }

        var navLang = (navigator.language || '').toLowerCase();
        return navLang.indexOf('lt') === 0 ? 'lt' : 'en';
    }

    function getText() {
        return UI_TEXT[locale];
    }

    function getOptionLabel(group, value) {
        var labels = OPTION_LABELS[locale][group] || {};
        return labels[value] || value || '';
    }

    function getColorPresetValue(key, targetLocale) {
        var preset = COLOR_PRESETS[key];
        if (!preset) return '';
        return preset[targetLocale || locale].value;
    }

    function getColorPresetLabel(key, targetLocale) {
        var preset = COLOR_PRESETS[key];
        if (!preset) return '';
        return preset[targetLocale || locale].chip;
    }

    function translateKnownColorValue(fromLocale, toLocale, value) {
        var input = String(value || '').trim();
        if (!input) return '';

        var keys = Object.keys(COLOR_PRESETS);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (COLOR_PRESETS[key][fromLocale].value === input) {
                return COLOR_PRESETS[key][toLocale].value;
            }
        }
        return value;
    }

    function saveLocale(nextLocale) {
        try {
            localStorage.setItem(LANG_KEY, nextLocale);
        } catch (_) { /* ignore */ }
    }

    function saveAppState() {
        try {
            localStorage.setItem(APP_STATE_KEY, JSON.stringify({
                mini: miniState,
                full: state,
                activePromptSource: activePromptSource,
                selectedToolKey: selectedToolKey
            }));
        } catch (_) { /* ignore */ }
    }

    function restoreAppState() {
        try {
            var raw = localStorage.getItem(APP_STATE_KEY);
            if (!raw) return;
            var parsed = JSON.parse(raw);
            if (parsed && parsed.mini) {
                miniState = Object.assign({}, defaultMiniState, parsed.mini);
            }
            if (parsed && parsed.full) {
                state = Object.assign({}, defaultState, parsed.full);
            }
            if (parsed && (parsed.activePromptSource === 'mini' || parsed.activePromptSource === 'full')) {
                activePromptSource = parsed.activePromptSource;
            } else if (isFilled(state.object) || isFilled(state.goal) || isFilled(state.audience) || isFilled(state.headline) || isFilled(state.cta)) {
                activePromptSource = 'full';
            }
            if (parsed && parsed.selectedToolKey && TOOLS[parsed.selectedToolKey]) {
                selectedToolKey = parsed.selectedToolKey;
                selectedToolUrl = TOOLS[selectedToolKey].url;
            }
        } catch (_) { /* ignore */ }
    }

    function updateHistoryLangParam(nextLocale) {
        try {
            if (getLocaleFromPathname()) return;
            var params = new URLSearchParams(window.location.search || '');
            params.set('lang', nextLocale);
            var query = params.toString();
            var nextUrl = window.location.pathname + (query ? '?' + query : '') + (window.location.hash || '');
            window.history.replaceState({}, '', nextUrl);
        } catch (_) { /* ignore */ }
    }

    function buildLocaleUrl(nextLocale) {
        var path = window.location.pathname || '';
        var search = window.location.search || '';
        var hash = window.location.hash || '';
        var nextPath = path;

        if (/\/(lt|en)(?=\/|$)/.test(path)) {
            nextPath = path.replace(/\/(lt|en)(?=\/|$)/, '/' + nextLocale);
        }

        if (/\/(privatumas\.html|privacy\.html)$/.test(nextPath)) {
            nextPath = nextPath.replace(/\/(privatumas\.html|privacy\.html)$/, '/' + (nextLocale === 'lt' ? 'privatumas.html' : 'privacy.html'));
        }

        return nextPath + search + hash;
    }

    function updateHeadLinks() {
        if (getLocaleFromPathname()) return;
        var canonical = document.querySelector('link[rel="canonical"]');
        var altLt = document.querySelector('link[rel="alternate"][hreflang="lt"]');
        var altEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
        var altDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
        var canonicalHref = locale === 'en' ? './en/' : './lt/';
        if (canonical) canonical.setAttribute('href', canonicalHref);
        if (altLt) altLt.setAttribute('href', './lt/');
        if (altEn) altEn.setAttribute('href', './en/');
        if (altDefault) altDefault.setAttribute('href', './lt/');
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (_) { /* ignore */ }

        var btn = document.getElementById('themeToggleBtn');
        var icon = btn ? btn.querySelector('i') : null;
        var texts = getText().accessibility;
        if (btn) {
            var isDark = theme === 'dark';
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            btn.setAttribute('aria-label', isDark ? texts.themeDark : texts.themeLight);
        }
        if (icon) {
            icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons({ root: btn });
            }
        }
    }

    function setText(selector, text) {
        var el = document.querySelector(selector);
        if (el) el.textContent = text;
    }

    function setHtml(selector, html) {
        var el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    }

    function setAttr(selector, name, value) {
        var el = document.querySelector(selector);
        if (el) el.setAttribute(name, value);
    }

    function setFieldLabel(id, text) {
        var el = document.querySelector('label[for="' + id + '"]');
        if (el) el.textContent = text;
    }

    function setFieldHelp(containerSelector, text) {
        var container = document.querySelector(containerSelector);
        if (!container) return;
        var help = container.querySelector('.field-help');
        if (help) help.textContent = text;
    }

    function setInputHelp(id, text) {
        var input = document.getElementById(id);
        if (!input || !input.parentElement) return;
        var help = input.parentElement.querySelector('.field-help');
        if (help) help.textContent = text;
    }

    function setPlaceholder(id, text) {
        var el = document.getElementById(id);
        if (el) el.setAttribute('placeholder', text);
    }

    function setSelectOptions(selectId, group) {
        var select = document.getElementById(selectId);
        if (!select) return;
        Array.prototype.forEach.call(select.options, function (option) {
            option.textContent = getOptionLabel(group, option.value);
        });
    }

    function setChipTexts(group) {
        var targetId = group.getAttribute('data-target');
        var label = getText().mini.colorGroup;
        group.setAttribute('aria-label', label);
        Array.prototype.forEach.call(group.querySelectorAll('.color-chip'), function (chip) {
            var key = chip.getAttribute('data-color-key');
            if (!key) return;
            chip.textContent = getColorPresetLabel(key);
            chip.setAttribute('data-color', getColorPresetValue(key));
            chip.setAttribute('aria-pressed', chip.classList.contains('is-active') ? 'true' : 'false');
        });
        var input = document.getElementById(targetId);
        if (input) {
            var translated = translateKnownColorValue(document.documentElement.getAttribute('lang') || locale, locale, input.value);
            if (translated !== input.value) {
                input.value = translated;
                if (targetId === 'mini-color') miniState.color = translated;
                if (targetId === 'gen-color') state.color = translated;
            }
        }
    }

    function updateLanguageButtons() {
        var ltBtn = document.getElementById('langLtBtn');
        var enBtn = document.getElementById('langEnBtn');
        var nav = getText().nav;
        if (ltBtn) {
            ltBtn.textContent = nav.langLt;
            ltBtn.setAttribute('aria-label', nav.langLtAria);
            ltBtn.setAttribute('aria-pressed', locale === 'lt' ? 'true' : 'false');
            ltBtn.classList.toggle('is-active', locale === 'lt');
        }
        if (enBtn) {
            enBtn.textContent = nav.langEn;
            enBtn.setAttribute('aria-label', nav.langEnAria);
            enBtn.setAttribute('aria-pressed', locale === 'en' ? 'true' : 'false');
            enBtn.classList.toggle('is-active', locale === 'en');
        }
        setAttr('.top-nav-lang', 'aria-label', nav.langGroup);
    }

    function applyDocumentHead() {
        var text = getText();
        document.documentElement.setAttribute('lang', locale);
        document.title = text.documentTitle;

        var description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', text.metaDescription);
        }
        updateHeadLinks();
    }

    function getActivePromptText() {
        return activePromptSource === 'full' ? getGeneratorPromptText() : getMiniPromptText();
    }

    function getActivePromptSourceLabel() {
        var nav = getText().nav;
        return activePromptSource === 'full' ? nav.promptSourceFullLabel : nav.promptSourceMiniLabel;
    }

    function getActivePromptSourceObjectText() {
        var nav = getText().nav;
        return activePromptSource === 'full' ? nav.promptSourceFull : nav.promptSourceMini;
    }

    function updateStickyCopyUi() {
        var nav = getText().nav;
        var meta = document.getElementById('stickyCopyMeta');
        var button = document.getElementById('stickyCopyBtn');
        var isFull = activePromptSource === 'full';
        if (meta) {
            meta.textContent = isFull ? nav.stickyMetaFull : nav.stickyMetaMini;
        }
        if (button) {
            button.textContent = isFull ? nav.stickyCopyFull : nav.stickyCopyMini;
            button.setAttribute('aria-label', isFull ? nav.stickyCopyFullAria : nav.stickyCopyMiniAria);
        }
    }

    function setActivePromptSource(source, shouldPersist) {
        if (source !== 'mini' && source !== 'full') return;
        activePromptSource = source;
        updateStickyCopyUi();
        updateToolCta();
        if (shouldPersist !== false) {
            saveAppState();
        }
    }

    function scrollToActivePrompt() {
        var targetId = activePromptSource === 'full' ? 'fullGenerator' : 'miniGenerator';
        var target = document.getElementById(targetId);
        if (!target) return;
        if (activePromptSource === 'full' && typeof window.openAccordionSection === 'function') {
            window.openAccordionSection('fullGenerator');
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function joinLabels(labels) {
        if (!labels.length) return '';
        if (labels.length === 1) return labels[0];
        if (labels.length === 2) return labels[0] + (locale === 'lt' ? ' ir ' : ' and ') + labels[1];
        return labels.slice(0, -1).join(', ') + (locale === 'lt' ? ' ir ' : ', and ') + labels[labels.length - 1];
    }

    function getQualityFieldLabel(key) {
        var labels = getText().quality.fieldNames || {};
        return labels[key] || key;
    }

    function getMissingStateFields(keys) {
        return keys.filter(function (key) {
            return !isFilled(state[key]);
        });
    }

    function applyStaticLocaleText() {
        var text = getText();
        var libraryTexts = LIBRARY_PROMPTS[locale];
        var footerPrivacyHref = getLocaleFromPathname()
            ? (locale === 'lt' ? 'privatumas.html' : 'privacy.html')
            : (locale === 'lt' ? 'privatumas.html' : 'en/privacy.html');

        setText('.skip-link', text.accessibility.skipLink);
        setAttr('.top-nav', 'aria-label', text.nav.navLabel);
        setText('.top-nav-brand', text.nav.brand);
        updateLanguageButtons();
        updateStickyCopyUi();

        setText('.header-badges .badge', text.hero.anatomyLabel);
        setAttr('.header-badges .badge', 'aria-label', text.hero.anatomyAria);
        setAttr('.badge-spinoff', 'aria-label', text.hero.spinoffAria);
        setText('.header h1', text.hero.title);
        setText('.header > p', text.hero.subtitle);
        setAttr('.header-steps', 'aria-label', text.hero.stepsLabel);

        var heroSteps = document.querySelectorAll('.header-step');
        Array.prototype.forEach.call(heroSteps, function (step, index) {
            var number = step.querySelector('.header-step-num');
            step.textContent = '';
            if (number) {
                step.appendChild(number);
                step.appendChild(document.createTextNode(' ' + (text.hero.steps[index] || '')));
            }
        });
        setText('.header .cta-button', text.hero.primaryCta);
        setAttr('.header .cta-button', 'aria-label', text.hero.primaryCtaAria);
        setText('.header .cta-button-outline', text.hero.secondaryCta);
        setAttr('.header .cta-button-outline', 'aria-label', text.hero.secondaryCtaAria);

        setText('#miniGenerator .section-header-text .collapsible-title', text.mini.title);
        setText('#miniGenerator .section-header-text .collapsible-value', text.mini.value);
        setText('.mini-gen-presets h2', text.mini.presetsTitle);

        var presetButtons = document.querySelectorAll('.mini-gen-preset-btn[data-preset]');
        Array.prototype.forEach.call(presetButtons, function (button) {
            var key = button.getAttribute('data-preset');
            var label = text.mini.presetLabels[key];
            var span = button.querySelector('span');
            if (span && label) span.textContent = label;
        });

        setFieldLabel('mini-object', text.mini.objectLabel);
        setPlaceholder('mini-object', text.mini.objectPlaceholder);
        setInputHelp('mini-object', text.mini.objectHelp);
        setFieldLabel('mini-style', text.mini.styleLabel);
        setFieldLabel('mini-lighting', text.mini.lightingLabel);
        setFieldLabel('mini-platform', text.mini.platformLabel);
        setInputHelp('mini-platform', text.mini.platformHelp);
        setFieldLabel('mini-color', text.mini.colorLabel);
        setPlaceholder('mini-color', text.mini.colorPlaceholder);
        setSelectOptions('mini-style', 'style');
        setSelectOptions('mini-lighting', 'lighting');
        setSelectOptions('mini-platform', 'platform');
        Array.prototype.forEach.call(document.querySelectorAll('.color-chips'), setChipTexts);

        setAttr('.mini-gen-output', 'aria-label', text.mini.outputAria);
        setAttr('#miniGenCopyBtn', 'aria-label', text.mini.copyAria);
        setText('#miniGenCopyBtn span', text.mini.copyButton);
        setText('#miniGenNext .mini-gen-next-label', text.mini.nextLabel);
        setText('#miniToToolsBtn', text.mini.nextTools);
        setText('#miniToProBtn', text.mini.nextPro);

        setText('#promptLibraryToggle .collapsible-title', text.library.title);
        setText('#promptLibraryToggle .collapsible-value', text.library.value);
        setText('#promptLibraryToggle .collapsible-count', text.library.count);

        var promptCards = document.querySelectorAll('#promptLibraryBody .prompt');
        Array.prototype.forEach.call(promptCards, function (card, index) {
            var promptText = libraryTexts[index];
            if (!promptText) return;
            var title = card.querySelector('.prompt-title');
            var desc = card.querySelector('.prompt-desc');
            var pre = card.querySelector('.code-text');
            var hint = card.querySelector('.prompt-hint');
            var toolbar = card.querySelector('.code-block-toolbar');
            var block = card.querySelector('.code-block');
            var btn = card.querySelector('.btn');
            var pid = String(index + 1);
            if (title) title.textContent = promptText.title;
            if (desc) desc.textContent = promptText.desc;
            if (pre) pre.textContent = promptText.prompt;
            if (hint) hint.textContent = promptText.hint;
            if (toolbar) toolbar.innerHTML = '<i data-lucide="copy" class="icon icon--sm"></i> ' + text.library.markText;
            if (block) block.setAttribute('aria-label', text.library.codeBlockAria + pid);
            if (btn) {
                var labelSpan = btn.querySelector('span:last-child');
                if (labelSpan) labelSpan.textContent = text.library.copyButton;
                btn.setAttribute('aria-label', text.library.copyAria + pid + (locale === 'lt' ? ' į mainų atmintinę' : ' to clipboard'));
            }
        });

        setText('#toolsToggle .collapsible-title', text.tools.title);
        setText('#toolsToggle .collapsible-value', text.tools.value);
        setText('#toolsToggle .collapsible-count', text.tools.count);
        setText('.tools-section-header h2', text.tools.sectionTitle);
        setText('.tools-section-header p', text.tools.sectionText);
        setAttr('.tool-grid', 'aria-label', text.tools.groupAria);

        var toolCards = document.querySelectorAll('.tool-card[data-tool]');
        Array.prototype.forEach.call(toolCards, function (card) {
            var key = card.getAttribute('data-tool');
            var name = TOOLS[key] ? TOOLS[key].name : '';
            var desc = text.tools.toolDescs[key];
            var badge = card.querySelector('.tool-card-badge');
            var descEl = card.querySelector('.tool-card-desc');
            var nameEl = card.querySelector('.tool-card-name');
            if (nameEl) nameEl.textContent = name;
            if (descEl && desc) descEl.textContent = desc;
            if (badge) badge.textContent = text.tools.recommended;
            card.setAttribute('aria-label', text.tools.toolAriaPrefix + name + ' – ' + desc);
        });
        setAttr('#toolsActionCta', 'aria-label', text.tools.ctaAria);

        setText('#fullGenToggle .collapsible-title', text.full.title);
        setText('#fullGenToggle .collapsible-value', text.full.value);
        setText('#fullGenTransferBtn', text.full.transferBtn);
        setText('#generatorResetBtn', text.full.resetBtn);
        setAttr('#generator', 'aria-label', text.full.regionAria);
        setText('.generator-step[data-step="1"] h3', text.full.step1);
        setText('.generator-step[data-step="2"] h3', text.full.step2);
        setText('.generator-step[data-step="3"] h3', text.full.step3);

        setFieldLabel('gen-goal', text.full.goalLabel);
        setPlaceholder('gen-goal', text.full.goalPlaceholder);
        setFieldHelp('.generator-step[data-step="1"] .generator-fields div:nth-child(1)', text.full.goalHelp);
        setFieldLabel('gen-platform', text.mini.platformLabel);
        setFieldLabel('gen-audience', text.full.audienceLabel);
        setPlaceholder('gen-audience', text.full.audiencePlaceholder);
        setFieldHelp('.generator-step[data-step="1"] .generator-fields div:nth-child(3)', text.full.audienceHelp);
        setFieldLabel('gen-tone', text.full.toneLabel);

        setFieldLabel('gen-object', text.full.objectLabel);
        setPlaceholder('gen-object', text.full.objectPlaceholder);
        setFieldHelp('.generator-step[data-step="2"] .field-full', text.full.objectHelp);
        setFieldLabel('gen-style', text.mini.styleLabel);
        setFieldLabel('gen-lighting', text.mini.lightingLabel);
        setFieldLabel('gen-camera', text.full.cameraLabel);
        setFieldLabel('gen-color', text.mini.colorLabel);
        setPlaceholder('gen-color', text.mini.colorPlaceholder);

        setFieldLabel('gen-headline', text.full.headlineLabel);
        setPlaceholder('gen-headline', text.full.headlinePlaceholder);
        setFieldHelp('.generator-step[data-step="3"] .generator-fields div:nth-child(1)', text.full.headlineHelp);
        setFieldLabel('gen-cta', text.full.ctaLabel);
        setPlaceholder('gen-cta', text.full.ctaPlaceholder);
        setFieldHelp('.generator-step[data-step="3"] .generator-fields div:nth-child(2)', text.full.ctaHelp);
        setFieldLabel('gen-textPosition', text.full.textPositionLabel);
        setFieldLabel('gen-typography', text.full.typographyLabel);

        setSelectOptions('gen-platform', 'platform');
        setSelectOptions('gen-tone', 'tone');
        setSelectOptions('gen-style', 'style');
        setSelectOptions('gen-lighting', 'lighting');
        setSelectOptions('gen-camera', 'camera');
        setSelectOptions('gen-textPosition', 'textPosition');
        setSelectOptions('gen-typography', 'typography');

        setAttr('.generator-output', 'aria-label', text.full.outputAria);
        setText('.generator-output-badge span:last-child', text.full.outputBadge);
        setAttr('#genCopyBtn', 'aria-label', text.full.copyAria);
        setHtml('.generator-chars', text.full.charsLabel + ' <strong id="generatorCharCount">' + escapeHtml(document.getElementById('generatorCharCount') ? document.getElementById('generatorCharCount').textContent : '0') + '</strong>');
        setText('.generator-output-footer p:last-of-type', text.full.outputHint);
        setText('#genCopyCta span', text.full.outputCta);
        setAttr('#genCopyCta', 'aria-label', text.full.outputCtaAria);
        setHtml('.tips-toggle-label', '<i data-lucide="info" class="icon icon--md"></i> ' + text.full.tipsLabel);
        var tips = document.querySelectorAll('#tipsContent p');
        Array.prototype.forEach.call(tips, function (tip, index) {
            if (text.full.tips[index]) tip.innerHTML = text.full.tips[index];
        });

        setHtml('#community-title', text.community.title);
        setText('.community-cta-primary', text.community.primary);
        setAttr('.community-cta-primary', 'aria-label', text.community.primaryAria);
        setText('.community-cta-secondary', text.community.secondary);
        setAttr('.community-cta-secondary', 'aria-label', text.community.secondaryAria);

        setHtml('.footer h3', text.footer.title + ' <span class="icon-wrap" aria-hidden="true"><i data-lucide="sparkles" class="icon icon--md"></i></span>');
        setHtml('.footer > p:not(.footer-product-link)', text.footer.text);
        setText('.footer-product-link', text.footer.product);
        var tags = document.querySelectorAll('.tag');
        Array.prototype.forEach.call(tags, function (tag, index) {
            var iconWrap = tag.querySelector('.icon-wrap');
            var label = text.footer.tags[index] || '';
            if (iconWrap) {
                tag.innerHTML = iconWrap.outerHTML + ' ' + escapeHtml(label);
            } else {
                tag.textContent = label;
            }
        });
        setHtml('.copyright p', text.footer.copyright + ' <a href="' + footerPrivacyHref + '">' + text.footer.privacy + '</a>');

        setAttr('#hiddenTextarea', 'aria-label', text.accessibility.hiddenTextarea);
        setAttr('#toast', 'aria-label', text.accessibility.toastAria);
        setText('#toastMessage', locale === 'lt' ? 'Nukopijuota.' : 'Copied.');

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function generateMiniPrompt(rawTextOnly) {
        var text = getText();
        var styleLabel = getOptionLabel('style', miniState.style || defaultMiniState.style);
        var lightingLabel = getOptionLabel('lighting', miniState.lighting || defaultMiniState.lighting);
        var platformLabel = getOptionLabel('platform', miniState.platform || defaultMiniState.platform);
        var objectValue = miniState.object || text.mini.fallbackObject;
        var objectDisplay = rawTextOnly ? objectValue : highlightValue(objectValue, text.mini.fallbackObject);
        var styleDisplay = rawTextOnly ? styleLabel : highlightKey(styleLabel, styleLabel);
        var lightingDisplay = rawTextOnly ? lightingLabel : highlightValue(lightingLabel, lightingLabel);
        var platformDisplay = rawTextOnly ? platformLabel : highlightKey(platformLabel, platformLabel);
        var colorDisplay = rawTextOnly ? miniState.color : highlightValue(miniState.color, miniState.color);

        if (locale === 'en') {
            return styleDisplay + ': ' + objectDisplay + '. ' +
                lightingDisplay + ', highly detailed, top quality, professional composition' +
                (isFilled(miniState.color) ? ', ' + colorDisplay + ' color palette' : '') +
                ', designed for ' + platformDisplay + '.';
        }

        return styleDisplay + ': ' + objectDisplay + '. ' +
            lightingDisplay + ', itin detalu, aukščiausia kokybė, profesionali kompozicija' +
            (isFilled(miniState.color) ? ', ' + colorDisplay + ' spalvų gama' : '') +
            ', platformai ' + platformDisplay + '.';
    }

    function generatePrompt(rawTextOnly) {
        var text = getText();
        var styleLabel = getOptionLabel('style', state.style || defaultState.style);
        var cameraLabel = getOptionLabel('camera', state.camera || defaultState.camera);
        var lightingLabel = getOptionLabel('lighting', state.lighting || defaultState.lighting);
        var platformLabel = getOptionLabel('platform', state.platform || defaultState.platform);
        var toneLabel = getOptionLabel('tone', state.tone || defaultState.tone);
        var typographyLabel = getOptionLabel('typography', state.typography || defaultState.typography);
        var textPositionLabel = getOptionLabel('textPosition', state.textPosition || defaultState.textPosition);
        var objectValue = state.object || text.full.fallbackObject;
        var styleDisplay = rawTextOnly ? styleLabel : highlightKey(styleLabel, styleLabel);
        var objectDisplay = rawTextOnly ? objectValue : highlightValue(objectValue, text.full.fallbackObject);
        var cameraDisplay = rawTextOnly ? cameraLabel : highlightValue(cameraLabel, cameraLabel);
        var lightingDisplay = rawTextOnly ? lightingLabel : highlightValue(lightingLabel, lightingLabel);
        var platformDisplay = rawTextOnly ? platformLabel : highlightKey(platformLabel, platformLabel);
        var toneDisplay = rawTextOnly ? toneLabel : highlightKey(toneLabel, toneLabel);
        var colorDisplay = rawTextOnly ? state.color : highlightValue(state.color, state.color);
        var goalDisplay = rawTextOnly ? (state.goal || (locale === 'lt' ? 'reklama' : 'marketing campaign')) : highlightValue(state.goal, locale === 'lt' ? 'reklama' : 'marketing campaign');
        var audienceDisplay = rawTextOnly ? (state.audience || (locale === 'lt' ? 'tikslinė auditorija' : 'target audience')) : highlightValue(state.audience, locale === 'lt' ? 'tikslinė auditorija' : 'target audience');
        var typographyDisplay = rawTextOnly ? typographyLabel : highlightValue(typographyLabel, typographyLabel);
        var positionDisplay = rawTextOnly ? textPositionLabel : highlightValue(textPositionLabel, textPositionLabel);

        var intro = styleDisplay + ': ' + objectDisplay + '.';
        var technical = cameraDisplay + ', ' + lightingDisplay +
            (isFilled(state.color) ? ', ' + colorDisplay + (locale === 'lt' ? ' spalvų gama' : ' color palette') : '') +
            (locale === 'lt' ? ', itin detalu, aukščiausia kokybė, profesionali kompozicija.' : ', highly detailed, top quality, professional composition.');

        var audiencePart = locale === 'lt'
            ? 'Sukurta rinkodaros tikslui: ' + goalDisplay + ', skirta ' + audienceDisplay + ' platformai ' + platformDisplay + '. Nuotaika: ' + toneDisplay + '.'
            : 'Created for the marketing goal of ' + goalDisplay + ', aimed at ' + audienceDisplay + ' on ' + platformDisplay + '. Tone: ' + toneDisplay + '.';

        var parts = [intro, technical, audiencePart];

        if (isFilled(state.headline) || isFilled(state.cta)) {
            var headlineDisplay = rawTextOnly ? state.headline : highlightValue(state.headline, state.headline);
            var ctaDisplay = rawTextOnly ? state.cta : highlightValue(state.cta, state.cta);
            if (locale === 'lt') {
                parts.push(
                    'Reklaminis maketas su integruotu tekstu:' +
                    (isFilled(state.headline) ? ' "' + headlineDisplay + '"' : '') +
                    (isFilled(state.cta) ? ' su kvietimu veikti "' + ctaDisplay + '"' : '') +
                    '. Šrifto stilius: ' + typographyDisplay +
                    '. Teksto pozicija: ' + positionDisplay +
                    '. Reikalavimas: aukštas kontrastas, švari erdvė aplink tekstą skaitomumui užtikrinti.'
                );
            } else {
                parts.push(
                    'Advertising layout with integrated text:' +
                    (isFilled(state.headline) ? ' "' + headlineDisplay + '"' : '') +
                    (isFilled(state.cta) ? ' with the CTA "' + ctaDisplay + '"' : '') +
                    '. Typography: ' + typographyDisplay +
                    '. Text position: ' + positionDisplay +
                    '. Requirement: strong contrast and clean space around the text for readability.'
                );
            }
        }

        return parts.join(' ');
    }

    function getMiniPromptText() {
        return generateMiniPrompt(true);
    }

    function getGeneratorPromptText() {
        return generatePrompt(true);
    }

    function updateCharCount(textValue) {
        var countEl = document.getElementById('generatorCharCount');
        if (countEl) countEl.textContent = String((textValue || '').length);
    }

    function getQualityLevel(filled) {
        if (filled <= 2) return 'weak';
        if (filled <= 4) return 'medium';
        if (filled <= 6) return 'good';
        return 'premium';
    }

    function updateQualityMeter() {
        var meter = document.getElementById('qualityMeter');
        var hint = document.getElementById('qualityHint');
        if (!meter) return;

        var filled = 0;
        trackedFields.forEach(function (field) {
            if (isFilled(state[field])) filled++;
        });

        var quality = getText().quality;
        var levelKey = getQualityLevel(filled);
        var level = quality.levels[levelKey];
        var coreMissing = getMissingStateFields(['goal', 'audience', 'platform', 'object']);
        var polishMissing = getMissingStateFields(['style', 'lighting', 'color']);

        var meterLabel = quality.meterLabel || quality.title;
        meter.textContent = meterLabel + ': ' + filled + '/7 – ' + level.label;
        meter.className = 'generator-quality quality-' + levelKey;
        if (hint) {
            if (coreMissing.length > 0) {
                hint.textContent = quality.missingPrefix + joinLabels(coreMissing.map(getQualityFieldLabel)) + '.';
            } else if (polishMissing.length > 0) {
                hint.textContent = quality.improvePrefix + joinLabels(polishMissing.map(getQualityFieldLabel)) + '.';
            } else {
                hint.textContent = quality.readyHint;
            }
        }
    }

    function updateStepCompletion() {
        var steps = [
            { id: 'stepStatus1', keys: ['goal', 'audience', 'platform'] },
            { id: 'stepStatus2', keys: ['object', 'style', 'lighting'] },
            { id: 'stepStatus3', keys: ['headline', 'cta'], optional: true }
        ];
        var qualityText = getText().quality;

        steps.forEach(function (step) {
            var el = document.getElementById(step.id);
            if (!el) return;
            var missing = getMissingStateFields(step.keys);
            var total = step.keys.length;
            var filled = total - missing.length;
            var missingText = joinLabels(missing.map(getQualityFieldLabel));
            var allLabels = joinLabels(step.keys.map(getQualityFieldLabel));
            var filledLabel = qualityText.stepFilledLabel || 'filled';
            el.className = 'step-status pill';
            if (step.optional && filled === 0) {
                el.classList.add('pill--info');
                el.textContent = '0/' + total + ' ' + qualityText.stepOptional;
            } else if (filled === total) {
                el.classList.add('pill--success', 'is-complete');
                el.textContent = qualityText.stepReady + ' (' + filled + '/' + total + ')';
            } else if (filled > 0) {
                el.classList.add('pill--warning', 'is-partial');
                el.textContent = filled + '/' + total + ' ' + filledLabel + ' – ' + qualityText.stepMissing + ': ' + missingText;
            } else {
                el.classList.add('pill--info');
                el.textContent = '0/' + total + ' ' + filledLabel + ' – ' + qualityText.stepNeeds + ': ' + allLabels;
            }
        });
    }

    function updateMiniOutput() {
        var el = document.getElementById('miniGenOutput');
        if (!el) return;
        el.innerHTML = generateMiniPrompt(false);
    }

    function updateOutput() {
        var el = document.getElementById('generatorOutput');
        if (el) {
            el.classList.remove('is-refreshing');
            void el.offsetWidth;
            el.classList.add('is-refreshing');
            el.innerHTML = generatePrompt(false);
            updateCharCount(el.textContent || '');
        }
        updateQualityMeter();
        updateStepCompletion();
    }

    function updateFormValuesFromState() {
        Object.keys(defaultMiniState).forEach(function (key) {
            var field = document.getElementById('mini-' + key);
            if (field) field.value = miniState[key];
        });
        Object.keys(defaultState).forEach(function (key) {
            var field = document.querySelector('#generator [name="' + key + '"]');
            if (field) field.value = state[key];
        });
    }

    function updatePresetButtonState(activePreset) {
        var buttons = document.querySelectorAll('.mini-gen-preset-btn[data-preset]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.classList.toggle('is-active', button.getAttribute('data-preset') === activePreset);
        });
    }

    function applyMiniPreset(presetName) {
        var presetSet = PRESETS[presetName];
        var preset = presetSet ? presetSet[locale] : null;
        if (!preset) return;

        ['object', 'style', 'lighting', 'platform', 'color'].forEach(function (key) {
            if (preset[key] !== undefined) {
                miniState[key] = preset[key];
            }
        });

        [
            'goal', 'audience', 'platform', 'tone', 'object', 'style', 'lighting',
            'camera', 'color', 'headline', 'cta', 'textPosition', 'typography'
        ].forEach(function (key) {
            if (preset[key] !== undefined) {
                state[key] = preset[key];
            }
        });

        updateFormValuesFromState();
        updateMiniOutput();
        updateOutput();
        updatePresetButtonState(presetName);
        setActivePromptSource('mini', false);
        saveAppState();
    }

    function transferToFullGen() {
        ['object', 'style', 'lighting', 'platform', 'color'].forEach(function (key) {
            state[key] = miniState[key];
        });
        updateFormValuesFromState();
        updateOutput();
        setActivePromptSource('full', false);
        saveAppState();

        if (typeof window.openAccordionSection === 'function') {
            window.openAccordionSection('fullGenerator');
        }
        var target = document.getElementById('fullGenerator');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function openToolsFromMini() {
        if (typeof window.openAccordionSection === 'function') {
            window.openAccordionSection('tools');
        }
        var target = document.getElementById('tools');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function setupColorChips() {
        Array.prototype.forEach.call(document.querySelectorAll('.color-chips'), function (group) {
            var targetId = group.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (!input) return;

            var chips = group.querySelectorAll('.color-chip');

            function syncFromInput() {
                var value = String(input.value || '').trim();
                Array.prototype.forEach.call(chips, function (chip) {
                    var isActive = chip.getAttribute('data-color') === value;
                    chip.classList.toggle('is-active', isActive);
                    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });
            }

            Array.prototype.forEach.call(chips, function (chip) {
                chip.setAttribute('aria-pressed', 'false');
                chip.addEventListener('click', function () {
                    input.value = chip.getAttribute('data-color') || '';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    syncFromInput();
                });
            });

            input.addEventListener('input', syncFromInput);
            syncFromInput();
        });
    }

    function setupMiniGenerator() {
        var fields = document.querySelectorAll('.mini-gen-form input, .mini-gen-form select, .mini-gen-form textarea');
        Array.prototype.forEach.call(fields, function (field) {
            var name = field.name || '';
            var key = name.replace('mini-', '');
            function handleMiniInput() {
                if (key && Object.prototype.hasOwnProperty.call(miniState, key)) {
                    miniState[key] = field.value;
                    setActivePromptSource('mini', false);
                    updateMiniOutput();
                    saveAppState();
                }
            }
            field.addEventListener('input', handleMiniInput);
            field.addEventListener('change', handleMiniInput);
        });

        Array.prototype.forEach.call(document.querySelectorAll('.mini-gen-preset-btn[data-preset]'), function (button) {
            button.addEventListener('click', function () {
                applyMiniPreset(button.getAttribute('data-preset'));
            });
        });

        var transferBtn = document.getElementById('fullGenTransferBtn');
        var miniToToolsBtn = document.getElementById('miniToToolsBtn');
        var miniToProBtn = document.getElementById('miniToProBtn');

        if (transferBtn) transferBtn.addEventListener('click', transferToFullGen);
        if (miniToToolsBtn) miniToToolsBtn.addEventListener('click', openToolsFromMini);
        if (miniToProBtn) miniToProBtn.addEventListener('click', transferToFullGen);

        updateMiniOutput();
    }

    function setupThemeToggle() {
        var button = document.getElementById('themeToggleBtn');
        if (!button) return;

        var initialTheme = 'light';
        try {
            initialTheme = localStorage.getItem(THEME_KEY) || initialTheme;
        } catch (_) { /* ignore */ }

        setTheme(initialTheme);

        button.addEventListener('click', function () {
            var currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    function resetGenerator() {
        state = Object.assign({}, defaultState);
        miniState = Object.assign({}, defaultMiniState);
        updatePresetButtonState('');
        updateFormValuesFromState();
        updateMiniOutput();
        updateOutput();
        setActivePromptSource('mini', false);
        saveAppState();
    }

    function handleInput(event) {
        var name = event.target.name;
        if (name && Object.prototype.hasOwnProperty.call(state, name)) {
            state[name] = event.target.value;
            setActivePromptSource('full', false);
            updateOutput();
            saveAppState();
        }
    }

    function setupPresets() {
        var resetBtn = document.getElementById('generatorResetBtn');
        if (resetBtn) resetBtn.addEventListener('click', resetGenerator);
    }

    function setupStepHighlight() {
        var steps = document.querySelectorAll('.generator-step[data-step]');
        Array.prototype.forEach.call(steps, function (step) {
            step.addEventListener('focusin', function () {
                Array.prototype.forEach.call(steps, function (item) {
                    item.style.borderColor = '';
                });
                step.style.borderColor = 'rgba(30, 58, 95, 0.35)';
            });
        });
    }

    function setupTips() {
        var toggle = document.getElementById('tipsToggle');
        var content = document.getElementById('tipsContent');
        var chevron = document.getElementById('tipsChevron');
        if (!toggle || !content) return;

        toggle.addEventListener('click', function () {
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            content.hidden = isOpen;
            if (chevron) {
                chevron.setAttribute('data-lucide', isOpen ? 'chevron-down' : 'chevron-up');
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons({ root: toggle });
                }
            }
        });
    }

    function fallbackCopy(textValue) {
        var textarea = document.getElementById('hiddenTextarea');
        if (!textarea) return;
        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        textarea.style.opacity = '0';
        textarea.value = textValue;
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (_) { /* ignore */ }
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        textarea.style.opacity = '0';
    }

    function showToastIfAvailable() {
        var toast = document.getElementById('toast');
        if (!toast) return;
        var message = document.getElementById('toastMessage');
        if (message) message.textContent = locale === 'lt' ? 'Nukopijuota.' : 'Copied.';
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
        }, 3000);
    }

    function copyText(textValue) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(textValue).then(function () {
                showToastIfAvailable();
            }).catch(function () {
                fallbackCopy(textValue);
                showToastIfAvailable();
            });
            return;
        }
        fallbackCopy(textValue);
        showToastIfAvailable();
    }

    function updateToolCta() {
        var ctaBtn = document.getElementById('toolsActionCta');
        var hintEl = document.getElementById('toolsActionHint');
        var text = getText().tools;
        if (!ctaBtn || !hintEl) return;

        if (!selectedToolKey) {
            ctaBtn.disabled = true;
            ctaBtn.querySelector('span').textContent = text.ctaBase;
            hintEl.textContent = text.defaultHint + ' ' + text.sourceHintPrefix + getActivePromptSourceLabel() + '.';
            return;
        }

        var toolName = TOOLS[selectedToolKey] ? TOOLS[selectedToolKey].name : '';
        var selectedCard = document.querySelector('.tool-card.is-selected');
        var intro = selectedCard && selectedCard.classList.contains('tool-card-recommended')
            ? text.recommendedPrefix + toolName + text.recommendedReason
            : text.selectedPrefix + toolName + '.';
        ctaBtn.disabled = false;
        ctaBtn.querySelector('span').textContent = text.ctaBase + ' ' + toolName;
        hintEl.textContent = intro + ' ' + text.selectedHint + getActivePromptSourceObjectText() + text.selectedHintSuffix + toolName + '.';
    }

    function selectToolCard(card, shouldFocus) {
        if (!card) return;
        var cards = document.querySelectorAll('.tool-card[data-tool]');
        Array.prototype.forEach.call(cards, function (item) {
            var active = item === card;
            item.classList.toggle('is-selected', active);
            item.setAttribute('aria-checked', active ? 'true' : 'false');
            item.setAttribute('tabindex', active ? '0' : '-1');
        });
        selectedToolKey = card.getAttribute('data-tool') || '';
        selectedToolUrl = card.getAttribute('data-url') || '';
        if (shouldFocus) card.focus();
        updateToolCta();
        saveAppState();
    }

    function setupToolCards() {
        var cards = document.querySelectorAll('.tool-card[data-tool]');
        var ctaBtn = document.getElementById('toolsActionCta');

        Array.prototype.forEach.call(cards, function (card, index) {
            card.setAttribute('tabindex', index === 0 ? '0' : '-1');
            card.addEventListener('click', function () {
                selectToolCard(card, false);
            });
            card.addEventListener('keydown', function (event) {
                var currentIndex = TOOL_ORDER.indexOf(card.getAttribute('data-tool'));
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    var nextIndex = (currentIndex + 1) % cards.length;
                    selectToolCard(cards[nextIndex], true);
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    var previousIndex = (currentIndex - 1 + cards.length) % cards.length;
                    selectToolCard(cards[previousIndex], true);
                } else if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    selectToolCard(card, false);
                }
            });
        });

        if (selectedToolKey) {
            var selected = document.querySelector('.tool-card[data-tool="' + selectedToolKey + '"]');
            if (selected) {
                selectToolCard(selected, false);
            } else {
                selectedToolKey = '';
                selectedToolUrl = '';
            }
        } else if (cards.length > 0) {
            selectToolCard(cards[0], false);
        }
        updateToolCta();

        if (ctaBtn) {
            ctaBtn.addEventListener('click', function () {
                if (!selectedToolUrl) return;
                copyText(getActivePromptText());
                var selectedCard = document.querySelector('.tool-card.is-selected');
                if (selectedCard) {
                    selectedCard.classList.add('was-used');
                    setTimeout(function () {
                        selectedCard.classList.remove('was-used');
                    }, 1500);
                }
                window.open(selectedToolUrl, '_blank');
            });
        }
    }

    function setupGeneratorCopy() {
        var miniCopyBtn = document.getElementById('miniGenCopyBtn');
        var stickyCopyBtn = document.getElementById('stickyCopyBtn');
        var copyBtn = document.getElementById('genCopyBtn');
        var copyCta = document.getElementById('genCopyCta');

        if (miniCopyBtn) {
            miniCopyBtn.addEventListener('click', function () {
                setActivePromptSource('mini', false);
                copyText(getMiniPromptText());
            });
        }
        if (stickyCopyBtn) {
            stickyCopyBtn.addEventListener('click', function () {
                scrollToActivePrompt();
            });
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                setActivePromptSource('full', false);
                copyText(getGeneratorPromptText());
            });
        }
        if (copyCta) {
            copyCta.addEventListener('click', function () {
                setActivePromptSource('full', false);
                copyText(getGeneratorPromptText());
            });
        }
    }

    function setupLanguageToggle() {
        var ltBtn = document.getElementById('langLtBtn');
        var enBtn = document.getElementById('langEnBtn');

        function switchLocale(nextLocale) {
            if (nextLocale === locale) return;
            var previousLocale = locale;
            locale = nextLocale;
            saveLocale(nextLocale);

            miniState.color = translateKnownColorValue(previousLocale, nextLocale, miniState.color);
            state.color = translateKnownColorValue(previousLocale, nextLocale, state.color);

            if (getLocaleFromPathname()) {
                window.location.href = buildLocaleUrl(nextLocale);
                return;
            }

            applyDocumentHead();
            applyStaticLocaleText();
            updateFormValuesFromState();
            updateMiniOutput();
            updateOutput();
            updateToolCta();
            setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
            updateHistoryLangParam(nextLocale);
            saveAppState();
        }

        if (ltBtn) {
            ltBtn.addEventListener('click', function () {
                switchLocale('lt');
            });
        }
        if (enBtn) {
            enBtn.addEventListener('click', function () {
                switchLocale('en');
            });
        }
    }

    window._getGeneratorPromptText = getGeneratorPromptText;
    window._getMiniPromptText = getMiniPromptText;

    document.addEventListener('DOMContentLoaded', function () {
        locale = resolveLocale();
        saveLocale(locale);
        restoreAppState();

        applyDocumentHead();
        applyStaticLocaleText();
        updateFormValuesFromState();

        var fields = document.querySelectorAll('.generator-step input, .generator-step select, .generator-step textarea');
        Array.prototype.forEach.call(fields, function (field) {
            field.addEventListener('input', handleInput);
            field.addEventListener('change', handleInput);
        });

        updateMiniOutput();
        updateOutput();
        setupMiniGenerator();
        setupColorChips();
        updateFormValuesFromState();
        setupStepHighlight();
        setupTips();
        setupToolCards();
        setupPresets();
        setupThemeToggle();
        setupGeneratorCopy();
        setupLanguageToggle();
    });
})();
