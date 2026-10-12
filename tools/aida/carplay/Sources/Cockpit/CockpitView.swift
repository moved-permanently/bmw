import SwiftUI

struct CockpitView: View {
    @ObservedObject var session: Session
    @State private var soc: Double = 62
    @State private var odo: Int = 12_400

    private var state: VehicleState { session.state }

    var body: some View {
        NavigationStack {
            Form {
                Section("Fahrzeug") {
                    LabeledContent("Modell", value: "BMW i5 eDrive40 (\(state.model))")
                    VStack(alignment: .leading) {
                        Text("Ladestand \(Int(soc)) %")
                        Slider(value: $soc, in: 0...100, step: 1)
                            .onChange(of: soc) { _, v in state.soc = Int(v) }
                    }
                    Stepper("Kilometerstand \(odo) km", value: $odo, in: 0...300_000, step: 100)
                        .onChange(of: odo) { _, v in state.odometerKm = v }
                }
                Section("Sprache und Markt") {
                    Picker("Sprache", selection: Binding(get: { state.language }, set: { state.language = $0 })) {
                        Text("Deutsch").tag("de"); Text("Français").tag("fr")
                    }
                    Picker("Markt", selection: Binding(get: { state.marketOverride?.rawValue ?? "auto" },
                                                       set: { state.marketOverride = Market(folder: $0) })) {
                        Text("Automatisch (Position)").tag("auto")
                        ForEach(Market.allCases, id: \.rawValue) { Text($0.folder).tag($0.rawValue) }
                    }
                }
                Section("Status") {
                    LabeledContent("Dokumente", value: "/aida/showcase/\(session.market.folder)/")
                    LabeledContent("Land (Position)", value: session.country ?? "–")
                    LabeledContent("Position", value: String(format: "%.4f, %.4f%@", session.lat, session.lon, session.hasFix ? "" : " (Standard)"))
                    if session.skippedBlocks > 0 { Text("\(session.skippedBlocks) Blöcke nicht dargestellt").foregroundStyle(.secondary) }
                    ForEach(session.status, id: \.self) { Text($0).foregroundStyle(.secondary) }
                }
                Section {
                    Button("Aktualisieren") { session.handle(.refresh) }
                    Button("Zurücksetzen", role: .destructive) { session.reset(); soc = 62; odo = 12_400 }
                }
            }
            .navigationTitle("BMW CarPlay")
        }
        .onAppear { soc = Double(state.soc); odo = state.odometerKm }
        .onReceive(NotificationCenter.default.publisher(for: .vehicleChanged)) { _ in
            soc = Double(state.soc); odo = state.odometerKm
        }
    }
}
