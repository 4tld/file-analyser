import { Block } from '../classes'

export enum ChunkTypes { ascii, binary, chunk, fixed, intbe32, intle32, intss32, unknown }
export type FromRegex<T> = ((match: RegExpMatchArray & { groups: object, index: number, input: string }) => T)

export interface BlockConstruction {
  analysed?: boolean
  start?: number
  name?: string
  type?: ChunkTypes
  description?: string
  contents?: string
  subBlocks?: Block[]
}

export interface BlockInfoConstruction {
  level?: number
  pattern: RegExp
  name?: string|FromRegex<string>
  type?: ChunkTypes|FromRegex<ChunkTypes>
  description?: string|FromRegex<string>
  contents?: string|FromRegex<string>
  subBlocks?: FromRegex<Block[]>
}
