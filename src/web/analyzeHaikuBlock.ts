import { HaikuBlock } from "./HaikuBlock";

export function analyzeHaikuBlock(block: HaikuBlock): HaikuLint[] {
    // Break up haiku into tokens for analysis
    const text = block.innerText.text;
    const tokens = parseHaikuTokens(text);

    // Analyze tokens look for syllables per line, create haiku issues

    const lintWords = tokens.map((token) => {
        const lintWord: HaikuLint = {
            lintType: HaikuLintType.Word,
            message: token.text,
            indexStart: token.indexStart,
            indexEnd: token.indexEnd,
        };

        return lintWord;
    });

    const lintText: HaikuLint = {
        lintType: HaikuLintType.Text,
        message: "haiku block",
        indexStart: 0,
        indexEnd: block.innerText.text.length,
    };

    const lints = [lintText, ...lintWords];

    return lints;
}

export interface HaikuLint {
    lintType: HaikuLintType;
    message: string;

    // relative to 0 of haiku start
    indexStart: number;

    // relative to 0 of haiku start
    indexEnd: number;
}

export enum HaikuLintType {
    /**
     * Full Text of Haiku
     */
    Text,
    /**
     * Word Token part of Haiku
     */
    Word,
    TooManySyllablesOnLine,
    TooFewSyllablesOnLine,
}

function parseHaikuTokens(text: string): HaikuToken[] {
    // TODO this is not 100% correct, do a better job searching
    const words = text
        .split("\n")
        .map((line) => line.split(" "))
        .flat();

    let currentIndex = 0;
    const wordTokens = words.map((word) => {
        const indexStart = text.indexOf(word, currentIndex);
        const indexEnd = indexStart + word.length;

        // look at next position
        currentIndex = indexEnd;

        const token: HaikuToken = {
            tokenType: HaikuTokenType.Word,
            indexStart,
            indexEnd,
            text: word,
        };

        return token;
    });

    return wordTokens;
}

interface HaikuToken {
    /**
     * Type of token
     */
    tokenType: HaikuTokenType;

    // relative to 0 of haiku start
    indexStart: number;
    indexEnd: number;

    text: string;
}

/**
 * Token Types
 * Only newlines are recorded other whitespace is discarded
 */
enum HaikuTokenType {
    Word,
    Newline,
}
