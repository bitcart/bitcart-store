export const state = () => ({
  env: {},
  store: {},
  currentPage: 1,
  url: "",
  services: {},
  policies: {},
  path: "/",
  onion: false,
  storeID: 1,
})

export const mutations = {
  setEnv(state, env) {
    state.env = env
  },
  storeID(state, val) {
    state.storeID = val || 1
  },
  store(state, val) {
    state.store = val
  },
  setCurrentPage(state, val) {
    state.currentPage = val
  },
  SET_CURRENT_URL(state, val) {
    state.url = val
  },
  services(state, val) {
    state.services = val
  },
  path(state, val) {
    state.path = val
  },
  onion(state, val) {
    state.onion = val
  },
  policies(state, val) {
    state.policies = val
  },
}
export const getters = {
  url: ({ url }) => url,
  onionURL({ services, path }) {
    const service = services["BitcartCC Store"]
    return service ? service.hostname + path : ""
  },
  apiOnionURL({ services, env }) {
    const service = services["BitcartCC Merchants API"]
    return service ? service.hostname : ""
  },
  apiURL({ onion, env }, { apiOnionURL }) {
    return onion && apiOnionURL ? apiOnionURL : env.URL
  },
  emailRequired: ({ store }) =>
    store.checkout_settings && store.checkout_settings.email_required,
  divisibility: ({ store }) =>
    store.currency_data && store.currency_data.divisibility,
}
export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, $axios, params }) {
    await dispatch("loadEnv", { env: this.$config, req })
    const { data } = await $axios.get("/manage/stores")
    commit("policies", data)
    const storeID = params.id ? params.id : data.pos_id
    commit("storeID", storeID)
    const { data: services } = await $axios.get("/tor/services")
    commit("services", services)
  },
  loadEnv({ commit }, { env, req }) {
    commit("setEnv", {
      URL: env.URL,
      SOCKS_PROXY: env.SOCKS_PROXY,
    })
    if (req) {
      commit("onion", req.headers.host.toLowerCase().endsWith(".onion"))
    }
  },
  async syncStats({ commit, dispatch }) {
    try {
      const resp = await this.$axios.get(`/stores/${this.state.storeID}`)
      commit("store", resp.data)
    } catch {}
    try {
      const resp = await this.$axios.get(
        `/products/maxprice?store=${this.state.storeID}`
      )
      commit("product/maxprice", resp.data)
    } catch {}
    try {
      const resp = await this.$axios.get(
        `/products/count?store=${this.state.storeID}`
      )
      commit("product/count", resp.data)
    } catch {}
    if (process.client) {
      setTimeout(() => {
        dispatch("syncStats")
      }, 60000)
    }
  },
}
