import { bigEndianstringToNumber } from '../util/converters'

const pngChunkDescriptions = {
  IHDR: 'Image header',
  PLTE: 'Palette table',
  IDAT: 'Image Data',
  IEND: 'Image end',
  tRNS: 'Transparency',
  cHRM: 'Primary chromaticities',
  gAMA: 'Gamma',
  iCCP: 'ICC profile',
  sBIT: 'Significant bits',
  sRGB: 'Standard RGB colour space',
  tEXt: 'Textual data',
  zTXt: 'Compressed textual data',
  iTXt: 'International textual data',
  bKGD: 'Background colour',
  hIST: 'histogram',
  pHYs: 'Physical pixel dimensions',
  sPLT: 'Suggested palette',
  tIME: 'Last-modification time',
  dSIG: 'Digital signature',
  sTER: 'Stereoscopic image indicator',
  eXIf: 'Exif metadata',
}

export default [
  {
    name: 'PNG Magic Number',
    pattern: /\x89PNG\r\n\x1A\n/u,
  },
  {
    name: 'PNG Chunk',
    pattern: /(?<length>.{4})(?<type>IHDR|PLTE|IDAT|IEND|tRNS|cHRM|gAMA|iCCP|sBIT|sRGB|tEXt|zTXt|iTXt|bKGD|hIST|pHYs|sPLT|tIME|dSIG|sTER|eXIf)/su,
    createBlock: (match) => {
      const dataLength = bigEndianstringToNumber(match.groups.length)
      const subBlocks = [
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
          start: match.index + 8 + dataLength,
          type: 'chunk CRC',
          analysed: true,
          contents: match.input.slice(match.index + 8 + dataLength, match.index + 8 + dataLength + 4),
        },
      ]
      if (dataLength > 0) {
        subBlocks.splice(2, 0, {
          start: match.index + 8,
          type: 'chunk data',
          analysed: false,
          contents: match.input.slice(match.index + 8, match.index + 8 + dataLength),
        })
      }
      return {
        type: `PNG ${pngChunkDescriptions[match.groups.type] || `${match.groups.type} Chunk`}`,
        contents: match.input.slice(match.index, match.index + 8 + dataLength + 4),
        subBlocks,
      }
    },
  },
]
