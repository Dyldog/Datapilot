//
//  LazyValue.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

struct LazyValue<Content: View>: View {
    let onLoad: (Any) -> Content

    @StateObject var loader: ValueLoader

    init(url: URL, headers: [String: String], onLoad: @escaping (Any) -> Content) {
        self.onLoad = onLoad
        _loader = .init(wrappedValue: .init(url: url, headers: headers))
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
