import * as vscode from "vscode";
import { HaikuLintType } from "./analyzeHaikuBlock";

const decorationPink = vscode.window.createTextEditorDecorationType({
    color: "pink",
});

const decorationUnderlineWavyGray = vscode.window.createTextEditorDecorationType({
    textDecoration: "underline wavy gray",
});

const decorationUnderlineWavyYellow = vscode.window.createTextEditorDecorationType({
    textDecoration: "underline wavy yellow",
});

export function getDecorationTypeHaiku(type: HaikuLintType) {
    switch (type) {
        case HaikuLintType.Text:
            return decorationPink;
        case HaikuLintType.Word:
            return decorationUnderlineWavyGray;
        default:
            return decorationUnderlineWavyYellow;
    }
}
