export function isFileMarkdown(filename: string): boolean {
    const isFileMarkdown = filename.endsWith(".md");
    return isFileMarkdown;
}
