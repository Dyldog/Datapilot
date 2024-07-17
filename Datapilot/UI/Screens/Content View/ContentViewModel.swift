//
//  ContentViewModel.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import DylKit
import Foundation

class ContentViewModel: ObservableObject {
    let sharedHeaders: [String: String]
    let dataQuery: String?

    // The data before we've used the JMESPath query on it
    // We need to save it (and requery the data when we get a new page) so that sorting is done on everything
    @Published private var unqueriedData: Any?

    // The data before it's been filtered by the search text
    private var unfilteredData: Any? { filterData(unqueriedData, with: dataQuery) }

    var data: Any? {
        guard !searchText.isEmpty else { return unfilteredData }

        let lens = ObjectPropertyLens(object: unfilteredData as Any)
        guard let filter = lens.value(of: .filter)?.0 as? String else { return unfilteredData }
        guard let dict = lens.objectAsDict?.filteringObjectProperties(), dict.count == 1, let listRow = dict.first as? (String, [Any])
        else { return unfilteredData }

        let newList = listRow.1.filter {
            guard let value = ($0 as? [String: Any])?[filter] as? CustomStringConvertible else { return false }
            return value.description.contains(searchText)
        }

        return (lens.objectAsDict?.objectProperties() ?? [:]).merging([listRow.0: newList]) { _, new in new }
    }

    @Published var searchText: String = ""

    var isSearchable: Bool {
        return ObjectPropertyLens(object: unfilteredData as Any).value(of: .filter) != nil
    }

    init(value: Any, sharedHeaders: [String: String], dataQuery: String?) {
        self.sharedHeaders = sharedHeaders
        self.dataQuery = dataQuery

        switch value {
        case let url as URL:
            onBG {
                self.loadData(request: .init(url: url)) { data in
                    onMain {
                        self.unqueriedData = data
                    }
                }
            }
        case let request as URLRequest:
            onBG {
                self.loadData(request: request) { data in
                    onMain {
                        self.unqueriedData = data
                    }
                }
            }
        default:
            unqueriedData = value
        }
    }

    private func loadData(request: URLRequest, completion: @escaping (Any?) -> Void) {
        let session = URLSession.shared

        var request = request

        for sharedHeader in sharedHeaders {
            request.setValue(sharedHeader.value, forHTTPHeaderField: sharedHeader.key)
        }

        session.dataTask(with: request) { data, _, _ in
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

    func tryLoadNextPage() {
        if let dict = unfilteredData as? [String: Any], let next = ObjectPropertyLens(object: dict).value(of: .next)?.0, let url = urlified(next) as? URL {
            onBG {
                self.loadData(request: .init(url: url)) { value in
                    let newData = merging(self.unqueriedData as Any, value as Any)
                    onMain {
                        self.unqueriedData = newData
                    }
                }
            }
        }
    }

    private func filterData(_ data: Any?, with query: String?) -> Any! {
        guard
            let data, let query, !query.isEmpty, let json = (try? JSONSerialization.data(withJSONObject: data))?.string
        else { return data }

        return JSONQuery.query(query, in: json)
    }
}
