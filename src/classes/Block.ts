import { BlockConstruction, ChunkTypes } from '../util/types'

export class Block {
  analysed = false
  start = 0
  id = ''
  name = ''
  type = ChunkTypes.unknown
  description = ''
  length = 0
  subBlocks: Block[] = []

  constructor (construction: BlockConstruction) {
    Object.assign(this, construction)
    this.analysed = construction.analysed ?? Boolean(construction.type)
  }

  get end () {
    return this.start + this.length - 1
  }

  update (props: BlockConstruction) {
    Object.assign(this, props)
    return this
  }
}
