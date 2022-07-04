import { BlockInfo } from '../classes'
import { BlockInfoConstruction, ChunkTypes } from '../util/types'

const magic: BlockInfoConstruction[] = [
  {
    level: -1,
    pattern: /\0{5,}/su,
    name: 'Zero padding',
    type: ChunkTypes.binary,
  },
  {
    pattern: /8BPS/su,
    name: 'Photoshop document magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /^(?:CWS|FWS|ZWS)/su,
    name: 'SWF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /dex\n035\0/su,
    name: 'Dalvik executable magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /GIF(?<version>87a|89a)/su,
    name: ({ groups }) => `GIF version ${groups.version} magic number`,
    type: ChunkTypes.fixed,
  },
  {
    pattern: /gimp xcf /su,
    name: 'XCF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /LZIP/su,
    name: 'LZIP compressed magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /^MZ/su,
    name: 'DOS MZ executable magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /%PDF-/su,
    name: 'PDF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: /PK(?<type>\cC\cD|\cE\cF|\cG\cH)/su,
    name: 'ZIP compressed magic number',
    type: ChunkTypes.fixed,
    contents: (match) => match[0].slice(0, 2),
  },
  {
    pattern: /OggS/su,
    name: 'OGG magic number',
    type: ChunkTypes.fixed,
  },
]
export default magic.map((info) => new BlockInfo(info))
