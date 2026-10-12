import XCTest
@testable import BMWCarPlay

final class MapLayoutTests: XCTestCase {
    let bounds = CGRect(x: 0, y: 0, width: 800, height: 480)

    func testDotIsMiddleOfFreeArea() {
        // the car dock took 100 pt on the left; the panel takes 40 % of the rest: 100 + 280 = 380, right edge 800
        let safe = CGRect(x: 100, y: 60, width: 700, height: 420)   // top bar shrinks the safe area
        XCTAssertEqual(MapLayout.dotPoint(safe: safe, bounds: bounds), CGPoint(x: 590, y: 240))
    }
    func testPanelIsLeftFortyPercent() {
        let safe = CGRect(x: 100, y: 0, width: 700, height: 480)
        let p = MapLayout.panelFrame(safe: safe, bounds: bounds, margin: 0)
        XCTAssertEqual(p.minX, 100); XCTAssertEqual(p.width, 280)
        XCTAssertLessThan(p.maxX, MapLayout.dotPoint(safe: safe, bounds: bounds).x)
    }
    func testMapCentreIsTheDot() {
        let dot = CGPoint(x: 510, y: 240)
        let f = MapLayout.mapFrame(bounds: bounds, dot: dot)
        XCTAssertEqual(f.midX, dot.x); XCTAssertEqual(f.midY, dot.y)
        XCTAssertEqual(f.width, f.height)
    }
    func testMapCoversTheScreen() {
        for dot in [CGPoint(x: 510, y: 240), CGPoint(x: 100, y: 400), CGPoint(x: 790, y: 10)] {
            XCTAssertTrue(MapLayout.mapFrame(bounds: bounds, dot: dot).contains(bounds), "\(dot)")
        }
    }
}
