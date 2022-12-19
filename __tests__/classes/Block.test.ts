import { describe, expect, it } from 'vitest'
import { ChunkTypes } from '../../src/util/types'
import { Block } from '../../src/classes/Block'

describe('Block class test', () => {
  it('default block and update', () => {
    const block = new Block({})

    expect(block.analysed).toBe(false)
    expect(block.start).toBe(0)
    expect(block.id).toBe('')
    expect(block.name).toBe('')
    expect(block.type).toBe(ChunkTypes.unknown)
    expect(block.description).toBe('')
    expect(block.length).toBe(0)
    expect(block.subBlocks).toEqual([])
    expect(block.end).toBe(0)

    block.update({
      analysed: true,
      start: 19,
      id: 'id',
      name: 'name',
      type: ChunkTypes.binary,
      description: 'description',
      length: 14,
      subBlocks: [new Block({})],
    })

    expect(block.analysed).toBe(true)
    expect(block.start).toBe(19)
    expect(block.id).toBe('id')
    expect(block.name).toBe('name')
    expect(block.type).toBe(ChunkTypes.binary)
    expect(block.description).toBe('description')
    expect(block.length).toBe(14)
    expect(block.subBlocks).toEqual([new Block({})])
    expect(block.end).toBe(19 + 14)
  })

  it('test block', () => {
    const block = new Block({
      analysed: true,
      start: 19,
      id: 'id',
      name: 'name',
      type: ChunkTypes.binary,
      description: 'description',
      length: 14,
      subBlocks: [new Block({})],
    })

    expect(block.analysed).toBe(true)
    expect(block.start).toBe(19)
    expect(block.id).toBe('id')
    expect(block.name).toBe('name')
    expect(block.type).toBe(ChunkTypes.binary)
    expect(block.description).toBe('description')
    expect(block.length).toBe(14)
    expect(block.subBlocks).toEqual([new Block({})])
    expect(block.end).toBe(19 + 14)
  })
})
