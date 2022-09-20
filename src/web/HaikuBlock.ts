export interface HaikuBlock {
    index: {
        /**
         * before block start
         */
        start: number;
        /**
         * after block end
         */
        end: number;
    };

    /**
     * text between block delimiters
     */
    innerText: {
        /**
         * where text starts
         */
        start: number;

        /**
         * where text ends
         */
        end: number;

        /**
         * text
         */
        text: string;
    };
}
