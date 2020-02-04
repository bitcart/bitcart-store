<template lang="pug">
  .container
    .section
      app-hero
    .container
      .columns
        .column
          .section.capsule.is-clearfix
            app-sidebar
            transition-group.content.is-pulled-right(name="items", tag="div")
              app-product-list-item(v-for="product in products",
                                    :key="product['id']",
                                    :item="product")
      .columns.is-centered
        b-pagination.stick.is-marginless(:total="total" :current.sync="current" :per-page="6" order="is-centered")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Hero from '@/components/Hero'
import ProductListItem from '@/components/ProductListItem'
import Sidebar from '@/components/Sidebar'

const { mapGetters } = createNamespacedHelpers('product')

export default {
  components: {
    AppHero: Hero,
    AppProductListItem: ProductListItem,
    AppSidebar: Sidebar
  },
  fetch ({ store }) {
    return store.dispatch('product/setProductsRef')
  },
  computed: {
    ...mapGetters(['products', 'highprice']),
    total () {
      return this.$store.state.product.count
    },
    current: {
      get () {
        return this.$store.state.currentPage
      },
      set (val) {
        this.$store.commit('setCurrentPage', val)
        this.$store.dispatch('product/setProductsRef')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
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
