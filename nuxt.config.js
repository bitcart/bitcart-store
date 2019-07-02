require('dotenv').config()
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  manifest: {
    theme_color: '#3B8070'
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/axios.js'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    ['nuxt-env', {
      keys: [
        { key: 'BITCART_FRONTEND_URL' },
        { key: 'BITCART_FRONTEND_USER' },
        { key: 'BITCART_FRONTEND_PASS' }
      ]
    }]
  ],
  axios: {
    baseURL: process.env.BITCART_FRONTEND_URL,
    auth: {
      username: process.env.BITCART_FRONTEND_USER,
      password: process.env.BITCART_FRONTEND_PASS
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
