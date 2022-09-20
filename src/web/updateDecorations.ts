import { logTrace } from "./logTrace";
import * as vscode from "vscode";
import { getHaikuBlocks } from "./getHaikuBlocks";
import { HaikuBlock } from "./HaikuBlock";
import { getDecorationType } from "./getDecorationType";

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
        const document = activeEditor.document;
        const text = document.getText();

        // Locate Haiku blocks
        const blocks = getHaikuBlocks(text);

        logTrace(`blocks ${blocks.length}`);

        const decorations = getDecorations(blocks, document);
        const variableDecorationType = getDecorationType();
        activeEditor.setDecorations(variableDecorationType, decorations);
        logTrace("wrote Decorations");
    }
}

function getDecorations(
    blocks: HaikuBlock[],
    document: vscode.TextDocument
): vscode.DecorationOptions[] {
    const decorations = blocks.map((block) => {
        const positionStart = document.positionAt(block.index.start);
        const positionEnd = document.positionAt(block.index.end);

        const range = new vscode.Range(positionStart, positionEnd);

        const value = {
            range,
            hoverMessage: `haiku block`,
        };

        return value;
    });

    return decorations;
}
