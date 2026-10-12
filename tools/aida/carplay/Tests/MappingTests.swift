import XCTest
@testable import BMWCarPlay

final class MappingTests: XCTestCase {
    func page(_ n: String) throws -> Page { try JSONDecoder().decode(Page.self, from: Fixture.data(n)) }

    func testCarViewModel() throws {
        let car = CarViewModel(page: try page("aida_showcase_de_de_i5"))
        XCTAssertEqual(car.title, "Der neue BMW i5")
        XCTAssertTrue(car.heroImage?.absoluteString.hasPrefix("https://bmw.scene7.com/is/image/BMW/") ?? false)
        XCTAssertEqual(car.headline, "Der neue BMW i5")
        XCTAssertEqual(car.lead, "Der BMW i5. 100% elektrisch.")
        XCTAssertEqual(car.kpis.count, 3)
        XCTAssertEqual(car.kpis[0].label, "Max. Reichweite WLTP")
        XCTAssertEqual(car.kpis[0].value, "513–627 km")
        XCTAssertEqual(car.kpis[0].binding?.field, "electricRange")
        XCTAssertEqual(car.models.count, 2)
        XCTAssertEqual(car.models[0].name, "BMW iX3 50 xDrive")
        XCTAssertTrue(car.disclaimer?.contains("BMW i5 eDrive40") ?? false)
        XCTAssertEqual(car.rangeText?.low, 513)
    }

    func testFrenchCarHasNoHighwayAssistantButStillDecodes() throws {
        let car = CarViewModel(page: try page("aida_showcase_fr_fr_i5"))
        XCTAssertEqual(car.kpis.count, 3)
        XCTAssertEqual(car.title, "La nouvelle BMW i5")
    }

    func testArticleViewModel() throws {
        let a = ArticleViewModel(page: try page("aida_showcase_de_de_news_i5-launch"))
        XCTAssertEqual(a.title, "Der BMW i5. 100% elektrisch.")
        XCTAssertTrue(a.teaser.hasPrefix("Entdecken Sie den BMW i5 eDrive40"))
        XCTAssertEqual(a.pairs.count, 3)
        XCTAssertEqual(a.pairs[0].label, "Max. Reichweite WLTP")
        XCTAssertEqual(a.pairs[0].value, "513–627 km")
        XCTAssertTrue(a.speechText.contains("CO₂-Emissionen kombiniert: 0 g/km"))
    }

    func testPlaceViewModelFromBmwPark() throws {
        let row = PlaceRow(name: "BMW Park", path: "/x", lat: 48.12, lon: 11.55, radiusKm: 10, note: "")
        let v = PlaceViewModel(row: row, page: try page("place_bmw-park"))
        XCTAssertEqual(v.name, "BMW Park")
        XCTAssertEqual(v.headline, "WE PLAY. TOGETHER.")
        XCTAssertFalse(v.lead.isEmpty)
        XCTAssertTrue(v.image?.absoluteString.contains("scene7.com/is/image/BMW/BMW-Park") ?? false)
        XCTAssertTrue(v.speechText.hasPrefix("WE PLAY. TOGETHER."))
        XCTAssertFalse(v.speechText.contains("Image without alt text"))
    }

    func testSpeechTextIsCapped() throws {
        let row = PlaceRow(name: "x", path: "/x", lat: 0, lon: 0, radiusKm: 1, note: "")
        let v = PlaceViewModel(row: row, page: try page("place_bmw-ibu-weltcup-biathlon"))
        XCTAssertLessThanOrEqual(v.speechParagraphCount, 12)
    }

    func testSkippedBlocksAreCounted() throws {
        let car = CarViewModel(page: try page("aida_showcase_de_de_i5"))
        XCTAssertGreaterThan(car.skippedBlocks, 0)   // columns, card-list, carousel(slides-triples)
    }

    func testRangeNowDisplayLine() throws {
        let car = CarViewModel(page: try page("aida_showcase_de_de_i5"))
        let line = try XCTUnwrap(car.rangeNow(soc: 62, locale: Locale(identifier: "de_DE")))
        XCTAssertEqual(line.value, "318–389 km")
        XCTAssertEqual(line.wltp, "513–627 km")
    }
}
