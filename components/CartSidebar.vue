<template lang="pug">
  div.cart-sidebar-wrapper(:class="openSidebarCart ? 'active' : ''")
    div.overlay-cart-sidebar(@click="closeSidebarCart()")
    aside.cart-sidebar
        div.cart-sidebar-header
            h4 Cart
            img.lazyload(src="/cross.svg")(@click="closeSidebarCart()")
        div.cart-sidebar-body
            CartProductListItem(v-for="item in cart",
                :key="item.name",
                :item="item")
        div.cart-sidebar-footer
            nuxt-link.button.is-light(exact, :to="getCartURL") Checkout
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import Switch from "@/components/Switch"
import CartProductListItem from '@/components/CartProductListItem';

const { mapGetters: cartGetters } = createNamespacedHelpers("cart")

export default {
  name: "CartSidebar",
  components: {
    AppSwitch: Switch,
    CartProductListItem
  },
  computed: {
    ...cartGetters([
        "openSidebarCart",
        "cart",
        "total",
        "amount"
    ]),
    getCartURL() {
      const storeID = this.$route.params.id
      return storeID
        ? { name: "store-id-cart", params: { id: storeID } }
        : { name: "cart" }
    },
  },
  created() {
    /* this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'cart/OPEN_SIDEBAR_CART') {
                this.sidebarCartOpen = mutation.payload;
            }
        }) */
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
  display: none;
}

.cart-sidebar-wrapper.active {
  display: block;
}

.overlay-cart-sidebar {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000000b3;
  z-index: 1000;
}

.cart-sidebar {
  position: absolute;
  right: 0;
  height: 100%;
  width: 300px;
  background-color: #fff;
  z-index: 1100;
  display: flex;
  flex-direction: column;
}
</style>
