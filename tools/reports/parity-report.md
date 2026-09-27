# Visual parity report — main--bmw--moved-permanently.aem.page vs www.bmw.de

Generated 2026-09-27T10:33:16.133Z (after round 3 (preview re-captured)). Widths: 1440, 768, 390 px. Machine-readable: `parity-report.json`.

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
| match (all three widths) | 15 |
| differences remain | 204 |
| partially captured | 0 |
| could not capture | 1 |

Remaining issue kinds (page-widths): image-geometry 279, layout 219, height 164, typography 158, missing-text 124, broken-images 13

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
| /de/bmw-alpina | differences remain | 1440, 768, 390 | 90% / 83% / 86% | 1440: [height] preview 8635px vs live 9644px (90%); 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma" |
| /de/bmw-financial-services-overview/bmw-leasing | differences remain | 1440, 768, 390 | 112% / 107% / 98% | 1440: [height] preview 17819px vs live 15957px (112%); 1440: [layout] 20/179 text blocks placed differently: "4. Bestellen Sie Ihren BMW.": w 290/221 / "BMW Leasing Care Paket": w 312/232 / "Ratenschutzversicherung": w 2 |
| /de/bmw-financial-services-overview/form-finder | differences remain | 1440, 768, 390 | 100% / 99% / 80% | 390: [height] preview 2530px vs live 3171px (80%) |
| /de/bmw-modelle-vergleichen | differences remain | 1440, 768, 390 | 15% / 22% / 15% | 1440: [height] preview 2136px vs live 13920px (15%); 768: [height] preview 2623px vs live 12106px (22%) |
| /de/bmw-service-hub | differences remain | 1440, 768, 390 | 94% / 95% / 93% | 768: [layout] 15/144 text blocks placed differently: "Proactive Care": cx -348/67 / "Service Inclusive": cx -225/190 / "Repair Inclusive": cx -99/316 / "Unfall- und Pannenhil |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen | differences remain | 1440, 768, 390 | 94% / 96% / 81% | 390: [height] preview 2988px vs live 3709px (81%) |
| /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen | differences remain | 1440, 768, 390 | 94% / 96% / 81% | 390: [height] preview 3040px vs live 3769px (81%) |
| /de/bmw-service-hub/bmw-service/unfall-pannenhilfe | differences remain | 1440, 768, 390 | 112% / 104% / 101% | 1440: [height] preview 12134px vs live 10870px (112%); 1440: [layout] 18/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 / "BMW Service": cx 387/291 / "Proactive Care": cx 510/414 / "Service Inclusiv |
| /de/campaigns/bmw-fuer-geschaeftskunden | differences remain | 1440, 768, 390 | 98% / 98% / 92% | 1440: [typography] 7 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Ob Sie freiberuflich tätig sind, ein": size 28/20, weight 300/700 / "Monatliche Ra; 1440: [image-geometry] 3 images sized d |
| /de/campaigns/hvo100-erneuerbarer-diesel | differences remain | 1440, 768, 390 | 92% / 91% / 87% | 1440: [layout] 4/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 / "Ihr BMW Diesel ist bereit für ": w 512/389 / "Hier überprüfen": cx 177/402 /; 768: [layout] 5/31 text blocks placed diffe |
| /de/digital-services/bmw-connecteddrive | differences remain | 1440, 768, 390 | 96% / 95% / 94% | 1440: [image-geometry] 18 images sized differently (preview/live): #3 294x196/1440x480, #4 294x196/1440x480, #5 294x196/1440x480, #8 1248x416/270x180, #9 718x478/270x180; 768: [image-geometry] 16 images sized differently |
| /de/digital-services/bmw-digital-key | differences remain | 1440, 768, 390 | 104% / 105% / 97% | 1440: [image-geometry] 4 images sized differently (preview/live): #9 1440x480/718x479, #10 1440x480/376x250, #11 1440x480/376x250, #12 718x478/376x250; 768: [image-geometry] 4 images sized differently (preview/live): #9  |
| /de/digital-services/bmw-entertainment | differences remain | 1440, 768, 390 | 104% / 101% / 86% | 390: [height] preview 5731px vs live 6629px (86%) |
| /de/digital-services/bmw-idrive | differences remain | 1440, 768, 390 | 96% / 95% / 90% | 1440: [image-geometry] 3 images sized differently (preview/live): #4 1248x546/376x251, #10 400x267/718x479, #16 612x408/376x250; 768: [image-geometry] 3 images sized differently (preview/live): #4 672x294/648x432, #10 67 |
| /de/digital-services/bmw-intelligent-personal-assistant | differences remain | 1440, 768, 390 | 94% / 92% / 89% | 1440: [image-geometry] 5 images sized differently (preview/live): #2 1440x630/1248x702, #3 1248x702/718x539, #4 1248x702/718x539, #7 718x478/376x251, #8 718x478/376x250; 768: [image-geometry] 5 images sized differently ( |
| /de/digital-services/bmw-maps | differences remain | 1440, 768, 390 | 102% / 109% / 90% | 1440: [layout] 9/40 text blocks placed differently: "BMW Maps.": w 512/239 / "Navigieren: intuitiv und komfo": w 612/232 / "Erleben Sie mit BMW Maps Navig": w 612/294 / "Nützl; 1440: [image-geometry] 4 images sized diffe |
| /de/elektroauto | differences remain | 1440, 768, 390 | 98% / 107% / 93% | 768: [layout] 29/81 text blocks placed differently: "Modelle": cx -634/66 / "Vorteile von Elektroautos": cx -505/195 / "E-Auto Batterie und Technologi": cx -299/401 / "Reichw; 768: [image-geometry] 7 images sized differe |
| /de/elektroauto/batterie-technologie | differences remain | 1440, 768, 390 | 110% / 101% / 93% | 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/400x266, #5 400x267/1440x480, #7 1248x829/1440x480, #8 294x196/718x477, #17 718x479/270x180; 768: [layout] 23/95 text blocks placed different |
| /de/elektroauto/bmw-charging-support | differences remain | 1440, 768, 390 | 96% / 94% / 80% | 1440: [typography] 7 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Bedienungsanleitung": size 18/15 / "Vorvertragliche Transparenzinformati": si; 1440: [layout] 6/23 text blocks placed  |
| /de/elektroauto/elektroauto-kosten | differences remain | 1440, 768, 390 | 95% / 107% / 92% | 1440: [image-geometry] 7 images sized differently (preview/live): #2 1440x630/367x300, #17 367x300/718x477, #19 718x477/1440x477, #20 1440x480/718x479, #23 718x478/270x180; 768: [layout] 23/70 text blocks placed differen |
| /de/elektroauto/elektroauto-reichweite | differences remain | 1440, 768, 390 | 96% / 110% / 93% | 768: [layout] 18/59 text blocks placed differently: "Reichweitenübersicht": cx -62/89 / "E-Auto Analyse": cx 82/233 / "Reichweite optimieren": cx 227/378 / "Maximale Reichwei; 768: [image-geometry] 8 images sized differe |
| /de/elektroauto/elektroautos-vorteile | differences remain | 1440, 768, 390 | 97% / 96% / 91% | 1440: [image-geometry] 7 images sized differently (preview/live): #2 1440x630/718x479, #4 718x477/376x251, #7 400x267/718x477, #9 718x477/376x250, #12 400x267/718x479; 768: [image-geometry] 7 images sized differently (pr |
| /de/elektroauto/foerderungen | differences remain | 1440, 768, 390 | 89% / 89% / 89% | 1440: [height] preview 6256px vs live 7062px (89%); 1440: [layout] 15/69 text blocks placed differently: "Bruttogehalt: 6.500,00 €": w 175/296 / "+ GWV: 376,77 €": w 117/296 / "- Sozialabgaben: 1.302,25 €": w 194/296 / " |
| /de/elektroauto/foerderungen-privatkunden | differences remain | 1440, 768, 390 | 88% / 89% / 87% | 1440: [height] preview 8587px vs live 9787px (88%); 1440: [layout] 11/78 text blocks placed differently: "AI-generated content": x -1/1395 / "- Batterieelektrisch (BEV)": w 208/400 / "- Plug-in-Hybrid (PHEV)": w 198/400  |
| /de/elektroauto/gebrauchte-elektroautos | differences remain | 1440, 768, 390 | 94% / 95% / 92% | 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/718x477, #3 718x477/475x388, #6 529x432/1440x104, #7 529x432/718x478, #8 529x432/718x477; 768: [layout] 12/84 text blocks placed differently: |
| /de/elektroauto/home-charging | differences remain | 1440, 768, 390 | 93% / 95% / 92% | 1440: [image-geometry] 13 images sized differently (preview/live): #2 1440x630/1440x480, #4 294x196/1440x480, #12 718x479/294x196, #13 1440x630/718x479, #14 718x479/1440x627; 768: [layout] 13/113 text blocks placed diffe |
| /de/elektroauto/plug-in-hybrid | differences remain | 1440, 768, 390 | 98% / 106% / 95% | 1440: [typography] 5 runs differ: "Flexibel. Effizient. Kraftvoll.": size 18/23 / "PHEV Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) / "So funktioniert ein Hybrid-Auto": ali; 1440: [image-geometry] 5 images sized d |
| /de/elektroauto/public-charging | differences remain | 1440, 768, 390 | 121% / 103% / 93% | 1440: [height] preview 17046px vs live 14035px (121%); 1440: [layout] 21/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 / "BMW Charging erhält zweimal di": x 772/878 / "Wir freuen uns über |
| /de/elektroauto/rabatt-auf-die-bmw-wallbox-professional | differences remain | 1440, 768, 390 | 99% / 98% / 78% | 390: [height] preview 2324px vs live 2985px (78%) |
| /de/fastlane/dealer-locator | differences remain | 1440, 768, 390 | 94% / 89% / 71% | 1440: [missing-text] 516/516 live text runs not visible on preview: "Suche nach Standort", "Suche nach Namen", "Neufahrzeug", "Gebrauchte Fahrzeuge"; 768: [height] preview 2173px vs live 2432px (89%) |
| /de/footer/footer-section/cookie-policy | differences remain | 1440, 768, 390 | 20% / 19% / 11% | 1440: [height] preview 1412px vs live 7085px (20%); 768: [height] preview 1533px vs live 7884px (19%) |
| /de/footer/metanavigation/bmw-barrierefreiheit | differences remain | 1440, 768, 390 | 94% / 77% / 96% | 1440: [typography] 3 runs differ: "Kaufen": color rgb(28, 105, 212)/rgb(38, 38, 38) / "Tel.: +49 89 1250 16000": size 15/18 / "Nachricht senden": size 15/18; 1440: [layout] 10/51 text blocks placed differently: "Barriere |
| /de/footer/metanavigation/bmw-betrugsfaelle | differences remain | 1440, 768, 390 | 85% / 79% / 98% | 1440: [height] preview 3402px vs live 4022px (85%); 1440: [layout] 33/36 text blocks placed differently: "Was ist Identitätsbetrug?": x 96/308, w 1248/312 / "Es handelt sich um Identitätsb": x 96/308, w 1248/824 / "Wie e |
| /de/footer/metanavigation/data-privacy | differences remain | 1440, 768, 390 | 40% / 44% / 35% | 1440: [height] preview 2616px vs live 6591px (40%); 768: [height] preview 2789px vs live 6281px (44%) |
| /de/footer/metanavigation/data-privacy/data-category | match | 1440, 768, 390 | 97% / 96% / 99% | – |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-c | differences remain | 1440, 768, 390 | 99% / 99% / 72% | 1440: [missing-text] 2/6 live text runs not visible on preview: "BMW Motorrad Kundenbetreuung BMW AG Moto", "BMW AG Datenschutzbeauftragter Petuelrin"; 768: [missing-text] 2/6 live text runs not visible on preview: "BMW  |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-d | differences remain | 1440, 768, 390 | 99% / 99% / 78% | 390: [height] preview 2352px vs live 3011px (78%) |
| /de/footer/metanavigation/data-privacy/privacy-subpage-weblink-e | differences remain | 1440, 768, 390 | 98% / 98% / 81% | 390: [height] preview 2800px vs live 3477px (81%) |
| /de/footer/metanavigation/eu-batterieverordnung | differences remain | 1440, 768, 390 | 90% / 88% / 65% | 768: [height] preview 1845px vs live 2094px (88%); 390: [height] preview 1567px vs live 2397px (65%) |
| /de/footer/metanavigation/legal-disclaimer-pool/produktsicherheitsverordnung | differences remain | 1440, 768, 390 | 98% / 98% / 69% | 390: [height] preview 1482px vs live 2141px (69%) |
| /de/footer/metanavigation/legal-disclaimer-pool/legal-disclaimer | differences remain | 1440, 768, 390 | 95% / 96% / 84% | 1440: [layout] 4/22 text blocks placed differently: "Rechtlicher Hinweis.": w 1248/321 / "Außergerichtliche Streitbeileg": w 1248/347 / "Anlaufstellen für hinweisgeben": w 124; 768: [layout] 4/22 text blocks placed diffe |
| /de/footer/metanavigation/legal-notice-pool/imprint | differences remain | 1440, 768, 390 | 98% / 96% / 78% | 390: [height] preview 2746px vs live 3515px (78%) |
| /de/home | differences remain | 1440, 768, 390 | 98% / 102% / 90% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 1440x630/1440x482, #5 1440x480/718x479; 390: [image-geometry] 2 images sized differently (preview/live): #2 390x520/390x391, #5 390x390/342x228 |
| /de/konfigurator | differences remain | 1440, 768, 390 | 99% / 100% / 96% | 1440: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Kompakt": color rgb(38, 38, 38)/rg; 768: [typography] 8 runs differ: "Touri |
| /de/landingpage/bmw-fahrfreude-gewinnen | differences remain | 1440, 768, 390 | 97% / 95% / 84% | 390: [height] preview 3404px vs live 4069px (84%) |
| /de/landingpage/shops | differences remain | 1440, 768, 390 | 96% / 99% / 84% | 1440: [layout] 7/24 text blocks placed differently: "BMW Connected Drive.": w 400/240 / "Zubehör.": x 96/308 / "Im BMW Online Store für Zubehö": x 96/308 / "BMW Zubehör finden; 390: [height] preview 4121px vs live 4899px |
| /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv | differences remain | 1440, 768, 390 | 96% / 95% / 77% | 390: [height] preview 2522px vs live 3259px (77%) |
| /de/mehr-bmw/bmw-gebrauchte | differences remain | 1440, 768, 390 | 92% / 142% / 81% | 1440: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"; 768: [height] preview 4738px vs live 3344px (142%) |
| /de/mehr-bmw/bmw-gebrauchte/europlusgarantie | differences remain | 1440, 768, 390 | 100% / 130% / 89% | 768: [height] preview 6148px vs live 4731px (130%); 768: [layout] 11/35 text blocks placed differently: "IHRE VORTEILE AUF EINEN BLICK.": w 672/480 / "Download of current EUROPlus w": x 48/396 / "Sie wollen noch länger d |
| /de/mehr-bmw/bmw-gebrauchte/garantie | differences remain | 1440, 768, 390 | 99% / 128% / 87% | 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(102, 102, 102)/rgb(25; 1440: [layout] 5/31 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte | differences remain | 1440, 768, 390 | 96% / 97% / 87% | 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) / "Junge Gebrauchte von BMW.": size 43/35 / "BMW Premium Selection Garantie": al; 1440: [layout] 6/35 text blocks placed  |
| /de/mehr-bmw/bmw-gebrauchte/premium-selection | differences remain | 1440, 768, 390 | 104% / 155% / 108% | 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."; 1440: [typography] 12 runs differ: "DIE NEUEN |
| /de/mehr-bmw/bmw-individual | differences remain | 1440, 768, 390 | 90% / 80% / 84% | 1440: [image-geometry] 9 images sized differently (preview/live): #4 718x479/294x196, #10 294x196/1440x628, #11 1440x630/1248x701, #12 1248x701/294x196, #17 294x196/718x478; 768: [height] preview 11219px vs live 14070px  |
| /de/mehr-bmw/bmw-special-sales | differences remain | 1440, 768, 390 | 98% / 95% / 86% | 768: [layout] 5/30 text blocks placed differently: "BMW Behördenfahrzeuge": cx -43/103 / "BMW Einsatzfahrzeuge": cx 138/284 / "BMW Sonderschutzfahrzeuge": cx 331/477 / "BMW D; 390: [height] preview 5329px vs live 6212px  |
| /de/mehr-bmw/bmw-special-sales/bmw-7-protection | differences remain | 1440, 768, 390 | 106% / 107% / 101% | 768: [layout] 7/69 text blocks placed differently: "Herausragendes Protection-Konz": cx 210/385 / "Erstklassige Fahrdynamik.": cx 559/385 / "Designed to stay in Motion.": w 6; 768: [image-geometry] 4 images sized differe |
| /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales | match | 1440, 768, 390 | 99% / 98% / 92% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge | differences remain | 1440, 768, 390 | 96% / 93% / 91% | 1440: [image-geometry] 10 images sized differently (preview/live): #14 400x267/1440x480, #15 400x267/1440x480, #16 400x267/1440x480, #17 294x196/1440x480, #18 294x196/1440x480; 768: [layout] 34/137 text blocks placed dif |
| /de/mehr-bmw/bmw-special-sales/bmw-military-sales | match | 1440, 768, 390 | 98% / 96% / 91% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge | match | 1440, 768, 390 | 101% / 93% / 91% | – |
| /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6 | differences remain | 1440, 768, 390 | 103% / 98% / 96% | 1440: [image-geometry] 8 images sized differently (preview/live): #4 1248x702/718x478, #6 1248x830/1440x480, #8 294x196/1440x480, #16 400x267/270x180, #17 400x267/718x478; 768: [image-geometry] 5 images sized differently |
| /de/mehr-bmw/concept-cars/bmw-speedtop | differences remain | 1440, 768, 390 | 89% / 83% / 79% | 1440: [height] preview 8605px vs live 9675px (89%); 1440: [layout] 7/40 text blocks placed differently: "BMW Speedtop.": w 512/319 / "Limitiertes Sammlerstück": w 512/263 / "Ein emotionales Sammlerstück.": w 376/256 / "M |
| /de/mehr-bmw/die-exklusiven-bmw-automobile | differences remain | 1440, 768, 390 | 103% / 102% / 91% | 1440: [layout] 14/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 / "BMW i7 60 xDrive.": w 512/293 / "Der BMW i7 verbindet sinnliche": w 512/288; 1440: [image-geometry] 5 images sized diffe |
| /de/mehr-bmw/digital-services-act | differences remain | 1440, 768, 390 | 85% / 85% / 76% | 1440: [height] preview 4633px vs live 5480px (85%); 1440: [layout] 33/37 text blocks placed differently: "1. Kontaktstelle für Kommunika": x 96/202 / "Unsere zentrale Kontaktstelle ": x 96/202 / "E-Mail: dsa.de@bmwgroup. |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass | differences remain | 1440, 768, 390 | 96% / 96% / 84% | 1440: [layout] 3/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 / "Fuhrparks intelligent steuern.": w 400/301 / "Fahrfreude neu definiert.": w ; 768: [layout] 4/17 text blocks placed diffe |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister | differences remain | 1440, 768, 390 | 111% / 94% / 87% | 1440: [height] preview 12379px vs live 11145px (111%); 1440: [typography] 3 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center / "Hollywood bei BMW.": align start/center / "Im Rahmen eine |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring | differences remain | 1440, 768, 390 | 95% / 94% / 87% | 768: [layout] 3/20 text blocks placed differently: "Die Evolution des Fahrens.": w 672/246 / "Der Klangmeister – Interview m": w 672/423 / "Umfrage: Welche Themen wollen ": w; 390: [height] preview 5299px vs live 6077px  |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5 | differences remain | 1440, 768, 390 | 97% / 93% / 90% | 390: [height] preview 7161px vs live 7973px (90%) |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte | differences remain | 1440, 768, 390 | 95% / 89% / 92% | 768: [height] preview 11134px vs live 12535px (89%); 768: [image-geometry] 2 images sized differently (preview/live): #2 672x377/672x506, #8 672x379/672x504 |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude | differences remain | 1440, 768, 390 | 100% / 86% / 89% | 1440: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Eine zentrale Steuereinheit für die ": align start/center / "Eine neue Verbi; 768: [height] preview 8025px vs live 93 |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement | match | 1440, 768, 390 | 97% / 95% / 92% | – |
| /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt | differences remain | 1440, 768, 390 | 92% / 93% / 78% | 390: [height] preview 3292px vs live 4195px (78%) |
| /de/mehr-bmw/kundenbetreuung | differences remain | 1440, 768, 390 | 108% / 120% / 100% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 506x1044/254x524, #3 718x718/270x180; 768: [height] preview 7060px vs live 5872px (120%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball | differences remain | 1440, 768, 390 | 98% / 97% / 84% | 390: [height] preview 3886px vs live 4617px (84%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park | differences remain | 1440, 768, 390 | 94% / 93% / 82% | 390: [height] preview 4128px vs live 5020px (82%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball/innovation | differences remain | 1440, 768, 390 | 99% / 96% / 83% | 390: [height] preview 3744px vs live 4489px (83%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture | differences remain | 1440, 768, 390 | 98% / 94% / 84% | 390: [height] preview 4185px vs live 4973px (84%) |
| /de/mehr-bmw/sport-und-events/bmw-basketball/we-care | differences remain | 1440, 768, 390 | 90% / 83% / 81% | 1440: [height] preview 3481px vs live 3879px (90%); 768: [height] preview 3535px vs live 4281px (83%) |
| /de/mehr-bmw/sport-und-events/laufsport | differences remain | 1440, 768, 390 | 94% / 92% / 83% | 390: [height] preview 3442px vs live 4145px (83%) |
| /de/mehr-bmw/sport-und-events/sport-und-kultur | differences remain | 1440, 768, 390 | 98% / 98% / 76% | 390: [height] preview 2126px vs live 2809px (76%) |
| /de/mehr-bmw/sport-und-events/tennis | differences remain | 1440, 768, 390 | 96% / 94% / 82% | 390: [height] preview 2954px vs live 3623px (82%) |
| /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy | differences remain | 1440, 768, 390 | 96% / 94% / 85% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 1440x630/1248x702, #4 1248x702/718x479; 768: [image-geometry] 2 images sized differently (preview/live): #2 768x1024/672x378, #4 672x378/382x255 |
| /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung | differences remain | 1440, 768, 390 | 93% / 93% / 88% | 390: [height] preview 6699px vs live 7653px (88%) |
| /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub | differences remain | 1440, 768, 390 | 95% / 97% / 93% | 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/376x250, #5 400x267/1440x630, #6 1440x630/270x180, #13 400x267/270x180, #23 400x267/1440x631; 768: [image-geometry] 12 images sized different |
| /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile | differences remain | 1440, 768, 390 | 101% / 114% / 102% | 1440: [typography] 5 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 / "Original BMW Classic Teile": align start/center / "IHRE VORTEILE": size 35/12, case none/up; 1440: [layout] 15/77 text blocks placed |
| /de/more-bmw/sport-und-events/bmw-basketball/bmw-park | differences remain | 1440, 768, 390 | 94% / 93% / 82% | 390: [height] preview 4128px vs live 5020px (82%) |
| /de/my-bmw-app/my-bmw-app | differences remain | 1440, 768, 390 | 120% / 124% / 87% | 1440: [height] preview 7125px vs live 5948px (120%); 1440: [layout] 27/52 text blocks placed differently: "My BMW APP.": w 512/277 / "ALLES AN EINEM ORT – MIT DER M": w 1248/442, ypos 24%/15% / "Fahrzeugstatus / Ladestat |
| /de/neufahrzeuge | differences remain | 1440, 768, 390 | 100% / 100% / 96% | 1440: [typography] 14 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Kompakt": color rgb(38, 38, 38)/r; 768: [typography] 13 runs differ: "Tour |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten | differences remain | 1440, 768, 390 | 101% / 101% / 93% | 1440: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de; 768: [missing-text] 7/78 live text ru |
| /de/neufahrzeuge/1er/bmw-1er/bmw-1er | differences remain | 1440, 768, 390 | 98% / 100% / 95% | 1440: [typography] 18 runs differ: "Ab 339 €": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 102, 102)/rgb(3; 1440: [layout] 24/100 text blocks place |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 89% | 1440: [missing-text] 6/69 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht ; 768: [missing-text] 6/69 live text ru |
| /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer | differences remain | 1440, 768, 390 | 106% / 105% / 96% | 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 220i Active Tourer": size 20/15, weight 300/700 / "Preisliste BMW 2er Active ; 1440: [layout] 16/82 text blocks placed |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten | differences remain | 1440, 768, 390 | 97% / 98% / 91% | 1440: [missing-text] 13/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "115 (156)", "Hinterradantrieb", "115 (156) / 4.500 - 6.500"; 768: [missing-text] 13/66 live text runs not visible on preview: " |
| /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe | differences remain | 1440, 768, 390 | 93% / 93% / 90% | 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M240i xDrive Coupé": size 20/15, weight 300/700 / "Preisliste BMW 2er Coupé":; 1440: [layout] 9/76 text blocks placed  |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 102% / 102% / 93% | 1440: [missing-text] 7/79 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de; 768: [missing-text] 7/79 live text ru |
| /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe | differences remain | 1440, 768, 390 | 92% / 91% / 89% | 1440: [image-geometry] 11 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x477, #5 718x477/1008x441, #10 1008x441/1248x702; 768: [typography] 6 runs differ: "Design": col |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten | differences remain | 1440, 768, 390 | 95% / 95% / 88% | 1440: [missing-text] 10/91 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve; 768: [missing-text] 10/91 live text r |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid | differences remain | 1440, 768, 390 | 99% / 102% / 97% | 1440: [layout] 10/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 / "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 11; 768: [layout] 11/86 text blocks placed diff |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten | match | 1440, 768, 390 | 100% / 101% / 92% | – |
| /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine | differences remain | 1440, 768, 390 | 100% / 102% / 96% | 1440: [layout] 9/72 text blocks placed differently: "Die BMW 3er Limousine.": x 832/104, w 512/258 / "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 1153/409 / ; 768: [image-geometry] 5 images sized differ |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid | differences remain | 1440, 768, 390 | 99% / 100% / 96% | 1440: [layout] 10/89 text blocks placed differently: "Konfigurieren & Preise": cx 938/200 / "Angebot anfordern": cx 1153/409 / "BMW 330e xDrive Touring": cx 215/443 / "Rein el; 768: [layout] 13/89 text blocks placed diff |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid | match | 1440, 768, 390 | 100% / 100% / 91% | – |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten | match | 1440, 768, 390 | 100% / 100% / 92% | – |
| /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring | differences remain | 1440, 768, 390 | 100% / 103% / 96% | 1440: [typography] 15 runs differ: "Technologien": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 330i xDrive Touring": size 20/15, weight 300/700, color rgb(255, 255, 255)/rgb(3; 1440: [layout] 20/94 text blocks placed |
| /de/neufahrzeuge/3er/limousine/bmw-i3-limousine | differences remain | 1440, 768, 390 | 91% / 95% / 88% | 1440: [image-geometry] 6 images sized differently (preview/live): #2 1440x630/416x554, #5 416x555/1008x441, #6 1008x441/416x555, #7 1008x441/416x555, #8 1008x441/1440x630; 768: [image-geometry] 8 images sized differently |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten | match | 1440, 768, 390 | 98% / 96% / 91% | – |
| /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio | differences remain | 1440, 768, 390 | 92% / 96% / 90% | 1440: [layout] 7/65 text blocks placed differently: "Das BMW 4er Cabrio.": w 512/224 / "BMW 430i xDrive Cabrio": cx 209/440 / "Verbunden mit der Welt: Digita": ypos 55%/61% / ; 768: [layout] 15/66 text blocks placed diff |
| /de/neufahrzeuge/4er/coupe/bmw-4er-coupe | differences remain | 1440, 768, 390 | 99% / 101% / 96% | 768: [layout] 13/64 text blocks placed differently: "Technische Daten": cx -136/77 / "Preisliste": cx -27/186 / "Probefahrt vereinbaren": cx 100/313 / "Design": cx 219/432 / ; 768: [image-geometry] 6 images sized differe |
| /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe | differences remain | 1440, 768, 390 | 100% / 101% / 97% | 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x479, #5 718x479/1008x441, #10 1008x441/270x180; 768: [typography] 5 runs differ: "Technische Da |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 390: [height] preview 7714px vs live 8580px (90%) |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev | differences remain | 1440, 768, 390 | 98% / 100% / 94% | 1440: [typography] 5 runs differ: "THE NEW": size 18/15, case none/uppercase / "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW 530e Touring": size 20/15, weight 300/700,; 1440: [image-geometry] 11 images sized  |
| /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring | differences remain | 1440, 768, 390 | 104% / 102% / 96% | 1440: [layout] 15/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 / "Technische Daten": cx 83/215 / "Preisliste": cx 203/335 / "Probefahrt vereinbaren": c; 1440: [image-geometry] 22 images sized diff |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten | differences remain | 1440, 768, 390 | 97% / 95% / 92% | 1440: [missing-text] 11/93 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht; 768: [missing-text] 11/93 live text r |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick | differences remain | 1440, 768, 390 | 98% / 100% / 94% | 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 718x479/1008x441, #9 1008x441/400x267, #15 400x267/1440x630; 768: [layout] 14/74 text blocks placed different |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [missing-text] 7/83 live text runs not visible on preview: "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de; 768: [missing-text] 7/83 live text ru |
| /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick | differences remain | 1440, 768, 390 | 98% / 99% / 93% | 1440: [layout] 14/72 text blocks placed differently: "Die BMW 5er Limousine.": w 512/258 / "Technische Daten": cx 83/178 / "Preisliste": cx 203/298 / "Probefahrt vereinbaren":; 1440: [image-geometry] 18 images sized diff |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [missing-text] 7/69 live text runs not visible on preview: "BMW 7er", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhä; 768: [missing-text] 7/69 live text ru |
| /de/neufahrzeuge/7er/limousine/bmw-7er-limousine | differences remain | 1440, 768, 390 | 89% / 92% / 87% | 1440: [height] preview 16383px vs live 18311px (89%); 1440: [missing-text] 19/163 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "BMW i7", "BMW M760e xDrive" |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [missing-text] 6/66 live text runs not visible on preview: "BMW i7", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewich; 768: [missing-text] 6/66 live text ru |
| /de/neufahrzeuge/7er/limousine/bmw-i7-limousine | differences remain | 1440, 768, 390 | 90% / 92% / 85% | 1440: [height] preview 15263px vs live 17051px (90%); 1440: [layout] 15/124 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 / "DIE NEUE BMW i7 LIMOUSINE": w 538/412 / "BMW Individual": x 842/616 / "727 km" |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data | match | 1440, 768, 390 | 99% / 99% / 90% | – |
| /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe | differences remain | 1440, 768, 390 | 97% / 101% / 97% | 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x478, #5 718x478/1440x630, #6 1440x630/718x479, #7 718x478/1224x689; 1440: [broken-images] 2: https://bmw.scene7.com/i |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten | differences remain | 1440, 768, 390 | 100% / 99% / 90% | 1440: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 6/70 live text ru |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten | differences remain | 1440, 768, 390 | 101% / 100% / 91% | 1440: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 6/72 live text ru |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring | differences remain | 1440, 768, 390 | 99% / 101% / 96% | 1440: [typography] 18 runs differ: "Ab 649": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 102, 102)/rgb(38,; 1440: [layout] 19/97 text blocks placed |
| /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick | differences remain | 1440, 768, 390 | 98% / 100% / 93% | 1440: [typography] 20 runs differ: "Ab 599 €": size 18/35 / "im Monat leasen.": size 18/15 / "Exklusiv für Gewerbekunden.": size 18/15 / "Angebote": color rgb(102, 102, 102)/rgb(3; 1440: [layout] 27/96 text blocks placed |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 89% | 1440: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 6/71 live text ru |
| /de/neufahrzeuge/bmw-i/ix/bmw-ix | differences remain | 1440, 768, 390 | 96% / 96% / 93% | 1440: [typography] 16 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 18/23 / "Reichweite & Laden": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW iX xDrive60": size 20; 1440: [layout] 32/117 text blocks place |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [missing-text] 7/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 7/72 live text ru |
| /de/neufahrzeuge/bmw-i/ix1/bmw-ix1 | differences remain | 1440, 768, 390 | 102% / 99% / 95% | 1440: [typography] 9 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW iX1 xDrive30": size 20/15, weight 300/700 / "Monatliche Rate": color rgb(102,; 1440: [layout] 26/113 text blocks place |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 6/72 live text ru |
| /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick | differences remain | 1440, 768, 390 | 102% / 101% / 96% | 1440: [typography] 16 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Fahrfreude.": size 35/43, align start/center / "BMW iX2 xDrive30": size 20/15, weight 30; 1440: [layout] 25/112 text blocks place |
| /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse | differences remain | 1440, 768, 390 | 89% / 92% / 85% | 1440: [height] preview 8300px vs live 9369px (89%); 1440: [image-geometry] 9 images sized differently (preview/live): #2 1440x630/520x648, #3 520x650/1248x546, #5 1248x546/520x390, #6 520x390/294x196, #10 294x196/1248x54 |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 390: [height] preview 6447px vs live 7201px (90%) |
| /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe | differences remain | 1440, 768, 390 | 99% / 103% / 96% | 1440: [missing-text] 69/226 live text runs not visible on preview: "Skip to main content", "Kaufen", "E-Mobilität", "Kunden"; 1440: [layout] 26/149 text blocks placed differently: "Modelle": x 96/184 / "Technische Daten" |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine | differences remain | 1440, 768, 390 | 101% / 102% / 99% | 1440: [layout] 26/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 104/183, w 512/372 / "Technische Daten": cx 83/-316 / "Konfigurieren": cx 218/-181 / ; 1440: [image-geometry] 13 images sized diff |
| /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring | differences remain | 1440, 768, 390 | 97% / 98% / 94% | 1440: [layout] 17/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 104/183, w 512/340 / "BMW M3 Competition Touring mit": cx 282/460 / "390 kW (530 PS),; 1440: [image-geometry] 11 images sized diff |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio | differences remain | 1440, 768, 390 | 95% / 95% / 92% | 1440: [typography] 7 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M4 Competition Cabrio": align start/center / "BMW M4 Competition Cabrio mit M xD; 1440: [layout] 18/124 text blocks place |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 89% | 1440: [missing-text] 15/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "390 (530)", "390 (530) / 6.250", "650 / 2.300 - 5.500"; 1440: [layout] 6/44 text blocks placed differently: "Tec |
| /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe | differences remain | 1440, 768, 390 | 93% / 97% / 92% | 1440: [layout] 21/150 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 104/183, w 512/331 / "Technische Daten": cx 83/-232 / "Konfigurieren": cx 218/-97 / "Pr; 1440: [image-geometry] 18 images sized diff |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 100% / 102% / 93% | 1440: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht ; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 97% / 98% / 93% | 1440: [layout] 25/123 text blocks placed differently: "Technische Daten": cx 83/5 / "Leasingbeispiel": cx 227/149 / "Preisliste": cx 340/262 / "Probefahrt vereinbaren": cx 479; 1440: [image-geometry] 25 images sized diff |
| /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick | differences remain | 1440, 768, 390 | 97% / 99% / 93% | 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/718x477, #4 930x759/1272x716, #5 718x477/400x267, #6 1248x702/400x267; 768: [layout] 15/81 text blocks placed differently |
| /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598; 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334 |
| /de/neufahrzeuge/m/bmw-m-135/bmw-m135 | differences remain | 1440, 768, 390 | 94% / 101% / 91% | 1440: [layout] 12/96 text blocks placed differently: "Der BMW M135 xDrive.": x 104/183, w 512/238 / "BMW M135 xDrive": cx 179/440 / "Charaktereigenschaft: leistung": w 466/345; 1440: [image-geometry] 23 images sized diff |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 90% | 1440: [missing-text] 7/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive | differences remain | 1440, 768, 390 | 101% / 103% / 98% | 1440: [layout] 14/87 text blocks placed differently: "Technische Daten": cx 83/-27 / "Preisliste": cx 203/93 / "Probefahrt vereinbaren": cx 342/232 / "Performance": cx 493/383; 1440: [image-geometry] 27 images sized diff |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten | differences remain | 1440, 768, 390 | 100% / 102% / 93% | 1440: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht ; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/ix-m70/bmw-ix-m70 | differences remain | 1440, 768, 390 | 98% / 99% / 94% | 1440: [image-geometry] 30 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x630, #4 930x759/718x478, #5 1440x630/1248x702, #7 1248x702/376x251; 768: [layout] 13/96 text blocks placed different |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten | differences remain | 1440, 768, 390 | 100% / 101% / 92% | 1440: [missing-text] 6/67 live text runs not visible on preview: "BMW 7er M", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergew; 1440: [typography] 4 runs differ: "BM |
| /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle | differences remain | 1440, 768, 390 | 89% / 92% / 85% | 1440: [height] preview 16089px vs live 18127px (89%); 1440: [typography] 16 runs differ: "DER NEUE BMW 7er": size 70/74, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none / "DIE BMW 7er M MODELLE": color rgb(38 |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten | differences remain | 1440, 768, 390 | 101% / 102% / 91% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598; 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334 |
| /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 95% / 94% / 91% | 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x629, #4 930x759/718x479, #5 1440x630/1248x702, #7 1248x702/718x479; 1440: [broken-images] 1: https://bmw.scene7.com/ |
| /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe | differences remain | 1440, 768, 390 | 95% / 97% / 92% | 1440: [layout] 11/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 / "BMW M440i xDrive Gran Coupé": cx 241/440 / "Fahren, wie Sie es s; 1440: [image-geometry] 25 images sized diff |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 91% | 1440: [missing-text] 12/92 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/m5-series/bmw-m5-limousine | differences remain | 1440, 768, 390 | 93% / 97% / 92% | 1440: [typography] 11 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW M5 Limousine": size 20/15, weight 300/700 / "Die BMW M5 Limousine mit M Hybrid is"; 1440: [image-geometry] 25 images sized  |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten | differences remain | 1440, 768, 390 | 99% / 99% / 90% | 1440: [missing-text] 11/87 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit; 1440: [image-geometry] 2 images sized |
| /de/neufahrzeuge/m/m5-series/bmw-m5-touring | differences remain | 1440, 768, 390 | 93% / 97% / 91% | 1440: [layout] 22/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 / "Technische Daten": cx 83/-189 / "Auszeichnung": cx 221/-51 / "Konfiguriere; 1440: [image-geometry] 26 images sized diff |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 90% | 1440: [missing-text] 10/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Angaben zu Leistung für Benzinmotoren be"; 1440: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCH |
| /de/neufahrzeuge/m/suv/bmw-x5-m-modelle | could not capture | – | – / – / – | – |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten | match | 1440, 768, 390 | 99% / 99% / 91% | – |
| /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive | differences remain | 1440, 768, 390 | 94% / 96% / 91% | 768: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X1 M35i xDrive": size 18/14, weight 300/700 / "Preisliste BMW X1 M35i xDrive": size 17/; 768: [layout] 19/77 text blocks placed d |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten | differences remain | 1440, 768, 390 | 99% / 100% / 92% | 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598; 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334 |
| /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick | differences remain | 1440, 768, 390 | 94% / 97% / 94% | 1440: [layout] 13/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 104/183, w 512/268 / "Mit einer leistungsstarken Mot": x 96/308, w 1248/824 / "BMW X2 M35i xD; 1440: [image-geometry] 21 images sized diff |
| /de/neufahrzeuge/m/x3-m50/bmw-x3-m50 | differences remain | 1440, 768, 390 | 102% / 103% / 95% | 1440: [layout] 15/90 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 104/183, w 512/265 / "BMW X3 M50 xDrive": cx 191/459 / "Unverkennbar M.": w 512/270 / "Charakt; 1440: [image-geometry] 29 images sized diff |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle | differences remain | 1440, 768, 390 | 95% / 96% / 93% | 1440: [layout] 21/110 text blocks placed differently: "Die BMW X6 M Modelle.": x 96/212, w 538/387 / "Ab 171.900 €": x 128/304 / "High-Performance M TwinPower T": x 128/336 / ; 1440: [image-geometry] 9 images sized diffe |
| /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten | differences remain | 1440, 768, 390 | 97% / 97% / 87% | 1440: [missing-text] 6/68 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht ; 768: [missing-text] 6/68 live text ru |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten | match | 1440, 768, 390 | 99% / 99% / 90% | – |
| /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i | differences remain | 1440, 768, 390 | 90% / 92% / 88% | 1440: [height] preview 12297px vs live 13672px (90%); 1440: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X7 M60i xDrive": size 20/15, weight 300/700 / "Preisliste BMW X7 |
| /de/neufahrzeuge/m/xm/bmw-xm-technische-daten | differences remain | 1440, 768, 390 | 98% / 98% / 90% | 1440: [missing-text] 11/86 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve; 768: [missing-text] 11/86 live text r |
| /de/neufahrzeuge/m/xm/bmw-xm | differences remain | 1440, 768, 390 | 97% / 99% / 95% | 1440: [typography] 10 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Preisliste BMW XM": size 18/15 / "Werden Sie Teil des BMW Excellence C": align s; 1440: [layout] 55/124 text blocks place |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster | differences remain | 1440, 768, 390 | 96% / 96% / 93% | 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Z4 M40i": size 20/15, weight 300/700 / "Preisliste BMW Z4 M40i Roadster": siz; 1440: [layout] 14/73 text blocks placed |
| /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 89% | 390: [height] preview 6145px vs live 6933px (89%) |
| /de/neufahrzeuge/x/x2/bmw-x2-technische-daten | differences remain | 1440, 768, 390 | 101% / 100% / 92% | 1440: [missing-text] 7/76 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera; 768: [missing-text] 7/76 live text ru |
| /de/neufahrzeuge/x/x2/bmw-x2-ueberblick | differences remain | 1440, 768, 390 | 94% / 96% / 94% | 1440: [layout] 9/87 text blocks placed differently: "Der BMW X2 – ein SUV, der die ": x 96/308, w 1248/824 / "BMW X2 sDrive20i": cx 181/480 / "Sitzen, fast wie unter freiem ":; 1440: [image-geometry] 24 images sized diff |
| /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 95% | 1440: [missing-text] 9/82 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Bidirektionales Laden erfor; 768: [missing-text] 9/82 live text ru |
| /de/neufahrzeuge/x/ix3/bmw-ix3 | differences remain | 1440, 768, 390 | 92% / 99% / 91% | 1440: [typography] 9 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) / "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) / "Neue Designspr; 1440: [image-geometry] 20 images sized  |
| /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 90% | 1440: [missing-text] 6/63 live text runs not visible on preview: "BMW iX5:", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewi; 768: [missing-text] 6/63 live text ru |
| /de/neufahrzeuge/x/suv/bmw-ix5 | differences remain | 1440, 768, 390 | 90% / 93% / 90% | 1440: [height] preview 12970px vs live 14417px (90%); 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen" |
| /de/neufahrzeuge/x/suv/bmw-x5-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 92% | 1440: [missing-text] 7/70 live text runs not visible on preview: "BMW X5", "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene ; 768: [missing-text] 7/70 live text ru |
| /de/neufahrzeuge/x/suv/bmw-x5 | differences remain | 1440, 768, 390 | 88% / 97% / 89% | 1440: [height] preview 13529px vs live 15418px (88%); 1440: [layout] 12/96 text blocks placed differently: "BMW X5": ypos 57%/3% / "Mehr anzeigen": cx 688/928 / "Mehr digitale Highlights": cx 206/720 / "Variabel ohne Kom |
| /de/neufahrzeuge/x/x1/bmw-x1-technische-daten | match | 1440, 768, 390 | 100% / 100% / 92% | – |
| /de/neufahrzeuge/x/x1/bmw-x1 | differences remain | 1440, 768, 390 | 99% / 100% / 95% | 1440: [typography] 23 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X1 xDrive23i": size 20/15, weight 300/700 / "Gewerbekunden": size 18/20 / "3; 1440: [layout] 36/104 text blocks place |
| /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten | differences remain | 1440, 768, 390 | 99% / 98% / 90% | 1440: [missing-text] 11/87 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve; 768: [missing-text] 11/87 live text r |
| /de/neufahrzeuge/x/x3/bmw-x3-phev | differences remain | 1440, 768, 390 | 95% / 93% / 90% | 1440: [typography] 6 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X3 30e xDrive": size 20/15, weight 300/700 / "Preisliste BMW X3 Plug-in-Hybrid": si; 1440: [layout] 11/100 text blocks place |
| /de/neufahrzeuge/x/x3/bmw-x3-technische-daten | differences remain | 1440, 768, 390 | 100% / 100% / 91% | 1440: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "gemäß Ökobilanzstudie zum P; 768: [missing-text] 7/78 live text ru |
| /de/neufahrzeuge/x/x3/bmw-x3 | differences remain | 1440, 768, 390 | 100% / 100% / 99% | 1440: [typography] 19 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X3 20 xDrive": size 20/15, weight 300/700 / "Gewerbekunden": size 18/20 / "529,00 €/; 1440: [layout] 19/115 text blocks place |
| /de/neufahrzeuge/x/x6/bmw-x6-technische-daten | match | 1440, 768, 390 | 98% / 99% / 90% | – |
| /de/neufahrzeuge/x/x6/bmw-x6 | differences remain | 1440, 768, 390 | 100% / 100% / 95% | 1440: [image-geometry] 9 images sized differently (preview/live): #20 718x479/400x266, #23 400x267/718x479, #24 718x479/400x266, #25 718x479/400x266, #26 400x267/718x478; 1440: [broken-images] 1: https://bmw.scene7.com/i |
| /de/neufahrzeuge/x/x7/bmw-x7-technische-daten | differences remain | 1440, 768, 390 | 98% / 99% / 90% | 1440: [missing-text] 6/71 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene Reichweite; 768: [missing-text] 6/71 live text ru |
| /de/neufahrzeuge/x/x7/bmw-x7 | differences remain | 1440, 768, 390 | 98% / 95% / 91% | 1440: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW X7 xDrive40i": size 20/15, weight 300/700 / "Ihr Assistent für entspanntes Re; 1440: [layout] 37/110 text blocks place |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster | differences remain | 1440, 768, 390 | 95% / 95% / 91% | 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Z4 sDrive30i": size 20/15, weight 300/700 / "Preisliste BMW Z4 Roadster": siz; 1440: [layout] 12/74 text blocks placed |
| /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten | match | 1440, 768, 390 | 100% / 100% / 91% | – |
| /de/publicpools/sitemap/sitemap | differences remain | 1440, 768, 390 | 94% / 95% / 61% | 390: [height] preview 974px vs live 1593px (61%); 390: [typography] 6 runs differ: "Kontakt": size 14/19, weight 500/300 / "BMW erleben": size 14/19, weight 500/300 / "Service- & Dienstleistungen": size 14/19, weight 500 |
| /de/services-and-workshop/allgemeine-versicherungsbedingungen | differences remain | 1440, 768, 390 | 100% / 100% / 68% | 1440: [typography] 3 runs differ: "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB für Fahrzeuge b": align start/center / "Repair Inclusive AVB f; 768: [typography] 3 runs differ: "Repai |
| /de/shop-online/bmw-angebote | differences remain | 1440, 768, 390 | 119% / 94% / 89% | 1440: [height] preview 13479px vs live 11357px (119%); 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Gewer |
| /de/shop-online/bmw-offers | differences remain | 1440, 768, 390 | 118% / 94% / 89% | 1440: [height] preview 13541px vs live 11433px (118%); 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Priva |
| /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales | differences remain | 1440, 768, 390 | 96% / 94% / 91% | 1440: [image-geometry] 3 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #8 529x432/1440x66; 768: [layout] 18/65 text blocks placed differently: "Ihre Vorteile": cx -26/59 / "Top-Themen" |
| /de/topics/fascination-bmw/events/quiztaxi2024 | differences remain | 1440, 768, 390 | 95% / 91% / 82% | 390: [height] preview 2871px vs live 3507px (82%) |
| /de/topics/fascination-bmw/events/vip-experience | differences remain | 1440, 768, 390 | 100% / 100% / 83% | 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 / "VIP Experience Biathlon auf Sc": w 512/381 / "Shuttle-Service im vollelektri": w 1248/674; 390: [height] preview 2988px vs live 3591px  |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon | differences remain | 1440, 768, 390 | 98% / 89% / 89% | 768: [height] preview 6507px vs live 7284px (89%); 768: [layout] 9/59 text blocks placed differently: "Schweden": x 696/738 / "Österreich": x 696/738 / "Frankreich": x 696/738 / "Deutschland": x 696/738 / "Tschechien": x |
| /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln | differences remain | 1440, 768, 390 | 89% / 84% / 87% | 1440: [height] preview 4384px vs live 4948px (89%); 768: [height] preview 4820px vs live 5750px (84%) |
| /de/topics/faszination-bmw/events/bmw-golfsport | differences remain | 1440, 768, 390 | 98% / 97% / 81% | 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 / "BMW International Open.": w 400/262 / "Friends of the Brand.": w 400/218; 390: [height] preview 3099px vs live 3837px (81%) |
| /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand | differences remain | 1440, 768, 390 | 95% / 95% / 83% | 390: [height] preview 3492px vs live 4232px (83%) |
| /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup | differences remain | 1440, 768, 390 | 88% / 89% / 80% | 1440: [height] preview 2818px vs live 3217px (88%); 1440: [layout] 10/10 text blocks placed differently: "BMW Golf Cup.": w 512/295 / "Er ist die größte internationa": x 96/308, w 1248/824 / "Ein Profi bei einem Major-Tu |
| /de/topics/faszination-bmw/events/kulturelles-engagement | differences remain | 1440, 768, 390 | 90% / 136% / 90% | 1440: [height] preview 7437px vs live 8269px (90%); 1440: [layout] 19/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 / "Die Kulturförderung der BMW Gr": x 96/308, w 1248/824 / "Zur Kulturbrosch |
| /de/topics/faszination-bmw/events/wintersport | differences remain | 1440, 768, 390 | 93% / 89% / 76% | 1440: [layout] 9/30 text blocks placed differently: "Starker Partner des Winterspor": x 96/308, w 1248/522 / "Freuen Sie sich auf einen beso": x 96/308, w 1248/824 / "In diese; 768: [height] preview 7234px vs live 8147px |
| /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal | differences remain | 1440, 768, 390 | 90% / 84% / 86% | 1440: [height] preview 4099px vs live 4573px (90%); 1440: [layout] 10/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 / "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 / "Ein Sieggarant auf der ganze |
| /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon | differences remain | 1440, 768, 390 | 83% / 94% / 82% | 1440: [height] preview 2686px vs live 3220px (83%); 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 / "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/start / "Lena Ge |
| /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs | differences remain | 1440, 768, 390 | 84% / 81% / 85% | 1440: [height] preview 3257px vs live 3875px (84%); 1440: [layout] 8/10 text blocks placed differently: "Der Bob- und Schlittenverband ": x 96/308, w 1248/824 / "Die deutschen Rennrodler start": x 96/308, w 1248/824 / "D |
| /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge | differences remain | 1440, 768, 390 | 93% / 92% / 89% | 768: [layout] 29/111 text blocks placed differently: "Konfigurator": cx 174/284 / "Gebietsleiterin": w 113/648 / "Hamburg": w 74/648 / "Mobil: +49 151 60510221": w 194/648 / ; 390: [height] preview 7945px vs live 8959px  |
| /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales | differences remain | 1440, 768, 390 | 96% / 94% / 92% | 1440: [image-geometry] 3 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #8 529x432/1440x66; 768: [layout] 19/70 text blocks placed differently: "Ihre Vorteile": cx -186/59 / "Top-Themen |
| /de/topics/faszination-bmw/sport-events/weltcup | differences remain | 1440, 768, 390 | 125% / 91% / 79% | 1440: [height] preview 4298px vs live 3433px (125%); 1440: [layout] 5/8 text blocks placed differently: "BMW WeltcupHeroes 2025.": w 512/274 / "BMW Weltcup Heroes Ruhpolding ": x 96/732, w 1248/506, ypos 40%/30% / "BMW p |
| /de/topics/neuwagen/gewaehrleistung | differences remain | 1440, 768, 390 | 97% / 96% / 92% | 1440: [typography] 13 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) / "Erweiterte Batteriegewährleistung": align start/center / "BMW Qualitätsbrief": siz; 1440: [layout] 10/58 text blocks placed |
| /de/topics/service-zubehoer/bmw-security | differences remain | 1440, 768, 390 | 97% / 93% / 89% | 1440: [layout] 11/40 text blocks placed differently: "BMW Security": w 512/278 / "Sie fahren, wir schützen.": w 512/253 / "BMW Security hilft Ihnen dabei": x 96/308, w 1248/82; 768: [layout] 7/40 text blocks placed diffe |
| /de/topics/service-zubehoer/bmw-service/repair-inclusive | differences remain | 1440, 768, 390 | 93% / 90% / 89% | 1440: [layout] 15/102 text blocks placed differently: "BMW Service": x 96/0 / "Proactive Care": cx 314/218 / "Service Inclusive": cx 448/352 / "Repair Inclusive": cx 588/492 /; 768: [layout] 15/102 text blocks placed dif |
| /de/topics/service-zubehoer/bmw-service/rueckrufe | differences remain | 1440, 768, 390 | 90% / 85% / 83% | 1440: [height] preview 3695px vs live 4115px (90%); 1440: [layout] 11/20 text blocks placed differently: "Häufige Kundenfragen zu Rückru": cx 243/614 / "Weitere Informationen zum TAKA": cx 561/826 / "BMW Partner": cx 114 |
| /de/topics/service-zubehoer/financial-services/bmw-financial-services | differences remain | 1440, 768, 390 | 104% / 99% / 93% | 1440: [typography] 8 runs differ: "Leasing oder Finanzierung": align start/center / "Aktuelle Angebote": color rgb(38, 38, 38)/rgb(102, 102, 102) / "Mehr zum BMW Leasing": color r; 1440: [layout] 24/125 text blocks place |
| /de/topics/service-zubehoer/financial-services/bmw-finanzierung | differences remain | 1440, 768, 390 | 105% / 100% / 94% | 1440: [layout] 19/97 text blocks placed differently: "BMW Finanzierung": cx 172/76 / "Finanzierungsupgrades": cx 347/251 / "Aktuelle Angebote": cx 522/426 / "Support": cx 640/; 768: [layout] 14/97 text blocks placed diff |
| /de/topics/service-zubehoer/financial-services/bmw-leasing | differences remain | 1440, 768, 390 | 103% / 88% / 88% | 1440: [layout] 28/166 text blocks placed differently: "Ihre Vorteile": cx 147/51 / "BMW Leasing": cx 263/167 / "BMW Leasing Upgrades": cx 422/326 / "BMW Versicherungen": cx 60; 768: [height] preview 28934px vs live 32719 |
| /de-de/shop-online/bmw-business-offers | differences remain | 1440, 768, 390 | 119% / 94% / 89% | 1440: [height] preview 13479px vs live 11357px (119%); 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) / "BMW Modelle mit Verbrennungsmotor": align start/center / "Gewer |

