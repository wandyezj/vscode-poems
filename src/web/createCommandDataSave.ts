import * as vscode from "vscode";
import { getWordMapToJson } from "./datamuse";
import { isFileMarkdown } from "./isFileMarkdown";
import { logTrace } from "./logTrace";
const delimiterDataBlockStart = "```poems-data\n";
const delimiterDataBlockEnd = "```";

function getDataBlock(text: string):
    | {
          data: string;
          startIndex: number;
          endIndex: number;
      }
    | undefined {


    const startIndexA = text.indexOf(delimiterDataBlockStart);

    if (startIndexA === -1) {
        return undefined;
    }
    
    const startIndex =  startIndexA + delimiterDataBlockStart.length

    const endIndex = text.indexOf(delimiterDataBlockEnd, startIndex);

    if (endIndex === -1) {
        return undefined;
    }

    const data = text.substring(startIndex, endIndex);

    return {
        startIndex,
        endIndex,
        data,
    };
}

export function createCommandDataSave() {

    const disposable = vscode.commands.registerCommand("poems.dataSave", () => {
        const activeEditor = vscode.window.activeTextEditor;
        const document = activeEditor?.document;
        if (
            activeEditor !== undefined &&
            document !== undefined &&
            isFileMarkdown(document.fileName)
        ) {
            const text = document.getText();
            const dataBlock = getDataBlock(text);
            const newData = getWordMapToJson();
            if (dataBlock === undefined) {
                
                const end = document.positionAt(text.length -1);
                // Write new data block at end of document
                activeEditor.edit((editBuilder) => {
                    editBuilder.insert(end, `\n${delimiterDataBlockStart}${newData}\n${delimiterDataBlockEnd}`);
                });
            } else {
                const originalData = dataBlock.data
                const startIndex = text.indexOf(originalData);
                const endIndex = startIndex + originalData.length;

                const positionStart = document.positionAt(startIndex);
                const positionEnd = document.positionAt(endIndex);

                const range = new vscode.Range(positionStart, positionEnd);

                activeEditor.edit((editBuilder) => {
                    editBuilder.replace(range, newData +"\n");
                });
            }

        }

        vscode.window.showInformationMessage(`Data Save`);
    });
    return disposable;
}
