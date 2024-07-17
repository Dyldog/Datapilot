//
//  ObjectRowView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI

struct ObjectRowView: View {
    let title: String
    let content: Any
    let requestHeaders: [String: String]

    var body: some View {
        func simpleRow() -> AnyView {
            HStack {
                ObjectTitleView(object: title, requestHeaders: requestHeaders)
                ObjectTitleView(object: content, requestHeaders: requestHeaders, isSubLabel: true)
            }.any
        }

        func link() -> AnyView {
            return NavigationLink(destination: {
                ContentView(value: content, sharedHeaders: requestHeaders, dataQuery: nil)
            }, label: {
                HStack {
                    simpleRow()
                    #if canImport(UIKit)
                    #else
                        Image(systemName: "chevron.right")
                    #endif
                }
            }).any
        }

        if isContainer(content) {
            return isNonEmptyContainer(content) ? link() : simpleRow()
        } else if content is URL {
            return link()
        } else {
            return simpleRow()
        }
    }
}
