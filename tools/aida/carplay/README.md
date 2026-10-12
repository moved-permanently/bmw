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
| 1. The road tells the story: a 4-minute drive Munich, Iphitos, BMW Park, the Chiemgau Arena alert, Salzburg | `./demo/run.sh drive 4` |
| 2. The market follows the car, the language stays yours | the drive crosses at Walserberg (`de/de` to `de/at`); `./demo/run.sh at salzburg` jumps there; `./demo/run.sh lang fr` switches language |
| 3. Range you have now | `./demo/run.sh soc 30` |
| 4. Edit in Experience Workspace, refresh in the car | edit `/aida/showcase/de/de/i5`, Preview, then `./demo/run.sh refresh` (html2json may lag up to 60 s) |
| Reset | `./demo/run.sh reset` |

Other: `./demo/run.sh at munich|iphitos|bmw-park|ruhpolding|salzburg`, `./demo/run.sh shot <name>` (car screen to `demo/shots/`), `./demo/run.sh down`.

Deep links drive the app without tapping: `bmwcarplay://vehicle?soc=15&odo=29800&market=fr/fr&lang=fr` (`market=auto` clears the override), `bmwcarplay://refresh`, `bmwcarplay://reset`, `bmwcarplay://tab?index=1`, `bmwcarplay://open?path=/aida/showcase/de/de/news/cannes`. `run.sh` sends them without a prompt: it writes the URL to the app's `Documents/cmd.txt` and posts the notification `com.adobe.aida.BMWCarPlay.cmd`. `xcrun simctl openurl <udid> '<url>'` also works, but iOS 18 asks "Open in BMW?" on the phone each time.

The Xcode way: open `BMWCarPlay.xcodeproj`, scheme BMWCarPlay, the "BMW CarPlay 18.6" simulator, Run; I/O > External Displays > CarPlay; Features > Location > Custom Location, or play the drive with `./demo/run.sh drive` (see "The drive"). `demo/drive-munich-salzburg.gpx` carries timestamps for Xcode's location simulation.

Tests: `xcodebuild -project BMWCarPlay.xcodeproj -scheme BMWCarPlay -destination 'platform=iOS Simulator,name=iPhone 17' -derivedDataPath build test` (any simulator works for the tests).

## The drive

`./demo/run.sh drive [minutes]` plays a Munich to Salzburg drive on the simulated phone: BMW Headquarters, MTTC Iphitos, BMW Park, then the A8 east to the Walserberg border and Salzburg Mirabellplatz.

