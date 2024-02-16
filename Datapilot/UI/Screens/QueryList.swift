//
//  QueryList.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI
import DylKit

class QueryListViewModel: ObservableObject {
	@UserDefaultable(key: "QUERIES") var queries: [Query] = []
}
struct QueryList: View {
	@StateObject var viewModel: QueryListViewModel = .init()
	
	var body: some View {
		List {
			ForEach(enumerated: viewModel.queries) { index, query in
				NavigationLink(query.displayTitle) {
					QueryView(query: .init(get: {
						query
					}, set: {
						viewModel.objectWillChange.send()
						viewModel.queries[index] = $0
					}))
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
