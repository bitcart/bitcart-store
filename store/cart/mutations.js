import Vue from "vue"
import { decimalStr } from "@/helpers"

const calculateAmount = (state, rootState) => {
  state.amount = decimalStr(
    Object.values(state.cart).reduce(
      (acc, { count, price }) => acc + count * price,
      0
    ),
    rootState.store?.currency_data?.divisibility
  )
}

export default {
  ADD_ITEM(state, item) {
    state.total++
    if (item.id in state.cart) {
      state.cart[item.id].count++
    } else {
      const stateItem = { ...item }
      stateItem.count = 1
      Vue.set(state.cart, item.id, stateItem)
    }
    calculateAmount(state, this.state)
  },
  DECREASE_ITEM(state, item) {
    state.total--
    if (item.id in state.cart) {
      state.cart[item.id].count--
      if (state.cart[item.id].count === 0) {
        Vue.delete(state.cart, item.id)
      }
    }
    calculateAmount(state, this.state)
  },
  REMOVE_ITEM(state, item) {
    state.total = state.total - item.count
    Vue.delete(state.cart, item.id)
    calculateAmount(state, this.state)
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
