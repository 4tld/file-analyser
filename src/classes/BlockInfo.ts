import { re } from '../util/regex'
import { type BlockInfoConstruction, ChunkTypes, type FromRegex } from '../util/types'
import { Block } from './Block'

export class BlockInfo {
  public level = 0
  public context: string[] = []
  private readonly pattern = re``
  private readonly id = ''

  public constructor (construction: BlockInfoConstruction) {
    Object.assign(this, construction)

    const { name, type, description, length } = construction
    if (typeof name === 'string') this.name = () => name
    if (typeof type === 'number') this.type = () => type
    if (typeof description === 'string') this.description = () => description
    if (typeof length === 'number') this.length = () => length
  }

  public findMatches (file: { contents: string }, range: [number, number?] = [0]) {
    const matches = file.contents.slice(...range).matchAll(this.pattern)
    return [...matches].map((match) => {
      const matchFormat = { content: match[0], groups: match.groups ?? {}, index: range[0] + Number(match.index) }
      return new Block({
        start: matchFormat.index,
        id: this.id,
        name: this.name(matchFormat),
        type: this.type(matchFormat),
        description: this.description(matchFormat),
        length: this.length(matchFormat),
        subBlocks: this.subBlocks(matchFormat),
      })
    })
  }

  private readonly name: FromRegex<string> = () => ''
  private readonly type: FromRegex<ChunkTypes> = () => ChunkTypes.unknown
  private readonly description: FromRegex<string> = () => ''
  private readonly length: FromRegex<number> = (match) => match.content.length
  private readonly subBlocks: FromRegex<Block[]> = () => []
}
