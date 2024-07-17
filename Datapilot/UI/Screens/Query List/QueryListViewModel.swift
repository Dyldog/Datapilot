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
}
