import Foundation

enum TTSError: Error, Equatable {
    case helper(Int)
    case empty
    case playback
}

/// Talks to the local text-to-speech helper (demo/tts-helper.mjs), which asks OpenAI for the audio and keeps the key.
/// The simulator shares the Mac's network, so the helper is at 127.0.0.1; the app never sees the key.
struct TTSClient {
    static let defaultBase = URL(string: "http://127.0.0.1:8765")!
    var base = TTSClient.defaultBase
    var session: URLSession = .shared
    /// Nothing listening on the port fails at once (connection refused); a text rendered for the first time takes seconds.
    var timeout: TimeInterval = 45

    func audio(for text: String, language: String) async throws -> Data {
        let (data, response) = try await session.data(for: post("tts", ["text": text, "lang": language]))
        guard let code = (response as? HTTPURLResponse)?.statusCode else { throw TTSError.helper(0) }
        guard code == 200 else { throw TTSError.helper(code) }
        guard !data.isEmpty else { throw TTSError.empty }
        return data
    }

    /// Asks the helper to render the text in the background, so the audio is ready when "Vorlesen" is pressed.
    /// A helper that is not running is not an error here: the system voice covers it.
    func warm(_ text: String, language: String) async {
        _ = try? await session.data(for: post("warm", ["items": [["text": text, "lang": language]]]))
    }

    private func post(_ path: String, _ body: Any) throws -> URLRequest {
        var request = URLRequest(url: base.appendingPathComponent(path), timeoutInterval: timeout)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        return request
    }
}

/// Decides how "Vorlesen" speaks: the helper's audio when it answers, the system voice when it does not.
/// Every request gets a number; an answer for an old request (the user pressed Stop, or another text) is dropped.
final class SpeechController: @unchecked Sendable {
    typealias Fetch = @Sendable (_ text: String, _ language: String) async throws -> Data
    private let fetch: Fetch
    private let play: @Sendable (Data) async throws -> Void
    private let fallback: @Sendable (_ text: String, _ language: String) -> Void
    private let stopAudio: @Sendable () -> Void
    private let lock = NSLock()
    private var generation = 0

    init(fetch: @escaping Fetch,
         play: @escaping @Sendable (Data) async throws -> Void,
         fallback: @escaping @Sendable (String, String) -> Void,
         stopAudio: @escaping @Sendable () -> Void) {
        self.fetch = fetch; self.play = play; self.fallback = fallback; self.stopAudio = stopAudio
    }

    private func next() -> Int { lock.lock(); defer { lock.unlock() }; generation += 1; return generation }
    private func isCurrent(_ g: Int) -> Bool { lock.lock(); defer { lock.unlock() }; return g == generation }

    /// Returns the task so a test can wait for it.
    @discardableResult
    func speak(_ text: String, language: String) -> Task<Void, Never> {
        let mine = next()
        stopAudio()
        return Task {
            do {
                let audio = try await fetch(text, language)
                guard isCurrent(mine) else { return }
                try await play(audio)
            } catch {
                guard isCurrent(mine) else { return }
                NSLog("BMWCarPlay speech: helper not used (%@), system voice", String(describing: error))
                fallback(text, language)
            }
        }
    }

    func stop() { _ = next(); stopAudio() }
}
