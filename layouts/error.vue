<template lang="pug">
    .container
        .section
            .capsule.content
                .has-text-centered
                    h3 {{title}}
                    nuxt-link(exact to="/")
                        button.button Home page
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  computed: {
    title () {
      return this.error.text ? this.error.text : (this.error.statusCode === 404 ? this.pageNotFound : this.otherError)
    }
  },
  head () {
    return { title: this.title }
  }
}
</script>
