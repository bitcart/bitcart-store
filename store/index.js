export const state = () => ({
  env: {},
  store: {},
  currentPage: 1,
  url: ''
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
  }
}
export const getters = {
  url: ({ url }) => url
}
export const actions = {
  async nuxtServerInit ({ commit, state }) {
    if (process.server) {
      commit('setEnv', {
        URL: process.env.BITCART_FRONTEND_URL || 'http://localhost:8000'
      })
    }
    const env = state.env
    this.$axios.defaults.baseURL = state.env.URL
    const { data } = await this.$axios.get('/manage/stores')
    env.STORE = data.pos_id || 1
    commit('setEnv', env)
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
