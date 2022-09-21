import * as vscode from "vscode";
import { getWordMapToJson } from "./datamuse";
import { delimiterDataBlockEnd, delimiterDataBlockStart } from "./delimiters";
import { getDataBlock } from "./getDataBlock";
import { isFileMarkdown } from "./isFileMarkdown";
import { logTrace } from "./logTrace";

export function saveDataInActiveTextEditor() {
    const activeEditor = vscode.window.activeTextEditor;
    const document = activeEditor?.document;
    if (activeEditor !== undefined && document !== undefined && isFileMarkdown(document.fileName)) {
        const text = document.getText();
        const dataBlock = getDataBlock(text);
        const newData = getWordMapToJson();
        if (dataBlock === undefined) {
            const end = document.positionAt(text.length - 1);
            // Write new data block at end of document
            activeEditor.edit((editBuilder) => {
                editBuilder.insert(
                    end,
                    `\n${delimiterDataBlockStart}${newData}\n${delimiterDataBlockEnd}`
                );
                logTrace("data load");
            });

        } else {
            const originalData = dataBlock.data;
            const startIndex = text.indexOf(originalData);
            const endIndex = startIndex + originalData.length;

            const positionStart = document.positionAt(startIndex);
            const positionEnd = document.positionAt(endIndex);

            const range = new vscode.Range(positionStart, positionEnd);

            activeEditor.edit((editBuilder) => {
                editBuilder.replace(range, newData + "\n");
                logTrace("data load");
            });
        }
    }
}

export function createCommandDataSave() {
    const disposable = vscode.commands.registerCommand("poems.dataSave", () => {
        saveDataInActiveTextEditor();
        vscode.window.showInformationMessage(`Data Save`);
    });
    return disposable;
}
