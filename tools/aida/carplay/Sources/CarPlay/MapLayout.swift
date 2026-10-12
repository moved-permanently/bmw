import CoreGraphics

/// Where the blue dot sits on the car screen, and the frame a map needs so that its own centre is that point.
/// MKMapView in follow mode keeps the user location at the centre of its bounds, so the map is made larger than
/// the screen and shifted instead of moving the dot.
enum MapLayout {
    /// The middle of the free area: the safe area is what is left after the system took the side panel
    /// (left) and the map buttons (right), so its centre is halfway between them, and vertically centred.
    /// Vertically the middle of the screen: the bars at the top come and go and must not move the dot.
    static func dotPoint(free: CGRect, bounds: CGRect) -> CGPoint { CGPoint(x: free.midX, y: bounds.midY) }

    /// A square map centred on `dot` that still covers all of `bounds`.
    static func mapFrame(bounds: CGRect, dot: CGPoint) -> CGRect {
        let r = max(dot.x - bounds.minX, bounds.maxX - dot.x, dot.y - bounds.minY, bounds.maxY - dot.y)
        return CGRect(x: dot.x - r, y: dot.y - r, width: 2 * r, height: 2 * r)
    }
}
