//
//  ContentView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DylKit

public struct DataPilotView: View {
    @StateObject var viewModel: DataPilotViewModel
    
    let showDebugButton: Bool
    @State var showDebug: Bool = false

    public init(
        value: Any,
        sharedHeaders: [String: String] = [:],
        dataQuery: String?,
        showDebugButton: Bool = true
    ) {
        _viewModel = .init(
            wrappedValue: .init(
                value: urlified(value),
                sharedHeaders: sharedHeaders,
                dataQuery: dataQuery
            )
        )
        
        self.showDebugButton = showDebugButton
    }

    @ViewBuilder
    var inner: some View {
        if let data = viewModel.data {
            ObjectView(data: data, requestHeaders: viewModel.sharedHeaders, searchText: $viewModel.searchText, loadNextPage: viewModel.tryLoadNextPage)
        } else {
            loadingView
        }
    }

    public var body: some View {
        inner.if((viewModel.data as? [String: Any])?.titleValue) { view, title in
            view.navigationTitle(Text(title))
        }
        .toolbar {
            if showDebugButton {
                Button(systemName: "ant.fill") { showDebug = true }
            }
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
    DataPilotView(value: "Hello", sharedHeaders: [:], dataQuery: nil)
}
