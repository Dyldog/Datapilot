//
//  ObjectView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI

struct ObjectView: View {
    let data: Any
    let requestHeaders: [String: String]
    let searchText: Binding<String>?
    let loadNextPage: () -> Void

    @ViewBuilder
    var body: some View {
        switch data {
        case let array as [Any] where array.count == 1 && (searchText?.wrappedValue ?? "").isEmpty:
            ObjectView(data: urlified(array[0]), requestHeaders: requestHeaders, searchText: searchText, loadNextPage: {})
        case let array as [Any]:
            ObjectListView(
                data: array,
                requestHeaders: requestHeaders,
                loadNextPage: loadNextPage,
                searchText: searchText
            ) { value in
                NavigationLink {
                    DataPilotView(
                        value: urlified(value),
                        sharedHeaders: requestHeaders,
                        dataQuery: nil // Pretty sure this should be nil
                    )
                } label: {
                    ObjectTitleView(object: urlified(value), requestHeaders: requestHeaders)
                }
            }
        case let dictionary as [String: Any]:
            VStack(spacing: 0) {
                if dictionary.hasVisibleProperties {
                    ObjectTitleView(object: dictionary, requestHeaders: requestHeaders)
                        .padding(.horizontal).padding(.bottom)
                }

                if dictionary.filteringObjectProperties().keys.count == 1 {
                    ObjectView(
                        data: urlified(dictionary.filteringObjectProperties().values.first!),
                        requestHeaders: requestHeaders,
                        searchText: searchText,
                        loadNextPage: loadNextPage
                    )
                } else {
                    ObjectListView(
                        data: dictionary.filteringObjectProperties().map { ($0, $1) },
                        requestHeaders: requestHeaders,
                        loadNextPage: loadNextPage,
                        searchText: searchText
                    ) { key, value in
                        ObjectRowView(title: key, content: urlified(value), requestHeaders: requestHeaders)
                    }
                }
                Spacer()
            }
        case let url as URL:
            LazyValue(url: url, headers: requestHeaders) { value in
                ObjectView(data: value, requestHeaders: requestHeaders, searchText: searchText, loadNextPage: loadNextPage)
            }
        case Optional<Any>.none:
            Text("Got nil")
        default:
            ObjectTitleView(object: data, requestHeaders: requestHeaders)
        }
    }
}
