<template lang="pug">
transition(name="fade" mode="out-in")
    p.mt-6.mb-0.title.copytext(@click="copyText" v-if="show" key="text") {{text}}
    p.mt-6.mb-0.title.copytext(v-else key="copy") Copied
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: true,
    }
  },
  methods: {
    copyText() {
      this.$utils.copyToClipboard(this.text)
      this.show = false
      setTimeout(() => (this.show = true), 1000)
    },
  },
}
</script>
<style scoped>
.copytext {
  cursor: copy;
  display: block;
  display: -webkit-box;
  margin: 0 auto;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
}
</style>
