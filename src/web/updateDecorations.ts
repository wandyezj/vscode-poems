import { logTrace } from "./logTrace";
import * as vscode from "vscode";
import { getHaikuBlocks } from "./getHaikuBlocks";
import { HaikuBlock } from "./HaikuBlock";
import { getDecorationTypeHaiku } from "./getDecorationTypeHaikuBlock";
import { analyzeHaikuBlock, HaikuLintType } from "./analyzeHaikuBlock";
import { isFileMarkdown } from "./isFileMarkdown";

/**
 * Update decorations for the active editor
 * @param activeEditor
 */
export function updateDecorations(activeEditor: vscode.TextEditor) {
    const filename = activeEditor.document.fileName;
    const isMarkdown = isFileMarkdown(filename);

    // Only operate on Markdown files
    if (isMarkdown) {
        logTrace(`updateDecorations`);
        logTrace(filename);
        const document = activeEditor.document;
        const text = document.getText();

        // Locate Haiku blocks
        const blocks = getHaikuBlocks(text);

        logTrace(`blocks ${blocks.length}`);

        const decorationsMap = getDecorations(blocks, document);

        // consolidate based on decoration Type first
        const consolidatedDecorations = new Map<
            string,
            {
                decorations: vscode.DecorationOptions[];
                decorationType: vscode.TextEditorDecorationType;
            }
        >();

        for (const [lintType, decorations] of decorationsMap.entries()) {
            const { decoration, uid } = getDecorationTypeHaiku(lintType);
            if (decoration === undefined) {
                continue;
            }

            if (!consolidatedDecorations.has(uid)) {
                consolidatedDecorations.set(uid, { decorations: [], decorationType: decoration });
            }

            consolidatedDecorations.get(uid)?.decorations.push(...decorations);
        }

        for (const { decorations, decorationType } of consolidatedDecorations.values()) {
            activeEditor.setDecorations(decorationType, decorations);
        }

        logTrace("wrote Decorations");
    }
}

/**
 * Get all decorations consolidated by HaikuLintType
 * @param blocks
 * @param document
 * @returns
 */
function getDecorations(
    blocks: HaikuBlock[],
    document: vscode.TextDocument
): Map<HaikuLintType, vscode.DecorationOptions[]> {
    // generate all lints for each block
    const lints = blocks
        .map((block) => {
            const found = analyzeHaikuBlock(block);
            const mappedLints = found.map((lint) => {
                const positionStart = document.positionAt(lint.indexStart + block.innerText.start);
                const positionEnd = document.positionAt(lint.indexEnd + block.innerText.start);

                const range = new vscode.Range(positionStart, positionEnd);
                const hoverMessage = lint.message;
                const lintType = lint.lintType;

                return {
                    lintType,
                    range,
                    hoverMessage,
                };
            });

            return mappedLints;
        })
        .flat();

    // consolidate by lint type
    const map = new Map<HaikuLintType, vscode.DecorationOptions[]>();
    lints.forEach((lint) => {
        const kind = lint.lintType;
        if (!map.has(kind)) {
            map.set(kind, []);
        }

        map.get(kind)?.push({
            range: lint.range,
            hoverMessage: lint.hoverMessage,
        });
    });

    return map;
}

// function getBlockDecorations(block: HaikuBlock,
//     document: vscode.TextDocument) {
//     const positionStart = document.positionAt(block.index.start);
//     const positionEnd = document.positionAt(block.index.end);

//     const range = new vscode.Range(positionStart, positionEnd);

//     const value = {
//         range,
//         hoverMessage: `haiku block`,
//     };

//     return value;
// }
