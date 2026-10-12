import UIKit
import CarPlay

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    /// Darwin notifications as a second way in for the demo scripts: iOS 18 asks "Open in BMW?" on the phone for every
    /// simctl openurl, which nobody can answer from a shell. `xcrun simctl spawn <udid> notifyutil -p
    /// com.adobe.aida.BMWCarPlay.tab0` (tab1, tab2) opens a list on the car, `.map` goes back to the map.
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        for (name, index) in [("tab0", 0), ("tab1", 1), ("tab2", 2), ("map", -1), ("news0", 10), ("news1", 11), ("news2", 12), ("news3", 13)] {
            let full = "com.adobe.aida.BMWCarPlay.\(name)" as CFString
            CFNotificationCenterAddObserver(CFNotificationCenterGetDarwinNotifyCenter(), nil, { _, _, name, _, _ in
                let n = (name?.rawValue as String?) ?? ""
                let i = n.hasSuffix(".map") ? -1 : n.contains(".news") ? 10 + (Int(n.suffix(1)) ?? 0) : Int(n.suffix(1)) ?? -1
                DispatchQueue.main.async { Session.shared.handle(.tab(i)) }
            }, full, nil, .deliverImmediately)
            _ = index
        }
        return true
    }

    func application(_ application: UIApplication,
                     configurationForConnecting session: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        if session.role == .carTemplateApplication {
            let config = UISceneConfiguration(name: "CarPlay", sessionRole: session.role)
            config.delegateClass = CarPlaySceneDelegate.self
            return config
        }
        let config = UISceneConfiguration(name: "Phone", sessionRole: session.role)
        config.delegateClass = PhoneSceneDelegate.self
        return config
    }
}
