import XCTest
@testable import BMWCarPlay

final class TextFitTests: XCTestCase {
    func testShortTextIsUntouchedButWhitespaceIsCollapsed() {
        XCTAssertEqual(TextFit.trim("BMW Park", max: 18), "BMW Park")
        XCTAssertEqual(TextFit.trim("  BMW \n Park ", max: 18), "BMW Park")
    }

    func testCutsAtWordBoundaryAndNeverExceedsBudget() {
        let t = TextFit.trim("Entdecken Sie den BMW i5 eDrive40 mit allen Details", max: 36)
        XCTAssertEqual(t, "Entdecken Sie den BMW i5 eDrive40…")
        XCTAssertLessThanOrEqual(t.count, 36)
        XCTAssertTrue(t.hasSuffix("…"))
    }

    func testBoundaryExactlyAtTheCut() {
        // 10 chars + space: budget 11 keeps the whole word and adds the ellipsis without a dangling space.
        XCTAssertEqual(TextFit.trim("Chiemgau12 Arena Ruhpolding", max: 11), "Chiemgau12…")
    }

    func testHyphenCountsAsBoundary() {
        XCTAssertEqual(TextFit.trim("BMW Berlin-Marathon", max: 18), "BMW Berlin…")
    }

    func testLongSingleWordIsCutHard() {
        let t = TextFit.trim("Donaudampfschifffahrtsgesellschaft", max: 10)
        XCTAssertEqual(t.count, 10)
        XCTAssertTrue(t.hasSuffix("…"))
    }

    func testTrailingPunctuationIsDropped() {
        XCTAssertEqual(TextFit.trim("Seit 38 Jahren, engagiert sich BMW", max: 17), "Seit 38 Jahren…")
    }

    func testUmlautsAndMultibyteCountAsOneCharacter() {
        let t = TextFit.trim("Über größere Strecken fährt der Nürburgring", max: 20)
        XCTAssertLessThanOrEqual(t.count, 20)
        XCTAssertEqual(t, "Über größere…")
    }

    func testDistinctDropsRepeatedDetail() {
        XCTAssertNil(TextFit.distinct("Der BMW i5. 100% elektrisch.", from: "Der BMW i5. 100 % elektrisch"))
        XCTAssertNil(TextFit.distinct("BMW in Cannes", from: "BMW in Cannes: ein Rückblick"))
        XCTAssertNil(TextFit.distinct("  ", from: "x"))
        XCTAssertNil(TextFit.distinct(nil, from: "x"))
        XCTAssertEqual(TextFit.distinct("Eine gemeinsame Cannes-Geschichte von BMW und dem Festival", from: "BMW in Cannes"),
                       "Eine gemeinsame Cannes-Geschichte…")
    }

    func testShortPlaceName() {
        let a = TextFit.shortPlaceName("Chiemgau Arena, Ruhpolding")
        XCTAssertEqual(a.title, "Chiemgau Arena"); XCTAssertEqual(a.place, "Ruhpolding")
        let b = TextFit.shortPlaceName("BMW Park")
        XCTAssertEqual(b.title, "BMW Park"); XCTAssertNil(b.place)
        let c = TextFit.shortPlaceName("BMW Open, MTTC Iphitos")
        XCTAssertEqual(c.title, "BMW Open"); XCTAssertEqual(c.place, "MTTC Iphitos")
        XCTAssertLessThanOrEqual(TextFit.shortPlaceName("VIP Experience, Veltins-Arena").title.count, TextBudget.poiTitle)
    }

    func testDistanceIsLocalized() {
        let nb = "\u{00A0}km"
        XCTAssertEqual(TextFit.distance(km: 31.4, locale: Locale(identifier: "de_DE")), "31" + nb)
        XCTAssertEqual(TextFit.distance(km: 4.24, locale: Locale(identifier: "de_DE")), "4,2" + nb)
        XCTAssertEqual(TextFit.distance(km: 4.24, locale: Locale(identifier: "fr_FR")), "4,2" + nb)
        XCTAssertEqual(TextFit.distance(km: 4.24, locale: Locale(identifier: "en_GB")), "4.2" + nb)
        XCTAssertEqual(TextFit.distance(km: 9.97, locale: Locale(identifier: "de_DE")), "10" + nb)
        XCTAssertEqual(TextFit.distance(km: 1234, locale: Locale(identifier: "de_DE")), "1.234" + nb)
    }

    func testPlaceSubtitleKeepsDistanceFirstAndWithinBudget() {
        let d = TextFit.distance(km: 31, locale: Locale(identifier: "de_DE"))
        let s = TextFit.placeSubtitle(distance: d, extra: "Ruhpolding")
        XCTAssertEqual(s, d + " · Ruhpolding")
        let long = TextFit.placeSubtitle(distance: d, extra: "Ein sehr langer Seitenkopf der Seite")
        XCTAssertTrue(long.hasPrefix(d + " · "))
        XCTAssertLessThanOrEqual(long.count, TextBudget.poiSubtitle)
        XCTAssertEqual(TextFit.placeSubtitle(distance: d, extra: nil), d)
        // A huge distance string leaves no room: only the distance is shown, never a cut distance.
        XCTAssertEqual(TextFit.placeSubtitle(distance: "123456789012345678901234", extra: "Ort"), "123456789012345678901234")
    }

    func testPlaceRowsFromTheDemoSheetFitAndShowDistance() throws {
        let locale = Locale(identifier: "de_DE")
        for name in ["BMW Park", "BMW Open, MTTC Iphitos", "BMW Golf Cup, Eichenried", "Chiemgau Arena, Ruhpolding",
                     "VIP Experience, Veltins-Arena", "BMW Berlin-Marathon", "Nürburgring"] {
            let short = TextFit.shortPlaceName(name)
            let d = TextFit.distance(km: 106, locale: locale)
            let sub = TextFit.placeSubtitle(distance: d, extra: short.place ?? "WE PLAY. TOGETHER.")
            XCTAssertLessThanOrEqual(short.title.count, TextBudget.poiTitle, name)
            XCTAssertLessThanOrEqual(sub.count, TextBudget.poiSubtitle, name)
            XCTAssertTrue(sub.hasPrefix(d), name)
        }
    }

    func testChunksCutAtWordsAndFitTheSize() {
        let text = "Eine gemeinsame Cannes-Geschichte für die BMW-Briefing-Demo. Dieser redaktionelle Demo-Datensatz zeigt wie Text auf dem Fahrzeugdisplay umbricht."
        let c = TextFit.chunks(text, size: 40, limit: 10)
        XCTAssertTrue(c.allSatisfy { $0.count <= 40 }, "\(c)")
        XCTAssertEqual(c.joined(separator: " "), text)
    }
    func testChunksEndInEllipsisWhenCutByTheLimit() {
        let text = String(repeating: "wort ", count: 60)
        let c = TextFit.chunks(text, size: 30, limit: 3)
        XCTAssertEqual(c.count, 3)
        XCTAssertTrue(c.last!.hasSuffix("…"))
        XCTAssertTrue(c.allSatisfy { $0.count <= 30 })
    }
    func testShortTextIsOneChunkWithoutEllipsis() {
        XCTAssertEqual(TextFit.chunks("Kurzer Text", size: 40, limit: 5), ["Kurzer Text"])
    }
}
