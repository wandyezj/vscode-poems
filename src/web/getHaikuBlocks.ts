import { HaikuBlock } from "./HaikuBlock";

export function getHaikuBlocks(text: string): HaikuBlock[] {
    const delimiterHaikuBlockStart = "```poems-haiku";
    const delimiterHaikuBlockEnd = "```";

    const blocks: HaikuBlock[] = [];

    let currentIndexBegin = text.indexOf(delimiterHaikuBlockStart, 0);

    // search until there are no more
    while (currentIndexBegin !== -1) {
        const currentIndexEndStart = text.indexOf(
            delimiterHaikuBlockEnd,
            currentIndexBegin + delimiterHaikuBlockStart.length
        );

        if (currentIndexEndStart === -1) {
            // no end
            // all done
            break;
        }

        const currentIndexEnd = currentIndexEndStart + delimiterHaikuBlockEnd.length;

        const blockText = text.substring(currentIndexBegin, currentIndexEnd);

        // add index
        blocks.push({
            index: {
                start: currentIndexBegin,
                end: currentIndexEnd,
            },
            text: blockText,
        });

        currentIndexBegin = text.indexOf(delimiterHaikuBlockStart, currentIndexEnd);
    }

    return blocks;
}
