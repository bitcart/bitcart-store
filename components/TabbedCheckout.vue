<template lang="pug">
v-container
  v-tabs(v-if='showProp && !noTabs' v-model='selectedTab' show-arrows='')
    v-tab(v-for='(item, key) in tabitem' :key='key')
      | {{ key }}
  v-tabs-items(v-if='showProp && !noTabs' v-model='selectedTab')
    v-tab-item(v-for='(itemv, key) in tabitem' :key='key')
      v-card.accent--border(raised='raised')
        v-card-title.justify-center
          | {{ checkoutPage ? product.name : &apos;QR code&apos; }}
        v-card-text.d-flex.justify-center
          v-container
            v-row.d-flex.justify-center
              .d-flex.justify-center
                qrcode(:options='{width: 256}' :value='itemv.payment_url' tag='v-img')
              v-col.d-flex.justify-center(cols='12')
                p.mt-6.mb-0.title
                  | {{ itemv.payment_address }}
                  br
                  |                     Waiting for {{ itemv.amount }} {{ itemv.currency.toUpperCase() }} payment
        v-card-actions.justify-center
          v-btn.justify-center(@click="copyText(itemv.payment_url, 'URL')" color='primary')
            v-icon(left='left')
              | mdi-content-copy
            span Copy
          v-btn.justify-center(v-if='!checkoutPage' @click='checkout(invoice.id)' color='primary')
            v-icon(left='left')
              | mdi-open-in-new
            span Open checkout
  v-card.accent--border(v-if='showProp && noTabs' raised='raised')
    v-card-title.justify-center
      | Empty
    v-card-text.d-flex.justify-center
      | No payment methods available
  v-snackbar(v-model='showSnackbar' :timeout='2500' color='success' bottom='')
    v-icon mdi-content-copy
    |       Successfully copied {{ whatToCopy }} to clipboard!

</template>

<script>
export default {
  props: {
    showProp: {
      type: Boolean,
      default: true
    },
    checkoutPage: {
      type: Boolean,
      default: false
    },
    tabitem: {
      type: Object,
      default () { return {} }
    },
    invoice: {
      type: Object,
      default () { return {} }
    },
    product: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      selectedTab: null,
      whatToCopy: 'ID',
      showSnackbar: false
    }
  },
  computed: {
    noTabs () {
      return Object.entries(this.tabitem).length === 0 && this.tabitem.constructor === Object
    }
  },
  watch: {
    showProp (val) {
      if (!val) { this.selectedTab = null }
    }
  },
  methods: {
    checkout (id) {
      if (!id) { id = this.qrItem.id }
      this.$router.replace({ path: `/i/${id}` })
    },
    copyToClipboard (text) {
      const el = document.createElement('textarea')
      el.addEventListener('focusin', e => e.stopPropagation())
      el.value = text
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
    copyText (text, desc) {
      this.copyToClipboard(text)
      this.whatToCopy = desc || 'ID'
      this.showSnackbar = true
    }
  }
}
</script>
