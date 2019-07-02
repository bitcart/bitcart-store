<template lang="pug">
  aside.is-light.is-radius
    .sidearea
      label.subtitle.is-5(for="pricerange") Highest Price:
        span  ${{ pricerange }}
      input.slider#pricerange(type="range"
                              :value="pricerange"
                              :min="min"
                              :max="max"
                              step="1"
                              @input="updateHighprice($event.target.value)")
      span.min.is-pulled-left ${{ min }}
      span.max.is-pulled-right ${{ max }}
    .sidearea
      label.subtitle.is-5(for="category") Categories
      .select
        select#category(@input="setCategory($event.target.value)")
          option(v-for="category in categories",
            :key="category",
            :selected="category === categorySelected",
            :value="category") {{ category }}
    .sidearea
      h4.subtitle.is-5 Contact Us
      p Contact data
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Switch from '@/components/Switch'

const { mapActions, mapGetters } = createNamespacedHelpers('product')

export default {
  name: 'Sidebar',
  components: {
    AppSwitch: Switch
  },
  props: {
    sale: {
      type: Boolean,
      default: false
    },
    pricerange: {
      type: [Number, String],
      default: 300
    }
  },
  data() {
    return {
      min: 0,
      max: 400
    }
  },
  computed: {
    ...mapGetters(['categories', 'categorySelected'])
  },
  methods: {
    ...mapActions(['updateHighprice', 'setCategory'])
  }

}
</script>

<style lang="stylus" scoped>
aside {
  float: left;
  width: 19.1489%;
  padding: 1.5rem;
  position: sticky;
}

.sidearea {
  border-bottom: 1px solid #ccc;
  padding: 20px 0;

  &:first-of-type {
    padding-top: 0;
    padding-bottom: 40px;
  }

  &:last-of-type {
    border: none;
    padding-bottom: 0;
  }

  .subtitle {
    padding-bottom: 10px;
    margin-bottom: 0;
    display: block;
  }
}

span {
  font-family: 'Barlow', sans-serif;
}

.min, .max {
  font-size: 12px;
  color: #565656;
}
</style>
