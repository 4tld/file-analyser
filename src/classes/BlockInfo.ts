import { re } from '../util/regex'
import { BlockInfoConstruction, ChunkTypes, FromRegex } from '../util/types'
import { Block } from './Block'

export class BlockInfo {
  level = 0
  pattern: RegExp = re``
  name: FromRegex<string> = () => ''
  type: FromRegex<ChunkTypes> = () => ChunkTypes.unknown
  description: FromRegex<string> = () => ''
  length: FromRegex<number> = (match) => match.content.length
  subBlocks: FromRegex<Block[]> = () => []

  constructor (construction: BlockInfoConstruction) {
    Object.assign(this, construction)

    const { name, type, description, length } = construction
    if (typeof name === 'string') this.name = () => name
    if (typeof type === 'number') this.type = () => type
    if (typeof description === 'string') this.description = () => description
    if (typeof length === 'number') this.length = () => length
  }

  findMatches (file: { contents: string }, range: [number, number?] = [0]) {
    const input = file.contents.slice(...range)
    const matches = input.matchAll(this.pattern)
    return [...matches].map((match) => {
      const matchFormat = { content: match[0], groups: match.groups ?? {}, index: range[0] + Number(match.index), input }
      return new Block({
        start: matchFormat.index,
        name: this.name(matchFormat),
        type: this.type(matchFormat),
        description: this.description(matchFormat),
        length: this.length(matchFormat),
        subBlocks: this.subBlocks(matchFormat),
      })
    })
  }
}
