import Foundation
import UIKit

enum ContentError: Error, Equatable { case http(Int), tooLarge, badURL }

struct NewsRow: Decodable, Equatable {
    var path: String, id: String, context: String, title: String, description: String
    var image: String?
}

struct PlaceRow: Equatable {
    var name: String, path: String, lat: Double, lon: Double, radiusKm: Double, note: String
}

extension PlaceRow: Decodable {
    private enum K: String, CodingKey { case name, path, lat, lon, radiusKm, note }
    init(from decoder: Decoder) throws {
        let k = try decoder.container(keyedBy: K.self)
        func num(_ key: K) throws -> Double {
            if let d = try? k.decode(Double.self, forKey: key) { return d }
            let s = try k.decode(String.self, forKey: key)
            guard let d = Double(s.replacingOccurrences(of: ",", with: ".")) else {
                throw DecodingError.dataCorruptedError(forKey: key, in: k, debugDescription: "not a number")
            }
            return d
        }
        name = try k.decode(String.self, forKey: .name)
        path = try k.decode(String.self, forKey: .path)
        lat = try num(.lat); lon = try num(.lon); radiusKm = try num(.radiusKm)
        note = (try? k.decode(String.self, forKey: .note)) ?? ""
    }
}

/// html2json pages, DA sheets, images. Ephemeral session, no local cache, a 2 MB cap, the last good page kept in memory.
final class ContentClient {
    static let htmlJsonBase = "https://mhast-html-to-json.adobeaem.workers.dev/moved-permanently/bmw"
    static let siteBase = "https://main--bmw--moved-permanently.aem.page"

    private let session: URLSession
    private let maxBytes: Int
    private let lock = NSLock()
    private var pages: [String: Page] = [:]
    private let images = NSCache<NSURL, UIImage>()

    init(session: URLSession? = nil, maxBytes: Int = 2_000_000) {
        if let s = session { self.session = s } else {
            let cfg = URLSessionConfiguration.ephemeral
            cfg.requestCachePolicy = .reloadIgnoringLocalCacheData
            cfg.timeoutIntervalForRequest = 15
            self.session = URLSession(configuration: cfg)
        }
        self.maxBytes = maxBytes
    }

    static func pageURL(path: String) -> URL {
        let p = path.hasPrefix("/") ? path : "/" + path
        return URL(string: "\(htmlJsonBase)\(p)?preview=true")!
    }
    static func sheetURL(path: String) -> URL {
        let p = path.hasPrefix("/") ? path : "/" + path
        return URL(string: "\(siteBase)\(p)")!
    }

    private func fetch(_ url: URL) async throws -> Data {
        var req = URLRequest(url: url)
        req.cachePolicy = .reloadIgnoringLocalCacheData
        req.timeoutInterval = 15
        let (data, resp) = try await session.data(for: req)
        if let h = resp as? HTTPURLResponse, !(200..<300).contains(h.statusCode) { throw ContentError.http(h.statusCode) }
        if data.count > maxBytes { throw ContentError.tooLarge }
        return data
    }

    func page(path: String) async throws -> Page {
        let data = try await fetch(Self.pageURL(path: path))
        let p = try JSONDecoder().decode(Page.self, from: data)
        lock.lock(); pages[path] = p; lock.unlock()
        return p
    }

    /// Keeps the last good copy when the refresh fails; `stale` marks that case.
    func page(path: String, fallbackToCache: Bool) async throws -> (page: Page, stale: Bool) {
        do { return (try await page(path: path), false) } catch {
            lock.lock(); let cached = pages[path]; lock.unlock()
            if fallbackToCache, let c = cached { return (c, true) }
            throw error
        }
    }

    func newsIndex(market: Market) async throws -> [NewsRow] {
        struct Sheet: Decodable { var data: [NewsRow] }
        let s = try JSONDecoder().decode(Sheet.self, from: try await fetch(Self.sheetURL(path: "/aida/showcase/news-index.json")))
        return s.data.filter { $0.context == market.folder }
    }

    static func decodePlaces(_ data: Data) throws -> [PlaceRow] {
        struct Sheet: Decodable { var data: [PlaceRow] }
        return try JSONDecoder().decode(Sheet.self, from: data).data
    }

    func places() async throws -> [PlaceRow] {
        try Self.decodePlaces(try await fetch(Self.sheetURL(path: "/aida/showcase/data/places.json")))
    }

    func image(_ url: URL?) async -> UIImage? {
        guard let url else { return nil }
        if let c = images.object(forKey: url as NSURL) { return c }
        guard let data = try? await fetch(url), let img = UIImage(data: data) else { return nil }
        images.setObject(img, forKey: url as NSURL)
        return img
    }
}
