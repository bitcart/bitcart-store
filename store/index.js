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
  apiError: null,
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
  apiError(state, value) {
    state.apiError = value
  },
}
export const getters = {
  url: ({ url }) => url,
  onionHost({ services, env }) {
    if (env.onionHost) return env.onionHost
    const service = services["Bitcart Store"]
    return service ? service.hostname : ""
  },
  onionAdminHost({ services, env }) {
    if (env.onionAdminHost)
      return env.onionAdminHost.replace(/^https?:\/\//, "")
    const service = services["Bitcart Admin Panel"]
    return service && service.hostname
      ? service.hostname.replace(/^https?:\/\//, "")
      : ""
  },
  adminHost({ onion, env }, { onionAdminHost }) {
    const rootPath = env.adminRootPath === "/" ? "" : env.adminRootPath
    return onion && onionAdminHost
      ? onionAdminHost + rootPath
      : env.adminHost.replace(/^https?:\/\//, "")
  },
  onionURL({ env, path }, { onionHost }) {
    const rootPath = env.rootPath === "/" ? "" : env.rootPath
    return onionHost ? onionHost + rootPath + path : ""
  },
  apiOnionURL({ services, env }) {
    if (env.onionURL) return env.onionURL
    const service = services["Bitcart Merchants API"]
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
    try {
      const { data } = await $axios.get("/manage/stores")
      commit("policies", data)
      const storeID = params.id ? params.id : data.pos_id
      commit("storeID", storeID)
      const { data: services } = await $axios.get("/tor/services")
      commit("services", services)
      commit("apiError", null) // reset error
    } catch (e) {
      commit("apiError", e)
    }
  },
  async loadEnv({ commit }, { env, req }) {
    let onionURL = null
    if (process.server) {
      const fs = require("fs").promises
      try {
        onionURL =
          "http://" +
          (await fs.readFile(
            "/var/lib/tor/hidden_services/Bitcart-Merchants-API/hostname"
          ))
      } catch {}
    }
    commit("setEnv", {
      URL: env.URL,
      SOCKS_PROXY: env.SOCKS_PROXY,
      onionURL: env.ONION_API_URL || (onionURL ? onionURL.trim() : null),
      onionHost: env.ONION_HOST,
      onionAdminHost: env.ONION_ADMIN_HOST,
      adminHost: env.ADMIN_HOST,
      rootPath: env.ROOTPATH,
      adminRootPath: env.ADMIN_ROOTPATH,
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
