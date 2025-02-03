//
//  Query.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

struct Query: Codable, Hashable, Equatable {
    var title: String
    var url: String
    var query: String
    var headers: [QueryHeader]
    var method: RequestMethod
    var postBody: String

    var displayTitle: String {
        title.isEmpty ? url : title
    }
}
