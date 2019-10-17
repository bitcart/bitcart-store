<template lang="pug">
.content
  transition(name='modal')
    .modal-mask
      .modal-wrapper
        .modal-container
          .modal-header
            slot(name='header')
              a.modal-default-button(href='#' @click="$emit('close')") Close
          .modal-body
            .checkout(v-if="showCheckout")
              qrcode.mt4(:value='bitcoin_address' :options='{ scale: 8 }')
              .f7.fw1.lh-copy {{bitcoin_address}}
              .mt4 {{message}}

            .green.mv6.f3(v-if='!showCheckout')
              | Thank you for your payment
</template>

<script>
import Consola from 'consola'
export default {
  name: 'Modal',
  props: {
    total: {
      type: [Number, String],
      required: true
    },
    cart: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      network: process.env.VUE_APP_BITCOIN_NETWORK || 'mainnet',
      bitcoin_address: process.env.VUE_APP_BITCOIN_ADDRESS,
      amount: 0.5,
      message: '',
      showCheckout: true
    }
  },

  beforeMount () {
    Consola.log(this.total)
    Consola.log(this.cart)
    this.$axios.get('rate').then((r) => {
      this.amount = parseFloat(this.total / r.data).toFixed(8)
      this.$axios.post('invoices', { products: this.cart, amount: this.amount }).then((res) => {
        Consola.log(res.data)
        this.bitcoin_address = res.data.bitcoin_address
        this.message = `Waiting for ${this.amount} BTC payment`
        Consola.log(this.$store.state.env.URL)
        let url = this.combineURLs(`${this.$store.state.env.URL}`, `/i/${res.data.id}/status/ws/`)
        url = url.replace(`http://`, `ws://`).replace(`https://`, `wss://`)
        Consola.log(url)
        const ref = this
        const websocket = new WebSocket(url)
        websocket.onmessage = function (event) {
          const status = JSON.parse(event.data).status
          Consola.log(event.data)
          Consola.log(status)
          Consola.log(this)
          if (status === 'complete') {
            ref.showCheckout = false
            ref.message = 'Thank you for paying!'
          }
        }
      })
    })
  },
  methods: {
    completedPayment () {
      this.showCheckout = false
      this.message = `Thank you for your payment.<br><a class="b green" href="${process.env.VUE_APP_CONTENT_URL}" target="_blank">Click here to download.</a>`
    },
    combineURLs (baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
    }
  }
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
