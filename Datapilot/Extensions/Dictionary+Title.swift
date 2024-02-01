//
//  Dictionary+Title.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation

extension Dictionary where Key == String {
    func sanitisedKey(for key: String) -> String {
        return key.lowercased()
            .replacingOccurrences(of: " ", with: "")
            .replacingOccurrences(of: "_", with: "")
    }
    var titleValue: String? {
        let mapped = self.reduce(into: [:], { $0[sanitisedKey(for: $1.key)] = $1.value })
        return (mapped["title"] ?? mapped["name"] ?? mapped["id"]) as? String
    }
}
