//
//  QueryView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DylKit

struct QueryHeader: Codable, Hashable {
	let key: String
	let value: String
	let isShared: Bool
}

struct Query: Codable, Hashable, Equatable {
	var title: String
	var url: String
	var query: String
	var headers: [QueryHeader]
	var method: RequestMethod
	var postBody: String
	
	var displayTitle: String {
		title.isEmpty ? url : title
	}
}

class QueryViewModel: ObservableObject {
	var query: Binding<Query>
	
	init(query: Binding<Query>) {
		self.query = query
	}
}

struct QueryView: View {
	@StateObject var viewModel: QueryViewModel
	
	@State var query: String = ""
    @State var url: URL?
	@State var queryEnabled: Bool = true
//    @State var method: RequestMethod = .get
//    @State var postBody: String = ""
	
	init(query: Binding<Query>) {
		let viewModel = QueryViewModel(query: query)
		_query = .init(wrappedValue: viewModel.query.wrappedValue.query)
		_viewModel = .init(wrappedValue: viewModel)
	}
    
    var sharedHeaders: [String: String] {
		viewModel.query.wrappedValue.headers
            .filter { $0.isShared }
            .reduce(into: [:], { $0[$1.key] = $1.value })
    }
    func request(with url: URL) -> URLRequest {
        var request = URLRequest(url: url)
		request.httpMethod = viewModel.query.wrappedValue.method.title
        
		viewModel.query.wrappedValue.headers.forEach {
            request.addValue($0.value, forHTTPHeaderField: $0.key)
        }
        
		if viewModel.query.wrappedValue.method == .post {
			request.httpBody = viewModel.query.wrappedValue.postBody.data(using: .utf8)
        }
        
        return request
    }
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(spacing: 20) {
					TextField("Title", text: $viewModel.query.wrappedValue.title)
						.font(.largeTitle)
						.foregroundStyle(Color.rainbowColors[looping: 0])
					
					TextField("URL", text: $viewModel.query.wrappedValue.url)
                        .font(.largeTitle)
                        .navigationDestination(for: $url) { url in
							ContentView(
								value: request(with: url),
								sharedHeaders: sharedHeaders,
								dataQuery: queryEnabled ? viewModel.query.wrappedValue.query : nil
							)
							.navigationTitle(viewModel.query.wrappedValue.title)
                        }
                        .foregroundStyle(Color.rainbowColors[looping: 0])
					
					HStack {
						Button {
							SharedApplication.openURL(.init(string: "https://jmespath.org/examples.html")!)
						} label: {
							Text("Query")
						}

						Spacer()
						
						Toggle("Query Enabled", isOn: $queryEnabled)
							.toggleStyle(.switch)
							.labelsHidden()
					}
					
					TextEditor(text: $query)
						.foregroundStyle(.black)
						.frame(height: 100)
						.cornerRadius(10)
                    
                    VStack {
                        HStack {
                            Text("Headers").bold()
                            Spacer()
                            Button {
								viewModel.objectWillChange.send()
								viewModel.query.wrappedValue.headers.append(.init(key: "", value: "", isShared: false))
                            } label: {
                                Image(systemName: "plus")
                            }
                        }
                        .padding(4)
                        .padding(.horizontal, 4)
                        .background(Color.white)
                        .foregroundStyle(Color.rainbowColors[looping: 1])
                        .cornerRadius(10, corners: [.topLeft, .topRight])
                        
                        
                        VStack {
                            ForEach(enumerated: viewModel.query.wrappedValue.headers) { index, value in
                                let color = Color.rainbowColors[looping: 2 + index]
                                HStack {
                                    CheckView(
                                        color: color,
                                        isChecked: viewModel.query.wrappedValue.headers[index].isShared
                                    ) {
										viewModel.query.wrappedValue.headers[index] = .init(
											key: viewModel.query.wrappedValue.headers[index].key,
											   value: viewModel.query.wrappedValue.headers[index].value,
											   isShared: $0
										   )
                                    }
                                    .frame(height: 30)
                                    .padding([.vertical, .trailing], 4)
                                    
                                    VStack(spacing: 4) {
                                        TextField("Key", text: .init(get: {
											viewModel.query.wrappedValue.headers[index].key
                                        }, set: {
											viewModel.query.wrappedValue.headers[index] = .init(
												key: $0,
												value: viewModel.query.wrappedValue.headers[index].value,
												isShared: viewModel.query.wrappedValue.headers[index].isShared
											)
                                        }))
                                        
                                        TextField("Value", text: .init(get: {
											viewModel.query.wrappedValue.headers[index].value
                                        }, set: {
											viewModel.query.wrappedValue.headers[index] = .init(
												key: viewModel.query.wrappedValue.headers[index].key,
												value: $0,
												isShared: viewModel.query.wrappedValue.headers[index].isShared
											)
                                        }))
                                    }
                                    .padding(.top, 4)
                                    
                                    Button {
										viewModel.objectWillChange.send()
										viewModel.query.wrappedValue.headers.remove(at: index)
                                    } label: {
                                        Image(systemName: "xmark")
                                    }
                                }
                                .foregroundStyle(color)
                            }
                        }
                        .padding(.horizontal, 8)
                    }
                    
					Picker("Method", selection: .init(get: {
						viewModel.query.wrappedValue.method
					}, set: {
						viewModel.objectWillChange.send()
						viewModel.query.wrappedValue.method = $0
					})) {
                        ForEach(enumerated: RequestMethod.allCases) { index, method in
                            let color = Color.rainbowColors[looping: 2 + viewModel.query.wrappedValue.headers.count + index]
                            Text(method.title).background(color).tag(method)
                        }
                    }
                    .pickerStyle(.segmented)
                    
					if viewModel.query.wrappedValue.method == .post {
						TextEditor(text: $viewModel.query.wrappedValue.postBody)
							.foregroundStyle(.black)
							.frame(height: 200)
							.cornerRadius(10)
                    }
                    
                    Spacer()
                    
                    Button {
						url = URL(string: viewModel.query.wrappedValue.url)
                    } label: {
                        Text("Go").font(.largeTitle).padding(8)
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(.black)
                    .background(Color.rainbowColors[looping: 2 + viewModel.query.wrappedValue.headers.count + RequestMethod.allCases.count])
                    .cornerRadius(10)
                    
                }
                .padding()
                .frame(minHeight: geometry.size.height)
            }
            .background(Color.black)
            .foregroundStyle(.white)
        }
		.onChange(of: query, perform: { newValue in
			viewModel.query.wrappedValue.query = newValue
		})
    }
}
