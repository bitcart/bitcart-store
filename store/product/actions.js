// import axios from '~/plugins/axios'

export default {
  switchSale: ({ commit }) =>
    commit('SWITCH_SALE'),
  updateHighprice: ({ commit }, value) =>
    commit('UPDATE_HIGH_PRICE', value),
  setCategory: ({ commit }, value) =>
    commit('SET_CATEGORY', value),
  setProductsRef ({ commit }) {
    this.$axios.get('/products').then(r => commit('SET_PRODUCTS', r.data.result))
  }
}
