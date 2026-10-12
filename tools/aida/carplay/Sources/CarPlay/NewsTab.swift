import CarPlay
import UIKit

final class NewsTab {
    let interface: CPInterfaceController
    let template: CPListTemplate
    private let session = Session.shared

    init(interface: CPInterfaceController) {
        self.interface = interface
        template = CPListTemplate(title: L10n.t(.tabNews, Session.shared.language), sections: [])
        template.tabTitle = L10n.t(.tabNews, Session.shared.language)
        template.tabImage = Img.tab("newspaper.fill")
        template.trailingNavigationBarButtons = [CPBarButton(title: "↻") { _ in Session.shared.handle(.refresh) }]
    }

    func reload() async {
        let lang = session.language
        await MainActor.run { template.tabTitle = L10n.t(.tabNews, lang) }
        guard let rows = try? await session.client.newsIndex(market: session.market) else {
            await MainActor.run {
                template.updateSections([CPListSection(items: [CPListItem(text: L10n.t(.loadFailed, lang), detailText: nil)])])
            }
            return
        }
        let items: [CPListItem] = rows.prefix(max(1, min(CPListTemplate.maximumItemCount, 12))).map { row in
            // No thumbnail: it costs about 105 px of text width. Full text is on the article page.
            let title = TextFit.trim(row.title, max: TextBudget.listTitle)
            let item = CPListItem(text: title, detailText: TextFit.distinct(row.description, from: row.title))
            item.accessoryType = .disclosureIndicator
            item.handler = { [weak self] _, done in
                Task { await self?.openArticle(row); done() }
            }
            return item
        }
        await MainActor.run { template.updateSections([CPListSection(items: items)]) }
    }

    private func openArticle(_ row: NewsRow) async {
        guard let page = try? await session.client.page(path: row.path) else { return }
        let a = ArticleViewModel(page: page)
        let lang = session.language, tag = session.market.speechTag
        var items: [CPInformationItem] = []
        if !a.teaser.isEmpty { items.append(CPInformationItem(title: nil, detail: String(a.teaser.prefix(300)))) }
        items += a.pairs.prefix(8).map { CPInformationItem(title: $0.label, detail: $0.value) }
        let actions = [
            CPTextButton(title: L10n.t(.read, lang), textStyle: .confirm) { _ in Speech.shared.speak(a.speechText, language: tag) },
            CPTextButton(title: L10n.t(.stop, lang), textStyle: .normal) { _ in Speech.shared.stop() },
        ]
        let t = CPInformationTemplate(title: a.title, layout: .leading, items: Array(items.prefix(10)), actions: actions)
        await MainActor.run { interface.pushTemplate(t, animated: true, completion: carplayLog) }
    }
}
