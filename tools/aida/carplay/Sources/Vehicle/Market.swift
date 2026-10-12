import Foundation

/// The four showcase documents: language/country folders under /aida/showcase/.
enum Market: String, CaseIterable {
    case deDE = "de/de", deAT = "de/at", frFR = "fr/fr", frBE = "fr/be"

    var folder: String { rawValue }
    var language: String { String(rawValue.prefix(2)) }
    var country: String { String(rawValue.suffix(2)).uppercased() }
    var locale: Locale { Locale(identifier: "\(language)_\(country)") }

    init?(folder: String) { self.init(rawValue: folder) }

    static let supportedCountries: Set<String> = ["DE", "AT", "FR", "BE"]

    static func home(language: String) -> Market { language == "fr" ? .frFR : .deDE }

    /// Country decides the market when a document exists for the language; unknown countries keep the previous market.
    static func resolve(language: String, country: String?, previous: Market? = nil) -> Market {
        let kept = previous.flatMap { $0.language == language ? $0 : nil } ?? home(language: language)
        guard let c = country?.uppercased(), supportedCountries.contains(c) else { return kept }
        return Market(folder: "\(language)/\(c.lowercased())") ?? home(language: language)
    }

    static func language(fromPreferred prefs: [String]) -> String {
        for p in prefs {
            let l = String(p.prefix(2)).lowercased()
            if l == "de" || l == "fr" { return l }
        }
        return "de"
    }
}
