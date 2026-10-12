# BMW CarPlay demo (iOS Simulator)

"Places with a story" on the car screen, plus the car itself. Three tabs, all content from existing
Document Authoring pages read through html2json:

- **Orte**: BMW places on a CarPlay map, sorted by distance. Each place is a migrated bmw.de page. "Vorlesen" reads it aloud; when the car comes within a place's radius, an alert offers the story.
- **Mein BMW**: the showcase i5 page for the driver's language and the car's market, with "range you have now" (WLTP range x charge level).
- **News**: the market's news list; articles can be read aloud.

Nothing was written for the car except one sheet, `/aida/showcase/data/places.json`, that puts seven existing pages on the map (rows in `demo/places.json`; the app has the same rows built in until the sheet is published).

## Run it

Prerequisites: Xcode 26.6 and the iOS 18.6 simulator runtime (`xcodebuild -downloadPlatform iOS -buildVersion 18.6`, about 9 GB). `run.sh up` creates the "BMW CarPlay 18.6" simulator (iPhone 16 Pro) if it is missing. The iOS 26.5 runtime is not used: it crashes on any CarPlay map template, so the map would not show. No other tools; the Xcode project is checked in.

```sh
cd tools/aida/carplay
./demo/run.sh up        # build, boot, install, launch
```

Then, once per Simulator session, choose **I/O > External Displays > CarPlay** and tap the BMW icon on the CarPlay home screen. (`run.sh up` tries to open the window itself; that needs Accessibility access for your terminal app and is otherwise skipped with a message. Relaunching the app does not reopen it on the car screen, so tap the icon again after each install.)

| Demo moment | Command |
|---|---|
| 1. The road tells the story: a 4-minute drive Munich, Iphitos, BMW Park, Ruhpolding, Salzburg | `./demo/run.sh drive 4` |
| 2. The market follows the car, the language stays yours | the drive crosses at Walserberg (`de/de` to `de/at`); `./demo/run.sh at salzburg` jumps there; `./demo/run.sh lang fr` switches language |
| 3. Range you have now | `./demo/run.sh soc 30` |
| 4. Edit in Experience Workspace, refresh in the car | edit `/aida/showcase/de/de/i5`, Preview, then `./demo/run.sh refresh` (html2json may lag up to 60 s) |
| Reset | `./demo/run.sh reset` |

Other: `./demo/run.sh at munich|iphitos|bmw-park|ruhpolding|salzburg`, `./demo/run.sh shot <name>` (car screen to `demo/shots/`), `./demo/run.sh down`.

Deep links drive the app without tapping: `bmwcarplay://vehicle?soc=15&odo=29800&market=fr/fr&lang=fr` (`market=auto` clears the override), `bmwcarplay://refresh`, `bmwcarplay://reset`, `bmwcarplay://tab?index=1`, `bmwcarplay://open?path=/aida/showcase/de/de/news/cannes`. `run.sh` sends them without a prompt: it writes the URL to the app's `Documents/cmd.txt` and posts the notification `com.adobe.aida.BMWCarPlay.cmd`. `xcrun simctl openurl <udid> '<url>'` also works, but iOS 18 asks "Open in BMW?" on the phone each time.

The Xcode way: open `BMWCarPlay.xcodeproj`, scheme BMWCarPlay, the "BMW CarPlay 18.6" simulator, Run; I/O > External Displays > CarPlay; Features > Location > Custom Location, or run `xcrun simctl location <udid> start --speed=1000 --interval=1 - < demo/drive-munich-salzburg.txt`. `demo/drive-munich-salzburg.gpx` carries timestamps for Xcode's location simulation.

Tests: `xcodebuild -project BMWCarPlay.xcodeproj -scheme BMWCarPlay -destination 'platform=iOS Simulator,name=iPhone 17' -derivedDataPath build test` (any simulator works for the tests).

## How it works

- `Sources/Content`: tolerant html2json decoder (`Html2Json.swift`), WDH binding and range parsing (`Bindings.swift`), content client with a 2 MB cap and last-good-page fallback, and view-models (`Mapping.swift`) that the templates are built from.
- `Sources/Vehicle`: vehicle state (model, charge, odometer, language, market override), market resolution (language from the setting, country from the car's position), proximity detection, deep links.
- `Sources/CarPlay`: tab bar, list, information, point-of-interest and alert templates; speech.
- `Sources/Cockpit`: a one-screen SwiftUI cockpit on the phone to set charge, language and market.
- `demo/make-drive.mjs` rebuilds the drive from waypoints via the public OSRM demo server; `--from file.gpx` regenerates the `.txt` from a recorded track.

Language is a personal setting (phone locale or the cockpit); the market (`de/de`, `de/at`, `fr/fr`, `fr/be`) comes from the car's position via reverse geocoding, or from the cockpit override.

## Text on the car screen

CarPlay draws list text in a fixed style and cuts it with "…"; apps have no font or line-limit control. So the content is shortened in `Sources/Content/TextFit.swift`, with the character budgets in `TextBudget`: the Orte row is the short name plus "distance · place" (distance always first), News and Mein BMW rows have no images, value comes before label, and long text lives on the detail card or in information templates. If a row still shows "…" on the Simulator, lower the budget.

## Limits

- Simulator only. A real CarPlay app needs Apple's entitlement for its category; the Simulator build uses `com.apple.developer.carplay-charging` for the template set it allows.
- No real vehicle data: charge level and odometer come from the cockpit or deep links.
- Preview content through html2json on `workers.dev`; a production site would front it with its own CDN worker.
- Only the blocks the showcase and place pages use are mapped; others (`video`, `embed`, `link-list`, columns, card lists) are skipped and counted in the cockpit.
- Place pages are German only. Only the i5 (`61HG`) has a showcase page.
- The drive's road geometry is generated once from OSRM and checked in.

## Navigation map (branch carplay-nav-map)

The app declares `com.apple.developer.carplay-maps`, draws its own `MKMapView` in the car window and keeps the dot at one
fixed spot (`MapLayout`). The Orte list is a normal list template behind the "BMW" button.
The iOS 26.5 simulator runtime crashes on any `CPMapTemplate` (missing `vehicleSupportsDestinationSharing`); run this branch on
the iOS 18.6 runtime (`xcodebuild -downloadPlatform iOS -buildVersion 18.6`). The deployment target is 18.0.

### Driving the car screen from a shell (iOS 18)

`simctl openurl bmwcarplay://…` asks "Open in BMW?" on the phone every time. Use Darwin notifications instead:
`xcrun simctl spawn <udid> notifyutil -p com.adobe.aida.BMWCarPlay.tab0` (Orte), `.tab1` (Mein BMW), `.tab2` (News), `.news0`–`.news3` (article n), `.map` (back to the map).
