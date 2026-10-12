import CarPlay

class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    var interfaceController: CPInterfaceController?

    func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene,
                                  didConnect interfaceController: CPInterfaceController) {
        self.interfaceController = interfaceController
        let items = [
            CPListItem(text: "Der BMW i5. 100% elektrisch.", detailText: "aida/showcase/de/de/news/i5-launch"),
            CPListItem(text: "BMW Elektroautos.", detailText: "aida/showcase/de/de/e-mobility"),
            CPListItem(text: "513–627 km", detailText: "Max. Reichweite WLTP (wdh-de.json#61HG.electricRange)"),
        ]
        let section = CPListSection(items: items, header: "Spike: static items", sectionIndexTitle: nil)
        let list = CPListTemplate(title: "BMW", sections: [section])
        interfaceController.setRootTemplate(list, animated: true, completion: nil)
    }

    func templateApplicationScene(_ templateApplicationScene: CPTemplateApplicationScene,
                                  didDisconnectInterfaceController interfaceController: CPInterfaceController) {
        self.interfaceController = nil
    }
}
