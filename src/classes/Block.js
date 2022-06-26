export class Block {
  analysed
  start
  name
  type
  description
  contents
  subBlocks

  constructor ({
    analysed,
    start,
    name,
    type,
    description,
    contents,
    subBlocks,
  }) {
    this.analysed = analysed ?? Boolean(type)
    this.start = start ?? 0
    this.name = name ?? ''
    this.type = type ?? 'unknown'
    this.description = description ?? ''
    this.contents = contents ?? ''
    this.subBlocks = subBlocks ?? []
  }

  update (props) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key]
    })
    return this
  }
}