## Per page details (fixes applied + remaining)
### /de/bmw-alpina
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 83% / 86%
- blocks: media, scroll-navigation, media-gallery, columns, media-showcase, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R2: crops/ratios per breakpoint; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 8635px vs live 9644px (90%)
  - 1440: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 1440: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 35/48, case none/uppercase | "GRAND TOURING":
  - 1440: [layout] 8/24 text blocks placed differently: "Informiert bleiben": cx 184/1298 | "Ein neues Kapitel beginnt": w 1248/318 | "Der Vision BMW ALPINA lädt ein": w 1248/506 
  - 768: [height] preview 8238px vs live 9886px (83%)
  - 768: [missing-text] 29/53 live text runs not visible on preview: "elevating", "journeys", "Anfang einer Reise", "1965 gründete Burkard Bovensiepen die Ma"
  - 768: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 29/42, case none/uppercase | "GRAND TOURING":
  - 768: [layout] 9/24 text blocks placed differently: "Informiert bleiben": cx 130/628 | "Ein neues Kapitel beginnt": w 672/289 | "Der Vision BMW ALPINA lädt ein": w 672/266 | "
  - 768: [image-geometry] 5 images sized differently (preview/live): #2 768x432/334x241, #4 768x336/300x400, #16 300x400/768x772, #19 768x768/300x400, #20 768x768/300x400
  - 390: [height] preview 8867px vs live 10316px (86%)
  - 390: [missing-text] 3/27 live text runs not visible on preview: "elevating", "journeys", "Volume"
  - 390: [typography] 6 runs differ: "Informiert bleiben": color rgb(255, 255, 255)/rgb(15, 30, 40) | "HERKUNFT, DIE VERPFLICHTET": size 28/35, case none/uppercase | "GRAND TOURING":
  - 390: [layout] 3/24 text blocks placed differently: "Informiert bleiben": cx 195/290 | "Ein neues Kapitel beginnt": w 342/261 | "GRAND TOURING": w 342/212, ypos 43%/36%
  - 390: [image-geometry] 6 images sized differently (preview/live): #2 390x693/334x181, #4 390x520/300x400, #10 300x400/390x392, #12 342x342/390x585, #13 390x585/300x400

