import AVFoundation

/// "Vorlesen". The audio comes from the local OpenAI helper (demo/tts-helper.mjs) when it runs; otherwise the system
/// voice speaks, as before. TTS.swift holds the decision logic, this class holds the audio players.
final class Speech: NSObject, AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    static let shared = Speech()
    private let synth = AVSpeechSynthesizer()
    private var player: AVAudioPlayer?
    private let client = TTSClient()
    private var controller: SpeechController!

    override init() {
        super.init()
        synth.delegate = self
        let client = self.client
        controller = SpeechController(
            fetch: { text, language in try await client.audio(for: text, language: language) },
            play: { [weak self] data in try await MainActor.run { try self?.startPlayback(data) } },
            fallback: { [weak self] text, language in self?.speakWithSystemVoice(text, language: language) },
            stopAudio: { [weak self] in self?.stopAudio() })
    }

    func speak(_ text: String, language tag: String) { controller.speak(text, language: tag) }
    func stop() { controller.stop() }

    /// Called when a detail page opens: the helper renders the audio while the page is read.
    func prefetch(_ text: String, language tag: String) {
        let client = self.client
        Task { await client.warm(text, language: tag) }
    }

    private func activateSession() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    private func startPlayback(_ data: Data) throws {
        activateSession()
        let p = try AVAudioPlayer(data: data)
        p.delegate = self
        guard p.play() else { throw TTSError.playback }
        player = p
        NSLog("BMWCarPlay speech via OpenAI helper, %d bytes, %.1f s", data.count, p.duration)
    }

    private func speakWithSystemVoice(_ text: String, language tag: String) {
        activateSession()
        let u = AVSpeechUtterance(string: text)
        u.voice = AVSpeechSynthesisVoice(language: tag) ?? AVSpeechSynthesisVoice(language: String(tag.prefix(2)))
        NSLog("BMWCarPlay speech start lang=%@ voice=%@ chars=%d", tag, u.voice?.identifier ?? "none", text.count)
        synth.speak(u)
    }

    private func stopAudio() {
        let work = { [self] in
            player?.stop(); player = nil
            synth.stopSpeaking(at: .immediate)
        }
        if Thread.isMainThread { work() } else { DispatchQueue.main.async(execute: work) }
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        NSLog("BMWCarPlay speech finished (helper audio, ok=%d)", flag ? 1 : 0)
        self.player = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        NSLog("BMWCarPlay speech decode error %@", String(describing: error))
    }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, willSpeakRangeOfSpeechString r: NSRange, utterance u: AVSpeechUtterance) {
        NSLog("BMWCarPlay willSpeakRange %d+%d of %d", r.location, r.length, u.speechString.count)
    }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) { NSLog("BMWCarPlay speech finished") }
}

extension Market {
    var speechTag: String { "\(language)-\(country)" }
}
