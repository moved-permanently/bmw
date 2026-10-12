import XCTest
@testable import BMWCarPlay

final class DeepLinkTests: XCTestCase {
    func parse(_ s: String) -> DeepLink? { DeepLink.parse(URL(string: s)!) }
    func testVehicleAllParams() {
        XCTAssertEqual(parse("bmwcarplay://vehicle?soc=15&odo=29800&model=31HR&market=fr/fr&lang=fr"),
                       .vehicle(VehiclePatch(soc: 15, odometerKm: 29800, model: "31HR", market: .some(.frFR), language: "fr")))
    }
    func testVehiclePartial() {
        XCTAssertEqual(parse("bmwcarplay://vehicle?soc=15"), .vehicle(VehiclePatch(soc: 15)))
    }
    func testMarketAutoClearsOverride() {
        XCTAssertEqual(parse("bmwcarplay://vehicle?market=auto"), .vehicle(VehiclePatch(market: .some(nil))))
    }
    func testRefreshTabOpen() {
        XCTAssertEqual(parse("bmwcarplay://refresh"), .refresh)
        XCTAssertEqual(parse("bmwcarplay://tab?index=1"), .tab(1))
        XCTAssertEqual(parse("bmwcarplay://open?path=/aida/showcase/de/de/news/cannes"), .open("/aida/showcase/de/de/news/cannes"))
    }
    func testRejectsOtherSchemesAndBadInput() {
        XCTAssertNil(parse("https://example.com"))
        XCTAssertNil(parse("bmwcarplay://nope"))
        XCTAssertNil(parse("bmwcarplay://tab"))
        XCTAssertNil(parse("bmwcarplay://open"))
    }
    func testApplyPatch() {
        let s = VehicleState(defaults: UserDefaults(suiteName: "t.\(UUID().uuidString)")!)
        s.marketOverride = .deAT
        s.apply(VehiclePatch(soc: 15, market: .some(nil)))
        XCTAssertEqual(s.soc, 15); XCTAssertNil(s.marketOverride)
    }
}
