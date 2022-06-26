import { Block } from './Block'

export class BlockInfo {
  level
  pattern
  name
  type
  description
  contents
  subBlocks

  constructor ({
    level,
    pattern,
    name,
    type,
    description,
    contents,
    subBlocks,
  }) {
    function initField (field) {
      return typeof field == 'string' ? () => field : field
    }
    this.level = level ?? 0
    this.pattern = pattern
    this.name = initField(name)
    this.type = initField(type)
    this.description = initField(description)
    this.contents = initField(contents)
    this.subBlocks = initField(subBlocks)
  }

  block (analysedBlock) {
    const match = analysedBlock.contents.match(this.pattern)
    if (!match) {
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
