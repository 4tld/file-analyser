import { BlockInfo } from '../classes'
import { re } from '../util/regex'
import { type BlockInfoConstruction, ChunkTypes } from '../util/types'

const deflate: BlockInfoConstruction[] = [
  {
    pattern: re`.*`,
    name: 'Deflate content',
    type: ChunkTypes.binary,
    context: ['PNG:IDAT'],
  },
]
export default deflate.map((info) => new BlockInfo(info))
