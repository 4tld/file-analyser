import { littleEndian32StringToNumber } from '../util/converters'

export default [
  {
    name: 'RIFF Chunk',
    pattern: /(?<type>RIFF|fmt |data|fact|LIST)(?<length>.{4})(?<format>ACON|AVI |CDDA|CPPO|PAL |QLCM|RDIB|RMID|RMMP|WAVE|INFO|wvpl|wave|lins|ins |lrgn|rgn |rgn2|lart|lar2)?/su,
    createBlock: (match) => {
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
      return {
        name: `${match.groups.format || ''} ${match.groups.type} container`,
        type: 'chunk',
        contents: match.input.slice(match.index, match.index + 8 + dataLength),
        subBlocks,
      }
    },
  },
]
