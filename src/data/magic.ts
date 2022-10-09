import { BlockInfo } from '../classes'
import { re } from '../util/regex'
import { type BlockInfoConstruction, ChunkTypes } from '../util/types'

const magic: BlockInfoConstruction[] = [
  {
    level: -1,
    pattern: re`/\0{5,}`,
    name: 'Zero padding',
    type: ChunkTypes.binary,
  },
  {
    pattern: re`8BPS`,
    name: 'Photoshop document magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`^(?:CWS|FWS|ZWS)`,
    name: 'SWF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`dex\n035\0`,
    name: 'Dalvik executable magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`GIF(?<version>87a|89a)`,
    name: ({ groups }) => `GIF version ${groups.version} magic number`,
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`gimp xcf `,
    name: 'XCF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`LZIP`,
    name: 'LZIP compressed magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`^MZ`,
    name: 'DOS MZ executable magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`%PDF-`,
    name: 'PDF magic number',
    type: ChunkTypes.fixed,
  },
  {
    pattern: re`OggS`,
    name: 'OGG magic number',
    type: ChunkTypes.fixed,
  },
]
export default magic.map((info) => new BlockInfo(info))
