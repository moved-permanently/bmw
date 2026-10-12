import XCTest
@testable import BMWCarPlay

final class StringsTests: XCTestCase {
    func testAllKeysExistInBothLanguages() {
        for key in L10n.Key.allCases {
            XCTAssertNotNil(L10n.table["de"]?[key], "de \(key)")
            XCTAssertNotNil(L10n.table["fr"]?[key], "fr \(key)")
        }
    }
    func testFormat() {
        XCTAssertEqual(L10n.t(.atCharge, "de", 62), "bei 62 % Ladung")
        XCTAssertEqual(L10n.t(.away, "de", "12 km"), "12 km entfernt")
    }
}
