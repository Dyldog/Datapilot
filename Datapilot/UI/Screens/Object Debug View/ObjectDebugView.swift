//
//  ObjectDebugView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI

struct ObjectDebugView: View {
	let object: Any
	
	var objectText: String {
		do {
			return (try JSONSerialization.data(withJSONObject: object, options: .prettyPrinted)).string
		} catch {
			return """
			Error decoding:
			\(error.localizedDescription)
			"""
		}
	}
	var body: some View {
		ScrollView {
			Text(objectText)
				.padding()
		}
	}
}
