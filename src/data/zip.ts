import { Block, BlockInfo } from '../classes'
import { re } from '../util/regex'
import { type BlockInfoConstruction, ChunkTypes } from '../util/types'

const zip: BlockInfoConstruction[] = [
  {
    pattern: re`PK\cC\cD.*`,
    name: 'ZIP compressed file',
    type: ChunkTypes.chunk,
    subBlocks: ({ content: { length }, index }) => [
      new Block({
        start: index,
        name: 'Local file header',
        type: ChunkTypes.chunk,
        length: 30,
      }),
      new Block({
        id: 'PNG',
        start: index + 30,
        name: 'Local file content',
        length: length - 30,
      }),
    ],
  },
  {
    pattern: re`PK\cE\cF.*`,
    name: 'Empty ZIP file',
  },
  {
    pattern: re`PK\cG\cH.*`,
    name: 'Spanned ZIP file',
  },
]
export default zip.map((info) => new BlockInfo(info))
