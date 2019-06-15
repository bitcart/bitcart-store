import axios from 'axios'

export default {
  switchSale: ({ commit }) =>
    commit('SWITCH_SALE'),
  updateHighprice: ({ commit }, value) =>
    commit('UPDATE_HIGH_PRICE', value),
  setCategory: ({ commit }, value) =>
    commit('SET_CATEGORY', value),
  setProductsRef: ({ commit }) =>
    axios.get('http://127.0.0.1:8000/api/v1/product/?format=json', {
      auth: {
        username: 'USERNAME', // TODO: loading config
        password: 'PASSWORD'
      }
    }).then((response) => (commit('SET_PRODUCTS', response.data.results)))

}
