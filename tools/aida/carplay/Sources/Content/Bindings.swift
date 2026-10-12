import Foundation

/// `/aida/showcase/data/wdh-de.json#61HG.electricRange` -> market de, model 61HG, field electricRange.
struct WdhBinding: Equatable {
    let market: String, model: String, field: String
    private static let re = try! NSRegularExpression(pattern: #"/data/wdh-([a-z]{2})\.json#([A-Za-z0-9]+)\.([A-Za-z0-9]+)$"#)
    init?(href: String) {
        let ns = href as NSString
        guard let m = Self.re.firstMatch(in: href, range: NSRange(location: 0, length: ns.length)) else { return nil }
        market = ns.substring(with: m.range(at: 1)); model = ns.substring(with: m.range(at: 2)); field = ns.substring(with: m.range(at: 3))
    }
}

/// "513–627 km" -> 513...627, "805 km" -> 805.
struct RangeText: Equatable {
    var low: Int
    var high: Int?

    private static let two = try! NSRegularExpression(pattern: #"(\d[\d.]*)\s*[–—-]\s*(\d[\d.]*)"#)
    private static let one = try! NSRegularExpression(pattern: #"(\d[\d.]*)"#)

    init(low: Int, high: Int?) { self.low = low; self.high = high }

    init?(_ text: String) {
        let ns = text as NSString
        let full = NSRange(location: 0, length: ns.length)
        func num(_ s: String) -> Int? { Int(s.replacingOccurrences(of: ".", with: "")) }
        if let m = Self.two.firstMatch(in: text, range: full),
           let a = num(ns.substring(with: m.range(at: 1))), let b = num(ns.substring(with: m.range(at: 2))) {
            low = a; high = b; return
        }
        if let m = Self.one.firstMatch(in: text, range: full), let a = num(ns.substring(with: m.range(at: 1))) {
            low = a; high = nil; return
        }
        return nil
    }

    func at(soc: Int) -> RangeText {
        let f = Double(min(100, max(0, soc))) / 100
        return RangeText(low: Int((Double(low) * f).rounded()), high: high.map { Int((Double($0) * f).rounded()) })
    }

    func formatted(locale: Locale) -> String {
        let nf = NumberFormatter()
        nf.locale = locale; nf.numberStyle = .decimal; nf.maximumFractionDigits = 0
        let l = nf.string(from: NSNumber(value: low)) ?? "\(low)"
        guard let h = high else { return "\(l) km" }
        return "\(l)–\(nf.string(from: NSNumber(value: h)) ?? "\(h)") km"
    }
}
