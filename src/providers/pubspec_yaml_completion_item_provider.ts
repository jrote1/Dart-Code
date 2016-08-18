"use strict";

import { TextDocument, Position, CancellationToken, CompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind, TextEdit, Range } from "vscode";
import { Analyzer } from "../analysis/analyzer";
import * as as from "../analysis/analysis_server_types";
import { logError } from "../utils";

export class PubspecYamlCompletionItemProvider implements CompletionItemProvider {
	provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList> {
		var rootCompletionItems = [
			{name: "name", description: "Required for every package"},
			{name: "version", description: "Required for packages that are hosted on pub.dartlang.org"},
			{name: "description", description: "Required for packages that are hosted on pub.dartlang.org"},
			{name: "author", description: "Optional"},
			{name: "authors", description: "Optional"},
			{name: "homepage", description: "Optional"},
			{name: "documentation", description: "Optional. Can be used to automatically create documentation"},
			{name: "dependencies", description: "Can be omitted if your package has no dependencies"},
			{name: "dev_dependencies", description: "Can be omitted if your package has no dev dependencies"},
			{name: "dependency_overrides", description: "Can be omitted if you do not need to override any dependencies"},
			{name: "environment", description: "Optional. Can be used to require a specific version of the Dart SDK"},
			{name: "executables", description: "Required for every package"},
			{name: "publish_to", description: "Optional. Specify where to publish a package. The default is pub.dartlang.org. Specify none to prevent a package from being published"},
			{name: "transformers", description: "Optional. Used to configure dart2js or other transformers"}
		];

		return Promise.resolve(new CompletionList(rootCompletionItems.map(function(item){
			var result = new CompletionItem(item.name, CompletionItemKind.Keyword);
			result.detail = item.description;
			return result;
		}),false));
	}
}