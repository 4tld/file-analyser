import { BlockInfo } from '../classes/BlockInfo'

export default [
  {
    pattern: /\0{5,}/su,
    name: 'Zero padding',
    type: 'binary',
  },
  {
    pattern: /8BPS/su,
    name: 'Photoshop document magic number',
    type: 'fixed',
  },
  {
    pattern: /^(?:CWS|FWS|ZWS)/su,
    name: 'SWF magic number',
    type: 'fixed',
  },
  {
    pattern: /dex\n035\0/su,
    name: 'Dalvik executable magic number',
    type: 'fixed',
  },
  {
    pattern: /GIF(?<version>87a|89a)/su,
    name: (match) => `GIF version ${match.groups.version} magic number`,
    type: 'fixed',
  },
  {
    pattern: /gimp xcf /su,
    name: 'XCF magic number',
    type: 'fixed',
  },
  {
    pattern: /LZIP/su,
    name: 'LZIP compressed magic number',
    type: 'fixed',
  },
  {
    pattern: /^MZ/su,
    name: 'DOS MZ executable magic number',
    type: 'fixed',
  },
  {
    pattern: /%PDF-/su,
    name: 'PDF magic number',
    type: 'fixed',
  },
  {
    pattern: /PK(?<type>\cC\cD|\cE\cF|\cG\cH)/su,
    name: 'ZIP compressed magic number',
    type: 'fixed',
    contents: (match) => match[0].slice(0, 2),
  },
  {
    pattern: /OggS/su,
    name: 'OGG magic number',
    type: 'fixed',
  },
].map((info) => new BlockInfo(info))
