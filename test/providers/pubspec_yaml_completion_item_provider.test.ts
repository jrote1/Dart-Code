import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it

import * as path from 'path';
import * as vscode from 'vscode';
import * as completionItemProvider from '../../src/providers/pubspec_yaml_completion_item_provider';

var fs   = require('fs');

suite("Pubspec.yaml completetion item provider Tests", () => {

    // Defines a Mocha unit test
    test("When file is empty and cursor is at position 0, returns root items", () => {
        var provider = new completionItemProvider.PubspecYamlCompletionItemProvider();
__filename
        let uri = vscode.Uri.file(path.join(path.dirname(fs.realpathSync(__filename)) + "/../../../test/providers/test_files", 'empty_pubspec.yaml'));
        return vscode.workspace.openTextDocument(uri).then((textDocument) => {
            return provider.provideCompletionItems(textDocument, new vscode.Position(1, 0), null).then(function (result) {
                assert.equal(false, result.isIncomplete);
                assert.equal("name", result.items[0].label)
            });
        });
    });

    test("When file has name and cursor is at line 2, returns root items without name", () => {
        var provider = new completionItemProvider.PubspecYamlCompletionItemProvider();
__filename
        let uri = vscode.Uri.file(path.join(path.dirname(fs.realpathSync(__filename)) + "/../../../test/providers/test_files", 'with_name_pubspec.yaml'));
        return vscode.workspace.openTextDocument(uri).then((textDocument) => {
            return provider.provideCompletionItems(textDocument, new vscode.Position(2, 0), null).then(function (result) {
                assert.equal(false, result.isIncomplete);
                assert.notEqual("name", result.items[0].label)
            });
        });
    });
});