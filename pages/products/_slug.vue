<template lang="pug">
  .container.has-text-centered(v-if="item")
    .columns.is-vcentered
      .column.is-5
        picture.image.is_square
          img.lazyload(:data-srcset="`${productURL(item.image)}`",
                       :alt="`Image of ${item.name}`")

      .column.is-6.is-offset-1
        h1.title.is-2 {{ item.name }}
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
  created () {
    !this.$store.state.products && this.$store.dispatch('product/setProductsRef')
  },

  methods: {
    addItem (item) {
      return this.$store.dispatch('cart/addItem', item)
    },
    combineURLs (baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
    },
    productURL (url) {
      return this.combineURLs(`${this.$store.state.env.URL}`, url)
    }
  },
  head () {
    if (this.item) {
      const headData = {
        title: `${this.item.name} | ${this.$store.getters['package/name']}`,
        meta: [
          { hid: 'og:title', property: 'og:title', content: this.item.name },
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'og:url', property: 'og:url', content: new URL(this.$route.path, document.location).href }

        ]
      }
      if (this.item.description) { headData.meta.push({ hid: 'og:description', property: 'og:description', content: this.item.description }) }
      if (this.item.image) { headData.meta.push({ hid: 'og:image', property: 'og:image', content: this.productURL(this.item.image) }) }
      return headData
    }
    return false
  }
}
</script>
