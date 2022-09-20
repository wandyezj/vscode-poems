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
     * text
     */
    text: string;
}
