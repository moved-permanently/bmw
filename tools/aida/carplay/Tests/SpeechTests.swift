import XCTest
@testable import BMWCarPlay

/// Holds a fetch open until the test lets it go, so a test can press "Stop" or a second "Vorlesen" in between.
final class Gate: @unchecked Sendable {
    private let lock = NSLock()
    private var continuation: CheckedContinuation<Void, Never>?
    private var isOpen = false
    /// Returns at once when the gate was opened before the fetch got here.
    func wait() async {
        await withCheckedContinuation { (c: CheckedContinuation<Void, Never>) in
            lock.lock()
            if isOpen { lock.unlock(); c.resume() } else { continuation = c; lock.unlock() }
        }
    }
    func open() {
        lock.lock(); isOpen = true; let c = continuation; continuation = nil; lock.unlock()
        c?.resume()
    }
}

/// Records what the controller did.
final class Recorder: @unchecked Sendable {
    private let lock = NSLock()
    private var _events: [String] = []
    var events: [String] { lock.lock(); defer { lock.unlock() }; return _events }
    func add(_ e: String) { lock.lock(); _events.append(e); lock.unlock() }
}

struct PlayFailure: Error {}

final class Box<T>: @unchecked Sendable { var value: T? }

final class SpeechControllerTests: XCTestCase {
    func controller(_ r: Recorder, fetch: @escaping SpeechController.Fetch, playFails: Bool = false) -> SpeechController {
        SpeechController(
            fetch: fetch,
            play: { data in
                if playFails { throw PlayFailure() }
                r.add("play:\(String(data: data, encoding: .utf8) ?? "?")")
            },
            fallback: { text, lang in r.add("fallback:\(lang):\(text)") },
            stopAudio: { r.add("stopAudio") })
    }

    func testPlaysTheHelperAudio() async {
        let r = Recorder()
        let c = controller(r) { text, _ in Data("audio of \(text)".utf8) }
        await c.speak("Hallo", language: "de-DE").value
        XCTAssertEqual(r.events, ["stopAudio", "play:audio of Hallo"])
    }

    func testFallsBackToTheSystemVoiceWhenTheHelperIsDown() async {
        let r = Recorder()
        let c = controller(r) { _, _ in throw TTSError.helper(503) }
        await c.speak("Hallo", language: "de-DE").value
        XCTAssertEqual(r.events, ["stopAudio", "fallback:de-DE:Hallo"])
    }

    func testFallsBackWhenTheAudioCannotBePlayed() async {
        let r = Recorder()
        let c = controller(r, fetch: { _, _ in Data("x".utf8) }, playFails: true)
        await c.speak("Hallo", language: "fr-FR").value
        XCTAssertEqual(r.events, ["stopAudio", "fallback:fr-FR:Hallo"])
    }

    func testStopWhileTheAudioIsLoadingPlaysNothing() async {
        let r = Recorder(), gate = Gate()
        let c = controller(r) { _, _ in await gate.wait(); return Data("late".utf8) }
        let task = c.speak("Hallo", language: "de-DE")
        c.stop()
        gate.open()
        await task.value
        XCTAssertEqual(r.events, ["stopAudio", "stopAudio"], "no play and no fallback after Stop")
    }

    func testASecondRequestReplacesTheFirst() async {
        let r = Recorder(), gate = Gate()
        let c = controller(r) { text, _ in
            if text == "eins" { await gate.wait() }
            return Data(text.utf8)
        }
        let first = c.speak("eins", language: "de-DE")
        await c.speak("zwei", language: "de-DE").value
        gate.open()
        await first.value
        XCTAssertEqual(r.events, ["stopAudio", "stopAudio", "play:zwei"], "the late answer for the first text is dropped")
    }

    func testAnOldFailureDoesNotTriggerTheFallback() async {
        let r = Recorder(), gate = Gate()
        let c = controller(r) { text, _ in
            if text == "eins" { await gate.wait(); throw TTSError.helper(502) }
            return Data(text.utf8)
        }
        let first = c.speak("eins", language: "de-DE")
        await c.speak("zwei", language: "de-DE").value
        gate.open()
        await first.value
        XCTAssertEqual(r.events, ["stopAudio", "stopAudio", "play:zwei"])
    }
}

final class TTSClientTests: XCTestCase {
    func client() -> TTSClient {
        let cfg = URLSessionConfiguration.ephemeral
        cfg.protocolClasses = [StubProtocol.self]
        return TTSClient(base: URL(string: "http://127.0.0.1:8765")!, session: URLSession(configuration: cfg))
    }
    static func body(_ request: URLRequest) -> [String: Any] {
        var data = Data()
        if let stream = request.httpBodyStream {
            stream.open(); defer { stream.close() }
            var buffer = [UInt8](repeating: 0, count: 4096)
            while stream.hasBytesAvailable {
                let n = stream.read(&buffer, maxLength: buffer.count)
                if n <= 0 { break }
                data.append(buffer, count: n)
            }
        } else { data = request.httpBody ?? Data() }
        return (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] ?? [:]
    }

    func testPostsTheTextAndLanguageToTheHelper() async throws {
        let box = Box<URLRequest>()
        StubProtocol.handler = { request in box.value = request; return (200, Data("ID3".utf8)) }
        let audio = try await client().audio(for: "Guten Tag, München.", language: "de-DE")
        XCTAssertEqual(audio, Data("ID3".utf8))
        XCTAssertEqual(box.value?.httpMethod, "POST")
        XCTAssertEqual(box.value?.url?.absoluteString, "http://127.0.0.1:8765/tts")
        XCTAssertEqual(box.value?.value(forHTTPHeaderField: "Content-Type"), "application/json")
        let body = Self.body(box.value!)
        XCTAssertEqual(body["text"] as? String, "Guten Tag, München.")
        XCTAssertEqual(body["lang"] as? String, "de-DE")
    }

    func testAHelperErrorThrows() async {
        StubProtocol.handler = { _ in (503, Data("{\"error\":\"no key\"}".utf8)) }
        do { _ = try await client().audio(for: "x", language: "de-DE"); XCTFail("should throw") } catch {
            XCTAssertEqual(error as? TTSError, .helper(503))
        }
    }

    func testAnEmptyAnswerThrows() async {
        StubProtocol.handler = { _ in (200, Data()) }
        do { _ = try await client().audio(for: "x", language: "de-DE"); XCTFail("should throw") } catch {
            XCTAssertEqual(error as? TTSError, .empty)
        }
    }

    func testWarmAsksTheHelperToRenderInTheBackground() async {
        let box = Box<URLRequest>()
        StubProtocol.handler = { request in box.value = request; return (202, Data("{\"queued\":1}".utf8)) }
        await client().warm("Artikel", language: "fr-FR")
        XCTAssertEqual(box.value?.url?.path, "/warm")
        let items = Self.body(box.value!)["items"] as? [[String: String]]
        XCTAssertEqual(items, [["text": "Artikel", "lang": "fr-FR"]])
    }

    func testWarmIgnoresAMissingHelper() async {
        StubProtocol.handler = { _ in (500, Data()) }
        await client().warm("Artikel", language: "de-DE") // must not throw or crash
    }
}
