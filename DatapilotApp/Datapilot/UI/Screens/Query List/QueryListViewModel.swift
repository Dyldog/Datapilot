//
//  QueryListViewModel.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import Combine
import DylKit
import SwiftUI

class QueryListViewModel: ObservableObject {
    @Published(key: "QUERIES") var queries: [Query] = []

    func addQuery() {
        objectWillChange.send()
        queries.append(.init(title: "", url: "", query: "", headers: [], method: .get, postBody: ""))
    }

    func deleteQuery(at index: Int) {
        queries.remove(at: index)
    }
}
