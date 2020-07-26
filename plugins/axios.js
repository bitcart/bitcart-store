import axios from 'axios'

export default ({ store }, inject) => {
  const instance = axios.create({ baseURL: store.getters.apiURL })
  inject('axios', instance)
  instance.interceptors.request.use(
    (config) => {
      config.baseURL = store.getters.apiURL
      return config
    },
    err => Promise.reject(err)
  )
}
