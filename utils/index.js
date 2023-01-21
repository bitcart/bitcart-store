import slugify from "slugify"

export default {
  slug(str) {
    return slugify(str, { lower: true })
  },
  decimalStr(value, divisibility) {
    if (typeof divisibility === "undefined")
      divisibility = this.$store.getters.divisibility
    return parseFloat(value).toFixed(divisibility)
  },
  copyToClipboard(text) {
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
  },
  isEmpty(obj) {
    return (
      obj.length === 0 ||
      (Object.entries(obj).length === 0 && obj.constructor === Object)
    )
  },
  getExtendSetting(name, defaults) {
    const extended = this.$store.state.dictionaries[name]
    if (Array.isArray(defaults)) return [...defaults, ...(extended || [])]
    else return Object.assign({}, defaults, extended || {})
  },
}
