//
//  LazyValue.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DylKit

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
		
		headers.forEach {
			request.setValue($0.value, forHTTPHeaderField: $0.key)
		}
		
        URLSession.shared.dataTask(with: request) { data, resposne, error in
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

struct LazyValue: View {
    let onLoad: (Any) -> AnyView
    
    @StateObject var loader: ValueLoader
    
	init(url: URL, headers: [String: String], onLoad: @escaping (Any) -> AnyView) {
        self.onLoad = onLoad
        self._loader = .init(wrappedValue: .init(url: url, headers: headers))
    }
    
    var body: some View {
        if let value = loader.value {
            onLoad(value)
        } else {
            ProgressView()
                .progressViewStyle(.circular)
                .controlSize(.small)
        }
    }
}
