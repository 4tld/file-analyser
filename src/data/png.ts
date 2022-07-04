import { bigEndian32StringToNumber } from '../util/converters'
import { Block, BlockInfo } from '../classes'
import { BlockInfoConstruction, ChunkTypes } from '../util/types'

const pngChunkDescriptions = {
  bKGD: 'Background colour',
  cHRM: 'Primary chromaticities',
  dSIG: 'Digital signature',
  eXIf: 'Exif metadata',
  gAMA: 'Gamma',
  hIST: 'histogram',
  iCCP: 'ICC profile',
  IDAT: 'Image Data',
  IEND: 'Image end',
  IHDR: 'Image header',
  iTXt: 'International textual data',
  pHYs: 'Physical pixel dimensions',
  PLTE: 'Palette table',
  sBIT: 'Significant bits',
  sPLT: 'Suggested palette',
  sRGB: 'Standard RGB colour space',
  sTER: 'Stereoscopic image indicator',
  tEXt: 'Textual data',
  tIME: 'Last-modification time',
  tRNS: 'Transparency',
  zTXt: 'Compressed textual data',
} as Record<string, string>

const png: BlockInfoConstruction[] = [
  {
    pattern: /\x89PNG\r\n\cZ\n/su,
    name: 'PNG Magic Number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /(?<length>.{4})(?<type>IHDR|PLTE|IDAT|IEND|tRNS|cHRM|gAMA|iCCP|sBIT|sRGB|tEXt|zTXt|iTXt|bKGD|hIST|pHYs|sPLT|tIME|dSIG|sTER|eXIf)/su,
    name: ({ groups }) => `PNG ${pngChunkDescriptions[groups.type] || `${groups.type} Chunk`}`,
    type: ChunkTypes.chunk,
    contents: ({ groups, index, input }) => {
      const dataLength = bigEndian32StringToNumber(groups.length)
      return input.slice(index, index + 8 + dataLength + 4)
    },
    subBlocks: ({ groups, index, input }) => {
      const dataLength = bigEndian32StringToNumber(groups.length)
      const subBlocks = [
        new Block({
          start: index,
          name: 'chunk length',
          type: ChunkTypes.intbe32,
          contents: groups.length,
        }),
        new Block({
          start: index + 4,
          name: 'chunk type',
          type: ChunkTypes.ascii,
          contents: groups.type,
        }),
        new Block({
          start: index + 8 + dataLength,
          name: 'chunk CRC',
          type: ChunkTypes.binary,
          contents: input.slice(index + 8 + dataLength, index + 8 + dataLength + 4),
        }),
      ]
      if (dataLength > 0) {
        subBlocks.splice(2, 0, new Block({
          start: index + 8,
          name: 'chunk data',
          contents: input.slice(index + 8, index + 8 + dataLength),
        }))
      }
      return subBlocks
    },
  },
]
export default png.map((info) => new BlockInfo(info))
