import XCTest
@testable import BMWCarPlay

final class BindingsTests: XCTestCase {
    func testParsesWdhHref() {
        let b = WdhBinding(href: "/aida/showcase/data/wdh-de.json#61HG.electricRange")
        XCTAssertEqual(b?.market, "de")
        XCTAssertEqual(b?.model, "61HG")
        XCTAssertEqual(b?.field, "electricRange")
    }
    func testRejectsOtherHrefs() {
        XCTAssertNil(WdhBinding(href: "https://www.bmw.de/x"))
        XCTAssertNil(WdhBinding(href: "/aida/showcase/de/de/i5"))
    }
    func testRangeParse() {
        XCTAssertEqual(RangeText("513–627 km")?.low, 513)
        XCTAssertEqual(RangeText("513–627 km")?.high, 627)
        XCTAssertEqual(RangeText("518-627 km")?.low, 518)
        XCTAssertEqual(RangeText("157–211 km")?.high, 211)
        XCTAssertEqual(RangeText("805 km")?.low, 805)
        XCTAssertNil(RangeText("805 km")?.high)
        XCTAssertNil(RangeText("kein Wert"))
    }
    func testRangeAtCharge() {
        let r = RangeText("513–627 km")!
        let now = r.at(soc: 62)
        XCTAssertEqual(now.low, 318)
        XCTAssertEqual(now.high, 389)
        XCTAssertEqual(r.at(soc: 0).low, 0)
        XCTAssertEqual(r.at(soc: 150).low, 513)
        XCTAssertEqual(RangeText("805 km")!.at(soc: 50).low, 403)
    }
    func testRangeFormatting() {
        let r = RangeText("1000–2000 km")!.at(soc: 100)
        XCTAssertEqual(r.formatted(locale: Locale(identifier: "de_DE")), "1.000–2.000 km")
        XCTAssertEqual(r.formatted(locale: Locale(identifier: "fr_FR")).hasSuffix("km"), true)
        XCTAssertEqual(RangeText("805 km")!.at(soc: 50).formatted(locale: Locale(identifier: "de_DE")), "403 km")
    }
}
