<template lang="pug">
  .card.is-radius
    .card-image
      nuxt-link(exact, :to="productRedirectURL")
        picture.image.image-preview
          img.lazyload(:data-srcset="`${productURL(item.image)}`",
                       :alt="`Image of ${item.name}`")
    .card-content
      .media
        .media-content
          nuxt-link(exact, :to="productRedirectURL")
            p.title.is-5 {{ item.name }}
            p.item-price {{ decimalStr(item.price) }} {{ currency }}
        .media-right
          p.field
            button.button.icon.is-large.add(@click="addItem(item)",
                                            aria-label="Add to cart")
              span.fa-stack
                i.fa.fa-circle.fa-stack-2x
                i.fa.fa-cart-plus.fa-stack-1x.fa-inverse
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import { slug as slugf } from "@/helpers"
import mixins from "@/helpers/mixins"
const { mapActions } = createNamespacedHelpers("cart")

export default {
  name: "Card",
  mixins: [mixins],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    slug() {
      return `${slugf(this.item.name)}-${this.item.id}`
    },
    currency() {
      return this.$store.state.store.default_currency
    },
    productRedirectURL() {
      const storeID = this.$route.params.id
      return storeID
        ? {
            name: "store-id-products-slug",
            params: { id: storeID, slug: `${this.slug}` },
          }
        : { name: "products-slug", params: { slug: `${this.slug}` } }
    },
  },
  methods: {
    ...mapActions(["addItem"]),
    combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL
    },
    productURL(url) {
      return this.combineURLs(`${this.$store.getters.apiURL}`, url)
    },
  },
}
</script>

<style lang="scss" scoped>
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
.card .title,
.card .subtitle {
	color: inherit;
}
.lazyload,
.lazyloading {
	opacity: 0;
}
.lazyloaded {
	opacity: 1;
	transition: opacity 150ms;
}
</style>
