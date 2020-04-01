import axios from 'axios'

export default ({ store }, inject) => {
  const instance = axios.create({ baseURL: store.state.env.URL })
  inject('axios', instance)
  instance.interceptors.request.use(
    (config) => {
      config.baseURL = store.state.env.URL
      return config
    },
    err => Promise.reject(err)
  )
}
