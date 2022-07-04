import { BlockInfoConstruction, ChunkTypes, FromRegex } from '../util/types'
import { Block } from './Block'

export class BlockInfo {
  level = 0
  pattern: RegExp = new RegExp('')
  name: FromRegex<string> = () => ''
  type: FromRegex<ChunkTypes> = () => ChunkTypes.unknown
  description: FromRegex<string> = () => ''
  contents: FromRegex<string> = () => ''
  subBlocks: FromRegex<Block[]> = () => []

  constructor (construction: BlockInfoConstruction) {
    Object.assign(this, construction)

    const { name, type, description, contents } = construction
    if (typeof name === 'string') this.name = () => name
    if (typeof type === 'number') this.type = () => type
    if (typeof description === 'string') this.description = () => description
    if (typeof contents === 'string') { this.contents = () => contents }
  }

  block (analysedBlock: Block) {
    const match = analysedBlock.contents.match(this.pattern) as RegExpMatchArray & { groups: object, index: number, input: string }
    if (!match?.index || !match?.input || !match?.groups) {
      return false
    }
    return new Block({
      start: analysedBlock.start + match.index,
      name: this.name(match),
      type: this.type(match),
      description: this.description ? this.description(match) : '',
      contents: this.contents ? this.contents(match) : match[0],
      subBlocks: this.subBlocks ? this.subBlocks(match) : [],
    })
  }
}
