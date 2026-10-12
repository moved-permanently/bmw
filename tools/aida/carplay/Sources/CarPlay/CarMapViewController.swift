import MapKit
import UIKit

/// The map on the car screen (navigation entitlement: the car window is ours). The dot stays at one spot
/// while the map moves under it.
final class CarMapViewController: UIViewController, MKMapViewDelegate {
    private let map = MKMapView()
    private let session = Session.shared
    private var annotations: [String: MKPointAnnotation] = [:]
    private var latitudinalMeters: CLLocationDistance = 3000
    private(set) var dot = CGPoint.zero

    override func viewDidLoad() {
        super.viewDidLoad()
        view.clipsToBounds = true
        map.delegate = self
        map.showsUserLocation = true
        map.isRotateEnabled = false
        map.isPitchEnabled = false
        map.pointOfInterestFilter = .excludingAll
        map.overrideUserInterfaceStyle = .dark
        view.addSubview(map)
        centre(animated: false)
        reloadPlaces()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        dot = MapLayout.dotPoint(free: view.safeAreaLayoutGuide.layoutFrame)
        map.frame = MapLayout.mapFrame(bounds: view.bounds, dot: dot)
        centre(animated: false)
    }

    /// Called for every location change: put the session position under the dot.
    /// The user tracking mode is not used, because it re-centres on the map's own location manager
    /// and drops out whenever the camera is set from code.
    func centre(animated: Bool) {
        let c = CLLocationCoordinate2D(latitude: session.lat, longitude: session.lon)
        let region = MKCoordinateRegion(center: c, latitudinalMeters: latitudinalMeters, longitudinalMeters: latitudinalMeters)
        map.setRegion(region, animated: animated)
    }

    func zoom(by factor: Double) {
        latitudinalMeters = min(max(latitudinalMeters * factor, 300), 600_000)
        centre(animated: true)
    }

    func reloadPlaces() {
        guard isViewLoaded else { return }
        let paths = Set(session.places.map(\.path))
        for (p, a) in annotations where !paths.contains(p) { map.removeAnnotation(a); annotations[p] = nil }
        for row in session.places where annotations[row.path] == nil {
            let a = MKPointAnnotation()
            a.coordinate = CLLocationCoordinate2D(latitude: row.lat, longitude: row.lon)
            a.title = TextFit.shortPlaceName(row.name).title
            map.addAnnotation(a)
            annotations[row.path] = a
        }
    }

    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        guard annotation is MKPointAnnotation else { return nil }
        let v = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "place")
        v.markerTintColor = UIColor(red: 0.11, green: 0.41, blue: 0.82, alpha: 1)
        v.glyphImage = UIImage(systemName: "mappin")
        v.displayPriority = .required
        return v
    }
}
