import * as vscode from "vscode";
import { HaikuLintType } from "./analyzeHaikuBlock";

// const decorationPink = vscode.window.createTextEditorDecorationType({
//     color: "pink",
// });

// const decorationUnderlineWavyGray = vscode.window.createTextEditorDecorationType({
//     textDecoration: "none" // "underline wavy gray",
// });

/**
 * just shows hover text
 */
const decorationNone = {
    uid: "none",
    decoration:vscode.window.createTextEditorDecorationType({
        //textDecoration: "none",
    }),
};

const decorationUnderlineWavyYellow = {
    uid: "underline wavy yellow",
    decoration:vscode.window.createTextEditorDecorationType({
        textDecoration: "underline wavy yellow",
    }),
};

const decorationUnderlineYellow = {
    uid: "underline yellow",
    decoration:vscode.window.createTextEditorDecorationType({
        textDecoration: "underline yellow",
    }),
};

const decorationUndefined = {
    uid: "undefined",
    decoration: undefined,
}

export function getDecorationTypeHaiku(type: HaikuLintType): {decoration: vscode.TextEditorDecorationType | undefined, uid: string} {
    // decorations need to be unique?
    switch (type) {
        case HaikuLintType.Text:
            return  decorationUndefined;
        case HaikuLintType.Word:
            return decorationNone;
        case HaikuLintType.TooFewLines:
        case HaikuLintType.TooManyLines:
            return decorationUnderlineYellow;
        case HaikuLintType.TooFewSyllablesOnLine:
        case HaikuLintType.TooManySyllablesOnLine:
        default:
            return decorationUnderlineWavyYellow;
    }
}
