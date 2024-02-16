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
	@State var showDebug: Bool = false
    
    init(value: Any, sharedHeaders: [String: String], dataQuery: String?) {
		self._viewModel = .init(wrappedValue: .init(value: urlified(value), sharedHeaders: sharedHeaders, dataQuery: dataQuery))
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
		.toolbar {
			Button {
				showDebug = true
			} label: {
				Image(systemName: "ant.fill")
			}

		}
		.sheet(isPresented: $showDebug) {
			ObjectDebugView(object: viewModel.data as Any)
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
    
    
    
    func contentView(with data: Any) -> AnyView {
        switch data {
		case let array as [Any] where array.count == 1:
			return contentView(with: urlified(array[0]))
		case let array as [Any]:
            return listView(with: array) {
                contentView(with: urlified($0))
            }
        case let dictionary as [String: Any]:
			return VStack(spacing: 0) {
				if dictionary.hasObjectProperties {
					ObjectTitleView(object: dictionary, requestHeaders: viewModel.sharedHeaders)
						.padding(.horizontal).padding(.bottom)
				}
				
				if dictionary.filteringObjectProperties().keys.count == 1 {
					contentView(with: urlified(dictionary.filteringObjectProperties().values.first!))
				} else {
					listView(with: dictionary.filteringObjectProperties().map { ($0, $1) }) { key, value in
						rowView(with: key, and: urlified(value))
					}
				}
				Spacer()
			}.any
        case let url as URL:
            return LazyValue(url: url, headers: viewModel.sharedHeaders) { value in
				contentView(with: value)
				
//				NavigationLink {
//					ContentView(value: value, sharedHeaders: viewModel.sharedHeaders, dataQuery: nil)
//				} label: {
//                    HStack {
//                        ObjectTitleView(object: value, requestHeaders: viewModel.sharedHeaders)
//                        Spacer()
//                        Image(systemName: "chevron.right")
//                    }
//                }.any
            }.any
        default:
			return ObjectTitleView(object: data, requestHeaders: viewModel.sharedHeaders).any
        }
    }
    
    func listView<T>(with data: [T], cellFactory: @escaping (T) -> some View) -> AnyView {
        List {
            ForEach(enumerated: data) { index, element in
                if isContainer(element) {
                    NavigationLink(destination: {
						ContentView(value: element, sharedHeaders: viewModel.sharedHeaders, dataQuery: nil)
                    }, label: {
                        HStack {
                            ObjectTitleView(object: element, requestHeaders: viewModel.sharedHeaders)
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
        }
		.listStyle(.plain)
		.any
    }
    
    func rowView(with title: String, and content: Any) -> AnyView {
        func simpleRow() -> AnyView {
            HStack() {
                ObjectTitleView(object: title, requestHeaders: viewModel.sharedHeaders)
                ObjectTitleView(object: content, requestHeaders: viewModel.sharedHeaders, isSubLabel: true)
            }.any
        }
        
        if isContainer(content) || content is URL {
            return NavigationLink(destination: {
				ContentView(value: content, sharedHeaders: viewModel.sharedHeaders, dataQuery: nil)
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

extension Dictionary where Key == String {
	func objectProperties() -> Self? {
		let props = self.filter { ObjectPropertyLens.ObjectProperty.allKeys.contains($0.key) }
		return props.keys.isEmpty ? nil : props
	}
	
	var hasObjectProperties: Bool { objectProperties() != nil }
	
	func filteringObjectProperties() -> Self {
		self
			.filter { !ObjectPropertyLens.ObjectProperty.allKeys.contains($0.key) }
	}
}

#Preview {
	ContentView(value: "Hello", sharedHeaders: [:], dataQuery: nil)
}
