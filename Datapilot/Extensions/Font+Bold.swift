//
//  Font+Bold.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI

extension Font {
    func bold(_ bold: Bool) -> Font {
        bold ? self.bold() : self
    }
}
