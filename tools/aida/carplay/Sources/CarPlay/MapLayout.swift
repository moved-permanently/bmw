import CoreGraphics

/// Where the blue dot sits on the car screen, and the frame a map needs so that its own centre is that point.
/// MKMapView in follow mode keeps the user location at the centre of its bounds, so the map is made larger than
/// the screen and shifted instead of moving the dot.
enum MapLayout {
    /// The panel takes the left `panelShare` of the safe area. The dot sits halfway between the panel and the right
    /// edge of the safe area (where the system puts its map buttons), and in the middle of the screen vertically:
    /// the bars at the top come and go and must not move it.
    static func panelFrame(safe: CGRect, bounds: CGRect, panelShare: CGFloat = 0.4, top: CGFloat = 44, margin: CGFloat = 6) -> CGRect {
        CGRect(x: safe.minX, y: top, width: safe.width * panelShare - margin, height: bounds.maxY - top - margin)
    }

    static func dotPoint(safe: CGRect, bounds: CGRect, panelShare: CGFloat = 0.4) -> CGPoint {
        let left = safe.minX + safe.width * panelShare
        return CGPoint(x: (left + safe.maxX) / 2, y: bounds.midY)
    }

    /// A square map centred on `dot` that still covers all of `bounds`.
    static func mapFrame(bounds: CGRect, dot: CGPoint) -> CGRect {
        let r = max(dot.x - bounds.minX, bounds.maxX - dot.x, dot.y - bounds.minY, bounds.maxY - dot.y)
        return CGRect(x: dot.x - r, y: dot.y - r, width: 2 * r, height: 2 * r)
    }
}
