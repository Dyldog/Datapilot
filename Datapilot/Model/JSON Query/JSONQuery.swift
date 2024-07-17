//
//  JSONQuery.swift
//  Datapilot
//
//  Created by Dylan Elliott on 14/2/2024.
//

import JavaScriptCore

enum JSONQuery {
    static func query(_ queryString: String, in json: String) -> Any {
        let context = JSContext()!
        let scriptURL = Bundle.main.url(forResource: "jmespath", withExtension: "js")!
        let script: String
        do {
            script = try String(contentsOf: scriptURL)
        } catch {
            return "Error loading SMESPath script: \(error.localizedDescription)"
        }

        context.evaluateScript(script)
        let output = context.evaluateScript("jmespath.search(\(json), \"\(queryString)\")")
        return output?.toObject() as Any
    }
}
