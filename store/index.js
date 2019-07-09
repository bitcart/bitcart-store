export const state = () => ({
  env: {}
})

export const mutations = {
  setEnv(state, env) {
    state.env = env
  }
}
export const actions = {
  nuxtServerInit({ commit }) {
    if (process.server) {
      commit('setEnv', {
        URL: process.env.BITCART_FRONTEND_URL,
        TOKEN: process.env.BITCART_FRONTEND_TOKEN
      })
    }
  }
}
