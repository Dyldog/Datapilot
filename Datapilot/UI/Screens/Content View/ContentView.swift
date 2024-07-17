//
//  ContentView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

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
            VStack {
                loadingView
            }
        }
    }

    var body: some View {
        inner.if((viewModel.data as? [String: Any])?.titleValue) { view, title in
            view.navigationTitle(Text(title))
        }
        .toolbar {
            Button {
                showDebug = true
            } label: {
                Image(systemName: "ant.fill")
            }
        }
        .sheet(isPresented: $showDebug) {
            ObjectDebugView(object: viewModel.data as Any)
        }
    }

    var loadingView: some View {
        ProgressView()
            .progressViewStyle(.circular)
    }

    func chevroned<T: View>(_ view: T) -> AnyView {
        return HStack {
            view
            #if canImport(UIKit)
            #else
                Image(systemName: "chevron.right")
            #endif
        }.any
    }
}

#Preview {
    ContentView(value: "Hello", sharedHeaders: [:], dataQuery: nil)
}
