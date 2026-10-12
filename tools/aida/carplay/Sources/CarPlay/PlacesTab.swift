import CarPlay
import MapKit
import UIKit

final class PlacesTab {
    let interface: CPInterfaceController
    let template: CPListTemplate
    private let session = Session.shared
    private var models: [String: PlaceViewModel] = [:]   // by path
    private var renderedKey = ""
    /// Receives the same rows as the list, for the panel drawn next to the map.
    var onRows: (([PanelRow]) -> Void)?

    init(interface: CPInterfaceController) {
        self.interface = interface
        template = CPListTemplate(title: L10n.t(.tabPlaces, Session.shared.language), sections: [])
        template.tabTitle = L10n.t(.tabPlaces, Session.shared.language)
        template.tabImage = Img.tab("mappin.and.ellipse")
    }

    func reload() async {
        if let rows = try? await session.client.places(), !rows.isEmpty { session.places = rows }
        let rows = Array(session.places.prefix(12))
        var built: [String: PlaceViewModel] = [:]
        await withTaskGroup(of: PlaceViewModel?.self) { group in
            for r in rows {
                group.addTask { [client = session.client] in
                    guard let page = try? await client.page(path: r.path) else { return nil }
                    return PlaceViewModel(row: r, page: page)
                }
            }
            for await vm in group { if let vm { built[vm.row.path] = vm } }
        }
        models = built
        await MainActor.run { renderedKey = ""; render() }
    }

    /// Called when the car moves. The list is an ordinary list template here, so it can refresh on every
    /// change of a visible distance or of the order. The map is ours and keeps following on its own.
    func moved() { render() }

    func render() {
        let lang = session.language
        template.tabTitle = L10n.t(.tabPlaces, lang)
        let sorted = Geo.sorted(session.places, lat: session.lat, lon: session.lon)
        var rows: [(row: PlaceRow, vm: PlaceViewModel, dist: String)] = []
        for row in sorted.prefix(12) {
            guard let vm = models[row.path] else { continue }
            let km = Geo.distance(row, lat: session.lat, lon: session.lon)
            rows.append((row, vm, TextFit.distance(km: km, locale: session.market.locale)))
        }
        // Skip the IPC call when nothing visible changed.
        let key = lang + "|" + rows.map { "\($0.row.path)=\($0.dist)" }.joined(separator: ";")
        guard key != renderedKey else { return }
        renderedKey = key
        onRows?(rows.map { r in
            let short = TextFit.shortPlaceName(r.row.name)
            return PanelRow(title: short.title, distance: r.dist, detail: TextFit.trim(short.place ?? r.vm.headline, max: 16))
        })
        let items: [CPListItem] = rows.map { r in
            // Short name, then the distance first and the place (or the page headline).
            let short = TextFit.shortPlaceName(r.row.name)
            let item = CPListItem(text: short.title, detailText: TextFit.placeSubtitle(distance: r.dist, extra: short.place ?? r.vm.headline))
            item.accessoryType = .disclosureIndicator
            item.handler = { [weak self] _, done in self?.showPage(r.vm, distance: r.dist); done() }
            return item
        }
        template.updateSections([CPListSection(items: items)])
    }

    private func speak(_ vm: PlaceViewModel) {
        // Place pages exist in German only.
        Speech.shared.speak(vm.speechText, language: "de-DE")
    }

    /// Long text goes into an information template: it wraps, a list row would cut it.
    private func showPage(_ vm: PlaceViewModel, distance: String) {
        let lang = session.language
        // The system shows two lines of an item and cuts the rest: distance and headline first, the text as short items.
        var items = [CPInformationItem(title: L10n.t(.away, lang, distance), detail: vm.headline)]
        let text = vm.speechText.split(separator: "\n").dropFirst().map(String.init).joined(separator: " ")
        items += TextFit.chunks(text.isEmpty ? vm.lead : text, size: TextBudget.infoLine, limit: 10 - items.count)
            .map { CPInformationItem(title: nil, detail: $0) }
        let actions = [
            CPTextButton(title: L10n.t(.read, lang), textStyle: .confirm) { [weak self] _ in self?.speak(vm) },
            CPTextButton(title: L10n.t(.stop, lang), textStyle: .normal) { _ in Speech.shared.stop() },
        ]
        let t = CPInformationTemplate(title: vm.name, layout: .leading, items: items, actions: actions)
        interface.pushTemplate(t, animated: true, completion: carplayLog)
    }

    func alert(for row: PlaceRow) {
        let lang = session.language
        Task {
            var vm = models[row.path]
            if vm == nil, let page = try? await session.client.page(path: row.path) { vm = PlaceViewModel(row: row, page: page) }
            let headline = vm?.headline ?? row.name
            await MainActor.run {
                // One template at a time: a second presentation raises inside CarPlay.
                guard interface.presentedTemplate == nil else { return }
                let read = CPAlertAction(title: L10n.t(.read, lang), style: .default) { [weak self] _ in
                    self?.interface.dismissTemplate(animated: true, completion: carplayLog)
                    if let vm { self?.speak(vm) }
                }
                let later = CPAlertAction(title: L10n.t(.later, lang), style: .cancel) { [weak self] _ in
                    self?.interface.dismissTemplate(animated: true, completion: carplayLog)
                }
                let a = CPAlertTemplate(titleVariants: ["\(row.name): \(headline)", row.name], actions: [read, later])
                interface.presentTemplate(a, animated: true, completion: carplayLog)
                // The alert must not block the tabs for good; drop it after 12 s if nobody answered.
                DispatchQueue.main.asyncAfter(deadline: .now() + 12) { [weak self] in
                    if self?.interface.presentedTemplate === a { self?.interface.dismissTemplate(animated: true, completion: carplayLog) }
                }
            }
        }
    }
}
