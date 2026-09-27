# Visual parity report — main--bmw--moved-permanently.aem.page vs www.bmw.de

Generated 2026-09-27T08:59:52.767Z (interim — round 2 preview captures, round 3 fixes deployed but not yet re-captured). Widths: 1440, 768, 390 px. Machine-readable: `parity-report.json`.

## Method
- Every page captured on live and preview at each width (tools: `migration-work/parity-capture.mjs`, one page per process,
  screenshots capped at 8000 px). Signature per capture: page height, horizontal overflow, every visible text run
  (text, font size/weight/colour/alignment, box), images (box, loaded), buttons, header/footer size.
- Compared per page/width (`migration-work/parity-compare.mjs`): height ratio (±10%), overflow, missing text (>8% of runs),
  typography (size ±1.5px, weight, colour, case, alignment), layout (x/width of matched text, heading position),
  image geometry (size/aspect in order), broken images, header/footer size and link count, JS errors.
  The metric is strict: "differences remain" often means small offsets (e.g. centred headings measured as inline boxes).

## Summary
| status | pages |
|---|---|
| match (all three widths) | 1 |
| differences remain | 218 |
| partially captured | 0 |
| could not capture | 1 |

Remaining issue kinds (page-widths): layout 446, height 369, image-geometry 315, typography 248, missing-text 175, footer-links 134, broken-images 7, footer-height 4, images 1, overflow 1

## Fix rounds
- R0 (home findings): stage poster, teaser spacing variants, grid-width columns detection.
- R1/R2: type styles from source classes, centered intros, content spans, header style per page, block crops/tabs.
- R3: carousel/model-overview tracks (centered-list rule), content-table accordions, all-models chips, columns with
  video/download/reverse, tablet spans, tech-data headings, sitemap.

## Genuinely impossible / external gaps
- Live-only personalisation (AEM xftoggle variations, BMW Target/tag-manager content): the replica shows the default variation.
- Data that needs the `bmw-proxy` worker until it is deployed: dealer locator data + HERE map, model compare,
  My BMW login flyout data, live stock cars in the preview slider, AI assistant answers.
- Live Chat (cctapiemea) only works on a bmw.de referer.
- Live defects not reproduced: missing social icons in the live footer on model pages; broken og:image.
- Video autoplay timing/first frames differ between runs (both sites).

