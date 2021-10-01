const { hsl } = require("bulma-css-vars")

// initial colors
const appColors = {
  primary: hsl(141, 53, 53),
  black: hsl(0, 0, 4),
  grey: hsl(0, 0, 48),
  white: hsl(0, 0, 100),
  orange: hsl(14, 100, 53),
  yellow: hsl(44, 100, 77),
  green: hsl(153, 53, 53),
  turquoise: hsl(171, 100, 41),
  cyan: hsl(207, 61, 53),
  blue: hsl(229, 53, 53),
  purple: hsl(271, 100, 71),
  red: hsl(348, 86, 61),
}

// main colors
appColors.info = appColors.cyan
appColors.success = appColors.green
appColors.warning = appColors.yellow
appColors.danger = appColors.red
// overrides
appColors.link = appColors.primary
appColors["pagination-color"] = "#48c774"

module.exports = {
  jsOutputFile: "assets/bulma-generated/bulma-colors.js",
  sassOutputFile: "assets/bulma-generated/generated-bulma-vars.sass",
  cssFallbackOutputFile: "assets/bulma-generated/generated-fallback.css",
  colorDefs: appColors,
  sassEntryFile: "assets/scss/main.scss",
  transition: "0.5s ease",
}
