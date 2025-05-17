<template>
  <div class="container mx-auto text-center my-10">
    <h2 class="text-xl md:text-4xl font-bold">{{ title }}</h2>
    <p class="opacity-80">
      {{ subtitle }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'MainHeading',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
/* Styles riêng cho MainHeading nếu cần */
</style>
