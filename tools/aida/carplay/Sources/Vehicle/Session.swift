import Foundation
import CoreLocation
import Combine

/// The one shared object: vehicle state, content client, location, market. Main thread only.
final class Session: NSObject, ObservableObject, CLLocationManagerDelegate {
    static let shared = Session()

    static let hq = (lat: 48.1766, lon: 11.5611)   // BMW headquarters, Petuelring 130

    let state = VehicleState()
    let client = ContentClient()
    private let manager = CLLocationManager()
    private let geocoder = CLGeocoder()
    private var proximity = Proximity()
    private var lastGeocode: (date: Date, lat: Double, lon: Double)?
    private var cancellable: AnyCancellable?

    @Published var lat = Session.hq.lat
    @Published var lon = Session.hq.lon
    @Published var hasFix = false
    @Published var country: String?
    @Published var market: Market = .deDE
    @Published var status: [String] = []
    @Published var skippedBlocks = 0
    @Published var revision = 0

    var places: [PlaceRow] = PlacesSeed.rows
    var onEnter: ((PlaceRow) -> Void)?
    var onMove: (() -> Void)?
    var onLink: ((DeepLink) -> Void)?

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
        cancellable = NotificationCenter.default.publisher(for: .vehicleChanged, object: state).sink { [weak self] _ in
            self?.recomputeMarket()
        }
        recomputeMarket()
    }

    var language: String { state.language }

    func start() {
        manager.requestWhenInUseAuthorization()
        manager.startUpdatingLocation()
    }

    func recomputeMarket() {
        let m = state.effectiveMarket(country: country, previous: market)
        if m != market { market = m }
        var s: [String] = []
        if state.marketOverride == nil, let c = country, Market.supportedCountries.contains(c),
           Market(folder: "\(state.language)/\(c.lowercased())") == nil {
            s.append(state.language == "fr" ? "Contenu \(c) non disponible en français" : "Marktinhalte für \(c) nicht in Deutsch verfügbar")
        }
        if state.language == "fr" { s.append("Place pages exist in German only") }
        status = s
        revision += 1
    }

    func reset() {
        state.apply(VehiclePatch(soc: 62, odometerKm: 12_400, model: "61HG", market: .some(nil), language: "de"))
        proximity.reset()
        lat = Session.hq.lat; lon = Session.hq.lon
        country = "DE"
        recomputeMarket()
        onLink?(.refresh)
    }

    func handle(_ link: DeepLink) {
        switch link {
        case let .vehicle(p): state.apply(p)
        case .reset: reset()
        case .refresh, .tab, .open: onLink?(link)
        }
    }

    // MARK: location

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways {
            manager.startUpdatingLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        update(lat: loc.coordinate.latitude, lon: loc.coordinate.longitude)
    }

    func update(lat: Double, lon: Double) {
        self.lat = lat; self.lon = lon; hasFix = true
        // Without a car screen the alert cannot show, so do not use up the entry either.
        if let handler = onEnter, let p = proximity.update(places: places, lat: lat, lon: lon).first { handler(p) }
        onMove?()
        geocodeIfNeeded(lat: lat, lon: lon)
    }

    private func geocodeIfNeeded(lat: Double, lon: Double) {
        if let g = lastGeocode,
           Date().timeIntervalSince(g.date) < 60,
           Geo.distanceKm(lat1: g.lat, lon1: g.lon, lat2: lat, lon2: lon) < 5 { return }
        lastGeocode = (Date(), lat, lon)
        geocoder.reverseGeocodeLocation(CLLocation(latitude: lat, longitude: lon)) { [weak self] marks, _ in
            guard let self, let c = marks?.first?.isoCountryCode else { return }
            DispatchQueue.main.async {
                if self.country != c { self.country = c; self.recomputeMarket() }
            }
        }
    }
}
