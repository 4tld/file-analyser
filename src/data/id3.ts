import { syncsafe32StringToNumber } from '../util/converters'
import { Block, BlockInfo } from '../classes'
import { BlockInfoConstruction, ChunkTypes } from '../util/types'
import { re } from '../util/regex'

const id3FrameHeaders = {
  AENC: 'Audio encryption',
  APIC: 'Attached picture',
  ASPI: 'Audio seek point index',
  COMM: 'Comments',
  COMR: 'Commercial',
  ENCR: 'Encryption method registration',
  EQU2: 'Equalisation (2)',
  EQUA: 'Equalization',
  ETCO: 'Event timing codes',
  GEOB: 'General encapsulated object',
  GRID: 'Group identification registration',
  IPLS: 'Involved people list',
  LINK: 'Linked information',
  MCDI: 'Music CD identifier',
  MLLT: 'MPEG location lookup table',
  OWNE: 'Ownership',
  PRIV: 'Private',
  PCNT: 'Play counter',
  POPM: 'Popularimeter',
  POSS: 'Position synchronisation',
  RBUF: 'Recommended buffer size',
  RVA2: 'Relative volume adjustment (2)',
  RVAD: 'Relative volume adjustment',
  RVRB: 'Reverb',
  SEEK: 'Seek',
  SIGN: 'Signature',
  SYLT: 'Synchronized lyric/text',
  SYTC: 'Synchronized tempo codes',
  TALB: 'Album/Movie/Show title',
  TBPM: 'BPM (beats per minute)',
  TCOM: 'Composer',
  TCON: 'Content type',
  TCOP: 'Copyright message',
  TDAT: 'Date',
  TDEN: 'Encoding time',
  TDLY: 'Playlist delay',
  TDOR: 'Original release time',
  TDRC: 'Recording time',
  TDRL: 'Release time',
  TDTG: 'Tagging time',
  TENC: 'Encoded by',
  TEXT: 'Lyricist/Text writer',
  TFLT: 'File type',
  TIME: 'Time',
  TIPL: 'Involved people list',
  TIT1: 'Content group description',
  TIT2: 'Title/songname/content description',
  TIT3: 'Subtitle/Description refinement',
  TKEY: 'Initial key',
  TLAN: 'Language(s)',
  TLEN: 'Length',
  TMCL: 'Musician credits list',
  TMED: 'Media type',
  TMOO: 'Mood',
  TOAL: 'Original album/movie/show title',
  TOFN: 'Original filename',
  TOLY: 'Original lyricist(s)/text writer(s)',
  TOPE: 'Original artist(s)/performer(s)',
  TORY: 'Original release year',
  TOWN: 'File owner/licensee',
  TPE1: 'Lead performer(s)/Soloist(s)',
  TPE2: 'Band/orchestra/accompaniment',
  TPE3: 'Conductor/performer refinement',
  TPE4: 'Interpreted, remixed, or otherwise modified by',
  TPOS: 'Part of a set',
  TPRO: 'Produced notice',
  TPUB: 'Publisher',
  TRCK: 'Track number/Position in set',
  TRDA: 'Recording dates',
  TRSN: 'Internet radio station name',
  TRSO: 'Internet radio station owner',
  TSIZ: 'Size',
  TSOA: 'Album sort order',
  TSOP: 'Performer sort order',
  TSOT: 'Title sort order',
  TSRC: 'ISRC (international standard recording code)',
  TSSE: 'Software/Hardware and settings used for encoding',
  TSST: 'Set subtitle',
  TYER: 'Year',
  TXXX: 'User defined text information',
  UFID: 'Unique file identifier',
  USER: 'Terms of use',
  USLT: 'Unsychronized lyric/text transcription',
  WCOM: 'Commercial information',
  WCOP: 'Copyright/Legal information',
  WOAF: 'Official audio file webpage',
  WOAR: 'Official artist/performer webpage',
  WOAS: 'Official audio source webpage',
  WORS: 'Official internet radio station homepage',
  WPAY: 'Payment',
  WPUB: 'Publishers official webpage',
  WXXX: 'User defined URL link',
} as Record<string, string>

const id3: BlockInfoConstruction[] = [
  {
    pattern: re`TAG.{125}`,
    name: 'ID3v1 container',
    type: ChunkTypes.fixed,
  },
  {
    level: 1,
    pattern: re`ID3(?<version>[^\xFF]{2})(?<flags>.)(?<length>[\0-\x7F]{4})`,
    name: 'ID3v2 container',
    type: ChunkTypes.chunk,
    length: ({ groups }) => {
      const dataLength = syncsafe32StringToNumber(groups.length)
      return 10 + dataLength
    },
    subBlocks: ({ groups, index }) => {
      const dataLength = syncsafe32StringToNumber(groups.length)
      const unsynchronisation = (Number(groups.flags) & 0b10000000) > 0
      const extendedHeader = (Number(groups.flags) & 0b01000000) > 0
      const experimental = (Number(groups.flags) & 0b00100000) > 0
      const footer = (Number(groups.flags) & 0b00010000) > 0
      return [
        new Block({
          start: index,
          name: 'ID3v2 magic number',
          type: ChunkTypes.fixed,
          length: 3,
        }),
        new Block({
          start: index + 3,
          name: `ID3v2 version ${groups.version[0].charCodeAt(0)}.${groups.version[1].charCodeAt(0)}`,
          type: ChunkTypes.fixed,
          length: 2,
        }),
        new Block({
          start: index + 5,
          name: 'ID3v2 flags',
          type: ChunkTypes.binary,
          description: `Unsynchronisation: ${unsynchronisation ? 'yes' : 'no'} /
                        Extended header: ${extendedHeader ? 'yes' : 'no'} /
                        Experimental: ${experimental ? 'yes' : 'no'} /
                        Footer: ${footer ? 'yes' : 'no'}`,
          length: 1,
        }),
        new Block({
          start: index + 6,
          name: 'chunk length',
          type: ChunkTypes.intss32,
          length: 4,
        }),
        new Block({
          start: index + 10,
          name: 'chunk data',
          length: dataLength,
        }),
      ]
    },
  },
  {
    name: ({ groups }) => `ID3v2 ${id3FrameHeaders[groups.type]} frame`,
    type: ChunkTypes.chunk,
    pattern: re`(?<type>${Object.keys(id3FrameHeaders).join('|')})(?<length>[\0-\x7F]{4})(?<flags>.{2})`,
    length: ({ groups }) => {
      const dataLength = syncsafe32StringToNumber(groups.length)
      return 10 + dataLength
    },
    subBlocks: ({ groups, index }) => {
      const dataLength = syncsafe32StringToNumber(groups.length)
      return [
        new Block({
          start: index,
          name: `${id3FrameHeaders[groups.type]} frame identifier`,
          type: ChunkTypes.fixed,
          length: 4,
        }),
        new Block({
          start: index + 4,
          name: 'frame length',
          type: ChunkTypes.intss32,
          length: 4,
        }),
        new Block({
          start: index + 8,
          name: 'ID3v2 flags',
          type: ChunkTypes.binary,
          length: 2,
        }),
        new Block({
          start: index + 10,
          name: 'frame data',
          length: dataLength,
        }),
      ]
    },
  },
]
export default id3.map((info) => new BlockInfo(info))
