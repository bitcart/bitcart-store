export default {
  SET_PRODUCTS: (state, value) => (state.products = value),
  SWITCH_SALE: (state) => { state.sale = !state.sale },
  UPDATE_HIGH_PRICE: (state, value) => { state.highprice = value },
  SET_CATEGORY: (state, value) => { state.categorySelected = value },
  SET_CATEGORIES: (state, value) => { state.categories = value.sort() },
  SET_PRODUCT_ID: (state, value) => { state.productId = value },
  count: (state, value) => { state.count = value }
}
