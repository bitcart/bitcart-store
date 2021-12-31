<template lang="pug">
  aside.is-light.is-radius
    .sidearea
      label.subtitle.is-5(for="pricerange") Price range:
        span  {{ decimalStr(highprice[0]) }}-{{ decimalStr(highprice[1]) }} {{ currency }}
      b-slider#pricerange(:value="highprice",
        :min="0",
        :max="maxprice",
        :step="1",
        lazy,
        :aria-label="['slider thumb min', 'slider thumb max']",
        @input="updateHighprice")
      span.min.is-pulled-left {{ decimalStr(min) }} {{ currency }}
      span.max.is-pulled-right {{ decimalStr(maxprice) }} {{ currency }}
    app-switch(v-if="!sale")
    .sidearea
      label.subtitle.is-5(for="perpage") Items per page:
      b-select#perpage(type="number" :value="perPage" @input="setPerPage")
        option(value="6") 6
        option(value="12") 12
        option(value="18") 18
        option(value="-1") All
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
      p.subtitle.is-6 {{$store.state.store.email}}
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import Switch from "@/components/Switch"
import mixins from "@/helpers/mixins"

const { mapActions, mapGetters } = createNamespacedHelpers("product")

export default {
  name: "Sidebar",
  components: {
    AppSwitch: Switch,
  },
  mixins: [mixins],
  props: {
    sale: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      min: 0,
    }
  },
  computed: {
    ...mapGetters([
      "categories",
      "categorySelected",
      "maxprice",
      "highprice",
      "perPage",
    ]),
    currency() {
      return this.$store.state.store.default_currency
    },
  },
  methods: {
    ...mapActions(["updateHighprice", "setCategory", "setPerPage"]),
  },
}
</script>

<style lang="scss" scoped>
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
  font-family: "Barlow", sans-serif;
}

.min,
.max {
  font-size: 12px;
  color: #565656;
}
</style>
