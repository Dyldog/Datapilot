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
	let dataQuery: String?
    @Published var data: Any?
    
    init(value: Any, sharedHeaders: [String: String], dataQuery: String?) {
		
        self.sharedHeaders = sharedHeaders
		self.dataQuery = dataQuery
		
		testJSONQuery()
        
        switch value {
        case let url as URL:
            self.loadData(request: .init(url: url)) { data in
                onMain {
					self.data = self.filterData(data, with: dataQuery)
                }
            }
        case let request as URLRequest:
            self.loadData(request: request) { data in
                onMain {
                    self.data = self.filterData(data, with: dataQuery)
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
	
	private func filterData(_ data: Any?, with query: String?) -> Any! {
		guard
			let data, let query, !query.isEmpty, let json = (try? JSONSerialization.data(withJSONObject: data))?.string
		else { return data }
		
		return JSONQuery.query(query, in: json)
	}
	
	func testJSONQuery() {
		let json = """
		{
		"people": [
		  {
			"age": 20,
			"other": "foo",
			"name": "Bob"
		  },
		  {
			"age": 25,
			"other": "bar",
			"name": "Fred"
		  },
		  {
			"age": 30,
			"other": "baz",
			"name": "George"
		  }
		]
		}
		"""
		
		let query = "people[?age > `20`].[name, age]"
		
		
		let output = JSONQuery.query(query, in: json)
		
		print((try! JSONSerialization.data(withJSONObject: output)).string)
	}

}
