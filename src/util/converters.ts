export function uint8ToString (uint8: Uint8Array) {
  return uint8.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
}
export function uint8ToHexString (uint8: Uint8Array) {
  uint8.reduce((acc, byte) => acc + (0 + byte.toString(16)).slice(-2), '')
}

export function stringToBinary (string: string) {
  let binary = ''
  for (const char of string) {
    binary += `0000000${char.charCodeAt(0).toString(2)}`.slice(-8)
  }
  return binary
}

export function stringToHexArray (string: string) {
  const hex = []
  for (const char of string) {
    hex.push((0 + char.charCodeAt(0).toString(16)).slice(-2))
  }
  return hex
}

export function bigEndian32StringToNumber (string: string) {
  let number = 0;
  [...string].forEach((char, index) => {
    number += char.charCodeAt(0) * 256 ** (string.length - 1 - index)
  })
  return number
}

export function littleEndian32StringToNumber (string: string) {
  let number = 0;
  [...string].forEach((char, index) => {
    number += char.charCodeAt(0) * 256 ** index
  })
  return number
}

export function syncsafe32StringToNumber (string: string) {
  let number = 0;
  [...string].forEach((char, index) => {
    number += char.charCodeAt(0) * 128 ** (string.length - 1 - index)
  })
  return number
}
