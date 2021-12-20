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
      const dataLength = 0
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
          analysed: true,
          contents: match.groups.flags,
        },
        {
          start: match.index + 6,
          name: 'chunk length',
          type: 'intSync32',
          analysed: true,
          contents: match.groups.length,
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
