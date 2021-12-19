
export default [
  {
    name: 'Photoshop document magic number',
    type: 'fixed',
    pattern: /8BPS/su,
  },
  {
    name: 'SWF magic number',
    type: 'fixed',
    pattern: /CWS|FWS|ZWS/su,
  },
  {
    name: 'Dalvik executable magic number',
    type: 'fixed',
    pattern: /dex\n035\x00/su,
  },
  {
    type: 'fixed',
    pattern: /GIF(?<version>87a|89a)/su,
    createBlock: (match) => ({
      name: `GIF version ${match.groups.version} magic number`,
    }),
  },
  {
    name: 'XCF magic number',
    type: 'fixed',
    pattern: /gimp xcf /su,
  },
  {
    name: 'ID3 container header',
    type: 'fixed',
    pattern: /ID3/su,
  },
  {
    name: 'LZIP compressed magic number',
    type: 'fixed',
    pattern: /LZIP/su,
  },
  {
    name: 'DOS MZ executable magic number',
    type: 'fixed',
    pattern: /^MZ/su,
  },
  {
    name: 'PDF magic number',
    type: 'fixed',
    pattern: /%PDF-/su,
  },
  {
    name: 'ZIP compressed magic number',
    type: 'fixed',
    pattern: /PK(?<type>\x03\x04|\x05\x06|\x07\x08)/su,
    createBlock: (match) => ({
      content: match[0].slice(0, 2),
    }),
  },
  {
    name: 'OGG magic number',
    type: 'fixed',
    pattern: /OggS/su,
  },
]
