<template lang="pug">
  .card.is-radius
    .card-image
      nuxt-link(exact, :to="{name: 'products-slug', params: { slug: `${slug}` } }")
        picture.image
          img.lazyload(:data-srcset="`${item.image}`",
                       :alt="`Image of ${item.title}`")
    .card-content
      .media
        .media-content
          nuxt-link(exact, :to="{name: 'products-slug', params: { slug: `${slug}` } }")
            p.title.is-5 {{ item.title }}
            p.item-price {{ item.amount*1 | usdollar }}
        .media-right
          p.field
            button.button.icon.is-large.add(@click="addItem(item)",
                                            aria-label="Add to cart")
              span.fa-stack
                i.fa.fa-circle.fa-stack-2x
                i.fa.fa-cart-plus.fa-stack-1x.fa-inverse
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { slug } from '@/helpers'
const { mapActions } = createNamespacedHelpers('cart')

export default {
  name: 'Card',
  filters: {
    usdollar: value => `$${value}`
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    slug () {
      return slug(this.item.title)
    }
  },
  methods: {
    ...mapActions(['addItem'])
  }
}
</script>

<style scoped lang="stylus">
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    img {
      padding-top: 1.5rem;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      height: 200px;
    }
  }

  .card-content {
    width: 100%;
  }

  .title, .subtitle {
    color: inherit;
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .button {
    border: 0;
    padding: 0;

    .fa-circle {
      transition: color 0.5s;
    }

    .fa-cart-plus {
      font-size: 1.4rem;
    }

    &:hover {
      .fa-circle {
        color: #209cee;
      }
    }

    &.icon {
      cursor: pointer;
    }
  }

  a {
    color: inherit;

    &:hover {
      color: #3273dc;
    }
  }
}

.lazyload, .lazyloading {
  opacity: 0;
}

.lazyloaded {
  opacity: 1;
  transition: opacity 150ms;
}
</style>