### /de/bmw-financial-services-overview/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 112% / 107% / 98%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, content-table, columns, model-card, disclaimer, cards-quicklink, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 17819px vs live 15957px (112%)
  - 1440: [layout] 20/179 text blocks placed differently: "4. Bestellen Sie Ihren BMW.": w 290/221 | "BMW Leasing Care Paket": w 312/232 | "Ratenschutzversicherung": w 288/204 | "
  - 1440: [image-geometry] 26 images sized differently (preview/live): #2 1440x630/270x179, #7 294x196/400x266, #10 400x267/718x477, #11 718x477/400x266, #14 400x267/612x500
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/648x431, #10 672x448/382x254, #11 382x254/672x447, #14 672x448/672x549, #15 907x741/648x486
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/326x217, #14 342x228/342x279, #15 616x503/326x490, #16 342x342/326x490, #17 342x342/283x212

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
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 95% / 93%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 15/144 text blocks placed differently: "Proactive Care": cx -348/67 | "Service Inclusive": cx -225/190 | "Repair Inclusive": cx -99/316 | "Unfall- und Pannenhil

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-gebrauchtwagen
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 81%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 2988px vs live 3709px (81%)

### /de/bmw-service-hub/bmw-service-inclusive-kalkulator-neuwagen
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 81%
- blocks: embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 390: [height] preview 3040px vs live 3769px (81%)

### /de/bmw-service-hub/bmw-service/unfall-pannenhilfe
- status: differences remain; widths: 1440, 768, 390; height ratio: 112% / 104% / 101%
- blocks: hero-teaser, content-navigation, content-table, tabs, disclaimer, columns, accordion, icon-teaser, download
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R2: tab layout at 768/390; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule
- remaining: 
  - 1440: [height] preview 12134px vs live 10870px (112%)
  - 1440: [layout] 18/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 96/0 | "BMW Service": cx 387/291 | "Proactive Care": cx 510/414 | "Service Inclusive": cx 644
  - 1440: [image-geometry] 2 images sized differently (preview/live): #6 1248x1248/1440x632, #7 1440x630/612x408
  - 768: [typography] 8 runs differ: "BMW Service": color rgb(102, 102, 102)/rgb(38, 38, 38) | "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW Pannenhilfe.": 
  - 768: [layout] 16/90 text blocks placed differently: "Unfall- und Pannenhilfe": x 47/-1 | "BMW Service": cx 99/51 | "Proactive Care": cx 212/164 | "Service Inclusive": cx 335/
  - 390: [typography] 7 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW Pannenhilfe.": align center/start | "Schnell wieder mobil.": align center

### /de/campaigns/bmw-fuer-geschaeftskunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 92%
- blocks: hero-teaser, content-navigation, card-list, carousel, columns, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 7 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ob Sie freiberuflich tätig sind, ein": size 28/20, weight 300/700 | "Monatliche Ra
  - 1440: [image-geometry] 3 images sized differently (preview/live): #2 376x167/296x132, #3 376x167/296x132, #4 376x167/296x132
  - 768: [typography] 7 runs differ: "Leasingangebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ob Sie freiberuflich tätig sind, ein": size 25/18, weight 300/700 | "Monatliche Ra
  - 768: [layout] 16/69 text blocks placed differently: "Angebot anfordern": cx 385/133 | "Attraktive Bedingungen für das": x 138/190 | "Corporate-Level Service und sp": x 138/19
  - 768: [image-geometry] 3 images sized differently (preview/live): #2 648x288/509x226, #3 648x288/509x226, #4 648x288/509x226
  - 390: [typography] 6 runs differ: "Ob Sie freiberuflich tätig sind, ein": size 23/17, weight 300/700 | "Monatliche Rate": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Gesamtpreis":
  - 390: [layout] 10/66 text blocks placed differently: "Attraktive Bedingungen für das": x 48/92 | "Corporate-Level Service und sp": x 48/92 | "Nahtlose Mobilitätslösungen fü": 

### /de/campaigns/hvo100-erneuerbarer-diesel
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 91% / 87%
- blocks: hero-teaser, text-media-teaser, icon-teaser, accordion, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 4/31 text blocks placed differently: "HVO100 – der hochwertige, erne": w 512/384 | "Ihr BMW Diesel ist bereit für ": w 512/389 | "Hier überprüfen": cx 177/402 |
  - 768: [layout] 5/31 text blocks placed differently: "Gründe für die Verwendung von ": w 616/464 | "Eine saubere Lösung für Diesel": w 616/449 | "HVO100 ist geruchsneutral und 
  - 390: [height] preview 6200px vs live 7131px (87%)

### /de/digital-services/bmw-connecteddrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, icon-teaser, columns, content-table, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 18 images sized differently (preview/live): #3 294x196/1440x480, #4 294x196/1440x480, #5 294x196/1440x480, #8 1248x416/270x180, #9 718x478/270x180
  - 768: [image-geometry] 16 images sized differently (preview/live): #3 672x448/768x768, #4 672x448/768x768, #5 672x448/768x768, #8 672x672/648x431, #9 382x255/648x433
  - 390: [image-geometry] 7 images sized differently (preview/live): #3 342x228/390x390, #4 342x228/390x390, #5 342x228/390x390, #8 342x342/326x217, #11 342x229/342x343

### /de/digital-services/bmw-digital-key
- status: differences remain; widths: 1440, 768, 390; height ratio: 104% / 105% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 4 images sized differently (preview/live): #9 1440x480/718x479, #10 1440x480/376x250, #11 1440x480/376x250, #12 718x478/376x250
  - 768: [image-geometry] 4 images sized differently (preview/live): #9 768x768/382x255, #10 768x768/648x431, #11 768x768/648x431, #12 382x255/648x431
  - 390: [image-geometry] 2 images sized differently (preview/live): #10 390x390/342x228, #11 390x390/326x217

### /de/digital-services/bmw-entertainment
- status: differences remain; widths: 1440, 768, 390; height ratio: 104% / 101% / 86%
- blocks: hero-teaser, disclaimer, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 390: [height] preview 5731px vs live 6629px (86%)

### /de/digital-services/bmw-idrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 90%
- blocks: hero-teaser, disclaimer, content-navigation, video, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 3 images sized differently (preview/live): #4 1248x546/376x251, #10 400x267/718x479, #16 612x408/376x250
  - 768: [image-geometry] 3 images sized differently (preview/live): #4 672x294/648x432, #10 672x448/382x255, #14 382x255/648x432
  - 390: [height] preview 7306px vs live 8136px (90%)

### /de/digital-services/bmw-intelligent-personal-assistant
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 92% / 89%
- blocks: hero-teaser, video, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 5 images sized differently (preview/live): #2 1440x630/1248x702, #3 1248x702/718x539, #4 1248x702/718x539, #7 718x478/376x251, #8 718x478/376x250
  - 768: [image-geometry] 5 images sized differently (preview/live): #2 768x336/672x378, #3 672x378/382x287, #4 672x378/382x287, #7 382x255/648x432, #8 382x255/648x431
  - 390: [height] preview 8022px vs live 9024px (89%)
  - 390: [image-geometry] 3 images sized differently (preview/live): #2 390x488/390x219, #3 390x219/390x293, #4 390x219/390x293

### /de/digital-services/bmw-maps
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 109% / 90%
- blocks: hero-teaser, disclaimer, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 9/40 text blocks placed differently: "BMW Maps.": w 512/239 | "Navigieren: intuitiv und komfo": w 612/232 | "Erleben Sie mit BMW Maps Navig": w 612/294 | "Nützl
  - 1440: [image-geometry] 4 images sized differently (preview/live): #2 612x407/294x196, #3 612x407/294x196, #4 612x407/294x196, #5 612x407/294x196
  - 768: [layout] 10/40 text blocks placed differently: "Connected Navigation.": cx 210/384 | "Connected Charging.": cx 558/384 | "Navigieren: intuitiv und komfo": w 672/210 | "E
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x216, #4 672x447/324x216, #5 672x447/324x216
  - 390: [height] preview 8378px vs live 9337px (90%)

### /de/elektroauto
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 107% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 29/81 text blocks placed differently: "Modelle": cx -634/66 | "Vorteile von Elektroautos": cx -505/195 | "E-Auto Batterie und Technologi": cx -299/401 | "Reichw
  - 768: [image-geometry] 7 images sized differently (preview/live): #2 768x336/308x251, #17 308x251/382x215, #20 324x215/672x447, #21 672x447/382x254, #27 672x447/324x215

### /de/elektroauto/batterie-technologie
- status: differences remain; widths: 1440, 768, 390; height ratio: 110% / 101% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, columns, tabs, multi-content-gallery, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/400x266, #5 400x267/1440x480, #7 1248x829/1440x480, #8 294x196/718x477, #17 718x479/270x180
  - 768: [layout] 23/95 text blocks placed differently: "Die Batterie": cx -236/58 | "Kosten": cx -151/143 | "Optimierung der Lebensdauer": cx -9/285 | "Batteriegewährleistung": 
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/672x447, #5 672x448/768x768, #7 672x446/768x768, #8 672x448/382x254, #17 382x255/648x432
  - 390: [image-geometry] 6 images sized differently (preview/live): #2 390x520/342x227, #5 342x228/390x390, #7 342x227/390x390, #25 342x227/390x390, #26 390x260/390x390

### /de/elektroauto/bmw-charging-support
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 94% / 80%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 7 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Bedienungsanleitung": size 18/15 | "Vorvertragliche Transparenzinformati": si
  - 1440: [layout] 6/23 text blocks placed differently: "BMW Wallbox Professional.": w 466/343 | "BMW Vehicle-to-Load (V2L) Adap": w 466/354 | "BMW Ladekabel Mode 3.": w 466/316 |
  - 768: [typography] 7 runs differ: "Wallbox Professional": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Bedienungsanleitung": size 17/14 | "Vorvertragliche Transparenzinformati": si
  - 768: [layout] 7/23 text blocks placed differently: "Wallbox Professional": cx -247/86 | "Multifunction Charger": cx -90/243 | "Vehicle-to-Load Adapter": cx 82/415 | "Ladekabe
  - 390: [height] preview 4797px vs live 5980px (80%)
  - 390: [typography] 6 runs differ: "Bedienungsanleitung": size 16/14 | "Vorvertragliche Transparenzinformati": size 16/14, align start/center | "Infobroschüre Bidirektionales Laden

### /de/elektroauto/elektroauto-kosten
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 107% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1440x630/367x300, #17 367x300/718x477, #19 718x477/1440x477, #20 1440x480/718x479, #23 718x478/270x180
  - 768: [layout] 23/70 text blocks placed differently: "E-Autos im Preisvergleich": cx -276/102 | "Elektroauto leasen": cx -111/267 | "Förderung E-Autos": cx 34/412 | "Wallbox K
  - 768: [image-geometry] 8 images sized differently (preview/live): #2 768x336/308x251, #19 324x215/768x512, #20 768x512/324x216, #23 382x255/648x432, #27 672x448/324x215

### /de/elektroauto/elektroauto-reichweite
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 110% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 18/59 text blocks placed differently: "Reichweitenübersicht": cx -62/89 | "E-Auto Analyse": cx 82/233 | "Reichweite optimieren": cx 227/378 | "Maximale Reichwei
  - 768: [image-geometry] 8 images sized differently (preview/live): #2 768x336/308x251, #17 308x251/648x431, #21 672x448/382x255, #25 324x216/648x432, #29 672x448/324x215

### /de/elektroauto/elektroautos-vorteile
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 96% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 7 images sized differently (preview/live): #2 1440x630/718x479, #4 718x477/376x251, #7 400x267/718x477, #9 718x477/376x250, #12 400x267/718x479
  - 768: [image-geometry] 7 images sized differently (preview/live): #2 768x336/382x255, #4 382x254/648x433, #7 672x448/382x254, #9 382x254/648x431, #12 672x448/382x255

### /de/elektroauto/foerderungen
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 89% / 89%
- blocks: hero-teaser, icon-teaser, carousel, disclaimer, model-overview, cards-quicklink
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [height] preview 6256px vs live 7062px (89%)
  - 1440: [layout] 15/69 text blocks placed differently: "Bruttogehalt: 6.500,00 €": w 175/296 | "+ GWV: 376,77 €": w 117/296 | "- Sozialabgaben: 1.302,25 €": w 194/296 | "- Steue
  - 768: [height] preview 7395px vs live 8338px (89%)
  - 768: [layout] 24/69 text blocks placed differently: "Neue Preisobergrenze.": cx 211/385 | "Nutzen Sie ihren Dienstwagen a": cx 210/384 | "Neue Abschreibungsmöglichkeit.": cx 
  - 390: [height] preview 8711px vs live 9787px (89%)
  - 390: [layout] 13/69 text blocks placed differently: "BMW Modelle": cx 308/211 | "Bruttogehalt: 6.500,00 €": w 161/294 | "+ GWV: 376,77 €": w 110/294 | "- Sozialabgaben: 1.302
  - 390: [image-geometry] 2 images sized differently (preview/live): #4 318x141/257x210, #6 283x231/390x71

### /de/elektroauto/foerderungen-privatkunden
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 89% / 87%
- blocks: hero-teaser, icon-teaser, columns, model-overview, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells
- remaining: 
  - 1440: [height] preview 8587px vs live 9787px (88%)
  - 1440: [layout] 11/78 text blocks placed differently: "AI-generated content": x -1/1395 | "- Batterieelektrisch (BEV)": w 208/400 | "- Plug-in-Hybrid (PHEV)": w 198/400 | "Elek
  - 768: [height] preview 10768px vs live 12067px (89%)
  - 768: [image-geometry] 3 images sized differently (preview/live): #8 421x344/768x90, #9 421x344/324x216, #10 421x344/324x216
  - 390: [height] preview 11310px vs live 12930px (87%)

### /de/elektroauto/gebrauchte-elektroautos
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 95% / 92%
- blocks: hero-teaser, content-navigation, columns, icon-teaser, model-overview, disclaimer, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 10 images sized differently (preview/live): #2 1440x630/718x477, #3 718x477/475x388, #6 529x432/1440x104, #7 529x432/718x478, #8 529x432/718x477
  - 768: [layout] 12/84 text blocks placed differently: "BMW Premium Selection": cx -161/14 | "Vorteile": cx -34/141 | "BMW Modelle": cx 58/233 | "Gebrauchte Batterien": cx 195/3
  - 768: [image-geometry] 10 images sized differently (preview/live): #2 768x336/382x254, #3 382x254/416x339, #5 421x344/768x97, #8 421x344/324x215, #9 421x344/324x215
  - 390: [image-geometry] 4 images sized differently (preview/live): #2 390x520/342x227, #3 342x227/257x210, #5 283x231/390x67, #11 283x231/342x342

### /de/elektroauto/home-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 95% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, carousel, columns, text-media-teaser, download, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 13 images sized differently (preview/live): #2 1440x630/1440x480, #4 294x196/1440x480, #12 718x479/294x196, #13 1440x630/718x479, #14 718x479/1440x627
  - 768: [layout] 13/113 text blocks placed differently: "Zum Installationspartner": cx 253/300 | "Fachgerechte Installation Ihre": w 530/362 | "Eine App. Alle Ladefunktionen.": 
  - 768: [image-geometry] 10 images sized differently (preview/live): #2 768x336/768x768, #4 672x448/768x768, #12 382x255/672x448, #13 768x768/382x255, #14 382x255/768x768
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/390x390, #4 342x228/390x390, #13 390x585/342x228, #14 342x229/390x583, #15 342x342/342x228

### /de/elektroauto/plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 106% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, all-models, columns, icon-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: 12/16 chips, series line-height, filter weight, M logo; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "Flexibel. Effizient. Kraftvoll.": size 18/23 | "PHEV Modelle": color rgb(102, 102, 102)/rgb(38, 38, 38) | "So funktioniert ein Hybrid-Auto": ali
  - 1440: [image-geometry] 5 images sized differently (preview/live): #2 1440x630/367x300, #16 367x300/612x407, #18 612x407/400x267, #21 400x267/718x479, #27 718x479/294x195
  - 768: [typography] 5 runs differ: "Flexibel. Effizient. Kraftvoll.": size 17/20 | "PHEV Technologie": color rgb(102, 102, 102)/rgb(38, 38, 38) | "So funktioniert ein Hybrid-Auto":
  - 768: [layout] 23/68 text blocks placed differently: "PHEV Modelle": cx -465/-379 | "PHEV Technologie": cx -336/-250 | "So funktioniert ein Hybrid-Aut": cx -155/-69 | "Die Vor
  - 768: [image-geometry] 6 images sized differently (preview/live): #2 768x336/308x251, #18 324x215/672x449, #21 672x448/382x255, #28 672x446/324x215, #29 672x447/324x216

