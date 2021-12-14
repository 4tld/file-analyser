export function uint8ToString (uint8) {
  return uint8.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
}
export function uint8ToHexString (uint8) {
  uint8.reduce((acc, byte) => acc + (0 + byte.toString(16)).slice(-2), '')
}
