import { Block } from '../classes'

type FormatMatch = {
  content: string,
  groups: Record<string, string>,
  index: number
}

export enum ChunkTypes { unknown, ascii, binary, chunk, fixed, intbe32, intle32, intss32 }
export type FromRegex<T> = (match: FormatMatch) => T

export type BlockConstruction = {
  analysed?: boolean
  start?: number
  name?: string
  type?: ChunkTypes
  description?: string
  length?: number
  subBlocks?: Block[]
}
export type BlockInfoConstruction = {
  level?: number
  pattern: RegExp
  name?: string|FromRegex<string>
  type?: ChunkTypes|FromRegex<ChunkTypes>
  description?: string|FromRegex<string>
  length?: number|FromRegex<number>
  subBlocks?: FromRegex<Block[]>
}
