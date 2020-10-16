<template lang="pug">
  section.hero
    .hero-head
      app-header
    .hero-body
      nuxt
    .hero-foot
      .container
        p &copy; BitcartCC v{{VERSION}}
</template>

<script>
import Header from "@/components/Header"
import VERSION from "@/version"

export default {
  components: { AppHeader: Header },
  data() {
    return {
      VERSION,
    }
  },
  beforeCreate() {
    this.$store.dispatch("syncStats")
  },
}
</script>

<style lang="stylus">
@require '../node_modules/@fortawesome/fontawesome-free/css/all.css';
@require './css/_transition';
@require './css/_slider';

html {
  overflow-y: auto;
}

.image-preview {
  width: auto;
  height: auto;
  max-width: 200px;
  max-height: 200px;
  vertical-align: middle;
}

.section {
  padding: 3rem 0 1.5rem;
}

.hero {
  min-height: 100vh;

  .hero-body {
    flex: 1;
  }

  .hero-footer {
    margin-bottom: 0.5rem;
  }
}

.is-light {
  background-color: #f5f5f5;
  color: #363636;
}

$card-radius = 5px;

.is-radius {
  border-radius: $card-radius;
}

@media (max-width: 600px) {
  aside {
    width: 100% !important;
    margin-bottom: 10px !important;
  }

  .content {
    width: 100% !important;
    grid-template-columns: 1fr !important;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .content {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
