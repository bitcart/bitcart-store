export const state = () => ({
  env: {},
  store: {},
  currentPage: 1,
  url: '',
  services: {},
  path: '/',
  onion: false,
  storeID: 1
})

export const mutations = {
  setEnv (state, env) {
    state.env = env
  },
  storeID (state, val) {
    state.storeID = val || 1
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
  async nuxtServerInit ({ commit, dispatch }, { req, $axios }) {
    await dispatch('loadEnv', { env: this.$config, req })
    const { data } = await $axios.get('/manage/stores')
    commit('storeID', data.pos_id)
    const { data: services } = await $axios.get('/services')
    commit('services', services)
  },
  loadEnv ({ commit }, { env, req }) {
    commit('setEnv', {
      URL: env.URL,
      ONION_URL: env.ONION_URL,
      SOCKS_PROXY: env.SOCKS_PROXY
    })
    if (req) {
      commit('onion', req.headers.host.toLowerCase().endsWith('.onion'))
    }
  },
  syncStats ({ commit, dispatch }) {
    if (process.client) {
      this.$axios.get(`/stores/${this.state.storeID}`).then(resp => commit('store', resp.data)).catch(() => {})
      this.$axios.get(`/products/maxprice?store=${this.state.storeID}`).then(resp => commit('product/maxprice', resp.data))
      this.$axios.get(`/products/count?store=${this.state.storeID}`).then(resp => commit('product/count', resp.data))
      setTimeout(() => {
        dispatch('syncStats')
      }, 60000)
    }
  }
}
