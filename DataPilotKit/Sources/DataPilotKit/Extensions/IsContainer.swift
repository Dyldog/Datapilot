//
//  IsContainer.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation

func isContainer(_ value: Any) -> Bool {
    if value is [Any] {
        return true
    } else if value is NSDictionary {
        return true
    } else if value is [String: Any] {
        return true
    } else {
        return false
    }
}

func isNonEmptyContainer(_ value: Any) -> Bool {
    if let value = value as? [Any] {
        return !value.isEmpty
    } else if let value = value as? NSDictionary {
        return !(value.count == 0)
    } else if let value = value as? [String: Any] {
        return !value.isEmpty
    } else {
        return false
    }
}

func isEmptyContainer(_ value: Any) -> Bool {
    !isNonEmptyContainer(value)
}
