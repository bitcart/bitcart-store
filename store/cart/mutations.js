import { decimalStr } from "@/helpers"

const calculateAmount = (obj) =>
  decimalStr(
    Object.values(obj).reduce((acc, { count, price }) => acc + count * price, 0)
  )

export default {
  ADD_ITEM: (state, item) => {
    state.total++
    if (item.id in state.cart) {
      const cart = state.cart
      cart[item.id].count++
      state.cart = { ...cart }
    } else {
      const stateItem = { ...item }
      stateItem.count = 1
      const cart = state.cart
      cart[item.id] = stateItem
      state.cart = { ...cart }
    }
    state.amount = calculateAmount(state.cart)
  },
  DECREASE_ITEM: (state, item) => {
    state.total--
    const cart = state.cart
    if (item.id in state.cart) {
      cart[item.id].count--
      if (state.cart[item.id].count === 0) {
        delete cart[item.id]
      }
      state.cart = { ...cart }
    }
    state.amount = calculateAmount(state.cart)
  },
  REMOVE_ITEM: (state, item) => {
    state.total = state.total - item.count
    const cart = state.cart
    delete cart[item.id]
    state.cart = { ...cart }
    state.amount = calculateAmount(state.cart)
  },
  CLEAR_CONTENTS: (state) => {
    state.cart = {}
  },
  CLEAR_COUNT: (state) => {
    state.total = 0
    state.amount = 0
  },
  SET_ACTUAL_STEP: (state, step) => {
    state.actualStep = step
  },
  SET_SUCCESS: (state, value) => {
    state.success = value
  },
  SET_TOTAL: (state, value) => {
    state.total = value
  },
  SET_USER_EMAIL: (state, value) => {
    state.userEmail = value
  },
  SET_PROMOCODE: (state, value) => {
    state.promocode = value
  },
  OPEN_SIDEBAR_CART: (state, value) => {
    state.openSidebarCart = value
  },
}
