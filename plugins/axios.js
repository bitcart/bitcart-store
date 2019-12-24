import axios from 'axios'
import Cookies from 'js-cookie'

function getCookie (cookieName, stringCookie) {
  if (!stringCookie) { return undefined }
  const strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
  return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
}

export default ({ store, req }, inject) => {
  const instance = axios.create({ baseURL: store.state.env.URL })
  instance.interceptors.request.use(
    (config) => {
      if (req) {
        config.headers.authorization = `Bearer ${getCookie('access_token', req.headers.cookie)}`
      } else { config.headers.authorization = `Bearer ${Cookies.get('access_token')}` }
      return config
    },
    err => Promise.reject(err)
  )
  instance.interceptors.response.use((response) => {
    return response
  },
  function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && originalRequest.url.endsWith('/token')) {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      return instance.post('/token',
        {
          'email': store.state.env.EMAIL,
          'password': store.state.env.PASSWORD
        }
      )
        .then((res) => {
          if (res.status === 200) {
            Cookies.set('access_token', res.data.access_token)
            return instance(originalRequest)
          }
        })
    }
    return Promise.reject(error)
  })
  inject('axios', instance)
}
