import CarPlay
import UIKit

/// Owns the tab bar and reloads tabs when the market, the language or a deep link asks for it.
final class CarController {
    let interface: CPInterfaceController
    let session = Session.shared
    let car: CarTab, places: PlacesTab, news: NewsTab
    let mapController: CarMapViewController
    private var mapTemplate: CPMapTemplate!
    private var tabBar: CPTabBarTemplate!
    private var observer: NSObjectProtocol?
    private var lastKey = ""
    private var tabOpen = false

    init(interface: CPInterfaceController, mapController: CarMapViewController) {
        self.interface = interface
        self.mapController = mapController
        car = CarTab(interface: interface)
        places = PlacesTab(interface: interface)
        news = NewsTab(interface: interface)
    }

    func start() {
        NSLog("BMWCarPlay maximumTabCount=%d", CPTabBarTemplate.maximumTabCount)
        tabBar = CPTabBarTemplate(templates: [places.template, car.template, news.template])
        // Navigation apps start on the map template; the lists live in a tab bar one level up.
        mapTemplate = CPMapTemplate()
        mapTemplate.mapButtons = [
            CPMapButton { [weak self] _ in self?.mapController.zoom(by: 0.5) }.with(image: "plus"),
            CPMapButton { [weak self] _ in self?.mapController.zoom(by: 2) }.with(image: "minus"),
        ]
        mapTemplate.leadingNavigationBarButtons = [CPBarButton(title: "BMW") { [weak self] _ in self?.openTabs(0) }]
        interface.setRootTemplate(mapTemplate, animated: false, completion: carplayLog)
        places.onRows = { [weak self] rows in self?.mapController.setPanel(rows) }
        session.onEnter = { [weak self] p in self?.places.alert(for: p) }
        session.onLink = { [weak self] l in self?.handle(l) }
        session.onMove = { [weak self] in self?.places.moved(); self?.mapController.centre(animated: true) }
        observer = NotificationCenter.default.addObserver(forName: .vehicleChanged, object: session.state, queue: .main) { [weak self] _ in
            self?.vehicleChanged()
        }
        lastKey = key()
        Task { await reloadAll() }
    }

    func stop() {
        if let o = observer { NotificationCenter.default.removeObserver(o) }
        session.onEnter = nil; session.onLink = nil; session.onMove = nil
    }

    private func key() -> String { "\(session.market.folder)|\(session.state.language)" }

    private func vehicleChanged() {
        if key() != lastKey { lastKey = key(); Task { await reloadAll() } } else { car.render() }
    }

    func reloadAll() async {
        async let a: () = car.reload(), b: () = news.reload(), c: () = places.reload()
        _ = await (a, b, c)
        await MainActor.run { mapController.reloadPlaces() }
        session.skippedBlocks = car.skipped
    }

    /// Shows the tab bar over the map, on tab `index`. A second call replaces what is on top.
    func openTabs(_ index: Int) {
        let ts = [places.template, car.template, news.template]
        guard ts.indices.contains(index) else { return }
        if tabOpen { tabBar.select(ts[index]); return }
        tabOpen = true
        interface.pushTemplate(tabBar, animated: true) { [weak self] ok, error in
            carplayLog(ok, error)
            if ok { self?.tabBar.select(ts[index]) } else { self?.tabOpen = false }
        }
    }

    func handle(_ link: DeepLink) {
        switch link {
        case .refresh: Task { await reloadAll() }
        case let .tab(i):
            openTabs(i)
        case let .open(path): Task { await car.open(path: path) }
        case .vehicle, .reset: break
        }
    }
}

enum Img {
    static func tab(_ name: String) -> UIImage { UIImage(systemName: name) ?? UIImage() }
    /// scene7 Image Serving: width in pixels.
    static func scene7(_ url: URL?, width: Int = 240) -> URL? {
        guard let url else { return nil }
        var c = URLComponents(url: url, resolvingAgainstBaseURL: false)
        c?.queryItems = [URLQueryItem(name: "wid", value: "\(width)")]
        return c?.url
    }
}

func refreshButton(lang: String, action: @escaping () -> Void) -> CPBarButton {
    CPBarButton(title: "↻") { _ in action() }
}

/// CarPlay raises an exception when a presentation fails and nobody is listening, so every call logs instead.
func carplayLog(_ ok: Bool, _ error: Error?) {
    if let error { NSLog("BMWCarPlay template call failed: %@", "\(error)") }
}

extension CPMapButton {
    func with(image name: String) -> CPMapButton { image = UIImage(systemName: name); return self }
}
