import CarPlay
import UIKit

/// Owns the tab bar and reloads tabs when the market, the language or a deep link asks for it.
final class CarController {
    let interface: CPInterfaceController
    let session = Session.shared
    let car: CarTab, places: PlacesTab, news: NewsTab
    let mapController: CarMapViewController
    private var mapTemplate: CPMapTemplate!
    private var observer: NSObjectProtocol?
    private var lastKey = ""

    init(interface: CPInterfaceController, mapController: CarMapViewController) {
        self.interface = interface
        self.mapController = mapController
        car = CarTab(interface: interface)
        places = PlacesTab(interface: interface)
        news = NewsTab(interface: interface)
    }

    func start() {
        NSLog("BMWCarPlay maximumTabCount=%d", CPTabBarTemplate.maximumTabCount)
        // Navigation apps start on the map template, and a tab bar cannot be pushed on top of it (it raises).
        // The three lists are pushed one level above the map, from buttons in its navigation bar.
        mapTemplate = CPMapTemplate()
        mapTemplate.mapButtons = [
            CPMapButton { [weak self] _ in self?.mapController.zoom(by: 0.5) }.with(image: "plus"),
            CPMapButton { [weak self] _ in self?.mapController.zoom(by: 2) }.with(image: "minus"),
        ]
        // The bar and its buttons stay on screen: hidden by default, they only show after a tap on the map.
        mapTemplate.automaticallyHidesNavigationBar = false
        mapTemplate.hidesButtonsWithNavigationBar = false
        refreshTitles()
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
        if key() != lastKey { lastKey = key(); refreshTitles(); Task { await reloadAll() } } else { car.render() }
    }

    func reloadAll() async {
        async let a: () = car.reload(), b: () = news.reload(), c: () = places.reload()
        _ = await (a, b, c)
        await MainActor.run { mapController.reloadPlaces() }
        session.skippedBlocks = car.skipped
    }

    /// Bar buttons in the language of the car. Two on the leading side, one on the trailing side (two at most each).
    func refreshTitles() {
        let lang = session.language
        mapTemplate.leadingNavigationBarButtons = [
            CPBarButton(title: L10n.t(.tabPlaces, lang)) { [weak self] _ in self?.open(0) },
            CPBarButton(title: L10n.t(.tabCar, lang)) { [weak self] _ in self?.open(1) },
        ]
        mapTemplate.trailingNavigationBarButtons = [
            CPBarButton(title: L10n.t(.tabNews, lang)) { [weak self] _ in self?.open(2) },
        ]
    }

    /// Pushes one list above the map. Back to the map first: the same instance cannot be pushed twice,
    /// and a second push while one is showing would stack lists.
    func open(_ index: Int) {
        let ts: [CPTemplate] = [places.template, car.template, news.template]
        if index >= 10 { Task { await news.open(at: index - 10) }; return }   // script hook: news article number n
        if index < 0 { interface.popToRootTemplate(animated: true, completion: carplayLog); return }
        guard ts.indices.contains(index) else { return }
        NSLog("BMWCarPlay open %d, stack %d", index, interface.templates.count)
        let push = { [weak self] in
            self?.interface.pushTemplate(ts[index], animated: true) { ok, err in NSLog("BMWCarPlay pushed %d ok=%d", index, ok ? 1 : 0); carplayLog(ok, err) }
        }
        if interface.templates.count > 1 {
            interface.popToRootTemplate(animated: false) { ok, error in
                NSLog("BMWCarPlay popped ok=%d", ok ? 1 : 0)
                if let error { NSLog("BMWCarPlay pop failed: %@", "\(error)") }
                push()
            }
        } else { push() }
    }

    func handle(_ link: DeepLink) {
        switch link {
        case .refresh: Task { await reloadAll() }
        case let .tab(i):
            open(i)
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
