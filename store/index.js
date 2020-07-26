export const state = () => ({
  env: {},
  store: {},
  currentPage: 1,
  url: '',
  services: {},
  path: '/',
  onion: false
})

export const mutations = {
  setEnv (state, env) {
    state.env = env
  },
  store (state, val) {
    state.store = val
  },
  setCurrentPage (state, val) {
    state.currentPage = val
  },
  SET_CURRENT_URL (state, val) {
    state.url = val
  },
  services (state, val) {
    state.services = val
  },
  path (state, val) {
    state.path = val
  },
  onion (state, val) {
    state.onion = val
  }
}
export const getters = {
  url: ({ url }) => url,
  onionURL ({ services, path }) {
    const service = services['BitcartCC Store']
    return service ? service.hostname + path : ''
  },
  apiOnionURL ({ services, env }) {
    const service = services['BitcartCC Merchants API']
    return env.ONION_URL ? env.ONION_URL : (service ? service.hostname : '')
  },
  apiURL ({ onion, env }, { apiOnionURL }) {
    return (onion && apiOnionURL) ? apiOnionURL : env.URL
  }
}
export const actions = {
  async nuxtServerInit ({ commit, state, getters }) {
    if (process.server) {
      commit('setEnv', {
        URL: process.env.BITCART_FRONTEND_URL || 'http://localhost:8000',
        ONION_URL: process.env.BITCART_FRONTEND_ONION_URL
      })
    }
    const env = state.env
    this.$axios.defaults.baseURL = getters.apiURL
    const { data } = await this.$axios.get('/manage/stores')
    env.STORE = data.pos_id || 1
    commit('setEnv', env)
    const { data: services } = await this.$axios.get('/services')
    commit('services', services)
  },
  syncStats ({ commit, dispatch }) {
    if (process.client) {
      this.$axios.get(`/stores/${this.state.env.STORE}`).then(resp => commit('store', resp.data)).catch(() => {})
      this.$axios.get(`/products/maxprice?store=${this.state.env.STORE}`).then(resp => commit('product/maxprice', resp.data))
      this.$axios.get(`/products/count?store=${this.state.env.STORE}`).then(resp => commit('product/count', resp.data))
      setTimeout(() => {
        dispatch('syncStats')
      }, 60000)
    }
  }
}
