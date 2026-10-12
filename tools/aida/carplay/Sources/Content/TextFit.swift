import Foundation

/// CarPlay draws list text in a fixed style, one line per field, and cuts the tail with "…".
/// Apps have no font or line-limit control, so the text is shortened here, at a word boundary,
/// with the information that matters first. Budgets are characters, estimated from the 800x480 car screen
/// (about 13 px per detail character, 16 px per title character, 17 px per bold POI title character).
enum TextBudget {
    /// CPListItem (News, Mein BMW), without image.
    static let listTitle = 30
    static let listDetail = 36
    /// CPPointOfInterest row: the card is narrow.
    static let poiTitle = 18
    static let poiSubtitle = 26
    /// Set to true to add the short page headline as a third row line (rows are then three lines high).
    static let poiRowShowsSummary = false
    /// Detail card and push pages have more room and wrap.
    static let poiCardSummary = 120
    static let infoItem = 220
}

enum TextFit {
    /// Collapses whitespace and cuts to `max` characters at a word boundary, ending in "…".
    /// A hyphen also counts as a boundary (the cut is before it). A single word longer than the
    /// budget is cut hard. Text that already fits is returned unchanged.
    static func trim(_ text: String, max: Int) -> String {
        let s = text.split(whereSeparator: { $0.isWhitespace }).joined(separator: " ")
        guard max > 1, s.count > max else { return s.count > max ? "…" : s }
        let head = Array(s.prefix(max - 1))
        // The next character after the cut decides whether the cut is already on a boundary.
        let next = s[s.index(s.startIndex, offsetBy: max - 1)]
        var cut = head.count
        if !(next == " " || next == "-") {
            if let i = head.lastIndex(where: { $0 == " " || $0 == "-" }), i >= max / 2 { cut = i }
        }
        var out = String(head.prefix(cut))
        while let l = out.last, " ,;:.-–—·/".contains(l) { out.removeLast() }
        return out.isEmpty ? String(head) + "…" : out + "…"
    }

    private static func key(_ s: String) -> String {
        s.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: nil)
            .filter { $0.isLetter || $0.isNumber }
    }

    /// nil when the detail adds nothing to the title (same text, or the detail is only a start of the title),
    /// otherwise the detail trimmed to the budget.
    static func distinct(_ detail: String?, from title: String, max: Int = TextBudget.listDetail) -> String? {
        guard let detail else { return nil }
        let d = key(detail)
        guard !d.isEmpty else { return nil }
        let t = key(title)
        if d == t || (!t.isEmpty && t.hasPrefix(d)) { return nil }
        return trim(detail, max: max)
    }

    /// "Chiemgau Arena, Ruhpolding" -> ("Chiemgau Arena", "Ruhpolding"); no comma -> (name, nil).
    static func shortPlaceName(_ name: String, max: Int = TextBudget.poiTitle) -> (title: String, place: String?) {
        let parts = name.split(separator: ",", maxSplits: 1).map { $0.trimmingCharacters(in: .whitespaces) }
        guard parts.count == 2, !parts[0].isEmpty, !parts[1].isEmpty else { return (trim(name, max: max), nil) }
        return (trim(parts[0], max: max), parts[1])
    }

    /// Localized distance with a non-breaking space: one decimal below 10 km ("4,2 km"), none above ("31 km").
    static func distance(km: Double, locale: Locale) -> String {
        let f = NumberFormatter()
        f.locale = locale
        f.numberStyle = .decimal
        f.minimumFractionDigits = 0
        f.maximumFractionDigits = km < 9.95 ? 1 : 0
        return (f.string(from: NSNumber(value: km)) ?? String(format: "%.0f", km)) + "\u{00A0}km"
    }

    /// POI row subtitle: the distance always comes first and is never trimmed; the rest fills what is left.
    static func placeSubtitle(distance: String, extra: String?, max: Int = TextBudget.poiSubtitle) -> String {
        let sep = " · "
        let room = max - distance.count - sep.count
        guard let extra, room >= 4 else { return distance }
        let t = trim(extra, max: room)
        return t.isEmpty ? distance : distance + sep + t
    }
}
