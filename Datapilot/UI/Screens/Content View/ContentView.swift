//
//  ContentView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DylKit

struct ContentView: View {
    @StateObject var viewModel: ContentViewModel
    @State var showDebug: Bool = false

    init(value: Any, sharedHeaders: [String: String], dataQuery: String?) {
        _viewModel = .init(
            wrappedValue: .init(
                value: urlified(value),
                sharedHeaders: sharedHeaders,
                dataQuery: dataQuery
            )
        )
    }

    @ViewBuilder
    var inner: some View {
        if let data = viewModel.data {
            ObjectView(data: data, requestHeaders: viewModel.sharedHeaders, searchText: $viewModel.searchText, loadNextPage: viewModel.tryLoadNextPage)
        } else {
            loadingView
        }
    }

    var body: some View {
        inner.if((viewModel.data as? [String: Any])?.titleValue) { view, title in
            view.navigationTitle(Text(title))
        }
        .toolbar {
            Button(systemName: "ant.fill") { showDebug = true }
        }
        .sheet(isPresented: $showDebug) {
            ObjectDebugView(object: viewModel.data as Any)
        }
    }

    var loadingView: some View {
        VStack {
            ProgressView()
                .progressViewStyle(.circular)
        }
    }
}

#Preview {
    ContentView(value: "Hello", sharedHeaders: [:], dataQuery: nil)
}
