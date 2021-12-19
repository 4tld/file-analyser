import { littleEndianStringToNumber } from '../util/converters'

export default [
  {
    name: 'RIFF Chunk',
    pattern: /(?<type>RIFF|CPPO|PAL |RDIB|RMID|RMMP|WAVE|fmt |data)(?<length>.{4})/su,
    createBlock: (match) => {
      const dataLength = littleEndianStringToNumber(match.groups.length)
      const subBlocks = [
        {
          start: match.index,
          type: 'identifier',
          analysed: true,
          contents: match.groups.type,
        },
        {
          start: match.index + 4,
          type: 'chunk length',
          analysed: true,
          contents: match.groups.length,
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
        type: `${match.groups.type} container`,
        contents: match.input.slice(match.index, match.index + 8 + dataLength),
        subBlocks,
      }
    },
  },
]
