//
//  QueryView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI

struct QueryView: View {
    @State var urlText: String = Secrets.url // "https://swapi.dev/api/people/1"
    @State var url: URL?
    @State var headers: [(String, String, Bool)] = [("Authorization", "Bearer \(Secrets.apiKey)", true)]
    @State var method: RequestMethod = .get
    @State var postBody: String = ""
    
    var sharedHeaders: [String: String] {
        headers
            .filter { $0.2 }
            .reduce(into: [:], { $0[$1.0] = $1.1 })
    }
    func request(with url: URL) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = method.title
        
        headers.forEach {
            request.addValue($0.1, forHTTPHeaderField: $0.0)
        }
        
        if method == .post {
            request.httpBody = postBody.data(using: .utf8)
        }
        
        return request
    }
    
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
                VStack(spacing: 20) {
                    TextField("URL", text: $urlText)
                        .font(.largeTitle)
                        .navigationDestination(for: $url) { url in
                            ContentView(value: request(with: url), sharedHeaders: sharedHeaders)
                        }
                        .foregroundStyle(Color.rainbowColors[looping: 0])
                    
                    VStack {
                        HStack {
                            Text("Headers").bold()
                            Spacer()
                            Button {
                                headers.append(("", "", false))
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
                            ForEach(enumerated: headers) { index, value in
                                let color = Color.rainbowColors[looping: 2 + index]
                                HStack {
                                    CheckView(
                                        color: color,
                                        isChecked: value.2
                                    ) {
                                        headers[index] = (value.0, value.1, $0)
                                    }
                                    .frame(height: 30)
                                    .padding([.vertical, .trailing], 4)
                                    
                                    VStack(spacing: 4) {
                                        TextField("Key", text: .init(get: {
                                            value.0
                                        }, set: {
                                            headers[index] = ($0, value.1, value.2)
                                        }))
                                        
                                        TextField("Value", text: .init(get: {
                                            value.1
                                        }, set: {
                                            headers[index] = (value.0, $0, value.2)
                                        }))
                                    }
                                    .padding(.top, 4)
                                    
                                    Button {
                                        headers.remove(at: index)
                                    } label: {
                                        Image(systemName: "xmark")
                                    }
                                }
                                .foregroundStyle(color)
                            }
                        }
                        .padding(.horizontal, 8)
                    }
                    
                    Picker("Method", selection: $method) {
                        ForEach(enumerated: RequestMethod.allCases) { index, method in
                            let color = Color.rainbowColors[looping: 2 + headers.count + index]
                            Text(method.title).background(color).tag(method)
                        }
                    }
                    .pickerStyle(.segmented)
                    
                    if method == .post {
                        TextEditor(text: $postBody)
                    }
                    
                    Spacer()
                    
                    Button {
                        url = URL(string: urlText)
                    } label: {
                        Text("Go").font(.largeTitle).padding(8)
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(.black)
                    .background(Color.rainbowColors[looping: 2 + headers.count + RequestMethod.allCases.count])
                    .cornerRadius(10)
                    
                }
                .padding()
                .frame(minHeight: geometry.size.height)
            }
            .background(Color.black)
            .foregroundStyle(.white)
        }
    }
}