## Per page
| page | status | widths | height preview/live (1440/768/390) | remaining (top) |
|---|---|---|---|---|
| /de/bmw-alpina | differences remain | 1440, 768, 390 | 140% / 128% / 105% | 1440: [height] preview 13481px vs live 9644px (140%); 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma" |
| /de/bmw-financial-services-overview/bmw-leasing | differences remain | 1440, 768, 390 | 246% / 201% / 155% | 1440: [height] preview 39258px vs live 15957px (246%); 1440: [layout] 122/179 text blocks placed differently: "BMW Leasing. Die Vorteile auf ": x 96/385, w 1248/671 / "Nutzen statt besitzen.": x 460/233 / "Zahlen Sie nur |
| /de/bmw-financial-services-overview/form-finder | differences remain | 1440, 768, 390 | 100% / 99% / 80% | 390: [height] preview 2530px vs live 3171px (80%) |
| /de/bmw-modelle-vergleichen | differences remain | 1440, 768, 390 | 15% / 22% / 15% | 1440: [height] preview 2136px vs live 13920px (15%); 768: [height] preview 2623px vs live 12106px (22%) |
| /de/bmw-service-hub | differences remain | 1440, 768, 390 | 168% / 129% / 111% | 1440: [height] preview 26293px vs live 15650px (168%); 1440: [layout] 72/144 text blocks placed differently: "BMW Service.": w 512/272 / "Bei Ihrem BMW Service Partner ": x 96/308, w 1248/824 / "Ihre Vorteile auf einen B |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen | differences remain | 1440, 768, 390 | 94% / 96% / 81% | 1440: [layout] 4/11 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 96/383, w 1248/674 / "Finden Sie das richtige Servic": x 96/308, w 1248/824 / "Jetzt Pa; 768: [layout] 4/11 text blocks placed diffe |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen | differences remain | 1440, 768, 390 | 94% / 96% / 81% | 1440: [layout] 4/10 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 96/383, w 1248/674 / "Finden Sie das richtige Servic": x 96/308, w 1248/824 / "Jetzt Pa; 768: [layout] 4/10 text blocks placed diffe |
| /de/bmw-service-hub/bmw-service/unfall-pannenhilfe | differences remain | 1440, 768, 390 | 113% / 104% / 99% | 1440: [height] preview 12304px vs live 10870px (113%); 1440: [layout] 49/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 / "BMW Service": x 332/236 / "Proactive Care": x 450/354 / "Service Inclusive" |
| /de/campaigns/bmw-fuer-geschaeftskunden | differences remain | 1440, 768, 390 | 192% / 149% / 129% | 1440: [height] preview 14126px vs live 7374px (192%); 1440: [typography] 16 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Ob Sie freiberuflich tätig sind, ein": size 28/20, weight 300/700 /  |
| /de/campaigns/hvo100-erneuerbarer-diesel | differences remain | 1440, 768, 390 | 96% / 92% / 86% | 1440: [layout] 15/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 / "Ihr BMW Diesel ist bereit für ": w 512/389 / "Was ist HVO100?": x 96/583, w; 768: [layout] 20/31 text blocks placed diff |
| /de/digital-services/bmw-connecteddrive | differences remain | 1440, 768, 390 | 184% / 135% / 119% | 1440: [height] preview 24362px vs live 13211px (184%); 1440: [layout] 89/125 text blocks placed differently: "Die Vorteile von BMW Connected": x 96/414, w 1248/612 / "Highlights von BMW ConnectedDr": x 96/426, w 1248/589 |
| /de/digital-services/bmw-digital-key | differences remain | 1440, 768, 390 | 165% / 134% / 113% | 1440: [height] preview 14067px vs live 8506px (165%); 1440: [layout] 34/56 text blocks placed differently: "BMW Digital Key.": w 512/334 / "Viel mehr als nur ein Schlüsse": x 96/474, w 1248/492 / "Entriegeln und starten  |
| /de/digital-services/bmw-entertainment | differences remain | 1440, 768, 390 | 138% / 122% / 99% | 1440: [height] preview 8210px vs live 5949px (138%); 1440: [layout] 17/28 text blocks placed differently: "BMW Entertainment. Verkürzt Ih": x 96/346, w 1248/749 / "Mit dem Besten aus Nachrichten": x 96/308, w 1248/824 /  |
| /de/digital-services/bmw-idrive | differences remain | 1440, 768, 390 | 160% / 125% / 107% | 1440: [height] preview 12060px vs live 7522px (160%); 1440: [layout] 22/43 text blocks placed differently: "BMW iDrive.": w 512/240 / "BMW Panoramic iDrive mit innov": x 96/362, w 1248/717 / "Das neue BMW Panoramic iDriv |
| /de/digital-services/bmw-intelligent-personal-assistant | differences remain | 1440, 768, 390 | 142% / 114% / 97% | 1440: [height] preview 10363px vs live 7298px (142%); 1440: [layout] 28/38 text blocks placed differently: "Der BMW Intelligent Personal A": w 512/391 / "BMW Intelligent Personal Assis": x 96/327, w 1248/787 / "Fahrzeuge |
| /de/digital-services/bmw-maps | differences remain | 1440, 768, 390 | 142% / 125% / 97% | 1440: [height] preview 9551px vs live 6742px (142%); 1440: [layout] 30/40 text blocks placed differently: "BMW Maps.": w 512/239 / "Ihr täglicher Begleiter. BMW M": x 96/447, w 1248/546 / "Gut informiert. Schnell orient" |
| /de/elektroauto | differences remain | 1440, 768, 390 | 129% / 125% / 93% | 1440: [height] preview 16024px vs live 12460px (129%); 1440: [typography] 10 runs differ: "Dynamisch. Komfortabel. 100 % elektr": size 18/23 / "Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) / "E-Auto Batterie und Te |
| /de/elektroauto/batterie-technologie | differences remain | 1440, 768, 390 | 117% / 102% / 92% | 1440: [height] preview 15198px vs live 12953px (117%); 1440: [typography] 8 runs differ: "Die Batterie": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Optimierung der Lebensdauer": align start/center / "Die E-Auto-Batterie |
| /de/elektroauto/bmw-charging-support | differences remain | 1440, 768, 390 | 162% / 147% / 87% | 1440: [height] preview 9742px vs live 6007px (162%); 1440: [typography] 3 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Vorvertragliche Transparenzinformati": align start/center / "Info |
| /de/elektroauto/elektroauto-kosten | differences remain | 1440, 768, 390 | 156% / 142% / 102% | 1440: [height] preview 18025px vs live 11563px (156%); 1440: [typography] 6 runs differ: "Kauf. Unterhalt. Wartung.": size 18/23 / "E-Autos im Preisvergleich": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Sofort verfügbar |
| /de/elektroauto/elektroauto-reichweite | differences remain | 1440, 768, 390 | 194% / 166% / 114% | 1440: [height] preview 20090px vs live 10341px (194%); 1440: [layout] 33/59 text blocks placed differently: "Die Reichweite von Elektroauto": w 512/371 / "Komfortabel im Alltag unterweg": w 512/344 / "Weit. Weiter. Elekt |
| /de/elektroauto/elektroautos-vorteile | differences remain | 1440, 768, 390 | 179% / 140% / 117% | 1440: [height] preview 16546px vs live 9246px (179%); 1440: [layout] 37/56 text blocks placed differently: "Die Vorteile und Auswirkungen ": w 512/359 / "Kostenplanung. Alltagsnutzen. ": w 512/315 / "Die Kostenvorteile v |
| /de/elektroauto/foerderungen | differences remain | 1440, 768, 390 | 226% / 164% / 136% | 1440: [height] preview 15966px vs live 7062px (226%); 1440: [typography] 27 runs differ: "Dienstwagenbesteuerung Beispielrechn": size 18/15 / "Steuersatz 0,25 %": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Bruttogehalt: |
| /de/elektroauto/foerderungen-privatkunden | differences remain | 1440, 768, 390 | 186% / 144% / 125% | 1440: [height] preview 18217px vs live 9787px (186%); 1440: [layout] 63/78 text blocks placed differently: "AI-generated content": x -1/1395 / "Mit dem neuen Förderprogramm d": x 96/308, w 1248/824 / "Neues Förderprogram |
| /de/elektroauto/gebrauchte-elektroautos | differences remain | 1440, 768, 390 | 229% / 172% / 138% | 1440: [height] preview 24636px vs live 10754px (229%); 1440: [layout] 56/84 text blocks placed differently: "Das spricht für einen elektris": x 96/317, w 1248/807 / "Lohnt sich der Kauf eines gebr": x 96/308, w 1248/824  |
| /de/elektroauto/home-charging | differences remain | 1440, 768, 390 | 158% / 134% / 118% | 1440: [height] preview 20596px vs live 13049px (158%); 1440: [layout] 58/108 text blocks placed differently: "E-Auto zuhause laden.": w 616/449 / "Laden Sie Ihr Elektroauto zuha": x 96/308, w 1248/824 / "BMW Elektromobil |
| /de/elektroauto/plug-in-hybrid | differences remain | 1440, 768, 390 | 126% / 125% / 94% | 1440: [height] preview 15510px vs live 12327px (126%); 1440: [typography] 11 runs differ: "Flexibel. Effizient. Kraftvoll.": size 18/23 / "PHEV Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) / "So funktioniert ein Hy |
| /de/elektroauto/public-charging | differences remain | 1440, 768, 390 | 170% / 130% / 103% | 1440: [height] preview 23807px vs live 14035px (170%); 1440: [layout] 44/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 / "Sorgenfreies Laden, einfach, j": x 96/308, w 1248/824 / "Elektroa |
| /de/elektroauto/rabatt-auf-die-bmw-wallbox-professional | differences remain | 1440, 768, 390 | 99% / 98% / 78% | 390: [height] preview 2324px vs live 2985px (78%) |
| /de/fastlane/dealer-locator | differences remain | 1440, 768, 390 | 94% / 89% / 71% | 1440: [missing-text] 516/516 live text runs not visible on preview: "Suche nach Standort", "Suche nach Namen", "Neufahrzeug", "Gebrauchte Fahrzeuge"; 768: [height] preview 2173px vs live 2432px (89%) |
| /de/footer/footer-section/cookie-policy | differences remain | 1440, 768, 390 | 20% / 19% / 11% | 1440: [height] preview 1412px vs live 7085px (20%); 768: [height] preview 1533px vs live 7884px (19%) |
| /de/footer/metanavigation/bmw-barrierefreiheit | differences remain | 1440, 768, 390 | 94% / 77% / 96% | 1440: [typography] 3 runs differ: "Kaufen": color rgb(28, 105, 212)/rgb(38, 38, 38) / "Tel.: +49 89 1250 16000": size 15/18 / "Nachricht senden": size 15/18; 1440: [layout] 15/51 text blocks placed differently: "Barriere |
| /de/footer/metanavigation/bmw-betrugsfaelle | differences remain | 1440, 768, 390 | 85% / 79% / 98% | 1440: [height] preview 3402px vs live 4022px (85%); 1440: [layout] 35/36 text blocks placed differently: "Sicherheit im Internet, Betrug": x 96/405, w 1248/631 / "Wenn Sie verdächtige Mitteilun": x 96/308, w 1248/824 / " |
| /de/footer/metanavigation/data-privacy | differences remain | 1440, 768, 390 | 40% / 44% / 35% | 1440: [height] preview 2616px vs live 6591px (40%); 1440: [layout] 3/12 text blocks placed differently: "BMW Datenschutzhinweise.": x 96/497, w 1248/447 / "Der hohe Anspruch, den Sie an ": x 96/308, w 1248/824 / "Die BMW |
| /de/footer/metanavigation/data-privacy/data-category | match | 1440, 768, 390 | 97% / 96% / 99% | – |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-c | differences remain | 1440, 768, 390 | 99% / 99% / 72% | 1440: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"; 768: [missing-text] 2/6 live text runs not visible on preview: "BMW  |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-d | differences remain | 1440, 768, 390 | 99% / 99% / 78% | 390: [height] preview 2352px vs live 3011px (78%) |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-e | differences remain | 1440, 768, 390 | 98% / 98% / 81% | 390: [height] preview 2800px vs live 3477px (81%) |
| /de/footer/metanavigation/eu-batterieverordnung | differences remain | 1440, 768, 390 | 90% / 88% / 65% | 1440: [layout] 3/3 text blocks placed differently: "EU Batterieverordnung.": x 95/490, w 1/461 / "Abfallvermeidung und Bewirtsch": x 96/367, w 1248/706, ypos 8%/14% / "Artikel; 768: [height] preview 1845px vs live 2094px |
| /de/footer/metanavigation/legal-disclaimer-pool/produktsicherheitsverordnung | differences remain | 1440, 768, 390 | 98% / 98% / 69% | 390: [height] preview 1482px vs live 2141px (69%) |
| /de/footer/metanavigation/legal-disclaimer-pool/legal-disclaimer | differences remain | 1440, 768, 390 | 95% / 96% / 84% | 1440: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 1248/321 / "Außergerichtliche Streitbeileg": w 1248/347 / "Anlaufstellen für hinweisgeben": w 124; 768: [layout] 4/22 text blocks placed diffe |
| /de/footer/metanavigation/legal-notice-pool/imprint | differences remain | 1440, 768, 390 | 98% / 96% / 78% | 390: [height] preview 2746px vs live 3515px (78%) |
| /de/home | differences remain | 1440, 768, 390 | 112% / 108% / 88% | 1440: [height] preview 5428px vs live 4832px (112%); 1440: [layout] 8/24 text blocks placed differently: "Finden Sie Ihren BMW.": x 96/539, w 1248/363 / "Verfügbare Gebrauchtwagen.": x 118/470 / "Gebrauchtwagen suchen":  |
| /de/konfigurator | differences remain | 1440, 768, 390 | 101% / 112% / 109% | 1440: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Kompakt": color rgb(38, 38, 38)/rg; 1440: [layout] 4/20 text blocks placed  |
| /de/landingpage/bmw-fahrfreude-gewinnen | differences remain | 1440, 768, 390 | 96% / 95% / 83% | 1440: [layout] 5/12 text blocks placed differently: "Pure Fahrfreude gewinnen.": w 512/279 / "Vorfreude. Spielfreude. Fahrfr": x 96/444, w 1248/553 / "Sichern Sie sich mit den; 768: [layout] 6/12 text blocks placed diffe |
| /de/landingpage/shops | differences remain | 1440, 768, 390 | 128% / 107% / 89% | 1440: [height] preview 4461px vs live 3495px (128%); 1440: [typography] 5 runs differ: "Neuwagen finden": size 18/15 / "Gebrauchtwagen finden": size 18/15 / "Digitale Dienste finden": size 18/15 / "BMW Zubehör finden": s |
| /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv | differences remain | 1440, 768, 390 | 96% / 95% / 77% | 390: [height] preview 2522px vs live 3259px (77%) |
| /de/mehr-bmw/bmw-gebrauchte | differences remain | 1440, 768, 390 | 90% / 137% / 78% | 1440: [height] preview 2593px vs live 2885px (90%); 1440: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content" |
| /de/mehr-bmw/bmw-gebrauchte/europlusgarantie | differences remain | 1440, 768, 390 | 99% / 128% / 87% | 768: [height] preview 6068px vs live 4731px (128%); 768: [layout] 14/35 text blocks placed differently: "DIE EUROPLUS GARANTIE.": x 64/155, w 640/455 / "DAMIT DIE FREUDE DAUERHAFT BLE": x 64/135 / "IHRE VORTEILE AUF EINE |
| /de/mehr-bmw/bmw-gebrauchte/garantie | differences remain | 1440, 768, 390 | 97% / 126% / 86% | 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(102, 102, 102)/rgb(25; 1440: [layout] 5/31 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte | differences remain | 1440, 768, 390 | 95% / 95% / 85% | 1440: [typography] 5 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "Junge Gebrauchte von BMW.": size 43/35 / "BMW Premium Selection Garantie": al; 1440: [layout] 6/35 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/premium-selection | differences remain | 1440, 768, 390 | 101% / 152% / 105% | 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."; 1440: [typography] 13 runs differ: "DIE NEUEN |
| /de/mehr-bmw/bmw-individual | differences remain | 1440, 768, 390 | 160% / 141% / 120% | 1440: [height] preview 19529px vs live 12192px (160%); 1440: [layout] 42/55 text blocks placed differently: "BMW Individual.": w 512/316 / "Außergewöhnlicher Stil, der au": w 512/365 / "Sie setzen auf Stil statt auf ": x |
| /de/mehr-bmw/bmw-special-sales | differences remain | 1440, 768, 390 | 138% / 122% / 104% | 1440: [height] preview 8181px vs live 5918px (138%); 1440: [layout] 15/30 text blocks placed differently: "Spezielle Produkte für speziel": x 96/346, w 1248/748 / "BMW bietet Ihnen eine Vielzahl": x 96/308, w 1248/824 /  |
| /de/mehr-bmw/bmw-special-sales/bmw-7-protection | differences remain | 1440, 768, 390 | 163% / 134% / 121% | 1440: [height] preview 17057px vs live 10438px (163%); 1440: [layout] 35/67 text blocks placed differently: "BMW 7 Protection.": w 512/361 / "Vorteile auf einen Blick.": x 96/536, w 1248/368 / "Erstklassige Fahrdynamik." |
| /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales | differences remain | 1440, 768, 390 | 144% / 118% / 105% | 1440: [height] preview 8668px vs live 6009px (144%); 1440: [layout] 18/43 text blocks placed differently: "Exklusive Vorteile für Diploma": x 96/377, w 1248/687, ypos 15%/21% / "Sonderkonditionen für Dienstwa": x 224/108 |
| /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge | differences remain | 1440, 768, 390 | 175% / 133% / 117% | 1440: [height] preview 19492px vs live 11163px (175%); 1440: [layout] 67/119 text blocks placed differently: "Effizient. Zuverlässig. Profes": w 512/367 / "Die beste Wahl für Ihren Einsa": x 96/463, w 1248/514 / "Erstkla |
| /de/mehr-bmw/bmw-special-sales/bmw-military-sales | differences remain | 1440, 768, 390 | 135% / 112% / 100% | 1440: [height] preview 9450px vs live 7021px (135%); 1440: [typography] 5 runs differ: "Einen besonderen Service bereiten wi": size 18/23 / "Service & Konditionen": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Direkten Ko |
| /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge | differences remain | 1440, 768, 390 | 226% / 165% / 139% | 1440: [height] preview 20322px vs live 8979px (226%); 1440: [layout] 36/73 text blocks placed differently: "Diese Vorteile bieten Ihnen di": x 96/430, w 1248/580 / "Gepanzerte Modelle, vollelektr": w 565/353 / "Ganz auf  |
| /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6 | differences remain | 1440, 768, 390 | 156% / 123% / 113% | 1440: [height] preview 17728px vs live 11384px (156%); 1440: [layout] 31/83 text blocks placed differently: "Vorteile auf einen Blick.": x 96/536, w 1248/368 / "Einzigartiges Fahrerlebnis.": x 106/583 / "Modernes Schutzk |
| /de/mehr-bmw/concept-cars/bmw-speedtop | differences remain | 1440, 768, 390 | 89% / 84% / 79% | 1440: [height] preview 8605px vs live 9675px (89%); 1440: [layout] 11/40 text blocks placed differently: "BMW Speedtop.": w 512/319 / "Limitiertes Sammlerstück": w 512/263 / "Ein emotionales Sammlerstück.": w 376/256 / " |
| /de/mehr-bmw/die-exklusiven-bmw-automobile | differences remain | 1440, 768, 390 | 144% / 130% / 109% | 1440: [height] preview 16094px vs live 11146px (144%); 1440: [layout] 29/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 / "Die exklusiven BMW Fahrzeuge e": x 96/308, w 1248/824 / "Modellvi |
| /de/mehr-bmw/digital-services-act | differences remain | 1440, 768, 390 | 85% / 85% / 76% | 1440: [height] preview 4633px vs live 5480px (85%); 1440: [layout] 35/37 text blocks placed differently: "Gesetz über digitale Dienste (": x 96/426, w 1248/589 / "Soweit die BMW AG („BMW“, „wir": x 96/308, w 1248/824 / " |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass | differences remain | 1440, 768, 390 | 93% / 93% / 81% | 1440: [typography] 3 runs differ: "Mehr erfahren": size 18/15 / "Zum Interview": size 18/15 / "Zum Beitrag": size 18/15; 1440: [layout] 4/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 / " |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister | differences remain | 1440, 768, 390 | 145% / 108% / 87% | 1440: [height] preview 16147px vs live 11145px (145%); 1440: [typography] 6 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center / "Hollywood bei BMW.": align start/center / "Im Rahmen eine |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring | differences remain | 1440, 768, 390 | 94% / 93% / 85% | 1440: [typography] 3 runs differ: "Mehr erfahren": size 18/15 / "Zum Interview": size 18/15 / "Jetzt teilnehmen": size 18/15; 1440: [layout] 4/20 text blocks placed differently: "BMW AUF DEM NÜRBURGRING.": x 468/388 / "B |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5 | differences remain | 1440, 768, 390 | 97% / 93% / 90% | 1440: [layout] 11/27 text blocks placed differently: "Der BMW X5.": w 512/260 / "Meilensteine einer Erfolgsgesc": w 512/385 / "Bis heute zählt der BMW X5 zu ": x 189/374, w 10; 768: [layout] 11/27 text blocks placed diff |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte | differences remain | 1440, 768, 390 | 95% / 89% / 92% | 1440: [layout] 26/50 text blocks placed differently: "Kurs auf Grün.": w 512/279 / "SAP elektrifiziert die Flotte ": x 100/309, w 1241/822 / "Bereits im Oktober 2021 hat SA": ; 768: [height] preview 11134px vs live 12535 |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude | differences remain | 1440, 768, 390 | 100% / 86% / 89% | 1440: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Eine zentrale Steuereinheit für die ": align start/center / "Eine neue Verbi; 1440: [layout] 11/27 text blocks placed |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement | differences remain | 1440, 768, 390 | 97% / 95% / 92% | 1440: [layout] 38/79 text blocks placed differently: "Startseite Großkunden": x 96/0 / "Online-Magazin": x 280/184 / "Wie KI, Echtzeitdaten und digi": x 96/340, w 1248/760 / "; 768: [layout] 41/79 text blocks placed diff |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt | differences remain | 1440, 768, 390 | 92% / 93% / 78% | 1440: [layout] 3/11 text blocks placed differently: "Was uns bewegt.": w 616/334 / "Der BMW Business Class Podcast": w 616/362 / "WAS UNS BEWEGT. DER BMW BUSINE": x 96/224; 768: [layout] 3/11 text blocks placed different |
| /de/mehr-bmw/kundenbetreuung | differences remain | 1440, 768, 390 | 149% / 150% / 118% | 1440: [height] preview 7579px vs live 5100px (149%); 1440: [layout] 21/40 text blocks placed differently: "Wie können wir helfen?": x 208/537, w 1032/363 / "Ihr Zugang zu den BMW Online-S": x 96/285, w 1248/870 / "Häufig |
| /de/mehr-bmw/sport-und-events/bmw-basketball | differences remain | 1440, 768, 390 | 154% / 199% / 139% | 1440: [height] preview 7396px vs live 4807px (154%); 1440: [layout] 7/19 text blocks placed differently: "WE POWER JOY. TOGETHER.": x 96/483, w 1248/475, ypos 20%/31% / "Zwei Marken, eine Heimatstadt,": x 96/308, w 1248/ |
| /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park | differences remain | 1440, 768, 390 | 162% / 176% / 127% | 1440: [height] preview 5831px vs live 3607px (162%); 1440: [layout] 7/17 text blocks placed differently: "Mehr BMW Park.": x 96/587, w 1248/266, ypos 12%/20% / "Legendäre Sporthalle für legen": x 96/308, w 1248/824 / "He |
| /de/mehr-bmw/sport-und-events/bmw-basketball/innovation | differences remain | 1440, 768, 390 | 84% / 88% / 80% | 1440: [height] preview 4018px vs live 4766px (84%); 1440: [layout] 8/14 text blocks placed differently: "Mehr Freude am Spiel.": x 96/540, w 1248/360 / "Für uns geht Innovation immer ": x 96/308, w 1248/824 / "Ein Basket |
| /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture | differences remain | 1440, 768, 390 | 147% / 129% / 110% | 1440: [height] preview 9309px vs live 6314px (147%); 1440: [layout] 12/20 text blocks placed differently: "Urban Sports. Urban Creativity": x 96/380, w 1248/681 / "Basketball ist eine Quelle der": x 96/308, w 1248/824 /  |
| /de/mehr-bmw/sport-und-events/bmw-basketball/we-care | differences remain | 1440, 768, 390 | 90% / 83% / 81% | 1440: [height] preview 3481px vs live 3879px (90%); 1440: [layout] 6/11 text blocks placed differently: "Hand in Hand: Spektakel & Sozi": x 96/323, w 1248/795 / "„Dunks for Tomorrow“ steht für": x 96/308, w 1248/824 / "I |
| /de/mehr-bmw/sport-und-events/laufsport | differences remain | 1440, 768, 390 | 94% / 92% / 83% | 1440: [layout] 4/5 text blocks placed differently: "BMW LAUFSPORT.": w 512/384 / "BMW Berlin-Marathon.": x 96/538, w 1248/365 / "Starterinnen und Starter aus ü": x 96/308, w 1; 768: [layout] 5/5 text blocks placed differ |
| /de/mehr-bmw/sport-und-events/sport-und-kultur | differences remain | 1440, 768, 390 | 98% / 98% / 76% | 390: [height] preview 2126px vs live 2809px (76%) |
| /de/mehr-bmw/sport-und-events/tennis | differences remain | 1440, 768, 390 | 96% / 94% / 82% | 1440: [layout] 3/4 text blocks placed differently: "BMW TENNISSPORT.": w 720/431 / "BMW Open (ATP 500)": x 96/542, w 1248/356 / "Seit 38 Jahren engagiert sich ": x 96/308, w 1; 768: [layout] 4/4 text blocks placed differ |
| /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy | differences remain | 1440, 768, 390 | 133% / 114% / 85% | 1440: [height] preview 7147px vs live 5376px (133%); 1440: [layout] 13/14 text blocks placed differently: "BMW Heart of Joy.": w 1344/358 / "Fahrfreude auf dem übernächste": x 96/400, w 1248/641 / "Das BMW Heart of Joy i |
| /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung | differences remain | 1440, 768, 390 | 1523% / 1200% / 991% | 1440: [height] preview 109683px vs live 7203px (1523%); 1440: [missing-text] 28/39 live text runs not visible on preview: "höchste Qualitätsansprüche.", "BMW 3er Modelle", "3er Limousine", "3er Touring" |
| /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub | differences remain | 1440, 768, 390 | 183% / 140% / 121% | 1440: [height] preview 37346px vs live 20391px (183%); 1440: [layout] 92/142 text blocks placed differently: "Original BMW Zubehör.": w 616/456 / "Für jede Fahrt vorbereitet.": x 96/516, w 1248/408 / "Egal zu welcher Jah |
| /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile | differences remain | 1440, 768, 390 | 191% / 156% / 128% | 1440: [height] preview 18719px vs live 9820px (191%); 1440: [typography] 13 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 / "Original BMW Classic Teile": align start/center / "IHRE VORTEILE": size 35/12 |
| /de/more-bmw/sport-und-events/bmw-basketball/bmw-park | differences remain | 1440, 768, 390 | 162% / 176% / 127% | 1440: [height] preview 5831px vs live 3607px (162%); 1440: [layout] 7/17 text blocks placed differently: "Mehr BMW Park.": x 96/587, w 1248/266, ypos 12%/20% / "Legendäre Sporthalle für legen": x 96/308, w 1248/824 / "He |
| /de/my-bmw-app/my-bmw-app | differences remain | 1440, 768, 390 | 119% / 122% / 85% | 1440: [height] preview 7057px vs live 5948px (119%); 1440: [typography] 5 runs differ: "Zur BMW ConnectedDrive Übersicht": size 18/15 / "Zum BMW Store": size 18/15 / "BMW Kundenbetreuung kontaktieren": size 18/15 / "Zum  |
| /de/neufahrzeuge | differences remain | 1440, 768, 390 | 102% / 113% / 110% | 1440: [typography] 14 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Kompakt": color rgb(38, 38, 38)/r; 1440: [layout] 4/30 text blocks placed  |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten | differences remain | 1440, 768, 390 | 101% / 101% / 93% | 1440: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"; 768: [missing-text] 12/78 live text runs not vi |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er | differences remain | 1440, 768, 390 | 130% / 116% / 104% | 1440: [height] preview 23075px vs live 17742px (130%); 1440: [typography] 19 runs differ: "Ab 339 €": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 1 |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 89% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 10/69 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden" |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer | differences remain | 1440, 768, 390 | 138% / 119% / 103% | 1440: [height] preview 19927px vs live 14440px (138%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten | differences remain | 1440, 768, 390 | 97% / 98% / 91% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 16/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "Gesamtfahrzeugantrieb", "115 (156)", "Hinterradantrieb" |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe | differences remain | 1440, 768, 390 | 135% / 111% / 102% | 1440: [height] preview 17836px vs live 13221px (135%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 102% / 102% / 93% | 1440: [missing-text] 12/79 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"; 768: [missing-text] 12/79 live text runs not vi |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe | differences remain | 1440, 768, 390 | 135% / 111% / 100% | 1440: [height] preview 27102px vs live 20033px (135%); 1440: [typography] 7 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Varianten und technische Daten.": align start/center / "BMW 220 Gran Coupé":  |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten | differences remain | 1440, 768, 390 | 95% / – / 88% | 1440: [missing-text] 15/91 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"; 768: [height] preview 0px vs live 8205px (0%) |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid | differences remain | 1440, 768, 390 | 196% / 142% / 125% | 1440: [height] preview 24561px vs live 12523px (196%); 1440: [layout] 51/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 / "Konfigurieren & Preise": x 832/118 / "Angebot anforder |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 768: [missing-text] 7/75 live text ru |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine | differences remain | 1440, 768, 390 | 187% / 138% / 123% | 1440: [height] preview 21144px vs live 11321px (187%); 1440: [typography] 4 runs differ: "BMW 330i xDrive Limousine": size 20/15, weight 300/700 / "Preisliste BMW 3er Limousine": align start/center / "Immer in der richti |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid | differences remain | 1440, 768, 390 | 192% / 138% / 123% | 1440: [height] preview 25410px vs live 13231px (192%); 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 330e xDrive Touring": size 20/15, weight 300/700, color rgb(255 |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 768: [missing-text] 7/75 live text ru |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 768: [missing-text] 7/75 live text ru |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring | differences remain | 1440, 768, 390 | 176% / 136% / 120% | 1440: [height] preview 22637px vs live 12896px (176%); 1440: [typography] 16 runs differ: "Technologien": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 330i xDrive Touring": size 20/15, weight 300/700, color rgb(255, 2 |
| /de/neufahrzeuge/3er/limousine/bmw-i3-limousine | differences remain | 1440, 768, 390 | 91% / 97% / 88% | 1440: [footer-links] 63 vs 60; 1440: [image-geometry] 6 images sized differently (preview/live): #2 1440x630/416x554, #5 416x555/1008x441, #6 1008x441/416x555, #7 1008x441/416x555, #8 1008x441/1440x630 |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten | differences remain | 1440, 768, 390 | 102% / 100% / 81% | 1440: [missing-text] 7/65 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 1440: [layout] 10/49 text blocks plac |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio | differences remain | 1440, 768, 390 | 150% / 119% / 106% | 1440: [height] preview 16891px vs live 11241px (150%); 1440: [layout] 36/65 text blocks placed differently: "Das BMW 4er Cabrio.": w 512/224 / "Offen für sportliche Erlebniss": x 96/478, w 1248/484 / "Das BMW 4er Cabrio  |
| /de/neufahrzeuge/4er/coupe/bmw-4er-coupe | differences remain | 1440, 768, 390 | 155% / 123% / 111% | 1440: [height] preview 15505px vs live 9994px (155%); 1440: [layout] 33/64 text blocks placed differently: "Das BMW 4er Coupé.": w 512/224 / "Ihr unwiderstehlich sportliche": x 96/353, w 1248/734 / "Das BMW 4er Coupé err |
| /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe | differences remain | 1440, 768, 390 | 170% / 133% / 116% | 1440: [height] preview 21433px vs live 12638px (170%); 1440: [layout] 43/80 text blocks placed differently: "Das BMW 4er Gran Coupé.": w 512/280 / "Fahrfreude.": x 96/629 / "Das BMW 4er Gran Coupé vereint": x 96/308, w 1 |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 1440: [missing-text] 7/82 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 7/82 live text ru |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev | differences remain | 1440, 768, 390 | 151% / 120% / 107% | 1440: [height] preview 20972px vs live 13932px (151%); 1440: [typography] 7 runs differ: "THE NEW": size 18/15, case none/uppercase / "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 530e Touring": size 20/15, w |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring | differences remain | 1440, 768, 390 | 147% / 119% / 107% | 1440: [height] preview 19194px vs live 13085px (147%); 1440: [layout] 39/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 / "Technische Daten": x 12/144 / "Preisliste": x 162/294 / "Probefahrt vereinb |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten | differences remain | 1440, 768, 390 | 102% / 101% / 81% | 1440: [missing-text] 17/93 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"; 1440: [layout] 14/67 text blocks placed differently: |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick | differences remain | 1440, 768, 390 | 168% / 135% / 116% | 1440: [height] preview 19638px vs live 11656px (168%); 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 530e Limousine": size 20/15, weight 300/700 / "Preisliste BMW 5er Plu |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [missing-text] 12/83 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"; 768: [missing-text] 12/83 live text runs not vi |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick | differences remain | 1440, 768, 390 | 151% / 126% / 109% | 1440: [height] preview 17887px vs live 11825px (151%); 1440: [typography] 5 runs differ: "Fahrdynamik": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 520i Limousine": size 20/15, weight 300/700 / "Preisliste BMW 5er Li |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 11/69 live text runs not visible on preview: "BMW 7er", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen" |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine | differences remain | 1440, 768, 390 | 89% / 93% / 87% | 1440: [height] preview 16335px vs live 18311px (89%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 7/66 live text runs not visible on preview: "BMW i7", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu" |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine | differences remain | 1440, 768, 390 | 89% / 93% / 85% | 1440: [height] preview 15215px vs live 17051px (89%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data | differences remain | 1440, 768, 390 | 99% / 99% / 90% | 1440: [missing-text] 6/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le; 768: [missing-text] 6/71 live text ru |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe | differences remain | 1440, 768, 390 | 159% / 130% / 115% | 1440: [height] preview 26496px vs live 16616px (159%); 1440: [layout] 56/109 text blocks placed differently: "Das BMW i4 Gran Coupé.": w 512/265 / "Fahrfreude.": x 96/629 / "Im BMW i4 Gran Coupé sind Sie ": x 96/308, w 1 |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten | differences remain | 1440, 768, 390 | 100% / 99% / 90% | 1440: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 7/70 live text ru |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten | differences remain | 1440, 768, 390 | 101% / 100% / 91% | 1440: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 7/72 live text ru |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring | differences remain | 1440, 768, 390 | 153% / 124% / 111% | 1440: [height] preview 24916px vs live 16290px (153%); 1440: [typography] 19 runs differ: "Ab 649": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 102 |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick | differences remain | 1440, 768, 390 | 184% / 141% / 120% | 1440: [height] preview 23456px vs live 12733px (184%); 1440: [typography] 20 runs differ: "Ab 599 €": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 1 |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 89% | 1440: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 7/71 live text ru |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix | differences remain | 1440, 768, 390 | 120% / 112% / 99% | 1440: [height] preview 25150px vs live 20893px (120%); 1440: [typography] 17 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 18/23 / "Reichweite & Laden": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW iX xDri |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 8/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1 | differences remain | 1440, 768, 390 | 163% / 126% / 116% | 1440: [height] preview 25882px vs live 15896px (163%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 7/72 live text ru |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick | differences remain | 1440, 768, 390 | 152% / 121% / 107% | 1440: [height] preview 25553px vs live 16844px (152%); 1440: [typography] 17 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Fahrfreude.": size 35/43, align start/center / "BMW iX2 xDrive30": size 20 |
| /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse | differences remain | 1440, 768, 390 | 99% / 109% / 94% | 1440: [footer-links] 63 vs 60; 1440: [layout] 8/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 376/279 / "Mehr als Ästhetik.": w 440/225 / "Mehr anzeigen": w 95/624 / "Technologie als |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 7/64 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe | differences remain | 1440, 768, 390 | 207% / 154% / 130% | 1440: [height] preview 44549px vs live 21532px (207%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine | differences remain | 1440, 768, 390 | 262% / 176% / 156% | 1440: [height] preview 50492px vs live 19260px (262%); 1440: [typography] 35 runs differ: "BMW M3 Competition Limousine": color rgb(102, 102, 102)/rgb(38, 38, 38), align start/center / "BMW M340d xDrive Limousine: Energi |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring | differences remain | 1440, 768, 390 | 214% / 153% / 131% | 1440: [height] preview 39448px vs live 18430px (214%); 1440: [typography] 24 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M340d xDrive Touring: Energiever": align start/center / "BMW M3 Comp |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio | differences remain | 1440, 768, 390 | 222% / 149% / 132% | 1440: [height] preview 39490px vs live 17751px (222%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten | differences remain | 1440, 768, 390 | 103% / 101% / 81% | 1440: [missing-text] 18/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "Gesamtfahrzeugantrieb", "390 (530)", "TwinPower Turbo Verbrennungsmotor"; 1440: [layout] 9/41 text blocks placed |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe | differences remain | 1440, 768, 390 | 239% / 167% / 143% | 1440: [height] preview 51754px vs live 21623px (239%); 1440: [typography] 35 runs differ: "BMW M4 Competition Coupé": align start/center / "M440 Coupé": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M440d xDrive Coupé: |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 100% / 102% / 93% | 1440: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 168% / 135% / 115% | 1440: [height] preview 34055px vs live 20218px (168%); 1440: [typography] 9 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW i4 M60 xDrive Gran Coupé": size 20/15, weight 300/700 / "Privatkunden |
| /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick | differences remain | 1440, 768, 390 | 156% / 130% / 114% | 1440: [height] preview 22520px vs live 14444px (156%); 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW i5 M60 xDrive Limousine": size 20/15, weight 300/700 / "Preisliste BM |
| /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [missing-text] 8/67 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/bmw-m-135/bmw-m135 | differences remain | 1440, 768, 390 | 125% / 118% / 98% | 1440: [height] preview 22504px vs live 17970px (125%); 1440: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M135 xDrive": size 20/15, weight 300/700 / "Preisliste BMW M135 |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 90% | 1440: [missing-text] 8/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachg; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive | differences remain | 1440, 768, 390 | 132% / 113% / 106% | 1440: [height] preview 23405px vs live 17706px (132%); 1440: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW i5 M60 xDrive Touring": size 20/15, weight 300/700 / "Preisliste BMW i5 M |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten | differences remain | 1440, 768, 390 | 100% / 102% / 93% | 1440: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70 | differences remain | 1440, 768, 390 | 146% / 123% / 108% | 1440: [height] preview 25871px vs live 17769px (146%); 1440: [layout] 44/95 text blocks placed differently: "Fahrfreude.": x 96/629 / "Vollelektrisch. Leistungsstark": x 96/308, w 1248/824 / "Varianten und technische Dat |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 7/67 live text runs not visible on preview: "BMW 7er M", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle | differences remain | 1440, 768, 390 | 99% / 97% / 87% | 1440: [typography] 30 runs differ: "DER NEUE BMW 7er": size 70/74, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none / "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb; 1440: [layout] 34/148 text blocks place |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 101% / 102% / 91% | 1440: [missing-text] 7/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 139% / 116% / 101% | 1440: [height] preview 22032px vs live 15891px (139%); 1440: [typography] 6 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M235 xDrive Gran Coupé": size 20/15, weight 300/700 / "Extrovertie |
| /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 169% / 132% / 115% | 1440: [height] preview 28484px vs live 16876px (169%); 1440: [layout] 58/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 / "Fahrfreude.": x 96/629 / "Das BMW M440i xDrive Gran Co |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 91% | 1440: [missing-text] 18/92 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"; 1440: [image-geometry] 2 images sized differently (p |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine | differences remain | 1440, 768, 390 | 148% / 126% / 107% | 1440: [height] preview 30110px vs live 20340px (148%); 1440: [typography] 33 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M5 Limousine": size 20/15, weight 300/700 / "Die BMW M5 Limousine mi |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten | differences remain | 1440, 768, 390 | 99% / 99% / 90% | 1440: [missing-text] 16/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"; 1440: [image-geometry] 2 images sized differently (p |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring | differences remain | 1440, 768, 390 | 144% / 124% / 105% | 1440: [height] preview 32404px vs live 22579px (144%); 1440: [layout] 75/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 / "Technische Daten": x 12/-260 / "Auszeichnung": x 162/-110 / "Kon |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 15/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Gesamtfahrzeugantrieb" |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle | could not capture | – | – / – / – | – |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten | differences remain | 1440, 768, 390 | 99% / 99% / 91% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 8/74 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive | differences remain | 1440, 768, 390 | 151% / 120% / 106% | 1440: [height] preview 19493px vs live 12927px (151%); 1440: [layout] 35/78 text blocks placed differently: "Der BMW X1 M35i xDrive.": x 96/212, w 538/401 / "Fahrfreude.": x 96/629 / "Ungezügelte M Power. Von der a": x 9 |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 92% | 1440: [missing-text] 8/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick | differences remain | 1440, 768, 390 | 153% / 116% / 107% | 1440: [height] preview 24925px vs live 16303px (153%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/x3-m50/bmw-x3-m50 | differences remain | 1440, 768, 390 | 140% / 121% / 105% | 1440: [height] preview 22518px vs live 16118px (140%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle | differences remain | 1440, 768, 390 | 197% / 140% / 121% | 1440: [height] preview 29301px vs live 14855px (197%); 1440: [typography] 16 runs differ: "X6 M60i xDrive": color rgb(102, 102, 102)/rgb(38, 38, 38) / "High-Performance M TwinPower Turbo V": size 18/15 / "8-Gang M Steptr |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten | differences remain | 1440, 768, 390 | 97% / 97% / 87% | 1440: [missing-text] 9/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 768: [missing-text] 9/68 live text ru |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten | differences remain | 1440, 768, 390 | 99% / 99% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden" |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i | differences remain | 1440, 768, 390 | 115% / 102% / 94% | 1440: [height] preview 15678px vs live 13672px (115%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/xm/bmw-xm-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 16/86 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen" |
| /de/neufahrzeuge/m/xm/bmw-xm | differences remain | 1440, 768, 390 | 152% / 127% / 112% | 1440: [height] preview 29621px vs live 19475px (152%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster | differences remain | 1440, 768, 390 | 136% / 113% / 101% | 1440: [height] preview 17830px vs live 13086px (136%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 89% | 1440: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi; 768: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/x/x2/bmw-x2-technische-daten | differences remain | 1440, 768, 390 | 101% / 100% / 92% | 1440: [missing-text] 8/76 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus; 768: [missing-text] 8/76 live text ru |
| /de/neufahrzeuge/x/x2/bmw-x2-ueberblick | differences remain | 1440, 768, 390 | 137% / 110% / 103% | 1440: [height] preview 21732px vs live 15905px (137%); 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Fahrfreude.": size 35/43, align start/center / "BMW X2 sDrive20i": size 2 |
| /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 95% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 12/82 live text runs not visible on preview: "Vehicle Footprint", "Batterie/Laden", "Bidirektionales Laden", "Die angegebenen Werte wurden nach dem vo" |
| /de/neufahrzeuge/x/ix3/bmw-ix3 | differences remain | 1440, 768, 390 | 122% / 106% / 93% | 1440: [height] preview 18537px vs live 15186px (122%); 1440: [typography] 12 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) / "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) /  |
| /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 7/63 live text runs not visible on preview: "BMW iX5:", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu" |
| /de/neufahrzeuge/x/suv/bmw-ix5 | differences remain | 1440, 768, 390 | 90% / 92% / 89% | 1440: [height] preview 12922px vs live 14417px (90%); 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen" |
| /de/neufahrzeuge/x/suv/bmw-x5-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 11/70 live text runs not visible on preview: "BMW X5", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen" |
| /de/neufahrzeuge/x/suv/bmw-x5 | differences remain | 1440, 768, 390 | 89% / 96% / 88% | 1440: [height] preview 13761px vs live 15418px (89%); 1440: [layout] 17/96 text blocks placed differently: "BMW X5": ypos 56%/3% / "Weitere Antriebe und Varianten": x 96/336, w 1248/768 / "Mehr anzeigen": w 95/624 / "Meh |
| /de/neufahrzeuge/x/x1/bmw-x1-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 10/82 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden" |
| /de/neufahrzeuge/x/x1/bmw-x1 | differences remain | 1440, 768, 390 | 135% / 115% / 105% | 1440: [height] preview 20323px vs live 15067px (135%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 90% | 1440: [missing-text] 17/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"; 768: [missing-text] 17/87 live text runs not visible |
| /de/neufahrzeuge/x/x3/bmw-x3-phev | differences remain | 1440, 768, 390 | 134% / 113% / 100% | 1440: [height] preview 26521px vs live 19749px (134%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/x/x3/bmw-x3-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"; 768: [missing-text] 12/78 live text runs not vi |
| /de/neufahrzeuge/x/x3/bmw-x3 | differences remain | 1440, 768, 390 | 146% / 121% / 111% | 1440: [height] preview 26264px vs live 18014px (146%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/x/x6/bmw-x6-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"; 768: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/x/x6/bmw-x6 | differences remain | 1440, 768, 390 | 141% / 119% / 104% | 1440: [height] preview 19559px vs live 13896px (141%); 1440: [typography] 7 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X6 M60i xDrive": size 20/15, weight 300/700 / "Präsenz, die bewegt.": siz |
| /de/neufahrzeuge/x/x7/bmw-x7-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 10/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden" |
| /de/neufahrzeuge/x/x7/bmw-x7 | differences remain | 1440, 768, 390 | 145% / 115% / 105% | 1440: [height] preview 22560px vs live 15519px (145%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster | differences remain | 1440, 768, 390 | 139% / 121% / 106% | 1440: [height] preview 18244px vs live 13167px (139%); 1440: [footer-links] 63 vs 60 |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [footer-links] 63 vs 60; 1440: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi |
| /de/publicpools/sitemap/sitemap | differences remain | 1440, 768, 390 | 284% / 272% / 123% | 1440: [height] preview 3826px vs live 1346px (284%); 1440: [footer-height] 1327 vs 0 |
| /de/services-and-workshop/allgemeine-versicherungsbedingungen | differences remain | 1440, 768, 390 | 100% / 100% / 68% | 1440: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB f; 768: [typography] 3 runs differ: "Repai |
| /de/shop-online/bmw-angebote | differences remain | 1440, 768, 390 | 119% / 94% / 88% | 1440: [height] preview 13523px vs live 11357px (119%); 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Gewer |
| /de/shop-online/bmw-offers | differences remain | 1440, 768, 390 | 119% / 94% / 88% | 1440: [height] preview 13599px vs live 11433px (119%); 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Priva |
| /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales | differences remain | 1440, 768, 390 | 142% / 115% / 105% | 1440: [height] preview 13668px vs live 9630px (142%); 1440: [typography] 4 runs differ: "Ihre Vorteile": color rgb(102, 102, 102)/rgb(38, 38, 38) / "1 Änderungen vorbehalten": size 15/12 / "Mehr erfahren": size 18/15 / " |
| /de/topics/fascination-bmw/events/quiztaxi2024 | differences remain | 1440, 768, 390 | 95% / 91% / 82% | 1440: [layout] 3/4 text blocks placed differently: "Die Biathlon-Weltcupwoche in R": x 96/308, w 1248/824 / "Einsteigen und gewinnen, heißt": x 96/308, w 1248/824 / "Überzeuge; 768: [layout] 4/4 text blocks placed differ |
| /de/topics/fascination-bmw/events/vip-experience | differences remain | 1440, 768, 390 | 100% / 100% / 83% | 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 / "VIP Experience Biathlon auf Sc": w 512/381 / "Shuttle-Service im vollelektri": w 1248/674; 390: [height] preview 2988px vs live 3591px  |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon | differences remain | 1440, 768, 390 | 145% / 113% / 108% | 1440: [height] preview 8624px vs live 5948px (145%); 1440: [layout] 20/59 text blocks placed differently: "BMW & Biathlon.": w 512/336 / "Biathlon begeistert Millionen ": x 96/308, w 1248/824 / "Effizienz, Dynamik und di |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln | differences remain | 1440, 768, 390 | 88% / 83% / 86% | 1440: [height] preview 4336px vs live 4948px (88%); 1440: [layout] 9/42 text blocks placed differently: "Effizienz im Eiskanal.": w 512/219 / "Effizienz und Performance zeic": x 96/308, w 1248/824 / "Seit 2014 ist der Pr |
| /de/topics/faszination-bmw/events/bmw-golfsport | differences remain | 1440, 768, 390 | 96% / 95% / 78% | 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 / "BMW International Open.": w 400/262 / "Friends of the Brand.": w 400/218; 390: [height] preview 2991px vs live 3837px (78%) |
| /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand | differences remain | 1440, 768, 390 | 95% / 95% / 83% | 1440: [layout] 4/6 text blocks placed differently: "BMW ist rund um den Globus bei": x 96/308, w 1248/824 / "Max Kieffer.": x 838/96 / "Der in einer Golfer-Familie au": x 838/; 390: [height] preview 3492px vs live 4232px |
| /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup | differences remain | 1440, 768, 390 | 88% / 89% / 80% | 1440: [height] preview 2818px vs live 3217px (88%); 1440: [layout] 10/10 text blocks placed differently: "BMW Golf Cup.": w 512/295 / "Er ist die größte internationa": x 96/308, w 1248/824 / "Ein Profi bei einem Major-Tu |
| /de/topics/faszination-bmw/events/kulturelles-engagement | differences remain | 1440, 768, 390 | 90% / 136% / 90% | 1440: [height] preview 7437px vs live 8269px (90%); 1440: [layout] 19/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 / "Die Kulturförderung der BMW Gr": x 96/308, w 1248/824 / "Zur Kulturbrosch |
| /de/topics/faszination-bmw/events/wintersport | differences remain | 1440, 768, 390 | 92% / 87% / 75% | 1440: [layout] 9/30 text blocks placed differently: "Starker Partner des Winterspor": x 96/308, w 1248/522 / "Freuen Sie sich auf einen beso": x 96/308, w 1248/824 / "In diese; 768: [height] preview 7126px vs live 8147px |
| /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal | differences remain | 1440, 768, 390 | 96% / 98% / 93% | 1440: [layout] 11/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 / "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 / "Ein Sieggarant auf der ganzen ": x ; 768: [layout] 11/11 text blocks placed diff |
| /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon | differences remain | 1440, 768, 390 | 83% / 94% / 82% | 1440: [height] preview 2686px vs live 3220px (83%); 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 / "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/start / "Lena Ge |
| /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs | differences remain | 1440, 768, 390 | 107% / 118% / 103% | 1440: [layout] 8/10 text blocks placed differently: "Der Bob- und Schlittenverband ": x 96/308, w 1248/824 / "Die deutschen Rennrodler start": x 96/308, w 1248/824 / "Die Grun; 768: [height] preview 6070px vs live 5144px |
| /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge | differences remain | 1440, 768, 390 | 93% / 92% / 89% | 1440: [layout] 31/111 text blocks placed differently: "Vertrauen Sie auf unsere Erfah": w 512/370 / "So individuell wie Ihre Ansprü": x 96/455, w 1248/531 / "BMW beliefert deu; 768: [layout] 42/111 text blocks placed dif |
| /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales | differences remain | 1440, 768, 390 | 140% / 114% / 105% | 1440: [height] preview 14250px vs live 10201px (140%); 1440: [layout] 30/70 text blocks placed differently: "BMW Vertrieb an Großkunden.": w 512/331 / "BMW bietet den perfekten Servi": x 96/308, w 1248/824 / "Vorteile au |
| /de/topics/faszination-bmw/sport-events/weltcup | differences remain | 1440, 768, 390 | 125% / 91% / 79% | 1440: [height] preview 4298px vs live 3433px (125%); 1440: [layout] 5/8 text blocks placed differently: "BMW WeltcupHeroes 2025.": w 512/274 / "BMW Weltcup Heroes Ruhpolding ": x 96/732, w 1248/506, ypos 40%/30% / "BMW p |
| /de/topics/neuwagen/gewaehrleistung | differences remain | 1440, 768, 390 | 123% / 106% / 94% | 1440: [height] preview 10300px vs live 8379px (123%); 1440: [typography] 10 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Erweiterte Batteriegewährleistung": align start/center / "BMW Plug-in |
| /de/topics/service-zubehoer/bmw-security | differences remain | 1440, 768, 390 | 97% / 93% / 89% | 1440: [layout] 15/40 text blocks placed differently: "BMW Security": w 512/278 / "Sie fahren, wir schützen.": w 512/253 / "BMW Security hilft Ihnen dabei": x 96/308, w 1248/82; 768: [layout] 15/40 text blocks placed diff |
| /de/topics/service-zubehoer/bmw-service/repair-inclusive | differences remain | 1440, 768, 390 | 114% / 100% / 95% | 1440: [height] preview 10214px vs live 8953px (114%); 1440: [layout] 64/102 text blocks placed differently: "BMW Service": x 96/0 / "Proactive Care": x 254/158 / "Service Inclusive": x 381/285 / "Repair Inclusive": x 523 |
| /de/topics/service-zubehoer/bmw-service/rueckrufe | differences remain | 1440, 768, 390 | 90% / 85% / 83% | 1440: [height] preview 3695px vs live 4115px (90%); 1440: [layout] 17/20 text blocks placed differently: "Rückrufaktionen betreffen die ": x 96/308, w 1248/824 / "Die Sicherheit unserer Kunden ": x 96/308, w 1248/824 / " |
| /de/topics/service-zubehoer/financial-services/bmw-financial-services | differences remain | 1440, 768, 390 | 153% / 119% / 101% | 1440: [height] preview 22782px vs live 14926px (153%); 1440: [typography] 15 runs differ: "Leasing oder Finanzierung": align start/center / "Aktuelle Angebote": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Mehr zum BMW Le |
| /de/topics/service-zubehoer/financial-services/bmw-finanzierung | differences remain | 1440, 768, 390 | 117% / 104% / 96% | 1440: [height] preview 16829px vs live 14416px (117%); 1440: [typography] 10 runs differ: "BMW Finanzierung": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Mehr erfahren": size 18/15 / "Privatkunden": color rgb(38, 38, 38) |
| /de/topics/service-zubehoer/financial-services/bmw-leasing | differences remain | 1440, 768, 390 | 129% / 94% / 94% | 1440: [height] preview 29880px vs live 23109px (129%); 1440: [footer-links] 63 vs 60 |
| /de-de/shop-online/bmw-business-offers | differences remain | 1440, 768, 390 | 119% / 94% / 88% | 1440: [height] preview 13523px vs live 11357px (119%); 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Gewer |

## Per page details (fixes applied + remaining)
### /de/bmw-alpina
- status: differences remain; widths: 1440, 768, 390; height ratio: 140% / 128% / 105%
- blocks: media, scroll-navigation, media-gallery, columns, media-showcase, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R2: crops/ratios per breakpoint; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13481px vs live 9644px (140%)
  - 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 1440: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 35/48, case none/uppercase | "GRAND TOURING":
  - 1440: [layout] 16/24 text blocks placed differently: "Vor der Kulisse der Alpen begi": x 96/202 | "Informiert bleiben": x 96/1235 | "Ein neues Kapitel beginnt": w 1248/318, yp
  - 768: [height] preview 12644px vs live 9886px (128%)
  - 768: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 768: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 29/42, case none/uppercase | "GRAND TOURING":
  - 768: [layout] 14/24 text blocks placed differently: "Informiert bleiben": x 48/568 | "Ein neues Kapitel beginnt": w 672/289 | "Der Vision BMW ALPINA lädt ein": w 672/266 | "H
  - 768: [image-geometry] 5 images sized differently (preview/live): #2 768x432/334x241, #4 768x336/300x400, #16 300x400/768x772, #19 768x768/300x400, #20 768x768/300x400
  - 390: [missing-text] 3/27 live text runs not visible on preview: "elevating", "journeys", "Volume"
  - 390: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 28/35, case none/uppercase | "GRAND TOURING":
  - 390: [layout] 7/24 text blocks placed differently: "Informiert bleiben": x 24/230 | "Ein neues Kapitel beginnt": w 342/261 | "GRAND TOURING": w 342/212, ypos 53%/36% | "KUNST
  - 390: [image-geometry] 6 images sized differently (preview/live): #2 390x693/334x181, #4 390x520/300x400, #10 300x400/390x392, #12 342x342/390x585, #13 390x585/300x400

### /de/bmw-financial-services-overview/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 246% / 201% / 155%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, content-table, columns, model-card, disclaimer, cards-quicklink, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 39258px vs live 15957px (246%)
  - 1440: [layout] 122/179 text blocks placed differently: "BMW Leasing. Die Vorteile auf ": x 96/385, w 1248/671 | "Nutzen statt besitzen.": x 460/233 | "Zahlen Sie nur für die F
  - 1440: [image-geometry] 34 images sized differently (preview/live): #2 1440x630/270x179, #3 1022x681/270x179, #4 1022x681/270x179, #5 1022x681/270x180, #6 1022x681/270x179
  - 768: [height] preview 34695px vs live 17286px (201%)
  - 768: [layout] 106/179 text blocks placed differently: "Der einfachste Weg zu Ihrem BM": x 64/205, w 640/355 | "Attraktive Raten, Laufzeit nac": x 64/172, w 640/424 | "Fahrzeu
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x336/648x431, #10 672x448/382x254, #11 382x254/672x447, #14 672x448/672x549, #15 907x741/648x486
  - 390: [height] preview 27847px vs live 17981px (155%)
  - 390: [layout] 69/174 text blocks placed differently: "Der einfachste Weg zu Ihrem BM": x 32/89, w 325/213 | "Fahrzeuge entdecken": x 32/125 | "Financial Services Login": x 32
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/326x217, #14 342x228/342x279, #15 616x503/326x490, #16 342x342/326x490, #17 342x514/283x212

### /de/bmw-financial-services-overview/form-finder
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 99% / 80%
- blocks: hero-teaser, questionnaire
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 390: [height] preview 2530px vs live 3171px (80%)

### /de/bmw-modelle-vergleichen
- status: differences remain; widths: 1440, 768, 390; height ratio: 15% / 22% / 15%
- blocks: model-compare, hero-teaser
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [height] preview 2136px vs live 13920px (15%)
  - 768: [height] preview 2623px vs live 12106px (22%)
  - 390: [height] preview 1884px vs live 12319px (15%)
- notes: compare tool data needs the bmw-proxy worker (not deployed yet)

### /de/bmw-service-hub
- status: differences remain; widths: 1440, 768, 390; height ratio: 168% / 129% / 111%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 26293px vs live 15650px (168%)
  - 1440: [layout] 72/144 text blocks placed differently: "BMW Service.": w 512/272 | "Bei Ihrem BMW Service Partner ": x 96/308, w 1248/824 | "Ihre Vorteile auf einen Blick.": x 
  - 1440: [image-geometry] 15 images sized differently (preview/live): #2 1248x832/400x267, #3 1248x832/400x266, #4 1248x832/400x266, #12 1248x833/718x479, #15 1248x832/612x408
  - 768: [height] preview 22078px vs live 17173px (129%)
  - 768: [layout] 77/144 text blocks placed differently: "BMW Service.": x 64/271, w 640/222 | "Relax. We care.": x 64/312 | "Termin vereinbaren": x 175/238 | "Proactive Care": x
  - 390: [height] preview 20631px vs live 18652px (111%)
  - 390: [layout] 38/138 text blocks placed differently: "BMW Service.": x 32/93, w 325/205 | "Relax. We care.": x 32/129 | "Termin vereinbaren": x 32/133 | "BMW Service Partner 

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 81%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 4/11 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 96/383, w 1248/674 | "Finden Sie das richtige Servic": x 96/308, w 1248/824 | "Jetzt Pa
  - 768: [layout] 4/11 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 48/177, w 672/414 | "Finden Sie das richtige Servic": x 48/164, w 672/440 | "Jetzt Part
  - 390: [height] preview 2988px vs live 3709px (81%)

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 81%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 4/10 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 96/383, w 1248/674 | "Finden Sie das richtige Servic": x 96/308, w 1248/824 | "Jetzt Pa
  - 768: [layout] 4/10 text blocks placed differently: "BMW Service Inclusive Paket-Ka": x 48/190, w 672/388 | "Finden Sie das richtige Servic": x 48/164, w 672/440 | "Jetzt Part
  - 390: [height] preview 3040px vs live 3769px (81%)

### /de/bmw-service-hub/bmw-service/unfall-pannenhilfe
- status: differences remain; widths: 1440, 768, 390; height ratio: 113% / 104% / 99%
- blocks: hero-teaser, content-navigation, content-table, tabs, disclaimer, columns, accordion, icon-teaser, download
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R2: tab layout at 768/390; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule
- remaining: 
  - 1440: [height] preview 12304px vs live 10870px (113%)
  - 1440: [layout] 49/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 | "BMW Service": x 332/236 | "Proactive Care": x 450/354 | "Service Inclusive": x 577/48
  - 1440: [image-geometry] 2 images sized differently (preview/live): #6 1248x1248/1440x632, #7 1440x630/612x408
  - 768: [typography] 8 runs differ: "BMW Service": color rgb(102, 102, 102)/rgb(38, 38, 38) | "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW Pannenhilfe.": 
  - 768: [layout] 43/90 text blocks placed differently: "Die BMW Unfall- und Pannenhilf": x 64/114 | "Seit 1984 immer an Ihrer Seite": x 64/130 | "Unfall- und Pannenhilfe": x 47/
  - 390: [typography] 7 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW Pannenhilfe.": align center/start | "Schnell wieder mobil.": align center
  - 390: [layout] 14/86 text blocks placed differently: "Sie benötigen Hilfe? Jetzt kos": w 342/262 | "BMW Pannenhilfe.": w 325/233 | "Unsere BMW Pannenhilfe.": ypos 32%/26% | "D

### /de/campaigns/bmw-fuer-geschaeftskunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 192% / 149% / 129%
- blocks: hero-teaser, content-navigation, card-list, carousel, columns, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 14126px vs live 7374px (192%)
  - 1440: [typography] 16 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ob Sie freiberuflich tätig sind, ein": size 28/20, weight 300/700 | "Gewerbekunde
  - 1440: [layout] 33/69 text blocks placed differently: "Vorteile für BMW Geschäftskund": x 96/440, w 1248/560 | "Attraktive B2B-Leasingangebote": x 96/364, w 1248/712, ypos 9%/1
  - 1440: [image-geometry] 8 images sized differently (preview/live): #2 1184x526/296x132, #3 1184x526/296x132, #4 1184x526/296x132, #8 1248x832/294x195, #9 1248x832/294x196
  - 768: [height] preview 12179px vs live 8180px (149%)
  - 768: [typography] 16 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ob Sie freiberuflich tätig sind, ein": size 25/18, weight 300/700 | "Gewerbekunde
  - 768: [layout] 40/69 text blocks placed differently: "Angebot anfordern": x 300/72 | "Vorteile für BMW Geschäftskund": x 48/152, w 672/465 | "Attraktive Bedingungen für das": 
  - 390: [height] preview 12034px vs live 9336px (129%)
  - 390: [typography] 15 runs differ: "Ob Sie freiberuflich tätig sind, ein": size 23/17, weight 300/700 | "Gewerbekunden": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Unverbindliche
  - 390: [layout] 34/66 text blocks placed differently: "Angebot anfordern": x 32/135 | "Vorteile für BMW Geschäftskund": x 24/81, w 342/228 | "Attraktive Bedingungen für das": x

### /de/campaigns/hvo100-erneuerbarer-diesel
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 92% / 86%
- blocks: hero-teaser, text-media-teaser, icon-teaser, accordion, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 15/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 | "Ihr BMW Diesel ist bereit für ": w 512/389 | "Was ist HVO100?": x 96/583, w
  - 768: [layout] 20/31 text blocks placed differently: "HVO100 – der hochwertige, erne": x 64/178, w 640/408 | "Ihr BMW Diesel ist bereit für ": x 64/214, w 640/336 | "Kompatibi
  - 390: [height] preview 6120px vs live 7131px (86%)
  - 390: [layout] 7/31 text blocks placed differently: "Kompatibilität Ihres Fahrzeugs": x 32/73, w 325/244 | "Was ist HVO100?": x 24/86, w 342/218 | "Eine saubere Lösung für Die

### /de/digital-services/bmw-connecteddrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 184% / 135% / 119%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, icon-teaser, columns, content-table, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 24362px vs live 13211px (184%)
  - 1440: [layout] 89/125 text blocks placed differently: "Die Vorteile von BMW Connected": x 96/414, w 1248/612 | "Highlights von BMW ConnectedDr": x 96/426, w 1248/589 | "Mit de
  - 1440: [image-geometry] 20 images sized differently (preview/live): #3 1248x832/1440x480, #4 1248x832/1440x480, #5 1248x832/1440x480, #6 1248x832/270x180, #7 1248x832/270x179
  - 768: [height] preview 20203px vs live 14930px (135%)
  - 768: [layout] 69/128 text blocks placed differently: "BMW ConnectedDrive.": x 64/204, w 640/356 | "Digitale Lösungen in Ihrem BMW": x 64/207, w 640/350 | "Die Vorteile von BM
  - 768: [image-geometry] 14 images sized differently (preview/live): #3 672x448/768x768, #4 672x448/768x768, #5 672x448/768x768, #8 672x672/648x431, #9 382x255/648x433
  - 390: [height] preview 17964px vs live 15137px (119%)
  - 390: [layout] 37/124 text blocks placed differently: "BMW ConnectedDrive.": x 32/74, w 325/242 | "Zum BMW ConnectedDrive Store": x 32/89, w 325/212 | "Highlights von BMW Conn
  - 390: [image-geometry] 7 images sized differently (preview/live): #3 342x228/390x390, #4 342x228/390x390, #5 342x228/390x390, #8 342x342/326x217, #11 342x229/342x343

### /de/digital-services/bmw-digital-key
- status: differences remain; widths: 1440, 768, 390; height ratio: 165% / 134% / 113%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 14067px vs live 8506px (165%)
  - 1440: [layout] 34/56 text blocks placed differently: "BMW Digital Key.": w 512/334 | "Viel mehr als nur ein Schlüsse": x 96/474, w 1248/492 | "Entriegeln und starten Sie Ihr":
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1248x832/376x249, #3 1248x832/376x249, #4 1248x832/376x249, #9 1440x480/718x479, #10 1440x480/376x250
  - 768: [height] preview 12483px vs live 9325px (134%)
  - 768: [layout] 35/56 text blocks placed differently: "BMW Digital Key.": x 64/247, w 640/270 | "Lassen Sie den Autoschlüssel z": x 64/172, w 640/424 | "Was Sie erhalten": x -3
  - 768: [image-geometry] 4 images sized differently (preview/live): #9 768x768/382x255, #10 768x768/648x431, #11 768x768/648x431, #12 382x255/648x431
  - 390: [height] preview 11427px vs live 10076px (113%)
  - 390: [layout] 13/53 text blocks placed differently: "Viel mehr als nur ein Schlüsse": x 24/68, w 342/255 | "Einfach nutzen.": x 24/390 | "Sobald Sie sich mit dem BMW Di": x 2
  - 390: [image-geometry] 2 images sized differently (preview/live): #10 390x390/342x228, #11 390x390/326x217

### /de/digital-services/bmw-entertainment
- status: differences remain; widths: 1440, 768, 390; height ratio: 138% / 122% / 99%
- blocks: hero-teaser, disclaimer, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 8210px vs live 5949px (138%)
  - 1440: [layout] 17/28 text blocks placed differently: "BMW Entertainment. Verkürzt Ih": x 96/346, w 1248/749 | "Mit dem Besten aus Nachrichten": x 96/308, w 1248/824 | "Filmrei
  - 1440: [image-geometry] 4 images sized differently (preview/live): #2 1248x830/718x478, #6 1029x686/376x250, #7 1029x686/376x250, #8 1029x686/376x250
  - 768: [height] preview 7101px vs live 5842px (122%)
  - 768: [layout] 16/28 text blocks placed differently: "BMW Entertainment.": x 64/216, w 640/332 | "Ob kurzer Stopp oder geplante ": x 64/172, w 640/424 | "BMW Entertainment. Ve
  - 390: [layout] 9/28 text blocks placed differently: "Zum BMW ConnectedDrive Store": x 32/89, w 325/212 | "Ein Zugang, viele weitere Apps": x 32/87, w 325/216 | "BMW ConnectedD

### /de/digital-services/bmw-idrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 160% / 125% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, video, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 12060px vs live 7522px (160%)
  - 1440: [layout] 22/43 text blocks placed differently: "BMW iDrive.": w 512/240 | "BMW Panoramic iDrive mit innov": x 96/362, w 1248/717 | "Das neue BMW Panoramic iDrive ": x 96
  - 1440: [image-geometry] 10 images sized differently (preview/live): #4 1248x546/376x251, #10 400x267/718x479, #11 1248x832/718x479, #12 1248x832/718x479, #13 1248x832/718x479
  - 768: [height] preview 9505px vs live 7590px (125%)
  - 768: [layout] 20/43 text blocks placed differently: "BMW iDrive.": x 64/285 | "Das intuitive Anzeige- und Bed": x 64/169, w 640/426 | "BMW Panoramic iDrive mit innov": x 48/1
  - 768: [image-geometry] 5 images sized differently (preview/live): #4 672x294/648x432, #10 672x448/382x255, #11 672x448/382x255, #12 672x448/382x255, #13 672x448/382x255
  - 390: [layout] 11/40 text blocks placed differently: "BMW iDrive.": x 32/105 | "Vielseitige Personalisierung.": x 24/86, w 342/219 | "Unsere aktuelle Generation BMW": x 24/70,

### /de/digital-services/bmw-intelligent-personal-assistant
- status: differences remain; widths: 1440, 768, 390; height ratio: 142% / 114% / 97%
- blocks: hero-teaser, video, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 10363px vs live 7298px (142%)
  - 1440: [layout] 28/38 text blocks placed differently: "Der BMW Intelligent Personal A": w 512/391 | "BMW Intelligent Personal Assis": x 96/327, w 1248/787 | "Fahrzeugexperte un
  - 1440: [image-geometry] 8 images sized differently (preview/live): #2 1440x630/1248x702, #3 1248x702/718x539, #4 1248x702/718x539, #5 1248x936/718x478, #6 1248x936/718x478
  - 768: [height] preview 8496px vs live 7421px (114%)
  - 768: [layout] 28/38 text blocks placed differently: "Der BMW Intelligent Personal A": x 64/224, w 640/317 | "Ihr persönlicher Assistent im ": x 64/172, w 640/424 | "BMW Intel
  - 768: [image-geometry] 7 images sized differently (preview/live): #2 768x336/672x378, #3 672x378/382x287, #4 672x378/382x287, #5 672x504/382x254, #6 672x504/382x254
  - 390: [layout] 8/38 text blocks placed differently: "Der BMW Intelligent Personal A": x 32/122 | "Denkt mit und voraus.": w 342/224 | "BMW ConnectedDrive Übersicht.": x 24/390
  - 390: [image-geometry] 3 images sized differently (preview/live): #2 390x488/390x219, #3 390x219/390x293, #4 390x219/390x293

### /de/digital-services/bmw-maps
- status: differences remain; widths: 1440, 768, 390; height ratio: 142% / 125% / 97%
- blocks: hero-teaser, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 9551px vs live 6742px (142%)
  - 1440: [layout] 30/40 text blocks placed differently: "BMW Maps.": w 512/239 | "Ihr täglicher Begleiter. BMW M": x 96/447, w 1248/546 | "Gut informiert. Schnell orient": x 96/3
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 612x407/294x196, #3 612x407/294x196, #4 612x407/294x196, #5 612x407/294x196, #9 1248x832/376x250
  - 768: [height] preview 9878px vs live 7924px (125%)
  - 768: [layout] 27/40 text blocks placed differently: "BMW Maps.": x 64/285 | "Entspannt ans Ziel. Mit intuit": x 64/172, w 640/424 | "Ihr täglicher Begleiter. BMW M": x 48/203
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x216, #4 672x447/324x216, #5 672x447/324x216
  - 390: [layout] 13/40 text blocks placed differently: "BMW Maps.": x 32/104 | "Zum BMW ConnectedDrive Store": x 32/89, w 325/212 | "Connected Navigation.": x 24/98 | "Connected

### /de/elektroauto
- status: differences remain; widths: 1440, 768, 390; height ratio: 129% / 125% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 16024px vs live 12460px (129%)
  - 1440: [typography] 10 runs differ: "Dynamisch. Komfortabel. 100 % elektr": size 18/23 | "Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) | "E-Auto Batterie und Technologie": al
  - 1440: [layout] 29/81 text blocks placed differently: "BMW Elektroautos.": w 512/376 | "Erleben Sie die Zukunft der El": x 96/308, w 1248/824 | "Modellvielfalt der BMW Elektro"
  - 768: [height] preview 18009px vs live 14399px (125%)
  - 768: [typography] 8 runs differ: "Dynamisch. Komfortabel. 100 % elektr": size 17/20 | "Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) | "E-Auto Batterie und Technologie": ali
  - 768: [layout] 36/81 text blocks placed differently: "BMW Elektroautos.": x 64/230, w 640/304 | "Dynamisch. Komfortabel. 100 % ": x 64/185, w 640/394 | "Modelle": x -667/33 | 
  - 768: [image-geometry] 7 images sized differently (preview/live): #2 768x336/308x251, #17 294x240/382x215, #20 324x215/672x447, #21 672x447/382x254, #27 672x447/324x215
  - 390: [typography] 6 runs differ: "Dynamisch. Komfortabel. 100 % elektr": size 16/19 | "Sofort verfügbare BMW Elektroautos": size 16/14 | "Mehr über gebrauchte BMW Elektroauto": s
  - 390: [layout] 13/75 text blocks placed differently: "BMW Elektroautos.": x 32/98 | "Dynamisch. Komfortabel. 100 % ": x 32/86, w 325/219 | "Zu den Modellen": x 32/142 | "M Mod

### /de/elektroauto/batterie-technologie
- status: differences remain; widths: 1440, 768, 390; height ratio: 117% / 102% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, columns, tabs, multi-content-gallery, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 15198px vs live 12953px (117%)
  - 1440: [typography] 8 runs differ: "Die Batterie": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Optimierung der Lebensdauer": align start/center | "Die E-Auto-Batterie ist ein Energ
  - 1440: [layout] 25/90 text blocks placed differently: "So funktioniert ein Elektroaut": w 512/315 | "Was ein Elektroauto besonders ": x 96/416, w 1248/608 | "Die BMW Elektroaut
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1440x630/400x266, #5 400x267/1440x480, #7 1248x829/1440x480, #8 294x196/718x477, #17 1248x832/270x180
  - 768: [typography] 13 runs differ: "Die Batterie": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Optimierung der Lebensdauer": align start/center | "Die E-Auto-Batterie ist ein Ener
  - 768: [layout] 42/95 text blocks placed differently: "Elektroauto-Batterie und Antri": x 64/187, w 640/391 | "So funktioniert ein Elektroaut": x 64/242, w 640/281 | "Die Batte
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/672x447, #5 672x448/768x768, #7 672x446/768x768, #8 672x448/382x254, #18 672x448/382x255
  - 390: [typography] 11 runs differ: "Die E-Auto-Batterie ist ein Energiep": size 19/17 | "Eine Batterie im E-Auto leistet viel": size 19/17 | "Das Batteriegewicht hängt mit der Re"
  - 390: [image-geometry] 6 images sized differently (preview/live): #2 390x520/342x227, #5 342x228/390x390, #7 342x227/390x390, #25 342x227/390x390, #26 390x260/390x390

### /de/elektroauto/bmw-charging-support
- status: differences remain; widths: 1440, 768, 390; height ratio: 162% / 147% / 87%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 9742px vs live 6007px (162%)
  - 1440: [typography] 3 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Vorvertragliche Transparenzinformati": align start/center | "Infobroschüre Bi
  - 1440: [layout] 8/23 text blocks placed differently: "Hier finden Sie die Bedienungs": x 96/308, w 1248/824 | "BMW Wallbox Professional.": w 1248/343 | "BMW Multifunction Charg
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1248x831/718x478, #3 1248x831/718x478, #4 1248x833/718x479, #5 1248x829/718x477, #6 1248x834/718x480
  - 768: [height] preview 7445px vs live 5051px (147%)
  - 768: [typography] 3 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Vorvertragliche Transparenzinformati": align start/center | "Infobroschüre Bi
  - 768: [layout] 16/23 text blocks placed differently: "BMW Ladeprodukte. Anleitungen ": x 64/220, w 640/324 | "Wallbox Professional": x -321/12 | "Multifunction Charger": x -16
  - 768: [image-geometry] 7 images sized differently (preview/live): #2 672x447/382x254, #3 672x447/382x254, #4 672x449/382x255, #5 672x447/382x254, #6 672x449/382x255
  - 390: [height] preview 5185px vs live 5980px (87%)
  - 390: [layout] 3/17 text blocks placed differently: "Zur BMW Kundenbetreuung": x 24/106 | "BMW Ladekabel Mode 3.": w 342/261 | "BMW Wallbox (Gen 3).": w 342/232

### /de/elektroauto/elektroauto-kosten
- status: differences remain; widths: 1440, 768, 390; height ratio: 156% / 142% / 102%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 18025px vs live 11563px (156%)
  - 1440: [typography] 6 runs differ: "Kauf. Unterhalt. Wartung.": size 18/23 | "E-Autos im Preisvergleich": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Sofort verfügbare BMW Elektroa
  - 1440: [layout] 33/70 text blocks placed differently: "Die Kosten eines Elektroautos.": w 512/329 | "Kauf. Unterhalt. Wartung.": w 512/259 | "Wenn der Preis der Leistung en": x
  - 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/367x300, #17 294x240/718x477, #19 718x477/1440x477, #20 1440x480/718x479, #23 718x478/270x180
  - 768: [height] preview 18164px vs live 12759px (142%)
  - 768: [typography] 6 runs differ: "Kauf. Unterhalt. Wartung.": size 17/20 | "E-Autos im Preisvergleich": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Sofort verfügbare BMW Elektroa
  - 768: [layout] 45/70 text blocks placed differently: "Die Kosten eines Elektroautos.": x 64/248, w 640/268 | "Kauf. Unterhalt. Wartung.": x 64/268, w 640/229 | "E-Autos im Pre
  - 768: [image-geometry] 8 images sized differently (preview/live): #2 768x336/308x251, #19 324x215/768x512, #20 768x512/324x216, #23 382x255/648x432, #27 672x448/324x215
  - 390: [typography] 5 runs differ: "Kauf. Unterhalt. Wartung.": size 16/19 | "Sofort verfügbare BMW Elektroautos": size 16/14 | "Mehr über gebrauchte BMW Elektroauto": size 16/14 |
  - 390: [layout] 23/65 text blocks placed differently: "Die Kosten eines Elektroautos.": w 325/247 | "Kauf. Unterhalt. Wartung.": x 32/86, w 325/218 | "Modelle": w 126/294 | "M 

### /de/elektroauto/elektroauto-reichweite
- status: differences remain; widths: 1440, 768, 390; height ratio: 194% / 166% / 114%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 20090px vs live 10341px (194%)
  - 1440: [layout] 33/59 text blocks placed differently: "Die Reichweite von Elektroauto": w 512/371 | "Komfortabel im Alltag unterweg": w 512/344 | "Weit. Weiter. Elektrische Rei
  - 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/367x300, #18 1248x832/270x180, #19 1248x832/270x180, #20 1248x832/270x180, #21 1248x832/718x479
  - 768: [height] preview 19014px vs live 11472px (166%)
  - 768: [layout] 39/59 text blocks placed differently: "Die Reichweite von Elektroauto": x 64/232, w 640/301 | "Komfortabel im Alltag unterweg": x 64/229, w 640/307 | "Reichweit
  - 768: [image-geometry] 8 images sized differently (preview/live): #2 768x336/308x251, #17 294x240/648x431, #21 672x448/382x255, #25 324x216/648x432, #29 672x448/324x215
  - 390: [height] preview 16083px vs live 14119px (114%)
  - 390: [layout] 24/56 text blocks placed differently: "Komfortabel im Alltag unterweg": x 32/102 | "Modelle": w 126/294 | "M Modell": w 126/294 | "Modell": w 126/294 | "Die My 

### /de/elektroauto/elektroautos-vorteile
- status: differences remain; widths: 1440, 768, 390; height ratio: 179% / 140% / 117%
- blocks: hero-teaser, disclaimer, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 16546px vs live 9246px (179%)
  - 1440: [layout] 37/56 text blocks placed differently: "Die Vorteile und Auswirkungen ": w 512/359 | "Kostenplanung. Alltagsnutzen. ": w 512/315 | "Die Kostenvorteile von Elektr
  - 1440: [image-geometry] 14 images sized differently (preview/live): #2 1440x630/718x479, #4 718x477/376x251, #5 1248x832/376x251, #6 1248x832/376x251, #7 1248x832/718x477
  - 768: [height] preview 12747px vs live 9124px (140%)
  - 768: [layout] 33/56 text blocks placed differently: "Die Vorteile und Auswirkungen ": x 64/237, w 640/290 | "Kostenplanung. Alltagsnutzen. ": x 64/242, w 640/281 | "Die Koste
  - 768: [image-geometry] 9 images sized differently (preview/live): #2 768x336/382x255, #4 382x254/648x433, #7 672x448/382x254, #9 382x254/648x431, #12 672x448/382x255
  - 390: [height] preview 12478px vs live 10633px (117%)
  - 390: [layout] 17/53 text blocks placed differently: "Laden leicht gemacht mit BMW C": x 24/390 | "Auch unterwegs besteht als Kun": x 24/390 | "Mehr zu Laden unterwegs": x 24/

### /de/elektroauto/foerderungen
- status: differences remain; widths: 1440, 768, 390; height ratio: 226% / 164% / 136%
- blocks: hero-teaser, icon-teaser, carousel, disclaimer, model-overview, cards-quicklink
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [height] preview 15966px vs live 7062px (226%)
  - 1440: [typography] 27 runs differ: "Dienstwagenbesteuerung Beispielrechn": size 18/15 | "Steuersatz 0,25 %": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Bruttogehalt: 6.500,00 €":
  - 1440: [layout] 52/69 text blocks placed differently: "Dynamisch, emissionsarm und mi": x 96/308, w 1248/824 | "Neue Regelung: der Investition": x 96/344, w 1248/752, ypos 5%/1
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1184x526/376x167, #3 1184x526/376x167, #4 1184x526/376x167, #5 1523x1243/475x388, #6 1523x1243/475x388
  - 768: [height] preview 13646px vs live 8338px (164%)
  - 768: [typography] 27 runs differ: "Dienstwagenbesteuerung Beispielrechn": size 17/14 | "Steuersatz 0,25 %": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Bruttogehalt: 6.500,00 €":
  - 768: [layout] 53/69 text blocks placed differently: "Unser Steuertipp fährt elektri": x 64/207, w 640/350 | "Profitieren Sie von der gesetz": x 64/209, w 640/346 | "Dynamisch
  - 768: [image-geometry] 3 images sized differently (preview/live): #5 1270x1037/416x339, #6 1270x1037/416x339, #7 282x100/768x106
  - 390: [height] preview 13270px vs live 9787px (136%)
  - 390: [typography] 27 runs differ: "Dienstwagenbesteuerung Beispielrechn": size 16/14 | "Steuersatz 0,25 %": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Bruttogehalt: 6.500,00 €":
  - 390: [layout] 42/69 text blocks placed differently: "BMW Modelle": x 263/95, w 90/231 | "Mehr Netto vom Brutto mit eine": ypos 16%/23% | "Bruttogehalt: 6.500,00 €": w 181/294
  - 390: [image-geometry] 3 images sized differently (preview/live): #4 294x131/257x210, #5 852x695/257x210, #6 852x695/390x71

### /de/elektroauto/foerderungen-privatkunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 186% / 144% / 125%
- blocks: hero-teaser, icon-teaser, columns, model-overview, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [height] preview 18217px vs live 9787px (186%)
  - 1440: [layout] 63/78 text blocks placed differently: "AI-generated content": x -1/1395 | "Mit dem neuen Förderprogramm d": x 96/308, w 1248/824 | "Neues Förderprogramm gilt rü
  - 1440: [image-geometry] 6 images sized differently (preview/live): #6 1523x1243/475x388, #7 1523x1243/475x388, #8 1523x1243/475x388, #9 1523x1243/1440x95, #10 1523x1243/612x408
  - 768: [height] preview 17332px vs live 12067px (144%)
  - 768: [layout] 52/78 text blocks placed differently: "Staatlich gefördert, elektrisc": x 64/218, w 640/329 | "Sichern Sie sich bis zu 6.000 ": x 64/179, w 640/406 | "Mit dem n
  - 768: [image-geometry] 5 images sized differently (preview/live): #6 1270x1037/416x339, #7 1270x1037/416x339, #8 1270x1037/768x90, #9 1270x1037/324x216, #10 1270x1037/324x216
  - 390: [height] preview 16121px vs live 12930px (125%)
  - 390: [layout] 35/78 text blocks placed differently: "- Batterieelektrisch (BEV)": w 186/342 | "- Plug-in-Hybrid (PHEV)": w 176/342 | "Elektrisch ins Studium.": w 342/234 | "E
  - 390: [image-geometry] 5 images sized differently (preview/live): #6 852x695/257x210, #7 852x695/257x210, #8 852x695/390x60, #9 852x695/342x228, #10 852x695/342x228

### /de/elektroauto/gebrauchte-elektroautos
- status: differences remain; widths: 1440, 768, 390; height ratio: 229% / 172% / 138%
- blocks: hero-teaser, content-navigation, columns, icon-teaser, model-overview, disclaimer, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 24636px vs live 10754px (229%)
  - 1440: [layout] 56/84 text blocks placed differently: "Das spricht für einen elektris": x 96/317, w 1248/807 | "Lohnt sich der Kauf eines gebr": x 96/308, w 1248/824 | "BMW Pre
  - 1440: [image-geometry] 15 images sized differently (preview/live): #2 1440x630/718x477, #3 718x477/475x388, #4 1523x1243/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x104
  - 768: [height] preview 20751px vs live 12058px (172%)
  - 768: [layout] 57/84 text blocks placed differently: "Auch gebraucht keine Kompromis": x 64/168, w 640/428 | "BMW Premium Selection": x 12/-73 | "Vorteile": x 193/108 | "BMW M
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/382x254, #3 382x254/416x339, #4 1270x1037/416x339, #5 1270x1037/768x97, #6 1270x1037/382x254
  - 390: [height] preview 20009px vs live 14502px (138%)
  - 390: [layout] 37/80 text blocks placed differently: "Auch gebraucht keine Kompromis": x 32/89, w 325/212 | "Zwei Jahre BMW Premium Selecti": x 24/79, w 342/232 | "Auch gebrau
  - 390: [image-geometry] 10 images sized differently (preview/live): #2 390x520/342x227, #3 342x227/257x210, #4 852x695/257x210, #5 852x695/390x67, #6 852x695/342x228

### /de/elektroauto/home-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 158% / 134% / 118%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, columns, text-media-teaser, download, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 20596px vs live 13049px (158%)
  - 1440: [layout] 58/108 text blocks placed differently: "E-Auto zuhause laden.": w 616/449 | "Laden Sie Ihr Elektroauto zuha": x 96/308, w 1248/824 | "BMW Elektromobilität begin
  - 1440: [image-geometry] 20 images sized differently (preview/live): #2 1440x630/1440x480, #4 839x559/1440x480, #5 839x559/294x196, #6 839x559/294x196, #7 839x559/294x196
  - 768: [height] preview 21146px vs live 15726px (134%)
  - 768: [layout] 66/113 text blocks placed differently: "E-Auto zuhause laden.": x 64/201, w 640/363 | "Laden Sie Ihr E-Auto flexibel ": x 64/174, w 640/416 | "Zum Installations
  - 768: [image-geometry] 10 images sized differently (preview/live): #2 768x336/768x768, #4 672x448/768x768, #12 382x255/672x448, #13 768x768/382x255, #14 382x255/768x768
  - 390: [height] preview 19469px vs live 16459px (118%)
  - 390: [layout] 44/108 text blocks placed differently: "E-Auto zuhause laden.": x 32/74, w 325/243 | "Laden Sie Ihr E-Auto flexibel ": w 325/246 | "Zum Installationspartner": x
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/390x390, #4 342x228/390x390, #13 390x585/342x228, #14 342x229/390x583, #15 342x342/342x228

### /de/elektroauto/plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 126% / 125% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 15510px vs live 12327px (126%)
  - 1440: [typography] 11 runs differ: "Flexibel. Effizient. Kraftvoll.": size 18/23 | "PHEV Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) | "So funktioniert ein Hybrid-Auto": al
  - 1440: [layout] 28/68 text blocks placed differently: "Flexibel. Effizient. Kraftvoll": w 512/276 | "Entdecken Sie die praktische W": x 96/308, w 1248/824 | "BMW Plug-in-Hybrid
  - 1440: [image-geometry] 5 images sized differently (preview/live): #2 1440x630/367x300, #16 294x240/612x407, #18 612x407/400x267, #21 400x267/718x479, #27 718x479/294x195
  - 768: [height] preview 17983px vs live 14339px (125%)
  - 768: [typography] 11 runs differ: "Flexibel. Effizient. Kraftvoll.": size 17/20 | "PHEV Technologie": color rgb(102, 102, 102)/rgb(38, 38, 38) | "So funktioniert ein Hybrid-Auto"
  - 768: [layout] 38/68 text blocks placed differently: "BMW Plug-in-Hybrid (PHEV).": x 64/218, w 640/328 | "Flexibel. Effizient. Kraftvoll": x 64/259, w 640/247 | "PHEV Modelle"
  - 768: [image-geometry] 6 images sized differently (preview/live): #2 768x336/308x251, #18 324x215/672x449, #21 672x448/382x255, #28 672x446/324x215, #29 672x447/324x216
  - 390: [typography] 7 runs differ: "Flexibel. Effizient. Kraftvoll.": size 16/19 | "Sofort verfügbare Neuwagen": size 16/14 | "Sofort verfügbare Gebrauchtwagen": size 16/14 | "Mehr
  - 390: [layout] 11/67 text blocks placed differently: "BMW Plug-in-Hybrid (PHEV).": x 32/81, w 325/228 | "Flexibel. Effizient. Kraftvoll": x 32/80, w 325/231 | "BMW Plug-in-Hyb

### /de/elektroauto/public-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 170% / 130% / 103%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, columns, all-models, video, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: 12/16 chips, series line-height, filter weight, M logo; R0: poster until first frame; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 23807px vs live 14035px (170%)
  - 1440: [layout] 44/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 | "Sorgenfreies Laden, einfach, j": x 96/308, w 1248/824 | "Elektroauto laden 
  - 1440: [image-geometry] 20 images sized differently (preview/live): #2 1440x630/1440x480, #4 294x294/1440x480, #5 294x294/1440x480, #6 294x240/294x294, #7 294x240/294x294
  - 768: [height] preview 22244px vs live 17048px (130%)
  - 768: [layout] 51/86 text blocks placed differently: "E-Auto unterwegs laden.": x 64/185, w 640/395 | "Ihre erweiterte Ladeinfrastruk": x 64/234, w 640/296 | "Fahrzeug konfigu
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x336/768x768, #4 382x382/768x768, #5 382x382/768x768, #6 294x240/382x382, #7 294x240/382x382
  - 390: [layout] 21/82 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": x 32/118 | "Fahrzeug konfigurieren": x 32/120 | "Probefahrt vereinbaren": x 32/120 | "Di
  - 390: [image-geometry] 7 images sized differently (preview/live): #2 390x520/390x390, #6 174x142/342x342, #7 174x142/342x342, #21 390x260/224x183, #22 390x260/224x183

### /de/elektroauto/rabatt-auf-die-bmw-wallbox-professional
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 78%
- blocks: disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 2324px vs live 2985px (78%)

### /de/fastlane/dealer-locator
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 89% / 71%
- blocks: dealer-locator
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [missing-text] 516/516 live text runs not visible on preview: "Suche nach Standort", "Suche nach Namen", "Neufahrzeug", "Gebrauchte Fahrzeuge"
  - 768: [height] preview 2173px vs live 2432px (89%)
  - 768: [missing-text] 512/512 live text runs not visible on preview: "Suche nach Standort", "Suche nach Namen", "Neufahrzeug", "Gebrauchte Fahrzeuge"
  - 390: [height] preview 1748px vs live 2454px (71%)
  - 390: [missing-text] 501/501 live text runs not visible on preview: "Suche nach Standort", "Suche nach Namen", "Neufahrzeug", "Mehr Filter"
- notes: dealer data + HERE map need the bmw-proxy worker (not deployed yet)

### /de/footer/footer-section/cookie-policy
- status: differences remain; widths: 1440, 768, 390; height ratio: 20% / 19% / 11%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [height] preview 1412px vs live 7085px (20%)
  - 768: [height] preview 1533px vs live 7884px (19%)
  - 390: [height] preview 1108px vs live 10403px (11%)

### /de/footer/metanavigation/bmw-barrierefreiheit
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 77% / 96%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 3 runs differ: "Kaufen": color rgb(28, 105, 212)/rgb(38, 38, 38) | "Tel.: +49 89 1250 16000": size 15/18 | "Nachricht senden": size 15/18
  - 1440: [layout] 15/51 text blocks placed differently: "Barrierefreiheit.": w 1248/303 | "Online-Bestellung von Fahrzeug": w 1248/447 | "Kaufen": x 308/96 | "BMW Leasing": x 308
  - 768: [height] preview 5625px vs live 7293px (77%)
  - 768: [layout] 46/51 text blocks placed differently: "Barrierefreiheit.": x 48/164, w 672/245 | "Die BMW AG (nachfolgend „BMW")": x 48/164, w 672/440 | "www.bmw.de": x 48/392 
  - 390: [layout] 6/51 text blocks placed differently: "Barrierefreiheit.": w 342/225 | "Online-Bestellung von Fahrzeug": w 342/229 | "BMW ConnectedDrive.": w 342/234 | "Zubehör 

### /de/footer/metanavigation/bmw-betrugsfaelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 85% / 79% / 98%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [height] preview 3402px vs live 4022px (85%)
  - 1440: [layout] 35/36 text blocks placed differently: "Sicherheit im Internet, Betrug": x 96/405, w 1248/631 | "Wenn Sie verdächtige Mitteilun": x 96/308, w 1248/824 | "Was ist
  - 768: [height] preview 4139px vs live 5246px (79%)
  - 768: [layout] 35/36 text blocks placed differently: "Sicherheit im Internet, Betrug": x 48/192, w 672/385 | "Wenn Sie verdächtige Mitteilun": x 48/164, w 672/440 | "Was ist I
  - 390: [layout] 4/36 text blocks placed differently: "Kontaktformular": x 24/142 | "Was ist Identitätsbetrug?": w 342/256 | "Gefälschte Rechnungen erkennen": w 342/247 | "So sc

### /de/footer/metanavigation/data-privacy
- status: differences remain; widths: 1440, 768, 390; height ratio: 40% / 44% / 35%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 2616px vs live 6591px (40%)
  - 1440: [layout] 3/12 text blocks placed differently: "BMW Datenschutzhinweise.": x 96/497, w 1248/447 | "Der hohe Anspruch, den Sie an ": x 96/308, w 1248/824 | "Die BMW Datens
  - 768: [height] preview 2789px vs live 6281px (44%)
  - 768: [layout] 3/12 text blocks placed differently: "BMW Datenschutzhinweise.": x 48/199, w 672/371 | "Der hohe Anspruch, den Sie an ": x 48/164, w 672/440 | "Die BMW Datensch
  - 390: [height] preview 2676px vs live 7593px (35%)

### /de/footer/metanavigation/data-privacy/data-category
- status: match; widths: 1440, 768, 390; height ratio: 97% / 96% / 99%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: none

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-c
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 72%
- blocks: columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"
  - 768: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"
  - 390: [height] preview 1728px vs live 2401px (72%)
  - 390: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-d
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 78%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 2352px vs live 3011px (78%)

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-e
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 81%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 2800px vs live 3477px (81%)

### /de/footer/metanavigation/eu-batterieverordnung
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 88% / 65%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 3/3 text blocks placed differently: "EU Batterieverordnung.": x 95/490, w 1/461 | "Abfallvermeidung und Bewirtsch": x 96/367, w 1248/706, ypos 8%/14% | "Artikel
  - 768: [height] preview 1845px vs live 2094px (88%)
  - 768: [layout] 3/3 text blocks placed differently: "EU Batterieverordnung.": x 47/198, w 1/372 | "Abfallvermeidung und Bewirtsch": x 48/195, w 672/378 | "Artikel 74 der EU-Bat
  - 390: [height] preview 1567px vs live 2397px (65%)

### /de/footer/metanavigation/legal-disclaimer-pool/produktsicherheitsverordnung
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 69%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 1482px vs live 2141px (69%)

### /de/footer/metanavigation/legal-disclaimer-pool/legal-disclaimer
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 84%
- blocks: disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 1248/321 | "Außergerichtliche Streitbeileg": w 1248/347 | "Anlaufstellen für hinweisgeben": w 124
  - 768: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 672/266 | "Außergerichtliche Streitbeileg": w 672/310 | "Anlaufstellen für hinweisgeben": w 672/4
  - 390: [height] preview 4178px vs live 4983px (84%)

### /de/footer/metanavigation/legal-notice-pool/imprint
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 96% / 78%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 2746px vs live 3515px (78%)

### /de/home
- status: differences remain; widths: 1440, 768, 390; height ratio: 112% / 108% / 88%
- blocks: hero-stage, disclaimer, cards-quicklink, hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 5428px vs live 4832px (112%)
  - 1440: [layout] 8/24 text blocks placed differently: "Finden Sie Ihren BMW.": x 96/539, w 1248/363 | "Verfügbare Gebrauchtwagen.": x 118/470 | "Gebrauchtwagen suchen": x 96/472
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 1440x630/1440x482, #5 1440x480/718x479
  - 768: [layout] 12/24 text blocks placed differently: "DER NEUE BMW X5": x 106/158 | "Finden Sie Ihren BMW.": x 48/234, w 672/300 | "Verfügbare Neuwagen.": w 105/211 | "Neuwage
  - 390: [height] preview 5801px vs live 6594px (88%)
  - 390: [layout] 6/24 text blocks placed differently: "Neuwagen suchen": x 24/135 | "Gebrauchtwagen suchen": x 24/115 | "Jetzt testen": x 24/158 | "Jetzt neu: Der BMW iX3 40.": 
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 390x520/390x391, #5 390x390/342x228

### /de/konfigurator
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 112% / 109%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: 
  - 1440: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
  - 1440: [layout] 4/20 text blocks placed differently: "Alle BMW Modelle konfigurieren": w 1248/515 | "Kategorien": w 101/245 | "Serien": w 59/245 | "Antriebsvarianten": w 164/24
  - 768: [height] preview 17292px vs live 15392px (112%)
  - 768: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
  - 768: [layout] 4/17 text blocks placed differently: "Alle BMW Modelle konfigurieren": w 672/427 | "Plug-in-Hybrid": x 1024/1067 | "Benzin": x 1155/1201 | "Diesel": x 1237/1285
  - 390: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
  - 390: [layout] 7/17 text blocks placed differently: "Alle BMW Modelle konfigurieren": w 342/230 | "Plug-in-Hybrid": x 1000/1043 | "Benzin": x 1131/1177 | "Diesel": x 1213/1261
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/landingpage/bmw-fahrfreude-gewinnen
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 83%
- blocks: hero-teaser, disclaimer, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 5/12 text blocks placed differently: "Pure Fahrfreude gewinnen.": w 512/279 | "Vorfreude. Spielfreude. Fahrfr": x 96/444, w 1248/553 | "Sichern Sie sich mit den
  - 768: [layout] 6/12 text blocks placed differently: "Die BMW Gewinnspiele.": x 64/191, w 640/382 | "Pure Fahrfreude gewinnen.": x 64/258, w 640/249 | "Vorfreude. Spielfreude. 
  - 390: [height] preview 3372px vs live 4069px (83%)
  - 390: [layout] 4/12 text blocks placed differently: "Die BMW Gewinnspiele.": x 32/92, w 325/207 | "Pure Fahrfreude gewinnen.": x 32/76, w 325/239 | "Jetzt entdecken": x 24/144

### /de/landingpage/shops
- status: differences remain; widths: 1440, 768, 390; height ratio: 128% / 107% / 89%
- blocks: columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 4461px vs live 3495px (128%)
  - 1440: [typography] 5 runs differ: "Neuwagen finden": size 18/15 | "Gebrauchtwagen finden": size 18/15 | "Digitale Dienste finden": size 18/15 | "BMW Zubehör finden": size 18/15 | 
  - 1440: [layout] 14/24 text blocks placed differently: "BMW Online Stores auf einen Bl": x 96/441, w 1248/559 | "Entdecken Sie alle Angebote de": x 96/308, w 1248/824 | "BMW Con
  - 1440: [image-geometry] 2 images sized differently (preview/live): #6 1112x741/612x408, #7 1112x741/612x409
  - 768: [typography] 5 runs differ: "Neuwagen finden": size 17/14 | "Gebrauchtwagen finden": size 17/14 | "Digitale Dienste finden": size 17/14 | "BMW Zubehör finden": size 17/14 | 
  - 768: [layout] 7/24 text blocks placed differently: "BMW Online Stores auf einen Bl": x 48/191, w 672/386 | "Entdecken Sie alle Angebote de": x 48/164, w 672/440 | "BMW Connec
  - 390: [height] preview 4349px vs live 4899px (89%)
  - 390: [typography] 5 runs differ: "Neuwagen finden": size 16/14 | "Gebrauchtwagen finden": size 16/14 | "Digitale Dienste finden": size 16/14 | "BMW Zubehör finden": size 16/14 | 
  - 390: [layout] 4/24 text blocks placed differently: "BMW Connected Drive.": w 342/201 | "Online Terminvereinbarung.": x 24/382 | "Buchen Sie einen Servicetermin": x 24/382 | "

### /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 77%
- blocks: hero-teaser, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 390: [height] preview 2522px vs live 3259px (77%)

### /de/mehr-bmw/bmw-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 137% / 78%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 2593px vs live 2885px (90%)
  - 1440: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 1440: [typography] 4 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 18/43, color rgb(38, 38, 38)/rgb(255, 255, 255) | "BMW Premium Selection Garantie": align start/center | "Jetz
  - 768: [height] preview 4594px vs live 3344px (137%)
  - 768: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 768: [typography] 4 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 14/35, color rgb(38, 38, 38)/rgb(255, 255, 255), align start/center | "BMW Premium Selection Garantie": align 
  - 768: [layout] 7/13 text blocks placed differently: "BMW GEBRAUCHTE AUTOMOBILE.": x 47/214, w 1/337 | "BMW JUNGE GEBRAUCHTE": w 672/261 | "Mit den Jungen Gebrauchten von": w 6
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x446/324x215, #4 672x448/324x216, #5 672x448/324x216
  - 390: [height] preview 3421px vs live 4414px (78%)
  - 390: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 390: [typography] 3 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 14/33, color rgb(38, 38, 38)/rgb(255, 255, 255), align start/center | "Jetzt mehr erfahren": size 16/14 | "Jet
  - 390: [layout] 6/13 text blocks placed differently: "BMW GEBRAUCHTE AUTOMOBILE.": w 1/320, ypos 20%/9% | "Gebrauchtwagen suchen": x 32/115 | "BMW JUNGE GEBRAUCHTE": w 342/251 

### /de/mehr-bmw/bmw-gebrauchte/europlusgarantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 128% / 87%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [height] preview 6068px vs live 4731px (128%)
  - 768: [layout] 14/35 text blocks placed differently: "DIE EUROPLUS GARANTIE.": x 64/155, w 640/455 | "DAMIT DIE FREUDE DAUERHAFT BLE": x 64/135 | "IHRE VORTEILE AUF EINEN BLIC
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x215, #4 672x447/324x215, #5 672x449/324x216
  - 390: [height] preview 5694px vs live 6514px (87%)

### /de/mehr-bmw/bmw-gebrauchte/garantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 126% / 86%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(102, 102, 102)/rgb(25
  - 1440: [layout] 5/31 text blocks placed differently: "AI-generated content": x -1/1395 | "BMW PREMIUM SELECTION GARANTIE": x 738/104, w 256/484, ypos 17%/9% | "DIE NEUEN GEBRAU
  - 768: [height] preview 5930px vs live 4707px (126%)
  - 768: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 14/35, color rgb(102, 102, 102)/rgb(25
  - 768: [layout] 13/31 text blocks placed differently: "BMW PREMIUM SELECTION GARANTIE": x 368/186, w 231/392 | "DIE NEUEN GEBRAUCHTEN.": x 64/213, w 640/338 | "IHRE VORTEILE AU
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x215, #4 672x447/324x215, #5 672x449/324x216
  - 390: [height] preview 5559px vs live 6486px (86%)
  - 390: [missing-text] 3/31 live text runs not visible on preview: "BMW PREMIUM SELECTION GARANTIE.", "Premium Selection Garantie", "die Premium Selection Servicestelle"

### /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 85%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 5 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 43/35 | "BMW Premium Selection Garantie": al
  - 1440: [layout] 6/35 text blocks placed differently: "AI-generated content": x -1/1395 | "Preisvorteil sichern": w 1248/297 | "Folgende Kriterien gelten für ": w 1248/624 | "BM
  - 768: [typography] 5 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 35/29 | "BMW Premium Selection Garantie": al
  - 768: [layout] 5/35 text blocks placed differently: "Junge Gebrauchte von BMW.": x 64/194, w 640/377 | "Fahrzeug finden": x 308/248 | "Preisvorteil sichern": w 672/248 | "BMW 
  - 390: [height] preview 5261px vs live 6176px (85%)
  - 390: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 33/28 | "Mehr erfahren": size 16/14 | "Jetzt

### /de/mehr-bmw/bmw-gebrauchte/premium-selection
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 152% / 105%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 1440: [typography] 13 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 23/28 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 1440: [layout] 12/20 text blocks placed differently: "BMW PREMIUM SELECTION.": w 512/323 | "DIE NEUEN GEBRAUCHTEN.": w 512/380 | "STANDARDS HABEN WIR AUCH. NUR ": w 1248/897 |
  - 768: [height] preview 6930px vs live 4568px (152%)
  - 768: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 768: [typography] 13 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 20/25 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 768: [layout] 7/20 text blocks placed differently: "BMW PREMIUM SELECTION.": x 64/251, w 640/263 | "DIE NEUEN GEBRAUCHTEN.": x 64/213, w 640/338 | "STANDARDS HABEN WIR AUCH. 
  - 390: [missing-text] 3/21 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 390: [typography] 12 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 19/23 | "Ein Fahrzeug, auf das Sie sich verla": align start/center | "Hier mehr erfahren.": size 16/14 | "BMW Pre
  - 390: [layout] 4/18 text blocks placed differently: "BMW PREMIUM SELECTION.": w 325/248 | "JETZT IHR FAHRZEUG FINDEN": x 32/92, w 325/206 | "Hier mehr erfahren.": x 24/122 | "

### /de/mehr-bmw/bmw-individual
- status: differences remain; widths: 1440, 768, 390; height ratio: 160% / 141% / 120%
- blocks: hero-teaser, content-navigation, columns, disclaimer, carousel, media-showcase
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 19529px vs live 12192px (160%)
  - 1440: [layout] 42/55 text blocks placed differently: "BMW Individual.": w 512/316 | "Außergewöhnlicher Stil, der au": w 512/365 | "Sie setzen auf Stil statt auf ": x 96/308, w
  - 1440: [image-geometry] 25 images sized differently (preview/live): #3 1248x832/718x479, #4 1248x832/294x196, #5 549x366/294x196, #6 549x366/294x196, #7 549x366/294x196
  - 768: [height] preview 19815px vs live 14070px (141%)
  - 768: [layout] 41/55 text blocks placed differently: "BMW Individual.": x 64/255, w 640/255 | "Außergewöhnlicher Stil, der au": x 64/220, w 640/325 | "Sie setzen auf Stil stat
  - 768: [image-geometry] 9 images sized differently (preview/live): #2 672x378/672x895, #3 672x448/382x255, #10 672x448/768x768, #11 768x768/672x895, #17 672x448/382x254
  - 390: [height] preview 16785px vs live 14000px (120%)
  - 390: [layout] 19/53 text blocks placed differently: "BMW Individual.": x 32/76, w 325/239 | "BMW Individual jetzt gestalten": x 32/96 | "BMW M3 Competition – BMW Indiv": x 24

### /de/mehr-bmw/bmw-special-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 138% / 122% / 104%
- blocks: hero-teaser, content-navigation, columns, carousel, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 8181px vs live 5918px (138%)
  - 1440: [layout] 15/30 text blocks placed differently: "Spezielle Produkte für speziel": x 96/346, w 1248/748 | "BMW bietet Ihnen eine Vielzahl": x 96/308, w 1248/824 | "Verlass
  - 1440: [image-geometry] 3 images sized differently (preview/live): #7 1248x832/400x266, #8 1248x832/400x266, #9 1248x832/400x266
  - 768: [height] preview 6229px vs live 5105px (122%)
  - 768: [layout] 20/30 text blocks placed differently: "BMW Sonderkunden.": x 64/214, w 640/337 | "Bei BMW erwartet Sie ein beson": x 64/172, w 640/424 | "BMW Behördenfahrzeuge"
  - 390: [layout] 9/30 text blocks placed differently: "BMW Einsatzfahrzeuge.": w 342/252 | "BMW Diplomatic Sales.": w 342/243 | "BMW Military Sales.": w 342/208 | "Der BMW X5 Pr

### /de/mehr-bmw/bmw-special-sales/bmw-7-protection
- status: differences remain; widths: 1440, 768, 390; height ratio: 163% / 134% / 121%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, video, tabs, multi-content-gallery, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17057px vs live 10438px (163%)
  - 1440: [layout] 35/67 text blocks placed differently: "BMW 7 Protection.": w 512/361 | "Vorteile auf einen Blick.": x 96/536, w 1248/368 | "Erstklassige Fahrdynamik.": x 152/58
  - 1440: [image-geometry] 6 images sized differently (preview/live): #4 1248x702/718x478, #6 718x477/1440x480, #9 1248x832/270x180, #10 1248x832/270x179, #11 1248x832/270x180
  - 768: [height] preview 15071px vs live 11210px (134%)
  - 768: [layout] 36/69 text blocks placed differently: "BMW 7 Protection.": x 64/236, w 640/292 | "Welcome to a new era of protec": x 64/172, w 640/424 | "Vorteile auf einen Bli
  - 768: [image-geometry] 4 images sized differently (preview/live): #6 672x447/768x768, #18 324x216/672x448, #19 324x216/672x447, #20 324x216/672x448
  - 390: [height] preview 12417px vs live 10277px (121%)
  - 390: [layout] 20/67 text blocks placed differently: "Herausragendes Protection-Konz": x 24/70, w 327/250 | "Ein neuer Maßstab für Sicherhe": w 342/229 | "Driving Performance.

### /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 144% / 118% / 105%
- blocks: hero-teaser, disclaimer, content-navigation, columns, icon-teaser, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 8668px vs live 6009px (144%)
  - 1440: [layout] 18/43 text blocks placed differently: "Exklusive Vorteile für Diploma": x 96/377, w 1248/687, ypos 15%/21% | "Sonderkonditionen für Dienstwa": x 224/108 | "Pers
  - 1440: [image-geometry] 3 images sized differently (preview/live): #6 1248x832/376x250, #7 1248x832/376x250, #8 1248x832/376x250
  - 768: [height] preview 7924px vs live 6733px (118%)
  - 768: [layout] 16/43 text blocks placed differently: "BMW Diplomatic Sales.": x 64/196, w 640/372 | "Einen besonderen Service gewäh": x 64/172, w 640/424 | "Exklusive Vorteile
  - 390: [layout] 10/42 text blocks placed differently: "BMW Diplomatic Sales.": w 325/247 | "Kontakt anfragen": x 32/139 | "Sonderkonditionen für Dienstwa": x 37/99 | "Pre-Sales

### /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 175% / 133% / 117%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, multi-content-gallery
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: card title sizes, large-titles option
- remaining: 
  - 1440: [height] preview 19492px vs live 11163px (175%)
  - 1440: [layout] 67/119 text blocks placed differently: "Effizient. Zuverlässig. Profes": w 512/367 | "Die beste Wahl für Ihren Einsa": x 96/463, w 1248/514 | "Erstklassige Kost
  - 1440: [image-geometry] 13 images sized differently (preview/live): #2 1138x759/400x267, #3 1138x759/400x267, #4 1138x759/400x267, #14 1248x832/1440x480, #15 1248x832/1440x480
  - 768: [height] preview 16455px vs live 12339px (133%)
  - 768: [layout] 89/137 text blocks placed differently: "BMW Einsatzfahrzeuge.": x 64/191, w 640/382 | "Effizient. Zuverlässig. Profes": x 64/220, w 640/324 | "BMW entwickelt se
  - 768: [image-geometry] 5 images sized differently (preview/live): #14 672x448/768x768, #15 672x448/768x768, #16 672x448/768x768, #17 672x448/768x768, #18 672x448/768x768
  - 390: [height] preview 14656px vs live 12503px (117%)
  - 390: [layout] 38/135 text blocks placed differently: "Maximale Sicherheit.": x 59/105 | "Erstklassige Kosteneffizienz.": x 24/71 | "Innovative Technologie.": x 48/95 | "BMW N
  - 390: [image-geometry] 5 images sized differently (preview/live): #14 342x228/390x390, #15 342x228/390x390, #16 342x228/390x390, #17 342x228/390x390, #18 342x228/390x390

### /de/mehr-bmw/bmw-special-sales/bmw-military-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 135% / 112% / 100%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 9450px vs live 7021px (135%)
  - 1440: [typography] 5 runs differ: "Einen besonderen Service bereiten wi": size 18/23 | "Service & Konditionen": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Direkten Kontakt zu uns
  - 1440: [layout] 21/47 text blocks placed differently: "Exklusive Vorteile für US-Mili": x 96/378, w 1248/684 | "Erhebliche Einsparungen durch ": w 470/322 | "Feste Preise und u
  - 1440: [image-geometry] 3 images sized differently (preview/live): #8 1248x832/400x266, #9 1248x832/400x266, #10 1248x832/400x266
  - 768: [height] preview 8781px vs live 7821px (112%)
  - 768: [typography] 5 runs differ: "Einen besonderen Service bereiten wi": size 17/20 | "Service & Konditionen": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Direkten Kontakt zu uns
  - 768: [layout] 16/47 text blocks placed differently: "BMW und MINI Military Sales.": x 64/200, w 640/365 | "Einen besonderen Service berei": x 64/176, w 640/413 | "Exklusive V
  - 390: [typography] 4 runs differ: "Einen besonderen Service bereiten wi": size 16/19 | "Direkten Kontakt zu uns nehmen Sie h": size 16/14 | "BMW Herstellerangebot": size 16/14 | "
  - 390: [layout] 9/46 text blocks placed differently: "BMW und MINI Military Sales.": x 32/82, w 325/227 | "Kontakt anfragen": x 32/139 | "Feste Preise und umsatzsteuerb": x 24/

### /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 226% / 165% / 139%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, disclaimer, columns, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 20322px vs live 8979px (226%)
  - 1440: [layout] 36/73 text blocks placed differently: "Diese Vorteile bieten Ihnen di": x 96/430, w 1248/580 | "Gepanzerte Modelle, vollelektr": w 565/353 | "Ganz auf Ihre Bedü
  - 1440: [image-geometry] 16 images sized differently (preview/live): #2 1248x832/400x266, #3 1248x832/400x267, #4 1248x832/400x266, #6 1248x830/718x478, #11 951x634/270x180
  - 768: [height] preview 15865px vs live 9599px (165%)
  - 768: [layout] 35/73 text blocks placed differently: "BMW Sonderschutzfahrzeuge.": x 64/189, w 640/386 | "Seit über 45 Jahren setzt BMW ": x 64/172, w 640/424 | "Diese Vorteil
  - 390: [height] preview 13315px vs live 9604px (139%)
  - 390: [layout] 26/70 text blocks placed differently: "Ganz auf Ihre Bedürfnisse zuge": x 24/81, w 342/229 | "Ausgestattet mit höchster Sich": x 35/83, w 320/225 | "Umfassender

### /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6
- status: differences remain; widths: 1440, 768, 390; height ratio: 156% / 123% / 113%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, video, multi-content-gallery, carousel, tabs, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17728px vs live 11384px (156%)
  - 1440: [layout] 31/83 text blocks placed differently: "Vorteile auf einen Blick.": x 96/536, w 1248/368 | "Einzigartiges Fahrerlebnis.": x 106/583 | "Modernes Schutzkonzept.": 
  - 1440: [image-geometry] 12 images sized differently (preview/live): #4 1248x702/718x478, #6 1248x830/1440x480, #8 1248x832/1440x480, #9 1248x832/270x180, #10 1248x832/270x180
  - 768: [height] preview 14914px vs live 12102px (123%)
  - 768: [layout] 33/85 text blocks placed differently: "BMW X5 Protection VR6.": x 64/186, w 640/393 | "Visible agility. Invisible arm": x 64/172, w 640/424 | "Vorteile auf eine
  - 768: [image-geometry] 5 images sized differently (preview/live): #6 672x447/768x768, #8 672x448/768x768, #12 324x216/648x431, #18 324x216/672x449, #19 382x255/672x449
  - 390: [height] preview 13051px vs live 11534px (113%)
  - 390: [layout] 20/84 text blocks placed differently: "Komfort ohne Kompromisse.": x 24/70 | "Einzigartiges Fahrerlebnis.": x 34/80 | "Modernes Schutzkonzept.": x 36/82 | "Schu

### /de/mehr-bmw/concept-cars/bmw-speedtop
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 84% / 79%
- blocks: hero-teaser, text-media-teaser, carousel, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 8605px vs live 9675px (89%)
  - 1440: [layout] 11/40 text blocks placed differently: "BMW Speedtop.": w 512/319 | "Limitiertes Sammlerstück": w 512/263 | "Ein emotionales Sammlerstück.": w 376/256 | "Mehr an
  - 1440: [image-geometry] 13 images sized differently (preview/live): #2 1440x630/1248x702, #3 1248x702/416x520, #4 416x520/1440x631, #5 416x520/294x196, #6 1440x630/294x196
  - 768: [height] preview 9467px vs live 11285px (84%)
  - 768: [typography] 6 runs differ: "Ein echter BMW strahlt bereits im St": size 17/25, align start/center | "Adrian van Hooydonk, Leiter BMW Grou": align start/center | "Exterieur 
  - 768: [layout] 16/40 text blocks placed differently: "BMW Speedtop.": x 64/253, w 640/259 | "Limitiertes Sammlerstück": x 64/266, w 640/232 | "Ein emotionales Sammlerstück.": 
  - 768: [image-geometry] 11 images sized differently (preview/live): #2 768x336/672x895, #3 672x378/616x770, #5 616x770/672x447, #6 768x768/672x447, #9 672x448/672x894
  - 390: [height] preview 8214px vs live 10393px (79%)
  - 390: [typography] 6 runs differ: "Ein echter BMW strahlt bereits im St": size 16/23, align start/center | "Adrian van Hooydonk, Leiter BMW Grou": align start/center | "Exterieur 
  - 390: [layout] 7/40 text blocks placed differently: "BMW Speedtop.": x 32/75, w 325/241 | "Limitiertes Sammlerstück": x 32/85, w 325/221 | "Ein emotionales Sammlerstück.": w 3
  - 390: [image-geometry] 11 images sized differently (preview/live): #3 342x192/390x488, #4 342x428/390x586, #5 342x428/342x228, #6 390x585/342x228, #9 342x228/342x455

### /de/mehr-bmw/die-exklusiven-bmw-automobile
- status: differences remain; widths: 1440, 768, 390; height ratio: 144% / 130% / 109%
- blocks: hero-teaser, disclaimer, content-navigation, model-overview, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 16094px vs live 11146px (144%)
  - 1440: [layout] 29/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 | "Die exklusiven BMW Fahrzeuge e": x 96/308, w 1248/824 | "Modellvielfalt der
  - 1440: [image-geometry] 8 images sized differently (preview/live): #2 1523x1243/475x388, #3 1523x1243/475x388, #4 1523x1243/475x388, #5 1523x1243/1440x55, #7 1248x831/718x479
  - 768: [height] preview 15446px vs live 11863px (130%)
  - 768: [typography] 10 runs differ: "In jeder Facette. Bis ins letzte Det": size 17/20 | "The i7": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Limousine (2)": color rgb(38, 38, 38)
  - 768: [layout] 24/55 text blocks placed differently: "Exklusive Modelle. Mit Hingabe": x 64/204, w 640/356 | "In jeder Facette. Bis ins letz": x 64/218, w 640/329 | "Die exklu
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 1270x1037/416x339, #3 1270x1037/416x339, #4 1270x1037/768x54, #5 1270x1037/768x768, #6 768x768/382x255
  - 390: [typography] 8 runs differ: "In jeder Facette. Bis ins letzte Det": size 16/19 | "BMW i7 60 xDrive.": align center/start | "Der BMW i7 verbindet sinnliche Elega": align cent
  - 390: [layout] 14/52 text blocks placed differently: "BMW 7er": x 24/195 | "BMW X7": x 24/366 | "BMW XM Label": x 24/537 | "Der neue BMW i7": x 24/85, w 342/220, ypos 30%/15% 
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 852x695/257x210, #3 852x695/257x210, #4 852x695/390x586, #5 852x695/342x228, #8 390x585/342x228

### /de/mehr-bmw/digital-services-act
- status: differences remain; widths: 1440, 768, 390; height ratio: 85% / 85% / 76%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 4633px vs live 5480px (85%)
  - 1440: [layout] 35/37 text blocks placed differently: "Gesetz über digitale Dienste (": x 96/426, w 1248/589 | "Soweit die BMW AG („BMW“, „wir": x 96/308, w 1248/824 | "1. Kont
  - 768: [height] preview 6058px vs live 7148px (85%)
  - 768: [layout] 37/37 text blocks placed differently: "Gesetz über digitale Dienste (": x 48/199, w 672/370 | "Soweit die BMW AG („BMW“, „wir": x 48/164, w 672/440 | "1. Kontak
  - 390: [height] preview 8049px vs live 10549px (76%)
  - 390: [layout] 7/37 text blocks placed differently: "Gesetz über digitale Dienste (": x 24/70, w 342/251 | "1. Kontaktstelle für Kommunika": w 342/261 | "+49-89-1250-16000": x

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 93% / 81%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "Mehr erfahren": size 18/15 | "Zum Interview": size 18/15 | "Zum Beitrag": size 18/15
  - 1440: [layout] 4/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 | "Von den neuesten BMW Modellen ": x 96/328, w 1248/784 | "Fuhrparks intellige
  - 768: [typography] 3 runs differ: "Mehr erfahren": size 17/14 | "Zum Interview": size 17/14 | "Zum Beitrag": size 17/14
  - 768: [layout] 7/17 text blocks placed differently: "BMW Business Class.": x 64/209, w 640/347 | "Das Online-Magazin für Großkun": x 64/212, w 640/341 | "Von den neuesten BMW 
  - 390: [height] preview 4082px vs live 5046px (81%)
  - 390: [typography] 3 runs differ: "Mehr erfahren": size 16/14 | "Zum Interview": size 16/14 | "Zum Beitrag": size 16/14
  - 390: [layout] 3/17 text blocks placed differently: "Das Online-Magazin für Großkun": x 32/106 | "Fuhrparks intelligent steuern.": w 342/254 | "Fahrfreude neu definiert.": w 3

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister
- status: differences remain; widths: 1440, 768, 390; height ratio: 145% / 108% / 87%
- blocks: hero-teaser, content-navigation, columns, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 16147px vs live 11145px (145%)
  - 1440: [typography] 6 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige
  - 1440: [layout] 18/49 text blocks placed differently: "Interview mit Renzo Vitale.": x 832/1058, w 512/274 | "Stand 2024": x 96/0 | "Startseite Großkunden": x 241/145 | "Online
  - 1440: [image-geometry] 12 images sized differently (preview/live): #3 1248x1248/612x612, #4 1248x1248/612x612, #5 1248x1248/612x612, #6 1248x1248/612x612, #8 1248x1248/612x612
  - 768: [typography] 7 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ein BMW muss nicht brüllen, um geseh": size 17/25, align start/center | "Hol
  - 768: [layout] 19/49 text blocks placed differently: "DER KLANGMEISTER.": x 64/200, w 640/364 | "Interview mit Renzo Vitale.": x 64/261, w 640/243 | "Stand 2024": x 47/-1 | "S
  - 768: [image-geometry] 14 images sized differently (preview/live): #3 672x672/324x324, #4 672x672/324x324, #5 672x672/324x324, #6 672x672/324x324, #8 672x672/324x324
  - 390: [height] preview 13900px vs live 16047px (87%)
  - 390: [typography] 6 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 16/23, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige
  - 390: [layout] 6/48 text blocks placed differently: "Interview mit Renzo Vitale.": x 32/80, w 325/230 | "Hollywood bei BMW.": x 24/65, w 342/260 | "Kreative Prozesse und Inspi

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 93% / 85%
- blocks: hero-teaser, link-list, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "Mehr erfahren": size 18/15 | "Zum Interview": size 18/15 | "Jetzt teilnehmen": size 18/15
  - 1440: [layout] 4/20 text blocks placed differently: "BMW AUF DEM NÜRBURGRING.": x 468/388 | "BMW verstärkt die Sicherheit a": x 96/308, w 1248/824 | "Diese Artikel könnten Sie
  - 768: [typography] 3 runs differ: "Mehr erfahren": size 17/14 | "Zum Interview": size 17/14 | "Jetzt teilnehmen": size 17/14
  - 768: [layout] 7/20 text blocks placed differently: "BMW AUF DEM NÜRBURGRING.": x 64/115 | "Interview mit Christian Stepha": x 64/110 | "BMW verstärkt die Sicherheit a": x 48/
  - 390: [height] preview 5191px vs live 6077px (85%)
  - 390: [typography] 3 runs differ: "Mehr erfahren": size 16/14 | "Zum Interview": size 16/14 | "Jetzt teilnehmen": size 16/14

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 93% / 90%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 11/27 text blocks placed differently: "Der BMW X5.": w 512/260 | "Meilensteine einer Erfolgsgesc": w 512/385 | "Bis heute zählt der BMW X5 zu ": x 189/374, w 10
  - 768: [layout] 11/27 text blocks placed differently: "Der BMW X5.": x 64/276, w 640/212 | "Meilensteine einer Erfolgsgesc": x 64/212, w 640/340 | "Startseite Großkunden": x 48
  - 390: [height] preview 7161px vs live 7973px (90%)

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 89% / 92%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 26/50 text blocks placed differently: "Kurs auf Grün.": w 512/279 | "SAP elektrifiziert die Flotte ": x 100/309, w 1241/822 | "Bereits im Oktober 2021 hat SA": 
  - 768: [height] preview 11134px vs live 12535px (89%)
  - 768: [layout] 19/50 text blocks placed differently: "Kurs auf Grün.": x 64/270, w 640/224 | "Wie SAP die gesamte Flotte ele": x 64/197, w 640/370 | "SAP elektrifiziert die Fl
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x377/672x506, #8 672x379/672x504
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x192/342x257, #8 342x193/342x257

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 86% / 89%
- blocks: hero-teaser, content-navigation, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbi
  - 1440: [layout] 11/27 text blocks placed differently: "Startseite Großkunden": x 96/0 | "Online-Magazin": x 280/184 | "Das erste Modell der Neuen Kla": x 96/356, w 1248/728 | "
  - 768: [height] preview 8025px vs live 9315px (86%)
  - 768: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbi
  - 768: [layout] 11/27 text blocks placed differently: "Startseite Großkunden": x 48/0 | "Online-Magazin": x 217/169 | "Das erste Modell der Neuen Kla": x 48/168, w 672/432 | "E
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x378/672x896, #3 672x377/672x896
  - 390: [height] preview 9279px vs live 10454px (89%)
  - 390: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbindung zum Fahrzeug.": align start/center | "Freude am Fahren, neu in
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x193/342x456, #3 342x192/342x456

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 95% / 92%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 38/79 text blocks placed differently: "Startseite Großkunden": x 96/0 | "Online-Magazin": x 280/184 | "Wie KI, Echtzeitdaten und digi": x 96/340, w 1248/760 | "
  - 768: [layout] 41/79 text blocks placed differently: "Fuhrparks intelligent steuern.": x 64/221, w 640/323 | "Startseite Großkunden": x 48/0 | "Online-Magazin": x 217/169 | "W

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 93% / 78%
- blocks: hero-teaser, embed, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/11 text blocks placed differently: "Was uns bewegt.": w 616/334 | "Der BMW Business Class Podcast": w 616/362 | "WAS UNS BEWEGT. DER BMW BUSINE": x 96/224
  - 768: [layout] 3/11 text blocks placed differently: "Was uns bewegt.": x 64/247, w 640/271 | "Der BMW Business Class Podcast": x 64/226, w 640/313 | "Apple Podcasts": x 366/41
  - 390: [height] preview 3292px vs live 4195px (78%)
  - 390: [layout] 3/11 text blocks placed differently: "Der BMW Business Class Podcast": x 32/84, w 325/222 | "Spotify": x 32/172 | "Apple Podcasts": x 32/145

### /de/mehr-bmw/kundenbetreuung
- status: differences remain; widths: 1440, 768, 390; height ratio: 149% / 150% / 118%
- blocks: hero-teaser, ai-entry, flexbox, accordion, columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 7579px vs live 5100px (149%)
  - 1440: [layout] 21/40 text blocks placed differently: "Wie können wir helfen?": x 208/537, w 1032/363 | "Ihr Zugang zu den BMW Online-S": x 96/285, w 1248/870 | "Häufig gestell
  - 1440: [image-geometry] 5 images sized differently (preview/live): #2 506x1044/254x524, #3 718x718/270x180, #4 720x480/270x180, #5 720x480/270x180, #6 720x480/270x180
  - 768: [height] preview 8834px vs live 5872px (150%)
  - 768: [layout] 19/40 text blocks placed differently: "Wie können wir helfen?": x 64/231, w 640/303 | "Ihr Zugang zu den BMW Online-S": x 48/175, w 672/419 | "Häufig gestellte 
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 556x1147/308x635, #3 556x556/648x433
  - 390: [height] preview 7415px vs live 6281px (118%)
  - 390: [typography] 4 runs differ: "Wie können wir helfen?": size 33/28 | "Sie haben weitere Fragen?": align start/center | "Smart verbunden mit Ihrem BMW.": align start/center | "
  - 390: [layout] 11/40 text blocks placed differently: "Kostenlos herunterladen": x 24/106 | "Nützliche Links.": x 24/96 | "Sofort verfügbare Neuwagen": x 24/390 | "Entdecken Si
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x705/223x459, #3 342x342/326x218

### /de/mehr-bmw/sport-und-events/bmw-basketball
- status: differences remain; widths: 1440, 768, 390; height ratio: 154% / 199% / 139%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 7396px vs live 4807px (154%)
  - 1440: [layout] 7/19 text blocks placed differently: "WE POWER JOY. TOGETHER.": x 96/483, w 1248/475, ypos 20%/31% | "Zwei Marken, eine Heimatstadt,": x 96/308, w 1248/824 | "S
  - 1440: [image-geometry] 12 images sized differently (preview/live): #6 360x240/270x180, #7 360x240/270x180, #8 360x240/270x180, #9 360x240/270x180, #10 360x240/270x180
  - 768: [height] preview 9636px vs live 4854px (199%)
  - 768: [layout] 8/19 text blocks placed differently: "BMW BASKETBALL.": x 64/214, w 640/336 | "WE POWER JOY. TOGETHER.": x 48/188, w 672/392, ypos 15%/32% | "Zwei Marken, eine 
  - 390: [height] preview 6400px vs live 4617px (139%)
  - 390: [layout] 4/19 text blocks placed differently: "WE POWER JOY. TOGETHER.": x 24/89, w 342/212, ypos 20%/30% | "100% Urban.": x 24/111, ypos 28%/41% | "BMW electric x Urban

### /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park
- status: differences remain; widths: 1440, 768, 390; height ratio: 162% / 176% / 127%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 5831px vs live 3607px (162%)
  - 1440: [layout] 7/17 text blocks placed differently: "Mehr BMW Park.": x 96/587, w 1248/266, ypos 12%/20% | "Legendäre Sporthalle für legen": x 96/308, w 1248/824 | "Herzstück 
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 360x240/270x180, #3 360x240/270x180, #4 360x240/270x180, #5 360x240/270x180, #6 360x240/270x180
  - 768: [height] preview 9468px vs live 5382px (176%)
  - 768: [layout] 8/17 text blocks placed differently: "WE PLAY. TOGETHER.": x 64/199, w 640/366 | "Mehr BMW Park.": x 48/275, w 672/219, ypos 7%/13% | "Legendäre Sporthalle für 
  - 390: [height] preview 6366px vs live 5020px (127%)
  - 390: [layout] 3/17 text blocks placed differently: "WE PLAY. TOGETHER.": x 32/99 | "Mehr BMW Park.": x 24/89, w 342/213 | "Die Presenter Box: Alles für e": ypos 60%/33%

### /de/mehr-bmw/sport-und-events/bmw-basketball/innovation
- status: differences remain; widths: 1440, 768, 390; height ratio: 84% / 88% / 80%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 4018px vs live 4766px (84%)
  - 1440: [layout] 8/14 text blocks placed differently: "Mehr Freude am Spiel.": x 96/540, w 1248/360 | "Für uns geht Innovation immer ": x 96/308, w 1248/824 | "Ein Basketballlig
  - 768: [height] preview 4042px vs live 4587px (88%)
  - 768: [layout] 8/14 text blocks placed differently: "WE POWER JOY. TOGETHER.": x 64/145, w 640/475 | "Mehr Freude am Spiel.": x 48/236, w 672/297 | "Für uns geht Innovation im
  - 390: [height] preview 3573px vs live 4489px (80%)
  - 390: [layout] 4/14 text blocks placed differently: "WE POWER JOY. TOGETHER.": w 325/248 | "Road to Paris.": x 24/107 | "Die Highlights aus den letzten": ypos 45%/39% | "From 

### /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture
- status: differences remain; widths: 1440, 768, 390; height ratio: 147% / 129% / 110%
- blocks: hero-teaser, link-list, carousel, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 9309px vs live 6314px (147%)
  - 1440: [layout] 12/20 text blocks placed differently: "Urban Sports. Urban Creativity": x 96/380, w 1248/681 | "Basketball ist eine Quelle der": x 96/308, w 1248/824 | "Events.
  - 768: [height] preview 6970px vs live 5406px (129%)
  - 768: [layout] 13/20 text blocks placed differently: "WE CREATE. TOGETHER.": x 64/173, w 640/418 | "Urban Sports. Urban Creativity": x 48/182, w 672/405 | "Basketball ist eine
  - 390: [height] preview 5482px vs live 4973px (110%)
  - 390: [layout] 9/20 text blocks placed differently: "WE CREATE. TOGETHER.": x 32/97 | "Events.": x 24/148 | "Beats. Balls. Big Joy. Streetb": x 24/390 | "Secret Streetball Spl

### /de/mehr-bmw/sport-und-events/bmw-basketball/we-care
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 83% / 81%
- blocks: hero-teaser, link-list, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 3481px vs live 3879px (90%)
  - 1440: [layout] 6/11 text blocks placed differently: "Hand in Hand: Spektakel & Sozi": x 96/323, w 1248/795 | "„Dunks for Tomorrow“ steht für": x 96/308, w 1248/824 | "In der e
  - 768: [height] preview 3535px vs live 4281px (83%)
  - 768: [layout] 7/11 text blocks placed differently: "DUNKS FOR TOMORROW.": x 64/166, w 640/432 | "Hand in Hand: Spektakel & Sozi": x 48/207, w 672/354 | "„Dunks for Tomorrow“ 
  - 390: [height] preview 3629px vs live 4500px (81%)

### /de/mehr-bmw/sport-und-events/laufsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 92% / 83%
- blocks: hero-teaser, media, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 4/5 text blocks placed differently: "BMW LAUFSPORT.": w 512/384 | "BMW Berlin-Marathon.": x 96/538, w 1248/365 | "Starterinnen und Starter aus ü": x 96/308, w 1
  - 768: [layout] 5/5 text blocks placed differently: "BMW LAUFSPORT.": x 64/226, w 640/312 | "BMW Berlin-Marathon.": x 48/232, w 672/304 | "Starterinnen und Starter aus ü": x 48
  - 390: [height] preview 3442px vs live 4145px (83%)

### /de/mehr-bmw/sport-und-events/sport-und-kultur
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 76%
- blocks: hero-teaser, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 390: [height] preview 2126px vs live 2809px (76%)

### /de/mehr-bmw/sport-und-events/tennis
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 94% / 82%
- blocks: hero-teaser, media, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 3/4 text blocks placed differently: "BMW TENNISSPORT.": w 720/431 | "BMW Open (ATP 500)": x 96/542, w 1248/356 | "Seit 38 Jahren engagiert sich ": x 96/308, w 1
  - 768: [layout] 4/4 text blocks placed differently: "BMW TENNISSPORT.": x 64/208, w 640/348 | "BMW Open (ATP 500)": x 48/238, w 672/293 | "Seit 38 Jahren engagiert sich ": x 48
  - 390: [height] preview 2954px vs live 3623px (82%)

### /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy
- status: differences remain; widths: 1440, 768, 390; height ratio: 133% / 114% / 85%
- blocks: hero-stage, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 7147px vs live 5376px (133%)
  - 1440: [layout] 13/14 text blocks placed differently: "BMW Heart of Joy.": w 1344/358 | "Fahrfreude auf dem übernächste": x 96/400, w 1248/641 | "Das BMW Heart of Joy ist eine 
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1440x630/1248x702, #4 1248x702/718x479, #5 1248x832/718x479, #6 1248x832/718x479, #7 1248x832/718x479
  - 768: [height] preview 5973px vs live 5260px (114%)
  - 768: [layout] 12/14 text blocks placed differently: "Fahrfreude auf dem übernächste": x 48/251, w 672/266 | "Das BMW Heart of Joy ist eine ": x 48/164, w 672/440 | "Die Erfah
  - 768: [image-geometry] 8 images sized differently (preview/live): #2 768x1024/672x378, #4 672x378/382x255, #5 672x448/382x255, #6 672x448/382x255, #7 672x448/382x255
  - 390: [height] preview 5015px vs live 5876px (85%)

### /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung
- status: differences remain; widths: 1440, 768, 390; height ratio: 1523% / 1200% / 991%
- blocks: hero-teaser, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: 
  - 1440: [height] preview 109683px vs live 7203px (1523%)
  - 1440: [missing-text] 28/39 live text runs not visible on preview: "höchste Qualitätsansprüche.", "BMW 3er Modelle", "3er Limousine", "3er Touring"
  - 1440: [typography] 3 runs differ: "2er Coupé": size 28/23 | "2er Gran Coupé": size 28/23 | "2er Active Tourer": size 28/23
  - 1440: [layout] 6/11 text blocks placed differently: "Reifen beeinflussen Fahrverhal": x 96/308, w 1248/824 | "Die Entwicklung erfolgt in eng": x 96/308, w 1248/824 | "Nur Reif
  - 768: [height] preview 87749px vs live 7311px (1200%)
  - 768: [missing-text] 28/39 live text runs not visible on preview: "höchste Qualitätsansprüche.", "BMW 3er Modelle", "3er Limousine", "3er Touring"
  - 768: [typography] 3 runs differ: "2er Coupé": size 25/20 | "2er Gran Coupé": size 25/20 | "2er Active Tourer": size 25/20
  - 768: [layout] 8/11 text blocks placed differently: "BMW Räder & Reifen – mit der S": x 64/168, w 640/454 | "Informationen zu den Eigenscha": x 64/182, w 640/400 | "Reifen bee
  - 390: [height] preview 75854px vs live 7653px (991%)
  - 390: [missing-text] 28/39 live text runs not visible on preview: "höchste Qualitätsansprüche.", "BMW 3er Modelle", "3er Limousine", "3er Touring"
  - 390: [typography] 3 runs differ: "2er Coupé": size 23/19 | "2er Gran Coupé": size 23/19 | "2er Active Tourer": size 23/19

### /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub
- status: differences remain; widths: 1440, 768, 390; height ratio: 183% / 140% / 121%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 37346px vs live 20391px (183%)
  - 1440: [layout] 92/142 text blocks placed differently: "Original BMW Zubehör.": w 616/456 | "Für jede Fahrt vorbereitet.": x 96/516, w 1248/408 | "Egal zu welcher Jahreszeit, e
  - 1440: [image-geometry] 35 images sized differently (preview/live): #2 1440x630/376x250, #5 360x240/1440x630, #6 1440x630/270x180, #7 1248x832/270x180, #8 1248x832/270x180
  - 768: [height] preview 33173px vs live 23764px (140%)
  - 768: [typography] 8 runs differ: "Abenteuer beginnen im Herbst mit Ori": align center/start | "Explore the world. Mit Original BMW ": align center/start | "BMW Händler finden": s
  - 768: [layout] 85/145 text blocks placed differently: "Original BMW Zubehör.": x 64/198, w 640/368 | "Ausstattungen und Zubehörteile": x 64/172, w 640/424 | "Händler finden": 
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/648x431, #5 672x448/768x768, #6 768x768/648x433, #23 672x448/768x766, #24 768x768/324x216
  - 390: [height] preview 29823px vs live 24571px (121%)
  - 390: [typography] 8 runs differ: "Abenteuer beginnen im Herbst mit Ori": align center/start | "Explore the world. Mit Original BMW ": align center/start | "BMW Händler finden": s
  - 390: [layout] 47/145 text blocks placed differently: "Original BMW Zubehör.": x 32/93, w 325/204 | "Zum Shop": x 32/163 | "Händler finden": x 32/147 | "BMW Räder & Reifen": x
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/326x217, #5 342x228/390x585, #6 390x585/326x218, #23 342x228/390x585, #24 390x585/342x228

### /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile
- status: differences remain; widths: 1440, 768, 390; height ratio: 191% / 156% / 128%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 18719px vs live 9820px (191%)
  - 1440: [typography] 13 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 | "Original BMW Classic Teile": align start/center | "IHRE VORTEILE": size 35/12, case none/u
  - 1440: [layout] 55/77 text blocks placed differently: "ORIGINAL BMW TEILE.": w 616/464 | "Wiederaufbereitete Teile": x 311/215 | "Wiederaufbereitung": x 509/413 | "Original BMW
  - 1440: [image-geometry] 18 images sized differently (preview/live): #2 188x188/376x251, #3 188x188/376x251, #4 188x188/376x250, #5 188x188/376x251, #6 188x188/376x251
  - 768: [height] preview 18048px vs live 11592px (156%)
  - 768: [typography] 7 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 20/25 | "IHRE VORTEILE": size 29/12, case none/uppercase | "Bei Verschleiß, Beschädigung oder De": a
  - 768: [layout] 60/77 text blocks placed differently: "ORIGINAL BMW TEILE.": x 64/194, w 640/376 | "DAMIT IHR BMW EIN ORIGINAL BMW": x 64/113 | "Wiederaufbereitete Teile": x 24
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 440x440/300x200, #3 440x440/300x200, #4 440x440/300x199, #5 440x440/300x200, #6 440x440/300x200
  - 390: [height] preview 17219px vs live 13483px (128%)
  - 390: [typography] 25 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 19/23 | "IHRE VORTEILE": size 28/12, case none/uppercase | "Geprüfte BMW Qualität.": align start/ce
  - 390: [layout] 36/73 text blocks placed differently: "ORIGINAL BMW TEILE.": w 325/248 | "BMW Service Partner finden": x 32/104 | "Geprüfte BMW Qualität.": x 24/91, w 342/208 |
  - 390: [image-geometry] 5 images sized differently (preview/live): #2 342x342/326x218, #3 342x342/326x217, #4 342x342/326x217, #5 342x342/326x218, #6 342x342/326x218

### /de/more-bmw/sport-und-events/bmw-basketball/bmw-park
- status: differences remain; widths: 1440, 768, 390; height ratio: 162% / 176% / 127%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 5831px vs live 3607px (162%)
  - 1440: [layout] 7/17 text blocks placed differently: "Mehr BMW Park.": x 96/587, w 1248/266, ypos 12%/20% | "Legendäre Sporthalle für legen": x 96/308, w 1248/824 | "Herzstück 
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 360x240/270x180, #3 360x240/270x180, #4 360x240/270x180, #5 360x240/270x180, #6 360x240/270x180
  - 768: [height] preview 9468px vs live 5382px (176%)
  - 768: [layout] 8/17 text blocks placed differently: "WE PLAY. TOGETHER.": x 64/199, w 640/366 | "Mehr BMW Park.": x 48/275, w 672/219, ypos 7%/13% | "Legendäre Sporthalle für 
  - 390: [height] preview 6366px vs live 5020px (127%)
  - 390: [layout] 3/17 text blocks placed differently: "WE PLAY. TOGETHER.": x 32/99 | "Mehr BMW Park.": x 24/89, w 342/213 | "Die Presenter Box: Alles für e": ypos 60%/33%

### /de/my-bmw-app/my-bmw-app
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 122% / 85%
- blocks: hero-teaser, icon-teaser, media, tabs, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R2: crops/ratios per breakpoint; R2: tab layout at 768/390; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 7057px vs live 5948px (119%)
  - 1440: [typography] 5 runs differ: "Zur BMW ConnectedDrive Übersicht": size 18/15 | "Zum BMW Store": size 18/15 | "BMW Kundenbetreuung kontaktieren": size 18/15 | "Zum App Store": 
  - 1440: [layout] 28/52 text blocks placed differently: "My BMW APP.": w 512/277 | "ALLES AN EINEM ORT – MIT DER M": w 1248/442, ypos 25%/15% | "Fahrzeugstatus / Ladestatus ch": 
  - 1440: [image-geometry] 3 images sized differently (preview/live): #2 1248x833/718x479, #3 1248x693/718x410, #4 1248x831/718x478
  - 768: [height] preview 7987px vs live 6548px (122%)
  - 768: [typography] 5 runs differ: "Zur BMW ConnectedDrive Übersicht": size 17/14 | "Zum BMW Store": size 17/14 | "BMW Kundenbetreuung kontaktieren": size 17/14 | "Zum App Store": 
  - 768: [layout] 26/52 text blocks placed differently: "My BMW APP.": x 64/269, w 640/226 | "Die direkte Verbindung zu Ihre": x 64/207, w 640/351 | "Fahrzeugstatus / Ladestatus 
  - 768: [image-geometry] 5 images sized differently (preview/live): #4 672x448/324x216, #5 672x448/324x216, #6 672x448/324x216, #7 672x448/324x216, #8 672x448/324x216
  - 390: [height] preview 6627px vs live 7766px (85%)
  - 390: [typography] 5 runs differ: "Zur BMW ConnectedDrive Übersicht": size 16/14 | "Zum BMW Store": size 16/14 | "BMW Kundenbetreuung kontaktieren": size 16/14 | "Zum App Store": 
  - 390: [layout] 7/52 text blocks placed differently: "My BMW APP.": x 32/89, w 325/213 | "My BMW App herunterladen": x 32/105 | "Vorklimatisieren und Vorheizen": x 97/52 | "Fah

### /de/neufahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 113% / 110%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: 
  - 1440: [typography] 14 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
  - 1440: [layout] 4/30 text blocks placed differently: "Alle BMW Modelle entdecken.": w 1248/474 | "Kategorien": w 101/245 | "Serien": w 59/245 | "Antriebsvarianten": w 164/245
  - 768: [height] preview 19752px vs live 17498px (113%)
  - 768: [typography] 13 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
  - 390: [typography] 13 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
  - 390: [layout] 6/24 text blocks placed differently: "Alle BMW Modelle entdecken.": w 342/230 | "Diesel": x 1260/1302 | "Modelle": w 126/310 | "M Modell": w 126/310 | "Modell":
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 101% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 768: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 390: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er
- status: differences remain; widths: 1440, 768, 390; height ratio: 130% / 116% / 104%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 23075px vs live 17742px (130%)
  - 1440: [typography] 19 runs differ: "Ab 339 €": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(3
  - 1440: [layout] 62/100 text blocks placed differently: "im Monat leasen.": x 104/273, w 512/224 | "Exklusiv für Gewerbekunden.": x 104/273 | "Technische Daten": x 12/88 | "Ange
  - 1440: [image-geometry] 21 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x631, #4 1440x630/588x353, #8 1248x833/1008x441, #13 1008x441/1248x702
  - 768: [height] preview 22049px vs live 18964px (116%)
  - 768: [typography] 17 runs differ: "Ab 339 €": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Design": color rgb(102
  - 768: [layout] 64/101 text blocks placed differently: "Der BMW 1er.": x 64/323 | "Ab 339 €": x 347/209 | "im Monat leasen.": x 64/347, w 640/213 | "Exklusiv für Gewerbekunden.
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/300x180, #8 672x449/1820x1024, #13 1820x1024/672x378
  - 390: [typography] 17 runs differ: "Ab 339 €": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW 120": size 17/14, weight 300/700 | "T
  - 390: [layout] 24/95 text blocks placed differently: "Der BMW 1er.": x 32/137 | "im Monat leasen.": x 32/89, w 325/213 | "Exklusiv für Gewerbekunden.": x 32/89 | "Konfiguriere
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/318x191, #8 342x228/1097x844, #13 1097x844/390x219

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 89%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 10/69 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 10/69 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 390: [height] preview 6949px vs live 7767px (89%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 10/69 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer
- status: differences remain; widths: 1440, 768, 390; height ratio: 138% / 119% / 103%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 19927px vs live 14440px (138%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 220i Active Tourer": size 20/15, weight 300/700 | "Preisliste BMW 2er Active 
  - 1440: [layout] 37/82 text blocks placed differently: "Fahrfreude.": x 96/629 | "Der BMW 220i Active Tourer ver": x 96/308, w 1248/824 | "Varianten und technische Daten": x 96/
  - 1440: [image-geometry] 15 images sized differently (preview/live): #4 1248x833/718x479, #10 1248x830/718x478, #11 1248x832/612x407, #12 1248x832/612x407, #18 1248x832/718x479
  - 768: [height] preview 20207px vs live 17014px (119%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 8 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 220i Active Tourer": size 18/14, weight 300/700 | "Der BMW 220i Active Tourer
  - 768: [layout] 42/84 text blocks placed differently: "Der BMW 2er Active Tourer.": x 106/207, w 556/354 | "Technische Daten": x -398/-29 | "Preisliste": x -261/108 | "Probefah
  - 768: [image-geometry] 17 images sized differently (preview/live): #4 672x449/382x255, #10 672x447/382x254, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 7 runs differ: "BMW 220i Active Tourer": size 17/14, weight 300/700 | "Der BMW 220i Active Tourer steht für": align center/start | "Sein modernes Design trifft 
  - 390: [layout] 19/78 text blocks placed differently: "Der BMW 2er Active Tourer.": x 24/68, w 342/255 | "Fahrfreude.": x 24/122 | "BMW 220i Active Tourer": x 104/26 | "Vereinb
  - 390: [image-geometry] 8 images sized differently (preview/live): #21 342x228/390x585, #22 390x585/342x228, #24 342x228/390x438, #26 390x390/390x260, #27 390x390/390x260

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 16/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "Gesamtfahrzeugantrieb", "115 (156)", "Hinterradantrieb"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 16/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "Gesamtfahrzeugantrieb", "115 (156)", "Hinterradantrieb"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 16/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "Gesamtfahrzeugantrieb", "115 (156)", "Hinterradantrieb"

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 135% / 111% / 102%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17836px vs live 13221px (135%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [layout] 34/76 text blocks placed differently: "Das BMW 2er Coupé.": w 538/338 | "Spürbar sportlich. Fahrfreude ": x 96/409, w 1248/623 | "Das BMW 2er Coupé bringt sport
  - 1440: [image-geometry] 8 images sized differently (preview/live): #9 1248x832/718x479, #11 1248x832/612x409, #12 1248x832/612x408, #19 1248x832/612x406, #20 1248x832/612x407
  - 768: [height] preview 17019px vs live 15340px (111%)
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 44/77 text blocks placed differently: "Das BMW 2er Coupé.": x 106/245, w 556/278 | "Technische Daten": x -464/12 | "Design": x -327/149 | "Preisliste": x -259/2
  - 768: [image-geometry] 6 images sized differently (preview/live): #9 672x448/382x255, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/1820x102
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 22/71 text blocks placed differently: "BMW M240i xDrive Coupé": x 94/26 | "Sportlich bis zum Heck.": w 342/242 | "Selbstbewusst gerahmt.": x 24/382 | "Die Singl

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 12/79 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 768: [missing-text] 12/79 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 390: [missing-text] 12/79 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 135% / 111% / 100%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 27102px vs live 20033px (135%)
  - 1440: [typography] 7 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Varianten und technische Daten.": align start/center | "BMW 220 Gran Coupé": size 20/15, we
  - 1440: [layout] 50/95 text blocks placed differently: "Das BMW 2er Gran Coupé.": w 512/279 | "Auffallend sportlich. Inspirie": x 96/383, w 1248/674 | "Die langgezogene Silhouet
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x477, #5 1248x829/1008x441, #10 1008x441/1248x702
  - 768: [height] preview 22708px vs live 20445px (111%)
  - 768: [typography] 11 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Varianten und technische Daten.": align start/center | "BMW 220 Gran Coupé": size 18/14, w
  - 768: [layout] 57/97 text blocks placed differently: "Das BMW 2er Gran Coupé.": x 64/261, w 640/243 | "Technische Daten": x -398/-111 | "Preisliste": x -261/26 | "Probefahrt v
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x254, #5 672x446/1820x1024, #10 1820x1024/672x378
  - 390: [typography] 11 runs differ: "Varianten und technische Daten.": align start/center | "BMW 220 Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77,
  - 390: [layout] 28/91 text blocks placed differently: "Das BMW 2er Gran Coupé.": x 32/78, w 325/235 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW 
  - 390: [image-geometry] 10 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x227, #5 342x227/1097x844, #10 1097x844/390x219
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / – / 88%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 15/91 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [height] preview 0px vs live 8205px (0%)
  - 768: [footer-height] 0 vs 1454
  - 768: [footer-links] 0 vs 63
  - 768: [missing-text] 91/91 live text runs not visible on preview: "Die BMW 3er Limousine Plug-in-Hybrid.", "Jetzt entdecken", "Konfigurieren & Preise", "Technische Daten der BMW 3er
  - 768: [images] preview 0 vs live 4 visible images/videos
  - 390: [height] preview 8601px vs live 9761px (88%)
  - 390: [missing-text] 15/91 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 196% / 142% / 125%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 24561px vs live 12523px (196%)
  - 1440: [layout] 51/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 | "Konfigurieren & Preise": x 832/118 | "Angebot anfordern": x 1060
  - 1440: [image-geometry] 17 images sized differently (preview/live): #3 1248x833/718x479, #4 1248x832/376x251, #5 1248x832/376x250, #6 1248x832/376x249, #12 1219x813/376x249
  - 768: [height] preview 21128px vs live 14868px (142%)
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Preisliste BMW 3er Limousine Plug-in": align start/center | "Immer in der richtig
  - 768: [layout] 51/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 64/202, w 640/360 | "Technische Daten": x 12/-111 | "Preisliste": x 149/26 | "Probefah
  - 768: [image-geometry] 7 images sized differently (preview/live): #3 672x449/382x255, #15 1024x1024/1820x1024, #16 1024x1024/1820x1024, #17 1024x1024/1820x1024, #18 1024x1024/1820x102
  - 390: [height] preview 17713px vs live 14176px (125%)
  - 390: [layout] 34/80 text blocks placed differently: "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 24/122 | "Vereinbaren Sie eine Probe

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 187% / 138% / 123%
- blocks: hero-teaser, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 21144px vs live 11321px (187%)
  - 1440: [typography] 4 runs differ: "BMW 330i xDrive Limousine": size 20/15, weight 300/700 | "Preisliste BMW 3er Limousine": align start/center | "Immer in der richtigen Spur und a
  - 1440: [layout] 46/72 text blocks placed differently: "Die BMW 3er Limousine.": x 832/104, w 512/258 | "Konfigurieren & Preise": x 832/118 | "Angebot anfordern": x 1060/340 | "
  - 1440: [image-geometry] 14 images sized differently (preview/live): #3 1248x833/718x479, #9 1248x832/376x250, #10 1248x832/376x251, #11 1248x832/376x249, #17 1248x832/376x251
  - 768: [height] preview 18527px vs live 13395px (138%)
  - 768: [typography] 4 runs differ: "BMW 330i xDrive Limousine": size 18/14, weight 300/700 | "Immer in der richtigen Spur und auf ": size 20/18 | "Rückwärtsfahren, leicht gemacht."
  - 768: [layout] 41/72 text blocks placed differently: "Die BMW 3er Limousine.": x 64/270, w 640/225 | "Fahrfreude.": x 48/308 | "Die BMW 3er Limousine vereint ": x 48/164, w 67
  - 768: [image-geometry] 6 images sized differently (preview/live): #3 672x449/382x255, #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x102
  - 390: [height] preview 15200px vs live 12395px (123%)
  - 390: [typography] 4 runs differ: "BMW 330i xDrive Limousine": size 17/14, weight 300/700 | "Immer in der richtigen Spur und auf ": size 19/17 | "Rückwärtsfahren, leicht gemacht."
  - 390: [layout] 31/72 text blocks placed differently: "Die BMW 3er Limousine.": x 32/87, w 325/216 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrf

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 192% / 138% / 123%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 25410px vs live 13231px (192%)
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330e xDrive Touring": size 20/15, weight 300/700, color rgb(255, 255, 255)/rg
  - 1440: [layout] 52/89 text blocks placed differently: "Konfigurieren & Preise": x 832/118 | "Angebot anfordern": x 1060/340 | "Fahrfreude.": x 96/629 | "Der BMW 330e xDrive Tou
  - 1440: [image-geometry] 17 images sized differently (preview/live): #3 1248x831/718x479, #4 1248x832/376x251, #5 1248x832/376x250, #6 1248x832/376x251, #13 1248x832/376x251
  - 768: [height] preview 21621px vs live 15613px (138%)
  - 768: [typography] 6 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330e xDrive Touring": size 18/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 
  - 768: [layout] 60/89 text blocks placed differently: "Technische Daten": x -398/-111 | "Preisliste": x -261/26 | "Probefahrt vereinbaren": x -179/108 | "Design": x -8/279 | "T
  - 768: [image-geometry] 7 images sized differently (preview/live): #3 672x448/382x255, #7 1024x1024/1820x1024, #8 1024x1024/1820x1024, #9 1024x1024/1820x1024, #10 1024x1024/1820x1024
  - 390: [height] preview 18482px vs live 15039px (123%)
  - 390: [typography] 5 runs differ: "BMW 330e xDrive Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Preisliste BMW 3er Touring Plug-in-H": align s
  - 390: [layout] 35/83 text blocks placed differently: "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 24/122 | "BMW 330e xDrive Touring": 

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [missing-text] 7/75 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 176% / 136% / 120%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22637px vs live 12896px (176%)
  - 1440: [typography] 16 runs differ: "Technologien": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330i xDrive Touring": size 20/15, weight 300/700, color rgb(255, 255, 255)/rgb(3
  - 1440: [layout] 56/94 text blocks placed differently: "Der BMW 3er Touring.": x 832/104, w 512/228 | "Konfigurieren & Preise": x 832/118 | "Angebot anfordern": x 1060/340 | "Fa
  - 1440: [image-geometry] 14 images sized differently (preview/live): #5 1248x831/718x479, #12 1248x832/376x250, #13 1248x832/376x251, #14 1248x832/376x250, #20 1248x832/376x251
  - 768: [height] preview 19938px vs live 14620px (136%)
  - 768: [typography] 11 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330i xDrive Touring": size 18/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38,
  - 768: [layout] 60/94 text blocks placed differently: "Der BMW 3er Touring.": x 64/283 | "Technische Daten": x -417/-198 | "Angebote": x -280/-61 | "Preisliste": x -193/26 | "P
  - 768: [image-geometry] 7 images sized differently (preview/live): #5 672x448/382x255, #6 1024x1024/1820x1024, #7 1024x1024/1820x1024, #8 1024x1024/1820x1024, #9 1024x1024/1820x1024
  - 390: [height] preview 16726px vs live 13977px (120%)
  - 390: [typography] 11 runs differ: "BMW 330i xDrive Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Technische Daten": color rgb(77, 77, 77)/rgb(
  - 390: [layout] 32/87 text blocks placed differently: "Der BMW 3er Touring.": x 32/100 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 2

### /de/neufahrzeuge/3er/limousine/bmw-i3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 91% / 97% / 88%
- blocks: hero-stage, disclaimer, text-media-teaser, color-switch, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: tablet width from source grid
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [image-geometry] 6 images sized differently (preview/live): #2 1440x630/416x554, #5 416x555/1008x441, #6 1008x441/416x555, #7 1008x441/416x555, #8 1008x441/1440x630
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 35/50 text blocks placed differently: "DER NEUE BMW i3": x 106/193, w 556/383 | "DIE NEUE BMW i3 LIMOUSINE": x 106/155 | "Jetzt bestellbar: Der BMW i3 5": x 132
  - 768: [image-geometry] 8 images sized differently (preview/live): #4 616x821/1820x1024, #5 616x821/1820x1024, #13 1820x1024/616x821, #14 1820x1024/616x821, #15 616x821/1820x1024
  - 390: [height] preview 10572px vs live 11990px (88%)
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 11/50 text blocks placed differently: "Angebot anfordern": x 24/135 | "BMW i3 50 xDrive Limousine": x 83/24 | "bis zu 900 km": x 24/138 | "lässt Herzen höher sc
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/342x257, #3 342x257/390x520, #5 342x456/1097x844, #14 1097x844/390x520, #16 342x456/844x844

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 100% / 81%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/65 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 1440: [layout] 10/49 text blocks placed differently: "Benzin": x 120/455 | "135 (184)": x 536/850 | "8-Gang, automatisch": x 120/355 | "Hinterradantrieb": x 536/799 | "135 (18
  - 768: [missing-text] 7/65 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [layout] 32/49 text blocks placed differently: "Technische Daten des BMW 4er C": x 64/202, w 640/361 | "Max. Leistung in kW (PS)": x 408/289 | "135 (184)": x 408/289 | "
  - 390: [height] preview 6607px vs live 8125px (81%)
  - 390: [missing-text] 7/65 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [layout] 11/49 text blocks placed differently: "Konfigurieren & Preise": x 32/122 | "Jetzt entdecken": x 32/144 | "Benzin": x 306/49 | "135 (184)": x 294/49 | "8-Gang, a

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio
- status: differences remain; widths: 1440, 768, 390; height ratio: 150% / 119% / 106%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 16891px vs live 11241px (150%)
  - 1440: [layout] 36/65 text blocks placed differently: "Das BMW 4er Cabrio.": w 512/224 | "Offen für sportliche Erlebniss": x 96/478, w 1248/484 | "Das BMW 4er Cabrio zeigt, wie
  - 1440: [image-geometry] 9 images sized differently (preview/live): #3 1248x831/718x479, #9 1248x832/376x250, #10 1248x832/376x251, #11 1248x832/376x250, #17 1248x832/588x391
  - 768: [height] preview 16078px vs live 13462px (119%)
  - 768: [typography] 4 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 430i xDrive Cabrio": size 18/14, weight 300/700 | "Immer in der richtigen Spu
  - 768: [layout] 44/66 text blocks placed differently: "Das BMW 4er Cabrio.": x 64/284 | "Technische Daten": x -310/12 | "Konfigurieren": x -173/149 | "Preisliste": x -64/258 | 
  - 768: [image-geometry] 7 images sized differently (preview/live): #3 672x448/382x255, #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x102
  - 390: [layout] 22/61 text blocks placed differently: "Das BMW 4er Cabrio.": x 32/101 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Offen für sportlic
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/4er/coupe/bmw-4er-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 155% / 123% / 111%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 15505px vs live 9994px (155%)
  - 1440: [layout] 33/64 text blocks placed differently: "Das BMW 4er Coupé.": w 512/224 | "Ihr unwiderstehlich sportliche": x 96/353, w 1248/734 | "Das BMW 4er Coupé erregt Aufme
  - 1440: [image-geometry] 9 images sized differently (preview/live): #3 1248x831/718x479, #9 1248x832/588x392, #10 1248x832/588x392, #16 1248x832/588x391, #17 1248x832/588x391
  - 768: [height] preview 14378px vs live 11668px (123%)
  - 768: [typography] 4 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440i xDrive Coupé": size 18/14, weight 300/700 | "Immer in der richtigen Spu
  - 768: [layout] 41/64 text blocks placed differently: "Das BMW 4er Coupé.": x 64/285 | "Technische Daten": x -201/12 | "Preisliste": x -64/149 | "Probefahrt vereinbaren": x 18/
  - 768: [image-geometry] 7 images sized differently (preview/live): #3 672x448/382x255, #11 1024x1024/1820x1024, #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x102
  - 390: [height] preview 12377px vs live 11185px (111%)
  - 390: [layout] 16/60 text blocks placed differently: "Das BMW 4er Coupé.": x 32/101 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW M440i xDrive Co

### /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 170% / 133% / 116%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 21433px vs live 12638px (170%)
  - 1440: [layout] 43/80 text blocks placed differently: "Das BMW 4er Gran Coupé.": w 512/280 | "Fahrfreude.": x 96/629 | "Das BMW 4er Gran Coupé vereint": x 96/308, w 1248/824 | 
  - 1440: [image-geometry] 19 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x479, #5 1248x833/1008x441, #10 1008x441/270x180
  - 768: [height] preview 18865px vs live 14197px (133%)
  - 768: [typography] 8 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 430i xDrive Gran Coupé": size 18/14, weight 300/700 | "Stilvoller Auftritt. B
  - 768: [layout] 46/80 text blocks placed differently: "Das BMW 4er Gran Coupé.": x 64/260, w 640/244 | "Technische Daten": x -201/12 | "Preisliste": x -64/149 | "Probefahrt ver
  - 768: [image-geometry] 18 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x255, #5 672x449/1820x1024, #10 1820x1024/648x432
  - 390: [height] preview 16799px vs live 14421px (116%)
  - 390: [typography] 7 runs differ: "BMW 430i xDrive Gran Coupé": size 17/14, weight 300/700 | "Stilvoller Auftritt. Bleibender Eind": align center/start | "Die geschwungene Dachlin
  - 390: [layout] 22/76 text blocks placed differently: "Das BMW 4er Gran Coupé.": x 32/77, w 325/236 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahr
  - 390: [image-geometry] 10 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x228, #5 342x228/1097x844, #10 1097x844/326x217

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/82 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 7/82 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [height] preview 7714px vs live 8580px (90%)
  - 390: [missing-text] 7/82 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 151% / 120% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 20972px vs live 13932px (151%)
  - 1440: [typography] 7 runs differ: "THE NEW": size 18/15, case none/uppercase | "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Touring": size 20/15, weight 300/700,
  - 1440: [layout] 32/83 text blocks placed differently: "Der BMW 5er Touring Plug-in-Hy": w 512/385 | "Varianten und technische Daten": x 96/462, w 1248/516 | "BMW 530e Touring":
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x404, #6 1248x702/1440x630, #11 1440x630/1248x702, #13 1248x702/612x408
  - 768: [height] preview 18846px vs live 15721px (120%)
  - 768: [typography] 9 runs differ: "THE NEW": size 17/14, case none/uppercase | "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Touring": size 18/14, weight 300/
  - 768: [layout] 52/83 text blocks placed differently: "THE NEW": x 64/320 | "Der BMW 5er Touring Plug-in-Hy": x 64/213, w 640/338 | "Technische Daten": x -268/12 | "Preisliste"
  - 768: [image-geometry] 22 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x215, #5 672x378/1820x1024, #6 672x378/1820x1024, #7 1024x1024/1820x1024
  - 390: [typography] 9 runs differ: "THE NEW": size 16/14, case none/uppercase | "BMW 530e Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Technisc
  - 390: [layout] 21/78 text blocks placed differently: "THE NEW": x 32/133 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW 530e Touring": x 121/26 | 
  - 390: [image-geometry] 7 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x192, #6 390x219/844x844, #11 844x844/390x219, #21 342x228/1097x844

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 147% / 119% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 19194px vs live 13085px (147%)
  - 1440: [layout] 39/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 | "Technische Daten": x 12/144 | "Preisliste": x 162/294 | "Probefahrt vereinbaren": x 2
  - 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x404, #4 1248x701/1008x441, #9 1008x441/1248x702, #11 1248x702/612x408
  - 768: [height] preview 17556px vs live 14750px (119%)
  - 768: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Autobahnassistent.": size 20/18 | "Immer in der richtigen Spur und auf ": size 20/18 | "Ihr
  - 768: [layout] 44/73 text blocks placed differently: "Der BMW 5er Touring.": x 64/283 | "Technische Daten": x -315/-81 | "Preisliste": x -178/56 | "Probefahrt vereinbaren": x 
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x215, #4 672x378/1820x1024, #9 1820x1024/672x378, #19 672x448/1820x1024
  - 390: [typography] 4 runs differ: "Autobahnassistent.": size 19/17 | "Immer in der richtigen Spur und auf ": size 19/17 | "Ihr BMW parkt für Sie ein.": size 19/17 | "Service – gen
  - 390: [layout] 17/68 text blocks placed differently: "Der BMW 5er Touring.": x 32/100 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Vereinbaren Sie e
  - 390: [image-geometry] 17 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x192, #4 342x192/1097x844, #9 1097x844/390x219, #18 342x228/844x844

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 101% / 81%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 17/93 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 1440: [layout] 14/67 text blocks placed differently: "Technische Daten des neuen BMW": w 1248/690 | "Benzin – Plug-in-Hybrid": x 120/338 | "220 (299) 10": x 536/830 | "450 10"
  - 768: [missing-text] 17/93 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [layout] 45/67 text blocks placed differently: "THE NEW": x 64/320 | "Der neue BMW 5er Plug-in-Hybri": x 64/138, w 640/488 | "Konfigurieren & Preise": x 370/423 | "Max. 
  - 390: [height] preview 8660px vs live 10680px (81%)
  - 390: [missing-text] 17/93 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 390: [layout] 15/67 text blocks placed differently: "THE NEW": x 32/133 | "Jetzt entdecken": x 32/144 | "Konfigurieren & Preise": x 32/122 | "Technische Daten des neuen BMW":

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 168% / 135% / 116%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 19638px vs live 11656px (168%)
  - 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Limousine": size 20/15, weight 300/700 | "Preisliste BMW 5er Plug-in-Hybrid": 
  - 1440: [layout] 36/74 text blocks placed differently: "Der BMW 5er Plug-in-Hybrid.": w 512/303 | "Varianten und technische Daten": x 96/462, w 1248/516 | "BMW 530e Limousine": 
  - 1440: [image-geometry] 25 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 1248x832/1008x441, #9 1008x441/400x267, #10 1248x832/400x267
  - 768: [height] preview 17923px vs live 13273px (135%)
  - 768: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Limousine": size 18/14, weight 300/700 | "Preisliste BMW 5er Plug-in-Hyb
  - 768: [layout] 50/74 text blocks placed differently: "Der BMW 5er Plug-in-Hybrid.": x 64/250, w 640/265 | "Technische Daten": x -398/12 | "Preisliste": x -261/149 | "Probefahr
  - 768: [image-geometry] 30 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x255, #4 672x448/1820x1024, #9 1820x1024/324x216, #10 672x448/324x216
  - 390: [height] preview 14939px vs live 12829px (116%)
  - 390: [typography] 6 runs differ: "BMW 530e Limousine": size 17/14, weight 300/700 | "Preisliste BMW 5er Plug-in-Hybrid": align start/center | "Immer in der richtigen Spur und auf
  - 390: [layout] 28/68 text blocks placed differently: "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW 530e Limousine": x 109/26 | "Vereinbaren Sie ein
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #4 342x228/1097x844, #9 1097x844/342x228, #15 342x228/844x844

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 12/83 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 768: [missing-text] 12/83 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 390: [missing-text] 12/83 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 151% / 126% / 109%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17887px vs live 11825px (151%)
  - 1440: [typography] 5 runs differ: "Fahrdynamik": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 520i Limousine": size 20/15, weight 300/700 | "Preisliste BMW 5er Limousine": alig
  - 1440: [layout] 41/72 text blocks placed differently: "Die BMW 5er Limousine.": w 512/258 | "Technische Daten": x 12/107 | "Preisliste": x 162/257 | "Probefahrt vereinbaren": x
  - 1440: [image-geometry] 27 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #5 1248x702/1008x441, #6 1248x702/1008x441, #10 1008x441/400x267
  - 768: [height] preview 16597px vs live 13121px (126%)
  - 768: [typography] 6 runs differ: "Fahrdynamik": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 520i Limousine": size 18/14, weight 300/700 | "Immer in der richtigen Spur und auf
  - 768: [layout] 49/72 text blocks placed differently: "Die BMW 5er Limousine.": x 64/270, w 640/225 | "Technische Daten": x -406/-111 | "Preisliste": x -269/26 | "Probefahrt ve
  - 768: [image-geometry] 25 images sized differently (preview/live): #4 672x448/382x255, #6 672x378/1820x1024, #11 1820x1024/324x216, #12 672x448/324x216, #13 672x448/324x216
  - 390: [typography] 5 runs differ: "BMW 520i Limousine": size 17/14, weight 300/700 | "Immer in der richtigen Spur und auf ": size 19/17 | "Ihr BMW parkt für Sie ein.": size 19/17 
  - 390: [layout] 27/66 text blocks placed differently: "Die BMW 5er Limousine.": x 32/87, w 325/216 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW 5

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 11/69 live text runs not visible on preview: "BMW 7er", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 11/69 live text runs not visible on preview: "BMW 7er", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 11/69 live text runs not visible on preview: "BMW 7er", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 93% / 87%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 16335px vs live 18311px (89%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 19/163 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "BMW i7", "BMW M760e xDrive"
  - 1440: [layout] 17/126 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 | "Weitere Antriebe und Varianten": x 96/300, w 1248/840 | "Mehr anzeigen": w 95/624 | "Au
  - 1440: [image-geometry] 23 images sized differently (preview/live): #3 1440x630/1008x441, #4 1440x630/1008x441, #8 1008x441/416x519, #9 1008x441/1440x630, #10 416x520/1440x630
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"
  - 768: [layout] 48/126 text blocks placed differently: "DER NEUE BMW 7er": x 106/193, w 556/383 | "DIE NEUE BMW 7er LIMOUSINE": x 106/164 | "Weitere Antriebe und Varianten": x 
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x1024/768x768, #3 768x768/1820x1024, #4 768x768/1820x1024, #8 1820x1024/616x462, #9 1820x1024/768x768
  - 390: [height] preview 19540px vs live 22482px (87%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"
  - 390: [layout] 16/126 text blocks placed differently: "BMW Individual": x 120/50 | "Mehr anzeigen": w 95/342 | "Weitere Farbkombinationen entd": x 24/69 | "Mehr entdecken": x 
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/390x779, #3 390x693/1097x844, #4 390x693/1097x844, #8 1097x844/342x257, #9 1097x844/390x657

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 7/66 live text runs not visible on preview: "BMW i7", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 7/66 live text runs not visible on preview: "BMW i7", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 7/66 live text runs not visible on preview: "BMW i7", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 93% / 85%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 15215px vs live 17051px (89%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [layout] 20/124 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 | "DIE NEUE BMW i7 LIMOUSINE": w 538/412 | "Weitere Antriebe und Varianten": x 96/300, w 1
  - 1440: [image-geometry] 25 images sized differently (preview/live): #3 1440x630/1008x441, #4 1440x630/1008x441, #8 1008x441/416x519, #9 1008x441/1440x630, #10 416x520/1440x630
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 58/124 text blocks placed differently: "DER NEUE BMW 7er": x 106/193, w 556/383 | "DIE NEUE BMW i7 LIMOUSINE": x 106/178, w 556/412 | "Weitere Antriebe und Vari
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x1024/768x768, #3 768x768/1820x1024, #4 768x768/1820x1024, #8 1820x1024/616x462, #9 1820x1024/768x768
  - 390: [height] preview 19048px vs live 22520px (85%)
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 21/124 text blocks placed differently: "BMW Individual": x 124/24 | "727 km": x 195/105 | "Mehr anzeigen": w 95/342 | "Farbkombinationen": x 149/24 | "Vancouver
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/390x779, #3 390x693/1097x844, #4 390x693/1097x844, #8 1097x844/342x257, #9 1097x844/390x657

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 768: [missing-text] 6/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 390: [missing-text] 6/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 390: [layout] 6/59 text blocks placed differently: "BMW i4 GRAN COUPÉ: TECHNISCHE ": x 32/94, w 325/203 | "Konfigurieren & Preise": x 32/122 | "Jetzt entdecken": x 32/144 | "

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 159% / 130% / 115%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, disclaimer, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 26496px vs live 16616px (159%)
  - 1440: [layout] 56/109 text blocks placed differently: "Das BMW i4 Gran Coupé.": w 512/265 | "Fahrfreude.": x 96/629 | "Im BMW i4 Gran Coupé sind Sie ": x 96/308, w 1248/824 | 
  - 1440: [image-geometry] 27 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x478, #5 718x478/1440x630, #6 1440x630/718x479, #10 1008x441/588x392
  - 768: [height] preview 23443px vs live 17979px (130%)
  - 768: [typography] 7 runs differ: "Business Lösungen": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i4 eDrive40 Gran Coupé": size 18/14, weight 300/700 | "Elektrisch. Einzigart
  - 768: [layout] 71/109 text blocks placed differently: "Das BMW i4 Gran Coupé.": x 64/266, w 640/232 | "Technische Daten": x -308/12 | "Business Lösungen": x -171/149 | "Preisl
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x254, #5 382x255/768x768, #6 768x768/382x255, #10 1820x1024/648x365
  - 390: [height] preview 20944px vs live 18226px (115%)
  - 390: [typography] 7 runs differ: "BMW i4 eDrive40 Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Elektrisch. Einzigarti
  - 390: [layout] 31/103 text blocks placed differently: "Das BMW i4 Gran Coupé.": x 32/84, w 325/223 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahr
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #5 342x228/390x586, #6 390x585/342x228, #10 1097x844/326x217

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 99% / 90%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [height] preview 6812px vs live 7578px (90%)
  - 390: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 100% / 91%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 153% / 124% / 111%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 24916px vs live 16290px (153%)
  - 1440: [typography] 19 runs differ: "Ab 649": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(38,
  - 1440: [layout] 49/97 text blocks placed differently: "im Monat leasen.": x 104/276, w 512/224 | "Exklusiv für Gewerbekunden.": x 104/276 | "Vollelektrisch für grosse Vorh": x 
  - 1440: [image-geometry] 33 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #5 612x367/1440x631, #6 1440x630/718x403, #9 1248x702/376x250
  - 768: [height] preview 22366px vs live 18062px (124%)
  - 768: [typography] 15 runs differ: "Ab 649": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Angebote": color rgb(102
  - 768: [layout] 60/95 text blocks placed differently: "Ab 649": x 346/208 | "im Monat leasen.": x 64/347, w 640/213 | "Exklusiv für Gewerbekunden.": x 64/347 | "Technische Date
  - 768: [image-geometry] 18 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #5 324x194/768x768, #6 768x768/382x215, #13 672x448/382x254
  - 390: [height] preview 19322px vs live 17477px (111%)
  - 390: [typography] 15 runs differ: "Ab 649": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW i5 eDrive40 Touring": size 17/14, weigh
  - 390: [layout] 23/89 text blocks placed differently: "im Monat leasen.": x 32/89, w 325/213 | "Exklusiv für Gewerbekunden.": x 32/89 | "Konfigurieren & Preise": x 32/122 | "An
  - 390: [image-geometry] 17 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #5 342x205/390x588, #6 390x585/342x192, #14 342x228/844x844

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 184% / 141% / 120%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 23456px vs live 12733px (184%)
  - 1440: [typography] 20 runs differ: "Ab 599 €": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(3
  - 1440: [layout] 53/96 text blocks placed differently: "Der BMW i5. 100% elektrisch.": w 512/309 | "im Monat leasen.": x 104/275, w 512/224 | "Exklusiv für Gewerbekunden.": x 10
  - 1440: [image-geometry] 25 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #10 1248x702/294x196, #11 1210x807/294x196, #12 1210x807/294x196
  - 768: [height] preview 19315px vs live 13697px (141%)
  - 768: [typography] 18 runs differ: "Ab 599 €": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Technische Daten": col
  - 768: [layout] 74/98 text blocks placed differently: "Der BMW i5. 100% elektrisch.": x 64/248, w 640/269 | "Ab 599 €": x 347/208 | "im Monat leasen.": x 64/347, w 640/213 | "E
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #10 672x378/324x216, #11 672x448/324x216, #12 672x448/324x216
  - 390: [height] preview 16252px vs live 13505px (120%)
  - 390: [typography] 17 runs differ: "Ab 599 €": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW i5 eDrive40 Limousine": size 17/14, w
  - 390: [layout] 31/90 text blocks placed differently: "im Monat leasen.": x 32/89, w 325/213 | "Exklusiv für Gewerbekunden.": x 32/89 | "Konfigurieren & Preise": x 32/122 | "An

### /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 89%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [height] preview 6836px vs live 7638px (89%)
  - 390: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/bmw-i/ix/bmw-ix
- status: differences remain; widths: 1440, 768, 390; height ratio: 120% / 112% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, car-kpis, drivetrain-switch, preview-slider, model-offer, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 25150px vs live 20893px (120%)
  - 1440: [typography] 17 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 18/23 | "Reichweite & Laden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX xDrive60": size 20
  - 1440: [layout] 68/117 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": w 512/349 | "Technische Daten": x 12/-192 | "Angebote": x 162/-42 | "Preisliste": x 256
  - 1440: [image-geometry] 29 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #7 1248x702/376x250, #8 1248x702/376x251, #9 1248x832/376x250
  - 768: [height] preview 23457px vs live 20878px (112%)
  - 768: [typography] 16 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 17/20 | "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX xDrive60": size 18/1
  - 768: [layout] 68/120 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": x 64/231, w 640/303 | "Technische Daten": x -417/12 | "Angebote": x -280/149 | "Preisli
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #11 672x448/1820x1024, #16 1820x1024/768x768, #17 768x768/382x255
  - 390: [typography] 15 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 16/19 | "BMW iX xDrive60": size 17/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 16/1
  - 390: [layout] 23/112 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": x 32/102 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW iX
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #10 342x228/1097x844, #11 342x228/1097x844, #15 1097x844/390x586
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 8/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 8/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [height] preview 6942px vs live 7736px (90%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 8/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1
- status: differences remain; widths: 1440, 768, 390; height ratio: 163% / 126% / 116%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, carousel, hero-teaser, columns, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 25882px vs live 15896px (163%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 10 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX1 xDrive30": size 20/15, weight 300/700 | "Gewerbekunden": color rgb(38, 3
  - 1440: [layout] 51/113 text blocks placed differently: "Fahrfreude.": x 96/629 | "Ob tägliche Fahrt zur Arbeit o": x 96/308, w 1248/824 | "Varianten und technische Daten": x 96
  - 1440: [image-geometry] 16 images sized differently (preview/live): #3 1184x526/376x167, #4 1184x526/376x167, #5 1184x526/376x167, #6 1184x526/376x167, #7 1248x829/718x477
  - 768: [height] preview 23736px vs live 18799px (126%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 10 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX1 xDrive30": size 18/14, weight 300/700 | "Gewerbekunden": color rgb(38, 3
  - 768: [layout] 62/114 text blocks placed differently: "Der BMW iX1. 100 % elektrisch.": x 106/181, w 556/406 | "Technische Daten": x -566/12 | "Angebote": x -429/149 | "Busine
  - 768: [image-geometry] 21 images sized differently (preview/live): #5 624x277/382x254, #6 624x277/768x768, #7 672x446/382x255, #8 768x768/1820x1024, #9 672x449/1820x1024
  - 390: [height] preview 21363px vs live 18418px (116%)
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 10 runs differ: "im Monat leasen.": align left/center | "BMW iX1 xDrive30": size 17/14, weight 300/700 | "Gewerbekunden": color rgb(38, 38, 38)/rgb(255, 255, 25
  - 390: [layout] 32/104 text blocks placed differently: "Der BMW iX1. 100 % elektrisch.": x 24/65, w 342/260 | "Ab 429 €": x 37/133 | "im Monat leasen.": x 169/89 | "Exklusiv fü
  - 390: [image-geometry] 13 images sized differently (preview/live): #5 294x131/342x227, #6 294x131/390x586, #8 390x585/1097x844, #9 342x228/1097x844, #13 1097x844/342x228

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [missing-text] 7/72 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 152% / 121% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 25553px vs live 16844px (152%)
  - 1440: [typography] 17 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 35/43, align start/center | "BMW iX2 xDrive30": size 20/15, weight 30
  - 1440: [layout] 59/112 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": w 512/330 | "Fahrfreude.": x 96/607, w 1248/226 | "Der BMW iX2 verbindet vollelek": x 9
  - 1440: [image-geometry] 26 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #6 1248x832/1440x630, #7 1440x630/718x477, #8 1248x829/1008x441
  - 768: [height] preview 23938px vs live 19862px (121%)
  - 768: [typography] 15 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW iX2 xDrive30": size 18/14, weight 300/700 | "✔ Leasingsond
  - 768: [layout] 71/112 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": x 64/239, w 640/287 | "Technische Daten": x -417/-198 | "Angebote": x -280/-61 | "Preis
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #6 672x448/768x768, #7 768x768/382x254, #8 672x446/1820x1024
  - 390: [typography] 15 runs differ: "Fahrfreude.": size 28/33 | "BMW iX2 xDrive30": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "✔ L
  - 390: [layout] 28/105 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": x 32/121 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfr
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #6 342x228/390x586, #7 390x585/342x227, #8 342x227/1097x844

### /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 109% / 94%
- blocks: hero-stage, text-media-teaser, video, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [layout] 8/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 376/279 | "Mehr als Ästhetik.": w 440/225 | "Mehr anzeigen": w 95/624 | "Technologie als
  - 1440: [image-geometry] 9 images sized differently (preview/live): #2 1440x630/520x648, #3 520x650/1248x546, #5 1248x546/520x390, #6 520x390/294x196, #10 294x196/1248x546
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 21/64 text blocks placed differently: "BMW M CONCEPT NEUE KLASSE": x 106/175, w 556/418 | "Die neue BMW M Designsprache.": w 672/440 | "Mehr als Ästhetik.": x 1
  - 768: [image-geometry] 6 images sized differently (preview/live): #3 616x770/672x294, #5 672x294/616x411, #10 672x448/672x294, #12 672x294/672x448, #16 672x448/616x770
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 8/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 342/221 | "Mehr anzeigen": w 95/342 | "Track Lights": x 382/456 | "Trimaran-Element": x 
  - 390: [image-geometry] 5 images sized differently (preview/live): #5 390x520/342x228, #10 342x228/390x520, #12 390x520/342x228, #16 342x228/390x488, #18 342x428/342x228

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 7/64 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 7/64 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [height] preview 6447px vs live 7201px (90%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 7/64 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 207% / 154% / 130%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, columns, hero-teaser, carousel, video, tabs, multi-content-gallery, text-media-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 44549px vs live 21532px (207%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 69/226 live text runs not visible on preview: "Skip to main content", "Kaufen", "E-Mobilität", "Kunden"
  - 1440: [typography] 24 runs differ: "Modelle": size 12/15, weight 300/500, color rgb(38, 38, 38)/rgb(255, 255, 255) | "BMW M2 mit M xDrive": color rgb(102, 102, 102)/rgb(38, 38, 38
  - 1440: [layout] 101/149 text blocks placed differently: "Modelle": x 96/184 | "Technische Daten": x 12/96 | "Konfigurieren": x 162/246 | "Preisliste": x 282/366 | "BMW M2 mit M
  - 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/475x388, #4 1523x1243/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x113
  - 768: [height] preview 37607px vs live 24367px (154%)
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 66/224 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K
  - 768: [typography] 30 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Maximale M High-Performance mit Allr": size 17/14 | "High-Performance M TwinPowe
  - 768: [layout] 94/151 text blocks placed differently: "Die BMW 2er Coupé M Modelle.": x 106/226, w 556/413 | "Technische Daten": x -431/-102 | "Konfigurieren": x -294/35 | "Pr
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x1024/840x686, #3 840x686/416x339, #4 1270x1037/416x339, #5 1270x1037/768x121, #6 1270x1037/1820x1024
  - 390: [height] preview 30815px vs live 23683px (130%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 66/218 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K
  - 390: [typography] 30 runs differ: "BMW M2 mit M xDrive": size 19/14, weight 300/700 | "Maximale M High-Performance mit Allr": size 16/14 | "High-Performance M TwinPower Turbo R":
  - 390: [layout] 58/145 text blocks placed differently: "Die BMW 2er Coupé M Modelle.": x 24/82, w 342/244 | "BMW M2 Coupé": x 24/195 | "Ab 78.300 €": x 24/195 | "Maximale M Hig

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 262% / 176% / 156%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, carousel, tabs, multi-content-gallery, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 50492px vs live 19260px (262%)
  - 1440: [typography] 35 runs differ: "BMW M3 Competition Limousine": color rgb(102, 102, 102)/rgb(38, 38, 38), align start/center | "BMW M340d xDrive Limousine: Energiev": align sta
  - 1440: [layout] 117/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 104/183, w 512/372 | "Technische Daten": x 12/-387 | "Konfigurieren": x 162/-237 | "
  - 1440: [image-geometry] 37 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x109
  - 768: [height] preview 40085px vs live 22760px (176%)
  - 768: [typography] 38 runs differ: "BMW M3 Competition Limousine": color rgb(102, 102, 102)/rgb(38, 38, 38), align start/center | "BMW M340d xDrive Limousine: Energiev": align sta
  - 768: [layout] 106/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 64/254, w 640/325 | "Technische Daten": x -670/-220 | "Konfigurieren": x -533/-83 | 
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 1270x1037/768x117, #6 1270x1037/1820x1024
  - 390: [height] preview 33570px vs live 21467px (156%)
  - 390: [typography] 40 runs differ: "Probefahrt vereinbaren": color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW M340d xDrive Limousine: Energiev": align start/center | "BMW M3 Compet
  - 390: [layout] 80/147 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 32/123, w 325/211 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/13
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 214% / 153% / 131%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 39448px vs live 18430px (214%)
  - 1440: [typography] 24 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M340d xDrive Touring: Energiever": align start/center | "BMW M3 Competition Tourin
  - 1440: [layout] 82/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 104/183, w 512/340 | "Die BMW 3er Touring M Modelle ": x 96/308, w 1248/824 | "Varian
  - 1440: [image-geometry] 34 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x105
  - 768: [height] preview 31805px vs live 20831px (153%)
  - 768: [typography] 29 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M340d xDrive Touring: Energiever": align start/center | "BMW M3 Competition Tou
  - 768: [layout] 91/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 64/268, w 640/297 | "Technische Daten": x -439/12 | "Konfigurieren": x -302/149 | "Pr
  - 768: [image-geometry] 11 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 1270x1037/768x115, #6 1270x1037/1820x1024
  - 390: [height] preview 26625px vs live 20298px (131%)
  - 390: [typography] 29 runs differ: "BMW M340d xDrive Touring: Energiever": align start/center | "BMW M3 Competition Touring mit M xDr": size 19/14, weight 300/700 | "Technische Da
  - 390: [layout] 56/122 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 32/125, w 325/206 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/13
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio
- status: differences remain; widths: 1440, 768, 390; height ratio: 222% / 149% / 132%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 39490px vs live 17751px (222%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 26 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M4 Competition Cabrio": align start/center | "BMW M4 Competition Cabrio mit M x
  - 1440: [layout] 84/124 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 104/183, w 512/331 | "Die BMW 4er Cabrio M Baureihen": x 96/308, w 1248/824 | "Variant
  - 1440: [image-geometry] 32 images sized differently (preview/live): #2 282x100/930x759, #3 930x759/475x388, #4 1523x1243/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x105
  - 768: [height] preview 32053px vs live 21441px (149%)
  - 768: [typography] 29 runs differ: "M440 Cabrio": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M4 Competition Cabrio mit M xDri": size 20/14, weight 300/700 | "AUF EINEN BLICK"
  - 768: [layout] 89/127 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 64/272, w 640/290 | "Technische Daten": x -439/-391 | "Konfigurieren": x -302/-254 | "
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 282x100/840x686, #3 840x686/416x339, #4 1270x1037/416x339, #5 1270x1037/768x105, #6 1270x1037/1820x1024
  - 390: [height] preview 26978px vs live 20394px (132%)
  - 390: [typography] 34 runs differ: "Konfigurieren": color rgb(38, 38, 38)/rgb(102, 102, 102) | "TECHNISCHE DATEN": size 14/12, case none/uppercase | "BMW M4 Competition Cabrio mit
  - 390: [layout] 56/120 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 32/129 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW M44
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 101% / 81%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 18/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "Gesamtfahrzeugantrieb", "390 (530)", "TwinPower Turbo Verbrennungsmotor"
  - 1440: [layout] 9/41 text blocks placed differently: "Technische Daten der BMW 4er C": w 1248/634 | "Benzin": x 120/455 | "8-Gang, automatisch": x 120/355 | "Allradantrieb": x 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 18/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "Gesamtfahrzeugantrieb", "390 (530)", "TwinPower Turbo Verbrennungsmotor"
  - 768: [layout] 25/41 text blocks placed differently: "Die BMW 4er Coupé M Modelle: T": x 64/186, w 640/461 | "Max. Leistung in kW (PS)": x 408/289 | "Max. Drehmoment in Nm": x
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [height] preview 6593px vs live 8185px (81%)
  - 390: [missing-text] 18/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "Gesamtfahrzeugantrieb", "390 (530)", "TwinPower Turbo Verbrennungsmotor"
  - 390: [layout] 9/41 text blocks placed differently: "Die BMW 4er Coupé M Modelle: T": x 32/76 | "Konfigurieren & Preise": x 32/122 | "Jetzt entdecken": x 32/144 | "Benzin": x 
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 239% / 167% / 143%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 51754px vs live 21623px (239%)
  - 1440: [typography] 35 runs differ: "BMW M4 Competition Coupé": align start/center | "M440 Coupé": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440d xDrive Coupé: Energieverbr"
  - 1440: [layout] 112/150 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 104/183, w 512/331 | "Technische Daten": x 12/-303 | "Konfigurieren": x 162/-153 | "Pr
  - 1440: [image-geometry] 35 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #5 1523x1243/475x388, #6 1523x1243/1440x108
  - 768: [height] preview 41020px vs live 24609px (167%)
  - 768: [typography] 39 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440d xDrive Coupé: Energieverbr": align start/center | "BMW M4 Competition Cou
  - 768: [layout] 106/151 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 64/273, w 640/288 | "Technische Daten": x -646/12 | "Konfigurieren": x -509/149 | "Pre
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 1270x1037/768x116, #6 1270x1037/1820x1024
  - 390: [height] preview 33751px vs live 23581px (143%)
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 40 runs differ: "BMW M4 Competition Coupé": size 19/14, color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW M440d xDrive Coupé: Energieverbr": align start/center | 
  - 390: [layout] 79/145 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 32/129 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Technisc
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 7/71 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 168% / 135% / 115%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, carousel, preview-slider, columns, video, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 34055px vs live 20218px (168%)
  - 1440: [typography] 9 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i4 M60 xDrive Gran Coupé": size 20/15, weight 300/700 | "Privatkunden": color rgb(3
  - 1440: [layout] 77/123 text blocks placed differently: "Technische Daten": x 12/-66 | "Leasingbeispiel": x 162/84 | "Preisliste": x 299/221 | "Probefahrt vereinbaren": x 389/31
  - 1440: [image-geometry] 24 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/588x470, #4 930x759/588x470, #5 1000x800/1440x628, #6 1000x800/718x479
  - 768: [height] preview 28413px vs live 21077px (135%)
  - 768: [typography] 12 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i4 M60 xDrive Gran Coupé": size 18/14, weight 300/700 | "Privatkunden": color rgb(
  - 768: [layout] 77/123 text blocks placed differently: "Der BMW i4 M60 xDrive. 100 % e": x 64/225, w 640/384 | "Technische Daten": x -453/-29 | "Leasingbeispiel": x -316/108 | 
  - 768: [image-geometry] 23 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/536x429, #4 840x686/536x429, #5 624x499/768x768, #6 624x499/382x255
  - 390: [height] preview 24454px vs live 21257px (115%)
  - 390: [typography] 12 runs differ: "BMW i4 M60 xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Privatkunden": colo
  - 390: [layout] 47/116 text blocks placed differently: "Der BMW i4 M60 xDrive. 100 % e": x 32/89, w 325/215 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135
  - 390: [image-geometry] 15 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/326x261, #4 513x419/326x261, #5 294x235/390x586, #7 390x585/390x219
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 156% / 130% / 114%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22520px vs live 14444px (156%)
  - 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i5 M60 xDrive Limousine": size 20/15, weight 300/700 | "Preisliste BMW i5 M60 xDriv
  - 1440: [layout] 39/82 text blocks placed differently: "BMW i5 M60 xDrive. 100 % elekt": x 104/183 | "Varianten und technische Daten": x 96/462, w 1248/516 | "BMW i5 M60 xDrive 
  - 1440: [image-geometry] 31 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/718x477, #4 930x759/1272x716, #5 1248x829/400x267, #6 1248x702/400x267
  - 768: [height] preview 19567px vs live 15044px (130%)
  - 768: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i5 M60 xDrive Limousine": size 18/14, weight 300/700 | "Immer in der richtigen Spur und
  - 768: [layout] 52/81 text blocks placed differently: "BMW i5 M60 xDrive. 100 % elekt": x 64/243, w 640/347 | "Technische Daten": x -435/-282 | "Preisliste": x -298/-145 | "Pro
  - 768: [image-geometry] 30 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x254, #4 840x686/696x392, #6 672x378/324x216, #7 672x378/324x216
  - 390: [height] preview 15978px vs live 14057px (114%)
  - 390: [typography] 5 runs differ: "BMW i5 M60 xDrive Limousine": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Immer in der richtige
  - 390: [layout] 31/75 text blocks placed differently: "BMW i5 M60 xDrive. 100 % elekt": x 32/121 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW i5 
  - 390: [image-geometry] 11 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/342x227, #4 513x419/390x228, #12 342x228/1097x844, #13 342x228/1097x844

### /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 8/67 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 8/67 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 8/67 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-m-135/bmw-m135
- status: differences remain; widths: 1440, 768, 390; height ratio: 125% / 118% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22504px vs live 17970px (125%)
  - 1440: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M135 xDrive": size 20/15, weight 300/700 | "Preisliste BMW M135i xDrive": ali
  - 1440: [layout] 46/96 text blocks placed differently: "Der BMW M135 xDrive.": x 104/183, w 512/238 | "Fahrfreude.": x 96/629 | "Sportliche Motorisierung triff": x 96/308, w 124
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x629, #4 930x759/718x479, #5 1440x630/1248x702, #7 1248x702/718x479
  - 768: [height] preview 21279px vs live 18052px (118%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M135 xDrive": size 18/14, weight 300/700 | "Kompakt. Kompromisslos. Konsequen
  - 768: [layout] 52/94 text blocks placed differently: "Der BMW M135 xDrive.": x 64/313, w 640/207 | "Technische Daten": x -439/-220 | "Konfigurieren": x -302/-83 | "Preisliste"
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x378, #7 672x378/382x255
  - 390: [typography] 8 runs differ: "BMW M135 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Kompakt. Kompromisslos. Konsequen
  - 390: [layout] 23/89 text blocks placed differently: "Der BMW M135 xDrive.": x 32/129 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 2
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x219, #15 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 8/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachg
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 8/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachg
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 8/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachg
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 132% / 113% / 106%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 23405px vs live 17706px (132%)
  - 1440: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i5 M60 xDrive Touring": size 20/15, weight 300/700 | "Preisliste BMW i5 M60 xDrive Tour
  - 1440: [layout] 44/87 text blocks placed differently: "Technische Daten": x 12/-98 | "Preisliste": x 162/52 | "Probefahrt vereinbaren": x 252/142 | "Performance": x 440/330 | "
  - 1440: [image-geometry] 33 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x628, #4 930x759/718x404, #5 1440x630/1248x702, #7 1248x702/612x408
  - 768: [height] preview 21685px vs live 19112px (113%)
  - 768: [typography] 8 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i5 M60 xDrive Touring": size 18/14, weight 300/700 | "Grosszügig in Leistung 
  - 768: [layout] 49/86 text blocks placed differently: "Technische Daten": x -435/12 | "Preisliste": x -298/149 | "Probefahrt vereinbaren": x -216/231 | "Performance": x -45/402
  - 768: [image-geometry] 21 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x215, #5 768x768/672x378, #13 672x448/1820x1024
  - 390: [typography] 8 runs differ: "BMW i5 M60 xDrive Touring": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Grosszügig in Leistung 
  - 390: [layout] 19/79 text blocks placed differently: "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 24/122 | "BMW i5 M60 xDrive Touring"
  - 390: [image-geometry] 16 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x192, #5 390x585/390x219, #14 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 7/70 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Le
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70
- status: differences remain; widths: 1440, 768, 390; height ratio: 146% / 123% / 108%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 25871px vs live 17769px (146%)
  - 1440: [layout] 44/95 text blocks placed differently: "Fahrfreude.": x 96/629 | "Vollelektrisch. Leistungsstark": x 96/308, w 1248/824 | "Varianten und technische Daten": x 96/
  - 1440: [image-geometry] 32 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x630, #4 930x759/718x478, #5 1440x630/1248x702, #6 1248x831/718x479
  - 768: [height] preview 22946px vs live 18600px (123%)
  - 768: [typography] 6 runs differ: "Beratung & Services": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX M70 xDrive": size 18/14, weight 300/700 | "Das Exterieur und das großzü
  - 768: [layout] 49/96 text blocks placed differently: "Der BMW iX M70 xDrive. 100% el": x 64/228, w 640/377 | "Technische Daten": x -435/-493 | "Preisliste": x -298/-356 | "Pro
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x254, #5 768x768/672x378, #7 672x378/382x255
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 5 runs differ: "BMW iX M70 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Das Exterieur und das großzügig
  - 390: [layout] 27/88 text blocks placed differently: "Der BMW iX M70 xDrive. 100% el": x 32/124 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfre
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x219, #15 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 7/67 live text runs not visible on preview: "BMW 7er M", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu
  - 1440: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 43/48, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 7/67 live text runs not visible on preview: "BMW 7er M", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu
  - 768: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 35/48, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 7/67 live text runs not visible on preview: "BMW 7er M", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu
  - 390: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 33/35, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 97% / 87%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, text-media-teaser, media-showcase, color-switch, model-overview, media, powertrain-selector, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 30 runs differ: "DER NEUE BMW 7er": size 70/74, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb
  - 1440: [layout] 34/148 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 | "DIE BMW 7er M MODELLE": w 538/350 | "500 kW (680 PS)": x 128/616 | "Integral-Aktivlenku
  - 1440: [image-geometry] 15 images sized differently (preview/live): #3 1440x630/1008x441, #8 1008x441/416x519, #9 416x520/475x388, #10 1523x1243/475x388, #11 1523x1243/1440x85
  - 768: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 768: [typography] 30 runs differ: "DER NEUE BMW 7er": color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb(62, 82, 122
  - 768: [layout] 70/148 text blocks placed differently: "DER NEUE BMW 7er": x 106/193, w 556/383 | "DIE BMW 7er M MODELLE": x 106/209, w 556/350 | "500 kW (680 PS)": x 80/527 | 
  - 768: [image-geometry] 21 images sized differently (preview/live): #3 768x768/1820x1024, #8 1820x1024/616x462, #9 616x462/416x339, #10 1270x1037/416x339, #11 1270x1037/768x82
  - 390: [height] preview 20811px vs live 23885px (87%)
  - 390: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 390: [typography] 30 runs differ: "DER NEUE BMW 7er": color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb(62, 82, 122
  - 390: [layout] 29/148 text blocks placed differently: "DIE BMW 7er M MODELLE": x 24/67, w 342/256 | "Performance in ihrer elegantes": w 342/257 | "500 kW (680 PS)": x 24/111 |
  - 390: [image-geometry] 20 images sized differently (preview/live): #3 390x693/1097x844, #8 1097x844/342x257, #9 342x257/257x210, #10 852x695/257x210, #11 852x695/390x58

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 102% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 7/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 7/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 139% / 116% / 101%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22032px vs live 15891px (139%)
  - 1440: [typography] 6 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M235 xDrive Gran Coupé": size 20/15, weight 300/700 | "Extrovertiert. Performant
  - 1440: [layout] 35/85 text blocks placed differently: "Das BMW M235 xDrive Gran Coupé": x 104/183, w 512/376 | "Fahrfreude.": x 96/629 | "M Performance trifft auf extro": x 96/
  - 1440: [image-geometry] 35 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x629, #4 930x759/718x479, #5 1440x630/1248x702, #6 1248x832/718x479
  - 768: [height] preview 19369px vs live 16700px (116%)
  - 768: [typography] 9 runs differ: "Beratung & Services": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M235 xDrive Gran Coupé": size 18/14, weight 300/700 | "Extrovertiert. Perf
  - 768: [layout] 45/86 text blocks placed differently: "Das BMW M235 xDrive Gran Coupé": x 64/252, w 640/330 | "Technische Daten": x -439/-602 | "Konfigurieren": x -302/-465 | "
  - 768: [image-geometry] 21 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x378, #7 672x378/382x255
  - 390: [typography] 9 runs differ: "BMW M235 xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Extrovertiert. Perform
  - 390: [layout] 24/79 text blocks placed differently: "Das BMW M235 xDrive Gran Coupé": x 32/127, w 325/202 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x585, #4 513x419/342x228, #5 390x585/390x219, #12 342x228/1097x844

### /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 169% / 132% / 115%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 28484px vs live 16876px (169%)
  - 1440: [layout] 58/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 | "Fahrfreude.": x 96/629 | "Das BMW M440i xDrive Gran Coup": x 96/
  - 1440: [image-geometry] 31 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x630, #4 930x759/718x479, #5 1440x630/718x477, #6 1248x833/400x266
  - 768: [height] preview 23586px vs live 17901px (132%)
  - 768: [typography] 9 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440i xDrive Gran Coupé": size 18/14, weight 300/700 | "Unverwechselbares Design, u
  - 768: [layout] 61/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 64/248, w 640/337 | "Technische Daten": x -306/12 | "Preisliste": x -169/149 | "Probef
  - 768: [image-geometry] 22 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/382x254, #7 382x254/672x447
  - 390: [height] preview 20623px vs live 17909px (115%)
  - 390: [typography] 9 runs differ: "BMW M440i xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Unverwechselbares Des
  - 390: [layout] 41/93 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 32/124, w 325/209 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135
  - 390: [image-geometry] 19 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/342x227, #9 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 18/92 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 18/92 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 18/92 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 148% / 126% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 30110px vs live 20340px (148%)
  - 1440: [typography] 33 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": size 20/15, weight 300/700 | "Die BMW M5 Limousine mit M Hybrid is"
  - 1440: [layout] 59/114 text blocks placed differently: "Die neue BMW M5 Limousine.": x 104/183, w 512/316 | "Fahrfreude. Durch und durch.": x 96/490, w 1248/461 | "Kompromisse?
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x628, #4 930x759/1008x441, #5 1440x630/1008x441, #9 1008x441/718x478
  - 768: [height] preview 26058px vs live 20716px (126%)
  - 768: [typography] 34 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": size 18/14, weight 300/700 | "Fährt in einer eigenen Liga.": ali
  - 768: [layout] 65/113 text blocks placed differently: "Die neue BMW M5 Limousine.": x 64/279, w 640/275 | "Technische Daten": x -439/12 | "Konfigurieren": x -302/149 | "Preisl
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/1820x1024, #5 768x768/1820x1024, #9 1820x1024/382x254
  - 390: [typography] 34 runs differ: "BMW M5 Limousine": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Fährt in einer eigenen Liga.": 
  - 390: [layout] 31/107 text blocks placed differently: "Die neue BMW M5 Limousine.": x 32/146 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW M5 Lim
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 16/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 16/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 16/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 144% / 124% / 105%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 32404px vs live 22579px (144%)
  - 1440: [layout] 75/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 | "Technische Daten": x 12/-260 | "Auszeichnung": x 162/-110 | "Konfigurieren
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/612x153, #4 930x759/1440x630, #5 718x180/1008x441, #6 1440x630/1008x441
  - 768: [height] preview 28007px vs live 22528px (124%)
  - 768: [typography] 8 runs differ: "Auszeichnung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Touring": size 18/14, weight 300/700 | "Neue Grenzen ausloten.": size 17/29, a
  - 768: [layout] 72/119 text blocks placed differently: "Der BMW M5 Touring.": x 64/318 | "Technische Daten": x -553/48 | "Auszeichnung": x -416/185 | "Konfigurieren": x -302/29
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x95, #4 840x686/768x768, #5 382x96/1820x1024, #6 768x768/1820x1024
  - 390: [typography] 8 runs differ: "BMW M5 Touring": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Neue Grenzen ausloten.": size 16/2
  - 390: [layout] 35/112 text blocks placed differently: "Der BMW M5 Touring.": x 32/133 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Mehr Platz. Mehr 
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 15/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Gesamtfahrzeugantrieb"
  - 1440: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 15/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Gesamtfahrzeugantrieb"
  - 768: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": size 35/43, weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entd
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [height] preview 7181px vs live 8001px (90%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 15/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Gesamtfahrzeugantrieb"
  - 390: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle
- status: could not capture; widths: –; height ratio: – / – / –
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, carousel, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 8/74 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 8/74 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 8/74 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 151% / 120% / 106%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, hero-teaser, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 19493px vs live 12927px (151%)
  - 1440: [layout] 35/78 text blocks placed differently: "Der BMW X1 M35i xDrive.": x 96/212, w 538/401 | "Fahrfreude.": x 96/629 | "Ungezügelte M Power. Von der a": x 96/308, w 1
  - 1440: [image-geometry] 11 images sized differently (preview/live): #3 1248x833/718x479, #11 1248x832/400x267, #12 1248x832/400x266, #13 1248x832/400x266, #19 1248x832/400x266
  - 768: [height] preview 18943px vs live 15768px (120%)
  - 768: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 M35i xDrive": size 18/14, weight 300/700 | "Unverkennbar M.": align center/start | "
  - 768: [layout] 43/77 text blocks placed differently: "Der BMW X1 M35i xDrive.": x 106/268, w 556/329 | "Technische Daten": x -398/-29 | "Preisliste": x -261/108 | "Design": x 
  - 768: [image-geometry] 6 images sized differently (preview/live): #3 672x449/382x255, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/1820x1024, #17 1024x1024/1820x102
  - 390: [typography] 4 runs differ: "BMW X1 M35i xDrive": size 17/14, weight 300/700 | "Unverkennbar M.": align center/start | "So viel M muss man sich erstmal trau": align center/s
  - 390: [layout] 22/71 text blocks placed differently: "Der BMW X1 M35i xDrive.": x 24/129, w 342/226 | "Fahrfreude.": x 24/122 | "BMW X1 M35i xDrive": x 116/26 | "Preise und Pr
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 8/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 8/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 8/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Das EG-Leergewicht bezieht si
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 153% / 116% / 107%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 24925px vs live 16303px (153%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 6 runs differ: "Technologien": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 35/43, align start/center | "BMW X2 M35i xDrive": size 20/15, weig
  - 1440: [layout] 51/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 104/183, w 512/268 | "Fahrfreude.": x 96/607, w 1248/226 | "Mit einer leistungsstarken Mot": 
  - 1440: [image-geometry] 33 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x631, #4 930x759/718x479, #5 1440x630/612x408, #6 1248x833/612x408
  - 768: [height] preview 22138px vs live 19017px (116%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 9 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW X2 M35i xDrive": size 18/14, weight 300/700 | "Unverkennbar
  - 768: [layout] 53/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 64/300, w 640/234 | "Technische Daten": x -435/-333 | "Preisliste": x -298/-196 | "Probefahrt
  - 768: [image-geometry] 16 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x448, #7 672x448/1820x1024
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 8 runs differ: "Fahrfreude.": size 28/33 | "BMW X2 M35i xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Un
  - 390: [layout] 30/84 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 32/148 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": 
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x260, #7 390x260/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/x3-m50/bmw-x3-m50
- status: differences remain; widths: 1440, 768, 390; height ratio: 140% / 121% / 105%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22518px vs live 16118px (140%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [layout] 44/90 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 104/183, w 512/265 | "Fahrfreude.": x 96/629 | "M Performance: Sportlichkeit, ": x 96/308, w 1
  - 1440: [image-geometry] 30 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/718x479, #4 930x759/1440x631, #6 1440x630/718x479, #7 1248x702/718x479
  - 768: [height] preview 20903px vs live 17321px (121%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 8 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 M50 xDrive": size 18/14, weight 300/700 | "Preisliste BMW X3 M50 xDrive.":
  - 768: [layout] 47/89 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 64/301, w 640/231 | "Technische Daten": x -435/12 | "Preisliste": x -298/149 | "Probefahrt ver
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x255, #4 840x686/768x768, #6 768x768/382x255, #7 672x378/382x255
  - 390: [typography] 8 runs differ: "BMW X3 M50 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Preisliste BMW X3 M50 xDrive.":
  - 390: [layout] 26/83 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 32/150 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x
  - 390: [image-geometry] 20 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/342x228, #4 513x419/390x585, #6 390x585/390x260, #13 342x228/1097x844

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 197% / 140% / 121%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, hero-teaser, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 29301px vs live 14855px (197%)
  - 1440: [typography] 16 runs differ: "X6 M60i xDrive": color rgb(102, 102, 102)/rgb(38, 38, 38) | "High-Performance M TwinPower Turbo V": size 18/15 | "8-Gang M Steptronic Sport Get
  - 1440: [layout] 61/110 text blocks placed differently: "Die BMW X6 M Modelle.": x 96/212, w 538/387 | "Fahrfreude.": x 96/629 | "Geschärftes Exterieur, charakt": x 96/308, w 12
  - 1440: [image-geometry] 25 images sized differently (preview/live): #3 1523x1243/518x423, #4 1523x1243/518x423, #5 1008x441/1440x102, #10 1440x630/1008x441, #11 1248x832/1440x628
  - 768: [height] preview 24795px vs live 17716px (140%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 21 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "High-Performance M TwinPower Turbo V": size 17/14 | "8-Gang M Steptronic Sport G
  - 768: [layout] 66/113 text blocks placed differently: "Die BMW X6 M Modelle.": x 106/274, w 556/316 | "Technische Daten": x -360/12 | "Konfigurieren": x -223/149 | "BMW X6 M C
  - 768: [image-geometry] 10 images sized differently (preview/live): #3 1270x1037/416x339, #4 1270x1037/416x339, #5 1820x1024/768x106, #10 768x768/1820x1024, #11 672x448/768x768
  - 390: [height] preview 20365px vs live 16838px (121%)
  - 390: [typography] 22 runs differ: "BMW X6 M Competition": size 19/14, color rgb(38, 38, 38)/rgb(102, 102, 102) | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "H
  - 390: [layout] 45/108 text blocks placed differently: "Die BMW X6 M Modelle.": x 24/142 | "Fahrfreude.": x 24/122 | "Technische Daten": x 24/138 | "BMW X6 M60i xDrive.": x 24/
  - 390: [image-geometry] 8 images sized differently (preview/live): #3 852x695/257x210, #4 852x695/257x210, #5 1097x844/390x74, #10 390x585/1097x844, #11 342x228/390x587

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 87%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 9/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [missing-text] 9/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [height] preview 6664px vs live 7652px (87%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 9/68 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i
- status: differences remain; widths: 1440, 768, 390; height ratio: 115% / 102% / 94%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 15678px vs live 13672px (115%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 M60i xDrive": size 20/15, weight 300/700 | "Preisliste BMW X7 M60i xDrive"
  - 1440: [layout] 39/91 text blocks placed differently: "Der BMW X7 M60i xDrive.": x 96/212, w 538/412 | "Fahrfreude.": x 96/629 | "Der BMW X7 M60i xDrive kombini": x 96/308, w 1
  - 1440: [image-geometry] 9 images sized differently (preview/live): #9 1248x833/718x479, #18 1248x702/718x404, #19 1248x702/718x404, #23 1248x832/270x180, #24 1248x832/270x180
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 9 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 M60i xDrive": size 18/14, weight 300/700 | "Gebaut, um Grenzen zu verschie
  - 768: [layout] 41/90 text blocks placed differently: "Der BMW X7 M60i xDrive.": x 106/264, w 556/337 | "Technische Daten": x -335/12 | "Design": x -198/149 | "Preisliste": x -
  - 768: [image-geometry] 13 images sized differently (preview/live): #9 672x449/382x255, #13 1024x1024/1820x1024, #14 1024x1024/382x215, #15 1024x1024/382x215, #16 1024x1024/672x448
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 9 runs differ: "BMW X7 M60i xDrive": size 17/14, weight 300/700 | "Gebaut, um Grenzen zu verschieben.": align center/start | "Der BMW X7 M60i xDrive steht für u
  - 390: [layout] 22/86 text blocks placed differently: "Der BMW X7 M60i xDrive.": x 24/125, w 342/233 | "Fahrfreude.": x 24/122 | "BMW X7 M60i xDrive": x 114/26 | "Sieht aus wie

### /de/neufahrzeuge/m/xm/bmw-xm-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 16/86 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 16/86 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 16/86 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"

### /de/neufahrzeuge/m/xm/bmw-xm
- status: differences remain; widths: 1440, 768, 390; height ratio: 152% / 127% / 112%
- blocks: hero-stage, disclaimer, content-navigation, car-kpis, model-overview, color-switch, columns, hero-teaser, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 29621px vs live 19475px (152%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 20 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Maximale Performance und Präsenz": size 18/15, weight 700/300 | "High-Performanc
  - 1440: [layout] 79/124 text blocks placed differently: "Die BMW XM Modelle.": x 96/212, w 538/356 | "Für alle, die mehr wollen.": x 96/523, w 1248/395 | "Extrovertiert von der 
  - 1440: [image-geometry] 33 images sized differently (preview/live): #2 1440x630/475x388, #3 1523x1243/475x388, #4 282x100/1440x97, #5 1523x1243/1008x441, #6 282x100/1008x441
  - 768: [height] preview 27221px vs live 21513px (127%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 23 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Maximale Performance und Präsenz": size 17/14, weight 700/300 | "High-Performanc
  - 768: [layout] 67/126 text blocks placed differently: "Die BMW XM Modelle.": x 106/287, w 556/291 | "Technische Daten": x -389/12 | "Konfigurieren": x -252/149 | "Preisliste":
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x1024/416x339, #3 1270x1037/416x339, #4 282x100/768x106, #5 1270x1037/1820x1024, #6 282x100/1820x1024
  - 390: [height] preview 24031px vs live 21364px (112%)
  - 390: [overflow] scrollWidth 392 > 390: ul.model-overview-track right=392 | div.model-overview-media right=500 | a.model-overview-image-link right=500
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 22 runs differ: "Maximale Performance und Präsenz": size 16/14, weight 700/300 | "High-Performance M TwinPower Turbo V": size 16/14, weight 700/300 | "M Hybrid 
  - 390: [layout] 39/120 text blocks placed differently: "Die BMW XM Modelle.": x 24/142 | "BMW XM 50e.": x 24/195 | "Ab 135.500 €": x 24/195 | "Extrovertiertes Design und hoh": 
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/257x210, #3 857x700/257x210, #4 282x100/390x69, #6 282x100/1097x844, #10 1097x844/342x228

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 136% / 113% / 101%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17830px vs live 13086px (136%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 M40i": size 20/15, weight 300/700 | "Preisliste BMW Z4 M40i Roadster": ali
  - 1440: [layout] 37/73 text blocks placed differently: "Der BMW Z4 M40i Roadster.": w 538/412 | "Fahrfreude.": x 96/629 | "Der BMW Z4 M40i Roadster bring": x 96/308, w 1248/824 
  - 1440: [image-geometry] 24 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/1008x441, #9 1008x441/718x481, #10 1248x835/718x478
  - 768: [height] preview 17777px vs live 15689px (113%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 M40i": size 18/14, weight 300/700 | "Sportlich expressiv.": align center/s
  - 768: [layout] 34/74 text blocks placed differently: "Der BMW Z4 M40i Roadster.": x 106/245, w 556/375 | "Fahrfreude.": x 48/308 | "Der BMW Z4 M40i Roadster bring": x 48/164, 
  - 768: [image-geometry] 18 images sized differently (preview/live): #2 768x1024/840x686, #3 840x686/768x768, #4 768x768/1820x1024, #9 1820x1024/382x256, #10 672x450/382x254
  - 390: [typography] 5 runs differ: "BMW Z4 M40i": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Sportlich expressiv.": align center/s
  - 390: [layout] 17/70 text blocks placed differently: "Der BMW Z4 M40i Roadster.": x 24/124, w 342/235 | "Fahrfreude.": x 24/122 | "BMW Z4 M40i": x 140/26 | "Technische Daten":
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x585, #4 390x585/1097x844, #9 1097x844/342x229, #21 342x228/844x844

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 89%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [height] preview 6145px vs live 6933px (89%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/neufahrzeuge/x/x2/bmw-x2-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 8/76 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 768: [missing-text] 8/76 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus
  - 390: [missing-text] 8/76 live text runs not visible on preview: "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienaus

### /de/neufahrzeuge/x/x2/bmw-x2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 137% / 110% / 103%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 21732px vs live 15905px (137%)
  - 1440: [typography] 5 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 35/43, align start/center | "BMW X2 sDrive20i": size 20/15, weight 3
  - 1440: [layout] 38/87 text blocks placed differently: "Fahrfreude.": x 96/607, w 1248/226 | "Der BMW X2 – ein SUV, der die ": x 96/308, w 1248/824 | "Varianten und technische D
  - 1440: [image-geometry] 30 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x626, #4 1440x630/718x479, #5 1248x833/1008x441, #10 1008x441/612x408
  - 768: [height] preview 20455px vs live 18525px (110%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 9 runs differ: "Probefahrt vereinbaren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW X2 sDrive20i": size 18/14, weight 300/700 |
  - 768: [layout] 44/87 text blocks placed differently: "Der BMW X2.": x 64/322 | "Technische Daten": x -490/12 | "Preisliste": x -353/149 | "Probefahrt vereinbaren": x -271/231 
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x255, #5 672x449/1820x1024, #10 1820x1024/672x448
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 7 runs differ: "Fahrfreude.": size 28/33 | "BMW X2 sDrive20i": size 17/14, weight 300/700 | "Leistung und Design, die Aufsehen er": align center/start | "Der BM
  - 390: [layout] 20/79 text blocks placed differently: "Der BMW X2.": x 32/137 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "Fahrfreude.": x 24/110 | "
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x228, #5 342x228/1097x844, #10 1097x844/390x260
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 95%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 12/82 live text runs not visible on preview: "Vehicle Footprint", "Batterie/Laden", "Bidirektionales Laden", "Die angegebenen Werte wurden nach dem vo"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 12/82 live text runs not visible on preview: "Vehicle Footprint", "Batterie/Laden", "Bidirektionales Laden", "Die angegebenen Werte wurden nach dem vo"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 12/82 live text runs not visible on preview: "Vehicle Footprint", "Batterie/Laden", "Bidirektionales Laden", "Die angegebenen Werte wurden nach dem vo"

### /de/neufahrzeuge/x/ix3/bmw-ix3
- status: differences remain; widths: 1440, 768, 390; height ratio: 122% / 106% / 93%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, columns, carousel, text-media-teaser, media-showcase, color-switch, media, card-list, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 18537px vs live 15186px (122%)
  - 1440: [typography] 12 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designsp
  - 1440: [layout] 28/106 text blocks placed differently: "DER BMW iX3": w 538/324 | "Bereit, wenn Sie es sind: Vere": x 838/96 | "Sind Sie bereit für ein völlig": x 838/96 | "Pro
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/718x479, #3 718x479/270x270, #4 1248x1248/270x270, #5 1248x1248/270x270, #6 1248x1248/270x270
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 12/141 live text runs not visible on preview: "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l", "Volume"
  - 768: [typography] 12 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designsp
  - 768: [layout] 56/107 text blocks placed differently: "DER BMW iX3": x 106/222, w 556/324 | "Bereit, wenn Sie es sind: Vere": x 454/48 | "Sind Sie bereit für ein völlig": x 45
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x1024/382x255, #3 382x255/242x242, #4 672x672/242x242, #5 672x672/242x242, #6 672x672/242x242
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 13/141 live text runs not visible on preview: "Ihr BMW iX3", "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l"
  - 390: [typography] 12 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designsp
  - 390: [layout] 30/106 text blocks placed differently: "DER BMW iX3": x 24/76, w 342/238 | "Bereit, wenn Sie es sind: Vere": w 342/257 | "Probefahrt vereinbaren": x 24/120 | "D
  - 390: [image-geometry] 26 images sized differently (preview/live): #2 390x520/342x228, #3 342x229/266x266, #4 342x342/266x266, #5 342x342/266x266, #6 342x342/1097x844

### /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 7/63 live text runs not visible on preview: "BMW iX5:", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 7/63 live text runs not visible on preview: "BMW iX5:", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 7/63 live text runs not visible on preview: "BMW iX5:", "Batterie/Laden", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu"

### /de/neufahrzeuge/x/suv/bmw-ix5
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 92% / 89%
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 12922px vs live 14417px (90%)
  - 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen"
  - 1440: [typography] 5 runs differ: "DER NEUE BMW iX5": color rgb(255, 255, 255)/rgb(38, 38, 38) | "GESCHAFFEN, UM VORAUSZUGEHEN.": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Beste
  - 1440: [layout] 11/74 text blocks placed differently: "Weitere Antriebe und Varianten": x 96/336, w 1248/768 | "845 km": x 335/1116 | "Mehr anzeigen": w 95/624 | "Variabel ohne
  - 1440: [image-geometry] 13 images sized differently (preview/live): #4 1440x630/1008x441, #5 1440x630/1008x441, #6 1440x630/1008x441, #9 1008x441/1440x630, #10 1008x441/1440x630
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"
  - 768: [typography] 5 runs differ: "DER NEUE BMW iX5": color rgb(255, 255, 255)/rgb(38, 38, 38) | "GESCHAFFEN, UM VORAUSZUGEHEN.": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Beste
  - 768: [layout] 21/74 text blocks placed differently: "DER NEUE BMW iX5": x 106/150 | "Setzt Standards. Nicht Trends.": w 672/397 | "845 km": x 384/511 | "Mehr anzeigen": w 95/
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x1024/768x336, #4 768x336/768x768, #5 768x768/1820x1024, #6 768x768/1820x1024, #10 1820x1024/768x768
  - 390: [height] preview 16900px vs live 18899px (89%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"
  - 390: [typography] 5 runs differ: "DER NEUE BMW iX5": color rgb(255, 255, 255)/rgb(38, 38, 38) | "GESCHAFFEN, UM VORAUSZUGEHEN.": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Beste
  - 390: [layout] 13/74 text blocks placed differently: "DER NEUE BMW iX5": x 24/105 | "845 km": x 195/46 | "Mehr anzeigen": w 95/342 | "Mehr Exterieur Highlights": x 24/112 | "M
  - 390: [image-geometry] 16 images sized differently (preview/live): #3 390x488/390x779, #4 390x488/1097x844, #5 390x693/1097x844, #6 390x693/1097x844, #9 1097x844/390x585

### /de/neufahrzeuge/x/suv/bmw-x5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 11/70 live text runs not visible on preview: "BMW X5", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 11/70 live text runs not visible on preview: "BMW X5", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 11/70 live text runs not visible on preview: "BMW X5", "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen"

### /de/neufahrzeuge/x/suv/bmw-x5
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 96% / 88%
- blocks: hero-stage, disclaimer, scroll-navigation, cta-collection, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 13761px vs live 15418px (89%)
  - 1440: [layout] 17/96 text blocks placed differently: "BMW X5": ypos 56%/3% | "Weitere Antriebe und Varianten": x 96/336, w 1248/768 | "Mehr anzeigen": w 95/624 | "Mehr Farben 
  - 1440: [image-geometry] 14 images sized differently (preview/live): #5 1440x630/1008x441, #6 1440x630/1008x441, #9 1008x441/1440x630, #10 1008x441/1440x630, #11 1008x441/1440x630
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 768: [layout] 47/96 text blocks placed differently: "DER NEUE BMW X5": x 106/158 | "BMW X5": x 268/415, ypos 52%/4% | "Setzt Standards. Nicht Trends.": w 672/397 | "vier fort
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 768x1024/672x294, #4 672x294/1820x1024, #5 768x768/1820x1024, #6 768x768/616x462, #7 1820x1024/616x462
  - 768: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras
  - 390: [height] preview 17913px vs live 20368px (88%)
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 390: [layout] 14/96 text blocks placed differently: "BMW X5": ypos 54%/3% | "Mehr anzeigen": w 95/342 | "Mehr Exterieur Highlights": x 24/112 | "Mehr digitale Highlights": x 
  - 390: [image-geometry] 16 images sized differently (preview/live): #3 342x428/1097x844, #4 342x428/844x844, #5 390x693/390x293, #6 390x693/390x293, #7 1097x844/390x488
  - 390: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras

### /de/neufahrzeuge/x/x1/bmw-x1-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-stage, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 10/82 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 10/82 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 10/82 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"

### /de/neufahrzeuge/x/x1/bmw-x1
- status: differences remain; widths: 1440, 768, 390; height ratio: 135% / 115% / 105%
- blocks: hero-stage, content-navigation, drivetrain-switch, model-offer, hero-teaser, columns, color-switch, disclaimer, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 20323px vs live 15067px (135%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 22 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 xDrive23i": size 20/15, weight 300/700 | "Gewerbekunden": size 18/20 | "3
  - 1440: [layout] 48/104 text blocks placed differently: "Die Modelle des BMW X1.": w 538/405 | "Fahrfreude.": x 96/629 | "Flexibel zwischen urbanem Allr": x 96/308, w 1248/824 |
  - 1440: [image-geometry] 15 images sized differently (preview/live): #8 1248x831/718x478, #15 1248x832/294x196, #16 1248x832/294x196, #18 1440x630/718x479, #19 1440x630/294x196
  - 768: [height] preview 20331px vs live 17643px (115%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 15 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 xDrive23i": size 18/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €"
  - 768: [layout] 63/104 text blocks placed differently: "Die Modelle des BMW X1.": x 106/218, w 556/332 | "Technische Daten": x -417/12 | "Angebote": x -280/149 | "Preisliste": 
  - 768: [image-geometry] 17 images sized differently (preview/live): #3 324x194/184x110, #4 324x194/184x110, #5 324x194/184x110, #6 324x194/184x110, #8 672x447/382x254
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 15 runs differ: "im Monat leasen.": align left/center | "BMW X1 xDrive23i": size 17/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 16/14 | "✔ Laufl
  - 390: [layout] 21/97 text blocks placed differently: "Ab 399 €": x 36/133 | "im Monat leasen.": x 169/89 | "Exklusiv für Gewerbekunden.": x 169/89 | "Fahrfreude.": x 24/122 | 
  - 390: [image-geometry] 9 images sized differently (preview/live): #18 844x844/342x228, #19 844x844/342x228, #20 844x844/342x228, #21 844x844/342x228, #24 342x228/390x585

### /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 17/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 768: [missing-text] 17/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"
  - 390: [height] preview 8386px vs live 9330px (90%)
  - 390: [missing-text] 17/87 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Elektromotor", "Verbrauch/Emissionen"

### /de/neufahrzeuge/x/x3/bmw-x3-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 134% / 113% / 100%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, media, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 26521px vs live 19749px (134%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 7 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 30e xDrive": size 20/15, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybrid": al
  - 1440: [layout] 50/100 text blocks placed differently: "Der BMW X3 Plug-in-Hybrid.": w 512/297 | "Varianten und technische Daten": x 96/462, w 1248/516 | "BMW X3 30e xDrive": x
  - 1440: [image-geometry] 36 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 1248x833/1440x629, #5 1440x630/1008x441, #6 320x320/1008x441
  - 768: [height] preview 24274px vs live 21504px (113%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 11 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 30e xDrive": size 18/14, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybr
  - 768: [layout] 58/101 text blocks placed differently: "Der BMW X3 Plug-in-Hybrid.": x 64/252, w 640/261 | "Technische Daten": x -398/-159 | "Preisliste": x -261/-22 | "Probefa
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x255, #4 672x449/768x768, #5 768x768/1820x1024, #6 208x208/1820x1024
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 14 runs differ: "BMW X3 30e xDrive": size 17/14, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybrid": align start/center | "Gebaut, um die Welt zu entdecken.": 
  - 390: [layout] 27/97 text blocks placed differently: "Der BMW X3 Plug-in-Hybrid.": w 325/250 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW X3 30e
  - 390: [image-geometry] 24 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #4 342x228/390x585, #5 390x585/1097x844, #6 342x342/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/x/x3/bmw-x3-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 768: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"
  - 390: [missing-text] 12/78 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Vehicle Footprint"

### /de/neufahrzeuge/x/x3/bmw-x3
- status: differences remain; widths: 1440, 768, 390; height ratio: 146% / 121% / 111%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 26264px vs live 18014px (146%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 19 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 20 xDrive": size 20/15, weight 300/700 | "Gewerbekunden": size 18/20 | "529,00 €/
  - 1440: [layout] 54/115 text blocks placed differently: "Varianten und technische Daten": x 96/462, w 1248/516 | "BMW X3 20 xDrive": x 96/441 | "Unverbindliches Leasingbeispie":
  - 1440: [image-geometry] 35 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #5 612x367/1440x628, #6 1440x630/718x479, #7 320x320/1008x441
  - 768: [height] preview 23622px vs live 19560px (121%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 17 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 20 xDrive": size 18/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 1
  - 768: [layout] 64/116 text blocks placed differently: "Der BMW X3.": x 64/322 | "Technische Daten": x -417/-184 | "Angebote": x -280/-47 | "Preisliste": x -193/40 | "Probefahr
  - 768: [image-geometry] 30 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #5 324x194/768x768, #6 768x768/382x255, #7 208x208/1820x1024
  - 390: [height] preview 21824px vs live 19726px (111%)
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 20 runs differ: "BMW X3 20 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "✔ Leasingsonderzahlung: 0,00 €"
  - 390: [layout] 22/109 text blocks placed differently: "Der BMW X3.": x 32/137 | "Konfigurieren & Preise": x 32/122 | "Angebot anfordern": x 32/135 | "BMW X3 20 xDrive": x 123/
  - 390: [image-geometry] 27 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #5 342x205/390x586, #6 390x585/342x228, #7 342x342/1097x844

### /de/neufahrzeuge/x/x6/bmw-x6-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 9/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"

### /de/neufahrzeuge/x/x6/bmw-x6
- status: differences remain; widths: 1440, 768, 390; height ratio: 141% / 119% / 104%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 19559px vs live 13896px (141%)
  - 1440: [typography] 7 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X6 M60i xDrive": size 20/15, weight 300/700 | "Präsenz, die bewegt.": size 18/35 | "Ihr
  - 1440: [layout] 38/90 text blocks placed differently: "Der BMW X6.": w 538/214 | "Fahrfreude.": x 96/629 | "Kraftvoll in der Präsenz. Der ": x 96/308, w 1248/824 | "Varianten u
  - 1440: [image-geometry] 16 images sized differently (preview/live): #9 1248x832/718x479, #11 1197x798/408x272, #12 1197x798/408x272, #13 1197x798/408x272, #19 1248x832/718x479
  - 768: [height] preview 18977px vs live 15975px (119%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 11 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X6 M60i xDrive": size 18/14, weight 300/700 | "Präsenz, die bewegt.": size 1
  - 768: [layout] 37/89 text blocks placed differently: "Der BMW X6.": x 106/297 | "Fahrfreude.": x 48/308 | "Kraftvoll in der Präsenz. Der ": x 48/164, w 672/440 | "Varianten un
  - 768: [image-geometry] 15 images sized differently (preview/live): #9 672x448/382x255, #14 1024x1024/1820x1024, #15 1024x1024/382x255, #16 1024x1024/382x255, #17 1024x1024/672x448
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 10 runs differ: "BMW X6 M60i xDrive": size 17/14, weight 300/700 | "Präsenz, die bewegt.": size 16/28, align center/start | "Der BMW X6 M60i xDrive überzeugt mi
  - 390: [layout] 23/87 text blocks placed differently: "Der BMW X6.": x 24/110 | "Fahrfreude.": x 24/122 | "BMW X6 M60i xDrive": x 113/26 | "Statement in Schwarz.": x 24/390 | "
  - 390: [image-geometry] 9 images sized differently (preview/live): #15 844x844/390x260, #16 844x844/390x260, #17 844x844/342x228, #18 844x844/342x228, #26 342x228/390x438
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/x/x7/bmw-x7-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 10/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 10/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 10/71 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Batterie/Laden"

### /de/neufahrzeuge/x/x7/bmw-x7
- status: differences remain; widths: 1440, 768, 390; height ratio: 145% / 115% / 105%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, video, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22560px vs live 15519px (145%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 xDrive40i": size 20/15, weight 300/700 | "Ihr Assistent für entspanntes Re
  - 1440: [layout] 53/110 text blocks placed differently: "Der BMW X7.": w 538/207 | "Fahrfreude.": x 96/629 | "Elegantes Design trifft im BMW": x 96/308, w 1248/824 | "Varianten 
  - 1440: [image-geometry] 23 images sized differently (preview/live): #9 1248x702/1248x150, #10 1248x702/1248x150, #11 1248x832/376x250, #12 1248x832/376x250, #13 1248x832/376x250
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80
  - 768: [height] preview 21467px vs live 18654px (115%)
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 51/109 text blocks placed differently: "Der BMW X7.": x 106/300 | "Technische Daten": x -335/12 | "Design": x -198/149 | "Preisliste": x -130/217 | "Fahrdynamik
  - 768: [image-geometry] 18 images sized differently (preview/live): #9 672x378/672x150, #10 672x378/672x150, #14 1024x1024/1820x1024, #15 1024x1024/382x215, #16 1024x1024/382x215
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 28/105 text blocks placed differently: "Der BMW X7.": x 24/113 | "Fahrfreude.": x 24/122 | "BMW X7 xDrive40i": x 124/26 | "Unverwechselbar, präzise, unüb": w 34
  - 390: [image-geometry] 14 images sized differently (preview/live): #9 390x219/390x150, #10 390x219/390x150, #15 844x844/390x219, #16 844x844/390x219, #17 844x844/342x228
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 139% / 121% / 106%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 18244px vs live 13167px (139%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 sDrive30i": size 20/15, weight 300/700 | "Preisliste BMW Z4 Roadster": ali
  - 1440: [layout] 33/74 text blocks placed differently: "Der BMW Z4 Roadster.": w 538/363 | "Fahrfreude.": x 96/629 | "Gebaut für Kurven, Geraden und": x 96/308, w 1248/824 | "Va
  - 1440: [image-geometry] 14 images sized differently (preview/live): #9 1248x833/718x479, #17 1248x832/612x407, #18 1248x832/612x407, #20 1440x630/718x479, #21 1440x630/718x479
  - 768: [height] preview 19078px vs live 15722px (121%)
  - 768: [footer-links] 63 vs 60
  - 768: [layout] 35/77 text blocks placed differently: "Der BMW Z4 Roadster.": x 106/235, w 556/299 | "Fahrfreude.": x 48/308 | "Gebaut für Kurven, Geraden und": x 48/164, w 672
  - 768: [image-geometry] 8 images sized differently (preview/live): #9 672x449/382x255, #19 1024x1024/1820x1024, #20 1024x1024/382x255, #21 1024x1024/382x255, #22 1024x1024/672x448
  - 390: [footer-links] 63 vs 60
  - 390: [layout] 19/71 text blocks placed differently: "Fahrfreude.": x 24/122 | "BMW Z4 sDrive30i": x 122/26 | "Eine Front, athletisch auf den": x 24/390 | "Die BMW Niere beton
  - 390: [image-geometry] 5 images sized differently (preview/live): #20 844x844/390x260, #21 844x844/390x260, #22 844x844/342x228, #28 342x228/390x438, #29 342x228/390x438

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [footer-links] 63 vs 60
  - 1440: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 768: [footer-links] 63 vs 60
  - 768: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi
  - 390: [footer-links] 63 vs 60
  - 390: [missing-text] 6/60 live text runs not visible on preview: "Gesamtfahrzeugantrieb", "TwinPower Turbo Verbrennungsmotor", "Verbrauch/Emissionen", "Angaben zu Leistung für Benzi

### /de/publicpools/sitemap/sitemap
- status: differences remain; widths: 1440, 768, 390; height ratio: 284% / 272% / 123%
- blocks: columns, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 3826px vs live 1346px (284%)
  - 1440: [footer-height] 1327 vs 0
  - 1440: [footer-links] 63 vs 0
  - 1440: [layout] 51/65 text blocks placed differently: "Kontakt": w 1248/400 | "BMW erleben": w 1248/400 | "Service- & Dienstleistungen": x 96/520, w 1248/400 | "Termin vereinba
  - 768: [height] preview 3911px vs live 1436px (272%)
  - 768: [footer-height] 1449 vs 0
  - 768: [footer-links] 63 vs 0
  - 768: [layout] 46/65 text blocks placed differently: "Kontakt": w 672/208 | "BMW erleben": w 672/208 | "Service- & Dienstleistungen": x 48/280, w 672/208 | "Termin vereinbaren
  - 390: [height] preview 1954px vs live 1593px (123%)
  - 390: [footer-height] 1040 vs 0
  - 390: [footer-links] 63 vs 0
  - 390: [typography] 6 runs differ: "Kontakt": size 14/19, weight 500/300 | "BMW erleben": size 14/19, weight 500/300 | "Service- & Dienstleistungen": size 14/19, weight 500/300 | "

### /de/services-and-workshop/allgemeine-versicherungsbedingungen
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 68%
- blocks: download
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f
  - 768: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f
  - 390: [height] preview 1344px vs live 1977px (68%)
  - 390: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f

### /de/shop-online/bmw-angebote
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 94% / 88%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13523px vs live 11357px (119%)
  - 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 1440: [layout] 34/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1179 | "Gewerbekunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unver
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 336x149/1248x416, #8 336x149/506x405, #10 1248x998/506x368, #11 1248x416/376x167
  - 768: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 768: [layout] 37/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Gewerbekunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 624x277/672x448, #6 624x277/556x445, #7 624x277/672x448, #8 624x277/556x404, #9 672x448/536x238
  - 390: [height] preview 13383px vs live 15138px (88%)
  - 390: [typography] 18 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Elektroautos.": x 24/74, w 119/242 | "26.604,00 €": w 92/294 | "16.524,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 294x131/342x342, #5 294x131/342x274, #6 294x131/342x342, #7 294x131/342x249, #9 342x342/342x228

### /de/shop-online/bmw-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 94% / 88%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13599px vs live 11433px (119%)
  - 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Privatkunden": colo
  - 1440: [layout] 34/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1115 | "Privatkunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unverb
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 336x149/1248x416, #8 336x149/506x405, #10 1248x998/506x380, #11 1248x416/376x167
  - 768: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Privatkunden": colo
  - 768: [layout] 37/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Privatkunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371 
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 624x277/672x448, #6 624x277/556x445, #7 624x277/672x448, #8 624x277/556x417, #9 672x448/536x238
  - 390: [height] preview 13415px vs live 15176px (88%)
  - 390: [typography] 18 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Elektroautos.": x 24/74, w 119/242 | "32.364,00 €": w 90/294 | "17.964,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 294x131/342x342, #5 294x131/342x274, #6 294x131/342x342, #7 294x131/342x257, #9 342x342/342x228

### /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 142% / 115% / 105%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 13668px vs live 9630px (142%)
  - 1440: [typography] 4 runs differ: "Ihre Vorteile": color rgb(102, 102, 102)/rgb(38, 38, 38) | "1 Änderungen vorbehalten": size 15/12 | "Mehr erfahren": size 18/15 | "Jetzt reinhör
  - 1440: [layout] 29/65 text blocks placed differently: "BMW Vertrieb an Großkunden.": w 512/331 | "BMW bietet den perfekten Servi": x 96/308, w 1248/824 | "Vorteile auf einen Bl
  - 1440: [image-geometry] 8 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #6 1523x1243/518x423, #7 1523x1243/518x423, #8 1523x1243/1440x66
  - 768: [height] preview 14456px vs live 12598px (115%)
  - 768: [typography] 4 runs differ: "Ihre Vorteile": color rgb(102, 102, 102)/rgb(38, 38, 38) | "1 Änderungen vorbehalten": size 14/12 | "Mehr erfahren": size 17/14 | "Jetzt reinhör
  - 768: [layout] 38/65 text blocks placed differently: "BMW Vertrieb an Großkunden.": x 64/248, w 640/269 | "Ihre Vorteile": x -73/12 | "Top-Themen": x 28/113 | "Dienstwagen-Fav
  - 768: [image-geometry] 6 images sized differently (preview/live): #5 672x448/416x339, #6 1270x1037/416x339, #7 1270x1037/768x59, #8 1270x1037/672x449, #11 672x448/382x255
  - 390: [layout] 16/63 text blocks placed differently: "BMW Vertrieb an Großkunden.": w 325/250 | "Top-Themen.": x 24/111 | "Fuhrparks intelligent steuern.": w 342/254 | "Fahrfr
  - 390: [image-geometry] 4 images sized differently (preview/live): #5 342x228/257x210, #6 852x695/257x210, #7 852x695/342x228, #8 852x695/342x228

### /de/topics/fascination-bmw/events/quiztaxi2024
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 91% / 82%
- blocks: hero-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [layout] 3/4 text blocks placed differently: "Die Biathlon-Weltcupwoche in R": x 96/308, w 1248/824 | "Einsteigen und gewinnen, heißt": x 96/308, w 1248/824 | "Überzeuge
  - 768: [layout] 4/4 text blocks placed differently: "Das BMW Quiz-Taxi geht in die ": x 64/185, w 640/394 | "Die Biathlon-Weltcupwoche in R": x 48/164, w 672/440 | "Einsteigen 
  - 390: [height] preview 2871px vs live 3507px (82%)

### /de/topics/fascination-bmw/events/vip-experience
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 83%
- blocks: hero-teaser, video, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 | "VIP Experience Biathlon auf Sc": w 512/381 | "Shuttle-Service im vollelektri": w 1248/674
  - 390: [height] preview 2988px vs live 3591px (83%)

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 145% / 113% / 108%
- blocks: hero-teaser, carousel, tabs, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: 
  - 1440: [height] preview 8624px vs live 5948px (145%)
  - 1440: [layout] 20/59 text blocks placed differently: "BMW & Biathlon.": w 512/336 | "Biathlon begeistert Millionen ": x 96/308, w 1248/824 | "Effizienz, Dynamik und die Fre": 
  - 1440: [image-geometry] 5 images sized differently (preview/live): #6 980x521/718x382, #7 1248x703/270x152, #8 1248x703/270x152, #9 1248x703/270x152, #10 1248x703/270x152
  - 768: [height] preview 8239px vs live 7284px (113%)
  - 768: [layout] 28/59 text blocks placed differently: "BMW & Biathlon.": x 64/246, w 640/272 | "Ausdauer, Dynamik, Präzision u": x 64/225, w 640/314 | "Biathlon begeistert Mill
  - 390: [layout] 8/59 text blocks placed differently: "Unsere Experten.": x 24/85, w 342/221 | "Wintersport: Born to win, born": ypos 55%/61% | "BMW Quiz-Taxi 2024.": x 24/390 |

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 83% / 86%
- blocks: hero-teaser, content-table, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 4336px vs live 4948px (88%)
  - 1440: [layout] 9/42 text blocks placed differently: "Effizienz im Eiskanal.": w 512/219 | "Effizienz und Performance zeic": x 96/308, w 1248/824 | "Seit 2014 ist der Premium-A
  - 768: [height] preview 4784px vs live 5750px (83%)
  - 768: [layout] 15/42 text blocks placed differently: "BMW & Rennrodeln.": x 64/221, w 640/322 | "Effizienz im Eiskanal.": x 64/285 | "Effizienz und Performance zeic": x 48/164
  - 390: [height] preview 5648px vs live 6549px (86%)

### /de/topics/faszination-bmw/events/bmw-golfsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 78%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 | "BMW International Open.": w 400/262 | "Friends of the Brand.": w 400/218
  - 390: [height] preview 2991px vs live 3837px (78%)

### /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 83%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 4/6 text blocks placed differently: "BMW ist rund um den Globus bei": x 96/308, w 1248/824 | "Max Kieffer.": x 838/96 | "Der in einer Golfer-Familie au": x 838/
  - 390: [height] preview 3492px vs live 4232px (83%)

### /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 89% / 80%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 2818px vs live 3217px (88%)
  - 1440: [layout] 10/10 text blocks placed differently: "BMW Golf Cup.": w 512/295 | "Er ist die größte internationa": x 96/308, w 1248/824 | "Ein Profi bei einem Major-Turn": x 
  - 768: [height] preview 4021px vs live 4504px (89%)
  - 768: [layout] 10/10 text blocks placed differently: "BMW Golf Cup.": x 64/263, w 640/238 | "Er ist die größte internationa": x 48/164, w 672/440 | "Ein Profi bei einem Major-
  - 390: [height] preview 3343px vs live 4194px (80%)

### /de/topics/faszination-bmw/events/kulturelles-engagement
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 136% / 90%
- blocks: hero-teaser, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 7437px vs live 8269px (90%)
  - 1440: [layout] 19/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 | "Die Kulturförderung der BMW Gr": x 96/308, w 1248/824 | "Zur Kulturbroschüre": x
  - 768: [height] preview 11676px vs live 8615px (136%)
  - 768: [layout] 9/36 text blocks placed differently: "Kulturelles Engagement von BMW": x 64/179, w 640/407 | "Verantwortung übernehmen.": x 64/251, w 640/263 | "Die Kulturförde
  - 768: [image-geometry] 12 images sized differently (preview/live): #2 672x378/324x182, #3 672x378/324x182, #4 672x378/324x182, #5 672x378/324x182, #6 672x378/324x182
  - 390: [height] preview 10099px vs live 11226px (90%)

### /de/topics/faszination-bmw/events/wintersport
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 87% / 75%
- blocks: hero-teaser, columns, disclaimer, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 9/30 text blocks placed differently: "Starker Partner des Winterspor": x 96/308, w 1248/522 | "Freuen Sie sich auf einen beso": x 96/308, w 1248/824 | "In diese
  - 768: [height] preview 7126px vs live 8147px (87%)
  - 768: [layout] 5/30 text blocks placed differently: "Elektrisierender Wintersport.": x 64/159, w 640/447 | "Dynamik, Effizienz und Freude ": x 64/191, w 640/383 | "Starker Par
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x168/672x378, #5 672x378/672x896
  - 390: [height] preview 7159px vs live 9594px (75%)
  - 390: [layout] 10/30 text blocks placed differently: "Elektrisierender Wintersport.": x 32/81, w 325/228 | "Starker Partner des Winterspor": x 24/84, w 342/221 | "Freuen Sie s

### /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 98% / 93%
- blocks: hero-teaser, video, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 11/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 | "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 | "Ein Sieggarant auf der ganzen ": x 
  - 768: [layout] 11/11 text blocks placed differently: "Der BMW Group Windkanal.": x 64/253, w 640/258 | "Mit BMW 3D-Druck auf Zeitenjag": x 64/224, w 640/317 | "Ein Sieggarant 

### /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 83% / 94% / 82%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 2686px vs live 3220px (83%)
  - 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 | "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/start | "Lena Gercke": alig
  - 1440: [layout] 7/7 text blocks placed differently: "BMW IBU Weltcup Biathlon": w 512/359 | "January 09, 2025 to January 12": w 512/337 | "Biathlonzentrum 1 83324, Ruhpo": w 51
  - 768: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 20/18 | "Es ist klasse, dass wir in der BMW-F": size 17/25, align center/start | "Lena Gercke": alig
  - 768: [layout] 7/7 text blocks placed differently: "BMW IBU Weltcup Biathlon": x 64/237, w 640/291 | "January 09, 2025 to January 12": x 64/204, w 640/303 | "Biathlonzentrum 1
  - 390: [height] preview 3133px vs live 3824px (82%)
  - 390: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 19/17 | "Es ist klasse, dass wir in der BMW-F": size 16/23, align center/start | "Lena Gercke": alig
  - 390: [layout] 3/7 text blocks placed differently: "BMW IBU Weltcup Biathlon": ypos 8%/1% | "Hinter den Kulissen des BMW IB": ypos 25%/15% | "Lena Gercke": x 149/24, w 93/342

### /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs
- status: differences remain; widths: 1440, 768, 390; height ratio: 107% / 118% / 103%
- blocks: hero-teaser, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 8/10 text blocks placed differently: "Der Bob- und Schlittenverband ": x 96/308, w 1248/824 | "Die deutschen Rennrodler start": x 96/308, w 1248/824 | "Die Grun
  - 768: [height] preview 6070px vs live 5144px (118%)
  - 768: [layout] 10/10 text blocks placed differently: "Ideallinie für die Heim-WM.": x 64/169, w 640/426 | "BMW Motorsport entwickelte Sof": x 64/178, w 640/408 | "Der Bob- und

### /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 92% / 89%
- blocks: hero-teaser, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 31/111 text blocks placed differently: "Vertrauen Sie auf unsere Erfah": w 512/370 | "So individuell wie Ihre Ansprü": x 96/455, w 1248/531 | "BMW beliefert deu
  - 768: [layout] 42/111 text blocks placed differently: "BMW Behördenfahrzeuge.": x 64/172, w 640/420 | "Vertrauen Sie auf unsere Erfah": x 64/219, w 640/326 | "So individuell w
  - 390: [height] preview 7945px vs live 8959px (89%)
  - 390: [layout] 24/111 text blocks placed differently: "Zum Behörden Konfigurator": x 32/105 | "Gebietsleiterin": w 106/326 | "Hamburg": w 68/326 | "Mobil: +49 151 60510221": w

### /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 140% / 114% / 105%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 14250px vs live 10201px (140%)
  - 1440: [layout] 30/70 text blocks placed differently: "BMW Vertrieb an Großkunden.": w 512/331 | "BMW bietet den perfekten Servi": x 96/308, w 1248/824 | "Vorteile auf einen Bl
  - 1440: [image-geometry] 8 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #6 1523x1243/518x423, #7 1523x1243/518x423, #8 1523x1243/1440x66
  - 768: [height] preview 15294px vs live 13420px (114%)
  - 768: [layout] 39/70 text blocks placed differently: "BMW Vertrieb an Großkunden.": x 64/248, w 640/269 | "Ihre Vorteile": x -233/12 | "Top-Themen": x -132/113 | "Dienstwagen-
  - 768: [image-geometry] 6 images sized differently (preview/live): #5 672x448/416x339, #6 1270x1037/416x339, #7 1270x1037/768x59, #8 1270x1037/672x449, #12 672x448/382x255
  - 390: [layout] 17/67 text blocks placed differently: "BMW Vertrieb an Großkunden.": w 325/250 | "Top-Themen.": x 24/111 | "Fuhrparks intelligent steuern.": w 342/254 | "Fahrfr
  - 390: [image-geometry] 4 images sized differently (preview/live): #5 342x228/257x210, #6 852x695/257x210, #7 852x695/342x228, #8 852x695/342x228

### /de/topics/faszination-bmw/sport-events/weltcup
- status: differences remain; widths: 1440, 768, 390; height ratio: 125% / 91% / 79%
- blocks: hero-teaser, video, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 4298px vs live 3433px (125%)
  - 1440: [layout] 5/8 text blocks placed differently: "BMW WeltcupHeroes 2025.": w 512/274 | "BMW Weltcup Heroes Ruhpolding ": x 96/732, w 1248/506, ypos 40%/30% | "BMW präsentie
  - 1440: [image-geometry] 4 images sized differently (preview/live): #2 1248x702/612x344, #3 1248x702/612x344, #4 1248x702/612x344, #5 1248x702/612x344
  - 768: [layout] 5/8 text blocks placed differently: "BMW WeltcupHeroes 2025.": x 64/271, w 640/222 | "BMW Weltcup Heroes Ruhpolding ": w 672/246 | "BMW präsentiert die Geschich
  - 768: [image-geometry] 2 images sized differently (preview/live): #4 672x378/324x182, #5 672x378/324x182
  - 390: [height] preview 3845px vs live 4871px (79%)
  - 390: [image-geometry] 2 images sized differently (preview/live): #4 390x219/390x119, #5 390x219/390x119

### /de/topics/neuwagen/gewaehrleistung
- status: differences remain; widths: 1440, 768, 390; height ratio: 123% / 106% / 94%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 10300px vs live 8379px (123%)
  - 1440: [typography] 10 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Erweiterte Batteriegewährleistung": align start/center | "BMW Plug-in-Hybride (Gen
  - 1440: [layout] 47/58 text blocks placed differently: "Gewährleistungen, Garantien un": w 512/368 | "Gewährleistung": x 96/0 | "Erweiterte Batteriegewährleist": x 232/136 | "Ga
  - 1440: [image-geometry] 5 images sized differently (preview/live): #3 1248x703/718x404, #4 1248x703/718x404, #6 1248x700/612x343, #8 1248x416/718x480, #9 1248x703/1248x418
  - 768: [typography] 10 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Erweiterte Batteriegewährleistung": align start/center | "BMW Plug-in-Hybride (Gen
  - 768: [layout] 27/58 text blocks placed differently: "Gewährleistungen, Garantien un": x 64/233, w 640/298 | "Gewährleistung": x 48/0 | "Erweiterte Batteriegewährleist": x 172
  - 768: [image-geometry] 2 images sized differently (preview/live): #6 672x377/324x182, #7 672x378/324x182
  - 390: [typography] 8 runs differ: "BMW Plug-in-Hybride (Generationen 3.": align start/center | "BMW i3 (I01) Gewährleistungsbeginn v": align start/center | "BMW BEV Gewährleistung

### /de/topics/service-zubehoer/bmw-security
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 93% / 89%
- blocks: hero-teaser, columns, content-table, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 15/40 text blocks placed differently: "BMW Security": w 512/278 | "Sie fahren, wir schützen.": w 512/253 | "BMW Security hilft Ihnen dabei": x 96/308, w 1248/82
  - 768: [layout] 15/40 text blocks placed differently: "BMW Security": x 64/269, w 640/226 | "Sie fahren, wir schützen.": x 64/271, w 640/223 | "Mit BMW Security setzt BMW inn":
  - 390: [height] preview 7222px vs live 8153px (89%)
  - 390: [layout] 6/40 text blocks placed differently: "BMW Security": x 32/91, w 325/209 | "Sie fahren, wir schützen.": x 32/89, w 325/213 | "Partner finden": x 32/149 | "BMW Pa

### /de/topics/service-zubehoer/bmw-service/repair-inclusive
- status: differences remain; widths: 1440, 768, 390; height ratio: 114% / 100% / 95%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 10214px vs live 8953px (114%)
  - 1440: [layout] 64/102 text blocks placed differently: "BMW Service": x 96/0 | "Proactive Care": x 254/158 | "Service Inclusive": x 381/285 | "Repair Inclusive": x 523/427 | "I
  - 1440: [image-geometry] 3 images sized differently (preview/live): #5 1248x703/376x212, #6 1248x703/376x212, #7 1248x703/376x212
  - 768: [layout] 64/102 text blocks placed differently: "BMW Repair Inclusive.": x 64/206, w 640/352 | "BMW Service": x 47/-1 | "Proactive Care": x 48/0 | "Service Inclusive": x
  - 390: [layout] 46/100 text blocks placed differently: "BMW Repair Inclusive.": x 32/102 | "Jetzt absichern": x 32/147 | "Flexibel versichern. Flexibel ": x 24/70, w 342/251 | 

### /de/topics/service-zubehoer/bmw-service/rueckrufe
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 85% / 83%
- blocks: hero-teaser, embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [height] preview 3695px vs live 4115px (90%)
  - 1440: [layout] 17/20 text blocks placed differently: "Rückrufaktionen betreffen die ": x 96/308, w 1248/824 | "Die Sicherheit unserer Kunden ": x 96/308, w 1248/824 | "Bitte b
  - 768: [height] preview 3989px vs live 4677px (85%)
  - 768: [layout] 19/20 text blocks placed differently: "Prüfung auf Rückrufe und Techn": x 64/183, w 640/399 | "Rückrufaktionen betreffen die ": x 48/164, w 672/440 | "Die Siche
  - 390: [height] preview 4282px vs live 5130px (83%)
  - 390: [layout] 4/20 text blocks placed differently: "Häufige Kundenfragen zu Rückru": x 24/147 | "Weitere Informationen zum TAKA": x 24/147 | "Häufig gestellte Fragen.": x 24/

### /de/topics/service-zubehoer/financial-services/bmw-financial-services
- status: differences remain; widths: 1440, 768, 390; height ratio: 153% / 119% / 101%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, content-table, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 22782px vs live 14926px (153%)
  - 1440: [typography] 15 runs differ: "Leasing oder Finanzierung": align start/center | "Aktuelle Angebote": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Mehr zum BMW Leasing": color 
  - 1440: [layout] 70/125 text blocks placed differently: "Ihre Vorteile": x 96/0 | "Leasing oder Finanzierung": x 205/109 | "Zusatzangebote": x 419/323 | "Aktuelle Angebote": x 5
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x810/294x196, #3 883x589/294x195, #4 883x589/294x196, #5 883x589/294x196, #6 883x589/294x196
  - 768: [height] preview 22466px vs live 18855px (119%)
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 13 runs differ: "Mehr zum BMW Leasing": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Mehr zur BMW Finanzierung": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Zu d
  - 768: [layout] 67/125 text blocks placed differently: "Genießen Sie mehr Freiheit für": x 64/178, w 640/409 | "Fahrzeuge entdecken": x 179/232 | "Ihre Vorteile": x 48/0 | "Lea
  - 768: [image-geometry] 14 images sized differently (preview/live): #7 672x448/324x216, #9 324x216/672x449, #12 672x448/324x216, #13 672x449/324x215, #14 672x446/536x238
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 13 runs differ: "Mehr zum BMW Leasing": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Mehr zur BMW Finanzierung": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Zu d
  - 390: [layout] 26/122 text blocks placed differently: "Fahrzeuge entdecken": x 32/125 | "Financial Services Login": x 32/116 | "AI-generated content": x 23/687 | "#2 Leasing o
  - 390: [image-geometry] 8 images sized differently (preview/live): #14 342x227/326x145, #15 294x131/342x228, #16 294x131/342x227, #18 342x227/342x343, #20 342x342/390x219

### /de/topics/service-zubehoer/financial-services/bmw-finanzierung
- status: differences remain; widths: 1440, 768, 390; height ratio: 117% / 104% / 96%
- blocks: hero-teaser, content-navigation, icon-teaser, video, columns, content-table, disclaimer, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 16829px vs live 14416px (117%)
  - 1440: [typography] 10 runs differ: "BMW Finanzierung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Mehr erfahren": size 18/15 | "Privatkunden": color rgb(38, 38, 38)/rgb(255, 255,
  - 1440: [layout] 45/97 text blocks placed differently: "BMW Finanzierung": x 96/0 | "Finanzierungsupgrades": x 255/159 | "Aktuelle Angebote": x 447/351 | "Support": x 604/508 | 
  - 1440: [image-geometry] 4 images sized differently (preview/live): #6 1248x833/612x409, #7 1248x828/612x406, #8 1184x526/588x261, #9 1184x526/588x261
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 10 runs differ: "BMW Finanzierung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Mehr erfahren": size 17/14 | "Privatkunden": color rgb(38, 38, 38)/rgb(255, 255,
  - 768: [layout] 38/97 text blocks placed differently: "Es kann so einfach sein. Verwi": x 64/172, w 640/424 | "Fahrzeuge entdecken": x 179/232 | "BMW Finanzierung": x 48/0 | "F
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 9 runs differ: "Mehr erfahren": size 16/14 | "Privatkunden": color rgb(38, 38, 38)/rgb(255, 255, 255) | "Unverbindliches Leasingbeispiel der ": size 16/14 | "Mo
  - 390: [layout] 20/96 text blocks placed differently: "Fahrzeuge entdecken": x 32/125 | "Financial Services Login": x 32/116 | "Optimaler Schutz für jeden Bed": x 86/40 | "Basi
  - 390: [image-geometry] 6 images sized differently (preview/live): #9 294x131/342x228, #12 342x227/342x342, #13 342x342/342x228, #14 342x229/342x342, #15 342x342/342x228

### /de/topics/service-zubehoer/financial-services/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 129% / 94% / 94%
- blocks: hero-teaser, content-navigation, carousel, cards-quicklink, columns, disclaimer, accordion, icon-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 29880px vs live 23109px (129%)
  - 1440: [footer-links] 63 vs 60
  - 1440: [typography] 30 runs differ: "Attraktive Raten für die Nutzung.": align start/center | "Beim Leasing zahlen Sie nicht den ko": size 18/15, align start/center | "Dazu wird im
  - 1440: [layout] 95/166 text blocks placed differently: "Ihre Vorteile": x 96/0 | "BMW Leasing": x 205/109 | "BMW Leasing Upgrades": x 328/232 | "BMW Versicherungen": x 524/428 
  - 1440: [image-geometry] 21 images sized differently (preview/live): #2 1248x832/376x251, #3 1248x832/376x251, #4 1248x832/376x250, #10 1248x833/612x409, #11 1248x828/612x406
  - 768: [footer-links] 63 vs 60
  - 768: [typography] 25 runs differ: "Attraktive Raten für die Nutzung.": align start/center | "Beim Leasing zahlen Sie nicht den ko": size 17/14, align start/center | "Dazu wird im
  - 768: [layout] 91/166 text blocks placed differently: "Der einfachste Weg zu Ihrem BM": x 64/205, w 640/355 | "Attraktive Raten, Laufzeit nac": x 64/172, w 640/424 | "Fahrzeug
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/BMWBANKUrbanM110926:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [footer-links] 63 vs 60
  - 390: [typography] 27 runs differ: "Attraktive Raten für die Nutzung.": align start/center | "Beim Leasing zahlen Sie nicht den ko": size 16/14, align start/center | "Dazu wird im
  - 390: [layout] 46/164 text blocks placed differently: "Fahrzeuge entdecken": x 32/125 | "Financial Services Login": x 32/116 | "Immer das neueste Modell.": x 24/435 | "Sie lie
  - 390: [image-geometry] 14 images sized differently (preview/live): #13 294x131/342x228, #19 342x227/390x390, #20 390x390/390x219, #22 390x219/390x390, #23 390x390/342x228

### /de-de/shop-online/bmw-business-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 94% / 88%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13523px vs live 11357px (119%)
  - 1440: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 1440: [layout] 34/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1179 | "Gewerbekunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unver
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 336x149/1248x416, #8 336x149/506x405, #10 1248x998/506x368, #11 1248x416/376x167
  - 768: [typography] 18 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 768: [layout] 37/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Gewerbekunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 624x277/672x448, #6 624x277/556x445, #7 624x277/672x448, #8 624x277/556x404, #9 672x448/536x238
  - 390: [height] preview 13383px vs live 15138px (88%)
  - 390: [typography] 18 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Elektroautos.": x 24/74, w 119/242 | "26.604,00 €": w 92/294 | "16.524,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 294x131/342x342, #5 294x131/342x274, #6 294x131/342x342, #7 294x131/342x249, #9 342x342/342x228

