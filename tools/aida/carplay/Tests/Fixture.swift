import Foundation
import XCTest

enum Fixture {
    static func data(_ name: String, file: StaticString = #filePath, line: UInt = #line) -> Data {
        let bundle = Bundle(for: BundleToken.self)
        guard let url = bundle.url(forResource: name, withExtension: "json"),
              let d = try? Data(contentsOf: url) else {
            XCTFail("missing fixture \(name)", file: file, line: line)
            return Data()
        }
        return d
    }
}
private final class BundleToken {}