### /de/elektroauto/public-charging
- status: differences remain; widths: 1440, 768, 390; height ratio: 121% / 103% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, multi-content-gallery, columns, all-models, video, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: 12/16 chips, series line-height, filter weight, M logo; R0: poster until first frame; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 17046px vs live 14035px (121%)
  - 1440: [layout] 21/81 text blocks placed differently: "Ihre erweiterte Ladeinfrastruk": w 616/336 | "BMW Charging erhält zweimal di": x 772/878 | "Wir freuen uns über die Ausze
  - 1440: [image-geometry] 18 images sized differently (preview/live): #2 1440x630/1440x480, #4 294x294/1440x480, #5 294x294/1440x480, #6 367x300/294x294, #7 367x300/294x294
  - 768: [layout] 17/86 text blocks placed differently: "Über 1.135.000 Ladepunkte für ": w 530/316 | "Laden an High-Power-Ladestatio": w 530/348 | "Attraktive Stromtarife.": x 1
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x336/768x768, #4 382x382/768x768, #5 382x382/768x768, #6 308x251/382x382, #7 308x251/382x382
  - 390: [image-geometry] 7 images sized differently (preview/live): #2 390x520/390x390, #6 224x183/342x342, #7 224x183/342x342, #21 390x260/224x183, #22 390x260/224x183

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
  - 1440: [layout] 10/51 text blocks placed differently: "Barrierefreiheit.": w 1248/303 | "Online-Bestellung von Fahrzeug": w 1248/447 | "BMW ConnectedDrive.": w 1248/286 | "Zube
  - 768: [height] preview 5625px vs live 7293px (77%)
  - 768: [layout] 46/51 text blocks placed differently: "Barrierefreiheit.": x 48/164, w 672/245 | "Die BMW AG (nachfolgend „BMW")": x 48/164, w 672/440 | "www.bmw.de": x 48/392 
  - 390: [layout] 6/51 text blocks placed differently: "Barrierefreiheit.": w 342/225 | "Online-Bestellung von Fahrzeug": w 342/229 | "BMW ConnectedDrive.": w 342/234 | "Zubehör 

### /de/footer/metanavigation/bmw-betrugsfaelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 85% / 79% / 98%
- blocks: –
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content
- remaining: 
  - 1440: [height] preview 3402px vs live 4022px (85%)
  - 1440: [layout] 33/36 text blocks placed differently: "Was ist Identitätsbetrug?": x 96/308, w 1248/312 | "Es handelt sich um Identitätsb": x 96/308, w 1248/824 | "Wie erkenne 
  - 768: [height] preview 4139px vs live 5246px (79%)
  - 768: [layout] 33/36 text blocks placed differently: "Was ist Identitätsbetrug?": x 48/164, w 672/283 | "Es handelt sich um Identitätsb": x 48/164, w 672/440 | "Wie erkenne ic

### /de/footer/metanavigation/data-privacy
- status: differences remain; widths: 1440, 768, 390; height ratio: 40% / 44% / 35%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 2616px vs live 6591px (40%)
  - 768: [height] preview 2789px vs live 6281px (44%)
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
  - 768: [height] preview 1845px vs live 2094px (88%)
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
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 102% / 90%
- blocks: hero-stage, disclaimer, cards-quicklink, hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 1440x630/1440x482, #5 1440x480/718x479
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 390x520/390x391, #5 390x390/342x228

### /de/konfigurator
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 96%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: 
  - 1440: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
  - 768: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
  - 390: [typography] 8 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/rg
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/landingpage/bmw-fahrfreude-gewinnen
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 95% / 84%
- blocks: hero-teaser, disclaimer, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 3404px vs live 4069px (84%)

### /de/landingpage/shops
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 99% / 84%
- blocks: columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 7/24 text blocks placed differently: "BMW Connected Drive.": w 400/240 | "Zubehör.": x 96/308 | "Im BMW Online Store für Zubehö": x 96/308 | "BMW Zubehör finden
  - 390: [height] preview 4121px vs live 4899px (84%)

### /de/mehr-bmw/bmw-efficientdynamics/pkw-envkv
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 95% / 77%
- blocks: hero-teaser, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 390: [height] preview 2522px vs live 3259px (77%)

### /de/mehr-bmw/bmw-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 142% / 81%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 768: [height] preview 4738px vs live 3344px (142%)
  - 768: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 768: [layout] 7/13 text blocks placed differently: "BMW GEBRAUCHTE AUTOMOBILE.": cx 48/383 | "BMW JUNGE GEBRAUCHTE": w 672/261 | "Mit den Jungen Gebrauchten von": w 672/324 |
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x446/324x215, #4 672x448/324x216, #5 672x448/324x216
  - 390: [height] preview 3565px vs live 4414px (81%)
  - 390: [missing-text] 2/15 live text runs not visible on preview: "WARNUNG: VERDÄCHTIGE ANGEBOTE", "AI-generated content"
  - 390: [layout] 5/13 text blocks placed differently: "BMW GEBRAUCHTE AUTOMOBILE.": cx 24/195, ypos 19%/9% | "BMW JUNGE GEBRAUCHTE": w 342/251 | "BMW PREMIUM SELECTION": w 342/2

### /de/mehr-bmw/bmw-gebrauchte/europlusgarantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 130% / 89%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [height] preview 6148px vs live 4731px (130%)
  - 768: [layout] 11/35 text blocks placed differently: "IHRE VORTEILE AUF EINEN BLICK.": w 672/480 | "Download of current EUROPlus w": x 48/396 | "Sie wollen noch länger die unb
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x215, #4 672x447/324x215, #5 672x449/324x216
  - 390: [height] preview 5774px vs live 6514px (89%)

