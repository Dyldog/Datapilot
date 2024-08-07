//
//  Published+UserDefaults.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import Combine
import Foundation

private var cancellables = [String: AnyCancellable]()

public extension Published where Value: Codable {
    init(wrappedValue defaultValue: Value, key: String) {
        var value = defaultValue

        do {
            if let data = UserDefaults.standard.data(forKey: key) {
                value = try JSONDecoder().decode(Value.self, from: data)
            }
        } catch {
            //
        }

        self.init(initialValue: value)

        cancellables[key] = projectedValue.sink { val in
            guard let data = try? JSONEncoder().encode(val) else { return }

            // JSONEncoder turns `nil` into the string `"null"`. It makes it look like there's a
            // value when there shouldn't be one
            if String(data: data, encoding: .utf8) == "null" {
                UserDefaults.standard.setValue(nil, forKey: key)
            } else {
                UserDefaults.standard.setValue(data, forKey: key)
            }
        }
    }
}
