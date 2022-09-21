import * as vscode from "vscode";
import { addToWordMapFromJson } from "./datamuse";
import { getDataBlock } from "./getDataBlock";
import { isFileMarkdown } from "./isFileMarkdown";

export function loadDataFromActiveTextEditor() {
    const activeEditor = vscode.window.activeTextEditor;
    const document = activeEditor?.document;
    if (activeEditor !== undefined && document !== undefined && isFileMarkdown(document.fileName)) {
        const text = document.getText();
        const dataBlock = getDataBlock(text);
        if (dataBlock !== undefined) {
            addToWordMapFromJson(dataBlock.data);
        }
    }
}

export function createCommandDataLoad() {
    const disposable = vscode.commands.registerCommand("poems.dataLoad", () => {
        loadDataFromActiveTextEditor();
        vscode.window.showInformationMessage(`Data Load`);
    });
    return disposable;
}
