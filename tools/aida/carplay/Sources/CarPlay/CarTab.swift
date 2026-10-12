import CarPlay
import UIKit

final class CarTab {
    let interface: CPInterfaceController
    let template: CPListTemplate
    private let session = Session.shared
    private(set) var vm: CarViewModel?
    private var stale = false
    private var failed = false
    private var heroItem: CPListItem?
    private(set) var skipped = 0

    init(interface: CPInterfaceController) {
        self.interface = interface
        template = CPListTemplate(title: L10n.t(.tabCar, Session.shared.language), sections: [])
        template.tabTitle = L10n.t(.tabCar, Session.shared.language)
        template.tabImage = Img.tab("car.fill")
        template.trailingNavigationBarButtons = [CPBarButton(title: "↻") { _ in
            Session.shared.handle(.refresh)
        }]
    }

    private var path: String { "/aida/showcase/\(session.market.folder)/i5" }

    func reload() async {
        do {
            let r = try await session.client.page(path: path, fallbackToCache: true)
            vm = CarViewModel(page: r.page); stale = r.stale; failed = false
        } catch { failed = true; NSLog("BMWCarPlay car load failed: %@", "\(error)") }
        await MainActor.run { skipped = vm?.skippedBlocks ?? 0; render() }
        if let url = Img.scene7(vm?.heroImage, width: 160), let img = await session.client.image(url) {
            await MainActor.run { heroItem?.setImage(img) }
        }
    }

    func render() {
        let lang = session.language
        template.tabTitle = L10n.t(.tabCar, lang) + (stale ? " ·" : "")
        guard let vm else {
            template.updateSections([CPListSection(items: [CPListItem(text: L10n.t(.loadFailed, lang), detailText: path)])])
            return
        }
        var sections: [CPListSection] = []
        if let now = vm.rangeNow(soc: session.state.soc, locale: session.market.locale) {
            let item = CPListItem(text: now.value,
                                  detailText: L10n.t(.atCharge, lang, session.state.soc) + " · WLTP " + now.wltp)
            sections.append(CPListSection(items: [item], header: L10n.t(.rangeNow, lang), sectionIndexTitle: nil))
        }
        let hero = CPListItem(text: vm.headline ?? vm.title, detailText: vm.lead)
        heroItem = hero
        sections.append(CPListSection(items: [hero]))
        var kpiItems = vm.kpis.map { CPListItem(text: $0.label, detailText: $0.value) }
        let all = CPListItem(text: L10n.t(.allValues, lang), detailText: nil)
        all.accessoryType = .disclosureIndicator
        all.handler = { [weak self] _, done in self?.pushValues(); done() }
        kpiItems.append(all)
        sections.append(CPListSection(items: kpiItems, header: L10n.t(.techData, lang), sectionIndexTitle: nil))
        if !vm.models.isEmpty {
            let items = vm.models.map { CPListItem(text: $0.name, detailText: $0.priceLine) }
            sections.append(CPListSection(items: items, header: L10n.t(.moreModels, lang), sectionIndexTitle: nil))
        }
        template.updateSections(sections)
    }

    private func pushValues() {
        guard let vm else { return }
        let lang = session.language
        var items = vm.kpis.map { CPInformationItem(title: $0.label, detail: $0.value) }
        if let now = vm.rangeNow(soc: session.state.soc, locale: session.market.locale) {
            items.insert(CPInformationItem(title: L10n.t(.rangeNow, lang), detail: now.value), at: 0)
        }
        if let d = vm.disclaimer { items.append(CPInformationItem(title: L10n.t(.legal, lang), detail: String(d.prefix(300)))) }
        let t = CPInformationTemplate(title: vm.title, layout: .leading, items: Array(items.prefix(10)), actions: [])
        interface.pushTemplate(t, animated: true, completion: nil)
    }

    /// bmwcarplay://open?path=… pushes any showcase page as a list.
    func open(path: String) async {
        guard let page = try? await session.client.page(path: path) else { return }
        let a = ArticleViewModel(page: page)
        let items = ([a.teaser] + a.pairs.map { "\($0.label): \($0.value)" }).filter { !$0.isEmpty }.map { CPListItem(text: $0, detailText: nil) }
        let t = CPListTemplate(title: a.title, sections: [CPListSection(items: items)])
        await MainActor.run { interface.pushTemplate(t, animated: true, completion: nil) }
    }
}
