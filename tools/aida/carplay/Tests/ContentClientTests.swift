import XCTest
@testable import BMWCarPlay

final class StubProtocol: URLProtocol {
    static var handler: ((URLRequest) -> (Int, Data))?
    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        let (code, data) = StubProtocol.handler?(request) ?? (500, Data())
        let resp = HTTPURLResponse(url: request.url!, statusCode: code, httpVersion: nil, headerFields: nil)!
        client?.urlProtocol(self, didReceive: resp, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: data)
        client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() {}
}

final class ContentClientTests: XCTestCase {
    func client(maxBytes: Int = 2_000_000) -> ContentClient {
        let cfg = URLSessionConfiguration.ephemeral
        cfg.protocolClasses = [StubProtocol.self]
        return ContentClient(session: URLSession(configuration: cfg), maxBytes: maxBytes)
    }

    func testPageURL() {
        XCTAssertEqual(ContentClient.pageURL(path: "/aida/showcase/de/de/i5").absoluteString,
                       "https://mhast-html-to-json.adobeaem.workers.dev/moved-permanently/bmw/aida/showcase/de/de/i5?preview=true")
    }
    func testSheetURL() {
        XCTAssertEqual(ContentClient.sheetURL(path: "/aida/showcase/news-index.json").absoluteString,
                       "https://main--bmw--moved-permanently.aem.page/aida/showcase/news-index.json")
    }
    func testFetchPageDecodesAndCachesLast() async throws {
        StubProtocol.handler = { _ in (200, Fixture.data("aida_showcase_de_de_i5")) }
        let c = client()
        let p = try await c.page(path: "/aida/showcase/de/de/i5")
        XCTAssertEqual(p.title, "Der neue BMW i5")
        StubProtocol.handler = { _ in (500, Data()) }
        let cached = try await c.page(path: "/aida/showcase/de/de/i5", fallbackToCache: true)
        XCTAssertEqual(cached.page.title, "Der neue BMW i5")
        XCTAssertTrue(cached.stale)
    }
    func testNewsIndexFilterByContext() async throws {
        StubProtocol.handler = { _ in (200, Fixture.data("aida_showcase_news-index")) }
        let rows = try await client().newsIndex(market: .deDE)
        XCTAssertEqual(rows.count, 6)
        let at = try await client().newsIndex(market: .deAT)
        XCTAssertEqual(at.count, 1)
    }
    func testHTTPErrorThrows() async {
        StubProtocol.handler = { _ in (404, Data("nope".utf8)) }
        do { _ = try await client().page(path: "/x"); XCTFail("should throw") } catch {}
    }
    func testSizeCapThrows() async {
        StubProtocol.handler = { _ in (200, Data(repeating: 65, count: 5000)) }
        do { _ = try await client(maxBytes: 1000).page(path: "/x"); XCTFail("should throw") }
        catch let e as ContentError { XCTAssertEqual(e, .tooLarge) } catch { XCTFail("wrong error \(error)") }
    }
    func testPlacesSheetDecodesNumbersAsStringsOrNumbers() throws {
        let json = #"{"data":[{"name":"A","path":"/a","lat":"48.1","lon":11.5,"radiusKm":"10","note":"x"}]}"#
        let rows = try ContentClient.decodePlaces(Data(json.utf8))
        XCTAssertEqual(rows.first?.lat, 48.1); XCTAssertEqual(rows.first?.lon, 11.5); XCTAssertEqual(rows.first?.radiusKm, 10)
    }
}
