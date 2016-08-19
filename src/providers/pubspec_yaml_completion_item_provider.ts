"use strict";

import { TextDocument, Position, CancellationToken, CompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind, TextEdit, Range } from "vscode";
import { Analyzer } from "../analysis/analyzer";
import * as as from "../analysis/analysis_server_types";
import { logError } from "../utils";

var yaml = require("yaml-js");

export class PubspecYamlCompletionItemProvider implements CompletionItemProvider {
	provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList> {
		var rootCompletionItems = [
			{ name: "name", description: "Required for every package" },
			{ name: "version", description: "Required for packages that are hosted on pub.dartlang.org" },
			{ name: "description", description: "Required for packages that are hosted on pub.dartlang.org" },
			{ name: "author", description: "Optional" },
			{ name: "authors", description: "Optional" },
			{ name: "homepage", description: "Optional" },
			{ name: "documentation", description: "Optional. Can be used to automatically create documentation" },
			{ name: "dependencies", description: "Can be omitted if your package has no dependencies" },
			{ name: "dev_dependencies", description: "Can be omitted if your package has no dev dependencies" },
			{ name: "dependency_overrides", description: "Can be omitted if you do not need to override any dependencies" },
			{ name: "environment", description: "Optional. Can be used to require a specific version of the Dart SDK" },
			{ name: "executables", description: "Required for every package" },
			{ name: "publish_to", description: "Optional. Specify where to publish a package. The default is pub.dartlang.org. Specify none to prevent a package from being published" },
			{ name: "transformers", description: "Optional. Used to configure dart2js or other transformers" }
		];

		var isEndOfFile = document.positionAt(document.getText().length).isEqual(position);
		var doc = yaml.compose(document.getText());
		var rootKeys = doc == null ? [] : (<[]>doc.value).map(function(val){
			var key = val[0];
			return {
				value: key.value,
				line: key.start_mark.line,
				column: key.start_mark.column,
				endColumn: key.end_mark.column
			};
		});

		if(!(isEndOfFile && position.character == 0) && !rootKeys.some(x=>x.line == position.line && x.column <= position.character && x.endColumn >= position.character))
			return Promise.resolve(new CompletionList());

		return Promise.resolve(new CompletionList(rootCompletionItems.filter(x=>!rootKeys.some(k=>k.value == x.name)).map(function (item) {
			var result = new CompletionItem(item.name, CompletionItemKind.Keyword);
			result.detail = item.description;
			return result;
		}), false));
	}
}