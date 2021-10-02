<template lang="pug">
  header.navbar.is-light(:class="{ 'is-fixed-top': isIndexRoute }",
                        role="navigation",
                        aria-label="main navigation")
    .container.is-flex-touch
      .navbar-brand
        nuxt-link.navbar-item(exact, :to="getHomeURL")
          strong
            i {{$store.state.store.name}}
      .navbar-end.is-flex-touch
        .navbar-item
          .field
            p.control
              nuxt-link.button.is-light(exact, :to="getCartURL")
                span.icon.cartitem
                  .cartcount(v-if="total > 0") {{ total }}
                  i.fa.fa-shopping-cart
                span.is-hidden-mobile Cart
        .navbar-item(v-if="onionURL")
            button.button.is-light
              a(:href="onionURL")
                figure.image.is-32x32
                  img.lazyload(src="/onion.svg")
</template>

<script>
import { createNamespacedHelpers, mapGetters } from "vuex"

const { mapGetters: cartGetters } = createNamespacedHelpers("cart")

export default {
  name: "AppHeader",
  computed: {
    ...cartGetters(["total"]),
    ...mapGetters(["onionURL"]),
    isIndexRoute() {
      return this.$route.name === "index"
    },
    getHomeURL() {
      const storeID = this.$route.params.id
      return storeID
        ? { name: "store-id", params: { id: storeID } }
        : { name: "index" }
    },
    getCartURL() {
      const storeID = this.$route.params.id
      return storeID
        ? { name: "store-id-cart", params: { id: storeID } }
        : { name: "cart" }
    },
  },
}
</script>

<style lang="scss">
.hero-head {
  .navbar {
    &.is-light {
      background-color: #f5f5f5;
    }

    > .container {
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .cartitem {
    position: relative;
    float: right;
  }

  .cartcount {
    font-family: 'Barlow', sans-serif;
    position: absolute;
    background: #ff2211;
    color: white;
    text-align: center;
    padding-top: 2px;
    height: 18px;
    width: 18px;
    font-size: 10px;
    margin: -8px 0 0 8px;
    border-radius: 50%;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    .button {
      padding: 0 0.2rem;

      .icon {
        &:first-child {
          &:not(:last-child) {
            margin-left: 0;
            margin-right: 0;
          }
        }
      }
    }

    .navbar-item {
      padding: 0 0.5rem;
    }
  }
}
</style>
