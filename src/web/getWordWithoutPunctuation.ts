const punctuation = [",", ".", ":", ";", "!"];

/**
 * Removes punctuation from the end of a word
 * @param word
 * @returns
 */
export function getWordWithoutPunctuation(word: string): string {
    while (punctuation.includes(word[word.length - 1])) {
        word = word.substring(0, word.length - 1);
    }
    return word;
}
