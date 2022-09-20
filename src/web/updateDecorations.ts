import { logTrace } from "./logTrace";
import * as vscode from "vscode";

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

        // search until there are no more

        // const variableDecorationType = getVariableDecorationType();

        // const decorations = getDecorations(text);
        // activeEditor.setDecorations(variableDecorationType, decorations);
        // logTrace("wrote Decorations");
    }
}

interface HaikuBlock {
    index: {
        /**
         * before block start
         */
        start: number;
        /**
         * after block end
         */
        end: number;
    };
    /**
     * text
     */
    text: string;
}

function getHaikuBlocks(text: string): HaikuBlock[] {
    const delimiterHaikuBlockStart = "```poems-haiku";
    const delimiterHaikuBlockEnd = "```";

    const blocks: HaikuBlock[] = [];

    let currentIndexBegin = text.indexOf(delimiterHaikuBlockStart, 0);

    while (currentIndexBegin !== -1) {
        const currentIndexEndStart = text.indexOf(
            delimiterHaikuBlockEnd,
            currentIndexBegin + delimiterHaikuBlockStart.length
        );

        if (currentIndexEndStart === -1) {
            // no end
            break;
        }

        const currentIndexEnd =
            currentIndexEndStart + delimiterHaikuBlockEnd.length;

        const blockText = text.substring(currentIndexBegin, currentIndexEnd);

        // add index
        blocks.push({
            index: {
                start: currentIndexBegin,
                end: currentIndexEnd,
            },
            text: blockText,
        });

        currentIndexBegin = text.indexOf(
            delimiterHaikuBlockStart,
            currentIndexEnd
        );
    }

    return blocks;
}
