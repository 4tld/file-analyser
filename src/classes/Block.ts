import { BlockConstruction, ChunkTypes } from '../util/types'

export class Block {
  analysed = false
  start = 0
  name = ''
  type = ChunkTypes.unknown
  description = ''
  contents = ''
  subBlocks: Block[] = []

  constructor (construction: BlockConstruction) {
    Object.assign(this, construction)
    this.analysed = construction.analysed ?? Boolean(construction.type)
  }

  update (props: BlockConstruction) {
    Object.assign(this, props)
    return this
  }
}
