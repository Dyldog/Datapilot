//
//  ObjectListView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI

struct ObjectListView<T, Content: View>: View {
    let data: [T]
    let requestHeaders: [String: String]
    let loadNextPage: () -> Void
    let searchText: Binding<String>?
    let cellFactory: (T) -> Content

    var body: some View {
        List {
            ForEach(enumerated: data) { index, element in
                view(for: element, at: index)
            }

            Text("END \(Emoji.random)").onAppear {
                loadNextPage()
            }
        }.ifLet(searchText) { view, searchText in
            view.searchable(text: searchText)
        }
        .listStyle(.plain)
    }

    @ViewBuilder
    func view(for element: T, at index: Int) -> some View {
        if isContainer(element) {
            if isEmptyContainer(element) {
                ObjectTitleView(object: element, requestHeaders: requestHeaders)
            } else {
                NavigationLink(destination: {
                    ContentView(value: element, sharedHeaders: requestHeaders, dataQuery: nil)
                }, label: {
                    HStack {
                        ObjectTitleView(object: element, index: index, requestHeaders: requestHeaders)
                        Spacer()
                        #if canImport(UIKit)
                        #else
                            Image(systemName: "chevron.right")
                        #endif
                    }
                })
            }
        } else {
            cellFactory(element)
        }
    }
}

extension View {
    @ViewBuilder
    func ifLet<T>(_ optional: T?, work: (Self, T) -> some View) -> some View {
        if let optional {
            work(self, optional)
        } else {
            self
        }
    }
}
