import axios from 'axios'
import Cookies from 'js-cookie'

export default ({ store }, inject) => {
  const instance = axios.create({ baseURL: store.state.env.URL })
  instance.interceptors.request.use(
    (reqConfig) => {
      reqConfig.headers.authorization = `Bearer ${Cookies.get('access_token')}`
      return reqConfig
    },
    err => Promise.reject(err)
  )

  let isFetchingToken = false
  let tokenSubscribers = []

  function subscribeTokenRefresh (cb) {
    tokenSubscribers.push(cb)
  }
  function onTokenRefreshed (errRefreshing, token) {
    tokenSubscribers.map(cb => cb(errRefreshing, token))
  }

  instance.interceptors.response.use(undefined, (err) => {
    if (err.response.config.url.includes('/token')) { return Promise.reject(err) }

    if (err.response.status !== 401) { return Promise.reject(err) }

    if (!isFetchingToken) {
      isFetchingToken = true

      instance.post('/token', { 'email': store.state.env.EMAIL, 'password': store.state.env.PASSWORD })
        .then((newAccessToken) => {
          newAccessToken = newAccessToken.data.access_token
          isFetchingToken = false

          onTokenRefreshed(null, newAccessToken)
          tokenSubscribers = []

          Cookies.set('access_token', newAccessToken)
        })
        .catch(() => {
          onTokenRefreshed(new Error('Unable to refresh access token'), null)
          tokenSubscribers = []
        })
    }
    const initTokenSubscriber = new Promise((resolve, reject) => {
      subscribeTokenRefresh((errRefreshing, newToken) => {
        if (errRefreshing) { return reject(errRefreshing) }
        err.config.headers.authorization = newToken
        return resolve(axios(err.config))
      })
    })
    return initTokenSubscriber
  })
  inject('axios', instance)
}
