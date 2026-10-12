import CarPlay
import UIKit

/// Navigation entitlement: the car screen has a window of its own, and the app draws the map in it.
class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    var controller: CarController?

    func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene,
                                  didConnect interfaceController: CPInterfaceController,
                                  to window: CPWindow) {
        let map = CarMapViewController()
        window.rootViewController = map
        let c = CarController(interface: interfaceController, mapController: map)
        controller = c
        c.start()
    }

    func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene,
                                  didDisconnectInterfaceController interfaceController: CPInterfaceController,
                                  from window: CPWindow) {
        controller?.stop()
        controller = nil
    }

    /// iOS 18 delivers a bmwcarplay:// link to the scene on top, which is the car scene while it is showing.
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        for ctx in URLContexts { if let l = DeepLink.parse(ctx.url) { Session.shared.handle(l) } }
    }
}
