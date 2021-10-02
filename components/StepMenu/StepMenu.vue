<template lang="pug">
  .steps.is-large
    .step-item(v-for="(item, index) in menu",
               :key="item.name",
               :data-attr="index",
               :class="[actualStep > index && 'is-completed', actualStep == index && 'is-active']")
      .step-marker
        span.icon
          i.fa(:class="item.icon")
      .step-details(:class="[actualStep < index && 'has-text-grey-light']")
        p.step-title {{item.name}}
</template>

<script>
export default {
  name: "StepMenu",
  props: {
    actualStep: {
      type: Number,
      default: 0,
    },
    menu: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import "../../node_modules/bulma-steps/dist/css/bulma-steps.min.css";

$color-green: #00d1b2;
$color-white: white;

.steps {
  &.is-large {
    font-size: inherit;
    margin-bottom: 4rem;

    .step-item {
      .step-marker .icon *,
      .step-details .step-title {
        font-size: 1.2rem;
      }
    }
  }

  .is-active::before,
  .is-completed::before {
    background-position: left bottom;
  }

  .is-active .step-marker {
    background-color: $color-white;
    border-color: $color-green;
    color: $color-green;
  }

  .is-completed .step-marker {
    color: $color-white;
    background-color: $color-green;
  }
}
</style>
