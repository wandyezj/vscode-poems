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
    function triggerUpdateDecorations({
        throttle,
        updatedEditor,
    }: {
        throttle: boolean;
        updatedEditor?: boolean;
    }) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (throttle) {
            timeout = setTimeout(() => {
                if (updatedEditor) {
                    activeEditorChangedCallback();
                }
                updateDecorations();
            }, 500);
        } else {
            updateDecorations();
        }
    }

    // slows down startup if either call back takes a while
    if (activeEditor) {
        //activeEditorChangedCallback();
        triggerUpdateDecorations({ throttle: true, updatedEditor: true });
    }

    const disposables: vscode.Disposable[] = [];

    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations({ throttle: true, updatedEditor: true });
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
