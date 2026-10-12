import XCTest
@testable import BMWCarPlay

final class ProximityTests: XCTestCase {
    let park = PlaceRow(name: "BMW Park", path: "/p", lat: 48.1225, lon: 11.5415, radiusKm: 10, note: "")
    let rup = PlaceRow(name: "Ruhpolding", path: "/r", lat: 47.7637, lon: 12.6436, radiusKm: 25, note: "")

    func testDistance() {
        let d = Geo.distanceKm(lat1: 48.1351, lon1: 11.5820, lat2: 47.8095, lon2: 13.0550)   // Munich to Salzburg
        XCTAssertEqual(d, 112, accuracy: 6)
    }
    func testSortByDistance() {
        let sorted = Geo.sorted([rup, park], lat: 48.13, lon: 11.58)
        XCTAssertEqual(sorted.map(\.name), ["BMW Park", "Ruhpolding"])
    }
    func testEntersOnce() {
        var p = Proximity()
        XCTAssertTrue(p.update(places: [park], lat: 48.30, lon: 11.54).isEmpty)       // ~20 km away
        XCTAssertEqual(p.update(places: [park], lat: 48.13, lon: 11.55).map(\.name), ["BMW Park"])
        XCTAssertTrue(p.update(places: [park], lat: 48.125, lon: 11.54).isEmpty)       // still inside
    }
    func testRearmsOnlyAfterDoubleRadius() {
        var p = Proximity()
        _ = p.update(places: [park], lat: 48.13, lon: 11.55)
        XCTAssertTrue(p.update(places: [park], lat: 48.30, lon: 11.54).isEmpty)        // 20 km: outside r, inside 2r
        XCTAssertTrue(p.update(places: [park], lat: 48.13, lon: 11.55).isEmpty)        // re-enters but not re-armed
        XCTAssertTrue(p.update(places: [park], lat: 48.60, lon: 11.54).isEmpty)        // > 2r, re-arms
        XCTAssertEqual(p.update(places: [park], lat: 48.13, lon: 11.55).count, 1)
    }
    func testResetRearms() {
        var p = Proximity()
        _ = p.update(places: [park], lat: 48.13, lon: 11.55)
        p.reset()
        XCTAssertEqual(p.update(places: [park], lat: 48.13, lon: 11.55).count, 1)
    }
    func testNearestFirstWhenSeveralEnter() {
        var p = Proximity()
        let near = PlaceRow(name: "near", path: "/n", lat: 48.13, lon: 11.55, radiusKm: 50, note: "")
        let far = PlaceRow(name: "far", path: "/f", lat: 48.40, lon: 11.55, radiusKm: 50, note: "")
        XCTAssertEqual(p.update(places: [far, near], lat: 48.13, lon: 11.55).map(\.name), ["near", "far"])
    }
}
