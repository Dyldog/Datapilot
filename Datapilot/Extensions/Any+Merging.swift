//
//  Any+Merging.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

func merging(_ lhs: Any, _ rhs: Any) -> Any {
    if let lhs = lhs as? [String: Any], let rhs = rhs as? [String: Any] {
        return lhs.merging(rhs) {
            merging($0, $1)
        }
    } else if let lhs = lhs as? [Any], let rhs = rhs as? [Any] {
        return lhs + rhs
    } else {
        return rhs
    }
}
