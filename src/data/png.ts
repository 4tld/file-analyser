import { bigEndian32StringToNumber } from '../util/converters'
import { Block, BlockInfo } from '../classes'
import { type BlockInfoConstruction, ChunkTypes } from '../util/types'
import { re } from '../util/regex'

// http://www.libpng.org/pub/png/
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
    pattern: re`\x89PNG\r\n\cZ\n.*`,
    name: 'PNG File',
    type: ChunkTypes.chunk,
    subBlocks: ({ content: { length }, index }) => [
      new Block({
        start: index,
        name: 'PNG Magic Number',
        type: ChunkTypes.fixed,
        length: 8,
      }),
      new Block({
        id: 'PNG',
        start: index + 8,
        name: 'PNG Content',
        length: length - 8,
      }),
    ],
  },
  {
    pattern: re`(?<length>.{4})(?<type>${Object.keys(pngChunkDescriptions).join('|')})`,
    name: ({ groups }) => `PNG ${pngChunkDescriptions[groups.type] || `${groups.type} Chunk`}`,
    type: ChunkTypes.chunk,
    length: ({ groups }) => {
      const dataLength = bigEndian32StringToNumber(groups.length)
      return 8 + dataLength + 4
    },
    context: ['PNG'],
    subBlocks: ({ groups, index }) => {
      const dataLength = bigEndian32StringToNumber(groups.length)
      const subBlocks = [
        new Block({
          start: index,
          name: 'chunk length',
          type: ChunkTypes.intbe32,
          length: 4,
        }),
        new Block({
          start: index + 4,
          name: 'chunk type',
          type: ChunkTypes.ascii,
          length: 4,
        }),
        new Block({
          start: index + 8 + dataLength,
          name: 'chunk CRC',
          type: ChunkTypes.binary,
          length: 4,
        }),
      ]
      if (dataLength > 0) {
        subBlocks.splice(2, 0, new Block({
          id: `PNG:${groups.type}`,
          start: index + 8,
          name: 'chunk data',
          length: dataLength,
        }))
      }
      return subBlocks
    },
  },
]
export default png.map((info) => new BlockInfo(info))
