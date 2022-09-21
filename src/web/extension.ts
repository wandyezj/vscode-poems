// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as Package from "../../package.json";
import { createCommandDataSave } from "./createCommandDataSave";
import { createCommandDataLoad, loadDataFromActiveTextEditor } from "./createCommandDataLoad";
import { createCommandVersion } from "./createCommandVersion";
import { createUpdateDecorationsTrigger } from "./createUpdateDecorationsTrigger";
import { createTrace, logTrace } from "./logTrace";
import { updateDecorations } from "./updateDecorations";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(`${Package.name} ${Package.version} is now active`);

    // Global trace see in Output -> poems
    createTrace(`${Package.name}`);
    logTrace(`activate ${Package.name} ${Package.version}`);

    context.subscriptions.push(
        ...[
            createCommandVersion(),
            createCommandDataSave(),
            createCommandDataLoad(),

            // When in a markdown file activate
            // parse markdown file loop for ```poems-haiku ``` sections and analyze the poems within applying highlighting
            ...createUpdateDecorationsTrigger({
                updateDecorationsCallback: updateDecorations,
                activeEditorChangedCallback: () => {
                    // load any new data
                    loadDataFromActiveTextEditor();
                },
            }),
        ]
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing
}
