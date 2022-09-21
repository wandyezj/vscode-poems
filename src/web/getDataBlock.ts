import { delimiterDataBlockEnd, delimiterDataBlockStart } from "./delimiters";

export function getDataBlock(text: string):
| {
      data: string;
      startIndex: number;
      endIndex: number;
  }
| undefined {


const startIndexA = text.indexOf(delimiterDataBlockStart);

if (startIndexA === -1) {
    return undefined;
}

const startIndex =  startIndexA + delimiterDataBlockStart.length

const endIndex = text.indexOf(delimiterDataBlockEnd, startIndex);

if (endIndex === -1) {
    return undefined;
}

const data = text.substring(startIndex, endIndex);

return {
    startIndex,
    endIndex,
    data,
};
}