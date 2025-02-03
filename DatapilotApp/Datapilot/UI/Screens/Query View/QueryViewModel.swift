//
//  QueryViewModel.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

class QueryViewModel: ObservableObject {
    var query: Binding<Query>

    init(query: Binding<Query>) {
        self.query = query
    }
}
