import { getWordSyllables, populateReferenceWithWords } from "./datamuse";
import { HaikuBlock } from "./HaikuBlock";

/**
 * Analyze a block of Haiku Text and return Lint information.
 * @param block 
 * @returns 
 */
export function analyzeHaikuBlock(block: HaikuBlock): HaikuLint[] {
    // Break up haiku into tokens for analysis
    const text = block.innerText.text;
    const tokens = parseHaikuTokens(text);

    // not awaited so not all tokens may be populated by the time they are referenced
    populateReferenceWithWords(
        tokens.filter(({ tokenType }) => tokenType === HaikuTokenType.Word).map(({ text }) => text)
    );

    const lint = lintHaiku(tokens);

    // Analyze tokens look for syllables per line, create haiku issues

    const lintWords = tokens.map((token) => {
        const word = token.text;
        const syllableCount = getWordSyllables(word) || "?";
        const lintWord: HaikuLint = {
            lintType: HaikuLintType.Word,
            message: `${word} ${syllableCount}`,
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

    const lints = [lintText, ...lintWords, ...lint];

    return lints;
}

/**
 * Group into lines of words. Empty lines are ignored.
 * @param tokens 
 * @returns 
 */
function groupTokensByLine(tokens: HaikuToken[]): HaikuToken[][] {
    // figure out lines of the haiku
    const lines: HaikuToken[][] = [];

    let currentLine: HaikuToken[] = [];
    for (const token of tokens) {
        if (token.tokenType === HaikuTokenType.Newline) {
            if (currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = [];
            }
        }
        if (token.tokenType === HaikuTokenType.Word) {
            currentLine.push(token);
        }
    }

    // last piece
    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines;
}

/**
 * Gets total number of syllables present in a line.
 * @param line 
 * @returns the count of syllables in the line by counting the syllables for each word, or undefined if any words syllables are undefined.
 */
function getSyllablesInLine(line: HaikuToken[]): { count: number, hasUndefined: boolean } {
    const syllables = line.map(({ text }) => getWordSyllables(text));
    const hasUndefined = syllables.includes(undefined);

    const count = (syllables.filter(x => x !== undefined) as number[]).reduce((previous, current) => previous + current, 0);

    return {
        count,
        hasUndefined
    }

}

/**
 * check if hiaku holds up
 * @param tokens
 */
function lintHaiku(tokens: HaikuToken[]): HaikuLint[] {
    // no tokens do nothing
    if (tokens.length === 0) {
        return [];
    }

    const lines = groupTokensByLine(tokens);

    const lints: HaikuLint[] = [];
    // check number of lines don't count lines before or in between
    if (lines.length !== 3) {
        const indexStart = tokens[0].indexStart;
        const indexEnd = tokens[tokens.length - 1].indexEnd;
        const tooMany = lines.length > 3;

        const lintType = tooMany ? HaikuLintType.TooManyLines : HaikuLintType.TooFewLines;
        const message = `Too ${tooMany ? "many" : "few"} Lines. Haiku's have 3 lines, found ${lines.length
            }.`;
        const lintLineCount: HaikuLint = {
            lintType,
            message,
            indexStart,
            indexEnd,
        };

        lints.push(lintLineCount);
    }

    // check number of syllables per line
    if (lines.length === 3) {
        const syllableLints = [5, 7, 5].map((value, index) => {
            const line = lines[index];
            const { count, hasUndefined } = getSyllablesInLine(line);

            let message: string = "";
            let lintType: HaikuLintType;// | undefined = undefined
            if (hasUndefined) {
                // can only determine if there are too many
                if (count > value) {
                    // too many, even though there are undefined words
                    message = `Too many syllables, found ${count} expected ${value}`;
                    lintType = HaikuLintType.TooManySyllablesOnLine;
                } else {
                    // cant make any other determination
                    return undefined
                }

            } else if (count < value) {
                // too few
                message = `Too few syllables, found ${count} expected ${value}`;
                lintType = HaikuLintType.TooFewSyllablesOnLine;
            } else if (count > value) {
                // too many
                message = `Too many syllables, found ${count} expected ${value}`;
                lintType = HaikuLintType.TooManySyllablesOnLine;
            } else {
                // Perfect!
                return undefined;
            }

            // underline whole line
            const indexStart = line[0].indexStart;
            const indexEnd = line[line.length - 1].indexEnd;

            let lint: HaikuLint = {
                lintType,
                message,
                indexStart,
                indexEnd
            };

            return lint;

        }).filter(x => x !== undefined) as HaikuLint[];

        lints.push(...syllableLints);
    }


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
    TooFewLines,
    TooManyLines,
}

function parseHaikuTokens(text: string): HaikuToken[] {
    const words = text
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => line.split(" "))
        .flat();

    let currentIndex = 0;
    const wordTokens = words
        .filter((word) => word.trim() !== "")
        .map((word) => {
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

    // grab newline tokens

    const newlineTokens: HaikuToken[] = [];
    const newline = "\n";
    let position = text.indexOf(newline);
    while (position !== -1 && position < text.length) {
        const indexStart = position;
        const indexEnd = position + newline.length;
        const newlineToken: HaikuToken = {
            tokenType: HaikuTokenType.Newline,
            indexStart,
            indexEnd,
            text: text.substring(indexStart, indexEnd),
        };
        newlineTokens.push(newlineToken);
        position = text.indexOf(newline, position + newline.length);
    }

    const allTokens = [...wordTokens, ...newlineTokens];

    // sort token order
    allTokens.sort((aToken, bToken) => {
        const a = aToken.indexStart;
        const b = bToken.indexStart;
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    });

    // Display parsed tokens
    //logTrace(allTokens.map(t => `(${t.indexStart}, ${t.indexEnd} [${t.text === newline ? "." : t.text}])` ).join(" "));

    return allTokens;
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
