import XCTest
@testable import BMWCarPlay

final class Html2JsonTests: XCTestCase {
    func page(_ name: String) throws -> Page { try JSONDecoder().decode(Page.self, from: Fixture.data(name)) }

    func testDecodesEveryFixturePage() throws {
        for name in ["aida_showcase_de_de_i5", "aida_showcase_fr_fr_i5", "aida_showcase_de_de_e-mobility",
                     "aida_showcase_de_de_home", "aida_showcase_de_de_news_i5-launch",
                     "aida_showcase_fr_be_news_i5-launch", "de_home", "place_bmw-park", "place_tennis",
                     "place_golf-cup", "place_bmw-ibu-weltcup-biathlon"] {
            XCTAssertNoThrow(try page(name), name)
        }
    }

    func testI5HasSevenSectionsAndTitleAndMeta() throws {
        let p = try page("aida_showcase_de_de_i5")
        XCTAssertEqual(p.sections.count, 7)
        XCTAssertEqual(p.title, "Der neue BMW i5")
        XCTAssertEqual(p.meta["aida-context"], "de/de")
        XCTAssertEqual(p.meta["wdh-model"], "61HG")
    }

    func testCarKpisBlockHasThreeRowsWithLinkAndText() throws {
        let p = try page("aida_showcase_de_de_i5")
        let block = try XCTUnwrap(p.blocks(named: "car-kpis").first)
        XCTAssertEqual(block.rows.count, 3)
        let first = block.rows[0]
        XCTAssertEqual(first.count, 2)
        guard case let .link(href, text) = try XCTUnwrap(first[0].flat.first) else { return XCTFail("not a link") }
        XCTAssertEqual(href, "/aida/showcase/data/wdh-de.json#61HG.electricRange")
        XCTAssertEqual(text, "513–627 km")
        XCTAssertEqual(first[1].plainText, "Max. Reichweite WLTP")
    }

    func testParagraphMixingStringsAndLinksJoinsToPlainText() throws {
        let json = #"{"type":"paragraph","content":["Ab ",{"type":"link","href":"/x#a.b","text":"70.900 €"}," netto"]}"#
        let n = try JSONDecoder().decode(Node.self, from: Data(json.utf8))
        XCTAssertEqual(n.plainText, "Ab 70.900 € netto")
    }

    func testUnknownTagDecodesAsUnknown() throws {
        let n = try JSONDecoder().decode(Node.self, from: Data(#"{"tag":"span"}"#.utf8))
        XCTAssertEqual(n, .unknown("span"))
    }

    func testListItemsMayBeStrings() throws {
        let json = #"{"type":"list","ordered":false,"items":["eins",[{"type":"paragraph","text":"zwei"}]]}"#
        let n = try JSONDecoder().decode(Node.self, from: Data(json.utf8))
        guard case let .list(_, items) = n else { return XCTFail("not a list") }
        XCTAssertEqual(items.count, 2)
        XCTAssertEqual(items[0].map(\.plainText).joined(), "eins")
        XCTAssertEqual(items[1].map(\.plainText).joined(), "zwei")
    }

    func testBlockOptionsAreDecoded() throws {
        let p = try page("aida_showcase_de_de_i5")
        let cards = p.blocks(named: "carousel").first { $0.options.contains("cards") }
        XCTAssertNotNil(cards)
    }
}
