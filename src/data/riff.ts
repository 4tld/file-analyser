import { littleEndian32StringToNumber } from '../util/converters'
import { Block, BlockInfo } from '../classes'
import { BlockInfoConstruction, ChunkTypes } from '../util/types'

const riffMainChunks = 'RIFF|LIST|JUNK|DISP|PAD |PEAK'
const riffSubChunks = 'fmt |data|fact|idx1|anih|vedt|bext|id3 '
const riffWaveMetadata = 'INAM|IPRD|IART|ICRD|ITRK|ICMT|IKEY|ISFT|IENG|ITCH|IGNR|ICOP|ISBJ|ISRC'
const riffTypes = `${riffMainChunks}|${riffSubChunks}|${riffWaveMetadata}`

const riffFileTypes = 'ACON|AVI |CDDA|CPPO|PAL |QLCM|RDIB|RMID|RMMP|WAVE'
const riffListTypes = 'INFO|wvpl|wave|lins|ins |lrgn|movi|rec |rgn |rgn2|lart|lar2|adtl'
const riffFormats = `${riffFileTypes}|${riffListTypes}`

const riff: BlockInfoConstruction[] = [
  {
    level: 2,
    pattern: RegExp(String.raw`(?<type>${riffTypes})(?<length>.{4})(?<format>${riffFormats})?`, 'su'),
    name: ({ groups }) => `${groups.format || ''} ${groups.type} container`,
    type: ChunkTypes.chunk,
    contents: ({ groups, index, input }) => {
      const dataLength = littleEndian32StringToNumber(groups.length)
      return input.slice(index, index + 8 + dataLength)
    },
    subBlocks: ({ groups, index, input }) => {
      const dataLength = littleEndian32StringToNumber(groups.length)
      const subBlocks = [
        new Block({
          start: index,
          name: 'identifier',
          type: ChunkTypes.ascii,
          contents: groups.type,
        }),
        new Block({
          start: index + 4,
          name: 'chunk length',
          type: ChunkTypes.intle32,
          contents: groups.length,
        }),
      ]
      if (dataLength > 0) {
        if (groups.format) {
          subBlocks.push(new Block({
            start: index + 8,
            name: 'chunk format',
            type: ChunkTypes.ascii,
            contents: groups.format,
          }))
        }
        const offset = groups.format ? 12 : 8
        subBlocks.push(new Block({
          start: index + offset,
          name: 'chunk data',
          contents: input.slice(index + offset, index + 8 + dataLength),
        }))
      }
      return subBlocks
    },
  },
]
export default riff.map((info) => new BlockInfo(info))
