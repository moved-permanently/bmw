# Visual parity report — main--bmw--moved-permanently.aem.page vs www.bmw.de

Generated 2026-09-27T22:16:29.257Z (after round 6 (transformer regression reverted; all pages re-captured)). Widths: 1440, 768, 390 px. Machine-readable: `parity-report.json`.

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
| match (all three widths) | 102 |
| differences remain | 117 |
| partially captured | 0 |
| could not capture | 1 |
| not re-captured after the last round (numbers are from the previous round) | 0 |

Remaining issue kinds (page-widths): layout 161, typography 58, missing-text 27, height 21, image-geometry 16, broken-images 12

## Fix rounds
- R0 (home findings): stage poster, teaser spacing variants, grid-width columns detection.
- R1/R2: type styles from source classes, centered intros, content spans, header style per page, block crops/tabs.
- R3: carousel/model-overview tracks (centered-list rule), content-table accordions, all-models chips, columns with
  video/download/reverse, tablet spans, tech-data headings, sitemap.
- R4: crops per breakpoint, default-content images with all crops + AI labels, hero-teaser alignment, content-navigation
  links, colours, small-width sizes, model-offer pricing box, grid rows/tablet spans in the importer.
- R5: tech-data footnotes/default variant, leasing fact lists, accordion expanded items, generic block spacing, price tags,
  light stages, page theme colour runtime, default-content download links.
- R6: content-navigation bar insets, page theme colour metadata, section run regrouping, spacer paragraphs, page-title hiding.

## Genuinely impossible / external gaps
- Live-only personalisation (AEM xftoggle variations, BMW Target/tag-manager content): the replica shows the default variation.
- Services that stay on BMW infrastructure (reached through the deployed bmw-proxy worker where CORS requires it):
  per-model compare tech data, stock-locator vehicles, AI assistant, ePaaS consent. They depend on BMW's upstreams.
- Live Chat (cctapiemea) only works on a bmw.de referer.
- Live defects not reproduced: missing social icons in the live footer on model pages; broken og:image.
- Video autoplay timing/first frames differ between runs (both sites).
- Live pages at 390px have extra space below the footer (live artefact) — heights are compared up to the footer top.
- /de/neufahrzeuge/m/suv/bmw-x5-m-modelle could not be captured on live (the full-page capture exhausted memory twice).

