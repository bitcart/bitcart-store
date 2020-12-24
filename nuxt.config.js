export default {
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
      { hid: "og:site_name", property: "og:site_name", content: "Bitcart" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css",
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#3B8070" },
  manifest: {
    theme_color: "#3B8070",
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/scss/main.scss"],
  router: {
    middleware: ["onion"],
  },
  /*
   ** Runtime config
   */
  publicRuntimeConfig: {
    URL: process.env.BITCART_STORE_URL || "http://localhost:8000",
    ONION_URL: process.env.BITCART_STORE_ONION_URL,
    SOCKS_PROXY: process.env.BITCART_STORE_SOCKS_PROXY,
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~plugins/localStorage.js",
    "~plugins/axios.js",
    "~/plugins/buefy.js",
    "~/plugins/lazysizes.js",
    "~/plugins/veeValidate.js",
    "~/plugins/vueQr.js",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  buildModules: ["@nuxtjs/pwa", "@nuxtjs/eslint-module"],
  /*
   ** @nuxt/telemetry settings
   */
  telemetry: false,
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
