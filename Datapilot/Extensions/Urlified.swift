//
//  Urlified.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation

func urlified(_ any: Any) -> Any {
    if let string = any as? String, let url = URL(string: string), url.scheme == "https" {
        return url
    } else {
        return any
    }
}
