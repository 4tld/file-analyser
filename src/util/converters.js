export function uint8ToString (uint8) {
  return uint8.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
}
export function uint8ToHexString (uint8) {
  uint8.reduce((acc, byte) => acc + (0 + byte.toString(16)).slice(-2), '')
}

export function stringToHexArray (string) {
  const hex = []
  for (const char of string) {
    hex.push((0 + char.charCodeAt().toString(16)).slice(-2))
  }
  return hex
}

export function bigEndian32StringToNumber (string) {
  let number = 0;
  [...string].forEach((char, index) => {
    number += char.charCodeAt() * 256 ** (string.length - 1 - index)
  })
  return number
}

export function littleEndian32StringToNumber (string) {
  let number = 0;
  [...string].forEach((char, index) => {
    number += char.charCodeAt() * 256 ** index
  })
  return number
}
