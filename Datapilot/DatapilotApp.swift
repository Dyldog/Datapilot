//
//  DatapilotApp.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI

@main
struct DatapilotApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationView {
                QueryList()
					.navigationTitle(titles.randomElement()!)
            }
        }
    }
}

let titles = [
	"Frontend For Frontend",
	"Fr0nt3nd 4 H4x0rz",
	"💩",
	"Backend SUX"
]
