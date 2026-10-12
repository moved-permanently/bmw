import Foundation

enum Geo {
    static func distanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double) -> Double {
        let r = 6371.0, d2r = Double.pi / 180
        let dLat = (lat2 - lat1) * d2r, dLon = (lon2 - lon1) * d2r
        let a = sin(dLat / 2) * sin(dLat / 2) + cos(lat1 * d2r) * cos(lat2 * d2r) * sin(dLon / 2) * sin(dLon / 2)
        return 2 * r * asin(min(1, sqrt(a)))
    }
    static func distance(_ p: PlaceRow, lat: Double, lon: Double) -> Double {
        distanceKm(lat1: lat, lon1: lon, lat2: p.lat, lon2: p.lon)
    }
    static func sorted(_ places: [PlaceRow], lat: Double, lon: Double) -> [PlaceRow] {
        places.sorted { distance($0, lat: lat, lon: lon) < distance($1, lat: lat, lon: lon) }
    }
}

/// Reports a place once when the car comes within its radius; re-arms after the car is farther than twice the radius.
struct Proximity {
    private var fired: Set<String> = []

    mutating func update(places: [PlaceRow], lat: Double, lon: Double) -> [PlaceRow] {
        var entered: [(PlaceRow, Double)] = []
        for p in places {
            let d = Geo.distance(p, lat: lat, lon: lon)
            if d > p.radiusKm * 2 { fired.remove(p.path) }
            else if d < p.radiusKm, !fired.contains(p.path) { fired.insert(p.path); entered.append((p, d)) }
        }
        return entered.sorted { $0.1 < $1.1 }.map(\.0)
    }

    mutating func reset() { fired = [] }
}
