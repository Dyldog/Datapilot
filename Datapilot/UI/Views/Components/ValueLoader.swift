//  ValueLoader.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

class ValueLoader: ObservableObject {
    @Published var value: Any?

    private let url: URL
    private let headers: [String: String]

    init(url: URL, headers: [String: String]) {
        self.url = url
        self.headers = headers
        load()
    }

    func load() {
        var request: URLRequest = .init(url: url)

        for header in headers {
            request.setValue(header.value, forHTTPHeaderField: header.key)
        }

        URLSession.shared.dataTask(with: request) { data, _, _ in
            guard let data else { return }
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: [])
                onMain { self.value = json }
            } catch {
                // TODO: Handle errors
                return
            }
        }.resume()
    }
}
