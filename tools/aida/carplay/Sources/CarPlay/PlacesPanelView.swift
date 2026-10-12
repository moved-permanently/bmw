import UIKit

/// One row of the places panel: short name, localized distance, and the place or headline.
struct PanelRow: Equatable {
    var title: String
    var distance: String
    var detail: String?
}

/// The Orte list drawn on the left of the map, in the car window. The window takes no touches, so it only shows;
/// the "Orte" button in the navigation bar opens the full list with the details.
final class PlacesPanelView: UIView {
    static let pad: CGFloat = 8
    static let headerHeight: CGFloat = 24
    static let rowHeight: CGFloat = 31

    private let blur = UIVisualEffectView(effect: UIBlurEffect(style: .systemChromeMaterialDark))
    private let tint = UIView()
    private let header = UILabel()
    private let accent = UIView()
    private var rowViews: [(title: UILabel, sub: UILabel, line: UIView)] = []
    private var rows: [PanelRow] = []

    override init(frame: CGRect) {
        super.init(frame: frame)
        layer.cornerRadius = BMWStyle.corner
        layer.cornerCurve = .continuous
        layer.masksToBounds = true
        addSubview(blur)
        tint.backgroundColor = UIColor(white: 0.05, alpha: 0.55)
        addSubview(tint)
        accent.backgroundColor = BMWStyle.blue
        addSubview(accent)
        header.font = .systemFont(ofSize: 10, weight: .bold)
        header.textColor = BMWStyle.secondary
        addSubview(header)
    }
    required init?(coder: NSCoder) { fatalError() }

    func set(title: String, rows: [PanelRow]) {
        header.attributedText = NSAttributedString(string: title.uppercased(), attributes: [.kern: 0.8])
        self.rows = rows
        setNeedsLayout()
    }

    /// How many rows fit in `height`.
    static func capacity(height: CGFloat) -> Int { max(0, Int((height - headerHeight - 8) / rowHeight)) }
    static func height(rows: Int) -> CGFloat { headerHeight + CGFloat(rows) * rowHeight + 8 }

    private func subtitle(_ r: PanelRow) -> NSAttributedString {
        let s = NSMutableAttributedString(string: r.distance, attributes: [
            .font: UIFont.systemFont(ofSize: 10.5, weight: .semibold), .foregroundColor: BMWStyle.blueOnDark])
        if let d = r.detail, !d.isEmpty {
            s.append(NSAttributedString(string: " · \(d)", attributes: [
                .font: UIFont.systemFont(ofSize: 10.5, weight: .regular), .foregroundColor: BMWStyle.secondary]))
        }
        return s
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        blur.frame = bounds; tint.frame = bounds
        accent.frame = CGRect(x: 0, y: 0, width: 3, height: bounds.height)
        let pad = Self.pad
        header.frame = CGRect(x: pad + 2, y: 8, width: bounds.width - 2 * pad, height: 12)
        let shown = Array(rows.prefix(Self.capacity(height: bounds.height)))
        while rowViews.count < shown.count {
            let t = UILabel(), s = UILabel(), l = UIView()
            t.font = .systemFont(ofSize: 12, weight: .semibold); t.textColor = .white
            t.lineBreakMode = .byTruncatingTail; s.lineBreakMode = .byTruncatingTail
            l.backgroundColor = BMWStyle.separator
            addSubview(l); addSubview(t); addSubview(s)
            rowViews.append((t, s, l))
        }
        for (i, v) in rowViews.enumerated() {
            let on = i < shown.count
            v.title.isHidden = !on; v.sub.isHidden = !on; v.line.isHidden = !on || i == 0
            guard on else { continue }
            let y = Self.headerHeight + CGFloat(i) * Self.rowHeight
            let w = bounds.width - 2 * pad - 2
            v.title.text = shown[i].title
            v.sub.attributedText = subtitle(shown[i])
            v.line.frame = CGRect(x: pad + 2, y: y - 1, width: w, height: 0.5)
            v.title.frame = CGRect(x: pad + 2, y: y + 1, width: w, height: 15)
            v.sub.frame = CGRect(x: pad + 2, y: y + 15, width: w, height: 14)
        }
    }
}
