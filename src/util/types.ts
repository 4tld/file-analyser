import type { Block } from '../classes'

type FormatMatch = {
  content: string
  groups: Record<string, string>
  index: number
}

export enum ChunkTypes { unknown, ascii, binary, chunk, fixed, intbe32, intle32, intss32 }
export type FromRegex<T> = (match: FormatMatch) => T

export type BlockConstruction = {
  analysed?: boolean
  start?: number
  id?: string
  name?: string
  type?: ChunkTypes
  description?: string
  length?: number
  subBlocks?: Block[]
}

export type BlockInfoConstruction = {
  level?: number
  context?: string[]
  pattern: RegExp
  id?: string
  name?: FromRegex<string>|string
  type?: ChunkTypes|FromRegex<ChunkTypes>
  description?: FromRegex<string>|string
  length?: FromRegex<number>|number
  subBlocks?: FromRegex<Block[]>
}
