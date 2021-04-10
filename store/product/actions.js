import debounce from "lodash.debounce"

const updateStats = debounce(function (dispatch) {
  dispatch("setProductsRef")
  dispatch("fetchCount")
}, 250)

export default {
  switchSale: ({ commit, dispatch }) => {
    commit("SWITCH_SALE")
    updateStats(dispatch)
  },
  updateHighprice: ({ commit, dispatch }, value) => {
    commit("UPDATE_HIGH_PRICE", value)
    updateStats(dispatch)
  },
  setCategory({ commit, dispatch }, value) {
    commit("SET_CATEGORY", value)
    updateStats(dispatch)
  },
  setProductsRef({ commit }) {
    return this.$axios
      .get(
        `/products?store=${this.state.storeID}&sale=${
          this.state.product.sale
        }&category=${this.state.product.categorySelected}&min_price=${
          this.state.product.highprice[0]
        }&max_price=${this.state.product.highprice[1]}&limit=6&offset=${
          (this.state.currentPage - 1) * 6
        }`
      )
      .then((r) => {
        commit("SET_PRODUCTS", r.data.result)
        return this.$axios
          .get(`/products/categories?store=${this.state.storeID}`)
          .then((resp) => commit("SET_CATEGORIES", resp.data))
      })
  },
  fetchCount({ commit }) {
    return this.$axios
      .get(
        `/products/count?store=${this.state.storeID}&sale=${this.state.product.sale}&category=${this.state.product.categorySelected}&min_price=${this.state.product.highprice[0]}&max_price=${this.state.product.highprice[1]}`
      )
      .then((resp) => commit("count", resp.data))
  },
  fetchProduct({ commit }, productId) {
    return this.$axios
      .get(`/products/${productId}`)
      .then((r) => commit("SET_PRODUCTS", [r.data]))
  },
}
