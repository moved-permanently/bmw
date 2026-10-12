import Foundation

/// The only strings the app owns. Everything else is page text.
enum L10n {
    enum Key: CaseIterable {
        case tabPlaces, tabCar, tabNews, refresh, rangeNow, atCharge, techData, moreModels, read, stop,
             nearby, away, more, later, legal, allValues, loadFailed, nearAlert
    }

    static let table: [String: [Key: String]] = [
        "de": [.tabPlaces: "Orte", .tabCar: "Mein BMW", .tabNews: "News", .refresh: "Aktualisieren",
               .rangeNow: "Reichweite jetzt", .atCharge: "bei %d %% Ladung", .techData: "Technische Daten",
               .moreModels: "Weitere Modelle", .read: "Vorlesen", .stop: "Stopp", .nearby: "In der Nähe",
               .away: "%@ entfernt", .more: "Mehr", .later: "Später", .legal: "Rechtliches",
               .allValues: "Alle Werte", .loadFailed: "Inhalt nicht erreichbar", .nearAlert: "In der Nähe: %@"],
        "fr": [.tabPlaces: "Lieux", .tabCar: "Ma BMW", .tabNews: "Actualités", .refresh: "Actualiser",
               .rangeNow: "Autonomie actuelle", .atCharge: "à %d %% de charge", .techData: "Données techniques",
               .moreModels: "Autres modèles", .read: "Lire", .stop: "Stop", .nearby: "À proximité",
               .away: "à %@", .more: "Plus", .later: "Plus tard", .legal: "Mentions légales",
               .allValues: "Toutes les valeurs", .loadFailed: "Contenu indisponible", .nearAlert: "À proximité : %@"],
    ]

    static func t(_ key: Key, _ lang: String, _ args: CVarArg...) -> String {
        let f = table[lang]?[key] ?? table["de"]![key]!
        return args.isEmpty ? f : String(format: f, arguments: args)
    }
}
