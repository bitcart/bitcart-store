export default {
  SET_PRODUCTS: (state, value) => (state.products = value),
  SWITCH_SALE: (state) => { state.sale = !state.sale },
  UPDATE_HIGH_PRICE: (state, value) => { state.highprice = value },
  SET_CATEGORY: (state, value) => { state.categorySelected = value }
}
