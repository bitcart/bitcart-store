import slugify from 'slugify'

export const slug = str => slugify(str, { lower: true })
export function decimalStr (value) {
  value = value.toFixed(8)
  if (!value.includes('.')) {
    return value
  }
  let cutFrom = value.length - 1
  do {
    if (value[cutFrom] === '0') {
      cutFrom--
    }
  } while (value[cutFrom] === '0')
  if (value[cutFrom] === '.') {
    cutFrom--
  }
  return value.substr(0, cutFrom + 1)
}
