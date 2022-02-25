<template lang="pug">
  .content
    transition(name="fade")

      form.payment(v-if="status !== 'failure'", @submit.prevent="beforePay")
        h3 Please enter your payment details:

        .field
          label.label(for="email") Email
          .control.has-icons-left.has-icons-right
            input.input#email(type="email",
                              :required="emailRequired",
                              placeholder="name@example.com",
                              name="email",
                              @input="$emit('update:email', $event.target.value)"
                              v-validate="'email'",
                              :class="{ 'is-danger': errors.has('email') }")
            span.icon.is-small.is-left
              i.fa.fa-envelope
            span.icon.is-small.is-right(v-if="errors.has('email')")
              i.fa.fa-exclamation-triangle
            p.help.is-danger(v-if="errors.has('email')") {{ errors.first('email') }}
        .field
          label.label(for="promocode") Promocode
          input.input#promocode(type="text",
                            label="Promocode",
                            name="promocode",
                            @input="$emit('update:promocode', $event.target.value)"
                            :class="{ 'is-danger': errors.has('promocode') }")
        .field
          label.label(for="shippingAddress") Shipping address
          textarea.textarea#shippingAddress(type="text",
                            label="Shipping address",
                            name="shippingAddress",
                            @input="$emit('update:shippingAddress', $event.target.value)"
                            :class="{ 'is-danger': errors.has('shippingAddress') }")
        .field
          label.label(for="notes") Notes
          textarea.textarea#notes(type="text",
                            label="Notes",
                            name="notes",
                            @input="$emit('update:notes', $event.target.value)"
                            :class="{ 'is-danger': errors.has('notes') }")

        .field
          button.button.is-success.pay-with-stripe(:disabled="errors.any()",
                                                   :class="{ 'is-loading': isLoading }")
            | Generate invoice

      .statusFailure.has-text-centered(v-if="status === 'failure'")
        h3 Oh No!
        p Something went wrong!
        button.button(@click="clearCheckout") Please try again

</template>

<script>
import { mapActions, mapGetters } from "vuex"

const STRIPE_URL = process.env.STRIPE_URL

export default {
  name: "Checkout",

  props: {
    total: {
      type: [Number, String],
      required: true,
    },
    stripeUrl: {
      type: String,
      default: STRIPE_URL,
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
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }
  },
  computed: {
    ...mapGetters("checkout", ["isStripeCardCompleted", "status", "isLoading"]),
    ...mapGetters(["emailRequired"]),
  },
  methods: {
    ...mapActions("cart", [
      "clearCheckout",
      "pay",
      "setIsStripeCardCompleted",
      "setStatus",
    ]),

    async beforePay() {
      const isAllFieldsValid = await this.$validator.validateAll()
      if (!isAllFieldsValid) {
        this.setStatus("failure")
        return
      }
      await this.$emit("pay")
    },
  },
}
</script>

<style lang="scss" scoped>
.payment {
  border: 1px solid #ccc;
  max-width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
.stripe-card {
  margin-bottom: 10px;
  &.input {
    display: block;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
