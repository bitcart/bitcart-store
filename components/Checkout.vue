<template lang="pug">
  .content
    transition(name="fade")

      form.payment(@submit.prevent="beforePay")
        h3 Please enter your payment details:

        UIExtensionSlot(name="checkout_enter_details"
        @update:email="$emit('update:email', $event)"
        @update:promocode="$emit('update:promocode', $event)"
        @update:shippingAddress="$emit('update:shippingAddress', $event)"
        @update:notes="$emit('update:notes', $event)")
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
          UIExtensionSlot(name="checkout_enter_details_extra")

        .field
          button.button.is-success(:disabled="errors.any()")
            | Generate invoice

</template>

<script>
import { mapGetters } from "vuex"
import UIExtensionSlot from "@/components/UIExtensionSlot"

export default {
  name: "Checkout",
  components: {
    UIExtensionSlot,
  },
  props: {
    total: {
      type: [Number, String],
      required: true,
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
  computed: {
    ...mapGetters(["emailRequired"]),
  },
  methods: {
    async beforePay() {
      const isAllFieldsValid = await this.$validator.validateAll()
      if (!isAllFieldsValid) {
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
</style>
