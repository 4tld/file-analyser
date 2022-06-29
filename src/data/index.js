
import png from './png'
import riff from '../riff'
import magic from './magic'
import mp4 from '../mp4'
import id3 from './id3'

export const blockInfos = [
  ...id3,
  ...magic,
  ...mp4,
  ...png,
  ...riff,
].sort(({ level: level1 }, { level: level2 }) => (level2 || 0) - (level1 || 0))
