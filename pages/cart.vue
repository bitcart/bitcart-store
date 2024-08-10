<template lang="pug">
  UIExtensionSlot(name="cart")
    .container
      .section
        .capsule.cart.content
          UIExtensionSlot(name="step_menu")
            StepMenu(:actualStep="actualStep", :menu="stepMenuContent")

          div(v-if="total > 0")
            div(v-if="actualStep === 0")
              UIExtensionSlot(name="cart_products" :cart="cart")
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
            UIExtensionSlot(name="cart_steps_extra" :actualStep="actualStep")

          UIExtensionSlot(name="empty_cart" v-else-if="!total && !success" :homeURL="getHomeURL")
            .empty.has-text-centered
              h3 Your cart is empty.
              nuxt-link(exact :to="getHomeURL")
                button.button Fill er up!

          UIExtensionSlot(name="success_cart" v-else :homeURL="getHomeURL")
            .has-text-centered
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
import UIExtensionSlot from "@/components/UIExtensionSlot"

const { mapGetters, mapActions } = createNamespacedHelpers("cart")

export default {
  components: {
    UIExtensionSlot,
    StepMenu,
    CartProductListItem,
    Checkout,
    CheckoutModal,
  },
  data() {
    return {
      stepMenuContent: this.$utils.getExtendSetting.call(
        this,
        "step_menu",
        stepMenuContent
      ),
      email: undefined,
      promocode: "",
      shippingAddress: "",
      notes: "",
    }
  },
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
