import Foundation

enum DeepLink: Equatable {
    case vehicle(VehiclePatch)
    case refresh
    case tab(Int)
    case open(String)

    static func parse(_ url: URL) -> DeepLink? {
        guard url.scheme == "bmwcarplay", let host = url.host else { return nil }
        let items = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems ?? []
        func q(_ n: String) -> String? { items.first { $0.name == n }?.value }
        switch host {
        case "vehicle":
            var p = VehiclePatch()
            p.soc = q("soc").flatMap(Int.init)
            p.odometerKm = q("odo").flatMap(Int.init)
            p.model = q("model")
            p.language = q("lang")
            if let m = q("market") {
                if m == "auto" { p.market = .some(nil) } else if let mk = Market(folder: m) { p.market = .some(mk) }
            }
            return .vehicle(p)
        case "refresh": return .refresh
        case "tab": return q("index").flatMap(Int.init).map(DeepLink.tab)
        case "open": return q("path").map(DeepLink.open)
        default: return nil
        }
    }
}
