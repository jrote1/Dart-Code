"use strict";

import { TextDocument, Position, CancellationToken, CompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind, TextEdit, Range } from "vscode";
import { Analyzer } from "../analysis/analyzer";
import * as as from "../analysis/analysis_server_types";
import { logError } from "../utils";

var yaml = require("yaml-js");

class YamlCompletionItem {
	name: string;
	description: string;

	constructor(name: string, description: string, items: YamlCompletionItem[] = null) {
		this.name = name;
		this.description = description;
	}
}

export class YamlCompletionItemProvider {
	provideCompletionItems(completionItems: YamlCompletionItem[], document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList> {
		var isEndOfFile = document.positionAt(document.getText().length).isEqual(position);
		var doc = yaml.compose(document.getText());
		var rootKeys = doc == null ? [] : (<[]>doc.value).map(function (val) {
			var key = val[0];
			return {
				value: key.value,
				line: key.start_mark.line,
				column: key.start_mark.column,
				endColumn: key.end_mark.column
			};
		});

		if (!(isEndOfFile && position.character == 0) && !rootKeys.some(x => x.line == position.line && x.column <= position.character && x.endColumn >= position.character))
			return Promise.resolve(new CompletionList());

		return Promise.resolve(new CompletionList(completionItems.filter(x => !rootKeys.some(k => k.value == x.name)).map(function (item) {
			var result = new CompletionItem(item.name, CompletionItemKind.Keyword);
			result.detail = item.description;
			return result;
		}), false));
	}
}

export class PubspecYamlCompletionItemProvider implements CompletionItemProvider {
	provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList> {
		var rootCompletionItems = [
			new YamlCompletionItem("name", "Required for every package"),
			new YamlCompletionItem("version", "Required for packages that are hosted on pub.dartlang.org"),
			new YamlCompletionItem("description", "Required for packages that are hosted on pub.dartlang.org"),
			new YamlCompletionItem("author", "Optional"),
			new YamlCompletionItem("authors", "Optional"),
			new YamlCompletionItem("homepage", "Optional"),
			new YamlCompletionItem("documentation", "Optional. Can be used to automatically create documentation"),
			new YamlCompletionItem("dependencies", "Can be omitted if your package has no dependencies"),
			new YamlCompletionItem("dev_dependencies", "Can be omitted if your package has no dev dependencies"),
			new YamlCompletionItem("dependency_overrides", "Can be omitted if you do not need to override any dependencies"),
			new YamlCompletionItem("environment", "Optional. Can be used to require a specific version of the Dart SDK"),
			new YamlCompletionItem("executables", "Required for every package"),
			new YamlCompletionItem("publish_to", "Optional. Specify where to publish a package. The default is pub.dartlang.org. Specify none to prevent a package from being published"),
			new YamlCompletionItem("transformers", "Optional. Used to configure dart2js or other transformers", [
				new YamlCompletionItem("$dart2js", "use dart2js transformer", [
					new YamlCompletionItem("analyzeAll", "Analyze even the code that isn’t reachable from main()"),
					new YamlCompletionItem("checked", "Insert runtime type checks, and enable assertions (checked mode)"),
					new YamlCompletionItem("csp", "If true, disables dynamic generation of code in the generated output"),
					new YamlCompletionItem("environment", ""),
					new YamlCompletionItem("minify", "Generate minified output"),
					new YamlCompletionItem("sourceMaps", ""),
					new YamlCompletionItem("suppressHints", "Don’t display hints"),
					new YamlCompletionItem("suppressWarnings", "Don’t display warnings"),
					new YamlCompletionItem("terse", "Emit diagnostics, but don’t suggest how to get rid of the diagnosed problems"),
					new YamlCompletionItem("verbose", "Display lots of information"),
					new YamlCompletionItem("commandLineOptions", ""),
				])
			])
		];

		var provider = new YamlCompletionItemProvider();
		return provider.provideCompletionItems(rootCompletionItems, document, position, token);		
	}
}