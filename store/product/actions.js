import axios from '~/plugins/axios'

export default {
  switchSale: ({ commit }) =>
    commit('SWITCH_SALE'),
  updateHighprice: ({ commit }, value) =>
    commit('UPDATE_HIGH_PRICE', value),
  setCategory: ({ commit }, value) =>
    commit('SET_CATEGORY', value),
  setProductsRef: ({ commit }) =>
    axios.get('/api/v1/product/?format=json').then(response => (commit('SET_PRODUCTS', response.data.results)))

}
