//
//  LazyValue.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

struct LazyValue: View {
    let onLoad: (Any) -> AnyView

    @StateObject var loader: ValueLoader

    init(url: URL, headers: [String: String], onLoad: @escaping (Any) -> AnyView) {
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
