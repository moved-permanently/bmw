import CarPlay
import MapKit
import UIKit

final class PlacesTab {
    let interface: CPInterfaceController
    let template: CPPointOfInterestTemplate
    private let session = Session.shared
    private var models: [String: PlaceViewModel] = [:]   // by path
    private var images: [String: UIImage] = [:]
    private var renderedAt: (lat: Double, lon: Double)?
    private var renderedOrder: [String] = []

    init(interface: CPInterfaceController) {
        self.interface = interface
        template = CPPointOfInterestTemplate(title: L10n.t(.tabPlaces, Session.shared.language), pointsOfInterest: [], selectedIndex: NSNotFound)
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
        var imgs: [String: UIImage] = [:]
        for (p, vm) in built { if let img = await session.client.image(Img.scene7(vm.image, width: 120)) { imgs[p] = img } }
        images = imgs
        await MainActor.run { render() }
    }

    /// Called when the car moves. Setting the points of interest resets the map's location tracking,
    /// so refresh only when the order changes or the car has moved about 5 km.
    func moved() {
        guard let r = renderedAt else { return }
        let now = Geo.sorted(session.places, lat: session.lat, lon: session.lon).map(\.path)
        let moved = Geo.distanceKm(lat1: r.lat, lon1: r.lon, lat2: session.lat, lon2: session.lon)
        if now != renderedOrder || moved >= 5 { render() }
    }

    func render() {
        renderedAt = (session.lat, session.lon)
        renderedOrder = Geo.sorted(session.places, lat: session.lat, lon: session.lon).map(\.path)
        let lang = session.language
        template.tabTitle = L10n.t(.tabPlaces, lang)
        let sorted = Geo.sorted(session.places, lat: session.lat, lon: session.lon)
        let pois: [CPPointOfInterest] = sorted.compactMap { row in
            guard let vm = models[row.path] else { return nil }
            let km = Geo.distance(row, lat: session.lat, lon: session.lon)
            let dist = TextFit.distance(km: km, locale: session.market.locale)
            let away = L10n.t(.away, lang, dist)
            let item = MKMapItem(placemark: MKPlacemark(coordinate: CLLocationCoordinate2D(latitude: row.lat, longitude: row.lon)))
            item.name = row.name
            // List row: short name, then the distance first and the place (or the page headline). The card has more room.
            let short = TextFit.shortPlaceName(row.name)
            let subtitle = TextFit.placeSubtitle(distance: dist, extra: short.place ?? vm.headline)
            let summary = TextBudget.poiRowShowsSummary ? TextFit.trim(vm.headline, max: TextBudget.poiSubtitle) : nil
            let poi = CPPointOfInterest(location: item, title: short.title, subtitle: subtitle, summary: summary,
                                        detailTitle: row.name, detailSubtitle: "\(away) · \(vm.headline)",
                                        detailSummary: TextFit.trim(vm.lead, max: TextBudget.poiCardSummary),
                                        pinImage: images[row.path])
            poi.primaryButton = CPTextButton(title: L10n.t(.read, lang), textStyle: .confirm) { [weak self] _ in self?.speak(vm) }
            poi.secondaryButton = CPTextButton(title: L10n.t(.more, lang), textStyle: .normal) { [weak self] _ in self?.showPage(vm) }
            return poi
        }
        template.setPointsOfInterest(Array(pois.prefix(12)), selectedIndex: NSNotFound)
    }

    private func speak(_ vm: PlaceViewModel) {
        // Place pages exist in German only.
        Speech.shared.speak(vm.speechText, language: "de-DE")
    }

    /// Long text goes into an information template: it wraps, a list row would cut it.
    private func showPage(_ vm: PlaceViewModel) {
        let lang = session.language
        var items = [CPInformationItem(title: vm.headline, detail: TextFit.trim(vm.lead, max: TextBudget.infoItem))]
        for line in vm.speechText.split(separator: "\n").dropFirst() where items.count < 5 {
            let text = TextFit.trim(String(line), max: TextBudget.infoItem)
            if text != items[0].detail, text != vm.lead { items.append(CPInformationItem(title: nil, detail: text)) }
        }
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
