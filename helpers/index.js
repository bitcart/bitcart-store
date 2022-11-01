import slugify from "slugify"

export const slug = (str) => slugify(str, { lower: true })
export function decimalStr(value, divisibility) {
  if (typeof divisibility === "undefined")
    divisibility = this.$store.getters.divisibility
  const parsedAmount = parseFloat(value).toFixed(divisibility)
  const [wholeAmount, fractionAmount] = parsedAmount.split(".")
  const formattedWholeAmount = new Intl.NumberFormat().format(
    parseInt(wholeAmount, 10)
  )
  return formattedWholeAmount + (fractionAmount ? "." + fractionAmount : "")
}

export function copyToClipboard(text) {
  const el = document.createElement("textarea")
  el.addEventListener("focusin", (e) => e.stopPropagation())
  el.value = text
  el.setAttribute("readonly", "")
  el.style.position = "absolute"
  el.style.left = "-9999px"
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
}

export function isEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export default {
  slug,
  decimalStr,
  copyToClipboard,
  isEmpty,
}
