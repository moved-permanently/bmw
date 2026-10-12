import AVFoundation

final class Speech: NSObject, AVSpeechSynthesizerDelegate {
    static let shared = Speech()
    private let synth = AVSpeechSynthesizer()
    private var language = "de-DE"

    override init() { super.init(); synth.delegate = self }

    func speak(_ text: String, language tag: String) {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
        synth.stopSpeaking(at: .immediate)
        let u = AVSpeechUtterance(string: text)
        u.voice = AVSpeechSynthesisVoice(language: tag) ?? AVSpeechSynthesisVoice(language: String(tag.prefix(2)))
        NSLog("BMWCarPlay speech start lang=%@ voice=%@ chars=%d", tag, u.voice?.identifier ?? "none", text.count)
        synth.speak(u)
    }

    func stop() { synth.stopSpeaking(at: .immediate) }

    func speechSynthesizer(_ s: AVSpeechSynthesizer, willSpeakRangeOfSpeechString r: NSRange, utterance u: AVSpeechUtterance) {
        NSLog("BMWCarPlay willSpeakRange %d+%d of %d", r.location, r.length, u.speechString.count)
    }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) { NSLog("BMWCarPlay speech finished") }
}

extension Market {
    var speechTag: String { "\(language)-\(country)" }
}
