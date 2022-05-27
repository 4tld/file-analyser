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
    this.level = level ?? 0
    this.pattern = pattern
    this.name = name
    this.type = type
    this.description = description
    this.contents = contents
    this.subBlocks = subBlocks
  }

  block (analysedBlock) {
    const match = analysedBlock.contents.match(this.pattern)
    if (!match) {
      return false
    }
    return {
      analysed: true,
      start: analysedBlock.start + match.index,
      name: this.name(match),
      type: this.type(match),
      description: this.description ? this.description(match) : '',
      contents: this.contents ? this.contents(match) : match[0],
      subBlocks: this.subBlocks ? this.subBlocks(match) : [],
    }
  }
}