**Two routes.** The default is the **direct** A8 route, 172 km. `ROUTE=via-ruhpolding ./demo/run.sh drive 2` adds a detour: Apple Maps routes from BMW Park to the Chiemgau Arena, Ruhpolding, which leaves the A8 near Traunstein/Siegsdorf (about 47.83, 12.55), runs through Ruhpolding and rejoins the A8 near Siegsdorf. It adds 30.6 km (about 31 minutes at Apple's expected travel times). It is opt-in because it adds no alert: the Chiemgau Arena is a seeded place with a 25 km radius, the A8 passes 12.3 km from it, and the alert first fires about 104 km into the route (A8 near Bernau am Chiemsee) on both routes. The detour only adds the drive through Ruhpolding itself.

**Road geometry.** Apple Maps (MapKit `MKDirections`, automobile), one request per leg, cached in `demo/apple-route.json` (full-resolution `MKRoute.polyline` points). `make-drive.mjs` needs no network or Apple Maps access. Where a leg ends at a stop, Apple adds an access road or parking loop; `make-drive.mjs` cuts these out-and-back spurs (up to 400 m around a stop) so the track stays on the through road.

**Points.** The simulator moves in straight lines between points, so every point must be close to the road. `make-drive.mjs` simplifies the Apple polyline with Douglas-Peucker: the output is never more than 4 m from the Apple polyline, and no segment is longer than 200 m. Result: 1,186 points for the default route (1,512 via Ruhpolding); points are 7 to 40 m apart in tight bends and about 200 m apart on straights. A fixed 20 m step would give over 10,000 points, which the car map cannot follow at drive speed. `node demo/verify-drive.mjs` prints the deviation, spacing and proximity numbers.

**Playback.** `simctl location start --interval` sends one update per interval and moves at most speed x interval per update. A segment shorter than that still takes a whole interval, so the drive lasts (points - 1) x interval no matter what speed is set. `run.sh drive N` therefore sets the interval to N x 60 / (points - 1) and a speed high enough that no segment is split, so each update lands on a point. `drive 2` is 12.7 updates per second, `drive 4` 6.3. The update rate is capped at 20 per second (`MIN_INTERVAL=0.05`), so a drive cannot get shorter than about 75 seconds for the default route. Because the points are dense in bends and sparse on straights, the car looks slower in the city than on the A8.

**Refresh the route** (a Mac with network and Apple Maps; MapKit rate-limits to about 50 requests a minute, the tool waits between legs and retries):

```sh
cd tools/aida/carplay/demo
swiftc -O apple-route.swift -o /tmp/apple-route
/tmp/apple-route apple-route-legs.json apple-route.json   # about 40 seconds
node make-drive.mjs                                       # regenerates the .txt and .gpx files
node verify-drive.mjs
```

Stops are in `apple-route-legs.json`. `make-drive.mjs --default via-ruhpolding` makes the detour the default (also change `DEFAULT_ROUTE` in `run.sh`). `--tolerance` and `--max-segment` change the simplification.

## How it works

- `Sources/Content`: tolerant html2json decoder (`Html2Json.swift`), WDH binding and range parsing (`Bindings.swift`), content client with a 2 MB cap and last-good-page fallback, and view-models (`Mapping.swift`) that the templates are built from.
- `Sources/Vehicle`: vehicle state (model, charge, odometer, language, market override), market resolution (language from the setting, country from the car's position), proximity detection, deep links.
- `Sources/CarPlay`: tab bar, list, information, point-of-interest and alert templates; speech.
- `Sources/Cockpit`: a one-screen SwiftUI cockpit on the phone to set charge, language and market.
- `demo/make-drive.mjs` builds the drive files from the cached Apple Maps route (`demo/apple-route.json`); `--from file.gpx` regenerates the `.txt` from a recorded track.

Language is a personal setting (phone locale or the cockpit); the market (`de/de`, `de/at`, `fr/fr`, `fr/be`) comes from the car's position via reverse geocoding, or from the cockpit override.

## Text on the car screen

CarPlay draws list text in a fixed style and cuts it with "…"; apps have no font or line-limit control. So the content is shortened in `Sources/Content/TextFit.swift`, with the character budgets in `TextBudget`: the Orte row is the short name plus "distance · place" (distance always first), News and Mein BMW rows have no images, value comes before label, and long text lives on the detail card or in information templates. If a row still shows "…" on the Simulator, lower the budget.

## Limits

- Simulator only. A real CarPlay app needs Apple's entitlement for its category; the Simulator build uses `com.apple.developer.carplay-charging` for the template set it allows.
- No real vehicle data: charge level and odometer come from the cockpit or deep links.
- Preview content through html2json on `workers.dev`; a production site would front it with its own CDN worker.
- Only the blocks the showcase and place pages use are mapped; others (`video`, `embed`, `link-list`, columns, card lists) are skipped and counted in the cockpit.
- Place pages are German only. Only the i5 (`61HG`) has a showcase page.
- The drive's road geometry comes from Apple Maps (MKDirections), fetched once and checked in (`demo/apple-route.json`).

## Navigation map (branch carplay-nav-map)

The app declares `com.apple.developer.carplay-maps`, draws its own `MKMapView` in the car window and keeps the dot at one
fixed spot (`MapLayout`). The Orte list is a normal list template behind the "BMW" button.
The iOS 26.5 simulator runtime crashes on any `CPMapTemplate` (missing `vehicleSupportsDestinationSharing`); run this branch on
the iOS 18.6 runtime (`xcodebuild -downloadPlatform iOS -buildVersion 18.6`). The deployment target is 18.0.

### Driving the car screen from a shell (iOS 18)

`simctl openurl bmwcarplay://…` asks "Open in BMW?" on the phone every time. Use Darwin notifications instead:
`xcrun simctl spawn <udid> notifyutil -p com.adobe.aida.BMWCarPlay.tab0` (Orte), `.tab1` (Mein BMW), `.tab2` (News), `.news0`–`.news3` (article n), `.map` (back to the map).
