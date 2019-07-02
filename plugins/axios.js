
export default function ({ $axios }) {
  $axios.defaults.headers.common.Authorization = `Token ` + process.env.BITCART_FRONTEND_TOKEN
  // $axios.setToken(process.env.BITCART_FRONTEND_TOKEN, 'Token')
  // Consola.log($axios.defaults.headers.common.Authorization)
}
