// Fetches Apple Maps (MapKit MKDirections, automobile) road geometry leg by leg.
//   swiftc -O apple-route.swift -o /tmp/apple-route && /tmp/apple-route legs.json apple-route.json
// Input : [{"id","label","from":[lat,lon],"to":[lat,lon]}, ...]   (a leg may use "fromLeg": "<id>" to start at that
//         leg's snapped end point instead of "from")
// Output: {"source","fetched","legs":{"<id>":{"label","from","to","distance_m","expected_s","points":[[lat,lon],...]}}}
// MapKit needs network access and the Apple Maps service; it allows about 50 directions requests per minute,
// so requests are spaced out and retried with a back-off. Points are the full MKRoute.polyline resolution.
import Foundation
import MapKit

struct Leg { var id: String; var label: String; var from: CLLocationCoordinate2D?; var fromLeg: String?; var to: CLLocationCoordinate2D }

func parse(_ path: String) -> [Leg] {
    let data = try! Data(contentsOf: URL(fileURLWithPath: path))
    let arr = try! JSONSerialization.jsonObject(with: data) as! [[String: Any]]
    func c(_ v: Any?) -> CLLocationCoordinate2D? {
        guard let a = v as? [Double], a.count == 2 else { return nil }
        return CLLocationCoordinate2D(latitude: a[0], longitude: a[1])
    }
    return arr.map { Leg(id: $0["id"] as! String, label: $0["label"] as! String, from: c($0["from"]), fromLeg: $0["fromLeg"] as? String, to: c($0["to"])!) }
}

func item(_ c: CLLocationCoordinate2D) -> MKMapItem { MKMapItem(location: CLLocation(latitude: c.latitude, longitude: c.longitude), address: nil) }

func route(from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) async throws -> MKRoute {
    var delay = 5.0
    for attempt in 1...6 {
        let req = MKDirections.Request()
        req.source = item(from); req.destination = item(to)
        req.transportType = .automobile
        req.requestsAlternateRoutes = false
        do {
            let resp = try await MKDirections(request: req).calculate()
            guard let r = resp.routes.first else { throw NSError(domain: "apple-route", code: 1, userInfo: [NSLocalizedDescriptionKey: "no route"]) }
            return r
        } catch {
            FileHandle.standardError.write(Data("attempt \(attempt) failed: \(error.localizedDescription); retry in \(delay)s\n".utf8))
            try await Task.sleep(nanoseconds: UInt64(delay * 1e9)); delay *= 2
        }
    }
    throw NSError(domain: "apple-route", code: 2, userInfo: [NSLocalizedDescriptionKey: "gave up"])
}

func run() async throws {
    let a = CommandLine.arguments
    guard a.count == 3 else { print("usage: apple-route legs.json out.json"); exit(2) }
    let legs = parse(a[1])
    var out: [String: Any] = [:]
    var ends: [String: CLLocationCoordinate2D] = [:]
    for leg in legs {
        let from = leg.from ?? ends[leg.fromLeg!]!
        let r = try await route(from: from, to: leg.to)
        let pl = r.polyline
        var pts = [CLLocationCoordinate2D](repeating: kCLLocationCoordinate2DInvalid, count: pl.pointCount)
        pl.getCoordinates(&pts, range: NSRange(location: 0, length: pl.pointCount))
        ends[leg.id] = pts.last!
        out[leg.id] = [
            "label": leg.label, "from": [from.latitude, from.longitude], "to": [leg.to.latitude, leg.to.longitude],
            "distance_m": r.distance, "expected_s": r.expectedTravelTime,
            "points": pts.map { [($0.latitude * 1e6).rounded() / 1e6, ($0.longitude * 1e6).rounded() / 1e6] },
        ] as [String: Any]
        print("\(leg.id): \(pts.count) points, \(Int(r.distance)) m, \(Int(r.expectedTravelTime / 60)) min, \(r.name)")
        try await Task.sleep(nanoseconds: 3_000_000_000)
    }
    let doc: [String: Any] = ["source": "Apple Maps MKDirections automobile (MKRoute.polyline, full resolution)", "fetched": ISO8601DateFormatter().string(from: Date()), "legs": out]
    let data = try JSONSerialization.data(withJSONObject: doc, options: [.sortedKeys])
    try data.write(to: URL(fileURLWithPath: a[2]))
}
Task { do { try await run(); exit(0) } catch { FileHandle.standardError.write(Data("error: \(error)\n".utf8)); exit(1) } }
RunLoop.main.run()
