//
//  ContentView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DylKit

struct ContentView: View {
    @StateObject var viewModel: ContentViewModel
    
    init(value: Any, sharedHeaders: [String: String]) {
        self._viewModel = .init(wrappedValue: .init(value: urlified(value), sharedHeaders: sharedHeaders))
    }
    
    var inner: some View {
        if let data = viewModel.data {
            contentView(with: data)
        } else {
            VStack {
                loadingView
            }.any
        }
    }
    var body: some View {
        inner.if((viewModel.data as? [String: Any])?.titleValue) { view, title in
            view.navigationTitle(Text(title))
        }
    }
    
    var loadingView: some View {
        ProgressView()
            .progressViewStyle(.circular)
    }
    
    func chevroned<T: View>(_ view: T) -> AnyView {
        return HStack {
            view
#if canImport(UIKit)
#else
            Image(systemName: "chevron.right")
#endif
        }.any
    }
    
    func titleView(with data: Any) -> AnyView {
        switch data {
        case let string as String:
            return Text(string).any
        case let array as [Any]:
            return Text("\(array.count) items").any
        case let dictionary as [String: Any]:
            return Text(dictionary.titleValue ?? "").any
        case let url as URL:
            return LazyValue(url: url) { value in
                titleView(with: value)
            }.any
        case let bool as Bool:
            return Text(bool ? "true" : "false").any
        case let float as Float:
            return Text("\(float)").any
        case let int as Int:
            return Text("\(int)").any
        case let null as NSNull:
            return Text("null").any
        default:
            return Text("TODO").any
        }
    }
    
    func contentView(with data: Any) -> AnyView {
        switch data {
        case let array as [Any]:
            return listView(with: array) {
                contentView(with: urlified($0))
            }
        case let dictionary as [String: Any]:
            return listView(with: dictionary.map { ($0, $1) }) {
                rowView(with: $0, and: urlified($1))
            }
        case let url as URL:
            return NavigationLink {
                ContentView(value: url, sharedHeaders: viewModel.sharedHeaders)
            } label: {
                LazyValue(url: url) { value in
                    HStack {
                        titleView(with: value)
                        Spacer()
                        Image(systemName: "chevron.right")
                    }.any
                }
            }.any
        default:
            return titleView(with: data)
        }
    }
    
    func listView<T>(with data: [T], cellFactory: @escaping (T) -> some View) -> AnyView {
        List {
            ForEach(enumerated: data) { index, element in
                if isContainer(element) {
                    NavigationLink(destination: {
                        ContentView(value: element, sharedHeaders: viewModel.sharedHeaders)
                    }, label: {
                        HStack {
                            titleView(with: element)
                            Spacer()
#if canImport(UIKit)
#else
                            Image(systemName: "chevron.right")
#endif
                        }
                    }).any
                } else {
                    cellFactory(element)
                }
            }
        }.any
    }
    
    func rowView(with title: String, and content: Any) -> AnyView {
        func simpleRow() -> AnyView {
            HStack {
                Text(title)
                Spacer()
                titleView(with: content)
            }.any
        }
        
        if isContainer(content) || content is URL {
            return NavigationLink(destination: {
                ContentView(value: content, sharedHeaders: viewModel.sharedHeaders)
            }, label: {
                HStack {
                    simpleRow()
#if canImport(UIKit)
#else
                    Image(systemName: "chevron.right")
#endif
                }
            }).any
        } else {
            return simpleRow()
        }
    }
}

#Preview {
    ContentView(value: "Hello", sharedHeaders: [:])
}
