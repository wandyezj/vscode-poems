import * as vscode from "vscode";

/**
 * Output Console for tracing program actions
 */
let channelTrace: vscode.OutputChannel | undefined;

export function createTrace(name: string) {
    channelTrace = vscode.window.createOutputChannel(name);
}

export function logTrace(line: string) {
    if (channelTrace !== undefined) {
        channelTrace.appendLine(line);
    }
}
