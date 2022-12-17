<template lang="pug">
  UIExtensionSlot(name="home_page")
    .container
      .section
        UIExtensionSlot(name="main_hero")
          app-hero
      .container
        .columns
          .column
            .section.capsule.is-clearfix
              UIExtensionSlot(name="sidebar")
                app-sidebar
              UIExtensionSlot(name="products" :products="products")
                transition-group.content.is-pulled-right(name="items", tag="div")
                  app-product-list-item(v-for="product in products",
                                        :key="product['id']",
                                        :item="product")
        .columns.is-centered
          UIExtensionSlot(name="pagination" :total="total" :current="current" :per-page="perPage")
            b-pagination.stick.is-marginless(:total="total"
              :current.sync="current"
              :per-page="perPage"
              order="is-centered"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page")
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import Hero from "@/components/Hero"
import ProductListItem from "@/components/ProductListItem"
import Sidebar from "@/components/Sidebar"
import UIExtensionSlot from "@/components/UIExtensionSlot"

const { mapGetters } = createNamespacedHelpers("product")

export default {
  components: {
    UIExtensionSlot,
    AppHero: Hero,
    AppProductListItem: ProductListItem,
    AppSidebar: Sidebar,
  },
  fetch({ store }) {
    return store.dispatch("product/setProductsRef")
  },
  computed: {
    ...mapGetters(["products", "highprice", "perPage"]),
    total() {
      return this.$store.state.product.count
    },
    current: {
      get() {
        return this.$store.state.currentPage
      },
      set(val) {
        this.$store.commit("setCurrentPage", val)
        this.$store.dispatch("product/setProductsRef")
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  /* no grid support */
  width: 79.7872%;
  /* grid */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  padding: 0;
}

.stick {
  position: fixed !important;
  bottom: 0 !important;
}
</style>
