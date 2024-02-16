//
//  RequestMethod.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation

enum RequestMethod: Hashable, CaseIterable, Codable {
    case get
    case post
    case put
    case delete
    
    var title: String {
        switch self {
        case .get: return "GET"
        case .post: return "POST"
        case .put: return "PUT"
        case .delete: return "DELETE"
        }
    }
}
