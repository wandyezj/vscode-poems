import { logTrace } from "./logTrace";
import * as vscode from "vscode";
import {getHaikuBlocks} from "./getHaikuBlocks"
/**
 * Update decorations for the active editor
 * @param activeEditor
 */
export function updateDecorations(activeEditor: vscode.TextEditor) {
    const filename = activeEditor.document.fileName;
    const isFileMarkdown = filename.endsWith(".md");

    // Only operate on Markdown files
    if (isFileMarkdown) {
        logTrace(`updateDecorations`);
        logTrace(filename);
        const text = activeEditor.document.getText();

        // Locate Haiku blocks
        const blocks = getHaikuBlocks(text);

        logTrace(`blocks ${blocks.length}`);

        // const variableDecorationType = getVariableDecorationType();

        // const decorations = getDecorations(text);
        // activeEditor.setDecorations(variableDecorationType, decorations);
        // logTrace("wrote Decorations");
    }
}
