import UIKit

/// One line pair of the places panel: short name, then the distance first and the place.
struct PanelRow: Equatable {
    var title: String
    var subtitle: String
}

/// The Orte list drawn on the left of the map, in the car window. The window takes no touches, so it only shows;
/// the "BMW" button opens the full list with the details.
final class PlacesPanelView: UIView {
    static let headerHeight: CGFloat = 20
    static let rowHeight: CGFloat = 31

    private let header = UILabel()
    private var rowViews: [(UILabel, UILabel)] = []
    private var rows: [PanelRow] = []

    override init(frame: CGRect) {
        super.init(frame: frame)
        layer.cornerRadius = 10
        layer.masksToBounds = true
        backgroundColor = UIColor(white: 0.08, alpha: 0.86)
        header.font = .systemFont(ofSize: 10, weight: .semibold)
        header.textColor = UIColor(white: 1, alpha: 0.6)
        addSubview(header)
    }
    required init?(coder: NSCoder) { fatalError() }

    func set(title: String, rows: [PanelRow]) {
        header.text = title.uppercased()
        self.rows = rows
        setNeedsLayout()
    }

    /// How many rows fit in `height`.
    static func capacity(height: CGFloat) -> Int { max(0, Int((height - headerHeight - 6) / rowHeight)) }

    override func layoutSubviews() {
        super.layoutSubviews()
        let pad: CGFloat = 8
        header.frame = CGRect(x: pad, y: 5, width: bounds.width - 2 * pad, height: Self.headerHeight - 5)
        let shown = Array(rows.prefix(Self.capacity(height: bounds.height)))
        while rowViews.count < shown.count {
            let t = UILabel(), s = UILabel()
            t.font = .systemFont(ofSize: 12, weight: .semibold); t.textColor = .white
            s.font = .systemFont(ofSize: 10.5, weight: .regular); s.textColor = UIColor(white: 1, alpha: 0.7)
            t.lineBreakMode = .byTruncatingTail; s.lineBreakMode = .byTruncatingTail
            addSubview(t); addSubview(s)
            rowViews.append((t, s))
        }
        for (i, pair) in rowViews.enumerated() {
            let on = i < shown.count
            pair.0.isHidden = !on; pair.1.isHidden = !on
            guard on else { continue }
            let y = Self.headerHeight + CGFloat(i) * Self.rowHeight
            pair.0.text = shown[i].title; pair.1.text = shown[i].subtitle
            pair.0.frame = CGRect(x: pad, y: y, width: bounds.width - 2 * pad, height: 15)
            pair.1.frame = CGRect(x: pad, y: y + 14, width: bounds.width - 2 * pad, height: 14)
        }
    }
}
