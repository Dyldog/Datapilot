//
//  QueryList.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import Combine
import DylKit
import SwiftUI

struct QueryList: View {
    @StateObject var viewModel: QueryListViewModel = .init()

    var body: some View {
        List {
            ForEach(enumerated: viewModel.queries) { index, query in
                NavigationLink(query.displayTitle) {
                    QueryView(query: $viewModel.queries[index])
                }
            }
        }.toolbar {
            Button {
                viewModel.objectWillChange.send()
                viewModel.queries.append(.init(title: "", url: "", query: "", headers: [], method: .get, postBody: ""))
            } label: {
                Image(systemName: "plus")
            }
        }
    }
}
