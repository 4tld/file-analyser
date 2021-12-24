import { bigEndian32StringToNumber } from '../util/converters'

const pngChunkDescriptions = {
  ftyp: '',
}

export default [
  {
    name: 'MP4 Chunk',
    level: 2,
    pattern: /(?<length>.{4})(?<type>ftyp|mdat|moov|pnot|udta|uuid|moof|free|skip|jP2 |wide|load|ctab|imap|matt|kmat|clip|crgn|sync|chap|tmcd|scpt|ssrc|PICT)/su,
    createBlock: (match) => {
      const dataLength = bigEndian32StringToNumber(match.groups.length)
      const subBlocks = [
        {
          start: match.index,
          name: 'chunk length',
          type: 'intbe32',
          analysed: true,
          contents: match.groups.length,
        },
        {
          start: match.index + 4,
          name: 'chunk type',
          type: 'ascii',
          analysed: true,
          contents: match.groups.type,
        },
      ]
      if (dataLength > 0) {
        subBlocks.splice(2, 0, {
          start: match.index + 8,
          name: 'chunk data',
          type: 'unknown',
          analysed: false,
          contents: match.input.slice(match.index + 8, match.index + 4 + dataLength),
        })
      }
      return {
        name: `MP4 ${pngChunkDescriptions[match.groups.type] || `${match.groups.type} Chunk`}`,
        type: 'chunk',
        contents: match.input.slice(match.index, match.index + 4 + dataLength),
        subBlocks,
      }
    },
  },
]
