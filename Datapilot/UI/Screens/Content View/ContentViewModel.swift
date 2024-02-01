//
//  ContentViewModel.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import Foundation
import DylKit

class ContentViewModel: ObservableObject {
    
    let sharedHeaders: [String: String]
    @Published var data: Any?
    
    init(value: Any, sharedHeaders: [String: String]) {
        self.sharedHeaders = sharedHeaders
        
        switch value {
        case let url as URL:
            self.loadData(request: .init(url: url)) { data in
                onMain {
                    self.data = data
                }
            }
        case let request as URLRequest:
            self.loadData(request: request) { data in
                onMain {
                    self.data = data
                }
            }
        default:
            self.data = value
        }
    }
    
    private func loadData(request: URLRequest, completion: @escaping (Any?) -> Void) {
        let session = URLSession.shared
        
        var request = request
        
        sharedHeaders.forEach {
            request.setValue($0.value, forHTTPHeaderField: $0.key)
        }
        
        session.dataTask(with: request) { data, response, error in
            guard let data = data else {
                return
            } // TODO: Handle errors
            
            let json: Any
            
            do {
                json = try JSONSerialization.jsonObject(with: data, options: [])
            } catch {
                return
            }
            
            if json is [String: Any] || json is [Any] {
                // json is a dictionary
                completion(json)
            } else {
                print("JSON is invalid")
                completion(nil)
            }
            
        }.resume()
    }
}
