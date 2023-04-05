<template>
  <div class="container">
    <div class="columns is-centered is-mobile">
      <p class="is-size-1 has-text-weight-bold">{{ total }} {{ currency }}</p>
    </div>
    <div
      v-if="parseFloat(total) !== parseFloat(items.amount)"
      class="columns is-centered is-mobile"
    >
      <p class="is-size-5">
        {{ items.amount }} {{ currency
        }}<span v-if="items.discount !== '0'">
          - {{ decimalStr((items.amount * items.discount) / 100) }}
          {{ currency }} ({{ items.discount }}%)</span
        ><span v-if="items.tip !== '0'"> + {{ items.tip }} {{ currency }}</span>
      </p>
    </div>
    <div
      v-if="currentType === 'discount'"
      class="columns is-centered is-mobile"
    >
      <p class="is-size-3">{{ items.discount }} % discount</p>
    </div>
    <div class="columns is-centered is-mobile">
      <div class="section py-0">
        <div class="column">
          <b-button
            :type="getButtonType('amount')"
            @click="currentType = 'amount'"
          >
            Amount
          </b-button>
        </div>
      </div>
      <div class="section py-0">
        <div class="column">
          <b-button
            :type="getButtonType('discount')"
            @click="currentType = 'discount'"
          >
            Discount
          </b-button>
        </div>
      </div>
      <div class="section py-0">
        <div class="column">
          <b-button :type="getButtonType('tip')" @click="currentType = 'tip'">
            Tip
          </b-button>
        </div>
      </div>
    </div>
    <div class="section pt-0">
      <div
        v-for="i in 4"
        :key="`row-${i}`"
        class="columns is-centered is-gapless p-0 m-0 is-mobile"
      >
        <div v-for="j in 3" :key="`col-${j}`" class="p-0 m-0">
          <div class="column is-4 p-0 m-0" style="width: 60px">
            <button
              class="button is-large"
              style="width: 60px"
              @click="processButton(j, i)"
            >
              {{ getElement(j, i) }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered is-mobile">
      <div class="section">
        <div class="column">
          <button class="button is-large" @click="clearAll">Clear</button>
        </div>
      </div>
      <div class="section">
        <div class="column">
          <button class="button is-large" @click="createInvoice">Pay</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/utils/mixins"

export default {
  mixins: [mixins],
  async asyncData({ store, redirect }) {
    try {
      await store.dispatch("syncStats")
    } catch (e) {}
    if (!store.state.store?.checkout_settings?.pos_screen_enabled) {
      return redirect("/")
    }
  },
  data() {
    return {
      items: {
        amount: "0",
        discount: "0",
        tip: "0",
      },
      currentType: "amount",
    }
  },
  head() {
    return {
      script: [
        {
          src: `//${this.$store.getters.adminHost}/modal/bitcart.js`,
          async: true,
        },
      ],
    }
  },
  computed: {
    total() {
      return this.$utils.decimalStr.call(
        this,
        parseFloat(this.items.amount) +
          parseFloat(this.items.tip) -
          parseFloat(this.items.amount) *
            (parseFloat(this.items.discount) / 100)
      )
    },
    currency() {
      return this.$store.state.store.default_currency
    },
  },
  methods: {
    getElement(i, j) {
      if (j === 4) {
        const variants = [".", "0", "<"]
        return variants[i - 1]
      }
      return 3 * (j - 1) + i
    },
    processButton(i, j) {
      let value = this.getNewValue(this.items[this.currentType], i, j)
      // strip all values after decimal point of currency
      if (value.includes(".")) {
        const toAdd =
          this.currentType === "discount" ? 2 : this.$store.getters.divisibility
        value = value.substring(0, value.indexOf(".") + toAdd + 1)
      }
      if (this.currentType === "discount" && parseFloat(value) > 100)
        value = "100"
      this.items[this.currentType] = value
    },
    getNewValue(value, i, j) {
      if (j === 4 && i === 1) {
        if (!value.toString().includes(".")) {
          // add dot to the end of whole number
          value = value + "."
        }
      } else if (j === 4 && i === 3) {
        value = value.substring(0, value.length - 1)
        value = value === "" ? "0" : value
      } else {
        if (!value || value === "0") {
          value = ""
        }
        const addValue = j === 4 && i === 2 ? 0 : 3 * (j - 1) + i
        value += addValue
      }
      return value
    },
    createInvoice() {
      this.$axios
        .post("invoices", {
          store_id: this.$store.state.storeID,
          currency: this.$store.state.store.default_currency,
          price: this.total,
        })
        .then((res) => {
          this.items = {
            amount: "0",
            discount: "0",
            tip: "0",
          }
          window.bitcart.onModalReceiveMessage((data) => {
            if (typeof data.data === "object" && "status" in data.data) {
              this.status = data.data.status
              if (["paid", "confirmed", "complete"].includes(this.status)) {
                if (this.invoice.redirect_url) {
                  window.location = this.invoice.redirect_url
                }
              }
              window.bitcart.hideFrame()
            }
          })
          window.bitcart.showInvoice(res.data.id)
        })
    },
    getButtonType(type) {
      let style = "is-rounded"
      if (this.currentType === type) {
        style += " is-primary"
      }
      return style
    },
    clearAll() {
      this.items.amount = "0"
      this.items.discount = "0"
      this.items.tip = "0"
    },
  },
}
</script>

<style>
.button:focus:not(:active),
.button.is-focused:not(:active),
.button:focus,
.button.is-focused {
  box-shadow: none !important;
  border-color: hsl(0deg, 0%, 86%) !important;
}
</style>
