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

    init(url: URL) {
        self.url = url
        load()
    }

    func load() {
        URLSession.shared.dataTask(with: .init(url: url)) { data, resposne, error in
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
    
    init(url: URL, onLoad: @escaping (Any) -> AnyView) {
        self.onLoad = onLoad
        self._loader = .init(wrappedValue: .init(url: url))
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
