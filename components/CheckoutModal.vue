<template lang="pug">
.container(v-if="!loading")
  UIExtensionSlot(name="checkout" :invoice="invoice" :payments="tabitem")
    b-tabs(v-if="showCheckout && !noTabs" type="is-boxed" :animated="false" v-model="selectedTab")
      b-tab-item(v-for="(item, index) in tabitem" :key="index" :label="item.name")
        UIExtensionSlot(name="checkout_tab_item" :item="itemv" :qrValue="qrValue" :invoice="invoice" :showRecommendedFee="showRecommendedFee")
          .card
            header.card-header.has-text-centered
              p.card-header-title.is-centered Checkout
            .card-content
              .container
                .columns(v-if="itemv.lightning")
                  .column
                    b-tabs(type="is-toggle" position="is-centered" :animated="false" v-model="selectedToCopy")
                      b-tab-item(label="Invoice")
                      b-tab-item(label="Node Info")
                .columns
                  .column.has-text-centered
                    qrcode(:options="{width: 256}" :value="qrValue" tag="img")
                .columns
                  .column.has-text-centered
                    p.mt-6.mb-0.title(v-if="itemv.symbol.toUpperCase() !== invoice.currency") 1 {{ itemv.symbol.toUpperCase() }} = {{ itemv.rate_str }}
                    CopyText(:text="itemv.node_id" v-if="itemv.lightning && selectedToCopy === 1")
                    CopyText(:text="itemv.payment_address" v-else)
                    p.mt-6.mb-0.title Waiting for {{ itemv.amount }} {{ itemv.symbol.toUpperCase() }} payment
                .columns(v-show="showRecommendedFee")
                  .column.has-text-centered
                    p.mt-3.mb-0.subtitle Recommended fee: {{ itemv.recommended_fee }} sat/byte
            .card-footer
              .card-footer-item
                button.button.is-primary(@click="copyText(itemv.payment_url, 'URL')")
                  b-icon(icon="content-copy")
                  span Copy
    .card(v-if="showCheckout && noTabs")
      UIExtensionSlot(name="checkout_empty")
        header.card-header.has-text-centered
          p.card-header-title.is-centered Empty
        .card-content.has-text-centered No payment methods available
    .card(v-if="!showCheckout && !success")
      UIExtensionSlot(name="checkout_status_display" :texts="texts" :status="status")
        .card-content
          .container
            .columns
              .column.has-text-centered
                span {{ texts[status].text}}
            .columns
              .column.has-text-centered
                button.button.is-primary(@click="setActualStep(1)")
                  b-icon(icon="arrow-left")
                  span Back to payment details
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import CopyText from "@/components/CopyText"
import UIExtensionSlot from "@/components/UIExtensionSlot"

const { mapActions, mapGetters } = createNamespacedHelpers("cart")

export default {
  components: {
    UIExtensionSlot,
    CopyText,
  },
  props: {
    total: {
      type: [Number, String],
      required: true,
    },
    cart: {
      type: Object,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    promocode: {
      type: String,
      default: null,
    },
    shippingAddress: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showCheckout: true,
      selectedTab: 0,
      selectedToCopy: 0,
      whatToCopy: "ID",
      price: 0,
      invoice: {},
      tabitem: {},
      loading: true,
      status: "pending",
      texts: this.$utils.getExtendSetting.call(this, "checkout_status_texts", {
        expired: {
          icon: "mdi-close",
          text: "This invoice has expired",
        },
        invalid: {
          icon: "mdi-close",
          text: "This invoice has been marked as invalid",
        },
        paid: {
          icon: "mdi-check",
          text: "This invoice has been paid",
        },
        confirmed: {
          icon: "mdi-check",
          text: "This invoice has been paid",
        },
        complete: {
          icon: "mdi-check",
          text: "This invoice has been paid",
        },
        "": {
          icon: "mdi-close",
          text: "This invoice is invalid",
        },
      }),
    }
  },
  computed: {
    ...mapGetters(["success"]),
    noTabs() {
      return (
        Object.entries(this.tabitem).length === 0 &&
        this.tabitem.constructor === Object
      )
    },
    itemv() {
      return this.tabitem[this.selectedTab]
    },
    qrValue() {
      return this.itemv.lightning && this.selectedToCopy === 1
        ? this.itemv.node_id
        : this.itemv.payment_url
    },
    showRecommendedFee() {
      return (
        this.$store.state.store.checkout_settings &&
        this.$store.state.store.checkout_settings.show_recommended_fee &&
        this.itemv.recommended_fee !== 0
      )
    },
  },
  watch: {
    showCheckout(val) {
      if (!val) {
        this.selectedTab = null
      }
    },
    selectedTab(val) {
      this.selectedToCopy = 0
    },
  },
  beforeMount() {
    const cart = Object.assign(
      {},
      ...Object.keys(this.cart).map((k) => ({ [k]: this.cart[k].count }))
    )
    this.price = this.total
    this.$axios
      .post("invoices", {
        store_id: this.$store.state.storeID,
        currency: this.$store.state.store.default_currency,
        products: cart,
        price: this.price,
        buyer_email: this.email,
        promocode: this.promocode,
        shipping_address: this.shippingAddress,
        notes: this.notes,
      })
      .then((res) => {
        this.tabitem = res.data.payments
        this.invoice = res.data
        this.loading = false
        let url = this.combineURLs(
          `${this.$store.getters.apiURL}`,
          `ws/invoices/${res.data.id}`
        )
        url = url.replace(`http://`, `ws://`).replace(`https://`, `wss://`)
        const ref = this
        const websocket = new WebSocket(url)
        websocket.onmessage = function (event) {
          const status = JSON.parse(event.data).status
          ref.status = status
          if (["paid", "confirmed", "complete"].includes(status)) {
            ref.setSuccess(true)
            ref.clearContents()
            ref.clearCount()
            ref.showCheckout = false
            if (ref.invoice.redirect_url) {
              window.location = ref.invoice.redirect_url
            }
          } else {
            ref.setSuccess(false)
            ref.showCheckout = false
          }
        }
      })
  },
  methods: {
    ...mapActions([
      "setSuccess",
      "clearContents",
      "clearCount",
      "setActualStep",
    ]),
    checkout(id) {
      if (!id) {
        id = this.qrItem.id
      }
      this.$router.replace({ path: `/i/${id}` })
    },
    copyText(text, desc) {
      this.$utils.copyToClipboard(text)
      this.whatToCopy = desc || "ID"
      this.$buefy.snackbar.open({
        message: `Successfully copied ${this.whatToCopy} to clipboard!`,
        type: "is-success",
        duration: 2500,
        position: "is-bottom",
      })
    },
    combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL
    },
  },
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 0;
}
.modal-default-button {
  color: #ddd;
  text-decoration: none;
  float: right;
}
/*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
