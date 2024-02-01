//
//  IsContainer.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation

func isContainer(_ value: Any) -> Bool {
    return (value is [Any] || value is [String: Any])
}
