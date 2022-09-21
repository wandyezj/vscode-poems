import * as vscode from "vscode";

export function createCommandDataLoad() {
    const disposable = vscode.commands.registerCommand("poems.dataLoad", () => {
        vscode.window.showInformationMessage(`Data Load`);
    });
    return disposable;
}
