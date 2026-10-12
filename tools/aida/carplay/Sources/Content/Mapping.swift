import Foundation

private func scene7(_ nodes: [Node]) -> URL? {
    for n in nodes.flatMap(\.descendants) {
        if case let .link(href, _) = n, href.contains("scene7.com/is/image/") { return URL(string: href) }
        if case let .image(src, _) = n, src.contains("scene7.com/is/image/") { return URL(string: src) }
    }
    return nil
}

private func heroBlock(_ page: Page) -> Block? {
    page.allBlocks.first { $0.name.hasPrefix("hero-") }
}

private func heroNodes(_ b: Block?) -> [Node] { b?.rows.flatMap { $0 }.flatMap(\.flat) ?? [] }

struct RangeNow { var value: String; var wltp: String }

struct KPI: Equatable { var label: String; var value: String; var binding: WdhBinding? }

struct ModelCard: Equatable { var name: String; var priceLine: String?; var image: URL? }

struct CarViewModel {
    var title: String
    var heroImage: URL?
    var headline: String?
    var lead: String?
    var kpis: [KPI]
    var models: [ModelCard]
    var disclaimer: String?
    var skippedBlocks: Int

    init(page: Page) {
        title = page.title
        let hero = heroBlock(page)
        let hn = heroNodes(hero).flatMap(\.descendants)
        heroImage = scene7(heroNodes(hero))
        headline = hn.compactMap { if case let .heading(1, t) = $0 { return t } else { return nil } }.first
        lead = hn.compactMap { n -> String? in
            if case let .paragraph(c) = n, c.count == 1, case let .text(t) = c[0] { return t } else { return nil }
        }.first
        kpis = (page.blocks(named: "car-kpis").first?.rows ?? []).compactMap { row in
            let nodes = row.flatMap(\.descendants)
            guard let link = nodes.compactMap({ n -> (String, String)? in
                if case let .link(h, t) = n { return (h, t) } else { return nil } }).first else { return nil }
            let label = row.map { $0.flat.filter { if case .link = $0 { return false } else { return true } }.map(\.plainText).joined() }
                .first { !$0.isEmpty } ?? ""
            return KPI(label: label, value: link.1, binding: WdhBinding(href: link.0))
        }
        let cards = page.blocks(named: "carousel").first { $0.options.contains("cards") }
        models = (cards?.rows ?? []).compactMap { slide in
            let nodes = slide.flatMap(\.flat)
            let all = nodes.flatMap(\.descendants)
            guard let name = all.compactMap({ n -> String? in if case let .heading(_, t) = n { return t } else { return nil } }).first else { return nil }
            let price = all.compactMap { n -> String? in
                if case .paragraph = n, n.plainText.hasPrefix("Ab ") || n.plainText.hasPrefix("À partir") { return n.plainText } else { return nil }
            }.first
            return ModelCard(name: name, priceLine: price, image: scene7(nodes))
        }
        disclaimer = page.blocks(named: "disclaimer").first.map { $0.rows.flatMap { $0 }.map(\.plainText).joined(separator: " ") }
        let handled: Set<String> = ["car-kpis", "disclaimer"]
        skippedBlocks = page.allBlocks.filter { b in
            if b.name.hasPrefix("hero-") || handled.contains(b.name) { return false }
            if b.name == "carousel", b.options.contains("cards") { return false }
            return true
        }.count
    }

    var rangeText: RangeText? {
        kpis.first { $0.binding?.field == "electricRange" }.flatMap { RangeText($0.value) }
    }

    func rangeNow(soc: Int, locale: Locale) -> RangeNow? {
        guard let r = rangeText, let k = kpis.first(where: { $0.binding?.field == "electricRange" }) else { return nil }
        return RangeNow(value: r.at(soc: soc).formatted(locale: locale), wltp: k.value)
    }
}

struct ArticleViewModel {
    var title: String
    var teaser: String
    var pairs: [(label: String, value: String)]
    var speechText: String
    /// Running text of the page without the title and the key/value list, for the article screen.
    var body: String

    init(page: Page) {
        let hn = heroNodes(heroBlock(page)).flatMap(\.descendants)
        title = hn.compactMap { if case let .heading(1, t) = $0 { return t } else { return nil } }.first ?? page.title
        let top = page.topLevelNodes
        let paras = top.filter { if case .paragraph = $0 { return true } else { return false } }
        teaser = paras.first?.plainText ?? ""
        var p: [(String, String)] = []
        for n in top { if case let .list(_, items) = n {
            for it in items { let t = it.flatMap(\.flat).map(\.plainText); if t.count >= 2 { p.append((t[0], t[1])) } }
            break
        } }
        pairs = p.map { (label: $0.0, value: $0.1) }
        var parts = [title]
        var prose: [String] = []
        for n in top {
            switch n {
            case let .paragraph(c): let t = c.map(\.plainText).joined(); parts.append(t); prose.append(t)
            case let .heading(_, t): parts.append(t)
            case let .list(_, items): parts += items.map { $0.flatMap(\.flat).map(\.plainText).joined(separator: ": ") }
            default: break
            }
        }
        speechText = parts.filter { !$0.isEmpty }.joined(separator: "\n")
        body = prose.filter { !$0.isEmpty }.joined(separator: " ")
    }
}

struct PlaceViewModel {
    var name: String
    var headline: String
    var lead: String
    var image: URL?
    var speechText: String
    var speechParagraphCount: Int
    var row: PlaceRow

    private static let skipBlocks: Set<String> = ["video", "embed", "link-list", "disclaimer"]

    init(row: PlaceRow, page: Page) {
        self.row = row
        name = row.name
        let hero = heroBlock(page)
        let hn = heroNodes(hero).flatMap(\.descendants)
        headline = hn.compactMap { if case let .heading(1, t) = $0 { return t } else { return nil } }.first
            ?? page.topLevelNodes.flatMap(\.descendants).compactMap { if case let .heading(1, t) = $0 { return t } else { return nil } }.first
            ?? page.title
        image = scene7(heroNodes(hero))
        // Document-order text without the hero, video, embeds and link lists.
        var texts: [(isPara: Bool, text: String)] = []
        func walk(_ n: Node) {
            switch n {
            case let .block(b):
                if b.name.hasPrefix("hero-") || Self.skipBlocks.contains(b.name) { return }
                for c in b.rows.flatMap({ $0 }) { walk(c) }
            case let .group(g): g.forEach(walk)
            case let .paragraph(c):
                let t = n.plainText.trimmingCharacters(in: .whitespacesAndNewlines)
                let onlyImageLink: Bool = { if c.count == 1, case let .link(h, _) = c[0], h.contains("scene7.com") { return true } else { return false } }()
                if !t.isEmpty, !onlyImageLink, !t.contains("Image without alt text") { texts.append((true, t)) }
            case let .heading(_, t): if !t.isEmpty { texts.append((false, t)) }
            default: break
            }
        }
        page.topLevelNodes.forEach(walk)
        lead = texts.first { $0.isPara && $0.text.count > 40 }?.text ?? texts.first { $0.isPara }?.text ?? ""
        var used = 0
        var parts = [headline]
        for t in texts where t.text != headline {
            if t.isPara { if used >= 12 { break }; used += 1 }
            parts.append(t.text)
        }
        speechParagraphCount = used
        speechText = parts.joined(separator: "\n")
    }
}
