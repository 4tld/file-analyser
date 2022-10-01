import { type BlockConstruction, ChunkTypes } from '../util/types'

export class Block {
  public analysed = false
  public start = 0
  public id = ''
  public name = ''
  public type = ChunkTypes.unknown
  public description = ''
  public length = 0
  public subBlocks: Block[] = []

  public constructor (construction: BlockConstruction) {
    Object.assign(this, construction)
    this.analysed = construction.analysed ?? Boolean(construction.type)
  }

  public get end () {
    return this.start + this.length - 1
  }

  public update (props: BlockConstruction) {
    Object.assign(this, props)
    return this
  }
}
