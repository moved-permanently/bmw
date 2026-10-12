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

    /// For scripts: opens article number `index`.
    func open(at index: Int) async {
        if let rows = try? await session.client.newsIndex(market: session.market), rows.indices.contains(index) { await openArticle(rows[index]) }
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
        prefetchSpeech(for: Array(rows.prefix(6)))
    }

    /// Asks the helper to render the first articles, so "Vorlesen" starts at once. The helper caches, so a later run costs nothing.
    private func prefetchSpeech(for rows: [NewsRow]) {
        let client = session.client, tag = session.market.speechTag
        Task {
            for row in rows {
                if let page = try? await client.page(path: row.path) { Speech.shared.prefetch(ArticleViewModel(page: page).speechText, language: tag) }
            }
        }
    }

    private func openArticle(_ row: NewsRow) async {
        guard let page = try? await session.client.page(path: row.path) else { return }
        let a = ArticleViewModel(page: page)
        let lang = session.language, tag = session.market.speechTag
        Speech.shared.prefetch(a.speechText, language: tag) // audio is ready by the time "Vorlesen" is pressed
        // The system shows two lines of an item and cuts the rest, so the text goes in as several short items.
        // The text comes first; the key/value facts (three at most) take the last items of the 10.
        let facts: [CPInformationItem] = a.pairs.prefix(3).map { CPInformationItem(title: $0.label, detail: $0.value) }
        let text = a.body.isEmpty ? a.teaser : a.body
        var items = TextFit.chunks(text, size: TextBudget.infoLine, limit: text.isEmpty ? 0 : 10 - facts.count).map { CPInformationItem(title: nil, detail: $0) }
        items += facts
        let actions = [
            CPTextButton(title: L10n.t(.read, lang), textStyle: .confirm) { _ in Speech.shared.speak(a.speechText, language: tag) },
            CPTextButton(title: L10n.t(.stop, lang), textStyle: .normal) { _ in Speech.shared.stop() },
        ]
        let t = CPInformationTemplate(title: a.title, layout: .leading, items: Array(items.prefix(10)), actions: actions)
        await MainActor.run { interface.pushTemplate(t, animated: true, completion: carplayLog) }
    }
}
