import Foundation

/// One node of the html2json output. The service mixes strings, arrays and objects at almost every
/// position, so decoding is deliberately tolerant: string -> .text, array -> .group, object -> by "type" or "tag".
indirect enum Node: Decodable, Equatable {
    case text(String)
    case heading(level: Int, text: String)
    case paragraph([Node])
    case link(href: String, text: String)
    case image(src: String, alt: String)
    case list(ordered: Bool, items: [[Node]])
    case styled(String, [Node])          // strong, em
    case block(Block)
    case group([Node])
    case unknown(String)

    private enum Keys: String, CodingKey { case type, tag, text, level, href, src, alt, ordered, items, content, name, options }

    init(from decoder: Decoder) throws {
        let single = try decoder.singleValueContainer()
        if let s = try? single.decode(String.self) { self = .text(s); return }
        if let a = try? single.decode([Node].self) { self = .group(a); return }
        let k = try decoder.container(keyedBy: Keys.self)
        guard let type = try k.decodeIfPresent(String.self, forKey: .type) else {
            self = .unknown(try k.decodeIfPresent(String.self, forKey: .tag) ?? ""); return
        }
        switch type {
        case "heading":
            self = .heading(level: try k.decodeIfPresent(Int.self, forKey: .level) ?? 2,
                            text: try k.decodeIfPresent(String.self, forKey: .text) ?? "")
        case "paragraph":
            if let t = try k.decodeIfPresent(String.self, forKey: .text) { self = .paragraph([.text(t)]) }
            else { self = .paragraph(try k.decodeIfPresent([Node].self, forKey: .content) ?? []) }
        case "text":
            self = .text(try k.decodeIfPresent(String.self, forKey: .text) ?? "")
        case "link":
            self = .link(href: try k.decodeIfPresent(String.self, forKey: .href) ?? "",
                         text: try k.decodeIfPresent(String.self, forKey: .text) ?? "")
        case "image":
            self = .image(src: try k.decodeIfPresent(String.self, forKey: .src) ?? "",
                          alt: try k.decodeIfPresent(String.self, forKey: .alt) ?? "")
        case "list":
            let raw = try k.decodeIfPresent([Node].self, forKey: .items) ?? []
            let items: [[Node]] = raw.map { if case let .group(g) = $0 { return g } else { return [$0] } }
            self = .list(ordered: try k.decodeIfPresent(Bool.self, forKey: .ordered) ?? false, items: items)
        case "strong", "em":
            self = .styled(type, try k.decodeIfPresent([Node].self, forKey: .content) ?? [])
        case "block":
            let raw = try k.decodeIfPresent([Node].self, forKey: .content) ?? []
            let rows: [[Node]] = raw.map { if case let .group(g) = $0 { return g } else { return [$0] } }
            self = .block(Block(name: try k.decodeIfPresent(String.self, forKey: .name) ?? "",
                                options: try k.decodeIfPresent([String].self, forKey: .options) ?? [],
                                rows: rows))
        default:
            self = .unknown(type)
        }
    }

    /// Groups removed, order kept.
    var flat: [Node] {
        if case let .group(g) = self { return g.flatMap(\.flat) }
        return [self]
    }

    /// Self and every nested node, pre-order. Blocks are entered through their cells.
    var descendants: [Node] {
        var out: [Node] = [self]
        switch self {
        case let .paragraph(c), let .group(c), let .styled(_, c): out += c.flatMap(\.descendants)
        case let .list(_, items): out += items.flatMap { $0.flatMap(\.descendants) }
        case let .block(b): out += b.rows.flatMap { $0.flatMap(\.descendants) }
        default: break
        }
        return out
    }

    var plainText: String {
        switch self {
        case let .text(s): return s
        case let .heading(_, t): return t
        case let .link(_, t): return t
        case let .image(_, alt): return alt
        case let .paragraph(c), let .group(c), let .styled(_, c): return c.map(\.plainText).joined()
        case let .list(_, items): return items.map { $0.map(\.plainText).joined(separator: ": ") }.joined(separator: "\n")
        case .block, .unknown: return ""
        }
    }
}

struct Block: Equatable {
    var name: String
    var options: [String]
    var rows: [[Node]]          // rows[cells]; each cell is a Node (usually .group)
}

struct Page: Decodable, Equatable {
    var title: String
    var meta: [String: String]
    var sections: [[Node]]

    private struct Root: Decodable {
        struct Meta: Decodable {
            struct Title: Decodable { var text: String? }
            struct Tag: Decodable { var tag: String?; var text: String? }
            var title: Title?
            var meta: [Tag]?
        }
        struct Section: Decodable { var section: [Node]? }
        var metadata: Meta?
        var content: [Section]?
    }

    init(from decoder: Decoder) throws {
        let r = try Root(from: decoder)
        title = r.metadata?.title?.text ?? ""
        var m: [String: String] = [:]
        for t in r.metadata?.meta ?? [] { if let k = t.tag, let v = t.text { m[k] = v } }
        meta = m
        sections = (r.content ?? []).map { ($0.section ?? []).flatMap(\.flat) }
    }

    var topLevelNodes: [Node] { sections.flatMap { $0 } }

    var allBlocks: [Block] {
        topLevelNodes.compactMap { if case let .block(b) = $0 { return b } else { return nil } }
    }

    func blocks(named name: String) -> [Block] { allBlocks.filter { $0.name == name } }
}
