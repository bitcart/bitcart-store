import Consola from 'consola'

export default {
  switchSale: ({ commit }) =>
    commit('SWITCH_SALE'),
  updateHighprice: ({ commit }, value) =>
    commit('UPDATE_HIGH_PRICE', value),
  setCategory: ({ commit }, value) =>
    commit('SET_CATEGORY', value),
  setProductsRef: async function ({ commit }) {
    const data = (await this.$axios.$get('/api/v1/product/?format=json')).results
    Consola.log(data)
    commit('SET_PRODUCTS', data)
  }
}
