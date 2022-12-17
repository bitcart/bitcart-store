<template lang="pug">
  UIExtensionSlot(name="error" :error="error")
    .container
        .section
            .capsule.content
                .has-text-centered
                    h3 {{title}}
                    nuxt-link(exact to="/")
                        button.button Home page
</template>

<script>
import UIExtensionSlot from "@/components/UIExtensionSlot"
export default {
  components: {
    UIExtensionSlot,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    }
  },
  head() {
    return { title: this.title }
  },
  computed: {
    title() {
      return this.error.text
        ? this.error.text
        : this.error.statusCode === 404
        ? this.pageNotFound
        : this.otherError
    },
  },
}
</script>
