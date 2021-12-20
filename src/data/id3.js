import { syncsafe32StringToNumber } from '../util/converters'

export default [
  {
    name: 'ID3v1 container',
    type: 'fixed',
    pattern: /TAG.{125}/su,
  },
  {
    name: 'ID3v2 container header',
    type: 'fixed',
    pattern: /ID3(?<version>[^\xFF]{2})(?<flags>.)(?<length>[\0-\x7F]{4})/su,
    createBlock: (match) => {
      const dataLength = syncsafe32StringToNumber(match.groups.length)
      const unsynchronisation = match.groups.flags & 0b10000000 > 0
      const extendedHeader = match.groups.flags & 0b01000000 > 0
      const experimental = match.groups.flags & 0b00100000 > 0
      const footer = match.groups.flags & 0b00010000 > 0
      const subBlocks = [
        {
          start: match.index,
          name: 'ID3v2 magic number',
          type: 'fixed',
          analysed: true,
          contents: 'ID3',
        },
        {
          start: match.index + 3,
          name: `ID3v2 version ${match.groups.version[0].charCodeAt()}.${match.groups.version[1].charCodeAt()}`,
          type: 'fixed',
          analysed: true,
          contents: match.groups.version,
        },
        {
          start: match.index + 5,
          name: 'ID3v2 flags',
          type: 'binary',
          description: `Unsynchronisation: ${unsynchronisation ? 'yes' : 'no'} /
                        Extended header: ${extendedHeader ? 'yes' : 'no'} /
                        Experimental: ${experimental ? 'yes' : 'no'} /
                        Footer: ${footer ? 'yes' : 'no'}`,
          analysed: true,
          contents: match.groups.flags,
        },
        {
          start: match.index + 6,
          name: 'chunk length',
          type: 'intss32',
          analysed: true,
          contents: match.groups.length,
        },
        {
          start: match.index + 10,
          name: 'chunk data',
          type: 'unknown',
          analysed: false,
          contents: match.input.slice(match.index + 10, match.index + 10 + dataLength),
        },
      ]
      return {
        name: 'ID3v2 container',
        type: 'chunk',
        contents: match.input.slice(match.index, match.index + 10 + dataLength),
        subBlocks,
      }
    },
  },
]
