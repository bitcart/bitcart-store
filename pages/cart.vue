<template lang="pug">
  .container
    .section
      .capsule.cart.content
        StepMenu(:actualStep="actualStep", :menu="stepMenuContent")

        div(v-if="total > 0")
          div(v-if="actualStep === 0")
            transition-group.content(name="items", tag="div")
              CartProductListItem(v-for="item in cart",
                                  :key="item.id",
                                  :item="item")

            .is-clearfix
              h3.total.is-pulled-left Total: {{ amount }} {{ currency }}
              button.button.is-success.is-pulled-right(@click="setActualStep(1)") > Next

          div(v-if="actualStep === 1")
            Checkout(:total="amount", :email.sync="email" :promocode.sync="promocode", :shipping-address.sync="shippingAddress", :notes.sync="notes", v-on:pay="setActualStep(2)")
          div(v-if="actualStep === 2")
            CheckoutModal(:total="amount", :cart="cart", :email="email" :promocode="promocode", :shipping-address="shippingAddress", :notes="notes", v-on:close="setActualStep(3)")

        .empty.has-text-centered(v-else-if="!total && !success")
          h3 Your cart is empty.
          nuxt-link(exact :to="getHomeURL")
            button.button Fill er up!

        .has-text-centered(v-else)
          h2 Success!
          p Your order has been processed, it will be delivered shortly.
          nuxt-link(exact :to="getHomeURL")
            button.button Fill again your cart
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import Checkout from "@/components/Checkout"
import CheckoutModal from "@/components/CheckoutModal"
import CartProductListItem from "@/components/CartProductListItem"
import StepMenu from "@/components/StepMenu"
import stepMenuContent from "@/components/StepMenu/stepMenuContent.json"

const { mapGetters, mapActions } = createNamespacedHelpers("cart")

export default {
  components: {
    StepMenu,
    CartProductListItem,
    Checkout,
    CheckoutModal,
  },
  data: () => ({
    stepMenuContent,
    email: undefined,
    promocode: null,
    shippingAddress: "",
    notes: "",
  }),
  computed: {
    ...mapGetters(["cart", "total", "amount", "success", "actualStep"]),
    currency() {
      return this.$store.state.store.default_currency
    },
    getHomeURL() {
      const storeID = this.$route.params.id
      return storeID
        ? { name: "store-id", params: { id: storeID } }
        : { name: "index" }
    },
  },
  beforeDestroy() {
    this.success && this.setSuccess(false)
    this.setActualStep(0)
  },
  methods: {
    ...mapActions(["setSuccess", "setActualStep"]),
  },
}
</script>