### /de/mehr-bmw/bmw-gebrauchte/garantie
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 128% / 87%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 15/43, color rgb(102, 102, 102)/rgb(25
  - 1440: [layout] 5/31 text blocks placed differently: "AI-generated content": x -1/1395 | "BMW PREMIUM SELECTION GARANTIE": x 738/104, ypos 17%/9% | "DIE NEUEN GEBRAUCHTEN.": w 
  - 768: [height] preview 6010px vs live 4707px (128%)
  - 768: [typography] 4 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "BMW PREMIUM SELECTION GARANTIE.": size 14/35, color rgb(102, 102, 102)/rgb(25
  - 768: [layout] 12/31 text blocks placed differently: "BMW PREMIUM SELECTION GARANTIE": cx 484/382 | "IHRE VORTEILE AUF EINEN BLICK.": w 672/480 | "Download of current warranty
  - 768: [image-geometry] 4 images sized differently (preview/live): #2 672x447/324x216, #3 672x447/324x215, #4 672x447/324x215, #5 672x449/324x216
  - 390: [height] preview 5639px vs live 6486px (87%)
  - 390: [missing-text] 3/31 live text runs not visible on preview: "BMW PREMIUM SELECTION GARANTIE.", "Premium Selection Garantie", "die Premium Selection Servicestelle"

### /de/mehr-bmw/bmw-gebrauchte/junge-gebrauchte
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 97% / 87%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 43/35 | "BMW Premium Selection Garantie": al
  - 1440: [layout] 6/35 text blocks placed differently: "AI-generated content": x -1/1395 | "Preisvorteil sichern": w 1248/297 | "Folgende Kriterien gelten für ": w 1248/624 | "BM
  - 768: [typography] 3 runs differ: "AI-generated content": color rgb(255, 255, 255)/rgb(38, 38, 38) | "Junge Gebrauchte von BMW.": size 35/29 | "BMW Premium Selection Garantie": al
  - 768: [layout] 4/35 text blocks placed differently: "Fahrzeug finden": cx 385/301 | "Preisvorteil sichern": w 672/248 | "BMW Service Inclusive.": w 672/210 | "BMW Junge Gebrau
  - 390: [height] preview 5345px vs live 6176px (87%)

### /de/mehr-bmw/bmw-gebrauchte/premium-selection
- status: differences remain; widths: 1440, 768, 390; height ratio: 104% / 155% / 108%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 1440: [typography] 12 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 23/28 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 1440: [layout] 4/20 text blocks placed differently: "BMW PREMIUM SELECTION.": w 512/323 | "DIE NEUEN GEBRAUCHTEN.": w 512/380 | "STANDARDS HABEN WIR AUCH. NUR ": w 1248/897 | 
  - 768: [height] preview 7094px vs live 4568px (155%)
  - 768: [missing-text] 3/23 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 768: [typography] 12 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 20/25 | "BMW Premium Selection Garantie": align start/center | "Ein Fahrzeug, auf das Sie sich verla": align star
  - 390: [missing-text] 3/21 live text runs not visible on preview: "24 MONATE BMW PREMIUM SELECTION GARANTIE", "360° FAHRZEUG CHECK.", "WARTUNGSFREI FÜR 6 MONATE / 10.000 KM."
  - 390: [typography] 11 runs differ: "DIE NEUEN GEBRAUCHTEN.": size 19/23 | "Ein Fahrzeug, auf das Sie sich verla": align start/center | "BMW Premium Selection Fahrzeuge erha": alig

### /de/mehr-bmw/bmw-individual
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 80% / 84%
- blocks: hero-teaser, content-navigation, columns, disclaimer, carousel, media-showcase
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 9 images sized differently (preview/live): #4 718x479/294x196, #10 294x196/1440x628, #11 1440x630/1248x701, #12 1248x701/294x196, #17 294x196/718x478
  - 768: [height] preview 11219px vs live 14070px (80%)
  - 768: [layout] 12/55 text blocks placed differently: "BMW M3 Competition – BMW Indiv": w 402/672 | "BMW XM 50e – BMW Individual Ja": w 339/672 | "BMW M2 CS – BMW Individual Ve
  - 768: [image-geometry] 9 images sized differently (preview/live): #2 672x378/672x895, #4 382x255/672x447, #10 672x448/768x768, #11 768x768/672x895, #17 672x448/382x254
  - 390: [height] preview 11821px vs live 14000px (84%)

### /de/mehr-bmw/bmw-special-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 95% / 86%
- blocks: hero-teaser, content-navigation, columns, carousel, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 768: [layout] 5/30 text blocks placed differently: "BMW Behördenfahrzeuge": cx -43/103 | "BMW Einsatzfahrzeuge": cx 138/284 | "BMW Sonderschutzfahrzeuge": cx 331/477 | "BMW D
  - 390: [height] preview 5329px vs live 6212px (86%)
  - 390: [layout] 4/30 text blocks placed differently: "BMW Einsatzfahrzeuge.": w 342/252 | "BMW Diplomatic Sales.": w 342/243 | "BMW Military Sales.": w 342/208 | "BMW Fahrertra

### /de/mehr-bmw/bmw-special-sales/bmw-7-protection
- status: differences remain; widths: 1440, 768, 390; height ratio: 106% / 107% / 101%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, video, tabs, multi-content-gallery, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 7/69 text blocks placed differently: "Herausragendes Protection-Konz": cx 210/385 | "Erstklassige Fahrdynamik.": cx 559/385 | "Designed to stay in Motion.": w 6
  - 768: [image-geometry] 4 images sized differently (preview/live): #6 672x447/768x768, #18 324x216/672x448, #19 324x216/672x447, #20 324x216/672x448

### /de/mehr-bmw/bmw-special-sales/bmw-diplomatic-sales
- status: match; widths: 1440, 768, 390; height ratio: 99% / 98% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, columns, icon-teaser, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: no longer collapsed by the centered-list rule; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-einsatzfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 93% / 91%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, multi-content-gallery
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: card title sizes, large-titles option
- remaining: 
  - 1440: [image-geometry] 10 images sized differently (preview/live): #14 400x267/1440x480, #15 400x267/1440x480, #16 400x267/1440x480, #17 294x196/1440x480, #18 294x196/1440x480
  - 768: [layout] 34/137 text blocks placed differently: "Maximale Sicherheit.": cx 210/384 | "Erstklassige Kosteneffizienz.": cx 559/385 | "Energieversorgung & Energieman": w 53
  - 768: [image-geometry] 5 images sized differently (preview/live): #14 672x448/768x768, #15 672x448/768x768, #16 672x448/768x768, #17 672x448/768x768, #18 672x448/768x768
  - 390: [image-geometry] 5 images sized differently (preview/live): #14 342x228/390x390, #15 342x228/390x390, #16 342x228/390x390, #17 342x228/390x390, #18 342x228/390x390

### /de/mehr-bmw/bmw-special-sales/bmw-military-sales
- status: match; widths: 1440, 768, 390; height ratio: 98% / 96% / 91%
- blocks: hero-teaser, content-navigation, icon-teaser, columns, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-sonderschutzfahrzeuge
- status: match; widths: 1440, 768, 390; height ratio: 101% / 93% / 91%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, disclaimer, columns, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: tablet width from source grid
- remaining: none

### /de/mehr-bmw/bmw-special-sales/bmw-x5-protection-vr6
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 98% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, video, multi-content-gallery, carousel, tabs, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: card title sizes, large-titles option; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 8 images sized differently (preview/live): #4 1248x702/718x478, #6 1248x830/1440x480, #8 294x196/1440x480, #16 400x267/270x180, #17 400x267/718x478
  - 768: [image-geometry] 5 images sized differently (preview/live): #6 672x447/768x768, #8 672x448/768x768, #12 324x216/648x431, #18 324x216/672x449, #19 382x255/672x449

### /de/mehr-bmw/concept-cars/bmw-speedtop
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 83% / 79%
- blocks: hero-teaser, text-media-teaser, carousel, columns, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet text width 91.67%, full-width mobile buttons; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 8605px vs live 9675px (89%)
  - 1440: [layout] 7/40 text blocks placed differently: "BMW Speedtop.": w 512/319 | "Limitiertes Sammlerstück": w 512/263 | "Ein emotionales Sammlerstück.": w 376/256 | "Mehr anz
  - 1440: [image-geometry] 13 images sized differently (preview/live): #2 1440x630/1248x702, #3 1248x702/416x520, #4 416x520/1440x631, #5 416x520/294x196, #6 1440x630/294x196
  - 768: [height] preview 9355px vs live 11285px (83%)
  - 768: [typography] 6 runs differ: "Ein echter BMW strahlt bereits im St": size 17/25, align start/center | "Adrian van Hooydonk, Leiter BMW Grou": align start/center | "Exterieur 
  - 768: [layout] 8/40 text blocks placed differently: "Ein emotionales Sammlerstück.": w 616/418 | "Mehr anzeigen": cx 148/384 | "Adrian van Hooydonk, Leiter BM": cx 237/384 | "
  - 768: [image-geometry] 11 images sized differently (preview/live): #2 768x336/672x895, #3 672x378/616x770, #5 616x770/672x447, #6 768x768/672x447, #9 672x448/672x894
  - 390: [height] preview 8214px vs live 10393px (79%)
  - 390: [typography] 6 runs differ: "Ein echter BMW strahlt bereits im St": size 16/23, align start/center | "Adrian van Hooydonk, Leiter BMW Grou": align start/center | "Exterieur 
  - 390: [layout] 5/40 text blocks placed differently: "Ein emotionales Sammlerstück.": w 342/203 | "Mehr anzeigen": cx 96/195 | "Exterieur Highlight Mittelsteg": cx 195/149 | "T
  - 390: [image-geometry] 11 images sized differently (preview/live): #3 342x192/390x488, #4 342x428/390x586, #5 342x428/342x228, #6 390x585/342x228, #9 342x228/342x455

### /de/mehr-bmw/die-exklusiven-bmw-automobile
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 102% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, model-overview, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/55 text blocks placed differently: "In jeder Facette. Bis ins letz": w 512/376 | "BMW i7 60 xDrive.": w 512/293 | "Der BMW i7 verbindet sinnliche": w 512/288
  - 1440: [image-geometry] 5 images sized differently (preview/live): #5 529x432/1440x55, #7 1248x831/718x479, #12 1248x829/718x477, #14 282x100/612x408, #16 612x406/376x251
  - 768: [typography] 10 runs differ: "In jeder Facette. Bis ins letzte Det": size 17/20 | "The i7": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Limousine (2)": color rgb(38, 38, 38)
  - 768: [layout] 8/55 text blocks placed differently: "Mehr erfahren": x 48/241 | "BMW i7 60 xDrive.": cx 384/177 | "BMW M760e xDrive.": x 48/454, w 672/234 | "Außergewöhnliche 
  - 768: [image-geometry] 12 images sized differently (preview/live): #4 421x344/768x54, #5 421x344/768x768, #6 768x768/382x255, #7 672x448/768x768, #8 768x768/324x216
  - 390: [typography] 8 runs differ: "In jeder Facette. Bis ins letzte Det": size 16/19 | "BMW i7 60 xDrive.": align center/start | "Der BMW i7 verbindet sinnliche Elega": align cent
  - 390: [image-geometry] 5 images sized differently (preview/live): #4 280x229/390x586, #8 390x585/342x228, #9 342x228/390x587, #13 390x585/342x227, #14 282x100/326x217

### /de/mehr-bmw/digital-services-act
- status: differences remain; widths: 1440, 768, 390; height ratio: 85% / 85% / 76%
- blocks: accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 4633px vs live 5480px (85%)
  - 1440: [layout] 33/37 text blocks placed differently: "1. Kontaktstelle für Kommunika": x 96/202 | "Unsere zentrale Kontaktstelle ": x 96/202 | "E-Mail: dsa.de@bmwgroup.com": x
  - 768: [height] preview 6058px vs live 7148px (85%)
  - 768: [layout] 33/37 text blocks placed differently: "1. Kontaktstelle für Kommunika": x 48/106, w 672/502 | "Unsere zentrale Kontaktstelle ": x 48/106 | "E-Mail: dsa.de@bmwgr
  - 390: [height] preview 8049px vs live 10549px (76%)
  - 390: [layout] 5/37 text blocks placed differently: "1. Kontaktstelle für Kommunika": w 342/261 | "+49-89-1250-16000": x 149/54 | "2. Transparenzberichte (Art. 1": w 342/235 |

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 84%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/17 text blocks placed differently: "Das Online-Magazin für Großkun": w 512/385 | "Fuhrparks intelligent steuern.": w 400/301 | "Fahrfreude neu definiert.": w 
  - 768: [layout] 4/17 text blocks placed differently: "Fuhrparks intelligent steuern.": w 672/267 | "Fahrfreude neu definiert.": w 672/225 | "Meilensteine einer Erfolgsgesc": w 
  - 390: [height] preview 4262px vs live 5046px (84%)

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/der-klangmeister
- status: differences remain; widths: 1440, 768, 390; height ratio: 111% / 94% / 87%
- blocks: hero-teaser, content-navigation, columns, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 12379px vs live 11145px (111%)
  - 1440: [typography] 3 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 18/28, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige
  - 1440: [layout] 13/49 text blocks placed differently: "Interview mit Renzo Vitale.": x 832/1058, w 512/274 | "Stand 2024": x 96/0 | "Startseite Großkunden": cx 329/233 | "Onlin
  - 1440: [image-geometry] 4 images sized differently (preview/live): #3 1248x1248/612x612, #4 1248x1248/612x612, #5 1248x1248/612x612, #6 1248x1248/612x612
  - 768: [typography] 4 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Ein BMW muss nicht brüllen, um geseh": size 17/25, align start/center | "Hol
  - 768: [layout] 12/49 text blocks placed differently: "Stand 2024": x 47/-1 | "Startseite Großkunden": cx 129/81 | "Online-Magazin": cx 276/228 | "Ein BMW muss nicht brüllen, u
  - 768: [image-geometry] 6 images sized differently (preview/live): #3 672x672/324x324, #4 672x672/324x324, #5 672x672/324x324, #6 672x672/324x324, #13 672x378/672x893
  - 390: [height] preview 14008px vs live 16047px (87%)
  - 390: [typography] 3 runs differ: "Ein BMW muss nicht brüllen, um geseh": size 16/23, align start/center | "Hollywood bei BMW.": align start/center | "Im Rahmen einer einzigartige

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe1-2024/nuerburgring
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 94% / 87%
- blocks: hero-teaser, link-list, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [layout] 3/20 text blocks placed differently: "Die Evolution des Fahrens.": w 672/246 | "Der Klangmeister – Interview m": w 672/423 | "Umfrage: Welche Themen wollen ": w
  - 390: [height] preview 5299px vs live 6077px (87%)

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/25-jahre-x5
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 93% / 90%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 7161px vs live 7973px (90%)

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/ausgabe2-2024/transformation-der-flotte
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 89% / 92%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 768: [height] preview 11134px vs live 12535px (89%)
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x377/672x506, #8 672x379/672x504
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x192/342x257, #8 342x193/342x257

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fahrfreude
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 86% / 89%
- blocks: hero-teaser, content-navigation, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbi
  - 768: [height] preview 8025px vs live 9315px (86%)
  - 768: [typography] 8 runs differ: "Startseite Großkunden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbi
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x378/672x896, #3 672x377/672x896
  - 390: [height] preview 9279px vs live 10454px (89%)
  - 390: [typography] 7 runs differ: "Eine zentrale Steuereinheit für die ": align start/center | "Eine neue Verbindung zum Fahrzeug.": align start/center | "Freude am Fahren, neu in
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x193/342x456, #3 342x192/342x456

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/businessclass/fuhrparkmanagement
- status: match; widths: 1440, 768, 390; height ratio: 97% / 95% / 92%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/mehr-bmw/grosskunden-behoerden/businesskunden/was-uns-bewegt
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 93% / 78%
- blocks: hero-teaser, embed, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 3292px vs live 4195px (78%)

### /de/mehr-bmw/kundenbetreuung
- status: differences remain; widths: 1440, 768, 390; height ratio: 108% / 120% / 100%
- blocks: hero-teaser, ai-entry, flexbox, accordion, columns, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 506x1044/254x524, #3 718x718/270x180
  - 768: [height] preview 7060px vs live 5872px (120%)
  - 768: [layout] 5/40 text blocks placed differently: "Helfen Sie uns, diese Seite zu": ypos 38%/45% | "Smart verbunden mit Ihrem BMW.": x 48/396, w 556/310 | "Überprüfen Sie de
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 556x1147/308x635, #3 556x556/648x433
  - 390: [typography] 4 runs differ: "Wie können wir helfen?": size 33/28 | "Sie haben weitere Fragen?": align start/center | "Smart verbunden mit Ihrem BMW.": align start/center | "
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 342x705/223x459, #3 342x342/326x218

### /de/mehr-bmw/sport-und-events/bmw-basketball
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 97% / 84%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 390: [height] preview 3886px vs live 4617px (84%)

### /de/mehr-bmw/sport-und-events/bmw-basketball/bmw-park
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 93% / 82%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 4128px vs live 5020px (82%)

### /de/mehr-bmw/sport-und-events/bmw-basketball/innovation
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 96% / 83%
- blocks: hero-teaser, link-list, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 390: [height] preview 3744px vs live 4489px (83%)

### /de/mehr-bmw/sport-und-events/bmw-basketball/urban-culture
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 94% / 84%
- blocks: hero-teaser, link-list, carousel, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame
- remaining: 
  - 390: [height] preview 4185px vs live 4973px (84%)

### /de/mehr-bmw/sport-und-events/bmw-basketball/we-care
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 83% / 81%
- blocks: hero-teaser, link-list, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 3481px vs live 3879px (90%)
  - 768: [height] preview 3535px vs live 4281px (83%)
  - 390: [height] preview 3629px vs live 4500px (81%)

### /de/mehr-bmw/sport-und-events/laufsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 92% / 83%
- blocks: hero-teaser, media, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
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
  - 390: [height] preview 2954px vs live 3623px (82%)

### /de/mehr-bmw/technology-and-innovation/bmw-heart-of-joy
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 94% / 85%
- blocks: hero-stage, video, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 1440x630/1248x702, #4 1248x702/718x479
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 768x1024/672x378, #4 672x378/382x255
  - 390: [height] preview 5015px vs live 5876px (85%)

### /de/mehr-bmw/technology-and-innovation/bmw-reifenkennzeichnung
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 93% / 88%
- blocks: hero-teaser, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: 
  - 390: [height] preview 6699px vs live 7653px (88%)

### /de/mehr-bmw/teile-und-zubehoer/bmw-zubehoer-hub
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 97% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, carousel, icon-teaser, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/376x250, #5 400x267/1440x630, #6 1440x630/270x180, #13 400x267/270x180, #23 400x267/1440x631
  - 768: [image-geometry] 12 images sized differently (preview/live): #2 768x336/648x431, #5 672x448/768x768, #6 768x768/648x433, #23 672x448/768x766, #24 768x768/324x216
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/326x217, #5 342x228/390x585, #6 390x585/326x218, #23 342x228/390x585, #24 390x585/342x228

### /de/mehr-bmw/teile-und-zubehoer/original-bmw-teile
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 114% / 102%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 23/28 | "Original BMW Classic Teile": align start/center | "IHRE VORTEILE": size 35/12, case none/up
  - 1440: [layout] 15/77 text blocks placed differently: "ORIGINAL BMW TEILE.": w 616/464 | "Wiederaufbereitete Teile": cx 406/310 | "Wiederaufbereitung": cx 588/492 | "Original B
  - 1440: [image-geometry] 17 images sized differently (preview/live): #2 188x188/376x251, #3 188x188/376x251, #4 188x188/376x250, #5 188x188/376x251, #6 188x188/376x251
  - 768: [height] preview 13227px vs live 11592px (114%)
  - 768: [typography] 4 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 20/25 | "IHRE VORTEILE": size 29/12, case none/uppercase | "Bei Verschleiß, Beschädigung oder De": a
  - 768: [layout] 30/77 text blocks placed differently: "Wiederaufbereitete Teile": cx 191/281 | "Wiederaufbereitung": cx 355/445 | "Original BMW Classic Teile": cx 525/615 | "BM
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 440x440/300x200, #3 440x440/300x200, #4 440x440/300x199, #5 440x440/300x200, #6 440x440/300x200
  - 390: [typography] 13 runs differ: "DAMIT IHR BMW EIN ORIGINAL BMW BLEIB": size 19/23 | "IHRE VORTEILE": size 28/12, case none/uppercase | "Geprüfte BMW Qualität.": align start/ce
  - 390: [layout] 9/73 text blocks placed differently: "NEU UND GENAU FÜR IHREN BMW.": ypos 25%/16% | "ES MUSS NICHT IMMER NEU SEIN.": ypos 37%/28% | "IN 5 SCHRITTEN ZU NEUER QUA
  - 390: [image-geometry] 5 images sized differently (preview/live): #2 342x342/326x218, #3 342x342/326x217, #4 342x342/326x217, #5 342x342/326x218, #6 342x342/326x218

### /de/more-bmw/sport-und-events/bmw-basketball/bmw-park
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 93% / 82%
- blocks: hero-teaser, link-list, carousel, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 4128px vs live 5020px (82%)

### /de/my-bmw-app/my-bmw-app
- status: differences remain; widths: 1440, 768, 390; height ratio: 120% / 124% / 87%
- blocks: hero-teaser, icon-teaser, media, tabs, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R2: crops/ratios per breakpoint; R2: tab layout at 768/390; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 7125px vs live 5948px (120%)
  - 1440: [layout] 27/52 text blocks placed differently: "My BMW APP.": w 512/277 | "ALLES AN EINEM ORT – MIT DER M": w 1248/442, ypos 24%/15% | "Fahrzeugstatus / Ladestatus ch": 
  - 1440: [image-geometry] 3 images sized differently (preview/live): #2 1248x833/718x479, #3 1248x693/718x410, #4 1248x831/718x478
  - 768: [height] preview 8147px vs live 6548px (124%)
  - 768: [layout] 24/52 text blocks placed differently: "Fahrzeugstatus / Ladestatus ch": x 252/80 | "Digital Key: Fahrzeug verriege": x 184/79 | "Vorklimatisieren und Vorheizen"
  - 768: [image-geometry] 5 images sized differently (preview/live): #4 672x448/324x216, #5 672x448/324x216, #6 672x448/324x216, #7 672x448/324x216, #8 672x448/324x216
  - 390: [height] preview 6787px vs live 7766px (87%)

### /de/neufahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 96%
- blocks: all-models
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R3: 12/16 chips, series line-height, filter weight, M logo
- remaining: 
  - 1440: [typography] 14 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
  - 768: [typography] 13 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
  - 390: [typography] 13 runs differ: "Touring": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Limousine": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Kompakt": color rgb(38, 38, 38)/r
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 101% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 768: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 390: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de

### /de/neufahrzeuge/1er/bmw-1er/bmw-1er
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 100% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 18 runs differ: "Ab 339 €": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(3
  - 1440: [layout] 24/100 text blocks placed differently: "im Monat leasen.": x 104/273, w 512/224 | "Exklusiv für Gewerbekunden.": x 104/273 | "Technische Daten": cx 83/159 | "An
  - 1440: [image-geometry] 14 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x631, #4 1440x630/588x353, #8 718x479/1008x441, #13 1008x441/1248x702
  - 768: [typography] 14 runs differ: "Ab 339 €": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Design": color rgb(102
  - 768: [layout] 29/101 text blocks placed differently: "Ab 339 €": cx 384/274 | "im Monat leasen.": cx 384/454 | "Exklusiv für Gewerbekunden.": cx 384/440 | "Technische Daten":
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/300x180, #8 382x255/1820x1024, #13 1820x1024/672x378
  - 390: [typography] 14 runs differ: "Ab 339 €": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW 120": size 17/14, weight 300/700 | "T
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/318x191, #8 342x229/1097x844, #13 1097x844/390x219

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 89%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/69 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 768: [missing-text] 6/69 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 390: [height] preview 6949px vs live 7767px (89%)
  - 390: [missing-text] 6/69 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 

### /de/neufahrzeuge/2er/2-series-active-tourer/bmw-2er-active-tourer
- status: differences remain; widths: 1440, 768, 390; height ratio: 106% / 105% / 96%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 220i Active Tourer": size 20/15, weight 300/700 | "Preisliste BMW 2er Active 
  - 1440: [layout] 16/82 text blocks placed differently: "BMW 220i Active Tourer": cx 205/469 | "Urbaner Athlet.": w 512/240 | "Kraft und Eleganz in Balance.": w 1248/371 | "Das k
  - 1440: [image-geometry] 13 images sized differently (preview/live): #10 1248x830/718x478, #18 1248x832/718x479, #19 1248x832/718x479, #23 612x408/294x196, #24 612x408/294x196
  - 768: [typography] 8 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 220i Active Tourer": size 18/14, weight 300/700 | "Der BMW 220i Active Tourer
  - 768: [layout] 20/84 text blocks placed differently: "Technische Daten": cx -333/36 | "Preisliste": cx -224/145 | "Probefahrt vereinbaren": cx -97/272 | "Design": cx 22/391 | 
  - 768: [image-geometry] 18 images sized differently (preview/live): #10 672x447/382x254, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/1820x1
  - 390: [typography] 7 runs differ: "BMW 220i Active Tourer": size 17/14, weight 300/700 | "Der BMW 220i Active Tourer steht für": align center/start | "Sein modernes Design trifft 
  - 390: [layout] 8/78 text blocks placed differently: "BMW 220i Active Tourer": cx 196/48 | "Urbaner Athlet.": cx 195/129 | "Optimal ausgeleuchtet, sicher ": w 342/257 | "Ihr BM
  - 390: [image-geometry] 8 images sized differently (preview/live): #21 342x228/390x585, #22 390x585/342x228, #24 342x228/390x438, #26 390x390/390x260, #27 390x390/390x260

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 13/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "115 (156)", "Hinterradantrieb", "115 (156) / 4.500 - 6.500"
  - 768: [missing-text] 13/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "115 (156)", "Hinterradantrieb", "115 (156) / 4.500 - 6.500"
  - 390: [missing-text] 13/66 live text runs not visible on preview: "BMW 218i Coupé M Sport", "115 (156)", "Hinterradantrieb", "115 (156) / 4.500 - 6.500"

### /de/neufahrzeuge/2er/2-series-coupe/bmw-2er-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 93% / 90%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M240i xDrive Coupé": size 20/15, weight 300/700 | "Preisliste BMW 2er Coupé":
  - 1440: [layout] 9/76 text blocks placed differently: "Das BMW 2er Coupé.": w 538/338 | "BMW M240i xDrive Coupé": cx 216/440 | "Sportlich bis zum Heck.": w 466/295 | "Mit dem 8-
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M240i xDrive Coupé": size 18/14, weight 300/700 | "Breite Spur. Scharfe Reakt
  - 768: [layout] 18/77 text blocks placed differently: "Technische Daten": cx -399/77 | "Design": cx -297/179 | "Preisliste": cx -222/254 | "Fahrdynamik": cx -127/349 | "Probefa
  - 768: [image-geometry] 5 images sized differently (preview/live): #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/1820x1024, #17 1024x1024/182
  - 390: [height] preview 13063px vs live 14549px (90%)
  - 390: [typography] 4 runs differ: "BMW M240i xDrive Coupé": size 17/14, weight 300/700 | "Breite Spur. Scharfe Reaktion.": align center/start | "Das BMW 2er Coupé bringt sportlich
  - 390: [layout] 10/71 text blocks placed differently: "BMW M240i xDrive Coupé": cx 196/48 | "Sportlich bis zum Heck.": w 342/242 | "Leichter Parken durch mehr Kam": x 363/227 |

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/79 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 768: [missing-text] 7/79 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 390: [missing-text] 7/79 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de

### /de/neufahrzeuge/2er/gran-coupe/bmw-2er-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 91% / 89%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x477, #5 718x477/1008x441, #10 1008x441/1248x702
  - 768: [typography] 6 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Varianten und technische Daten.": align start/center | "BMW 220 Gran Coupé": size 18/14, we
  - 768: [layout] 18/97 text blocks placed differently: "Technische Daten": cx -333/-46 | "Preisliste": cx -224/63 | "Probefahrt vereinbaren": cx -97/190 | "Design": cx 22/309 | 
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x254, #5 382x254/1820x1024, #10 1820x1024/672x378
  - 390: [height] preview 18147px vs live 20315px (89%)
  - 390: [typography] 6 runs differ: "Varianten und technische Daten.": align start/center | "BMW 220 Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 
  - 390: [image-geometry] 10 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x227, #5 342x227/1097x844, #10 1097x844/390x219
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 88%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 10/91 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 768: [missing-text] 10/91 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 390: [height] preview 8601px vs live 9761px (88%)
  - 390: [missing-text] 10/91 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 102% / 97%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/86 text blocks placed differently: "Die BMW 3er LimousinePlug-in-H": x 832/104, w 512/252 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 11
  - 768: [layout] 11/86 text blocks placed differently: "Technische Daten": cx -341/-46 | "Preisliste": cx -232/63 | "Probefahrt vereinbaren": cx -105/190 | "Design": cx 14/309 |

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-limousine/bmw-3er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 102% / 96%
- blocks: hero-teaser, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 9/72 text blocks placed differently: "Die BMW 3er Limousine.": x 832/104, w 512/258 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | 
  - 768: [image-geometry] 5 images sized differently (preview/live): #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/182

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-plug-in-hybrid
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 96%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, carousel, disclaimer, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 10/89 text blocks placed differently: "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | "BMW 330e xDrive Touring": cx 215/443 | "Rein el
  - 768: [layout] 13/89 text blocks placed differently: "Technische Daten": cx -399/-46 | "Preisliste": cx -290/63 | "Probefahrt vereinbaren": cx -163/190 | "Design": cx -44/309 

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten-plug-in-hybrid
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/3er/bmw-3-er-touring/bmw-3er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 103% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 15 runs differ: "Technologien": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330i xDrive Touring": size 20/15, weight 300/700, color rgb(255, 255, 255)/rgb(3
  - 1440: [layout] 20/94 text blocks placed differently: "Der BMW 3er Touring.": x 832/104, w 512/228 | "Konfigurieren & Preise": cx 938/200 | "Angebot anfordern": cx 1153/409 | "
  - 768: [typography] 9 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 330i xDrive Touring": size 18/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 
  - 768: [layout] 25/94 text blocks placed differently: "Technische Daten": cx -352/-133 | "Angebote": cx -240/-21 | "Preisliste": cx -156/63 | "Probefahrt vereinbaren": cx -29/1
  - 390: [typography] 9 runs differ: "BMW 330i xDrive Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Technische Daten": color rgb(77, 77, 77)/rgb(2

### /de/neufahrzeuge/3er/limousine/bmw-i3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 91% / 95% / 88%
- blocks: hero-stage, disclaimer, text-media-teaser, color-switch, video, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 6 images sized differently (preview/live): #2 1440x630/416x554, #5 416x555/1008x441, #6 1008x441/416x555, #7 1008x441/416x555, #8 1008x441/1440x630
  - 768: [image-geometry] 8 images sized differently (preview/live): #4 616x821/1820x1024, #5 616x821/1820x1024, #13 1820x1024/616x821, #14 1820x1024/616x821, #15 616x821/1820x1024
  - 390: [height] preview 10572px vs live 11990px (88%)
  - 390: [layout] 10/50 text blocks placed differently: "BMW i3 50 xDrive Limousine": x 83/24 | "bis zu 900 km": x 24/138 | "lässt Herzen höher schlagen": x 24/145 | "eine klare,
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/342x257, #3 342x257/390x520, #5 342x456/1097x844, #14 1097x844/390x520, #16 342x456/844x844

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 96% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/4er/cabrio/bmw-4er-cabrio
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 96% / 90%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 7/65 text blocks placed differently: "Das BMW 4er Cabrio.": w 512/224 | "BMW 430i xDrive Cabrio": cx 209/440 | "Verbunden mit der Welt: Digita": ypos 55%/61% | 
  - 768: [layout] 15/66 text blocks placed differently: "Technische Daten": cx -245/77 | "Konfigurieren": cx -122/200 | "Preisliste": cx -27/295 | "Probefahrt vereinbaren": cx 10
  - 768: [image-geometry] 6 images sized differently (preview/live): #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/182
  - 390: [height] preview 11420px vs live 12750px (90%)
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/4er/coupe/bmw-4er-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 101% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 13/64 text blocks placed differently: "Technische Daten": cx -136/77 | "Preisliste": cx -27/186 | "Probefahrt vereinbaren": cx 100/313 | "Design": cx 219/432 | 
  - 768: [image-geometry] 6 images sized differently (preview/live): #11 1024x1024/1820x1024, #12 1024x1024/1820x1024, #13 1024x1024/1820x1024, #14 1024x1024/1820x1024, #15 1024x1024/182

### /de/neufahrzeuge/4er/gran-coupe/bmw-4er-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 97%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/718x479, #5 718x479/1008x441, #10 1008x441/270x180
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 430i xDrive Gran Coupé": size 18/14, weight 300/700 | "Stilvoller Auftritt. B
  - 768: [layout] 14/80 text blocks placed differently: "Technische Daten": cx -136/77 | "Preisliste": cx -27/186 | "Probefahrt vereinbaren": cx 100/313 | "Design": cx 219/432 | 
  - 768: [image-geometry] 16 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x255, #5 382x255/1820x1024, #10 1820x1024/648x432
  - 390: [image-geometry] 10 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x228, #5 342x229/1097x844, #10 1097x844/326x217

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 390: [height] preview 7714px vs live 8580px (90%)

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 100% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "THE NEW": size 18/15, case none/uppercase | "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Touring": size 20/15, weight 300/700,
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x404, #4 718x404/1248x702, #6 1248x702/1440x630, #11 1440x630/1248x702
  - 768: [typography] 5 runs differ: "THE NEW": size 17/14, case none/uppercase | "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW 530e Touring": size 18/14, weight 300/
  - 768: [layout] 14/83 text blocks placed differently: "Technische Daten": cx -203/77 | "Preisliste": cx -94/186 | "Probefahrt vereinbaren": cx 33/313 | "Design": cx 152/432 | "
  - 768: [image-geometry] 23 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x215, #4 382x215/672x378, #5 672x378/1820x1024, #6 672x378/1820x1024
  - 390: [typography] 5 runs differ: "THE NEW": size 16/14, case none/uppercase | "BMW 530e Touring": size 17/14, weight 300/700, color rgb(255, 255, 255)/rgb(38, 38, 38) | "Technisc
  - 390: [image-geometry] 7 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x192, #6 390x219/844x844, #11 844x844/390x219, #21 342x228/1097x844

### /de/neufahrzeuge/5er/5-series-touring/bmw-5er-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 104% / 102% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 15/73 text blocks placed differently: "Der BMW 5er Touring.": w 512/228 | "Technische Daten": cx 83/215 | "Preisliste": cx 203/335 | "Probefahrt vereinbaren": c
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x404, #4 718x404/1008x441, #9 1008x441/1248x702, #11 1248x702/612x408
  - 768: [layout] 15/73 text blocks placed differently: "Technische Daten": cx -250/-16 | "Preisliste": cx -141/93 | "Probefahrt vereinbaren": cx -14/220 | "Design": cx 105/339 |
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x215, #4 382x215/1820x1024, #9 1820x1024/672x378, #19 672x448/1820x1024
  - 390: [image-geometry] 17 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x192, #4 342x192/1097x844, #9 1097x844/390x219, #18 342x228/844x844

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 95% / 92%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 11/93 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht
  - 768: [missing-text] 11/93 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht
  - 390: [missing-text] 11/93 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-phev-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 100% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 718x479/1008x441, #9 1008x441/400x267, #15 400x267/1440x630
  - 768: [layout] 14/74 text blocks placed differently: "Technische Daten": cx -444/77 | "Preisliste": cx -335/186 | "Probefahrt vereinbaren": cx -208/313 | "Design": cx -89/432 
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x255, #4 382x255/1820x1024, #9 1820x1024/324x216, #15 324x216/1820x1024
  - 390: [image-geometry] 8 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #4 342x228/1097x844, #9 1097x844/342x228, #15 342x228/844x844

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/83 live text runs not visible on preview: "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 768: [missing-text] 7/83 live text runs not visible on preview: "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de
  - 390: [missing-text] 7/83 live text runs not visible on preview: "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhängig von de

### /de/neufahrzeuge/5er/limousine/bmw-5er-limousine-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/72 text blocks placed differently: "Die BMW 5er Limousine.": w 512/258 | "Technische Daten": cx 83/178 | "Preisliste": cx 203/298 | "Probefahrt vereinbaren":
  - 1440: [image-geometry] 18 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 718x479/1248x702, #5 1248x702/1008x441, #6 1248x702/1008x441
  - 768: [layout] 16/72 text blocks placed differently: "Technische Daten": cx -341/-46 | "Preisliste": cx -232/63 | "Probefahrt vereinbaren": cx -105/190 | "Fahrdynamik": cx 34/
  - 768: [image-geometry] 12 images sized differently (preview/live): #6 672x378/1820x1024, #11 1820x1024/324x216, #17 324x216/1820x1024, #18 1024x1024/1820x1024, #19 1024x1024/1820x1024

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/69 live text runs not visible on preview: "BMW 7er", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhä
  - 768: [missing-text] 7/69 live text runs not visible on preview: "BMW 7er", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhä
  - 390: [missing-text] 7/69 live text runs not visible on preview: "BMW 7er", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht sich auf ein ", "Anhängelast abhä

### /de/neufahrzeuge/7er/limousine/bmw-7er-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 92% / 87%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 16383px vs live 18311px (89%)
  - 1440: [missing-text] 19/163 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "BMW i7", "BMW M760e xDrive"
  - 1440: [image-geometry] 23 images sized differently (preview/live): #3 1440x630/1008x441, #4 1440x630/1008x441, #8 1008x441/416x519, #9 1008x441/1440x630, #10 416x520/1440x630
  - 768: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"
  - 768: [layout] 14/126 text blocks placed differently: "BMW Individual": x 223/76 | "Mehr anzeigen": cx 148/384 | "Der Innenraum. Digitale Perfek": w 616/459 | "Das Interieur –
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x1024/768x768, #3 768x768/1820x1024, #4 768x768/1820x1024, #8 1820x1024/616x462, #9 1820x1024/768x768
  - 390: [height] preview 19612px vs live 22482px (87%)
  - 390: [missing-text] 20/164 live text runs not visible on preview: "BMW 7er", "Ihre BMW 7er Limousine", "294 (400)", "BMW i7"
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/390x779, #3 390x693/1097x844, #4 390x693/1097x844, #8 1097x844/342x257, #9 1097x844/390x657

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/66 live text runs not visible on preview: "BMW i7", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewich
  - 768: [missing-text] 6/66 live text runs not visible on preview: "BMW i7", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewich
  - 390: [missing-text] 6/66 live text runs not visible on preview: "BMW i7", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewich

### /de/neufahrzeuge/7er/limousine/bmw-i7-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 92% / 85%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media-showcase, color-switch, media, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 15263px vs live 17051px (90%)
  - 1440: [layout] 15/124 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 | "DIE NEUE BMW i7 LIMOUSINE": w 538/412 | "BMW Individual": x 842/616 | "727 km": cx 405/
  - 1440: [image-geometry] 25 images sized differently (preview/live): #3 1440x630/1008x441, #4 1440x630/1008x441, #8 1008x441/416x519, #9 1008x441/1440x630, #10 416x520/1440x630
  - 768: [layout] 24/124 text blocks placed differently: "BMW Individual": x 227/512 | "727 km": cx 385/588 | "Mehr anzeigen": cx 148/384 | "Der Innenraum. Digitale Perfek": w 61
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x1024/768x768, #3 768x768/1820x1024, #4 768x768/1820x1024, #8 1820x1024/616x462, #9 1820x1024/768x768
  - 390: [height] preview 19192px vs live 22520px (85%)
  - 390: [layout] 16/124 text blocks placed differently: "BMW Individual": x 124/24 | "727 km": cx 196/133 | "Mehr anzeigen": cx 96/195 | "Farbkombinationen": x 149/24 | "Vancouv
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/390x779, #3 390x693/1097x844, #4 390x693/1097x844, #8 1097x844/342x257, #9 1097x844/390x657

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe-technical-data
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/bmw-i/i4/bmw-i4-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 101% / 97%
- blocks: hero-teaser, content-navigation, drivetrain-switch, columns, disclaimer, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x478, #5 718x478/1440x630, #6 1440x630/718x479, #7 718x478/1224x689
  - 1440: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=1024&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applic
  - 768: [layout] 15/109 text blocks placed differently: "Technische Daten": cx -438/77 | "Business Lösungen": cx -295/220 | "Preisliste": cx -180/335 | "Probefahrt vereinbaren":
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x254, #5 382x255/768x768, #6 768x768/382x255, #7 382x255/648x365
  - 768: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=768&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applica
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #5 342x228/390x586, #6 390x585/342x228, #12 342x228/1097x844
  - 390: [broken-images] 2: https://bmw.scene7.com/is/image/BMW/g26_bev_electric-driving-pleasure_fb_de?wid=480&fmt=webp&qlt=80 https://bmw.scene7.com/is/image/BMW/g26_bev_glass-applica

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 99% / 90%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [height] preview 6812px vs live 7578px (90%)
  - 390: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 100% / 91%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 101% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 18 runs differ: "Ab 649": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(38,
  - 1440: [layout] 19/97 text blocks placed differently: "im Monat leasen.": x 104/276, w 512/224 | "Exklusiv für Gewerbekunden.": x 104/276 | "BMW i5 eDrive40 Touring": cx 213/44
  - 1440: [image-geometry] 30 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #5 612x367/1440x631, #6 1440x630/718x403, #7 718x403/1224x689
  - 768: [typography] 13 runs differ: "Ab 649": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Angebote": color rgb(102
  - 768: [layout] 31/95 text blocks placed differently: "Ab 649": cx 384/260 | "im Monat leasen.": cx 384/454 | "Exklusiv für Gewerbekunden.": cx 384/440 | "Technische Daten": cx
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #5 324x194/768x768, #6 768x768/382x215, #7 382x215/648x365
  - 390: [typography] 13 runs differ: "Ab 649": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW i5 eDrive40 Touring": size 17/14, weigh
  - 390: [image-geometry] 17 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #5 342x205/390x588, #6 390x585/342x192, #14 342x228/844x844

### /de/neufahrzeuge/bmw-i/i5/bmw-i5-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 100% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 20 runs differ: "Ab 599 €": size 18/35 | "im Monat leasen.": size 18/15 | "Exklusiv für Gewerbekunden.": size 18/15 | "Angebote": color rgb(102, 102, 102)/rgb(3
  - 1440: [layout] 27/96 text blocks placed differently: "Der BMW i5. 100% elektrisch.": w 512/309 | "im Monat leasen.": x 104/275, w 512/224 | "Exklusiv für Gewerbekunden.": x 10
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #6 718x479/1248x702, #10 1248x702/294x196, #14 294x196/718x477
  - 768: [typography] 14 runs differ: "Ab 599 €": size 17/29 | "im Monat leasen.": size 17/14, align center/left | "Exklusiv für Gewerbekunden.": size 17/14 | "Technische Daten": col
  - 768: [layout] 34/98 text blocks placed differently: "Ab 599 €": cx 385/274 | "im Monat leasen.": cx 384/454 | "Exklusiv für Gewerbekunden.": cx 384/440 | "Technische Daten": 
  - 768: [image-geometry] 13 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #6 382x255/672x378, #10 672x378/324x216, #15 382x254/1820x1024
  - 390: [typography] 13 runs differ: "Ab 599 €": size 16/28 | "im Monat leasen.": size 16/14 | "Exklusiv für Gewerbekunden.": size 16/14 | "BMW i5 eDrive40 Limousine": size 17/14, w

### /de/neufahrzeuge/bmw-i/ix/bmw-ix-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 89%
- blocks: hero-teaser, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [height] preview 6836px vs live 7638px (89%)
  - 390: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/bmw-i/ix/bmw-ix
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, car-kpis, drivetrain-switch, preview-slider, model-offer, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 16 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 18/23 | "Reichweite & Laden": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX xDrive60": size 20
  - 1440: [layout] 32/117 text blocks placed differently: "100 % elektrisch.Bis zu 701 km": w 512/349 | "Technische Daten": cx 83/-121 | "Angebote": cx 205/1 | "Preisliste": cx 29
  - 1440: [image-geometry] 22 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #6 718x478/1248x702, #7 1248x702/376x250, #8 1248x702/376x251
  - 768: [typography] 12 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 17/20 | "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX xDrive60": size 18/1
  - 768: [layout] 31/120 text blocks placed differently: "Technische Daten": cx -352/77 | "Angebote": cx -240/189 | "Preisliste": cx -156/273 | "Probefahrt vereinbaren": cx -29/4
  - 768: [image-geometry] 21 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #6 382x255/672x378, #11 672x448/1820x1024, #16 1820x1024/768x768
  - 390: [typography] 11 runs differ: "100 % elektrisch.Bis zu 701 km (WLTP": size 16/19 | "BMW iX xDrive60": size 17/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 16/1
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #10 342x228/1097x844, #11 342x228/1097x844, #15 1097x844/390x586
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 7/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [height] preview 6942px vs live 7736px (90%)
  - 390: [missing-text] 7/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/bmw-i/ix1/bmw-ix1
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 99% / 95%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, carousel, hero-teaser, columns, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 9 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX1 xDrive30": size 20/15, weight 300/700 | "Monatliche Rate": color rgb(102,
  - 1440: [layout] 26/113 text blocks placed differently: "Technische Daten": cx -157/83 | "Angebote": cx -35/205 | "Business Lösungen": cx 95/335 | "Preisliste": cx 222/462 | "Pr
  - 1440: [image-geometry] 6 images sized differently (preview/live): #7 1248x829/718x477, #28 400x267/294x196, #29 400x267/294x196, #30 400x267/294x196, #33 1440x480/718x478
  - 768: [typography] 9 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW iX1 xDrive30": size 18/14, weight 300/700 | "Monatliche Rate": color rgb(102,
  - 768: [layout] 27/114 text blocks placed differently: "Technische Daten": cx -680/77 | "Angebote": cx -568/189 | "Business Lösungen": cx -450/307 | "Preisliste": cx -335/422 |
  - 768: [image-geometry] 21 images sized differently (preview/live): #5 648x288/382x254, #6 648x288/768x768, #7 672x446/382x255, #8 768x768/1820x1024, #9 382x255/1820x1024
  - 390: [typography] 9 runs differ: "im Monat leasen.": align left/center | "BMW iX1 xDrive30": size 17/14, weight 300/700 | "Monatliche Rate": color rgb(102, 102, 102)/rgb(38, 38, 
  - 390: [layout] 13/104 text blocks placed differently: "Ab 429 €": x 37/133 | "im Monat leasen.": cx 262/196 | "Exklusiv für Gewerbekunden.": cx 262/182 | "BMW iX1 xDrive30": c
  - 390: [image-geometry] 13 images sized differently (preview/live): #5 318x141/342x227, #6 318x141/390x586, #8 390x585/1097x844, #9 342x229/1097x844, #13 1097x844/342x228

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [missing-text] 6/72 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/bmw-i/ix2/bmw-ix2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 101% / 96%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 16 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 35/43, align start/center | "BMW iX2 xDrive30": size 20/15, weight 30
  - 1440: [layout] 25/112 text blocks placed differently: "Der BMW iX2. 100 % elektrisch.": w 512/330 | "Der BMW iX2 verbindet vollelek": x 96/308, w 1248/824 | "BMW iX2 xDrive30"
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #6 1248x832/1440x630, #7 1440x630/718x477, #8 718x477/1008x441
  - 768: [typography] 12 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW iX2 xDrive30": size 18/14, weight 300/700 | "✔ Leasingsond
  - 768: [layout] 37/112 text blocks placed differently: "Technische Daten": cx -352/-133 | "Angebote": cx -240/-21 | "Preisliste": cx -156/63 | "Probefahrt vereinbaren": cx -29/
  - 768: [image-geometry] 18 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #6 672x448/768x768, #7 768x768/382x254, #8 382x254/1820x1024
  - 390: [typography] 12 runs differ: "Fahrfreude.": size 28/33 | "BMW iX2 xDrive30": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "✔ L
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #6 342x228/390x586, #7 390x585/342x227, #8 342x227/1097x844

### /de/neufahrzeuge/konzeptfahrzeuge/bmw-m-concept-neue-klasse
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 92% / 85%
- blocks: hero-stage, text-media-teaser, video, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 8300px vs live 9369px (89%)
  - 1440: [image-geometry] 9 images sized differently (preview/live): #2 1440x630/520x648, #3 520x650/1248x546, #5 1248x546/520x390, #6 520x390/294x196, #10 294x196/1248x546
  - 768: [image-geometry] 6 images sized differently (preview/live): #3 616x770/672x294, #5 672x294/616x411, #10 672x448/672x294, #12 672x294/672x448, #16 672x448/616x770
  - 390: [height] preview 9305px vs live 10887px (85%)
  - 390: [layout] 7/64 text blocks placed differently: "Die neue BMW M Designsprache.": w 342/221 | "Mehr anzeigen": cx 96/195 | "Track Lights": x 382/456 | "Trimaran-Element": x
  - 390: [image-geometry] 5 images sized differently (preview/live): #5 390x520/342x228, #10 342x228/390x520, #12 390x520/342x228, #16 342x228/390x488, #18 342x428/342x228

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 390: [height] preview 6447px vs live 7201px (90%)

### /de/neufahrzeuge/m/bmw-2er-m-modelle/bmw-m2-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 103% / 96%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, columns, hero-teaser, carousel, video, tabs, multi-content-gallery, text-media-teaser, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet text width 91.67%, full-width mobile buttons; R3: tablet width from source grid
- remaining: 
  - 1440: [missing-text] 69/226 live text runs not visible on preview: "Skip to main content", "Kaufen", "E-Mobilität", "Kunden"
  - 1440: [layout] 26/149 text blocks placed differently: "Modelle": x 96/184 | "Technische Daten": cx 83/167 | "Konfigurieren": cx 218/302 | "Preisliste": cx 323/407 | "BMW M2 mi
  - 768: [missing-text] 67/224 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K
  - 768: [layout] 22/150 text blocks placed differently: "Die BMW 2er Coupé M Modelle.": cx 384/433 | "Technische Daten": cx -366/-37 | "Konfigurieren": cx -243/86 | "Preisliste"
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x1024/840x686, #3 840x686/416x339, #5 421x344/768x121, #6 421x344/1820x1024, #11 1820x1024/382x312
  - 390: [missing-text] 67/218 live text runs not visible on preview: "Skip to main content", "Diese Auswahl führt aufgrund von Einschr", "Die My BMW App. Die direkte Verbindung z", "K

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 102% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, carousel, tabs, multi-content-gallery, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 26/153 text blocks placed differently: "Die BMW 3er Limousine M Modell": x 104/183, w 512/372 | "Technische Daten": cx 83/-316 | "Konfigurieren": cx 218/-181 | 
  - 1440: [image-geometry] 13 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #6 529x432/1440x109, #7 529x432/1008x441
  - 768: [typography] 9 runs differ: "BMW M3 Competition Limousine": color rgb(102, 102, 102)/rgb(38, 38, 38), align start/center | "BMW M340d xDrive Limousine: Energiev": align star
  - 768: [layout] 25/153 text blocks placed differently: "Technische Daten": cx -605/-155 | "Konfigurieren": cx -482/-32 | "Preisliste": cx -387/63 | "Probefahrt vereinbaren": cx
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 421x344/768x117, #6 421x344/1820x1024
  - 390: [typography] 10 runs differ: "Probefahrt vereinbaren": color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW M340d xDrive Limousine: Energiev": align start/center | "BMW M3 Compet
  - 390: [image-geometry] 15 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/257x210, #4 513x419/257x210, #5 283x231/390x86, #6 283x231/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-3er-m-modelle/bmw-m3-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 17/129 text blocks placed differently: "Die BMW 3er Touring M Modelle.": x 104/183, w 512/340 | "BMW M3 Competition Touring mit": cx 282/460 | "390 kW (530 PS),
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #6 529x432/1440x105, #7 529x432/1008x441
  - 768: [typography] 10 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M340d xDrive Touring: Energiever": align start/center | "BMW M3 Competition Tou
  - 768: [layout] 20/129 text blocks placed differently: "Technische Daten": cx -374/77 | "Konfigurieren": cx -251/200 | "Preisliste": cx -156/295 | "Probefahrt vereinbaren": cx 
  - 768: [image-geometry] 12 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 421x344/768x115, #6 421x344/1820x1024
  - 390: [typography] 10 runs differ: "BMW M340d xDrive Touring: Energiever": align start/center | "BMW M3 Competition Touring mit M xDr": size 19/14, weight 300/700 | "Technische Da
  - 390: [image-geometry] 11 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/257x210, #4 513x419/257x210, #5 283x231/390x86, #6 283x231/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-cabrio
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 7 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M4 Competition Cabrio": align start/center | "BMW M4 Competition Cabrio mit M xD
  - 1440: [layout] 18/124 text blocks placed differently: "Die BMW 4er Cabrio M Modelle.": x 104/183, w 512/331 | "BMW M4 Competition Cabrio mit ": cx 266/460 | "Maximale M High-P
  - 768: [typography] 8 runs differ: "M440 Cabrio": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M4 Competition Cabrio mit M xDri": size 25/14, weight 300/700 | "AUF EINEN BLICK":
  - 768: [layout] 17/127 text blocks placed differently: "Technische Daten": cx -374/-326 | "Konfigurieren": cx -251/-203 | "Preisliste": cx -156/-108 | "Probefahrt vereinbaren":
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 282x100/840x686, #3 840x686/416x339, #5 421x344/768x105, #6 421x344/1820x1024, #11 1820x1024/382x254
  - 390: [typography] 13 runs differ: "Konfigurieren": color rgb(38, 38, 38)/rgb(102, 102, 102) | "TECHNISCHE DATEN": size 14/12, case none/uppercase | "BMW M4 Competition Cabrio mit
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 89%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 15/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "390 (530)", "390 (530) / 6.250", "650 / 2.300 - 5.500"
  - 1440: [layout] 6/44 text blocks placed differently: "Technische Daten der BMW 4er C": w 1248/634 | "Höchstgeschwindigkeit in km/h": x 536/937 | "Gepäckraumvolumen in l": x 952
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 15/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "390 (530)", "390 (530) / 6.250", "650 / 2.300 - 5.500"
  - 768: [layout] 5/44 text blocks placed differently: "Höchstgeschwindigkeit in km/h": x 296/505 | "Gepäckraumvolumen in l": x 520/73 | "Tankinhalt in l": x 72/289 | "BMW Räder 
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [height] preview 7315px vs live 8185px (89%)
  - 390: [missing-text] 15/66 live text runs not visible on preview: "BMW M4 Competition Coupé mit M xDrive", "390 (530)", "390 (530) / 6.250", "650 / 2.300 - 5.500"
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-4er-m-modelle/bmw-m4-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 97% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, model-overview, color-switch, columns, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 21/150 text blocks placed differently: "Die BMW 4er Coupé M Modelle.": x 104/183, w 512/331 | "Technische Daten": cx 83/-232 | "Konfigurieren": cx 218/-97 | "Pr
  - 1440: [image-geometry] 18 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/475x388, #4 930x759/475x388, #6 529x432/1440x108, #7 529x432/1008x441
  - 768: [typography] 11 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440d xDrive Coupé: Energieverbr": align start/center | "BMW M4 Competition Cou
  - 768: [layout] 17/151 text blocks placed differently: "Technische Daten": cx -581/77 | "Konfigurieren": cx -458/200 | "Preisliste": cx -363/295 | "Probefahrt vereinbaren": cx 
  - 768: [image-geometry] 16 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/416x339, #4 840x686/416x339, #5 421x344/768x116, #6 421x344/1820x1024
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g82_comp-coupe_int_dashboard_fb?wid=2560&fmt=webp&qlt=80
  - 390: [typography] 12 runs differ: "BMW M4 Competition Coupé": size 23/14, color rgb(38, 38, 38)/rgb(102, 102, 102) | "BMW M440d xDrive Coupé: Energieverbr": align start/center | 
  - 390: [image-geometry] 15 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/257x210, #4 513x419/257x210, #5 283x231/390x86, #6 283x231/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 6/71 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-i4-m60/bmw-i4-m60-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 98% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, carousel, preview-slider, columns, video, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 25/123 text blocks placed differently: "Technische Daten": cx 83/5 | "Leasingbeispiel": cx 227/149 | "Preisliste": cx 340/262 | "Probefahrt vereinbaren": cx 479
  - 1440: [image-geometry] 25 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/588x470, #4 930x759/588x470, #5 588x470/1440x628, #7 1440x630/1248x702
  - 768: [typography] 8 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i4 M60 xDrive Gran Coupé": size 18/14, weight 300/700 | "Monatliche Rate": color rg
  - 768: [layout] 24/123 text blocks placed differently: "Technische Daten": cx -388/36 | "Leasingbeispiel": cx -258/166 | "Preisliste": cx -156/268 | "Probefahrt vereinbaren": c
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/536x429, #4 840x686/536x429, #5 648x518/768x768, #6 648x518/382x255
  - 390: [typography] 8 runs differ: "BMW i4 M60 xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Monatliche Rate": co
  - 390: [image-geometry] 15 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/326x261, #4 513x419/326x261, #5 318x254/390x586, #7 390x585/390x219
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/bmw-i5-m60/bmw-i5-m60xdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 99% / 93%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/718x477, #4 930x759/1272x716, #5 718x477/400x267, #6 1248x702/400x267
  - 768: [layout] 15/81 text blocks placed differently: "Technische Daten": cx -441/-217 | "Preisliste": cx -332/-108 | "Probefahrt vereinbaren": cx -205/19 | "Performance": cx -
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x254, #4 840x686/696x392, #5 382x254/696x392, #6 672x378/324x216
  - 390: [image-geometry] 11 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/342x227, #4 513x419/390x228, #12 342x228/1097x844, #13 342x228/1097x844

### /de/neufahrzeuge/m/bmw-m-135/bmw-1er-m-automobile-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/bmw-m-135/bmw-m135
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 101% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 12/96 text blocks placed differently: "Der BMW M135 xDrive.": x 104/183, w 512/238 | "BMW M135 xDrive": cx 179/440 | "Charaktereigenschaft: leistung": w 466/345
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x629, #4 930x759/718x479, #5 1440x630/1248x702, #6 718x478/1248x702
  - 768: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M135 xDrive": size 18/14, weight 300/700 | "Kompakt. Kompromisslos. Konsequen
  - 768: [layout] 23/94 text blocks placed differently: "Technische Daten": cx -374/-155 | "Konfigurieren": cx -251/-32 | "Preisliste": cx -156/63 | "Probefahrt vereinbaren": cx 
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x378, #6 382x255/672x378
  - 390: [typography] 6 runs differ: "BMW M135 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Kompakt. Kompromisslos. Konsequen
  - 390: [image-geometry] 14 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x219, #15 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 7/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 7/70 live text runs not visible on preview: "Der BMW i5 M60 xDrive Touring. 100% elek", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/i5-m60/bmw-i5-touring-m60-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 103% / 98%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 14/87 text blocks placed differently: "Technische Daten": cx 83/-27 | "Preisliste": cx 203/93 | "Probefahrt vereinbaren": cx 342/232 | "Performance": cx 493/383
  - 1440: [image-geometry] 27 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x628, #4 930x759/718x404, #5 1440x630/1248x702, #6 718x404/1248x702
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW i5 M60 xDrive Touring": size 18/14, weight 300/700 | "Grosszügig in Leistung 
  - 768: [layout] 24/86 text blocks placed differently: "Technische Daten": cx -370/77 | "Preisliste": cx -261/186 | "Probefahrt vereinbaren": cx -134/313 | "Performance": cx 4/4
  - 768: [image-geometry] 22 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x215, #5 768x768/672x378, #6 382x215/672x448
  - 390: [typography] 5 runs differ: "BMW i5 M60 xDrive Touring": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Grosszügig in Leistung 
  - 390: [image-geometry] 16 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x192, #5 390x585/390x219, #14 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 102% / 93%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 6/70 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/ix-m70/bmw-ix-m70
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 30 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x630, #4 930x759/718x478, #5 1440x630/1248x702, #7 1248x702/376x251
  - 768: [layout] 13/96 text blocks placed differently: "Technische Daten": cx -370/-428 | "Preisliste": cx -261/-319 | "Probefahrt vereinbaren": cx -134/-192 | "Performance": cx
  - 768: [image-geometry] 22 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x254, #5 768x768/672x378, #6 382x255/672x378
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x219, #15 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 101% / 92%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/67 live text runs not visible on preview: "BMW 7er M", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergew
  - 1440: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 43/48, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 6/67 live text runs not visible on preview: "BMW 7er M", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergew
  - 768: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 35/48, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 6/67 live text runs not visible on preview: "BMW 7er M", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergew
  - 390: [typography] 4 runs differ: "BMW 7er M MODELLE: TECHNISCHE DATEN": size 33/35, weight 300/500, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "ANSPRUCH IN JED
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/limousine/bmw-7er-limousine-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 92% / 85%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, text-media-teaser, media-showcase, color-switch, model-overview, media, powertrain-selector, card-list, carousel, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 16089px vs live 18127px (89%)
  - 1440: [typography] 16 runs differ: "DER NEUE BMW 7er": size 70/74, color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb
  - 1440: [layout] 26/148 text blocks placed differently: "DER NEUE BMW 7er": w 1344/383 | "DIE BMW 7er M MODELLE": w 538/350 | "500 kW (680 PS)": x 128/616 | "Integral-Aktivlenku
  - 1440: [image-geometry] 14 images sized differently (preview/live): #3 1440x630/1008x441, #8 1008x441/416x519, #9 416x520/475x388, #11 529x432/1440x85, #13 1248x546/416x416
  - 768: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 768: [typography] 16 runs differ: "DER NEUE BMW 7er": color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb(62, 82, 122
  - 768: [layout] 27/148 text blocks placed differently: "500 kW (680 PS)": x 80/527 | "BMW Individual": x 563/417 | "Mehr anzeigen": cx 148/384 | "BMW M760e xDrive Limousine.": 
  - 768: [image-geometry] 20 images sized differently (preview/live): #3 768x768/1820x1024, #8 1820x1024/616x462, #9 616x462/416x339, #11 421x344/768x82, #13 672x294/616x616
  - 390: [height] preview 20264px vs live 23885px (85%)
  - 390: [missing-text] 15/182 live text runs not visible on preview: "BMW 7er", "Ihr BMW 7er M Modell", "500 (680)", "3,8 (3,5) Sekunden"
  - 390: [typography] 16 runs differ: "DER NEUE BMW 7er": color rgb(38, 38, 38)/rgb(62, 82, 122), case uppercase/none | "DIE BMW 7er M MODELLE": color rgb(38, 38, 38)/rgb(62, 82, 122
  - 390: [image-geometry] 19 images sized differently (preview/live): #3 390x693/1097x844, #8 1097x844/342x257, #9 342x257/257x210, #11 280x229/390x58, #13 342x456/390x390

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 102% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m235-xdrive-gran-coupe/bmw-m235-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 94% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 28 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x629, #4 930x759/718x479, #5 1440x630/1248x702, #7 1248x702/718x479
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/f74_mp_exterior_m-kidney-iconic-glow_fb?wid=2560&fmt=webp&qlt=80
  - 768: [typography] 5 runs differ: "Beratung & Services": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M235 xDrive Gran Coupé": size 18/14, weight 300/700 | "Extrovertiert. Perf
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x378, #6 382x255/672x378
  - 390: [typography] 5 runs differ: "BMW M235 xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Extrovertiert. Perform
  - 390: [image-geometry] 21 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x585, #4 513x419/342x228, #5 390x585/390x219, #12 342x228/1097x844

### /de/neufahrzeuge/m/m440i-xdrive-gran-coupe/bmw-m440i-xdrive-gran-coupe
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 97% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, carousel, color-switch, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 11/98 text blocks placed differently: "Das BMW M440i xDrive Gran Coup": x 104/183, w 512/385 | "BMW M440i xDrive Gran Coupé": cx 241/440 | "Fahren, wie Sie es s
  - 1440: [image-geometry] 25 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x630, #4 930x759/718x479, #5 1440x630/718x477, #6 718x479/400x266
  - 768: [typography] 6 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M440i xDrive Gran Coupé": size 18/14, weight 300/700 | "Unverwechselbares Design, u
  - 768: [layout] 14/98 text blocks placed differently: "Technische Daten": cx -241/77 | "Preisliste": cx -132/186 | "Probefahrt vereinbaren": cx -5/313 | "Performance": cx 133/4
  - 768: [image-geometry] 22 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/382x254, #6 382x255/672x447
  - 390: [typography] 6 runs differ: "BMW M440i xDrive Gran Coupé": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Unverwechselbares Des
  - 390: [image-geometry] 19 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/342x227, #9 342x228/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 12/92 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 12/92 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 12/92 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m5-series/bmw-m5-limousine
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 97% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, color-switch, columns, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 11 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": size 20/15, weight 300/700 | "Die BMW M5 Limousine mit M Hybrid is"
  - 1440: [image-geometry] 25 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x628, #4 930x759/1008x441, #5 1440x630/1008x441, #9 1008x441/718x478
  - 768: [typography] 12 runs differ: "Konfigurieren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW M5 Limousine": size 18/14, weight 300/700 | "Fährt in einer eigenen Liga.": ali
  - 768: [layout] 15/113 text blocks placed differently: "Technische Daten": cx -374/77 | "Konfigurieren": cx -251/200 | "Preisliste": cx -156/295 | "Probefahrt vereinbaren": cx 
  - 768: [image-geometry] 18 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/1820x1024, #5 768x768/1820x1024, #9 1820x1024/382x254
  - 390: [typography] 12 runs differ: "BMW M5 Limousine": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Fährt in einer eigenen Liga.": 
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 11/87 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 11/87 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [missing-text] 11/87 live text runs not visible on preview: "Wert mit abgezogenem „Rollout“: Bei dies", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweit
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/m5-series/bmw-m5-touring
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 97% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 22/120 text blocks placed differently: "Der BMW M5 Touring.": x 104/183, w 512/228 | "Technische Daten": cx 83/-189 | "Auszeichnung": cx 221/-51 | "Konfiguriere
  - 1440: [image-geometry] 26 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/612x153, #4 930x759/1440x630, #5 718x180/1008x441, #6 1440x630/1008x441
  - 768: [layout] 17/119 text blocks placed differently: "Technische Daten": cx -317/113 | "Auszeichnung": cx -192/238 | "Konfigurieren": cx -80/350 | "Preisliste": cx 15/445 | "
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x95, #4 840x686/768x768, #5 382x96/1820x1024, #6 768x768/1820x1024
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 10/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Angaben zu Leistung für Benzinmotoren be"
  - 1440: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [missing-text] 10/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Angaben zu Leistung für Benzinmotoren be"
  - 768: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": size 35/43, weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entd
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [height] preview 7181px vs live 8001px (90%)
  - 390: [missing-text] 10/77 live text runs not visible on preview: "BMW X5 M", "MODELLE:", "BMW X5 M Modelle", "Angaben zu Leistung für Benzinmotoren be"
  - 390: [typography] 4 runs differ: "DIE BMW X5 M MODELLE: TECHNISCHE DAT": weight 300/500, case uppercase/none | "Informiert bleiben": case uppercase/none | "Jetzt entdecken": case
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/suv/bmw-x5-m-modelle
- status: could not capture; widths: –; height ratio: – / – / –
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, carousel, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: none

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x1-m35i/bmw-x1-m35i-xdrive
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 91%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, hero-teaser, color-switch, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 768: [typography] 5 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 M35i xDrive": size 18/14, weight 300/700 | "Preisliste BMW X1 M35i xDrive": size 17/
  - 768: [layout] 19/77 text blocks placed differently: "Der BMW X1 M35i xDrive.": cx 384/433 | "Technische Daten": cx -396/36 | "Preisliste": cx -287/145 | "Design": cx -212/220
  - 768: [image-geometry] 5 images sized differently (preview/live): #14 1024x1024/1820x1024, #15 1024x1024/1820x1024, #16 1024x1024/1820x1024, #17 1024x1024/1820x1024, #18 1024x1024/182
  - 390: [typography] 4 runs differ: "BMW X1 M35i xDrive": size 17/14, weight 300/700 | "Preisliste BMW X1 M35i xDrive": size 16/14 | "Unverkennbar M.": align center/start | "So viel
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [image-geometry] 2 images sized differently (preview/live): #2 282x100/1198x570, #3 1200x571/598x598
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 282x100/670x319, #3 672x320/334x334
  - 390: [image-geometry] 2 images sized differently (preview/live): #2 282x100/340x162, #3 342x163/169x169

### /de/neufahrzeuge/m/x2-m35i/bmw-x2-m35ixdrive-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 97% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 13/92 text blocks placed differently: "Der BMW X2 M35i xDrive.": x 104/183, w 512/268 | "Mit einer leistungsstarken Mot": x 96/308, w 1248/824 | "BMW X2 M35i xD
  - 1440: [image-geometry] 21 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/1440x631, #4 930x759/718x479, #5 1440x630/612x408, #7 612x408/1008x441
  - 768: [typography] 6 runs differ: "Design": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW X2 M35i xDrive": size 18/14, weight 300/700 | "Unverkennbar
  - 768: [layout] 22/92 text blocks placed differently: "Technische Daten": cx -370/-268 | "Preisliste": cx -261/-159 | "Probefahrt vereinbaren": cx -134/-32 | "Performance": cx 
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/768x768, #4 840x686/382x255, #5 768x768/672x448, #6 382x255/672x448
  - 390: [typography] 6 runs differ: "Fahrfreude.": size 28/33 | "BMW X2 M35i xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Un
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/390x586, #4 513x419/342x228, #5 390x585/390x260, #7 390x260/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/m/x3-m50/bmw-x3-m50
- status: differences remain; widths: 1440, 768, 390; height ratio: 102% / 103% / 95%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, columns, video, carousel, color-switch, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 15/90 text blocks placed differently: "Der BMW X3 M50 xDrive.": x 104/183, w 512/265 | "BMW X3 M50 xDrive": cx 191/459 | "Unverkennbar M.": w 512/270 | "Charakt
  - 1440: [image-geometry] 29 images sized differently (preview/live): #2 1440x630/930x759, #3 282x100/718x479, #4 930x759/1440x631, #5 718x479/1248x702, #6 1440x630/718x479
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 M50 xDrive": size 18/14, weight 300/700 | "Preisliste BMW X3 M50 xDrive.":
  - 768: [layout] 17/89 text blocks placed differently: "Technische Daten": cx -370/77 | "Preisliste": cx -261/186 | "Probefahrt vereinbaren": cx -134/313 | "Performance": cx 4/4
  - 768: [image-geometry] 24 images sized differently (preview/live): #2 768x336/840x686, #3 282x100/382x255, #4 840x686/768x768, #5 382x255/672x378, #6 768x768/382x255
  - 390: [typography] 5 runs differ: "BMW X3 M50 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Preisliste BMW X3 M50 xDrive.":
  - 390: [layout] 11/83 text blocks placed differently: "BMW X3 M50 xDrive": cx 195/48 | "Technische Daten": cx 81/195 | "Unverkennbar M.": cx 195/141 | "Komfortabel bis maximal 
  - 390: [image-geometry] 20 images sized differently (preview/live): #2 390x520/513x419, #3 282x100/342x228, #4 513x419/390x585, #6 390x585/390x260, #13 342x228/1097x844

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-modelle
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 96% / 93%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, model-overview, color-switch, hero-teaser, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 21/110 text blocks placed differently: "Die BMW X6 M Modelle.": x 96/212, w 538/387 | "Ab 171.900 €": x 128/304 | "High-Performance M TwinPower T": x 128/336 | 
  - 1440: [image-geometry] 9 images sized differently (preview/live): #5 1008x441/1440x102, #10 1440x630/1008x441, #11 400x267/1440x628, #20 1440x630/408x272, #21 718x478/1440x631
  - 768: [layout] 19/113 text blocks placed differently: "Die BMW X6 M Modelle.": cx 384/432 | "Technische Daten": cx -295/77 | "Konfigurieren": cx -172/200 | "BMW X6 M Competiti
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 1820x1024/768x106, #10 768x768/1820x1024, #11 672x448/768x768, #20 768x768/696x464, #21 382x255/768x768
  - 390: [image-geometry] 8 images sized differently (preview/live): #5 1097x844/390x74, #10 390x585/1097x844, #11 342x228/390x587, #20 390x585/358x239, #21 342x228/390x588

### /de/neufahrzeuge/m/x6-m/bmw-x6-m-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 97% / 87%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/68 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 768: [missing-text] 6/68 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 
  - 390: [height] preview 6664px vs live 7652px (87%)
  - 390: [missing-text] 6/68 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewicht bezieht 

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 99% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/m/x7-m60i/bmw-x7-m60i
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 92% / 88%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 12297px vs live 13672px (90%)
  - 1440: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 M60i xDrive": size 20/15, weight 300/700 | "Preisliste BMW X7 M60i xDrive"
  - 1440: [layout] 28/91 text blocks placed differently: "Der BMW X7 M60i xDrive.": x 96/212, w 538/412 | "Technische Daten": cx -80/83 | "Design": cx 32/195 | "Preisliste": cx 11
  - 1440: [image-geometry] 6 images sized differently (preview/live): #23 400x267/270x180, #24 400x267/270x180, #25 400x267/270x180, #28 400x267/270x180, #29 400x267/270x180
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 M60i xDrive": size 18/14, weight 300/700 | "Gebaut, um Grenzen zu verschie
  - 768: [layout] 19/90 text blocks placed differently: "Der BMW X7 M60i xDrive.": cx 384/433 | "Technische Daten": cx -613/77 | "Design": cx -511/179 | "Preisliste": cx -436/254
  - 768: [image-geometry] 14 images sized differently (preview/live): #13 1024x1024/1820x1024, #14 1024x1024/382x215, #15 1024x1024/382x215, #16 1024x1024/672x448, #17 1024x1024/672x448
  - 390: [height] preview 13867px vs live 15678px (88%)
  - 390: [typography] 5 runs differ: "BMW X7 M60i xDrive": size 17/14, weight 300/700 | "Gebaut, um Grenzen zu verschieben.": align center/start | "Der BMW X7 M60i xDrive steht für u
  - 390: [layout] 13/86 text blocks placed differently: "Der BMW X7 M60i xDrive.": cx 195/242 | "BMW X7 M60i xDrive": cx 196/48 | "Drei Sitzreihen. Unzählige Mög": w 342/225 | "R

### /de/neufahrzeuge/m/xm/bmw-xm-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 98% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 11/86 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 768: [missing-text] 11/86 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 390: [missing-text] 11/86 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve

### /de/neufahrzeuge/m/xm/bmw-xm
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 99% / 95%
- blocks: hero-stage, disclaimer, content-navigation, car-kpis, model-overview, color-switch, columns, hero-teaser, video, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 10 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Preisliste BMW XM": size 18/15 | "Werden Sie Teil des BMW Excellence C": align s
  - 1440: [layout] 55/124 text blocks placed differently: "Die BMW XM Modelle.": x 96/212, w 538/356 | "Ab 185.800 €": x 128/336 | "Maximale Performance und Präse": x 128/336, w 3
  - 1440: [image-geometry] 23 images sized differently (preview/live): #2 1440x630/475x388, #4 529x432/1440x97, #14 400x267/294x196, #15 400x267/294x196, #16 400x267/294x196
  - 768: [typography] 10 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Preisliste BMW XM": size 17/14 | "Der M Hybrid Antriebsstrang des BMW ": align c
  - 768: [layout] 18/126 text blocks placed differently: "Die BMW XM Modelle.": cx 384/433 | "Technische Daten": cx -324/77 | "Konfigurieren": cx -201/200 | "Preisliste": cx -106
  - 390: [typography] 9 runs differ: "Preisliste BMW XM": size 16/14 | "Der M Hybrid Antriebsstrang des BMW ": align center/start | "Sportlichkeit und Innovation in eine": align cent

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 96% / 93%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 M40i": size 20/15, weight 300/700 | "Preisliste BMW Z4 M40i Roadster": siz
  - 1440: [layout] 14/73 text blocks placed differently: "Der BMW Z4 M40i Roadster.": w 538/412 | "BMW Z4 M40i": cx 162/497 | "Sportlich expressiv.": w 512/304 | "Markantes Design
  - 1440: [image-geometry] 17 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x628, #4 1440x630/1008x441, #9 1008x441/718x481, #11 718x478/294x196
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 M40i": size 18/14, weight 300/700 | "Sportlich expressiv.": align center/s
  - 768: [layout] 18/74 text blocks placed differently: "Der BMW Z4 M40i Roadster.": cx 384/433 | "Technische Daten": cx -172/77 | "Design": cx -70/179 | "Preisliste": cx 5/254 |
  - 768: [image-geometry] 19 images sized differently (preview/live): #2 768x1024/840x686, #3 840x686/768x768, #4 768x768/1820x1024, #9 1820x1024/382x256, #11 382x255/672x447
  - 390: [typography] 5 runs differ: "BMW Z4 M40i": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "Sportlich expressiv.": align center/s
  - 390: [image-geometry] 12 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x585, #4 390x585/1097x844, #9 1097x844/342x229, #21 342x228/844x844

### /de/neufahrzeuge/m/z4-m40i/bmw-z4-m40i-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 89%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 390: [height] preview 6145px vs live 6933px (89%)

### /de/neufahrzeuge/x/x2/bmw-x2-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 101% / 100% / 92%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/76 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 768: [missing-text] 7/76 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera
  - 390: [missing-text] 7/76 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Serienausstattung / Sondera

### /de/neufahrzeuge/x/x2/bmw-x2-ueberblick
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 96% / 94%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 9/87 text blocks placed differently: "Der BMW X2 – ein SUV, der die ": x 96/308, w 1248/824 | "BMW X2 sDrive20i": cx 181/480 | "Sitzen, fast wie unter freiem ":
  - 1440: [image-geometry] 24 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/1440x626, #4 1440x630/718x479, #5 718x479/1008x441, #10 1008x441/612x408
  - 768: [typography] 6 runs differ: "Probefahrt vereinbaren": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Fahrfreude.": size 29/35 | "BMW X2 sDrive20i": size 18/14, weight 300/700 |
  - 768: [layout] 20/87 text blocks placed differently: "Technische Daten": cx -425/77 | "Preisliste": cx -316/186 | "Probefahrt vereinbaren": cx -189/313 | "Design": cx -70/432 
  - 768: [image-geometry] 14 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/768x768, #4 768x768/382x255, #5 382x255/1820x1024, #10 1820x1024/672x448
  - 390: [typography] 5 runs differ: "Fahrfreude.": size 28/33 | "BMW X2 sDrive20i": size 17/14, weight 300/700 | "Leistung und Design, die Aufsehen er": align center/start | "Der BM
  - 390: [image-geometry] 9 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/390x586, #4 390x585/342x228, #5 342x229/1097x844, #10 1097x844/390x260
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/x/ix3/bmw-ix3-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 95%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 9/82 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Bidirektionales Laden erfor
  - 768: [missing-text] 9/82 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Bidirektionales Laden erfor
  - 390: [missing-text] 9/82 live text runs not visible on preview: "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Bidirektionales Laden erfor

### /de/neufahrzeuge/x/ix3/bmw-ix3
- status: differences remain; widths: 1440, 768, 390; height ratio: 92% / 99% / 91%
- blocks: hero-stage, disclaimer, cta-collection, scroll-navigation, car-kpis, columns, carousel, text-media-teaser, media-showcase, color-switch, media, card-list, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 9 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designspr
  - 1440: [image-geometry] 20 images sized differently (preview/live): #2 1440x630/718x479, #3 718x479/270x270, #7 294x294/1440x630, #8 1440x630/1008x441, #9 1440x630/1008x441
  - 768: [missing-text] 13/141 live text runs not visible on preview: "Ihr BMW iX3", "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l"
  - 768: [typography] 9 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designspr
  - 768: [layout] 26/106 text blocks placed differently: "Das erste Modell der neuen Kla": w 672/242 | "Das Goldene Lenkrad 2025.": x 744/350 | "Für seine Innovationskraft wur": 
  - 768: [image-geometry] 26 images sized differently (preview/live): #2 768x1024/382x255, #3 382x255/242x242, #4 672x672/242x242, #5 672x672/242x242, #6 672x672/242x242
  - 390: [missing-text] 13/141 live text runs not visible on preview: "Ihr BMW iX3", "kWh/100 km", "18,1–15,1", "Max. Reichweite (WLTP) nach 10 Minuten l"
  - 390: [typography] 9 runs differ: "DER BMW iX3": color rgb(38, 38, 38)/rgb(62, 82, 122) | "EINE NEUE ÄRA DER FAHRFREUDE.": color rgb(38, 38, 38)/rgb(62, 82, 122) | "Neue Designspr
  - 390: [layout] 15/106 text blocks placed differently: "Bereit, wenn Sie es sind: Vere": w 342/257 | "Das Goldene Lenkrad 2025.": x 382/330 | "Für seine Innovationskraft wur": 
  - 390: [image-geometry] 26 images sized differently (preview/live): #2 390x520/342x228, #3 342x229/266x266, #4 342x342/266x266, #5 342x342/266x266, #6 342x342/1097x844

### /de/neufahrzeuge/x/suv/bmw-ix5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/63 live text runs not visible on preview: "BMW iX5:", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewi
  - 768: [missing-text] 6/63 live text runs not visible on preview: "BMW iX5:", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewi
  - 390: [missing-text] 6/63 live text runs not visible on preview: "BMW iX5:", "Die angegebenen Werte wurden nach dem vo", "Die nachgeladene Reichweite nach 10 Minu", "Das EG-Leergewi

### /de/neufahrzeuge/x/suv/bmw-ix5
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 93% / 90%
- blocks: hero-stage, disclaimer, scroll-navigation, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 12970px vs live 14417px (90%)
  - 1440: [missing-text] 9/94 live text runs not visible on preview: "BMW iX5", "BMW X5", "BMW X5 M60e xDrive", "BMW Passenger Screen"
  - 1440: [image-geometry] 13 images sized differently (preview/live): #4 1440x630/1008x441, #5 1440x630/1008x441, #6 1440x630/1008x441, #9 1008x441/1440x630, #10 1008x441/1440x630
  - 768: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"
  - 768: [layout] 13/74 text blocks placed differently: "Setzt Standards. Nicht Trends.": w 616/397 | "845 km": cx 385/542 | "Mehr anzeigen": cx 148/384 | "Das Exterieur Design. 
  - 768: [image-geometry] 15 images sized differently (preview/live): #2 768x1024/768x336, #4 768x336/768x768, #5 768x768/1820x1024, #6 768x768/1820x1024, #10 1820x1024/768x768
  - 390: [height] preview 17008px vs live 18899px (90%)
  - 390: [missing-text] 11/96 live text runs not visible on preview: "BMW iX5", "kWh/100 km", "23,9 – 20,1", "BMW X5"
  - 390: [layout] 8/74 text blocks placed differently: "845 km": cx 196/75 | "Mehr anzeigen": cx 96/195 | "Effizienz, weiter gedacht.": w 342/259 | "Bis zu 845 km Reichweite¹, ².
  - 390: [image-geometry] 16 images sized differently (preview/live): #3 390x488/390x779, #4 390x488/1097x844, #5 390x693/1097x844, #6 390x693/1097x844, #9 1097x844/390x585

### /de/neufahrzeuge/x/suv/bmw-x5-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/70 live text runs not visible on preview: "BMW X5", "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene 
  - 768: [missing-text] 7/70 live text runs not visible on preview: "BMW X5", "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene 
  - 390: [missing-text] 7/70 live text runs not visible on preview: "BMW X5", "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene 

### /de/neufahrzeuge/x/suv/bmw-x5
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 97% / 89%
- blocks: hero-stage, disclaimer, scroll-navigation, cta-collection, car-kpis, powertrain-selector, text-media-teaser, media, media-showcase, color-switch, card-list, accordion, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: tablet text width 91.67%, full-width mobile buttons; R2: crops/ratios per breakpoint; R3: tablet width from source grid; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 13529px vs live 15418px (88%)
  - 1440: [layout] 12/96 text blocks placed differently: "BMW X5": ypos 57%/3% | "Mehr anzeigen": cx 688/928 | "Mehr digitale Highlights": cx 206/720 | "Variabel ohne Kompromisse.
  - 1440: [image-geometry] 14 images sized differently (preview/live): #5 1440x630/1008x441, #6 1440x630/1008x441, #9 1008x441/1440x630, #10 1008x441/1440x630, #11 1008x441/1440x630
  - 768: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 768: [layout] 20/96 text blocks placed differently: "BMW X5": cx 380/513, ypos 52%/4% | "Setzt Standards. Nicht Trends.": w 616/397 | "Mehr anzeigen": cx 148/384 | "Mehr digi
  - 768: [image-geometry] 17 images sized differently (preview/live): #2 768x1024/672x294, #4 672x294/1820x1024, #5 768x768/1820x1024, #6 768x768/616x462, #7 1820x1024/616x462
  - 768: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras
  - 390: [height] preview 18057px vs live 20368px (89%)
  - 390: [missing-text] 18/137 live text runs not visible on preview: "Ihr BMW X5", "294 (400)", "655–1.850", "BMW iX5"
  - 390: [layout] 10/96 text blocks placed differently: "BMW X5": ypos 54%/3% | "Mehr anzeigen": cx 96/195 | "Zwei Antriebe. Volle Flexibili": w 342/251 | "BMW X5 50e xDrive": x 
  - 390: [image-geometry] 16 images sized differently (preview/live): #3 342x428/1097x844, #4 342x428/844x844, #5 390x693/390x293, #6 390x693/390x293, #7 1097x844/390x488
  - 390: [broken-images] 1: https://www.bmw.de/content/dam/bmw/common/all-models/general/video/technical-animation/sensors-and-cameras/global_tec-ani-nk_sensors_cameras

### /de/neufahrzeuge/x/x1/bmw-x1-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 92%
- blocks: hero-stage, technical-data, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x1/bmw-x1
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 100% / 95%
- blocks: hero-stage, content-navigation, drivetrain-switch, model-offer, hero-teaser, columns, color-switch, disclaimer, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 23 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 xDrive23i": size 20/15, weight 300/700 | "Gewerbekunden": size 18/20 | "3
  - 1440: [layout] 36/104 text blocks placed differently: "Die Modelle des BMW X1.": w 538/405 | "Technische Daten": cx -107/83 | "Angebote": cx 15/205 | "Preisliste": cx 107/297 
  - 1440: [image-geometry] 14 images sized differently (preview/live): #15 612x408/294x196, #16 612x408/294x196, #18 1440x630/718x479, #19 1440x630/294x196, #20 1440x630/294x196
  - 768: [typography] 16 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X1 xDrive23i": size 18/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €"
  - 768: [layout] 35/104 text blocks placed differently: "Technische Daten": cx -352/77 | "Angebote": cx -240/189 | "Preisliste": cx -156/273 | "Probefahrt vereinbaren": cx -29/4
  - 768: [image-geometry] 16 images sized differently (preview/live): #3 324x194/184x110, #4 324x194/184x110, #5 324x194/184x110, #6 324x194/184x110, #17 1024x1024/1820x1024
  - 390: [typography] 16 runs differ: "im Monat leasen.": align left/center | "BMW X1 xDrive23i": size 17/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 16/14 | "✔ Laufl
  - 390: [image-geometry] 9 images sized differently (preview/live): #18 844x844/342x228, #19 844x844/342x228, #20 844x844/342x228, #21 844x844/342x228, #24 342x228/390x585

### /de/neufahrzeuge/x/x3/bmw-x3-phev-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 99% / 98% / 90%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 11/87 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 768: [missing-text] 11/87 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve
  - 390: [height] preview 8386px vs live 9330px (90%)
  - 390: [missing-text] 11/87 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Bei Plug-in-Hybrid: Leistung abhängig vo", "Setzt sich zusammen aus ve

### /de/neufahrzeuge/x/x3/bmw-x3-phev
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 93% / 90%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, preview-slider, columns, color-switch, carousel, video, tabs, multi-content-gallery, media, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R2: crops/ratios per breakpoint; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 6 runs differ: "Preisliste": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 30e xDrive": size 20/15, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybrid": si
  - 1440: [layout] 11/100 text blocks placed differently: "Der BMW X3 Plug-in-Hybrid.": w 512/297 | "BMW X3 30e xDrive": cx 188/440 | "Gebaut, um die Welt zu entdeck": w 512/367 |
  - 1440: [image-geometry] 33 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/718x479, #4 718x479/1440x629, #5 1440x630/1008x441, #6 320x320/1008x441
  - 768: [typography] 7 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 30e xDrive": size 18/14, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybri
  - 768: [layout] 19/101 text blocks placed differently: "Technische Daten": cx -333/-94 | "Preisliste": cx -224/15 | "Probefahrt vereinbaren": cx -97/142 | "Design": cx 22/261 |
  - 768: [image-geometry] 28 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/382x255, #4 382x255/768x768, #5 768x768/1820x1024, #6 208x208/1820x1024
  - 390: [typography] 9 runs differ: "BMW X3 30e xDrive": size 17/14, weight 300/700 | "Preisliste BMW X3 Plug-in-Hybrid": size 16/14, align start/center | "Gebaut, um die Welt zu en
  - 390: [image-geometry] 24 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/342x228, #4 342x229/390x585, #5 390x585/1097x844, #6 342x342/1097x844
- notes: live vehicle stock (preview slider) needs the bmw-proxy worker

### /de/neufahrzeuge/x/x3/bmw-x3-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-teaser, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "gemäß Ökobilanzstudie zum P
  - 768: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "gemäß Ökobilanzstudie zum P
  - 390: [missing-text] 7/78 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Die nachgeladene Reichweite nach 10 Minu", "gemäß Ökobilanzstudie zum P

### /de/neufahrzeuge/x/x3/bmw-x3
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 99%
- blocks: hero-teaser, disclaimer, content-navigation, drivetrain-switch, model-offer, columns, color-switch, carousel, video, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: poster until first frame; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 19 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 20 xDrive": size 20/15, weight 300/700 | "Gewerbekunden": size 18/20 | "529,00 €/
  - 1440: [layout] 19/115 text blocks placed differently: "BMW X3 20 xDrive": cx 182/465 | "Unverbindliches Leasingbeispie": w 556/377 | "19.044,00 €": w 400/232 | "✔ Leasingsonde
  - 1440: [image-geometry] 32 images sized differently (preview/live): #2 1440x630/930x759, #3 930x759/588x353, #5 612x367/1440x628, #6 1440x630/718x479, #7 320x320/1008x441
  - 768: [typography] 14 runs differ: "Angebote": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X3 20 xDrive": size 18/14, weight 300/700 | "✔ Leasingsonderzahlung: 0,00 €": size 1
  - 768: [layout] 30/116 text blocks placed differently: "Technische Daten": cx -352/-119 | "Angebote": cx -240/-7 | "Preisliste": cx -156/77 | "Probefahrt vereinbaren": cx -29/2
  - 768: [image-geometry] 30 images sized differently (preview/live): #2 768x336/840x686, #3 840x686/300x180, #5 324x194/768x768, #6 768x768/382x255, #7 208x208/1820x1024
  - 390: [typography] 17 runs differ: "BMW X3 20 xDrive": size 17/14, weight 300/700 | "Technische Daten": color rgb(77, 77, 77)/rgb(255, 255, 255) | "✔ Leasingsonderzahlung: 0,00 €"
  - 390: [image-geometry] 27 images sized differently (preview/live): #2 390x520/513x419, #3 513x419/318x191, #5 342x205/390x586, #6 390x585/342x228, #7 342x342/1097x844

### /de/neufahrzeuge/x/x6/bmw-x6-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/neufahrzeuge/x/x6/bmw-x6
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 95%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [image-geometry] 9 images sized differently (preview/live): #20 718x479/400x266, #23 400x267/718x479, #24 718x479/400x266, #25 718x479/400x266, #26 400x267/718x478
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80
  - 768: [layout] 15/89 text blocks placed differently: "Technische Daten": cx -173/77 | "Design": cx -71/179 | "Preisliste": cx 4/254 | "Technologien": cx 99/349 | "Leasen & Fin
  - 768: [image-geometry] 14 images sized differently (preview/live): #14 1024x1024/1820x1024, #15 1024x1024/382x255, #16 1024x1024/382x255, #17 1024x1024/672x448, #18 1024x1024/672x448
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [image-geometry] 9 images sized differently (preview/live): #15 844x844/390x260, #16 844x844/390x260, #17 844x844/342x228, #18 844x844/342x228, #26 342x228/390x438
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g06_comfort-features_crafted-clarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/x/x7/bmw-x7-technische-daten
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 99% / 90%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: 
  - 1440: [missing-text] 6/71 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene Reichweite
  - 768: [missing-text] 6/71 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene Reichweite
  - 390: [missing-text] 6/71 live text runs not visible on preview: "Angaben zu Leistung für Benzinmotoren be", "Setzt sich zusammen aus verbrennungsmoto", "Die nachgeladene Reichweite

### /de/neufahrzeuge/x/x7/bmw-x7
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 95% / 91%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, video, carousel, columns, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 6 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW X7 xDrive40i": size 20/15, weight 300/700 | "Ihr Assistent für entspanntes Re
  - 1440: [layout] 37/110 text blocks placed differently: "Der BMW X7.": w 538/207 | "Technische Daten": cx -80/83 | "Design": cx 32/195 | "Preisliste": cx 114/277 | "Fahrdynamik"
  - 1440: [image-geometry] 19 images sized differently (preview/live): #9 1248x702/1248x150, #10 1248x702/1248x150, #21 400x267/294x196, #22 400x267/294x196, #23 400x267/1248x150
  - 1440: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=1024&fmt=webp&qlt=80
  - 768: [layout] 19/109 text blocks placed differently: "Technische Daten": cx -270/77 | "Design": cx -168/179 | "Preisliste": cx -93/254 | "Fahrdynamik": cx 2/349 | "Probefahrt
  - 768: [image-geometry] 19 images sized differently (preview/live): #9 672x378/672x150, #10 672x378/672x150, #14 1024x1024/1820x1024, #15 1024x1024/382x215, #16 1024x1024/382x215
  - 768: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=768&fmt=webp&qlt=80
  - 390: [image-geometry] 14 images sized differently (preview/live): #9 390x219/390x150, #10 390x219/390x150, #15 844x844/390x219, #16 844x844/390x219, #17 844x844/342x228
  - 390: [broken-images] 1: https://bmw.scene7.com/is/image/BMW/g07_ice_interieur_craftedclarity:3to2?fit=constrain%2C1&wid=480&fmt=webp&qlt=80

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-roadster
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 91%
- blocks: hero-stage, disclaimer, content-navigation, drivetrain-switch, hero-teaser, color-switch, columns, carousel, tabs, multi-content-gallery, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: card title sizes, large-titles option; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 sDrive30i": size 20/15, weight 300/700 | "Preisliste BMW Z4 Roadster": siz
  - 1440: [layout] 12/74 text blocks placed differently: "Der BMW Z4 Roadster.": w 538/363 | "BMW Z4 sDrive30i": cx 182/515 | "Für eine einzigartige Atmosphä": w 612/294 | "Fester
  - 1440: [image-geometry] 11 images sized differently (preview/live): #20 1440x630/718x479, #21 1440x630/718x479, #22 1440x630/294x196, #23 718x479/294x196, #24 718x479/294x196
  - 768: [typography] 5 runs differ: "Technische Daten": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Z4 sDrive30i": size 18/14, weight 300/700 | "Freiheit, die man fahren kann.":
  - 768: [layout] 18/77 text blocks placed differently: "Technische Daten": cx -172/77 | "Design": cx -70/179 | "Preisliste": cx 5/254 | "Fahrdynamik": cx 100/349 | "Probefahrt v
  - 768: [image-geometry] 9 images sized differently (preview/live): #19 1024x1024/1820x1024, #20 1024x1024/382x255, #21 1024x1024/382x255, #22 1024x1024/672x448, #23 382x255/672x448
  - 390: [typography] 4 runs differ: "BMW Z4 sDrive30i": size 17/14, weight 300/700 | "Freiheit, die man fahren kann.": align center/start | "Der BMW Z4 Roadster lässt Grenzen hi": a
  - 390: [layout] 8/71 text blocks placed differently: "BMW Z4 sDrive30i": cx 195/58 | "Rückwärtsfahren, leicht gemach": x 363/227 | "Der Rückfahrassistent unterstü": x 363/227 |
  - 390: [image-geometry] 5 images sized differently (preview/live): #20 844x844/390x260, #21 844x844/390x260, #22 844x844/342x228, #28 342x228/390x438, #29 342x228/390x438

### /de/neufahrzeuge/z4/z4-roadster/bmw-z4-technische-daten
- status: match; widths: 1440, 768, 390; height ratio: 100% / 100% / 91%
- blocks: hero-stage, disclaimer, technical-data
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: poster stays until the video paints a frame / when HLS is unavailable; R3: group headings separated from footnote marks, short layout (3 facts per row)
- remaining: none

### /de/publicpools/sitemap/sitemap
- status: differences remain; widths: 1440, 768, 390; height ratio: 94% / 95% / 61%
- blocks: columns, link-list
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 974px vs live 1593px (61%)
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
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 94% / 89%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13479px vs live 11357px (119%)
  - 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 1440: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1179 | "Gewerbekunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unver
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 376x167/1248x416, #8 376x167/506x405, #10 1248x998/506x368, #11 1248x416/376x167
  - 768: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 768: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Gewerbekunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 648x288/672x448, #6 648x288/556x445, #7 648x288/672x448, #8 648x288/556x404, #9 672x448/536x238
  - 390: [height] preview 13512px vs live 15138px (89%)
  - 390: [typography] 15 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Plug-in-Hybride": cx 196/94 | "BMW Elektroautos.": cx 84/195 | "26.604,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 318x141/342x342, #5 318x141/342x274, #6 318x141/342x342, #7 318x141/342x249, #9 342x342/342x228

### /de/shop-online/bmw-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 118% / 94% / 89%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13541px vs live 11433px (118%)
  - 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Privatkunden": colo
  - 1440: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1115 | "Privatkunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unverb
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 376x167/1248x416, #8 376x167/506x405, #10 1248x998/506x380, #11 1248x416/376x167
  - 768: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Privatkunden": colo
  - 768: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Privatkunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371 
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 648x288/672x448, #6 648x288/556x445, #7 648x288/672x448, #8 648x288/556x417, #9 672x448/536x238
  - 390: [height] preview 13565px vs live 15176px (89%)
  - 390: [typography] 15 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Plug-in-Hybride": cx 196/94 | "BMW Elektroautos.": cx 84/195 | "32.364,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 318x141/342x342, #5 318x141/342x274, #6 318x141/342x342, #7 318x141/342x257, #9 342x342/342x228

### /de/topics/fascination-bmw/corporate-direct-sales/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 94% / 91%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 3 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #8 529x432/1440x66
  - 768: [layout] 18/65 text blocks placed differently: "Ihre Vorteile": cx -26/59 | "Top-Themen": cx 76/161 | "Dienstwagen-Favoriten": cx 215/300 | "Ihre Ansprechpartner": cx 38
  - 768: [image-geometry] 5 images sized differently (preview/live): #5 672x448/416x339, #7 421x344/768x59, #8 421x344/672x449, #11 672x448/382x255, #12 382x255/672x449
  - 390: [image-geometry] 2 images sized differently (preview/live): #5 342x228/257x210, #6 396x323/257x210

### /de/topics/fascination-bmw/events/quiztaxi2024
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 91% / 82%
- blocks: hero-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 390: [height] preview 2871px vs live 3507px (82%)

### /de/topics/fascination-bmw/events/vip-experience
- status: differences remain; widths: 1440, 768, 390; height ratio: 100% / 100% / 83%
- blocks: hero-teaser, video, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [layout] 3/7 text blocks placed differently: "BMW x Wintersport": w 512/376 | "VIP Experience Biathlon auf Sc": w 512/381 | "Shuttle-Service im vollelektri": w 1248/674
  - 390: [height] preview 2988px vs live 3591px (83%)

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 89% / 89%
- blocks: hero-teaser, carousel, tabs, content-table
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R2: tab layout at 768/390; R3: series accordions (bmw-reifenkennzeichnung), width-N options
- remaining: 
  - 768: [height] preview 6507px vs live 7284px (89%)
  - 768: [layout] 9/59 text blocks placed differently: "Schweden": x 696/738 | "Österreich": x 696/738 | "Frankreich": x 696/738 | "Deutschland": x 696/738 | "Tschechien": x 696/
  - 390: [height] preview 6252px vs live 7030px (89%)

### /de/topics/faszination-bmw/bmw-xdrive-erleben/wintersport/rennrodeln
- status: differences remain; widths: 1440, 768, 390; height ratio: 89% / 84% / 87%
- blocks: hero-teaser, content-table, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 4384px vs live 4948px (89%)
  - 768: [height] preview 4820px vs live 5750px (84%)
  - 768: [layout] 8/42 text blocks placed differently: "Die BMW Rennrodel Saison 2025/": ypos 42%/49% | "Österreich": x 696/738 | "Lettland": x 696/738 | "Deutschland": x 696/738
  - 390: [height] preview 5720px vs live 6549px (87%)

### /de/topics/faszination-bmw/events/bmw-golfsport
- status: differences remain; widths: 1440, 768, 390; height ratio: 98% / 97% / 81%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [layout] 3/8 text blocks placed differently: "BMW Golfsport.": w 512/309 | "BMW International Open.": w 400/262 | "Friends of the Brand.": w 400/218
  - 390: [height] preview 3099px vs live 3837px (81%)

### /de/topics/faszination-bmw/events/bmw-golfsport/friends-of-the-brand
- status: differences remain; widths: 1440, 768, 390; height ratio: 95% / 95% / 83%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 390: [height] preview 3492px vs live 4232px (83%)

### /de/topics/faszination-bmw/events/bmw-golfsport/golf-cup
- status: differences remain; widths: 1440, 768, 390; height ratio: 88% / 89% / 80%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 2818px vs live 3217px (88%)
  - 1440: [layout] 10/10 text blocks placed differently: "BMW Golf Cup.": w 512/295 | "Er ist die größte internationa": x 96/308, w 1248/824 | "Ein Profi bei einem Major-Turn": x 
  - 768: [height] preview 4021px vs live 4504px (89%)
  - 768: [layout] 9/10 text blocks placed differently: "Er ist die größte internationa": x 48/164, w 672/440 | "Ein Profi bei einem Major-Turn": x 48/164, w 672/440 | "In Deutsch
  - 390: [height] preview 3343px vs live 4194px (80%)

### /de/topics/faszination-bmw/events/kulturelles-engagement
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 136% / 90%
- blocks: hero-teaser, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 7437px vs live 8269px (90%)
  - 1440: [layout] 19/36 text blocks placed differently: "Verantwortung übernehmen.": w 512/295 | "Die Kulturförderung der BMW Gr": x 96/308, w 1248/824 | "Zur Kulturbroschüre": c
  - 768: [height] preview 11676px vs live 8615px (136%)
  - 768: [layout] 7/36 text blocks placed differently: "Die Kulturförderung der BMW Gr": x 48/164, w 672/440 | "Zur Kulturbroschüre": cx 137/385 | "Klassische Musik und Jazz.": w
  - 768: [image-geometry] 12 images sized differently (preview/live): #2 672x378/324x182, #3 672x378/324x182, #4 672x378/324x182, #5 672x378/324x182, #6 672x378/324x182
  - 390: [height] preview 10099px vs live 11226px (90%)

### /de/topics/faszination-bmw/events/wintersport
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 89% / 76%
- blocks: hero-teaser, columns, disclaimer, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [layout] 9/30 text blocks placed differently: "Starker Partner des Winterspor": x 96/308, w 1248/522 | "Freuen Sie sich auf einen beso": x 96/308, w 1248/824 | "In diese
  - 768: [height] preview 7234px vs live 8147px (89%)
  - 768: [image-geometry] 2 images sized differently (preview/live): #2 672x168/672x378, #5 672x378/672x896
  - 390: [height] preview 7267px vs live 9594px (76%)
  - 390: [layout] 9/30 text blocks placed differently: "Starker Partner des Winterspor": x 24/84, w 342/221, ypos 32%/25% | "Freuen Sie sich auf einen beso": x 24/84, w 342/223 |

### /de/topics/faszination-bmw/events/wintersport/bmw-group-windkanal
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 84% / 86%
- blocks: hero-teaser, video, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 4099px vs live 4573px (90%)
  - 1440: [layout] 10/11 text blocks placed differently: "Der BMW Group Windkanal.": w 512/319 | "Mit BMW 3D-Druck auf Zeitenjag": w 512/361 | "Ein Sieggarant auf der ganzen ": x 
  - 768: [height] preview 4468px vs live 5328px (84%)
  - 768: [layout] 9/11 text blocks placed differently: "Ein Sieggarant auf der ganzen ": x 48/164, w 672/440 | "Warum ein Windkanal?": x 48/164, w 672/302 | "Schon seit 2010 arbe
  - 390: [height] preview 4667px vs live 5432px (86%)

### /de/topics/faszination-bmw/events/wintersport/bmw-ibu-weltcup-biathlon
- status: differences remain; widths: 1440, 768, 390; height ratio: 83% / 94% / 82%
- blocks: hero-teaser, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [height] preview 2686px vs live 3220px (83%)
  - 1440: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 23/20 | "Es ist klasse, dass wir in der BMW-F": size 18/28, align center/start | "Lena Gercke": alig
  - 1440: [layout] 3/7 text blocks placed differently: "BMW IBU Weltcup Biathlon": w 512/359 | "January 09, 2025 to January 12": w 512/337 | "Biathlonzentrum 1 83324, Ruhpo": w 51
  - 768: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 20/18 | "Es ist klasse, dass wir in der BMW-F": size 17/25, align center/start | "Lena Gercke": alig
  - 390: [height] preview 3133px vs live 3824px (82%)
  - 390: [typography] 3 runs differ: "January 09, 2025 to January 12, 2025": size 19/17 | "Es ist klasse, dass wir in der BMW-F": size 16/23, align center/start | "Lena Gercke": alig

### /de/topics/faszination-bmw/events/wintersport/bmw-rodelsimulation-wbs
- status: differences remain; widths: 1440, 768, 390; height ratio: 84% / 81% / 85%
- blocks: hero-teaser, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [height] preview 3257px vs live 3875px (84%)
  - 1440: [layout] 8/10 text blocks placed differently: "Der Bob- und Schlittenverband ": x 96/308, w 1248/824 | "Die deutschen Rennrodler start": x 96/308, w 1248/824 | "Die Grun
  - 768: [height] preview 4172px vs live 5144px (81%)
  - 768: [layout] 8/10 text blocks placed differently: "Der Bob- und Schlittenverband ": x 48/164, w 672/440 | "Die deutschen Rennrodler start": x 48/164, w 672/440 | "Die Grundl
  - 390: [height] preview 4598px vs live 5399px (85%)

### /de/topics/faszination-bmw/grosskunden-behoerden/behoerdenfahrzeuge
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 92% / 89%
- blocks: hero-teaser, columns, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 768: [layout] 29/111 text blocks placed differently: "Konfigurator": cx 174/284 | "Gebietsleiterin": w 113/648 | "Hamburg": w 74/648 | "Mobil: +49 151 60510221": w 194/648 | 
  - 390: [height] preview 7945px vs live 8959px (89%)
  - 390: [layout] 23/111 text blocks placed differently: "Gebietsleiterin": w 106/326 | "Hamburg": w 68/326 | "Mobil: +49 151 60510221": w 181/326 | "Gebietsleiter": w 93/326 | "

### /de/topics/faszination-bmw/grosskunden-behoerden/corporate-sales
- status: differences remain; widths: 1440, 768, 390; height ratio: 96% / 94% / 92%
- blocks: hero-teaser, disclaimer, content-navigation, icon-teaser, columns, model-overview, download, embed, accordion, carousel
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slider track restored (no stacking), 15/24 bullets, large-titles, empty facts dropped, M-logo cells; R3: tablet width from source grid; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards
- remaining: 
  - 1440: [image-geometry] 3 images sized differently (preview/live): #2 1440x810/400x267, #5 400x267/518x423, #8 529x432/1440x66
  - 768: [layout] 19/70 text blocks placed differently: "Ihre Vorteile": cx -186/59 | "Top-Themen": cx -84/161 | "Dienstwagen-Favoriten": cx 55/300 | "Fahrzeugempfehlung": cx 222
  - 768: [image-geometry] 5 images sized differently (preview/live): #5 672x448/416x339, #7 421x344/768x59, #8 421x344/672x449, #12 672x448/382x255, #13 382x255/672x449

### /de/topics/faszination-bmw/sport-events/weltcup
- status: differences remain; widths: 1440, 768, 390; height ratio: 125% / 91% / 79%
- blocks: hero-teaser, video, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: poster until first frame
- remaining: 
  - 1440: [height] preview 4298px vs live 3433px (125%)
  - 1440: [layout] 5/8 text blocks placed differently: "BMW WeltcupHeroes 2025.": w 512/274 | "BMW Weltcup Heroes Ruhpolding ": x 96/732, w 1248/506, ypos 40%/30% | "BMW präsentie
  - 1440: [image-geometry] 4 images sized differently (preview/live): #2 1248x702/612x344, #3 1248x702/612x344, #4 1248x702/612x344, #5 1248x702/612x344
  - 768: [layout] 4/8 text blocks placed differently: "BMW Weltcup Heroes Ruhpolding ": w 672/246 | "BMW präsentiert die Geschichte": w 672/324 | "BMW Weltcup Heroes Oberhof 202"
  - 768: [image-geometry] 2 images sized differently (preview/live): #4 672x378/324x182, #5 672x378/324x182
  - 390: [height] preview 3845px vs live 4871px (79%)
  - 390: [image-geometry] 2 images sized differently (preview/live): #4 390x219/390x119, #5 390x219/390x119

### /de/topics/neuwagen/gewaehrleistung
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 96% / 92%
- blocks: hero-teaser, content-navigation, columns
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px
- remaining: 
  - 1440: [typography] 13 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Erweiterte Batteriegewährleistung": align start/center | "BMW Qualitätsbrief": siz
  - 1440: [layout] 10/58 text blocks placed differently: "Gewährleistungen, Garantien un": w 512/368 | "Gewährleistung": cx 160/64 | "Erweiterte Batteriegewährleist": cx 362/266 |
  - 768: [typography] 13 runs differ: "Gewährleistung": color rgb(102, 102, 102)/rgb(38, 38, 38) | "Erweiterte Batteriegewährleistung": align start/center | "BMW Qualitätsbrief": siz
  - 768: [layout] 7/58 text blocks placed differently: "Gewährleistung": cx 106/58 | "Erweiterte Batteriegewährleist": cx 290/242 | "Garantien": cx 456/408 | "Reifenversicherung"
  - 390: [typography] 11 runs differ: "BMW Qualitätsbrief": size 16/14 | "BMW Plug-in-Hybride (Generationen 3.": size 16/14, align start/center | "BMW i8": size 16/14 | "BMW i3 (I01)

### /de/topics/service-zubehoer/bmw-security
- status: differences remain; widths: 1440, 768, 390; height ratio: 97% / 93% / 89%
- blocks: hero-teaser, columns, content-table, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 11/40 text blocks placed differently: "BMW Security": w 512/278 | "Sie fahren, wir schützen.": w 512/253 | "BMW Security hilft Ihnen dabei": x 96/308, w 1248/82
  - 768: [layout] 7/40 text blocks placed differently: "BMW Security hilft Ihnen dabei": x 48/164, w 672/440 | "Ihre Vorteile:": x 48/164, w 672/440 | "Original BMW Sicherheitssy
  - 390: [height] preview 7222px vs live 8153px (89%)

### /de/topics/service-zubehoer/bmw-service/repair-inclusive
- status: differences remain; widths: 1440, 768, 390; height ratio: 93% / 90% / 89%
- blocks: hero-teaser, content-navigation, columns, carousel, accordion, disclaimer
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 15/102 text blocks placed differently: "BMW Service": x 96/0 | "Proactive Care": cx 314/218 | "Service Inclusive": cx 448/352 | "Repair Inclusive": cx 588/492 |
  - 768: [layout] 15/102 text blocks placed differently: "BMW Service": x 47/-1 | "Proactive Care": cx 103/55 | "Service Inclusive": cx 226/178 | "Repair Inclusive": cx 352/304 |
  - 390: [height] preview 9368px vs live 10580px (89%)

### /de/topics/service-zubehoer/bmw-service/rueckrufe
- status: differences remain; widths: 1440, 768, 390; height ratio: 90% / 85% / 83%
- blocks: hero-teaser, embed
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking
- remaining: 
  - 1440: [height] preview 3695px vs live 4115px (90%)
  - 1440: [layout] 11/20 text blocks placed differently: "Häufige Kundenfragen zu Rückru": cx 243/614 | "Weitere Informationen zum TAKA": cx 561/826 | "BMW Partner": cx 1149/741 |
  - 768: [height] preview 3989px vs live 4677px (85%)
  - 768: [layout] 11/20 text blocks placed differently: "Häufige Kundenfragen zu Rückru": cx 190/326 | "Weitere Informationen zum TAKA": cx 518/442 | "Frage: Wo finde ich meine 1
  - 390: [height] preview 4282px vs live 5130px (83%)

### /de/topics/service-zubehoer/financial-services/bmw-financial-services
- status: differences remain; widths: 1440, 768, 390; height ratio: 104% / 99% / 93%
- blocks: hero-teaser, content-navigation, icon-teaser, carousel, columns, content-table, disclaimer, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: tablet width from source grid
- remaining: 
  - 1440: [typography] 8 runs differ: "Leasing oder Finanzierung": align start/center | "Aktuelle Angebote": color rgb(38, 38, 38)/rgb(102, 102, 102) | "Mehr zum BMW Leasing": color r
  - 1440: [layout] 24/125 text blocks placed differently: "Ihre Vorteile": cx 147/51 | "Leasing oder Finanzierung": cx 308/212 | "Zusatzangebote": cx 486/390 | "Aktuelle Angebote"
  - 1440: [image-geometry] 12 images sized differently (preview/live): #2 1440x810/294x196, #7 294x196/612x409, #9 612x409/400x267, #12 400x267/612x409, #13 1248x833/612x406
  - 768: [layout] 19/125 text blocks placed differently: "Ihre Vorteile": cx 95/47 | "Leasing oder Finanzierung": cx 242/194 | "Zusatzangebote": cx 403/355 | "Aktuelle Angebote":
  - 768: [image-geometry] 12 images sized differently (preview/live): #7 672x448/324x216, #9 324x216/672x449, #12 672x448/324x216, #13 672x449/324x215, #14 672x446/536x238
  - 390: [image-geometry] 8 images sized differently (preview/live): #14 342x227/326x145, #15 318x141/342x228, #16 318x141/342x227, #18 342x227/342x343, #20 342x342/390x219

### /de/topics/service-zubehoer/financial-services/bmw-finanzierung
- status: differences remain; widths: 1440, 768, 390; height ratio: 105% / 100% / 94%
- blocks: hero-teaser, content-navigation, icon-teaser, video, columns, content-table, disclaimer, carousel, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: no longer collapsed by the centered-list rule; R0: poster until first frame; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: series accordions (bmw-reifenkennzeichnung), width-N options; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R3: tablet width from source grid
- remaining: 
  - 1440: [layout] 19/97 text blocks placed differently: "BMW Finanzierung": cx 172/76 | "Finanzierungsupgrades": cx 347/251 | "Aktuelle Angebote": cx 522/426 | "Support": cx 640/
  - 768: [layout] 14/97 text blocks placed differently: "BMW Finanzierung": cx 117/69 | "Finanzierungsupgrades": cx 276/228 | "Aktuelle Angebote": cx 434/386 | "Support": cx 543/
  - 390: [image-geometry] 6 images sized differently (preview/live): #9 318x141/342x228, #12 342x227/342x342, #13 342x342/342x228, #14 342x229/342x342, #15 342x342/342x228

### /de/topics/service-zubehoer/financial-services/bmw-leasing
- status: differences remain; widths: 1440, 768, 390; height ratio: 103% / 88% / 88%
- blocks: hero-teaser, content-navigation, carousel, cards-quicklink, columns, disclaimer, accordion, icon-teaser, video
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid; R3: no longer collapsed by the centered-list rule; R0: poster until first frame
- remaining: 
  - 1440: [layout] 28/166 text blocks placed differently: "Ihre Vorteile": cx 147/51 | "BMW Leasing": cx 263/167 | "BMW Leasing Upgrades": cx 422/326 | "BMW Versicherungen": cx 60
  - 768: [height] preview 28934px vs live 32719px (88%)
  - 768: [layout] 29/166 text blocks placed differently: "Ihre Vorteile": cx 95/47 | "BMW Leasing": cx 202/154 | "BMW Leasing Upgrades": cx 347/299 | "BMW Versicherungen": cx 517
  - 390: [height] preview 28505px vs live 32320px (88%)
  - 390: [image-geometry] 8 images sized differently (preview/live): #13 318x141/342x228, #19 342x227/390x390, #20 390x390/390x219, #22 390x219/390x390, #23 390x390/342x228

### /de-de/shop-online/bmw-business-offers
- status: differences remain; widths: 1440, 768, 390; height ratio: 119% / 94% / 89%
- blocks: content-navigation, hero-teaser, disclaimer, carousel, columns, accordion
- fixed: R1: typography follows source title/text styles (headline/subsection/body-2), centered section intros, default-content grid spans/offsets per breakpoint; R1: header style (transparent/solid) per page from live captures; R2: global centered-list rule scoped to default content (was collapsing block tracks); R3: tablet (768) spans/offsets for default content; R0: source text/CTA spacing variants (text-top/bottom, cta-*), tablet button stacking; R3: slides side by side per slides-* variant, static grid, peek track; 15px body; centred/body-2 options; offer cards; R0: grid-width detection (side-by-side rows), inset/middle/stack-md options; R3: video/download cells kept inside columns, reverse rows, link size 15px; R3: tablet width from source grid
- remaining: 
  - 1440: [height] preview 13479px vs live 11357px (119%)
  - 1440: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 1440: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/1179 | "Gewerbekunden": x 96/190 | "BMW i4 M60 xDrive Gran Coupé": x 96/242 | "Unver
  - 1440: [image-geometry] 11 images sized differently (preview/live): #2 1248x998/506x405, #7 376x167/1248x416, #8 376x167/506x405, #10 1248x998/506x368, #11 1248x416/376x167
  - 768: [typography] 15 runs differ: "BMW Plug-in-Hybride": color rgb(102, 102, 102)/rgb(38, 38, 38) | "BMW Modelle mit Verbrennungsmotor": align start/center | "Gewerbekunden": col
  - 768: [layout] 25/79 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/627 | "Gewerbekunden": x 48/94 | "BMW i4 M60 xDrive Gran Coupé": x 48/122, w 672/371
  - 768: [image-geometry] 10 images sized differently (preview/live): #5 648x288/672x448, #6 648x288/556x445, #7 648x288/672x448, #8 648x288/556x404, #9 672x448/536x238
  - 390: [height] preview 13512px vs live 15138px (89%)
  - 390: [typography] 15 runs differ: "BMW Plug-in-Hybride": size 28/14, color rgb(255, 255, 255)/rgb(102, 102, 102) | "BMW Elektroautos.": size 14/28, color rgb(77, 77, 77)/rgb(255,
  - 390: [layout] 15/78 text blocks placed differently: "Leasingbeispiele der BMW Bank ": w 1/320 | "BMW Plug-in-Hybride": cx 196/94 | "BMW Elektroautos.": cx 84/195 | "26.604,00
  - 390: [image-geometry] 8 images sized differently (preview/live): #4 318x141/342x342, #5 318x141/342x274, #6 318x141/342x342, #7 318x141/342x249, #9 342x342/342x228

