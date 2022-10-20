import deflate from './deflate'
import id3 from './id3'
import magic from './magic'
import mp4 from './mp4'
import png from './png'
import riff from './riff'
import zip from './zip'

export default [
  ...deflate,
  ...id3,
  ...magic,
  ...mp4,
  ...png,
  ...riff,
  ...zip,
].sort(({ level: level1 }, { level: level2 }) => (level2 || 0) - (level1 || 0))
