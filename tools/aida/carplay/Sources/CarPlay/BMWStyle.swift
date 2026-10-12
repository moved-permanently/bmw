import UIKit

/// Colours and sizes of the car screen. BMW blue is the brand's #1C69D4; the rest follows what Apple's CarPlay
/// uses: system font, dark material, white text with a secondary grey, 10 pt corners.
enum BMWStyle {
    static let blue = UIColor(red: 0x1C / 255, green: 0x69 / 255, blue: 0xD4 / 255, alpha: 1)
    /// Blue that reads on a dark panel (the brand blue alone is too dark there).
    static let blueOnDark = UIColor(red: 0x6F / 255, green: 0xA8 / 255, blue: 0xF5 / 255, alpha: 1)
    static let secondary = UIColor(white: 1, alpha: 0.62)
    static let separator = UIColor(white: 1, alpha: 0.12)
    static let corner: CGFloat = 12
}
