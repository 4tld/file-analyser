import { bigEndianstringToNumber } from '../util/converters'

export default [
  {
    name: 'PNG Magic Number',
    pattern: /\x89PNG\r\n\x1A\n/u,
  },
  {
    name: 'PNG Chunk',
    pattern: /(?<length>.{4})(?<type>IHDR|PLTE|IDAT|IEND|bKGD|cHRM|dSIG|iCCP|iTXt|pHYs|sBIT|sPLT|sRGB|sTER|tEXt|tIME|tRNS|zTXt)/su,
    createBlock: (match) => {
      const dataLength = bigEndianstringToNumber(match.groups.length)
      return {
        type: `PNG ${match.groups.type} Header`,
        contents: match.input.slice(match.index, match.index + 8 + dataLength + 4),
        subBlocks: [
          {
            start: match.index,
            type: 'chunk length',
            analysed: true,
            contents: match.groups.length,
          },
          {
            start: match.index + 4,
            type: 'chunk type',
            analysed: true,
            contents: match.groups.type,
          },
          {
            start: match.index + 8,
            type: 'chunk data',
            analysed: true,
            contents: match.input.slice(match.index + 8, match.index + 8 + dataLength),
          },
          {
            start: match.index + 8 + dataLength,
            type: 'chunk CRC',
            analysed: true,
            contents: match.input.slice(match.index + 8 + dataLength, match.index + 8 + dataLength + 4),
          },
        ],
      }
    },
  },
]
