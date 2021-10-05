<template lang="pug">
  div.cart-sidebar-wrapper(:class="openSidebarCart ? 'active' : ''")
    div.overlay-cart-sidebar(@click="closeSidebarCart()")
    aside.cart-sidebar
        div.cart-sidebar-header
            h4.title.is-3 Cart
            i.fa.fa-times.fa-lg(@click="closeSidebarCart()")
        div.cart-sidebar-body
          div(v-if="total > 0")
            CartProductListItem(v-for="item in cart",
                :key="item.name",
                :item="item")
          .empty.has-text-centered(v-else-if="!total")
            h3 Your cart is empty.
            nuxt-link(exact, :to="getHomeURL")
              button.button(@click="closeSidebarCart()") Fill er up!
        div.cart-sidebar-footer(v-if="total > 0")
          p
            b Total: {{ amount }} {{ currency }}
          nuxt-link(exact, :to="getCartURL")
            .button.is-primary(@click="closeSidebarCart()") Checkout
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import CartProductListItem from "@/components/CartProductListItem"

const { mapGetters: cartGetters } = createNamespacedHelpers("cart")

export default {
  name: "CartSidebar",
  components: {
    CartProductListItem,
  },
  computed: {
    ...cartGetters(["openSidebarCart", "cart", "total", "amount"]),
    getCartURL() {
      const storeID = this.$route.params.id
      return storeID
        ? { name: "store-id-cart", params: { id: storeID } }
        : { name: "cart" }
    },
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
  methods: {
    closeSidebarCart() {
      this.$store.dispatch("cart/openSidebarCart", false)
    },
  },
}
</script>

<style lang="scss" scoped>
.cart-sidebar-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  transition: all 0.5s ease;
  visibility: hidden;
}

.cart-sidebar-wrapper.active {
  visibility: visible;
}

.overlay-cart-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #000000b3;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.cart-sidebar-wrapper.active .overlay-cart-sidebar {
  opacity: 1;
}

.cart-sidebar {
  position: absolute;
  right: -300px;
  height: 100%;
  width: 300px;
  background-color: #fff;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  transition: right 0.5s ease;
}

.cart-sidebar-wrapper.active .cart-sidebar {
  right: 0;
}

@media (max-width: 600px) {
  .cart-sidebar {
    right: -100%;
  }
}

.cart-sidebar-header {
  text-align: center;
  padding: 10px 30px;
  border-bottom: 1px solid var(--grey);
}

.cart-sidebar-header h4 {
  margin: 0;
}

.cart-sidebar-header i {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.cart-sidebar-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 20px 0;
}

.cart-sidebar-footer {
  margin-top: auto;
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid var(--grey);
}

.cart-sidebar-footer a div {
  margin-top: 10px;
}
</style>
