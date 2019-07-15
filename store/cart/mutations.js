const calculateAmount = obj =>
  Object.values(obj)
    .reduce((acc, { count, amount }) => acc + (count * amount), 0)
    .toFixed(2)

export default {
  ADD_ITEM: (state, item) => {
    state.total++
    if (item.id in state.cart) {
      state.cart[item.id].count++
    } else {
      const stateItem = { ...item }
      stateItem.count = 1
      state.cart[item.id] = stateItem
    }
    state.amount = calculateAmount(state.cart)
  },
  REMOVE_ITEM: (state, item) => {
    state.total = state.total - item.count
    delete state.cart[item.id]
    state.amount = calculateAmount(state.cart)
  },
  CLEAR_CONTENTS: (state) => { state.cart = {} },
  CLEAR_COUNT: (state) => {
    state.total = 0
    state.amount = 0
  },
  SET_ACTUAL_STEP: (state, step) => { state.actualStep = step },
  SET_SUCCESS: (state, value) => { state.success = value },
  SET_TOTAL: (state, value) => { state.total = value }
}
