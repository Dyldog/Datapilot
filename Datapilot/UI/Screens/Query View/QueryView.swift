//
//  QueryView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import SwiftUI

struct QueryView: View {
    @Binding var query: Query
    @State var url: URL?
    @State var queryEnabled: Bool = true
    
    var sharedHeaders: [String: String] {
        query.headers
            .filter { $0.isShared }
            .reduce(into: [:]) { $0[$1.key] = $1.value }
    }

    init(query: Binding<Query>) {
        _query = query
    }

    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(spacing: 20) {
                    titleView
                    urlView
                    queryView
                    methodView
                    Spacer()
                    goButton
                }
                .padding()
                .frame(minHeight: geometry.size.height)
            }
            .background(Color.black)
            .foregroundStyle(.white)
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private var titleView: some View {
        TextField("Title", text: $query.title)
            .font(.largeTitle)
            .foregroundStyle(Color.rainbowColors[looping: 0])
    }
    
    private var urlView: some View {
        TextField("URL", text: $query.url)
            .font(.largeTitle)
            .navigationDestination(for: $url) { url in
                ContentView(
                    value: request(with: url),
                    sharedHeaders: sharedHeaders,
                    dataQuery: queryEnabled ? query.query : nil
                )
                .navigationTitle(query.title)
            }
            .foregroundStyle(Color.rainbowColors[looping: 0])
    }
    
    @ViewBuilder private var queryView: some View {
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

        TextEditor(text: $query.query)
            .foregroundStyle(.black)
            .frame(height: 100)
            .cornerRadius(10)
    }
    
    private var headersView: some View {
        VStack {
            HStack {
                Text("Headers").bold()
                Spacer()
                Button {
                    query.headers.append(.init(key: "", value: "", isShared: false))
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
                ForEach(enumerated: query.headers) { index, value in
                    let color = Color.rainbowColors[looping: 2 + index]
                    HStack {
                        CheckView(
                            color: color,
                            isChecked: query.headers[index].isShared
                        ) {
                            query.headers[index] = .init(
                                key: query.headers[index].key,
                                value: query.headers[index].value,
                                isShared: $0
                            )
                        }
                        .frame(height: 30)
                        .padding([.vertical, .trailing], 4)

                        VStack(spacing: 4) {
                            TextField("Key", text: .init(get: {
                                query.headers[index].key
                            }, set: {
                                query.headers[index] = .init(
                                    key: $0,
                                    value: query.headers[index].value,
                                    isShared: query.headers[index].isShared
                                )
                            }))

                            TextField("Value", text: .init(get: {
                                query.headers[index].value
                            }, set: {
                                query.headers[index] = .init(
                                    key: query.headers[index].key,
                                    value: $0,
                                    isShared: query.headers[index].isShared
                                )
                            }))
                        }
                        .padding(.top, 4)

                        Button {
                            query.headers.remove(at: index)
                        } label: {
                            Image(systemName: "xmark")
                        }
                    }
                    .foregroundStyle(color)
                }
            }
            .padding(.horizontal, 8)
        }
    }
    
    @ViewBuilder
    private var methodView: some View {
        Picker("Method", selection: $query.method) {
            ForEach(enumerated: RequestMethod.allCases) { index, method in
                let color = Color.rainbowColors[looping: 2 + query.headers.count + index]
                Text(method.title).background(color).tag(method)
            }
        }
        .pickerStyle(.segmented)

        if query.method == .post {
            TextEditor(text: $query.postBody)
                .foregroundStyle(.black)
                .frame(height: 200)
                .cornerRadius(10)
        }
    }
    
    private var goButton: some View {
        Button {
            url = URL(string: query.url)
        } label: {
            Text("Go").font(.largeTitle).padding(8)
        }
        .frame(maxWidth: .infinity)
        .foregroundStyle(.black)
        .background(Color.rainbowColors[looping: 2 + query.headers.count + RequestMethod.allCases.count])
        .cornerRadius(10)
    }
}

extension QueryView {
    func request(with url: URL) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = query.method.title

        for header in query.headers {
            request.addValue(header.value, forHTTPHeaderField: header.key)
        }

        if query.method == .post {
            request.httpBody = query.postBody.data(using: .utf8)
        }

        return request
    }
}
