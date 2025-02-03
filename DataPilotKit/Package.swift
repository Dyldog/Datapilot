// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DataPilotKit",
    platforms: [.iOS(.v15)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "DataPilotKit",
            targets: ["DataPilotKit"]),
    ],
    dependencies: [
        .package(path: "../../DylKit")
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "DataPilotKit",
            dependencies: ["DylKit"],
            resources: [
                .process("JSON Query/jmespath.js"),
                .process("JSON Query/jmespath_extensions.js")
            ]
        ),
        .testTarget(
            name: "DataPilotKitTests",
            dependencies: ["DataPilotKit"]),
    ]
)
