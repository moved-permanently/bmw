import UIKit

class PhoneSceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        let window = UIWindow(windowScene: windowScene)
        let vc = UIViewController()
        vc.view.backgroundColor = .systemBackground
        let label = UILabel()
        label.text = "BMW CarPlay spike\nOpen Simulator > I/O > External Displays > CarPlay"
        label.numberOfLines = 0
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        vc.view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: vc.view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: vc.view.centerYAnchor),
            label.leadingAnchor.constraint(equalTo: vc.view.leadingAnchor, constant: 24),
            label.trailingAnchor.constraint(equalTo: vc.view.trailingAnchor, constant: -24),
        ])
        window.rootViewController = vc
        self.window = window
        window.makeKeyAndVisible()
    }
}
