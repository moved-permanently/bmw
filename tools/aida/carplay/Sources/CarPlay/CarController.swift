import CarPlay
import UIKit

/// Owns the tab bar and reloads tabs when the market, the language or a deep link asks for it.
final class CarController {
    let interface: CPInterfaceController
    let session = Session.shared
    let car: CarTab, places: PlacesTab, news: NewsTab
    private var tabBar: CPTabBarTemplate!
    private var observer: NSObjectProtocol?
    private var lastKey = ""

    init(interface: CPInterfaceController) {
        self.interface = interface
        car = CarTab(interface: interface)
        places = PlacesTab(interface: interface)
        news = NewsTab(interface: interface)
    }

    func start() {
        NSLog("BMWCarPlay maximumTabCount=%d", CPTabBarTemplate.maximumTabCount)
        tabBar = CPTabBarTemplate(templates: [places.template, car.template, news.template])
        interface.setRootTemplate(tabBar, animated: false, completion: carplayLog)
        session.onEnter = { [weak self] p in self?.places.alert(for: p) }
        session.onLink = { [weak self] l in self?.handle(l) }
        session.onMove = { [weak self] in self?.places.moved() }
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
        session.skippedBlocks = car.skipped
    }

    func handle(_ link: DeepLink) {
        switch link {
        case .refresh: Task { await reloadAll() }
        case let .tab(i):
            let ts = [places.template, car.template, news.template]
            if ts.indices.contains(i) { tabBar.select(ts[i]) }
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
