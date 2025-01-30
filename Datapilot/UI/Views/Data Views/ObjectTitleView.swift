//
//  ObjectTitleView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI

struct ObjectTitleView: View {
    let lens: ObjectPropertyLens
    let index: Int?
    var object: Any { lens.object }
    let requestHeaders: [String: String]
    let isSubLabel: Bool

    init(object: Any, index: Int? = nil, requestHeaders: [String: String], isSubLabel: Bool = false) {
        self.requestHeaders = requestHeaders
        self.isSubLabel = isSubLabel
        self.index = index
        lens = .init(object: object)
    }

    @ViewBuilder
    var titleLabel: some View {
        if let (titles, size) = lens.pluralValue(of: .title) {
            VStack(alignment: .leading) {
                ForEach(titles) { title in
                    defaultTitle(for: title)
//                        .frame(maxWidth: .infinity)
                       .styled(for: .title, size: size, isSublabel: isSubLabel)
                }
            }
        } else {
            let (title, size) = lens.value(of: .title) ?? (object, 0)
            defaultTitle(for: title)
//                .frame(maxWidth: .infinity)
                .styled(for: .title, size: size, isSublabel: isSubLabel)
        }
    }

    func label(for property: ObjectPropertyLens.ObjectProperty) -> (some View)? {
        guard let (value, size) = lens.value(of: property) else { return AnyView?.none }
        return defaultTitle(for: value).styled(for: property, size: size, isSublabel: isSubLabel).any
    }

    var body: some View {
        HStack() {
            if let pretitleLabel = label(for: .pretitle) {
                pretitleLabel
            }

            VStack(alignment: isSubLabel ? .trailing : .leading) {
                titleLabel

                if let subtitleLabel = label(for: .subtitle) {
                    subtitleLabel
                }
            }

            if let postLabel = label(for: .posttitle) {
                Spacer()
                
                postLabel
                    .foregroundStyle(.gray)
                    .minimumScaleFactor(0.5)
            }
        }
//        .multilineTextAlignment(isSubLabel ? .trailing : .leading)
    }

    @ViewBuilder
    private func defaultTitle(for object: Any) -> some View {
        switch object {
        case let string as String:
            Text(string)
        case let array as [Any]:
            Text("\(array.count) items")
        case let dictionary as [String: Any]:
            Text(dictionary.titleValue ?? index.map { "Item \($0)" } ?? "No title found")
        case let url as URL:
            LazyValue(url: url, headers: requestHeaders) { value in
                ObjectTitleView(object: value, requestHeaders: requestHeaders).any
            }
        case let bool as Bool:
            Text(bool ? "true" : "false")
        case let float as Float:
            Text("\(float)")
        case let int as Int:
            Text("\(int)")
        case is NSNull:
            Text("null")
        default:
            Text("TODO")
        }
    }
}
