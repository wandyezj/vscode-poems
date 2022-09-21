export function getSyllables(word: string): number | undefined {
    const result = globalWordMap.get(word);

    if (result === undefined) {
        return undefined;
    }
    return result.numSyllables;
}

/**
 * reference to look up all the words
 */
const globalWordMap = new Map<string, { word: string; numSyllables: number }>();

const globalWordQueryMap = new Map<string, Promise<DatamuseQueryItem[]>>();

export function getWordMapToJson(): string {
    const s = JSON.stringify(Array.from(globalWordMap.values()));
    return s;
}

/**
 * adds values to word map if they do not already exist
 * @param s
 */
export function addToWordMapFromJson(s: string) {
    const data: DatamuseQueryItem[] = JSON.parse(s);

    data.forEach((value) => {
        const key = value.word;
        if (!globalWordMap.has(key)) {
            globalWordMap.set(key, value);
        }
    });
}

/**
 * populates the reference with the words
 * not guaranteed all words will be populated, best effort
 * @param words
 */
export async function populateReferenceWithWords(words: string[]) {
    // remove duplicates, take first item in position
    const uniqueWords = words.filter((item, position, array) => array.indexOf(item) == position);

    // all words that are new
    const newWords = uniqueWords.filter((word) => !globalWordMap.has(word));

    const newQueryWords = newWords.filter((word) => !globalWordQueryMap.has(word));

    // kick off queries
    newQueryWords.map((word) => {
        const promise = getSyllablesFromDatamuse(word);
        globalWordQueryMap.set(word, promise);

        promise
            .then(
                // add results to dictionary
                (results) => {
                    results.forEach((result) => {
                        const key = result.word;
                        if (!globalWordMap.has(key)) {
                            globalWordMap.set(key, result);
                        }
                    });
                }
            )
            .finally(() => {
                // remove from list of open queries
                globalWordQueryMap.delete(word);
            });
    });

    // pend on all open word promises
    const openPromises = newQueryWords
        .map((word) => globalWordQueryMap.get(word))
        .filter((promise) => promise !== undefined);
    await Promise.all(openPromises);
}

interface DatamuseQueryItem {
    word: string;
    numSyllables: number;
}

function hasWhiteSpace(s: string): boolean {
    return /\s/g.test(s);
}

async function getSyllablesFromDatamuse(word: string) {
    // https://api.datamuse.com/words?sp=yellow&md=s
    const query = "https://api.datamuse.com/words?md=s&sp=" + word;

    const response = await fetch(query, {
        mode: "cors",
    });

    const o: DatamuseQueryItem[] = await response.json();

    // get the list of words and syllables, remove any with whitespace
    const list = o.filter(({ word }) => !hasWhiteSpace(word));

    return list;
}