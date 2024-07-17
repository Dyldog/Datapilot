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
            }.onDelete { indexes in
                indexes.forEach { viewModel.deleteQuery(at: $0) }
            }
        }.toolbar {
            Button {
                viewModel.addQuery()
            } label: {
                Image(systemName: "plus")
            }
        }
    }
}
