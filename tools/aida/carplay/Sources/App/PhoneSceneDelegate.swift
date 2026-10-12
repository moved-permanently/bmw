import UIKit
import SwiftUI

class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = UIHostingController(rootView: CockpitView(session: Session.shared))
        self.window = window
        window.makeKeyAndVisible()
        Session.shared.start()
        for ctx in options.urlContexts { if let l = DeepLink.parse(ctx.url) { Session.shared.handle(l) } }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        for ctx in URLContexts { if let l = DeepLink.parse(ctx.url) { Session.shared.handle(l) } }
    }
}
