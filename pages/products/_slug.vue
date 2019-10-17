<template lang="pug">
  .container.has-text-centered(v-if="item")
    .columns.is-vcentered
      .column.is-5
        picture.image.is-square
          img.lazyload(:data-srcset="`${item.image}`",
                       :alt="`Image of ${item.title}`")

      .column.is-6.is-offset-1
        h1.title.is-2 {{ item.title }}
        h2.subtitle.is-4 {{item.description}}
        p.is-size-6 ${{ item.amount*1 }}
        br
        p.has-text-centered
          a.button.is-medium.is-info.is-outlined(@click="addItem(item)", aria-label="Add to cart") Add to cart
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('product')

export default {
  computed: {
    ...mapGetters(['productFromSlugParamRoute']),
    item () {
      return this.productFromSlugParamRoute(this.$route.params.slug)
    }
  },
  fetch ({ store, error, params }) {
    !store.state.products && store.dispatch('product/setProductsRef')
  },

  methods: {
    addItem (item) {
      return this.$store.dispatch('cart/addItem', item)
    }
  },
  head () {
    return this.item
      ? {
        title: `${this.item.title} | ${this.$store.getters['pkg/name']}`
      }
      : false
  }
}
</script>
