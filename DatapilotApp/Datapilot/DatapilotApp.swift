//
//  DatapilotApp.swift
//  Datapilot
//
//  Created by Dylan Elliott on 1/2/2024.
//

import SwiftUI
import DataPilotKit

@main
struct DatapilotApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                QueryList()
					.navigationTitle(titles.randomElement()!)
            }
        }
    }
}

let titles = [
	"Frontend For Frontend",
	"Fr0nt3nd 4 H4x0rz",
	Emoji.random,
	"Backend SUX"
]
