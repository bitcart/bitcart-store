<template lang="pug">
  section.hero
    .hero-head
      app-header
    .hero-body
      nuxt
    .hero-foot
      .container
        p &copy; BitcartCC v{{VERSION}}
    app-cart-sidebar
</template>

<script>
import Header from "@/components/Header"
import VERSION from "@/version"
import CartSidebar from "@/components/CartSidebar"
import { isEmpty } from "@/helpers"

export default {
  components: {
    AppHeader: Header,
    AppCartSidebar: CartSidebar,
  },
  data() {
    return {
      VERSION,
    }
  },
  async fetch() {
    await this.$store.dispatch("syncStats")
  },
  head() {
    const themeURL = this.$store.state.store?.theme_settings?.store_theme_url
    const commonHead = !isEmpty(this.$store.state.store)
      ? { title: `${this.$store.state.store.name} | bitcart-store` }
      : {}
    return themeURL
      ? {
          link: [
            {
              rel: "stylesheet",
              href: themeURL,
            },
          ],
          ...commonHead,
        }
      : commonHead
  },
  beforeCreate() {
    this.$store.dispatch("syncStats")
  },
}
</script>

<style lang="scss">
@import "../node_modules/@fortawesome/fontawesome-free/css/all.css";
@import "./css/_transition";
@import "./css/_slider";

html {
  overflow-y: auto;
}

.image-preview {
  width: auto;
  height: auto;
  max-width: 200px;
  max-height: 200px;
  vertical-align: middle;
}

.section {
  padding: 3rem 0 1.5rem;
}

.hero {
  min-height: 100vh;

  .hero-body {
    flex: 1;
  }

  .hero-footer {
    margin-bottom: 0.5rem;
  }
}

.is-light {
  background-color: #f5f5f5;
  color: #363636;
}

$card-radius: 5px;

.is-radius {
  border-radius: $card-radius;
}

@media (max-width: 600px) {
  aside {
    width: 100% !important;
    margin-bottom: 10px !important;
  }

  .content {
    width: 100% !important;
    grid-template-columns: 1fr !important;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .content {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
