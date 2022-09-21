import * as vscode from "vscode";

export function createUpdateDecorationsTrigger({
    updateDecorationsCallback,
    activeEditorChangedCallback,
}: {
    updateDecorationsCallback: (activeEditor: vscode.TextEditor) => void;
    activeEditorChangedCallback: () => void;
}) {
    /**
     * currently active text editor, can only edit in a single editor at a time.
     */
    let activeEditor = vscode.window.activeTextEditor;

    function updateDecorations() {
        if (activeEditor !== undefined) {
            updateDecorationsCallback(activeEditor);
        }
    }

    let timeout: NodeJS.Timer | undefined = undefined;

    /**
     * Triggers update 500 milliseconds after last edit if throttled.
     * This prevents continuous triggering of updateDecorations.
     */
    function triggerUpdateDecorations({ throttle }: { throttle: boolean }) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (throttle) {
            timeout = setTimeout(updateDecorations, 500);
        } else {
            updateDecorations();
        }
    }

    if (activeEditor) {
        activeEditorChangedCallback();
        triggerUpdateDecorations({ throttle: false });
    }

    const disposables: vscode.Disposable[] = [];

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                activeEditorChangedCallback();
                triggerUpdateDecorations({ throttle: true });
            }
        },
        null,
        disposables
    );

    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations({ throttle: true });
            }
        },
        null,
        disposables
    );

    return disposables;
}
