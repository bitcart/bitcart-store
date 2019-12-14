export const state = () => ({
  env: {},
  store: {}
})

export const mutations = {
  setEnv (state, env) {
    state.env = env
  },
  store (state, val) {
    state.store = val
  }
}
export const actions = {
  nuxtServerInit ({ commit }) {
    if (process.server) {
      commit('setEnv', {
        URL: process.env.BITCART_FRONTEND_URL || 'http://localhost:8000',
        EMAIL: process.env.BITCART_FRONTEND_EMAIL,
        PASSWORD: process.env.BITCART_FRONTEND_PASSWORD,
        STORE: process.env.BITCART_FRONTEND_STORE
      })
    }
  },
  syncStats ({ commit, dispatch }) {
    this.$axios.get(`/stores/${this.state.env.STORE}`).then(resp => commit('store', resp.data))
    setTimeout(() => {
      dispatch('syncStats')
    }, 60000)
  }
}
