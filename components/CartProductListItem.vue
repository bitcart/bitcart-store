<template lang="pug">
  .box
    article.media
      .media-left
        picture.image.is-64x64
          img.lazyload(:data-srcset="`${productURL(item.image)}`",
                       :alt="`Image of ${item.name}`")
      .media-content
        .content
          p
            strong {{ item.name }}
            br
            span.itemCount {{ item.count }}
            |  x {{ item.price*1 }} {{ currency }} = {{ item.count * item.price }} {{ currency }}
        nav.level.is-mobile
          .level-left
            a.level-item.removeItem(@click="removeItem(item)", title="Remove")
              span.icon.is-small
                i.fa.fa-trash-alt
            a.level-item
              span.icon.is-small
                i.fa.fa-retweet
            a.level-item
              span.icon.is-small.has-text-danger
                i.fa.fa-heart
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('cart')

export default {
  name: 'CartProductListItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    currency () {
      return this.$store.state.store.default_currency
    }
  },
  methods: {
    ...mapActions(['removeItem']),
    combineURLs (baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
    },
    productURL (url) {
      return this.combineURLs(`${this.$store.state.env.URL}`, url)
    }
  }
}
</script>
