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

        static var allKeys: [String] { allCases.map { $0.key } }
    }

    let object: Any

    var objectAsDict: [String: Any]? {
        object as? [String: Any]
    }

    func value(of property: ObjectProperty) -> (Any, Int)? {
        guard let value = objectAsDict?.first(where: { $0.key.starts(with: property.key) }) else { return nil }
        return (value.value, Int(value.key.replacingOccurrences(of: property.key, with: "", options: .anchored)) ?? 0)
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
