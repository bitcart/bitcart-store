<template lang="pug">
  UIExtensionSlot(name="product" :item="item")
    .container.has-text-centered(v-if="item")
      .columns.is-vcentered
        .column.is-5
          UIExtensionSlot(name="product_image")
          picture.image.is_square
            img.lazyload(:data-srcset="`${productURL(item.image)}`",
                        :alt="`Image of ${item.name}`")

        .column.is-6.is-offset-1
          UIExtensionSlot(name="product_description" :item="item")
            h1.title.is-2 {{ item.name }}
            h2.subtitle.is-4 {{item.description}}
            p.is-size-6 {{ item.price }} {{ currency }}
            br
            p.has-text-centered
              a.button.is-medium.is-success.is-outlined(@click="addItem(item)", aria-label="Add to cart") Add to cart
</template>

<script>
import isHTTPS from "is-https"
import { createNamespacedHelpers } from "vuex"
import UIExtensionSlot from "@/components/UIExtensionSlot"

const { mapGetters } = createNamespacedHelpers("product")

export default {
  components: {
    UIExtensionSlot,
  },
  asyncData({ store, req, route, error, redirect, app }) {
    let url = ""
    if (req) {
      url = req.headers.host
      if (isHTTPS(req)) {
        url = "https://" + url
      } else {
        url = "http://" + url
      }
    } else {
      url = window.location.origin
    }
    store.commit("SET_CURRENT_URL", url)
    if (!route.params.slug) {
      return error({ statusCode: 404 })
    }
    const params = route.params.slug.split(/[- ]+/)
    if (params.length < 2) {
      return error({ statusCode: 404, text: "Product not found" })
    }
    const productId = params.pop()
    store.commit("product/SET_PRODUCT_ID", productId)
    if (Number.isNaN(productId)) {
      return error({ statusCode: 404, text: "Product not found" })
    }
    return app.$axios
      .get(`/products/${productId}?store=${store.state.storeID}`)
      .then((r) => store.commit("product/SET_PRODUCTS", [r.data]))
      .catch((e) => {
        error({ statusCode: 404, text: "Product not found" })
      })
  },
  head() {
    let url = ""
    if (process.server) {
      const URL = require("url").URL
      url = new URL(this.$route.path, this.$store.getters.url).href
    } else {
      url = new URL(this.$route.path, this.$store.getters.url).href
    }
    if (this.item) {
      const headData = {
        title: `${this.item.name} | ${this.$store.getters["package/name"]}`,
        meta: [
          { hid: "og:title", property: "og:title", content: this.item.name },
          { hid: "og:type", property: "og:type", content: "article" },
          { hid: "og:url", property: "og:url", content: url },
        ],
      }
      if (this.item.description) {
        headData.meta.push({
          hid: "og:description",
          property: "og:description",
          content: this.item.description,
        })
      }
      if (this.item.image) {
        headData.meta.push({
          hid: "og:image",
          property: "og:image",
          content: this.productURL(this.item.image),
        })
      }
      return this.$utils.getExtendSetting.call(this, "product_head", headData)
    }
    return false
  },
  computed: {
    ...mapGetters(["productFromSlugParamRoute"]),
    item() {
      return this.productFromSlugParamRoute
    },
    currency() {
      return this.$store.state.store.default_currency
    },
  },
  methods: {
    addItem(item) {
      return this.$store.dispatch("cart/addItem", item)
    },
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
