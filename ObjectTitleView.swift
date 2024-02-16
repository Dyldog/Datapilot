//
//  ObjectTitleView.swift
//  Datapilot
//
//  Created by Dylan Elliott on 15/2/2024.
//

import SwiftUI

struct ObjectTitleView: View {
	let lens: ObjectPropertyLens
	var object: Any { lens.object }
	let requestHeaders: [String: String]
	let isSubLabel: Bool
	
	init(object: Any, requestHeaders: [String: String], isSubLabel: Bool = false) {
		self.requestHeaders = requestHeaders
		self.isSubLabel = isSubLabel
		self.lens = .init(object: object)
	}
	
	var titleLabel: some View {
		let (title, size) = lens.value(of: .title) ?? (object, 0)
		return defaultTitle(for: title)
			.styled(for: .title, size: size, isSublabel: isSubLabel)
	}
	
	func label(for property: ObjectPropertyLens.ObjectProperty) -> (some View)? {
		guard let (value, size) = lens.value(of: property) else { return AnyView?.none }
		return defaultTitle(for: value).styled(for: property, size: size, isSublabel: isSubLabel).any
	}
	
	
	
	var body: some View {
		HStack {
			label(for: .pretitle)
				.frame(minWidth: 0)
			
			VStack(alignment: isSubLabel ? .trailing : .leading) {
				titleLabel
					.frame(alignment: .trailing)
					.frame(minWidth: 0)
				label(for: .subtitle)
					.frame(minWidth: 0)
			}
			
			Spacer()
			
			label(for: .posttitle)?
				.foregroundStyle(.gray)
				.minimumScaleFactor(0.5)
				.frame(minWidth: 0)
//				.frame(maxWidth: 140)
		}
		.multilineTextAlignment(isSubLabel ? .trailing : .leading)
//		.frame(minWidth: 0, maxWidth: .infinity)
	}
	
	private func defaultTitle(for object: Any) -> some View {
		switch object {
		case let string as String:
			return Text(string).any
		case let array as [Any]:
			return Text("\(array.count) items").any
		case let dictionary as [String: Any]:
			return Text(dictionary.titleValue ?? "").any
		case let url as URL:
			return LazyValue(url: url, headers: requestHeaders) { value in
				ObjectTitleView(object: value, requestHeaders: requestHeaders).any
			}.any
		case let bool as Bool:
			return Text(bool ? "true" : "false").any
		case let float as Float:
			return Text("\(float)").any
		case let int as Int:
			return Text("\(int)").any
		case is NSNull:
			return Text("null").any
		default:
			return Text("TODO").any
		}
	}
}

struct ObjectPropertyLens {
	enum ObjectProperty: String, CaseIterable {
		case title
		case subtitle
		case pretitle
		case posttitle
		case next
		case filter
		
		var key: String { "_\(rawValue)"}
		
		/// Initialises with a "key" of the form "_<RAW_VALUE>"
		init?(key: String) {
			self.init(rawValue: String(key.dropFirst()))
		}
		
		var isVisibleProperty: Bool {
			switch self {
			case .title, .subtitle, .pretitle, .posttitle:
				return true
			case .next, .filter:
				return false
			}
		}
		var defaultSize: Int {
			switch self {
			case .title: return 17
			case .subtitle: return 15
			case .pretitle, .posttitle: return 34
			// Non-label properties
			case .next, .filter: return 0
			}
		}
		
		var isBold: Bool {
			switch self {
			case .title: return true
			case .next, .filter: return false
			default: return false
			}
		}
		
		static var allKeys: [String] { allCases.map { $0.key } }
	}
	
	let object: Any
	
	var objectAsDict: [String: Any]? {
		object as? [String: Any]
	}
	
	func value(of property: ObjectProperty) -> (Any, Int)? {
		guard let value = objectAsDict?.first(where: { $0.key.starts(with: property.key) }) else { return nil }
		return (value.value, Int(value.key.replacingOccurrences(of: property.key, with: "", options: .anchored)) ?? 0)
	}
}

extension Font {
	func bold(_ bold: Bool) -> Font {
		bold ? self.bold() : self
	}
}

extension View {
	func styled(for property: ObjectPropertyLens.ObjectProperty, size: Int, isSublabel: Bool) -> some View {
		self
			.font(
				.system(size: CGFloat(property.defaultSize + size))
				.bold(!isSublabel && property == .title)
			)
	}
}
