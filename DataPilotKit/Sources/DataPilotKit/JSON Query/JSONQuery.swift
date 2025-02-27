//
//  JSONQuery.swift
//  Datapilot
//
//  Created by Dylan Elliott on 14/2/2024.
//

import Foundation
import JavaScriptCore

enum JSONQuery {
    static func query(_ queryString: String, in json: String) -> Any {
        let context = JSContext()!
        
        do {
            try context.addScript("jmespath")
            try context.addScript("jmespath_extensions")
        } catch {
            return "Error loading script: \(error.localizedDescription)"
        }
        
        let output = context.evaluateScript("jmespath.search(\(json), \"\(queryString.querySanitised)\")")
        return output?.toObject() as Any
    }
}

private extension String {
    var querySanitised: String {
        components(separatedBy: .whitespacesAndNewlines).joined(separator: " ")
    }
}
private extension JSContext {
    func addScript(_ name: String) throws {
        let scriptURL = Bundle.module.url(forResource: name, withExtension: "js")!
        let script: String = try String(contentsOf: scriptURL)
        evaluateScript(script)
    }
}
