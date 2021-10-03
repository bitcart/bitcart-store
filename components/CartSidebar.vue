<template lang="pug">
  div.overlay-cart-sidebar(@click="closeSidebarCart()")(:class="openSidebarCart ? 'active' : ''")
    aside.cart-sidebar
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import Switch from "@/components/Switch"

const { mapGetters: cartGetters } = createNamespacedHelpers("cart")

export default {
    name: "CartSidebar",
    components: {
        AppSwitch: Switch,
    },
    computed: {
        ...cartGetters(["openSidebarCart"])
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
        }
    }
}
</script>

<style lang="scss" scoped>
.overlay-cart-sidebar {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000000b3;
    z-index: 1000;
    display: none;
}

.overlay-cart-sidebar.active {
    display: block;
}

.cart-sidebar {
    position: absolute;
    right: 0;
    height: 100%;
    width: 300px;
    background-color: #fff;
}
</style>
