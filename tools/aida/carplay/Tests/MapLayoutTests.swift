import XCTest
@testable import BMWCarPlay

final class MapLayoutTests: XCTestCase {
    let bounds = CGRect(x: 0, y: 0, width: 800, height: 480)

    func testDotIsMiddleOfFreeArea() {
        // side panel took 300 pt on the left, buttons 80 pt on the right
        let free = CGRect(x: 300, y: 0, width: 420, height: 480)
        XCTAssertEqual(MapLayout.dotPoint(free: free), CGPoint(x: 510, y: 240))
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
