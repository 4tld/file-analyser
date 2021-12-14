
function hexView (uint) {
  let header = ''
  uint.forEach((byte, index) => {
    if (byte % 16) {
      header += ' '
    } else {
      header += `\n${(1e7 + (+index).toString(16)).slice(-8)} | `
    }
    header += `${(0 + byte.toString(16)).slice(-2)}`
  })
  return header
}

function blockCutting (uint) {
  const blocks = []
  const zeroPadThreshold = 2
  uint.forEach((byte, index) => {
    if (blocks.at(-1)?.bytes?.at(-1) === 0) {
      if (byte === 0) {
        blocks.at(-1).bytes.push(byte)
      } else if (blocks.at(-1).bytes.length <= zeroPadThreshold) {
        blocks.at(-1).bytes.push(byte)
        blocks.at(-1).type = 'unknown block with zeros'
      } else {
        blocks.push({ type: 'unknown block', bytes: [byte], start: index, key: index })
      }
    } else if (byte === 0) {
      blocks.push({ type: 'zero padding', bytes: [byte], start: index, key: index })
    } else if (blocks.at(-1)) {
      blocks.at(-1).bytes.push(byte)
    } else {
      blocks.push({ type: 'unknown block', bytes: [byte], start: index, key: index })
    }
  })
  return blocks
}
