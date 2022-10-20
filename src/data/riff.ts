import { littleEndian32StringToNumber } from '../util/converters'
import { Block, BlockInfo } from '../classes'
import { type BlockInfoConstruction, ChunkTypes } from '../util/types'
import { re } from '../util/regex'

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
    pattern: re`(?<type>${riffTypes})(?<length>.{4})(?<format>${riffFormats})?`,
    name: ({ groups }) => `${groups.format} ${groups.type} container`,
    type: ChunkTypes.chunk,
    length: ({ groups }) => {
      const dataLength = littleEndian32StringToNumber(groups.length)
      return 8 + dataLength
    },
    subBlocks: ({ groups, index }) => {
      const dataLength = littleEndian32StringToNumber(groups.length)
      const subBlocks = [
        new Block({
          start: index,
          name: 'identifier',
          type: ChunkTypes.ascii,
          length: 4,
        }),
        new Block({
          start: index + 4,
          name: 'chunk length',
          type: ChunkTypes.intle32,
          length: 4,
        }),
      ]
      if (dataLength > 0) {
        if (groups.format) {
          subBlocks.push(new Block({
            start: index + 8,
            name: 'chunk format',
            type: ChunkTypes.ascii,
            length: 4,
          }))
        }
        const offset = groups.format ? 12 : 8
        subBlocks.push(new Block({
          start: index + offset,
          name: 'chunk data',
          length: 8 - offset + dataLength,
        }))
      }
      return subBlocks
    },
  },
]
export default riff.map((info) => new BlockInfo(info))
