import { describe, expect, it } from 'vitest'
import { stringToBinary } from '../../src/util/converters'

describe('stringToBinary test', () => {
  it('empty string', () => {
    expect(stringToBinary('')).toBe('')
  })

  it('basic', () => {
    expect(stringToBinary('hello')).toBe('0110100001100101011011000110110001101111')
  })

  it('special chars', () => {
    expect(stringToBinary('\xFF\x86😋')).toBe('111111111000011000111101')
  })
})
