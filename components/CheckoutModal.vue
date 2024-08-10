<template lang="pug">
.container(v-if="!loading")
  UIExtensionSlot(name="checkout" :invoice="invoice")
    .card(v-if="error")
      UIExtensionSlot(name="checkout_error")
        header.card-header.has-text-centered
          p.card-header-title.is-centered Error
        .card-content.has-text-centered {{ error }}
    div(v-else)
      .card(v-if="showCheckout")
        UIExtensionSlot(name="checkout_modal_reopen")
          header.card-header.has-text-centered
            p.card-header-title.is-centered Checkout
          .card-content.has-text-centered Please checkout via payment modal
          .column.has-text-centered
            button.button.is-primary(@click="reopenModal")
              span Re-open modal
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
import UIExtensionSlot from "@/components/UIExtensionSlot"

const { mapActions, mapGetters } = createNamespacedHelpers("cart")

export default {
  components: {
    UIExtensionSlot,
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
      default: "",
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
      error: null,
      invoice: {},
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
        refunded: {
          icon: "mdi-cash-refund",
          text: "This invoice has been refunded",
        },
        "": {
          icon: "mdi-close",
          text: "This invoice is invalid",
        },
      }),
    }
  },
  head() {
    return {
      script: [
        {
          src: `//${this.$store.getters.adminHost}/modal/bitcart.js`,
          async: true,
          callback: () => {
            this.continueCreation()
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(["success", "adminHost"]),
  },
  methods: {
    ...mapActions([
      "setSuccess",
      "clearContents",
      "clearCount",
      "setActualStep",
    ]),
    reopenModal() {
      window.bitcart.showInvoice(this.invoice.id)
      window.bitcart.showFrame()
    },
    continueCreation() {
      const cart = Object.assign(
        {},
        ...Object.keys(this.cart).map((k) => ({ [k]: this.cart[k].count }))
      )
      this.$axios
        .post("invoices", {
          store_id: this.$store.state.storeID,
          currency: this.$store.state.store.default_currency,
          products: cart,
          price: this.total,
          buyer_email: this.email,
          promocode: this.promocode,
          shipping_address: this.shippingAddress,
          notes: this.notes,
        })
        .then((res) => {
          window.bitcart.onModalReceiveMessage((data) => {
            if (typeof data.data === "object" && "status" in data.data) {
              this.status = data.data.status
              if (["paid", "confirmed", "complete"].includes(this.status)) {
                this.setSuccess(true)
                this.clearContents()
                this.clearCount()
                if (this.invoice.redirect_url) {
                  window.location = this.invoice.redirect_url
                }
              } else {
                this.setSuccess(false)
              }
              this.showCheckout = false
              window.bitcart.hideFrame()
            }
          })
          this.invoice = res.data
          window.bitcart.showInvoice(res.data.id)
          this.loading = false
        })
        .catch((err) => {
          this.error = err.response ? err.response.data.detail : err
          this.loading = false
        })
    },
  },
}
</script>
