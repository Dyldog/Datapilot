//
//  ObjectPropertyLens.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI

struct ObjectPropertyLens {
    enum ObjectProperty: String, CaseIterable {
        case title
        case subtitle
        case pretitle
        case posttitle
        case next
        case filter

        var key: String { "_\(rawValue)" }
        var pluralKey: String { "_\(rawValue)" }

        /// Initialises with a "key" of the form "_<RAW_VALUE>"
        init?(key: String) {
            self.init(rawValue: String(key.dropFirst()))
        }

        var isVisibleProperty: Bool {
            switch self {
            case .title, .subtitle, .pretitle, .posttitle:
                return true
            case .next, .filter:
                return false
            }
        }

        var defaultSize: Int {
            switch self {
            case .title: return 17
            case .subtitle: return 15
            case .pretitle, .posttitle: return 34
            // Non-label properties
            case .next, .filter: return 0
            }
        }

        var isBold: Bool {
            switch self {
            case .title: return true
            case .next, .filter: return false
            default: return false
            }
        }

        private static var allSingularKeys: [String] { allCases.map { $0.key } }
        private static var allPluralKeys: [String] { allCases.map { $0.key + "s" } }
        static var allKeys: [String] { allSingularKeys + allPluralKeys }
    }

    let object: Any

    var objectAsDict: [String: Any]? {
        object as? [String: Any]
    }

    func pluralValue(of property: ObjectProperty) -> ([Any], Int)? {
        guard let value = objectAsDict?.first(where: { $0.key.starts(with: property.pluralKey) }) else { return nil }
        guard let arrayValue = value.value as? [Any] else { return nil }
        return (arrayValue, Int(value.key.replacingOccurrences(of: property.key, with: "", options: .anchored)) ?? 0)
    }
    
    func value(of property: ObjectProperty) -> (Any, Int)? {
        guard let value = objectAsDict?.first(where: { $0.key.starts(with: property.key) }) else { return nil }
        return (value.value, Int(value.key.replacingOccurrences(of: property.key, with: "", options: .anchored)) ?? 0)
    }
}

extension Dictionary where Key == String {
    func objectProperties(visibleOnly: Bool = false) -> Self? {
        let props = filter { property in
            guard
                let key = ObjectPropertyLens.ObjectProperty(rawValue: String(property.key))
            else { return false }

            return visibleOnly ? key.isVisibleProperty : true
        }
        return props.keys.isEmpty ? nil : props
    }

    var hasObjectProperties: Bool { objectProperties() != nil }
    var hasVisibleProperties: Bool { objectProperties(visibleOnly: true) != nil }

    func filteringObjectProperties() -> Self {
        filter { !ObjectPropertyLens.ObjectProperty.allKeys.contains($0.key) }
    }
}

extension View {
    func styled(for property: ObjectPropertyLens.ObjectProperty, size: Int, isSublabel: Bool) -> some View {
        font(
            .system(size: CGFloat(property.defaultSize + size))
                .bold(!isSublabel && property == .title)
        )
    }
}
