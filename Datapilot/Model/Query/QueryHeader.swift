//
//  QueryHeader.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

struct QueryHeader: Codable, Hashable {
    let key: String
    let value: String
    let isShared: Bool
}
