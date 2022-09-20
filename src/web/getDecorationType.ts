import * as vscode from "vscode";

export function getDecorationType() {
    const variableDecorationType = vscode.window.createTextEditorDecorationType({
        //borderWidth: "0.1px",
        //borderStyle: "solid",
        //overviewRulerColor: "blue",
        color: "pink",
        //overviewRulerLane: vscode.OverviewRulerLane.Right,
        // light: {
        //     // this color will be used in light color themes
        //     borderColor: "pink",
        // },
        // dark: {
        //     // this color will be used in dark color themes
        //     borderColor: "lightblue",
        // },
    });

    return variableDecorationType;
}
