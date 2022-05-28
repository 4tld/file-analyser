import { littleEndian32StringToNumber } from '../util/converters'
import { BlockInfo } from '../classes/BlockInfo'

const riffMainChunks = 'RIFF|LIST|JUNK|DISP|PAD |PEAK'
const riffSubChunks = 'fmt |data|fact|idx1|anih|vedt|bext|id3 '
const riffWaveMetadata = 'INAM|IPRD|IART|ICRD|ITRK|ICMT|IKEY|ISFT|IENG|ITCH|IGNR|ICOP|ISBJ|ISRC'
const riffTypes = `${riffMainChunks}|${riffSubChunks}|${riffWaveMetadata}`

const riffFileTypes = 'ACON|AVI |CDDA|CPPO|PAL |QLCM|RDIB|RMID|RMMP|WAVE'
const riffListTypes = 'INFO|wvpl|wave|lins|ins |lrgn|movi|rec |rgn |rgn2|lart|lar2|adtl'
const riffFormats = `${riffFileTypes}|${riffListTypes}`

export default [
  {
    level: 2,
    pattern: RegExp(String.raw`(?<type>${riffTypes})(?<length>.{4})(?<format>${riffFormats})?`, 'su'),
    name: (match) => `${match.groups.format || ''} ${match.groups.type} container`,
    type: 'chunk',
    contents: (match) => {
      const dataLength = littleEndian32StringToNumber(match.groups.length)
      return match.input.slice(match.index, match.index + 8 + dataLength)
    },
    subBlocks: (match) => {
      const dataLength = littleEndian32StringToNumber(match.groups.length)
      const subBlocks = [
        {
          start: match.index,
          name: 'identifier',
          type: 'ascii',
          analysed: true,
          contents: match.groups.type,
        },
        {
          start: match.index + 4,
          name: 'chunk length',
          type: 'intle32',
          analysed: true,
          contents: match.groups.length,
        },
      ]
      if (dataLength > 0) {
        if (match.groups.format) {
          subBlocks.push({
            start: match.index + 8,
            name: 'chunk format',
            type: 'ascii',
            analysed: true,
            contents: match.groups.format,
          })
        }
        const offset = match.groups.format ? 12 : 8
        subBlocks.push({
          start: match.index + offset,
          name: 'chunk data',
          type: 'unknown',
          analysed: false,
          contents: match.input.slice(match.index + offset, match.index + 8 + dataLength),
        })
      }
      return subBlocks
    },
  },
].map((info) => new BlockInfo(info))