## Per page
| page | status | widths | height preview/live (1440/768/390) | remaining (top) |
|---|---|---|---|---|
| /de/bmw-alpina | differences remain | 1440, 768, 390 | 94% / 87% / 95% | 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"; 1440: [typography] 6 runs differ: "Informiert bleiben": color r |
| /de/bmw-financial-services-overview/bmw-leasing | differences remain | 1440, 768, 390 | 117% / 114% / 104% | 1440: [height] preview 17188px vs live 14630px content height (117%); 1440: [layout] 20/179 text blocks placed differently: "4. Bestellen Sie Ihren BMW.": w 290/221 / "BMW Leasing Care Paket": w 312/232 / "Ratenschutzver |
| /de/bmw-financial-services-overview/form-finder | match | 1440, 768, 390 | 100% / 97% / 99% | – |
| /de/bmw-modelle-vergleichen | match | 1440, 768, 390 | 96% / 95% / 94% | – |
| /de/bmw-service-hub | match | 1440, 768, 390 | 98% / 99% / 99% | – |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen | match | 1440, 768, 390 | 92% / 93% / 96% | – |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen | match | 1440, 768, 390 | 91% / 93% / 95% | – |
| /de/bmw-service-hub/bmw-service/unfall-pannenhilfe | differences remain | 1440, 768, 390 | 111% / 103% / 100% | 1440: [height] preview 10557px vs live 9543px content height (111%); 1440: [layout] 19/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 / "BMW Service": cx 387/291 / "Proactive Care": cx 510/414 / "Se |
| /de/campaigns/bmw-fuer-geschaeftskunden | differences remain | 1440, 768, 390 | 98% / 100% / 99% | 768: [layout] 12/69 text blocks placed differently: "Angebot anfordern": cx 385/133 / "Unverbindliches Leasingbeispie": w 350/616 / "21.564,00 €": w 92/616 / "✔ Leasingsonder |
| /de/campaigns/hvo100-erneuerbarer-diesel | differences remain | 1440, 768, 390 | 95% / 94% / 97% | 1440: [layout] 4/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 / "Ihr BMW Diesel ist bereit für ": w 512/389 / "Hier überprüfen": cx 177/402 /; 768: [layout] 5/31 text blocks placed diffe |
| /de/digital-services/bmw-connecteddrive | match | 1440, 768, 390 | 99% / 99% / 99% | – |
| /de/digital-services/bmw-digital-key | match | 1440, 768, 390 | 98% / 98% / 98% | – |
| /de/digital-services/bmw-entertainment | match | 1440, 768, 390 | 99% / 99% / 97% | – |
| /de/digital-services/bmw-idrive | match | 1440, 768, 390 | 100% / 99% / 99% | – |
| /de/digital-services/bmw-intelligent-personal-assistant | match | 1440, 768, 390 | 97% / 97% / 96% | – |
| /de/digital-services/bmw-maps | match | 1440, 768, 390 | 96% / 95% / 97% | – |
| /de/elektroauto | differences remain | 1440, 768, 390 | 99% / 98% / 97% | 1440: [layout] 12/81 text blocks placed differently: "BMW Elektroautos.": w 512/376 / "Modelle": cx 49/-109 / "Vorteile von Elektroautos": cx 190/32 / "E-Auto Batterie und Tec |
| /de/elektroauto/batterie-technologie | match | 1440, 768, 390 | 99% / 99% / 97% | – |
| /de/elektroauto/bmw-charging-support | differences remain | 1440, 768, 390 | 99% / 99% / 97% | 1440: [layout] 6/23 text blocks placed differently: "BMW Wallbox Professional.": w 466/343 / "BMW Vehicle-to-Load (V2L) Adap": w 466/354 / "BMW Ladekabel Mode 3.": w 466/316 / |
| /de/elektroauto/elektroauto-kosten | match | 1440, 768, 390 | 97% / 97% / 97% | – |
| /de/elektroauto/elektroauto-reichweite | match | 1440, 768, 390 | 100% / 99% / 98% | – |
| /de/elektroauto/elektroautos-vorteile | match | 1440, 768, 390 | 100% / 99% / 98% | – |
| /de/elektroauto/foerderungen | differences remain | 1440, 768, 390 | 93% / 92% / 97% | 1440: [layout] 15/69 text blocks placed differently: "Bruttogehalt: 6.500,00 €": w 175/296 / "+ GWV: 376,77 €": w 117/296 / "- Sozialabgaben: 1.302,25 €": w 194/296 / "- Steue; 768: [layout] 24/69 text blocks placed diff |
| /de/elektroauto/foerderungen-privatkunden | differences remain | 1440, 768, 390 | 90% / 92% / 92% | 1440: [layout] 8/78 text blocks placed differently: "AI-generated content": x -1/1395 / "- Batterieelektrisch (BEV)": w 208/400 / "- Plug-in-Hybrid (PHEV)": w 198/400 / "Elekt; 768: [layout] 8/78 text blocks placed diffe |
| /de/elektroauto/gebrauchte-elektroautos | differences remain | 1440, 768, 390 | 97% / 97% / 97% | 768: [layout] 12/84 text blocks placed differently: "BMW Premium Selection": cx 99/14 / "Vorteile": cx 226/141 / "BMW Modelle": cx 318/233 / "Gebrauchte Batterien": cx 455/37 |
| /de/elektroauto/home-charging | differences remain | 1440, 768, 390 | 97% / 98% / 98% | 768: [layout] 15/113 text blocks placed differently: "Zum Installationspartner": cx 253/300 / "Ladelösungen für Ihr Zuhause": cx 115/-270 / "Ladeprodukte": cx 279/-106 / "700 |
| /de/elektroauto/plug-in-hybrid | differences remain | 1440, 768, 390 | 99% / 98% / 98% | 768: [typography] 5 runs differ: "PHEV Modelle": color rgb(38, 38, 38)/rgb(102, 102, 102) / "PHEV Technologie": color rgb(102, 102, 102)/rgb(38, 38, 38) / "So funktioniert ein Hy; 768: [layout] 12/68 text blocks placed d |
| /de/elektroauto/public-charging | differences remain | 1440, 768, 390 | 127% / 105% / 98% | 1440: [height] preview 16189px vs live 12708px content height (127%); 1440: [layout] 21/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 / "BMW Charging erhält zweimal di": x 772/878 / "Wir  |
| /de/elektroauto/rabatt-auf-die-bmw-wallbox-professional | match | 1440, 768, 390 | 104% / 100% / 100% | – |
| /de/fastlane/dealer-locator | differences remain | 1440, 768, 390 | 100% / 100% / 100% | 1440: [missing-text] 138/516 live text runs not visible on preview: "BMW AG Niederlassung Dresden", "Dohnaer Str. 99-101", "01219 Dresden", "Laugkfeld 28"; 768: [missing-text] 211/512 live text runs not visible on previe |
| /de/footer/footer-section/cookie-policy | differences remain | 1440, 768, 390 | 81% / 100% / 100% | 1440: [height] preview 4666px vs live 5758px content height (81%) |
| /de/footer/metanavigation/bmw-barrierefreiheit | differences remain | 1440, 768, 390 | 92% / 95% / 96% | 1440: [typography] 3 runs differ: "Kaufen": color rgb(28, 105, 212)/rgb(38, 38, 38) / "Tel.: +49 89 1250 16000": size 15/18 / "Nachricht senden": size 15/18; 1440: [layout] 10/51 text blocks placed differently: "Barriere |
| /de/footer/metanavigation/bmw-betrugsfaelle | differences remain | 1440, 768, 390 | 97% / 98% / 98% | 1440: [layout] 5/36 text blocks placed differently: "Was ist Identitätsbetrug?": w 824/312 / "Wie erkenne ich Identitätsbetr": w 824/422 / "Gefälschte Websites und E-Mail": w  |
| /de/footer/metanavigation/data-privacy | match | 1440, 768, 390 | 95% / 94% / 95% | – |
| /de/footer/metanavigation/data-privacy/data-category | match | 1440, 768, 390 | 98% / 98% / 98% | – |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-c | differences remain | 1440, 768, 390 | 95% / 96% / 95% | 1440: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"; 768: [missing-text] 2/6 live text runs not visible on preview: "BMW  |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-d | match | 1440, 768, 390 | 96% / 97% / 98% | – |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-e | match | 1440, 768, 390 | 95% / 96% / 98% | – |
| /de/footer/metanavigation/eu-batterieverordnung | differences remain | 1440, 768, 390 | 86% / 90% / 91% | 1440: [height] preview 505px vs live 585px content height (86%) |
| /de/footer/metanavigation/legal-disclaimer-pool/produktsicherheitsverordnung | match | 1440, 768, 390 | 92% / 92% / 94% | – |
| /de/footer/metanavigation/legal-disclaimer-pool/legal-disclaimer | differences remain | 1440, 768, 390 | 92% / 93% / 95% | 1440: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 1248/321 / "Außergerichtliche Streitbeileg": w 1248/347 / "Anlaufstellen für hinweisgeben": w 124; 768: [layout] 4/22 text blocks placed diffe |
| /de/footer/metanavigation/legal-notice-pool/imprint | match | 1440, 768, 390 | 96% / 92% / 93% | – |
| /de/home | match | 1440, 768, 390 | 99% / 104% / 101% | – |
| /de/konfigurator | match | 1440, 768, 390 | 99% / 100% / 100% | – |
| /de/landingpage/bmw-fahrfreude-gewinnen | match | 1440, 768, 390 | 100% / 100% / 99% | – |
| /de/landingpage/shops | differences remain | 1440, 768, 390 | 96% / 97% / 94% | 1440: [layout] 7/24 text blocks placed differently: "BMW Connected Drive.": w 400/240 / "Zubehör.": x 96/308 / "Im BMW Online Store für Zubehö": x 96/308 / "BMW Zubehör finden |
| /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv | differences remain | 1440, 768, 390 | 91% / 89% / 93% | 768: [height] preview 1158px vs live 1301px content height (89%) |
| /de/mehr-bmw/bmw-gebrauchte | differences remain | 1440, 768, 390 | 84% / 92% / 92% | 1440: [height] preview 1314px vs live 1558px content height (84%); 1440: [typography] 4 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 18/43, color rgb(38, 38, 38)/rgb(255, 255, 255) / "Junge Gebrauchte": color rgb(38,  |
| /de/mehr-bmw/bmw-gebrauchte/europlusgarantie | differences remain | 1440, 768, 390 | 100% / 101% / 98% | 1440: [typography] 3 runs differ: "DAMIT DIE FREUDE DAUERHAFT BLEIBT.": size 23/28 / "Junge Gebrauchte": color rgb(38, 38, 38)/rgb(102, 102, 102) / "BMW Premium Selection Garantie; 768: [typography] 3 runs differ: "DAMIT |
| /de/mehr-bmw/bmw-gebrauchte/garantie | differences remain | 1440, 768, 390 | 98% / 99% / 96% | 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(38, 38, 38)/rgb(255, ; 1440: [layout] 5/31 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte | differences remain | 1440, 768, 390 | 94% / 96% / 96% | 1440: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "Junge Gebrauchte von BMW.": size 43/35 / "Junge Gebrauchte": color rgb(38, 38; 1440: [layout] 6/35 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/premium-selection | differences remain | 1440, 768, 390 | 109% / 183% / 130% | 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."; 1440: [typography] 12 runs differ: "DIE NEUEN |
| /de/mehr-bmw/bmw-individual | differences remain | 1440, 768, 390 | 96% / 97% / 96% | 768: [layout] 11/55 text blocks placed differently: "BMW M3 Competition – BMW Indiv": w 402/672 / "BMW XM 50e – BMW Individual Ja": w 339/672 / "BMW M2 CS – BMW Individual Ve |
| /de/mehr-bmw/bmw-special-sales | differences remain | 1440, 768, 390 | 100% / 100% / 97% | 390: [layout] 4/30 text blocks placed differently: "BMW Einsatzfahrzeuge.": w 342/252 / "BMW Diplomatic Sales.": w 342/243 / "BMW Military Sales.": w 342/208 / "BMW Fahrertra |
| /de/mehr-bmw/bmw-special-sales/bmw-7-protection | match | 1440, 768, 390 | 95% / 98% / 98% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales | match | 1440, 768, 390 | 101% / 100% / 102% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge | differences remain | 1440, 768, 390 | 100% / 98% / 98% | 768: [layout] 14/137 text blocks placed differently: "Maximale Sicherheit.": cx 210/384 / "Erstklassige Kosteneffizienz.": cx 559/385 / "Erhöhte Beladung & verstärkte ": w 50; 390: [layout] 23/135 text blocks placed diff |
| /de/mehr-bmw/bmw-special-sales/bmw-military-sales | match | 1440, 768, 390 | 98% / 97% / 99% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge | match | 1440, 768, 390 | 100% / 98% / 99% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6 | match | 1440, 768, 390 | 99% / 99% / 100% | – |
| /de/mehr-bmw/concept-cars/bmw-speedtop | differences remain | 1440, 768, 390 | 92% / 94% / 92% | 1440: [layout] 7/40 text blocks placed differently: "BMW Speedtop.": w 512/319 / "Limitiertes Sammlerstück": w 512/263 / "Ein emotionales Sammlerstück.": w 376/256 / "Mehr anz; 768: [layout] 8/40 text blocks placed diffe |
| /de/mehr-bmw/die-exklusiven-bmw-automobile | differences remain | 1440, 768, 390 | 97% / 100% / 98% | 1440: [layout] 13/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 / "BMW i7 60 xDrive.": w 512/293 / "Der BMW i7 verbindet sinnliche": w 512/288 |
| /de/mehr-bmw/digital-services-act | differences remain | 1440, 768, 390 | 88% / 91% / 94% | 1440: [height] preview 3650px vs live 4153px content height (88%) |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass | differences remain | 1440, 768, 390 | 95% / 97% / 96% | 1440: [layout] 3/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 / "Fuhrparks intelligent steuern.": w 400/301 / "Fahrfreude neu definiert.": w ; 768: [layout] 4/17 text blocks placed diffe |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister | differences remain | 1440, 768, 390 | 93% / 94% / 94% | 1440: [typography] 4 runs differ: "Startseite Großkunden": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center / "Hol; 1440: [layout] 11/49 text blocks placed |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring | differences remain | 1440, 768, 390 | 96% / 96% / 98% | 768: [layout] 3/20 text blocks placed differently: "Die Evolution des Fahrens.": w 672/246 / "Der Klangmeister – Interview m": w 672/423 / "Umfrage: Welche Themen wollen ": w |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5 | match | 1440, 768, 390 | 98% / 98% / 98% | – |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte | match | 1440, 768, 390 | 99% / 97% / 98% | – |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude | differences remain | 1440, 768, 390 | 101% / 99% / 100% | 1440: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center / "Eine neue Verbindung zum Fahrzeug.": align start/center / "Freude am Fahren, neu in; 768: [typography] 7 runs differ: "Eine  |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement | match | 1440, 768, 390 | 101% / 101% / 99% | – |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt | differences remain | 1440, 768, 390 | 87% / 89% / 89% | 1440: [height] preview 1852px vs live 2120px content height (87%); 768: [height] preview 1903px vs live 2145px content height (89%) |
| /de/mehr-bmw/kundenbetreuung | differences remain | 1440, 768, 390 | 112% / 101% / 115% | 1440: [height] preview 4236px vs live 3773px content height (112%); 390: [height] preview 5289px vs live 4608px content height (115%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball | match | 1440, 768, 390 | 101% / 101% / 99% | – |
| /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park | match | 1440, 768, 390 | 97% / 95% / 93% | – |
| /de/mehr-bmw/sport-und-events/bmw-basketball/innovation | match | 1440, 768, 390 | 101% / 100% / 97% | – |
| /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture | match | 1440, 768, 390 | 100% / 100% / 97% | – |
| /de/mehr-bmw/sport-und-events/bmw-basketball/we-care | match | 1440, 768, 390 | 96% / 95% / 93% | – |
| /de/mehr-bmw/sport-und-events/laufsport | differences remain | 1440, 768, 390 | 93% / 89% / 99% | 768: [height] preview 2507px vs live 2811px content height (89%) |
| /de/mehr-bmw/sport-und-events/sport-und-kultur | match | 1440, 768, 390 | 100% / 100% / 99% | – |
| /de/mehr-bmw/sport-und-events/tennis | match | 1440, 768, 390 | 96% / 92% / 100% | – |
| /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy | match | 1440, 768, 390 | 100% / 98% / 97% | – |
| /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung | match | 1440, 768, 390 | 92% / 94% / 95% | – |
| /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub | differences remain | 1440, 768, 390 | 96% / 98% / 95% | 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/BMW-Accessories-Hub_Spring-Summer-2026_Transportsolutions:3to2?fit=constrain%2C1&wid=2560&fmt=webp&qlt=8 |
| /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile | differences remain | 1440, 768, 390 | 99% / 98% / 106% | 1440: [typography] 4 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 / "Original BMW Classic Teile": align start/center / "Bei Verschleiß, Beschädigung oder De": a; 1440: [layout] 14/77 text blocks placed |
| /de/more-bmw/sport-und-events/bmw-basketball/bmw-park | match | 1440, 768, 390 | 97% / 95% / 93% | – |
| /de/my-bmw-app/my-bmw-app | differences remain | 1440, 768, 390 | 129% / 102% / 95% | 1440: [height] preview 5950px vs live 4621px content height (129%); 1440: [layout] 27/52 text blocks placed differently: "My BMW APP.": w 512/277 / "ALLES AN EINEM ORT – MIT DER M": w 1248/442, ypos 24%/15% / "Fahrzeugst |
| /de/neufahrzeuge | match | 1440, 768, 390 | 99% / 100% / 99% | – |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten | match | 1440, 768, 390 | 101% / 102% / 101% | – |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er | differences remain | 1440, 768, 390 | 97% / 97% / 96% | 1440: [layout] 14/100 text blocks placed differently: "Technische Daten": cx 83/159 / "Angebote": cx 205/281 / "Preisliste": cx 297/373 / "Probefahrt vereinbaren": cx 436/512 ; 768: [layout] 13/101 text blocks placed dif |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer | differences remain | 1440, 768, 390 | 102% / 101% / 97% | 1440: [layout] 14/82 text blocks placed differently: "BMW 220i Active Tourer": cx 205/469 / "Urbaner Athlet.": w 512/240 / "Kraft und Eleganz in Balance.": w 1248/371 / "Das k; 1440: [image-geometry] 6/23 images sized di |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten | match | 1440, 768, 390 | 98% / 98% / 98% | – |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe | differences remain | 1440, 768, 390 | 96% / 96% / 95% | 1440: [layout] 9/76 text blocks placed differently: "Das BMW 2er Coupé.": w 538/338 / "BMW M240i xDrive Coupé": cx 216/440 / "Sportlich bis zum Heck.": w 466/295 / "Mit dem 8-; 1440: [image-geometry] 3/19 images sized di |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten | match | 1440, 768, 390 | 103% / 103% / 101% | – |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe | differences remain | 1440, 768, 390 | 98% / 99% / 98% | 768: [layout] 14/97 text blocks placed differently: "Technische Daten": cx 77/-46 / "Preisliste": cx 186/63 / "Probefahrt vereinbaren": cx 313/190 / "Design": cx 432/309 / "T |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten | match | 1440, 768, 390 | 94% / 94% / 94% | – |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid | differences remain | 1440, 768, 390 | 98% / 98% / 98% | 1440: [layout] 10/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 / "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 11; 768: [layout] 11/86 text blocks placed diff |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten | match | 1440, 768, 390 | 100% / 101% / 100% | – |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine | differences remain | 1440, 768, 390 | 98% / 98% / 98% | 1440: [layout] 8/72 text blocks placed differently: "Die BMW 3er Limousine.": x 832/104, w 512/258 / "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 1153/409 /  |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid | differences remain | 1440, 768, 390 | 98% / 97% / 97% | 1440: [layout] 10/89 text blocks placed differently: "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 1153/409 / "BMW 330e xDrive Touring": cx 215/443 / "Rein el; 768: [layout] 13/89 text blocks placed diff |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid | match | 1440, 768, 390 | 99% / 100% / 99% | – |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten | match | 1440, 768, 390 | 100% / 101% / 100% | – |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring | differences remain | 1440, 768, 390 | 99% / 98% / 98% | 1440: [layout] 11/94 text blocks placed differently: "Der BMW 3er Touring.": x 832/104, w 512/228 / "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 1153/409 / "; 768: [layout] 14/94 text blocks placed diff |
| /de/neufahrzeuge/3er/limousine/bmw-i3-limousine | differences remain | 1440, 768, 390 | 95% / 97% / 95% | 390: [layout] 10/50 text blocks placed differently: "BMW i3 50 xDrive Limousine": x 83/24 / "bis zu 900 km": x 24/138 / "lässt Herzen höher schlagen": x 24/145 / "eine klare, |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten | match | 1440, 768, 390 | 98% / 95% / 98% | – |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio | match | 1440, 768, 390 | 93% / 95% / 95% | – |
| /de/neufahrzeuge/4er/coupe/bmw-4er-coupe | match | 1440, 768, 390 | 97% / 97% / 97% | – |
| /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten | match | 1440, 768, 390 | 98% / 97% / 97% | – |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev | differences remain | 1440, 768, 390 | 96% / 95% / 95% | 1440: [typography] 6 runs differ: "THE NEW": size 18/15, case none/uppercase / "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Design": color rgb(102, 102, 102)/rg; 768: [typography] 6 runs differ: "THE N |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring | differences remain | 1440, 768, 390 | 102% / 99% / 97% | 1440: [layout] 14/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 / "Technische Daten": cx 83/215 / "Preisliste": cx 203/335 / "Probefahrt vereinbaren": c; 768: [layout] 12/73 text blocks placed diff |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten | match | 1440, 768, 390 | 97% / 95% / 98% | – |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick | match | 1440, 768, 390 | 96% / 96% / 97% | – |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten | match | 1440, 768, 390 | 100% / 101% / 100% | – |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick | differences remain | 1440, 768, 390 | 95% / 95% / 95% | 1440: [typography] 4 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Fahrdynamik": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 520i Limousine": si; 1440: [layout] 14/72 text blocks placed |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten | match | 1440, 768, 390 | 98% / 99% / 98% | – |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine | differences remain | 1440, 768, 390 | 95% / 96% / 93% | 1440: [missing-text] 19/163 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "BMW i7", "BMW M760e xDrive"; 1440: [layout] 14/126 text blocks placed differently: "DER NEUE BMW 7er": w 538/383 /  |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten | match | 1440, 768, 390 | 101% / 101% / 100% | – |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine | differences remain | 1440, 768, 390 | 94% / 94% / 90% | 1440: [layout] 17/124 text blocks placed differently: "DER NEUE BMW 7er": w 538/383 / "DIE NEUE BMW i7 LIMOUSINE": w 538/412 / "BMW Individual": x 842/616 / "727 km": cx 405/6; 1440: [image-geometry] 3/17 images sized di |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data | match | 1440, 768, 390 | 99% / 100% / 99% | – |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe | differences remain | 1440, 768, 390 | 96% / 99% / 98% | 1440: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=1024&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applic; 768: [broken-images] 2: https://bmw. |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten | match | 1440, 768, 390 | 100% / 99% / 98% | – |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten | match | 1440, 768, 390 | 101% / 100% / 98% | – |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring | differences remain | 1440, 768, 390 | 98% / 98% / 97% | 768: [layout] 10/95 text blocks placed differently: "BMW i5 eDrive40 Touring": cx 385/193 / "Vollintegriertes Video Streami": w 672/431 / "Immer in der richtigen Spur un": w  |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick | match | 1440, 768, 390 | 96% / 95% / 96% | – |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten | match | 1440, 768, 390 | 99% / 98% / 97% | – |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix | differences remain | 1440, 768, 390 | 100% / 101% / 97% | 1440: [layout] 24/117 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": w 512/349 / "Technische Daten": cx 83/-121 / "Angebote": cx 205/1 / "Preisliste": cx 29 |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten | match | 1440, 768, 390 | 98% / 99% / 98% | – |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1 | differences remain | 1440, 768, 390 | 102% / 99% / 97% | 1440: [layout] 16/113 text blocks placed differently: "BMW iX1 xDrive30": cx 1080/449 / "15.444,00 €": w 100/296 / "16.884,00 €": w 103/296 / "17.604,00 €": w 98/296 / "19.764; 1440: [image-geometry] 4/20 images sized di |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten | match | 1440, 768, 390 | 101% / 102% / 101% | – |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick | differences remain | 1440, 768, 390 | 102% / 98% / 97% | 1440: [layout] 16/112 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": w 512/330 / "BMW iX2 xDrive30": cx 182/449 / "Unverbindliches Leasingbeispie": w 556/37; 768: [layout] 25/112 text blocks placed dif |
| /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse | differences remain | 1440, 768, 390 | 95% / 96% / 95% | 390: [layout] 7/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 342/221 / "Mehr anzeigen": cx 96/195 / "Track Lights": x 382/456 / "Trimaran-Element": x |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten | match | 1440, 768, 390 | 98% / 99% / 98% | – |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe | differences remain | 1440, 768, 390 | 103% / 106% / 101% | 1440: [missing-text] 69/226 live text runs not visible on preview: "Skip to main content", "Kaufen", "E-Mobilität", "Kunden"; 1440: [layout] 26/149 text blocks placed differently: "Modelle": x 96/184 / "Technische Daten" |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine | differences remain | 1440, 768, 390 | 100% / 100% / 100% | 1440: [layout] 26/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 104/183, w 512/372 / "Technische Daten": cx 83/-316 / "Konfigurieren": cx 218/-181 / ; 768: [layout] 21/153 text blocks placed dif |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring | differences remain | 1440, 768, 390 | 98% / 98% / 97% | 1440: [layout] 14/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 104/183, w 512/340 / "BMW M3 Competition Touring mit": cx 296/460 / "390 kW (530 PS), |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio | differences remain | 1440, 768, 390 | 97% / 94% / 96% | 1440: [layout] 16/124 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 104/183, w 512/331 / "BMW M4 Competition Cabrio mit ": cx 296/460 / "Maximale M High-P; 768: [layout] 15/127 text blocks placed dif |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten | match | 1440, 768, 390 | 100% / 98% / 100% | – |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe | differences remain | 1440, 768, 390 | 95% / 98% / 96% | 1440: [layout] 21/150 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 104/183, w 512/331 / "Technische Daten": cx 83/-232 / "Konfigurieren": cx 218/-97 / "Pr |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten | match | 1440, 768, 390 | 101% / 101% / 100% | – |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 97% / 98% / 97% | 1440: [layout] 24/123 text blocks placed differently: "Technische Daten": cx 83/5 / "Leasingbeispiel": cx 227/149 / "Preisliste": cx 340/262 / "Probefahrt vereinbaren": cx 479; 768: [layout] 16/123 text blocks placed dif |
| /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick | differences remain | 1440, 768, 390 | 95% / 95% / 95% | 768: [layout] 15/81 text blocks placed differently: "Technische Daten": cx 77/-217 / "Preisliste": cx 186/-108 / "Probefahrt vereinbaren": cx 313/19 / "Performance": cx 451/1 |
| /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten | match | 1440, 768, 390 | 101% / 99% / 99% | – |
| /de/neufahrzeuge/m/bmw-m-135/bmw-m135 | differences remain | 1440, 768, 390 | 97% / 101% / 96% | 768: [layout] 11/94 text blocks placed differently: "Technische Daten": cx 77/-155 / "Konfigurieren": cx 200/-32 / "Preisliste": cx 295/63 / "Probefahrt vereinbaren": cx 422/ |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive | differences remain | 1440, 768, 390 | 100% / 100% / 100% | 1440: [layout] 14/87 text blocks placed differently: "Technische Daten": cx 83/-27 / "Preisliste": cx 203/93 / "Probefahrt vereinbaren": cx 342/232 / "Performance": cx 493/383; 768: [layout] 15/86 text blocks placed diff |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten | match | 1440, 768, 390 | 100% / 100% / 99% | – |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70 | differences remain | 1440, 768, 390 | 98% / 98% / 99% | 768: [layout] 11/96 text blocks placed differently: "Technische Daten": cx 77/-428 / "Preisliste": cx 186/-319 / "Probefahrt vereinbaren": cx 313/-192 / "Performance": cx 451 |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten | match | 1440, 768, 390 | 101% / 101% / 100% | – |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle | differences remain | 1440, 768, 390 | 95% / 95% / 90% | 1440: [typography] 17 runs differ: "DER NEUE BMW 7er": case uppercase/none / "Beschleunigung 0–100 km/h¹⁰": color rgb(62, 82, 122)/rgb(38, 38, 38) / "Max. Leistung": color rgb(62,; 1440: [layout] 17/148 text blocks place |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten | match | 1440, 768, 390 | 102% / 100% / 100% | – |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 99% / 97% / 97% | 768: [layout] 14/86 text blocks placed differently: "Technische Daten": cx 77/-537 / "Konfigurieren": cx 200/-414 / "Preisliste": cx 295/-319 / "Probefahrt vereinbaren": cx 4 |
| /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 97% / 97% / 96% | 1440: [layout] 11/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 / "BMW M440i xDrive Gran Coupé": cx 1135/440 / "Fahren, wie Sie es  |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten | match | 1440, 768, 390 | 100% / 98% / 96% | – |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine | differences remain | 1440, 768, 390 | 96% / 98% / 96% | 1440: [typography] 12 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M5 Limousine": size; 1440: [layout] 12/114 text blocks place |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten | match | 1440, 768, 390 | 99% / 98% / 96% | – |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring | differences remain | 1440, 768, 390 | 95% / 98% / 95% | 1440: [layout] 23/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 / "Technische Daten": cx 83/-189 / "Auszeichnung": cx 221/-51 / "Konfiguriere |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 97% | 1440: [typography] 5 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none / "Informiert bleiben": case uppercase/none / "Jetzt entdecken": case; 768: [typography] 4 runs differ: "DIE B |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle | could not capture | – | – / – / – | – |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten | match | 1440, 768, 390 | 102% / 101% / 100% | – |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive | differences remain | 1440, 768, 390 | 96% / 96% / 96% | 768: [layout] 13/77 text blocks placed differently: "Der BMW X1 M35i xDrive.": cx 384/433 / "Technische Daten": cx 77/36 / "Preisliste": cx 186/145 / "Design": cx 261/220 / " |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick | differences remain | 1440, 768, 390 | 96% / 96% / 98% | 1440: [layout] 12/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 104/183, w 512/268 / "BMW X2 M35i xDrive": cx 231/440 / "Unverkennbar M.": x 104/208, w 512/2; 768: [layout] 20/92 text blocks placed diff |
| /de/neufahrzeuge/m/x3-m50/bmw-x3-m50 | differences remain | 1440, 768, 390 | 98% / 98% / 96% | 1440: [layout] 14/90 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 104/183, w 512/265 / "BMW X3 M50 xDrive": cx 191/459 / "Unverkennbar M.": w 512/270 / "Charakt; 390: [layout] 10/83 text blocks placed diff |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle | differences remain | 1440, 768, 390 | 97% / 98% / 97% | 768: [layout] 12/113 text blocks placed differently: "Die BMW X6 M Modelle.": cx 384/432 / "M TwinPower Turbo V8-Zylinder-": w 280/208 / "8-Gang Steptronic Sport Getrie": w 2 |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten | match | 1440, 768, 390 | 97% / 97% / 95% | – |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i | differences remain | 1440, 768, 390 | 94% / 96% / 94% | 1440: [typography] 6 runs differ: "BMW X7 M60i xDrive": size 20/15, weight 300/700 / "Preisliste BMW X7 M60i xDrive": align start/center / "Ihr Assistent für entspanntes Reisen": ; 1440: [layout] 20/91 text blocks placed |
| /de/neufahrzeuge/m/xm/bmw-xm-technische-daten | match | 1440, 768, 390 | 99% / 98% / 97% | – |
| /de/neufahrzeuge/m/xm/bmw-xm | differences remain | 1440, 768, 390 | 98% / 98% / 97% | 1440: [typography] 8 runs differ: "Werden Sie Teil des BMW Excellence C": align start/center / "Wir stehen Ihnen mit allen Informati": size 18/15 / "+49 89 1250-16084": size 18/15; 1440: [layout] 43/124 text blocks place |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster | differences remain | 1440, 768, 390 | 100% / 99% / 98% | 1440: [layout] 14/73 text blocks placed differently: "Der BMW Z4 M40i Roadster.": w 538/412 / "BMW Z4 M40i": cx 162/497 / "Sportlich expressiv.": w 512/304 / "Markantes Design; 1440: [image-geometry] 6/25 images sized di |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten | match | 1440, 768, 390 | 98% / 98% / 98% | – |
| /de/neufahrzeuge/x/x2/bmw-x2-technische-daten | match | 1440, 768, 390 | 102% / 101% / 100% | – |
| /de/neufahrzeuge/x/x2/bmw-x2-ueberblick | differences remain | 1440, 768, 390 | 96% / 97% / 99% | 768: [layout] 11/87 text blocks placed differently: "BMW X2 sDrive20i": cx 506/194 / "Intelligente LED-Technologie.": w 672/386 / "Sitzen, fast wie unter freiem ": w 672/483  |
| /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten | match | 1440, 768, 390 | 100% / 100% / 103% | – |
| /de/neufahrzeuge/x/ix3/bmw-ix3 | differences remain | 1440, 768, 390 | 97% / 97% / 93% | 1440: [typography] 13 runs differ: "Max. Reichweite WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) / "Energieverbrauch, kombiniert WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) / "; 768: [missing-text] 13/141 live text ru |
| /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten | match | 1440, 768, 390 | 100% / 101% / 99% | – |
| /de/neufahrzeuge/x/suv/bmw-ix5 | differences remain | 1440, 768, 390 | 96% / 97% / 97% | 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen"; 768: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km" |
| /de/neufahrzeuge/x/suv/bmw-x5-technische-daten | match | 1440, 768, 390 | 101% / 101% / 100% | – |
| /de/neufahrzeuge/x/suv/bmw-x5 | differences remain | 1440, 768, 390 | 94% / 94% / 94% | 1440: [layout] 12/96 text blocks placed differently: "BMW X5": ypos 57%/3% / "Mehr anzeigen": cx 688/928 / "Mehr digitale Highlights": cx 206/720 / "Variabel ohne Kompromisse.; 768: [missing-text] 18/137 live text runs n |
| /de/neufahrzeuge/x/x1/bmw-x1-technische-daten | match | 1440, 768, 390 | 103% / 102% / 101% | – |
| /de/neufahrzeuge/x/x1/bmw-x1 | differences remain | 1440, 768, 390 | 99% / 97% / 97% | 1440: [layout] 14/104 text blocks placed differently: "Die Modelle des BMW X1.": w 538/405 / "BMW X1 xDrive23i": cx 179/476 / "Im Zentrum liegt die große, fa": w 612/294 / "Ei; 1440: [image-geometry] 7/20 images sized di |
| /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten | match | 1440, 768, 390 | 99% / 98% / 97% | – |
| /de/neufahrzeuge/x/x3/bmw-x3-phev | differences remain | 1440, 768, 390 | 101% / 101% / 96% | 1440: [typography] 7 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X3 30e xDrive": size; 1440: [layout] 11/100 text blocks place |
| /de/neufahrzeuge/x/x3/bmw-x3-technische-daten | match | 1440, 768, 390 | 101% / 100% / 99% | – |
| /de/neufahrzeuge/x/x3/bmw-x3 | differences remain | 1440, 768, 390 | 103% / 104% / 104% | 1440: [typography] 7 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X3 20 xDrive": size 20; 768: [layout] 18/116 text blocks placed |
| /de/neufahrzeuge/x/x6/bmw-x6-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/x/x6/bmw-x6 | differences remain | 1440, 768, 390 | 98% / 98% / 96% | 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80; 768: [layout] 9/89 text blocks placed differently: "BMW X6 M60i xDrive":  |
| /de/neufahrzeuge/x/x7/bmw-x7-technische-daten | match | 1440, 768, 390 | 99% / 99% / 98% | – |
| /de/neufahrzeuge/x/x7/bmw-x7 | differences remain | 1440, 768, 390 | 102% / 99% / 96% | 1440: [layout] 29/110 text blocks placed differently: "Der BMW X7.": w 538/207 / "BMW X7 xDrive40i": cx 181/471 / "Imposante Präsenz.": w 512/316 / "Preise und Produktinformat; 1440: [image-geometry] 15/29 images sized d |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster | differences remain | 1440, 768, 390 | 99% / 98% / 97% | 1440: [layout] 12/74 text blocks placed differently: "Der BMW Z4 Roadster.": w 538/363 / "BMW Z4 sDrive30i": cx 182/515 / "Für eine einzigartige Atmosphä": w 612/294 / "Fester; 1440: [image-geometry] 6/26 images sized di |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten | match | 1440, 768, 390 | 101% / 101% / 100% | – |
| /de/publicpools/sitemap/sitemap | differences remain | 1440, 768, 390 | 95% / 95% / 102% | 390: [typography] 6 runs differ: "Kontakt": size 14/19, weight 500/300 / "BMW erleben": size 14/19, weight 500/300 / "Service- & Dienstleistungen": size 14/19, weight 500/300 / " |
| /de/services-and-workshop/allgemeine-versicherungsbedingungen | differences remain | 1440, 768, 390 | 100% / 100% / 100% | 1440: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB f; 768: [typography] 3 runs differ: "Repai |
| /de/shop-online/bmw-angebote | differences remain | 1440, 768, 390 | 96% / 97% / 96% | 1440: [layout] 10/76 text blocks placed differently: "26.604,00 €": w 106/296 / "16.524,00 €": w 99/296 / "17.604,00 €": w 98/296 / "15.444,00 €": w 100/296 / "21.564,00 €": w; 768: [layout] 13/76 text blocks placed diff |
| /de/shop-online/bmw-offers | differences remain | 1440, 768, 390 | 96% / 97% / 96% | 1440: [layout] 10/76 text blocks placed differently: "32.364,00 €": w 103/296 / "17.964,00 €": w 97/296 / "19.764,00 €": w 99/296 / "16.884,00 €": w 103/296 / "22.644,00 €": w; 768: [layout] 13/76 text blocks placed diff |
| /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales | differences remain | 1440, 768, 390 | 99% / 97% / 97% | 768: [layout] 12/65 text blocks placed differently: "Mit der digitalen Business Car": cx 210/384 / "BMW Unfall- und Pannenhilfe.": cx 559/385 / "Im Fall der Fälle bestens abg |
| /de/topics/fascination-bmw/events/quiztaxi2024 | match | 1440, 768, 390 | 100% / 100% / 101% | – |
| /de/topics/fascination-bmw/events/vip-experience | differences remain | 1440, 768, 390 | 100% / 101% / 102% | 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 / "VIP Experience Biathlon auf Sc": w 512/381 / "Shuttle-Service im vollelektri": w 1248/674 |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon | differences remain | 1440, 768, 390 | 103% / 97% / 98% | 768: [layout] 9/59 text blocks placed differently: "Schweden": x 696/738 / "Österreich": x 696/738 / "Frankreich": x 696/738 / "Deutschland": x 696/738 / "Tschechien": x 696/ |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln | differences remain | 1440, 768, 390 | 95% / 96% / 96% | 768: [layout] 7/42 text blocks placed differently: "Österreich": x 696/738 / "Lettland": x 696/738 / "Deutschland": x 696/738 / "Olympische Winterspiele in Ita": x 696/738 /  |
| /de/topics/faszination-bmw/events/bmw-golfsport | differences remain | 1440, 768, 390 | 96% / 96% / 95% | 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 / "BMW International Open.": w 400/262 / "Friends of the Brand.": w 400/218 |
| /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand | match | 1440, 768, 390 | 97% / 98% / 98% | – |
| /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup | match | 1440, 768, 390 | 93% / 95% / 94% | – |
| /de/topics/faszination-bmw/events/kulturelles-engagement | differences remain | 1440, 768, 390 | 96% / 96% / 96% | 1440: [layout] 7/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 / "Zur Kulturbroschüre": cx 405/721 / "Klassische Musik und Jazz.": w 824/428 / "Mod; 768: [layout] 6/36 text blocks placed diffe |
| /de/topics/faszination-bmw/events/wintersport | match | 1440, 768, 390 | 97% / 95% / 98% | – |
| /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal | differences remain | 1440, 768, 390 | 96% / 97% / 98% | 1440: [layout] 4/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 / "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 / "Warum ein Windkanal?": w 824/360 / " |
| /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon | differences remain | 1440, 768, 390 | 77% / 96% / 97% | 1440: [height] preview 1465px vs live 1893px content height (77%); 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 / "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/s |
| /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs | match | 1440, 768, 390 | 93% / 96% / 96% | – |
| /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge | differences remain | 1440, 768, 390 | 99% / 98% / 97% | 768: [layout] 28/111 text blocks placed differently: "Gebietsleiterin": w 113/648 / "Hamburg": w 74/648 / "Mobil: +49 151 60510221": w 194/648 / "E-Mail: Renate.Rodermund@bmw; 390: [layout] 23/111 text blocks placed diff |
| /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales | differences remain | 1440, 768, 390 | 99% / 97% / 97% | 768: [layout] 12/70 text blocks placed differently: "Mit der digitalen Business Car": cx 210/384 / "BMW Unfall- und Pannenhilfe.": cx 559/385 / "Im Fall der Fälle bestens abg |
| /de/topics/faszination-bmw/sport-events/weltcup | match | 1440, 768, 390 | 94% / 95% / 91% | – |
| /de/topics/neuwagen/gewaehrleistung | differences remain | 1440, 768, 390 | 100% / 99% / 99% | 1440: [typography] 9 runs differ: "Erweiterte Batteriegewährleistung": align start/center / "BMW Plug-in-Hybride (Generationen 3.": align start/center / "BMW i3 (I01) Gewährleistu; 1440: [layout] 11/58 text blocks placed |
| /de/topics/service-zubehoer/bmw-security | differences remain | 1440, 768, 390 | 100% / 97% / 97% | 1440: [layout] 5/40 text blocks placed differently: "BMW Security": w 512/278 / "Sie fahren, wir schützen.": w 512/253 / "BMW Partner finden": cx 405/721 / "BMW Security Activ |
| /de/topics/service-zubehoer/bmw-service/repair-inclusive | match | 1440, 768, 390 | 95% / 94% / 94% | – |
| /de/topics/service-zubehoer/bmw-service/rueckrufe | differences remain | 1440, 768, 390 | 92% / 94% / 104% | 390: [layout] 9/20 text blocks placed differently: "Frage: Wo finde ich meine 17-s": x 84/24, w 223/342 / "Die 17-stellige Fahrzeug-Ident": x 84/24, w 223/342 / "My BMW App": |
| /de/topics/service-zubehoer/financial-services/bmw-financial-services | differences remain | 1440, 768, 390 | 107% / 102% / 97% | 1440: [layout] 25/125 text blocks placed differently: "Ihre Vorteile": cx 147/51 / "Leasing oder Finanzierung": cx 308/212 / "Zusatzangebote": cx 486/390 / "Aktuelle Angebote"; 768: [layout] 19/125 text blocks placed dif |
| /de/topics/service-zubehoer/financial-services/bmw-finanzierung | differences remain | 1440, 768, 390 | 109% / 104% / 99% | 1440: [layout] 19/98 text blocks placed differently: "BMW Finanzierung": cx 172/76 / "Finanzierungsupgrades": cx 347/251 / "Aktuelle Angebote": cx 522/426 / "Support": cx 640/; 768: [layout] 15/98 text blocks placed diff |
| /de/topics/service-zubehoer/financial-services/bmw-leasing | differences remain | 1440, 768, 390 | 105% / 89% / 91% | 1440: [layout] 29/167 text blocks placed differently: "Ihre Vorteile": cx 147/51 / "BMW Leasing": cx 263/167 / "BMW Leasing Upgrades": cx 422/326 / "BMW Versicherungen": cx 60; 768: [height] preview 27819px vs live 31265 |
| /de-de/shop-online/bmw-business-offers | differences remain | 1440, 768, 390 | 96% / 97% / 96% | 1440: [layout] 10/76 text blocks placed differently: "26.604,00 €": w 106/296 / "16.524,00 €": w 99/296 / "17.604,00 €": w 98/296 / "15.444,00 €": w 100/296 / "21.564,00 €": w; 768: [layout] 13/76 text blocks placed diff |

## Per page details (fixes applied + remaining)
### /de/bmw-alpina
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 87% / 95%
- blocks: media, scroll-navigation, columns, media-gallery, media-showcase, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R2: crops/ratios per breakpoint; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 1440: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 35/48, case none/uppercase | "GRAND TOURING":
  - 1440: [layout] 6/24 text blocks placed differently: "Informiert bleiben": cx 184/1298 | "Ein neues Kapitel beginnt": w 1248/318 | "Handwerkliche Perfektion prägt": x 732/838 |
  - 768: [height] preview 7315px vs live 8432px content height (87%)
  - 768: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 768: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 29/42, case none/uppercase | "GRAND TOURING":
  - 768: [layout] 9/24 text blocks placed differently: "Informiert bleiben": cx 130/628 | "Ein neues Kapitel beginnt": w 672/289 | "Der Vision BMW ALPINA lädt ein": w 672/266 | "
  - 390: [missing-text] 3/27 live text runs not visible on preview: "elevating", "journeys", "Volume"
  - 390: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 28/35, case none/uppercase | "GRAND TOURING":
  - 390: [layout] 3/24 text blocks placed differently: "Informiert bleiben": cx 195/290 | "Ein neues Kapitel beginnt": w 342/261 | "GRAND TOURING": w 342/212, ypos 43%/36%

### /de/bmw-financial-services-overview/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 117% / 114% / 104%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, content-table, columns, model-card, disclaimer, cards-quicklink, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17188px vs live 14630px content height (117%)
  - 1440: [layout] 20/179 text blocks placed differently: "4. Bestellen Sie Ihren BMW.": w 290/221 | "BMW Leasing Care Paket": w 312/232 | "Ratenschutzversicherung": w 288/204 | "
  - 768: [height] preview 18022px vs live 15832px content height (114%)

### /de/bmw-financial-services-overview/form-finder
- status: match; widths: 1440, 768, 390; height ratio: 100% / 97% / 99%
- blocks: hero-teaser, questionnaire
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: none

### /de/bmw-modelle-vergleichen
- status: match; widths: 1440, 768, 390; height ratio: 96% / 95% / 94%
- blocks: model-compare, hero-teaser
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: none
- notes: compare template/model tree from /de/data/compare-models.json; per-model tech data through the bmw-proxy worker

### /de/bmw-service-hub
- status: match; widths: 1440, 768, 390; height ratio: 98% / 99% / 99%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: none

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen
- status: match; widths: 1440, 768, 390; height ratio: 92% / 93% / 96%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen
- status: match; widths: 1440, 768, 390; height ratio: 91% / 93% / 95%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/bmw-service-hub/bmw-service/unfall-pannenhilfe
- status: differences remain; widths: 1440, 768, 390; height ratio: 111% / 103% / 100%
- blocks: hero-teaser, content-navigation, content-table, tabs, disclaimer, columns, accordion, icon-teaser, download
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R2: tab layout at 768/390; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule
- remaining: 
  - 1440: [height] preview 10557px vs live 9543px content height (111%)
  - 1440: [layout] 19/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 | "BMW Service": cx 387/291 | "Proactive Care": cx 510/414 | "Service Inclusive": cx 644
  - 768: [layout] 15/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 47/-1 | "BMW Service": cx 99/51 | "Proactive Care": cx 212/164 | "Service Inclusive": cx 335/
  - 390: [typography] 5 runs differ: "Die BMW Unfall- und Pannenhilfe.": align start/center | "Seit 1984 immer an Ihrer Seite, wenn": align start/center | "AI-generated content": col

### /de/campaigns/bmw-fuer-geschaeftskunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 100% / 99%
- blocks: hero-teaser, content-navigation, card-list, carousel, columns, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 12/69 text blocks placed differently: "Angebot anfordern": cx 385/133 | "Unverbindliches Leasingbeispie": w 350/616 | "21.564,00 €": w 92/616 | "✔ Leasingsonder

### /de/campaigns/hvo100-erneuerbarer-diesel
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 94% / 97%
- blocks: hero-teaser, text-media-teaser, icon-teaser, accordion, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 4/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 | "Ihr BMW Diesel ist bereit für ": w 512/389 | "Hier überprüfen": cx 177/402 |
  - 768: [layout] 5/31 text blocks placed differently: "Gründe für die Verwendung von ": w 616/464 | "Eine saubere Lösung für Diesel": w 616/449 | "HVO100 ist geruchsneutral und 

### /de/digital-services/bmw-connecteddrive
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, icon-teaser, columns, content-table, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: none

### /de/digital-services/bmw-digital-key
- status: match; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none

### /de/digital-services/bmw-entertainment
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 97%
- blocks: hero-teaser, columns, disclaimer, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/digital-services/bmw-idrive
- status: match; widths: 1440, 768, 390; height ratio: 100% / 99% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, video, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: none

### /de/digital-services/bmw-intelligent-personal-assistant
- status: match; widths: 1440, 768, 390; height ratio: 97% / 97% / 96%
- blocks: hero-teaser, video, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/digital-services/bmw-maps
- status: match; widths: 1440, 768, 390; height ratio: 96% / 95% / 97%
- blocks: hero-teaser, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/elektroauto
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 12/81 text blocks placed differently: "BMW Elektroautos.": w 512/376 | "Modelle": cx 49/-109 | "Vorteile von Elektroautos": cx 190/32 | "E-Auto Batterie und Tec

### /de/elektroauto/batterie-technologie
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, columns, tabs, multi-content-gallery, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: none

### /de/elektroauto/bmw-charging-support
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 97%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 6/23 text blocks placed differently: "BMW Wallbox Professional.": w 466/343 | "BMW Vehicle-to-Load (V2L) Adap": w 466/354 | "BMW Ladekabel Mode 3.": w 466/316 |

### /de/elektroauto/elektroauto-kosten
- status: match; widths: 1440, 768, 390; height ratio: 97% / 97% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: none

### /de/elektroauto/elektroauto-reichweite
- status: match; widths: 1440, 768, 390; height ratio: 100% / 99% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: none

### /de/elektroauto/elektroautos-vorteile
- status: match; widths: 1440, 768, 390; height ratio: 100% / 99% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: none

### /de/elektroauto/foerderungen
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 92% / 97%
- blocks: hero-teaser, icon-teaser, carousel, disclaimer, model-overview, cards-quicklink
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [layout] 15/69 text blocks placed differently: "Bruttogehalt: 6.500,00 €": w 175/296 | "+ GWV: 376,77 €": w 117/296 | "- Sozialabgaben: 1.302,25 €": w 194/296 | "- Steue
  - 768: [layout] 24/69 text blocks placed differently: "Neue Preisobergrenze.": cx 211/385 | "Nutzen Sie ihren Dienstwagen a": cx 210/384 | "Neue Abschreibungsmöglichkeit.": cx 
  - 390: [layout] 13/69 text blocks placed differently: "BMW Modelle": cx 308/211 | "Bruttogehalt: 6.500,00 €": w 161/294 | "+ GWV: 376,77 €": w 110/294 | "- Sozialabgaben: 1.302

### /de/elektroauto/foerderungen-privatkunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 92% / 92%
- blocks: hero-teaser, icon-teaser, columns, model-overview, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [layout] 8/78 text blocks placed differently: "AI-generated content": x -1/1395 | "- Batterieelektrisch (BEV)": w 208/400 | "- Plug-in-Hybrid (PHEV)": w 198/400 | "Elekt
  - 768: [layout] 8/78 text blocks placed differently: "Elektrisch ins Studium.": w 672/257 | "Effizient im Ruhestand.": w 672/262 | "Familienfreundlich im Alltag.": w 672/321 | 

### /de/elektroauto/gebrauchte-elektroautos
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 97%
- blocks: hero-teaser, content-navigation, columns, icon-teaser, model-overview, disclaimer, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [layout] 12/84 text blocks placed differently: "BMW Premium Selection": cx 99/14 | "Vorteile": cx 226/141 | "BMW Modelle": cx 318/233 | "Gebrauchte Batterien": cx 455/37

### /de/elektroauto/home-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, columns, text-media-teaser, download, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 15/113 text blocks placed differently: "Zum Installationspartner": cx 253/300 | "Ladelösungen für Ihr Zuhause": cx 115/-270 | "Ladeprodukte": cx 279/-106 | "700

### /de/elektroauto/plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 768: [typography] 5 runs differ: "PHEV Modelle": color rgb(38, 38, 38)/rgb(102, 102, 102) | "PHEV Technologie": color rgb(102, 102, 102)/rgb(38, 38, 38) | "So funktioniert ein Hy
  - 768: [layout] 12/68 text blocks placed differently: "PHEV Modelle": cx 66/-379 | "PHEV Technologie": cx 195/-250 | "So funktioniert ein Hybrid-Aut": cx 376/-69 | "Die Vorteil

### /de/elektroauto/public-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 127% / 105% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, columns, all-models, video, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: 12/16 chips, series line-height, filter weight, M logo; R0: poster until first frame; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 16189px vs live 12708px content height (127%)
  - 1440: [layout] 21/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 | "BMW Charging erhält zweimal di": x 772/878 | "Wir freuen uns über die Ausze
  - 1440: [image-geometry] 3/16 images sized differently (preview/live): emob_public-charging_bmw-cha 1248x832/400x267, emob_public-charging_mode-3- 1248x832/400x267, emob_public-charging
  - 768: [layout] 18/86 text blocks placed differently: "Lademöglichkeiten": cx 81/-185 | "Ladezeiten im Vergleich": cx 241/-25 | "Ladezubehör": cx 384/118 | "Ladestationen finde

### /de/elektroauto/rabatt-auf-die-bmw-wallbox-professional
- status: match; widths: 1440, 768, 390; height ratio: 104% / 100% / 100%
- blocks: disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/fastlane/dealer-locator
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 100%
- blocks: dealer-locator
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [missing-text] 138/516 live text runs not visible on preview: "BMW AG Niederlassung Dresden", "Dohnaer Str. 99-101", "01219 Dresden", "Laugkfeld 28"
  - 768: [missing-text] 211/512 live text runs not visible on preview: "Zwickauer Str. 275", "08468 Reichenbach", "Pausaer Str. 190", "08525 Plauen"
- notes: dealer list + HERE map load from BMW services; the dealer service CSV now comes from the site sheet /de/data/dealer-services.json

### /de/footer/footer-section/cookie-policy
- status: differences remain; widths: 1440, 768, 390; height ratio: 81% / 100% / 100%
- blocks: cookie-policy
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [height] preview 4666px vs live 5758px content height (81%)

### /de/footer/metanavigation/bmw-barrierefreiheit
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 95% / 96%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 3 runs differ: "Kaufen": color rgb(28, 105, 212)/rgb(38, 38, 38) | "Tel.: +49 89 1250 16000": size 15/18 | "Nachricht senden": size 15/18
  - 1440: [layout] 10/51 text blocks placed differently: "Barrierefreiheit.": w 1248/303 | "Online-Bestellung von Fahrzeug": w 1248/447 | "BMW ConnectedDrive.": w 1248/286 | "Zube
  - 768: [layout] 6/51 text blocks placed differently: "Barrierefreiheit.": w 440/245 | "BMW ConnectedDrive.": w 440/255 | "Zubehör und Services.": w 440/253 | "Online Terminvere
  - 390: [layout] 6/51 text blocks placed differently: "Barrierefreiheit.": w 342/225 | "Online-Bestellung von Fahrzeug": w 342/229 | "BMW ConnectedDrive.": w 342/234 | "Zubehör 

### /de/footer/metanavigation/bmw-betrugsfaelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 98%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 5/36 text blocks placed differently: "Was ist Identitätsbetrug?": w 824/312 | "Wie erkenne ich Identitätsbetr": w 824/422 | "Gefälschte Websites und E-Mail": w 

### /de/footer/metanavigation/data-privacy
- status: match; widths: 1440, 768, 390; height ratio: 95% / 94% / 95%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: none

### /de/footer/metanavigation/data-privacy/data-category
- status: match; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: none

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-c
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 95%
- blocks: columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"
  - 768: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"
  - 390: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-d
- status: match; widths: 1440, 768, 390; height ratio: 96% / 97% / 98%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-e
- status: match; widths: 1440, 768, 390; height ratio: 95% / 96% / 98%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/footer/metanavigation/eu-batterieverordnung
- status: differences remain; widths: 1440, 768, 390; height ratio: 86% / 90% / 91%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [height] preview 505px vs live 585px content height (86%)

### /de/footer/metanavigation/legal-disclaimer-pool/produktsicherheitsverordnung
- status: match; widths: 1440, 768, 390; height ratio: 92% / 92% / 94%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/footer/metanavigation/legal-disclaimer-pool/legal-disclaimer
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 93% / 95%
- blocks: disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 1248/321 | "Außergerichtliche Streitbeileg": w 1248/347 | "Anlaufstellen für hinweisgeben": w 124
  - 768: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 672/266 | "Außergerichtliche Streitbeileg": w 672/310 | "Anlaufstellen für hinweisgeben": w 672/4

### /de/footer/metanavigation/legal-notice-pool/imprint
- status: match; widths: 1440, 768, 390; height ratio: 96% / 92% / 93%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: none

### /de/home
- status: match; widths: 1440, 768, 390; height ratio: 99% / 104% / 101%
- blocks: hero-stage, disclaimer, cards-quicklink, hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/konfigurator
- status: match; widths: 1440, 768, 390; height ratio: 99% / 100% / 100%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: none

### /de/landingpage/bmw-fahrfreude-gewinnen
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 99%
- blocks: hero-teaser, disclaimer, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/landingpage/shops
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 94%
- blocks: columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 7/24 text blocks placed differently: "BMW Connected Drive.": w 400/240 | "Zubehör.": x 96/308 | "Im BMW Online Store für Zubehö": x 96/308 | "BMW Zubehör finden

### /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv
- status: differences remain; widths: 1440, 768, 390; height ratio: 91% / 89% / 93%
- blocks: hero-teaser, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 768: [height] preview 1158px vs live 1301px content height (89%)

### /de/mehr-bmw/bmw-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 84% / 92% / 92%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 1314px vs live 1558px content height (84%)
  - 1440: [typography] 4 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 18/43, color rgb(38, 38, 38)/rgb(255, 255, 255) | "Junge Gebrauchte": color rgb(38, 38, 38)/rgb(102, 102, 102)
  - 768: [typography] 4 runs differ: "BMW GEBRAUCHTE AUTOMOBILE.": size 14/35, color rgb(38, 38, 38)/rgb(255, 255, 255), align start/center | "Junge Gebrauchte": color rgb(38, 38, 38
  - 390: [layout] 6/14 text blocks placed differently: "BMW GEBRAUCHTE AUTOMOBILE.": cx 24/195, ypos 19%/9% | "AI-generated content": x 23/329 | "BMW JUNGE GEBRAUCHTE": w 342/251

### /de/mehr-bmw/bmw-gebrauchte/europlusgarantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 98%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "DAMIT DIE FREUDE DAUERHAFT BLEIBT.": size 23/28 | "Junge Gebrauchte": color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW Premium Selection Garantie
  - 768: [typography] 3 runs differ: "DAMIT DIE FREUDE DAUERHAFT BLEIBT.": size 20/25 | "Junge Gebrauchte": color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW Premium Selection Garantie

### /de/mehr-bmw/bmw-gebrauchte/garantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 96%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(38, 38, 38)/rgb(255, 
  - 1440: [layout] 5/31 text blocks placed differently: "AI-generated content": x -1/1395 | "BMW PREMIUM SELECTION GARANTIE": x 738/104, ypos 17%/9% | "DIE NEUEN GEBRAUCHTEN.": w 
  - 768: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 14/35, color rgb(38, 38, 38)/rgb(255, 
  - 390: [missing-text] 3/31 live text runs not visible on preview: "Junge Gebrauchte", "Premium Selection Garantie", "die Premium Selection Servicestelle"
  - 390: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 14/33, color rgb(77, 77, 77)/rgb(255, 

### /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 96%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 43/35 | "Junge Gebrauchte": color rgb(38, 38
  - 1440: [layout] 6/35 text blocks placed differently: "AI-generated content": x -1/1395 | "Preisvorteil sichern": w 1248/297 | "Folgende Kriterien gelten für ": w 1248/624 | "BM
  - 768: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 35/29 | "Junge Gebrauchte": color rgb(38, 38
  - 768: [layout] 4/35 text blocks placed differently: "Fahrzeug finden": cx 385/301 | "Preisvorteil sichern": w 672/248 | "BMW Service Inclusive.": w 672/210 | "BMW Junge Gebrau

### /de/mehr-bmw/bmw-gebrauchte/premium-selection
- status: differences remain; widths: 1440, 768, 390; height ratio: 109% / 183% / 130%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 1440: [typography] 12 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 23/28 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 1440: [layout] 4/20 text blocks placed differently: "BMW PREMIUM SELECTION.": w 512/323 | "DIE NEUEN GEBRAUCHTEN.": w 512/380 | "STANDARDS HABEN WIR AUCH. NUR ": w 1248/897 | 
  - 768: [height] preview 5709px vs live 3114px content height (183%)
  - 768: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 768: [typography] 12 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 20/25 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 390: [height] preview 4929px vs live 3801px content height (130%)
  - 390: [missing-text] 4/21 live text runs not visible on preview: "Junge Gebrauchte", "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE /
  - 390: [typography] 11 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 19/23 | "Ein Fahrzeug, auf das Sie sich verla": align start/center | "BMW Premium Selection Fahrzeuge erha": alig

### /de/mehr-bmw/bmw-individual
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 96%
- blocks: hero-teaser, content-navigation, columns, disclaimer, carousel, media-showcase
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [layout] 11/55 text blocks placed differently: "BMW M3 Competition – BMW Indiv": w 402/672 | "BMW XM 50e – BMW Individual Ja": w 339/672 | "BMW M2 CS – BMW Individual Ve

### /de/mehr-bmw/bmw-special-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 97%
- blocks: hero-teaser, content-navigation, columns, carousel, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 390: [layout] 4/30 text blocks placed differently: "BMW Einsatzfahrzeuge.": w 342/252 | "BMW Diplomatic Sales.": w 342/243 | "BMW Military Sales.": w 342/208 | "BMW Fahrertra

### /de/mehr-bmw/bmw-special-sales/bmw-7-protection
- status: match; widths: 1440, 768, 390; height ratio: 95% / 98% / 98%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, video, tabs, multi-content-gallery, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales
- status: match; widths: 1440, 768, 390; height ratio: 101% / 100% / 102%
- blocks: hero-teaser, disclaimer, content-navigation, columns, icon-teaser, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 98% / 98%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, multi-content-gallery
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: card title sizes, large-titles option
- remaining: 
  - 768: [layout] 14/137 text blocks placed differently: "Maximale Sicherheit.": cx 210/384 | "Erstklassige Kosteneffizienz.": cx 559/385 | "Erhöhte Beladung & verstärkte ": w 50
  - 390: [layout] 23/135 text blocks placed differently: "Doppelfunkbetriebe": x 646/771 | "Dachbalkensystem.": x 944/992 | "Ab Werk bietet BMW hochwertige": x 944/992 | "hochwer

### /de/mehr-bmw/bmw-special-sales/bmw-military-sales
- status: match; widths: 1440, 768, 390; height ratio: 98% / 97% / 99%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge
- status: match; widths: 1440, 768, 390; height ratio: 100% / 98% / 99%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, disclaimer, columns, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: tablet width from source grid
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 100%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, video, multi-content-gallery, carousel, tabs, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: tablet width from source grid
- remaining: none

### /de/mehr-bmw/concept-cars/bmw-speedtop
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 94% / 92%
- blocks: hero-teaser, text-media-teaser, carousel, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 7/40 text blocks placed differently: "BMW Speedtop.": w 512/319 | "Limitiertes Sammlerstück": w 512/263 | "Ein emotionales Sammlerstück.": w 376/256 | "Mehr anz
  - 768: [layout] 8/40 text blocks placed differently: "Ein emotionales Sammlerstück.": w 616/418 | "Mehr anzeigen": cx 148/384 | "Adrian van Hooydonk, Leiter BM": cx 237/384 | "
  - 390: [layout] 5/40 text blocks placed differently: "Ein emotionales Sammlerstück.": w 342/203 | "Mehr anzeigen": cx 96/195 | "Exterieur Highlight Mittelsteg": w 326/233 | "Tr

### /de/mehr-bmw/die-exklusiven-bmw-automobile
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 100% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, model-overview, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 13/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 | "BMW i7 60 xDrive.": w 512/293 | "Der BMW i7 verbindet sinnliche": w 512/288

### /de/mehr-bmw/digital-services-act
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 91% / 94%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 3650px vs live 4153px content height (88%)

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 97% / 96%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 | "Fuhrparks intelligent steuern.": w 400/301 | "Fahrfreude neu definiert.": w 
  - 768: [layout] 4/17 text blocks placed differently: "Fuhrparks intelligent steuern.": w 672/267 | "Fahrfreude neu definiert.": w 672/225 | "Meilensteine einer Erfolgsgesc": w 

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 94% / 94%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 4 runs differ: "Startseite Großkunden": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center | "Hol
  - 1440: [layout] 11/49 text blocks placed differently: "Interview mit Renzo Vitale.": x 832/1058, w 512/274 | "Stand 2024": x 96/0 | "Startseite Großkunden": cx 329/233 | "Onlin
  - 768: [typography] 3 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 17/25, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige
  - 768: [layout] 10/49 text blocks placed differently: "Stand 2024": x 47/-1 | "Startseite Großkunden": cx 129/81 | "Online-Magazin": cx 276/228 | "Ein BMW muss nicht brüllen, u
  - 390: [typography] 3 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 16/23, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 98%
- blocks: hero-teaser, link-list, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [layout] 3/20 text blocks placed differently: "Die Evolution des Fahrens.": w 672/246 | "Der Klangmeister – Interview m": w 672/423 | "Umfrage: Welche Themen wollen ": w

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5
- status: match; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte
- status: match; widths: 1440, 768, 390; height ratio: 99% / 97% / 98%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 99% / 100%
- blocks: hero-teaser, content-navigation, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbindung zum Fahrzeug.": align start/center | "Freude am Fahren, neu in
  - 768: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbindung zum Fahrzeug.": align start/center | "Freude am Fahren, neu in
  - 390: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbindung zum Fahrzeug.": align start/center | "Freude am Fahren, neu in

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 99%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt
- status: differences remain; widths: 1440, 768, 390; height ratio: 87% / 89% / 89%
- blocks: hero-teaser, embed, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 1852px vs live 2120px content height (87%)
  - 768: [height] preview 1903px vs live 2145px content height (89%)
  - 390: [height] preview 2252px vs live 2522px content height (89%)

### /de/mehr-bmw/kundenbetreuung
- status: differences remain; widths: 1440, 768, 390; height ratio: 112% / 101% / 115%
- blocks: hero-teaser, ai-entry, flexbox, accordion, columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 4236px vs live 3773px content height (112%)
  - 390: [height] preview 5289px vs live 4608px content height (115%)
  - 390: [typography] 4 runs differ: "Wie können wir helfen?": size 33/28 | "Sie haben weitere Fragen?": align start/center | "Smart verbunden mit Ihrem BMW.": align start/center | "

### /de/mehr-bmw/sport-und-events/bmw-basketball
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 99%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park
- status: match; widths: 1440, 768, 390; height ratio: 97% / 95% / 93%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/sport-und-events/bmw-basketball/innovation
- status: match; widths: 1440, 768, 390; height ratio: 101% / 100% / 97%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 97%
- blocks: hero-teaser, link-list, carousel, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame
- remaining: none

### /de/mehr-bmw/sport-und-events/bmw-basketball/we-care
- status: match; widths: 1440, 768, 390; height ratio: 96% / 95% / 93%
- blocks: hero-teaser, link-list, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: none

### /de/mehr-bmw/sport-und-events/laufsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 89% / 99%
- blocks: hero-teaser, media, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [height] preview 2507px vs live 2811px content height (89%)

### /de/mehr-bmw/sport-und-events/sport-und-kultur
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 99%
- blocks: hero-teaser, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/sport-und-events/tennis
- status: match; widths: 1440, 768, 390; height ratio: 96% / 92% / 100%
- blocks: hero-teaser, media, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy
- status: match; widths: 1440, 768, 390; height ratio: 100% / 98% / 97%
- blocks: hero-stage, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung
- status: match; widths: 1440, 768, 390; height ratio: 92% / 94% / 95%
- blocks: hero-teaser, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: none

### /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 98% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/BMW-Accessories-Hub_Spring-Summer-2026_Transportsolutions:3to2?fit=constrain%2C1&wid=2560&fmt=webp&qlt=8

### /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 106%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 4 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 | "Original BMW Classic Teile": align start/center | "Bei Verschleiß, Beschädigung oder De": a
  - 1440: [layout] 14/77 text blocks placed differently: "ORIGINAL BMW TEILE.": w 616/464 | "Wiederaufbereitete Teile": cx 406/310 | "Wiederaufbereitung": cx 588/492 | "Original B
  - 768: [layout] 12/77 text blocks placed differently: "Wiederaufbereitete Teile": cx 329/281 | "Wiederaufbereitung": cx 493/445 | "Original BMW Classic Teile": cx 663/615 | "BM
  - 390: [typography] 8 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 19/23 | "Geprüfte BMW Qualität.": align start/center | "Attraktives Preis-Leistungs-Verhältn": align
  - 390: [layout] 10/73 text blocks placed differently: "NEU UND GENAU FÜR IHREN BMW.": ypos 25%/16% | "ES MUSS NICHT IMMER NEU SEIN.": ypos 37%/28% | "IN 5 SCHRITTEN ZU NEUER QU

### /de/more-bmw/sport-und-events/bmw-basketball/bmw-park
- status: match; widths: 1440, 768, 390; height ratio: 97% / 95% / 93%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/my-bmw-app/my-bmw-app
- status: differences remain; widths: 1440, 768, 390; height ratio: 129% / 102% / 95%
- blocks: hero-teaser, icon-teaser, media, tabs, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R2: crops/ratios per breakpoint; R2: tab layout at 768/390; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 5950px vs live 4621px content height (129%)
  - 1440: [layout] 27/52 text blocks placed differently: "My BMW APP.": w 512/277 | "ALLES AN EINEM ORT – MIT DER M": w 1248/442, ypos 24%/15% | "Fahrzeugstatus / Ladestatus ch": 
  - 1440: [image-geometry] 3/8 images sized differently (preview/live): 4.1-all-good_0009_ios6_de_te 1248x833/718x479, visual_app_seite_(1400x800_p 1248x693/718x410, reference_image 1248x
  - 768: [layout] 9/52 text blocks placed differently: "Fahrzeugstatus / Ladestatus ch": x 252/80 | "Digital Key: Fahrzeug verriege": x 184/79 | "Vorklimatisieren und Vorheizen":

### /de/neufahrzeuge
- status: match; widths: 1440, 768, 390; height ratio: 99% / 100% / 99%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: none

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 102% / 101%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/100 text blocks placed differently: "Technische Daten": cx 83/159 | "Angebote": cx 205/281 | "Preisliste": cx 297/373 | "Probefahrt vereinbaren": cx 436/512 
  - 768: [layout] 13/101 text blocks placed differently: "Technische Daten": cx 77/-133 | "Angebote": cx 189/-21 | "Preisliste": cx 273/63 | "Probefahrt vereinbaren": cx 400/190 

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 101% / 97%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/82 text blocks placed differently: "BMW 220i Active Tourer": cx 205/469 | "Urbaner Athlet.": w 512/240 | "Kraft und Eleganz in Balance.": w 1248/371 | "Das k
  - 1440: [image-geometry] 6/23 images sized differently (preview/live): u06_exterior_rear-design 1248x830/718x478, u06_plug-in-hybrid_phev 612x408/294x196, u06_plug-in-hybrid_home-char 6
  - 768: [layout] 15/84 text blocks placed differently: "Technische Daten": cx 77/36 | "Preisliste": cx 186/145 | "Probefahrt vereinbaren": cx 313/272 | "Design": cx 432/391 | "P

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 95%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 9/76 text blocks placed differently: "Das BMW 2er Coupé.": w 538/338 | "BMW M240i xDrive Coupé": cx 216/440 | "Sportlich bis zum Heck.": w 466/295 | "Mit dem 8-
  - 1440: [image-geometry] 3/19 images sized differently (preview/live): g42_dynamics_steptronic-tran 400x267/294x195, g42_dynamics_adaptive-m-susp 400x267/294x196, g42_dynamics_twinpower
  - 768: [layout] 10/77 text blocks placed differently: "BMW M240i xDrive Coupé": cx 384/184 | "Breite Spur. Scharfe Reaktion.": w 648/391 | "Sportlich bis zum Heck.": w 672/264 
  - 390: [layout] 10/71 text blocks placed differently: "BMW M240i xDrive Coupé": cx 196/48 | "Sportlich bis zum Heck.": w 342/242 | "Leichter Parken durch mehr Kam": x 347/227 |

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 103% / 103% / 101%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 14/97 text blocks placed differently: "Technische Daten": cx 77/-46 | "Preisliste": cx 186/63 | "Probefahrt vereinbaren": cx 313/190 | "Design": cx 432/309 | "T
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 94% / 94% / 94%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 11
  - 768: [layout] 11/86 text blocks placed differently: "Technische Daten": cx 77/-46 | "Preisliste": cx 186/63 | "Probefahrt vereinbaren": cx 313/190 | "Design": cx 432/309 | "T

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 101% / 100%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-teaser, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 8/72 text blocks placed differently: "Die BMW 3er Limousine.": x 832/104, w 512/258 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | 

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 97% / 97%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/89 text blocks placed differently: "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | "BMW 330e xDrive Touring": cx 215/443 | "Rein el
  - 768: [layout] 13/89 text blocks placed differently: "Technische Daten": cx 77/-46 | "Preisliste": cx 186/63 | "Probefahrt vereinbaren": cx 313/190 | "Design": cx 432/309 | "T

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid
- status: match; widths: 1440, 768, 390; height ratio: 99% / 100% / 99%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 101% / 100%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 11/94 text blocks placed differently: "Der BMW 3er Touring.": x 832/104, w 512/228 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | "
  - 768: [layout] 14/94 text blocks placed differently: "Technische Daten": cx 77/-133 | "Angebote": cx 189/-21 | "Preisliste": cx 273/63 | "Probefahrt vereinbaren": cx 400/190 |

### /de/neufahrzeuge/3er/limousine/bmw-i3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 97% / 95%
- blocks: hero-stage, disclaimer, text-media-teaser, color-switch, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: tablet width from source grid
- remaining: 
  - 390: [layout] 10/50 text blocks placed differently: "BMW i3 50 xDrive Limousine": x 83/24 | "bis zu 900 km": x 24/138 | "lässt Herzen höher schlagen": x 24/145 | "eine klare,

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 95% / 98%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio
- status: match; widths: 1440, 768, 390; height ratio: 93% / 95% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/4er/coupe/bmw-4er-coupe
- status: match; widths: 1440, 768, 390; height ratio: 97% / 97% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none

### /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 97% / 97%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 6 runs differ: "THE NEW": size 18/15, case none/uppercase | "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Design": color rgb(102, 102, 102)/rg
  - 768: [typography] 6 runs differ: "THE NEW": size 17/14, case none/uppercase | "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Preisliste": color rgb(102, 102, 102
  - 390: [typography] 5 runs differ: "THE NEW": size 16/14, case none/uppercase | "BMW 530e Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Technisc

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 99% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 | "Technische Daten": cx 83/215 | "Preisliste": cx 203/335 | "Probefahrt vereinbaren": c
  - 768: [layout] 12/73 text blocks placed differently: "Technische Daten": cx 77/-16 | "Preisliste": cx 186/93 | "Probefahrt vereinbaren": cx 313/220 | "Design": cx 432/339 | "F
  - 390: [image-geometry] 2/13 images sized differently (preview/live): g61_ice_touring_driving-dyna 390x219/390x150, g61_ice_touring_driving-dyna 390x219/390x150

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 97% / 95% / 98%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick
- status: match; widths: 1440, 768, 390; height ratio: 96% / 96% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 101% / 100%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 4 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Fahrdynamik": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 520i Limousine": si
  - 1440: [layout] 14/72 text blocks placed differently: "Die BMW 5er Limousine.": w 512/258 | "Technische Daten": cx 83/178 | "Preisliste": cx 203/298 | "Probefahrt vereinbaren":
  - 768: [layout] 13/72 text blocks placed differently: "Technische Daten": cx 77/-46 | "Preisliste": cx 186/63 | "Probefahrt vereinbaren": cx 313/190 | "Fahrdynamik": cx 452/329

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 93%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 19/163 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "BMW i7", "BMW M760e xDrive"
  - 1440: [layout] 14/126 text blocks placed differently: "DER NEUE BMW 7er": w 538/383 | "Mehr anzeigen": cx 688/928 | "Autobahnassistent.": w 336/245 | "Parking Assistant Profes
  - 1440: [image-geometry] 3/15 images sized differently (preview/live): road-1 400x267/270x180, room 400x267/270x180, women 400x267/270x180
  - 768: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"
  - 390: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 100%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 94% / 90%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 17/124 text blocks placed differently: "DER NEUE BMW 7er": w 538/383 | "DIE NEUE BMW i7 LIMOUSINE": w 538/412 | "BMW Individual": x 842/616 | "727 km": cx 405/6
  - 1440: [image-geometry] 3/17 images sized differently (preview/live): road-1 400x267/270x180, room 400x267/270x180, women 400x267/270x180

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data
- status: match; widths: 1440, 768, 390; height ratio: 99% / 100% / 99%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 99% / 98%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, disclaimer, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=1024&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applic
  - 768: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=768&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applica
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 99% / 98%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 100% / 98%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 10/95 text blocks placed differently: "BMW i5 eDrive40 Touring": cx 385/193 | "Vollintegriertes Video Streami": w 672/431 | "Immer in der richtigen Spur un": w 

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick
- status: match; widths: 1440, 768, 390; height ratio: 96% / 95% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: none

### /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/ix/bmw-ix
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, car-kpis, drivetrain-switch, preview-slider, model-offer, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 24/117 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": w 512/349 | "Technische Daten": cx 83/-121 | "Angebote": cx 205/1 | "Preisliste": cx 29
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 99% / 97%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, carousel, hero-teaser, columns, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 16/113 text blocks placed differently: "BMW iX1 xDrive30": cx 1080/449 | "15.444,00 €": w 100/296 | "16.884,00 €": w 103/296 | "17.604,00 €": w 98/296 | "19.764
  - 1440: [image-geometry] 4/20 images sized differently (preview/live): u11_bmw_cherifa_3000x3000 1248x829/718x477, u11-bev_teaser_home-charging 400x267/294x196, u11-bev_teaser_plug-and-
  - 768: [layout] 17/114 text blocks placed differently: "BMW iX1 xDrive30": cx 1567/193 | "15.444,00 €": w 92/616 | "16.884,00 €": w 97/616 | "17.604,00 €": w 91/616 | "19.764,0

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 102% / 101%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 98% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 16/112 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": w 512/330 | "BMW iX2 xDrive30": cx 182/449 | "Unverbindliches Leasingbeispie": w 556/37
  - 768: [layout] 25/112 text blocks placed differently: "Technische Daten": cx 77/-133 | "Angebote": cx 189/-21 | "Preisliste": cx 273/63 | "Probefahrt vereinbaren": cx 400/190 

### /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 95%
- blocks: hero-stage, text-media-teaser, video, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 390: [layout] 7/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 342/221 | "Mehr anzeigen": cx 96/195 | "Track Lights": x 382/456 | "Trimaran-Element": x

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 106% / 101%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, columns, hero-teaser, carousel, video, tabs, multi-content-gallery, text-media-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 1440: [missing-text] 69/226 live text runs not visible on preview: "Skip to main content", "Kaufen", "E-Mobilität", "Kunden"
  - 1440: [layout] 26/149 text blocks placed differently: "Modelle": x 96/184 | "Technische Daten": cx 83/167 | "Konfigurieren": cx 218/302 | "Preisliste": cx 323/407 | "BMW M2 mi
  - 768: [missing-text] 67/224 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K
  - 768: [layout] 20/150 text blocks placed differently: "Die BMW 2er Coupé M Modelle.": cx 384/433 | "Technische Daten": cx 77/-37 | "Konfigurieren": cx 200/86 | "Preisliste": c
  - 390: [missing-text] 67/218 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 100%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, carousel, tabs, multi-content-gallery, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 26/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 104/183, w 512/372 | "Technische Daten": cx 83/-316 | "Konfigurieren": cx 218/-181 | 
  - 768: [layout] 21/153 text blocks placed differently: "Technische Daten": cx 77/-155 | "Konfigurieren": cx 200/-32 | "Preisliste": cx 295/63 | "Probefahrt vereinbaren": cx 422
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 104/183, w 512/340 | "BMW M3 Competition Touring mit": cx 296/460 | "390 kW (530 PS),
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 94% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 16/124 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 104/183, w 512/331 | "BMW M4 Competition Cabrio mit ": cx 296/460 | "Maximale M High-P
  - 768: [layout] 15/127 text blocks placed differently: "Technische Daten": cx 77/-326 | "Konfigurieren": cx 200/-203 | "Preisliste": cx 295/-108 | "Probefahrt vereinbaren": cx 
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 98% / 100%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 98% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 21/150 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 104/183, w 512/331 | "Technische Daten": cx 83/-232 | "Konfigurieren": cx 218/-97 | "Pr
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 100%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, carousel, preview-slider, columns, video, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 24/123 text blocks placed differently: "Technische Daten": cx 83/5 | "Leasingbeispiel": cx 227/149 | "Preisliste": cx 340/262 | "Probefahrt vereinbaren": cx 479
  - 768: [layout] 16/123 text blocks placed differently: "Technische Daten": cx 77/36 | "Leasingbeispiel": cx 207/166 | "Preisliste": cx 309/268 | "Probefahrt vereinbaren": cx 43
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 15/81 text blocks placed differently: "Technische Daten": cx 77/-217 | "Preisliste": cx 186/-108 | "Probefahrt vereinbaren": cx 313/19 | "Performance": cx 451/1

### /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 99% / 99%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/bmw-m-135/bmw-m135
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 101% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 11/94 text blocks placed differently: "Technische Daten": cx 77/-155 | "Konfigurieren": cx 200/-32 | "Preisliste": cx 295/63 | "Probefahrt vereinbaren": cx 422/
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 100%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/87 text blocks placed differently: "Technische Daten": cx 83/-27 | "Preisliste": cx 203/93 | "Probefahrt vereinbaren": cx 342/232 | "Performance": cx 493/383
  - 768: [layout] 15/86 text blocks placed differently: "BMW i5 M60 xDrive Touring": cx 385/188 | "Grosszügig in Leistung und Pla": w 648/442 | "Auch in der Nacht unverwechsel": 
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 99%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 11/96 text blocks placed differently: "Technische Daten": cx 77/-428 | "Preisliste": cx 186/-319 | "Probefahrt vereinbaren": cx 313/-192 | "Performance": cx 451
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 100%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 90%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, text-media-teaser, media-showcase, color-switch, model-overview, media, powertrain-selector, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 17 runs differ: "DER NEUE BMW 7er": case uppercase/none | "Beschleunigung 0–100 km/h¹⁰": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Max. Leistung": color rgb(62,
  - 1440: [layout] 17/148 text blocks placed differently: "DER NEUE BMW 7er": w 538/383 | "DIE BMW 7er M MODELLE": w 538/350 | "500 kW (680 PS)": x 336/616 | "Integral-Aktivlenkun
  - 768: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 768: [typography] 17 runs differ: "DER NEUE BMW 7er": case uppercase/none | "Beschleunigung 0–100 km/h¹⁰": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Max. Leistung": color rgb(62,
  - 768: [layout] 15/148 text blocks placed differently: "500 kW (680 PS)": x 80/527 | "BMW Individual": x 563/417 | "Mehr anzeigen": cx 148/384 | "BMW M760e xDrive Limousine.": 
  - 390: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 390: [typography] 17 runs differ: "DER NEUE BMW 7er": case uppercase/none | "Beschleunigung 0–100 km/h¹⁰": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Max. Leistung": color rgb(62,

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 102% / 100% / 100%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 97% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 14/86 text blocks placed differently: "Technische Daten": cx 77/-537 | "Konfigurieren": cx 200/-414 | "Preisliste": cx 295/-319 | "Probefahrt vereinbaren": cx 4

### /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 11/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 | "BMW M440i xDrive Gran Coupé": cx 1135/440 | "Fahren, wie Sie es 
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 98% / 96%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 98% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 12 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": size
  - 1440: [layout] 12/114 text blocks placed differently: "Die neue BMW M5 Limousine.": x 104/183, w 512/316 | "BMW M5 Limousine": cx 227/453 | "Fahren, wie Sie es sich wünsch": w
  - 768: [typography] 11 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": s
  - 390: [typography] 10 runs differ: "BMW M5 Limousine": size 19/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Die BMW M5 Limousine mit M Hybr
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 98% / 96%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 98% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 23/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 | "Technische Daten": cx 83/-189 | "Auszeichnung": cx 221/-51 | "Konfiguriere
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [typography] 5 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case
  - 768: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": size 35/43, weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entd
  - 390: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle
- status: could not capture; widths: –; height ratio: – / – / –
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, carousel, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 102% / 101% / 100%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 96%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, hero-teaser, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 13/77 text blocks placed differently: "Der BMW X1 M35i xDrive.": cx 384/433 | "Technische Daten": cx 77/36 | "Preisliste": cx 186/145 | "Design": cx 261/220 | "
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 12/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 104/183, w 512/268 | "BMW X2 M35i xDrive": cx 231/440 | "Unverkennbar M.": x 104/208, w 512/2
  - 768: [layout] 20/92 text blocks placed differently: "Technische Daten": cx 77/-268 | "Preisliste": cx 186/-159 | "Probefahrt vereinbaren": cx 313/-32 | "Performance": cx 451/
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/m/x3-m50/bmw-x3-m50
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/90 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 104/183, w 512/265 | "BMW X3 M50 xDrive": cx 191/459 | "Unverkennbar M.": w 512/270 | "Charakt
  - 390: [layout] 10/83 text blocks placed differently: "BMW X3 M50 xDrive": cx 195/48 | "Technische Daten": cx 81/195 | "Unverkennbar M.": w 326/217 | "Komfortabel bis maximal s

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 97%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, hero-teaser, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 12/113 text blocks placed differently: "Die BMW X6 M Modelle.": cx 384/432 | "M TwinPower Turbo V8-Zylinder-": w 280/208 | "8-Gang Steptronic Sport Getrie": w 2

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 97% / 97% / 95%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 94%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 6 runs differ: "BMW X7 M60i xDrive": size 20/15, weight 300/700 | "Preisliste BMW X7 M60i xDrive": align start/center | "Ihr Assistent für entspanntes Reisen": 
  - 1440: [layout] 20/91 text blocks placed differently: "Der BMW X7 M60i xDrive.": x 96/212, w 538/412 | "BMW X7 M60i xDrive": cx 192/440 | "Gebaut, um Grenzen zu verschie": w 51
  - 1440: [image-geometry] 6/23 images sized differently (preview/live): g07_mpa_driving-dyncamics_mt 400x267/270x180, g07_mpa_driving-dyncamics_su 400x267/270x180, g07_mpa_driving-dyncam
  - 768: [layout] 11/90 text blocks placed differently: "Der BMW X7 M60i xDrive.": cx 384/433 | "BMW X7 M60i xDrive": cx 385/184 | "Gebaut, um Grenzen zu verschie": w 648/483 | "
  - 390: [layout] 13/86 text blocks placed differently: "Der BMW X7 M60i xDrive.": cx 195/242 | "BMW X7 M60i xDrive": cx 196/48 | "Drei Sitzreihen. Unzählige Mög": w 342/225 | "R

### /de/neufahrzeuge/m/xm/bmw-xm-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/xm/bmw-xm
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 97%
- blocks: hero-stage, disclaimer, content-navigation, car-kpis, model-overview, color-switch, columns, hero-teaser, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 8 runs differ: "Werden Sie Teil des BMW Excellence C": align start/center | "Wir stehen Ihnen mit allen Informati": size 18/15 | "+49 89 1250-16084": size 18/15
  - 1440: [layout] 43/124 text blocks placed differently: "Die BMW XM Modelle.": x 96/212, w 538/356 | "Maximale Performance und Präse": w 360/247 | "Im Zusammenspiel mit dem inte
  - 1440: [image-geometry] 22/36 images sized differently (preview/live): g09_dynamics_m-hybrid-drive- 400x267/294x196, g09_dynamics_adaptive-m-susp 400x267/294x196, g09_dynamics_adaptive

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 99% / 98%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/73 text blocks placed differently: "Der BMW Z4 M40i Roadster.": w 538/412 | "BMW Z4 M40i": cx 162/497 | "Sportlich expressiv.": w 512/304 | "Markantes Design
  - 1440: [image-geometry] 6/25 images sized differently (preview/live): g29-roadster_mp_interior_m-l 612x408/294x196, g29-roadster_mp_interior_m-s 612x408/294x195, g29-roadster_mp_dynami
  - 768: [layout] 10/74 text blocks placed differently: "Der BMW Z4 M40i Roadster.": cx 384/433 | "BMW Z4 M40i": cx 385/180 | "Sportlich expressiv.": w 648/252 | "Rückwärtsfahren
  - 390: [layout] 8/70 text blocks placed differently: "Der BMW Z4 M40i Roadster.": cx 195/242 | "BMW Z4 M40i": cx 196/44 | "Technische Daten": cx 81/195 | "Sportlich expressiv."

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 98% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x2/bmw-x2-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 102% / 101% / 100%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x2/bmw-x2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 11/87 text blocks placed differently: "BMW X2 sDrive20i": cx 506/194 | "Intelligente LED-Technologie.": w 672/386 | "Sitzen, fast wie unter freiem ": w 672/483 
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 103%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/ix3/bmw-ix3
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 93%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, columns, carousel, text-media-teaser, media-showcase, color-switch, media, card-list, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 13 runs differ: "Max. Reichweite WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Energieverbrauch, kombiniert WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "
  - 768: [missing-text] 13/141 live text runs not visible on preview: "Ihr BMW iX3", "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l"
  - 768: [typography] 13 runs differ: "Max. Reichweite WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Energieverbrauch, kombiniert WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "
  - 768: [layout] 15/106 text blocks placed differently: "Das erste Modell der neuen Kla": w 672/242 | "Das Goldene Lenkrad 2025.": x 744/350 | "Für seine Innovationskraft wur": 
  - 768: [image-geometry] 4/13 images sized differently (preview/live): euroncap_car_star_rating_log 672x672/242x242, goldenes-lenkrad-3000x3000 672x672/242x242, 2026_design_trophy_siege
  - 390: [missing-text] 13/141 live text runs not visible on preview: "Ihr BMW iX3", "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l"
  - 390: [typography] 13 runs differ: "Max. Reichweite WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "Energieverbrauch, kombiniert WLTP": color rgb(62, 82, 122)/rgb(38, 38, 38) | "
  - 390: [image-geometry] 3/10 images sized differently (preview/live): euroncap_car_star_rating_log 342x342/266x266, goldenes-lenkrad-3000x3000 342x342/266x266, 2026_design_trophy_siege

### /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 101% / 99%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/suv/bmw-ix5
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 97%
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen"
  - 768: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"
  - 768: [layout] 8/74 text blocks placed differently: "Setzt Standards. Nicht Trends.": w 616/397 | "845 km": cx 385/542 | "Mehr anzeigen": cx 148/384 | "Das Exterieur Design. J
  - 390: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"

### /de/neufahrzeuge/x/suv/bmw-x5-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 100%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/suv/bmw-x5
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 94% / 94%
- blocks: hero-stage, disclaimer, scroll-navigation, cta-collection, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 12/96 text blocks placed differently: "BMW X5": ypos 57%/3% | "Mehr anzeigen": cx 688/928 | "Mehr digitale Highlights": cx 206/720 | "Variabel ohne Kompromisse.
  - 768: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 768: [layout] 15/96 text blocks placed differently: "BMW X5": cx 380/513, ypos 56%/4% | "Setzt Standards. Nicht Trends.": w 616/397 | "Mehr anzeigen": cx 148/384 | "Mehr digi
  - 768: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras
  - 390: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 390: [layout] 10/96 text blocks placed differently: "BMW X5": ypos 54%/3% | "Mehr anzeigen": cx 96/195 | "Zwei Antriebe. Volle Flexibili": w 342/251 | "BMW X5 50e xDrive": x 
  - 390: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras

### /de/neufahrzeuge/x/x1/bmw-x1-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 103% / 102% / 101%
- blocks: hero-stage, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x1/bmw-x1
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 97% / 97%
- blocks: hero-stage, content-navigation, drivetrain-switch, model-offer, hero-teaser, columns, color-switch, disclaimer, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/104 text blocks placed differently: "Die Modelle des BMW X1.": w 538/405 | "BMW X1 xDrive23i": cx 179/476 | "Im Zentrum liegt die große, fa": w 612/294 | "Ei
  - 1440: [image-geometry] 7/20 images sized differently (preview/live): u11-ice_exterior_led-headlig 612x408/294x196, u11-ice_exterior_rear-lights 612x408/294x196, u11-ice_interior_centr
  - 768: [layout] 18/104 text blocks placed differently: "BMW X1 xDrive23i": cx 384/194 | "469,00 €/Monat": x 448/308 | "16.884,00 €": x 448/308 | "✔ Anschaffungspreis: 35.019,24

### /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x3/bmw-x3-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 101% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, media, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 7 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 30e xDrive": size
  - 1440: [layout] 11/100 text blocks placed differently: "Der BMW X3 Plug-in-Hybrid.": w 512/297 | "BMW X3 30e xDrive": cx 226/440 | "Gebaut, um die Welt zu entdeck": w 512/367 |
  - 768: [layout] 16/101 text blocks placed differently: "Technische Daten": cx 77/-94 | "Preisliste": cx 186/15 | "Probefahrt vereinbaren": cx 313/142 | "Design": cx 432/261 | "
- notes: live stock cars through the bmw-proxy worker (public x-api-key from the stock-locator config)

### /de/neufahrzeuge/x/x3/bmw-x3-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 100% / 99%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x3/bmw-x3
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 104% / 104%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 7 runs differ: "Technische Daten": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 20 xDrive": size 20
  - 768: [layout] 18/116 text blocks placed differently: "Technische Daten": cx 77/-119 | "Angebote": cx 189/-7 | "Preisliste": cx 273/77 | "Probefahrt vereinbaren": cx 400/204 |
  - 390: [typography] 6 runs differ: "BMW X3 20 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "570 l Min. Kofferraum-Volumen": 

### /de/neufahrzeuge/x/x6/bmw-x6-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x6/bmw-x6
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 96%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80
  - 768: [layout] 9/89 text blocks placed differently: "BMW X6 M60i xDrive": cx 385/184 | "Präsenz, die bewegt.": w 648/273 | "Ihr BMW parkt für Sie ein und ": x 653/248 | "Mit d
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/x/x7/bmw-x7-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 98%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x7/bmw-x7
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 99% / 96%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, video, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 29/110 text blocks placed differently: "Der BMW X7.": w 538/207 | "BMW X7 xDrive40i": cx 181/471 | "Imposante Präsenz.": w 512/316 | "Preise und Produktinformat
  - 1440: [image-geometry] 15/29 images sized differently (preview/live): g07_ice_exterior_fb 1248x702/1248x150, g07_ice_exterior_new.mp4 1248x702/1248x150, g07_ice_interieur_cockpit 400x
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80
  - 768: [layout] 11/109 text blocks placed differently: "BMW X7 xDrive40i": cx 384/195 | "Imposante Präsenz.": w 648/263 | "Fahrdynamik auf höchstem Nivea": w 266/202 | "Ihr BMW
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 12/74 text blocks placed differently: "Der BMW Z4 Roadster.": w 538/363 | "BMW Z4 sDrive30i": cx 182/515 | "Für eine einzigartige Atmosphä": w 612/294 | "Fester
  - 1440: [image-geometry] 6/26 images sized differently (preview/live): g29-roadster_interior_ambien 612x408/294x196, g29-roadster_interior_m-spor 612x408/294x196, g29-roadster_dynamics_
  - 768: [layout] 10/77 text blocks placed differently: "BMW Z4 sDrive30i": cx 385/194 | "Freiheit, die man fahren kann.": w 648/390 | "Rückansicht: dynamisch bis ins": w 266/204
  - 390: [layout] 8/71 text blocks placed differently: "BMW Z4 sDrive30i": cx 195/58 | "Rückwärtsfahren, leicht gemach": x 347/227 | "Der Rückfahrassistent unterstü": x 347/227 |

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 101% / 101% / 100%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/publicpools/sitemap/sitemap
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 102%
- blocks: columns, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [typography] 6 runs differ: "Kontakt": size 14/19, weight 500/300 | "BMW erleben": size 14/19, weight 500/300 | "Service- & Dienstleistungen": size 14/19, weight 500/300 | "

### /de/services-and-workshop/allgemeine-versicherungsbedingungen
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 100%
- blocks: download
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f
  - 768: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f
  - 390: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB für Fahrzeuge b": align start/center | "Repair Inclusive AVB f

### /de/shop-online/bmw-angebote
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 96%
- blocks: content-navigation, hero-teaser, model-offer, carousel, disclaimer, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/76 text blocks placed differently: "26.604,00 €": w 106/296 | "16.524,00 €": w 99/296 | "17.604,00 €": w 98/296 | "15.444,00 €": w 100/296 | "21.564,00 €": w
  - 768: [layout] 13/76 text blocks placed differently: "26.604,00 €": w 98/616 | "16.524,00 €": w 92/616 | "17.604,00 €": w 91/616 | "15.444,00 €": w 92/616 | "21.564,00 €": w 9
  - 390: [layout] 12/75 text blocks placed differently: "BMW Plug-in-Hybride": cx 195/94 | "BMW Elektroautos.": cx 84/195 | "26.604,00 €": w 92/294 | "16.524,00 €": w 87/294 | "1

### /de/shop-online/bmw-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 96%
- blocks: content-navigation, hero-teaser, model-offer, carousel, disclaimer, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/76 text blocks placed differently: "32.364,00 €": w 103/296 | "17.964,00 €": w 97/296 | "19.764,00 €": w 99/296 | "16.884,00 €": w 103/296 | "22.644,00 €": w
  - 768: [layout] 13/76 text blocks placed differently: "32.364,00 €": w 96/616 | "17.964,00 €": w 91/616 | "19.764,00 €": w 93/616 | "16.884,00 €": w 97/616 | "22.644,00 €": w 9
  - 390: [layout] 12/75 text blocks placed differently: "BMW Plug-in-Hybride": cx 195/94 | "BMW Elektroautos.": cx 84/195 | "32.364,00 €": w 90/294 | "17.964,00 €": w 85/294 | "1

### /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 97% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [layout] 12/65 text blocks placed differently: "Mit der digitalen Business Car": cx 210/384 | "BMW Unfall- und Pannenhilfe.": cx 559/385 | "Im Fall der Fälle bestens abg

### /de/topics/fascination-bmw/events/quiztaxi2024
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 101%
- blocks: hero-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: none

### /de/topics/fascination-bmw/events/vip-experience
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 102%
- blocks: hero-teaser, video, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 | "VIP Experience Biathlon auf Sc": w 512/381 | "Shuttle-Service im vollelektri": w 1248/674

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 97% / 98%
- blocks: hero-teaser, carousel, tabs, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: 
  - 768: [layout] 9/59 text blocks placed differently: "Schweden": x 696/738 | "Österreich": x 696/738 | "Frankreich": x 696/738 | "Deutschland": x 696/738 | "Tschechien": x 696/

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 96%
- blocks: hero-teaser, content-table, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [layout] 7/42 text blocks placed differently: "Österreich": x 696/738 | "Lettland": x 696/738 | "Deutschland": x 696/738 | "Olympische Winterspiele in Ita": x 696/738 | 

### /de/topics/faszination-bmw/events/bmw-golfsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 95%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 | "BMW International Open.": w 400/262 | "Friends of the Brand.": w 400/218

### /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand
- status: match; widths: 1440, 768, 390; height ratio: 97% / 98% / 98%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup
- status: match; widths: 1440, 768, 390; height ratio: 93% / 95% / 94%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/topics/faszination-bmw/events/kulturelles-engagement
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 96%
- blocks: hero-teaser, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 7/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 | "Zur Kulturbroschüre": cx 405/721 | "Klassische Musik und Jazz.": w 824/428 | "Mod
  - 768: [layout] 6/36 text blocks placed differently: "Zur Kulturbroschüre": cx 253/385 | "Klassische Musik und Jazz.": w 672/356 | "Moderne und zeitgenössische Ku": w 672/486 |

### /de/topics/faszination-bmw/events/wintersport
- status: match; widths: 1440, 768, 390; height ratio: 97% / 95% / 98%
- blocks: hero-teaser, columns, disclaimer, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 98%
- blocks: hero-teaser, video, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 4/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 | "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 | "Warum ein Windkanal?": w 824/360 | "

### /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 77% / 96% / 97%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 1465px vs live 1893px content height (77%)
  - 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 | "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/start | "Lena Gercke": alig
  - 1440: [layout] 3/7 text blocks placed differently: "BMW IBU Weltcup Biathlon": w 512/359 | "January 09, 2025 to January 12": w 512/337 | "Biathlonzentrum 1 83324, Ruhpo": w 51
  - 768: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 20/18 | "Es ist klasse, dass wir in der BMW-F": size 17/25, align center/start | "Lena Gercke": alig
  - 390: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 19/17 | "Es ist klasse, dass wir in der BMW-F": size 16/23, align center/start | "Lena Gercke": alig

### /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs
- status: match; widths: 1440, 768, 390; height ratio: 93% / 96% / 96%
- blocks: hero-teaser, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 97%
- blocks: hero-teaser, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 28/111 text blocks placed differently: "Gebietsleiterin": w 113/648 | "Hamburg": w 74/648 | "Mobil: +49 151 60510221": w 194/648 | "E-Mail: Renate.Rodermund@bmw
  - 390: [layout] 23/111 text blocks placed differently: "Gebietsleiterin": w 106/326 | "Hamburg": w 68/326 | "Mobil: +49 151 60510221": w 181/326 | "Gebietsleiter": w 93/326 | "

### /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 97% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [layout] 12/70 text blocks placed differently: "Mit der digitalen Business Car": cx 210/384 | "BMW Unfall- und Pannenhilfe.": cx 559/385 | "Im Fall der Fälle bestens abg

### /de/topics/faszination-bmw/sport-events/weltcup
- status: match; widths: 1440, 768, 390; height ratio: 94% / 95% / 91%
- blocks: hero-teaser, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/topics/neuwagen/gewaehrleistung
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 99% / 99%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 9 runs differ: "Erweiterte Batteriegewährleistung": align start/center | "BMW Plug-in-Hybride (Generationen 3.": align start/center | "BMW i3 (I01) Gewährleistu
  - 1440: [layout] 11/58 text blocks placed differently: "Gewährleistungen, Garantien un": w 512/368 | "Gewährleistung": cx 160/64 | "Erweiterte Batteriegewährleist": cx 362/266 |
  - 768: [typography] 9 runs differ: "Erweiterte Batteriegewährleistung": align start/center | "BMW Plug-in-Hybride (Generationen 3.": align start/center | "BMW i3 (I01) Gewährleistu
  - 390: [typography] 8 runs differ: "BMW Plug-in-Hybride (Generationen 3.": align start/center | "BMW i3 (I01) Gewährleistungsbeginn v": align start/center | "BMW BEV Gewährleistung

### /de/topics/service-zubehoer/bmw-security
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 97% / 97%
- blocks: hero-teaser, columns, content-table, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 5/40 text blocks placed differently: "BMW Security": w 512/278 | "Sie fahren, wir schützen.": w 512/253 | "BMW Partner finden": cx 405/721 | "BMW Security Activ

### /de/topics/service-zubehoer/bmw-service/repair-inclusive
- status: match; widths: 1440, 768, 390; height ratio: 95% / 94% / 94%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: none

### /de/topics/service-zubehoer/bmw-service/rueckrufe
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 94% / 104%
- blocks: hero-teaser, embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 390: [layout] 9/20 text blocks placed differently: "Frage: Wo finde ich meine 17-s": x 84/24, w 223/342 | "Die 17-stellige Fahrzeug-Ident": x 84/24, w 223/342 | "My BMW App":

### /de/topics/service-zubehoer/financial-services/bmw-financial-services
- status: differences remain; widths: 1440, 768, 390; height ratio: 107% / 102% / 97%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, content-table, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 25/125 text blocks placed differently: "Ihre Vorteile": cx 147/51 | "Leasing oder Finanzierung": cx 308/212 | "Zusatzangebote": cx 486/390 | "Aktuelle Angebote"
  - 768: [layout] 19/125 text blocks placed differently: "Ihre Vorteile": cx 95/47 | "Leasing oder Finanzierung": cx 242/194 | "Zusatzangebote": cx 403/355 | "Aktuelle Angebote":

### /de/topics/service-zubehoer/financial-services/bmw-finanzierung
- status: differences remain; widths: 1440, 768, 390; height ratio: 109% / 104% / 99%
- blocks: hero-teaser, content-navigation, icon-teaser, video, columns, content-table, disclaimer, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 19/98 text blocks placed differently: "BMW Finanzierung": cx 172/76 | "Finanzierungsupgrades": cx 347/251 | "Aktuelle Angebote": cx 522/426 | "Support": cx 640/
  - 768: [layout] 15/98 text blocks placed differently: "BMW Finanzierung": cx 117/69 | "Finanzierungsupgrades": cx 276/228 | "Aktuelle Angebote": cx 434/386 | "Support": cx 543/

### /de/topics/service-zubehoer/financial-services/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 105% / 89% / 91%
- blocks: hero-teaser, content-navigation, carousel, cards-quicklink, columns, disclaimer, accordion, icon-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule; R0: poster until first frame
- remaining: 
  - 1440: [layout] 29/167 text blocks placed differently: "Ihre Vorteile": cx 147/51 | "BMW Leasing": cx 263/167 | "BMW Leasing Upgrades": cx 422/326 | "BMW Versicherungen": cx 60
  - 768: [height] preview 27819px vs live 31265px content height (89%)
  - 768: [layout] 30/167 text blocks placed differently: "Ihre Vorteile": cx 95/47 | "BMW Leasing": cx 202/154 | "BMW Leasing Upgrades": cx 347/299 | "BMW Versicherungen": cx 517

### /de-de/shop-online/bmw-business-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 96%
- blocks: content-navigation, hero-teaser, model-offer, carousel, disclaimer, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/76 text blocks placed differently: "26.604,00 €": w 106/296 | "16.524,00 €": w 99/296 | "17.604,00 €": w 98/296 | "15.444,00 €": w 100/296 | "21.564,00 €": w
  - 768: [layout] 13/76 text blocks placed differently: "26.604,00 €": w 98/616 | "16.524,00 €": w 92/616 | "17.604,00 €": w 91/616 | "15.444,00 €": w 92/616 | "21.564,00 €": w 9
  - 390: [layout] 12/75 text blocks placed differently: "BMW Plug-in-Hybride": cx 195/94 | "BMW Elektroautos.": cx 84/195 | "26.604,00 €": w 92/294 | "16.524,00 €": w 87/294 | "1

