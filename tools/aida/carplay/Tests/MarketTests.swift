import XCTest
@testable import BMWCarPlay

final class MarketTests: XCTestCase {
    func testFolders() {
        XCTAssertEqual(Market.deDE.folder, "de/de")
        XCTAssertEqual(Market.frBE.folder, "fr/be")
        XCTAssertEqual(Market(folder: "de/at"), .deAT)
        XCTAssertNil(Market(folder: "xx/yy"))
    }
    func testCountryDecidesMarketWhenDocumentExists() {
        XCTAssertEqual(Market.resolve(language: "de", country: "AT"), .deAT)
        XCTAssertEqual(Market.resolve(language: "fr", country: "BE"), .frBE)
        XCTAssertEqual(Market.resolve(language: "fr", country: "FR"), .frFR)
    }
    func testMissingCombinationFallsBackToLanguageHome() {
        XCTAssertEqual(Market.resolve(language: "de", country: "FR"), .deDE)
        XCTAssertEqual(Market.resolve(language: "fr", country: "AT"), .frFR)
        XCTAssertEqual(Market.resolve(language: "de", country: "US"), .deDE)
    }
    func testUnknownCountryKeepsPrevious() {
        XCTAssertEqual(Market.resolve(language: "de", country: nil, previous: .deAT), .deAT)
    }
    func testLanguageNormalisation() {
        XCTAssertEqual(Market.language(fromPreferred: ["fr-CH", "de"]), "fr")
        XCTAssertEqual(Market.language(fromPreferred: ["en-US"]), "de")
    }
}

final class VehicleStateTests: XCTestCase {
    func makeDefaults() -> UserDefaults {
        let d = UserDefaults(suiteName: "test.\(UUID().uuidString)")!
        return d
    }
    func testRoundTrip() {
        let d = makeDefaults()
        let s = VehicleState(defaults: d)
        s.soc = 33; s.odometerKm = 5000; s.marketOverride = .frBE; s.language = "fr"
        let t = VehicleState(defaults: d)
        XCTAssertEqual(t.soc, 33); XCTAssertEqual(t.odometerKm, 5000)
        XCTAssertEqual(t.marketOverride, .frBE); XCTAssertEqual(t.language, "fr")
    }
    func testDefaults() {
        let s = VehicleState(defaults: makeDefaults())
        XCTAssertEqual(s.model, "61HG"); XCTAssertEqual(s.soc, 62); XCTAssertNil(s.marketOverride)
    }
    func testSocIsClamped() {
        let s = VehicleState(defaults: makeDefaults())
        s.soc = 140; XCTAssertEqual(s.soc, 100)
        s.soc = -4; XCTAssertEqual(s.soc, 0)
    }
    func testOverrideWinsOverCountry() {
        let s = VehicleState(defaults: makeDefaults())
        s.marketOverride = .frFR
        XCTAssertEqual(s.effectiveMarket(country: "AT"), .frFR)
        s.marketOverride = nil
        XCTAssertEqual(s.effectiveMarket(country: "AT"), .deAT)
    }
    func testChangePostsNotification() {
        let s = VehicleState(defaults: makeDefaults())
        let e = expectation(forNotification: .vehicleChanged, object: s)
        s.soc = 10
        wait(for: [e], timeout: 1)
    }
}
