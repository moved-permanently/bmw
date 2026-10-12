import Foundation

extension Notification.Name {
    static let vehicleChanged = Notification.Name("BMWCarPlay.vehicleChanged")
    static let refreshRequested = Notification.Name("BMWCarPlay.refreshRequested")
}

struct VehiclePatch: Equatable {
    var soc: Int? = nil
    var odometerKm: Int? = nil
    var model: String? = nil
    var market: Market?? = nil      // .some(nil) clears the override
    var language: String? = nil
}

/// What the car knows. Third-party CarPlay apps cannot read the real car, so the cockpit and deep links set it.
final class VehicleState {
    private let defaults: UserDefaults
    private var loading = true

    var model: String { didSet { changed("model", model) } }
    var soc: Int {
        didSet {
            let c = min(100, max(0, soc))
            if c != soc { soc = c; return }
            changed("soc", soc)
        }
    }
    var odometerKm: Int { didSet { changed("odo", odometerKm) } }
    var marketOverride: Market? { didSet { changed("market", marketOverride?.rawValue) } }
    var language: String { didSet { changed("lang", language) } }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        model = defaults.string(forKey: "model") ?? "61HG"
        soc = defaults.object(forKey: "soc") as? Int ?? 62
        odometerKm = defaults.object(forKey: "odo") as? Int ?? 12_400
        marketOverride = defaults.string(forKey: "market").flatMap(Market.init(folder:))
        language = defaults.string(forKey: "lang") ?? Market.language(fromPreferred: Locale.preferredLanguages)
        loading = false
    }

    private func changed(_ key: String, _ value: Any?) {
        guard !loading else { return }
        if let v = value { defaults.set(v, forKey: key) } else { defaults.removeObject(forKey: key) }
        NotificationCenter.default.post(name: .vehicleChanged, object: self)
    }

    func effectiveMarket(country: String?, previous: Market? = nil) -> Market {
        marketOverride ?? Market.resolve(language: language, country: country, previous: previous)
    }

    func apply(_ p: VehiclePatch) {
        if let v = p.model { model = v }
        if let v = p.odometerKm { odometerKm = v }
        if let v = p.language, v == "de" || v == "fr" { language = v }
        if let v = p.market { marketOverride = v }
        if let v = p.soc { soc = v }
    }
}
