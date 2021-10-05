export default {
  addItem: ({ commit }, item) => commit("ADD_ITEM", item),
  decreaseItem: ({ commit }, item) => commit("DECREASE_ITEM", item),
  removeItem: ({ commit }, item) => commit("REMOVE_ITEM", item),
  clearCount: ({ commit }) => commit("CLEAR_COUNT"),
  clearContents: ({ commit }) => commit("CLEAR_CONTENTS"),
  setSuccess: ({ commit }, value) => commit("SET_SUCCESS", value),
  setActualStep: ({ commit }, value) => commit("SET_ACTUAL_STEP", value),
  setTotal: ({ commit }, value) => commit("SET_TOTAL", value),
  setUserEmail: ({ commit }, value) => commit("SET_USER_EMAIL", value),
  setPromocode: ({ commit }, value) => commit("SET_PROMOCODE", value),
  openSidebarCart: ({ commit }, value) => commit("OPEN_SIDEBAR_CART", value),
}
