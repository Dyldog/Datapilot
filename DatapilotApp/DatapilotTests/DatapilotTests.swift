//
//  DatapilotTests.swift
//  DatapilotTests
//
//  Created by Dylan Elliott on 14/2/2024.
//

import XCTest
@testable import Datapilot
import DylKit

final class DatapilotTests: XCTestCase {

    func testJSONQuery() throws {
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
		
		XCTAssertEqual(try JSONSerialization.data(withJSONObject: output).string, "")
    }

}
