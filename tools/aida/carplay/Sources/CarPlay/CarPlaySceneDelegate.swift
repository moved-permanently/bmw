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
}
