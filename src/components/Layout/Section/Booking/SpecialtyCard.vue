<template>
  <div class="col-span-1">
    <a :href="link" class="flex flex-col items-center p-4 font-medium text-center text-xs md:text-sm hover:shadow-yu rounded-xl transition">
      <div class="rounded-full mb-2 w-16 h-16">
        <img
          :src="image"
          :alt="name"
          height="64"
          width="64"
        />
      </div>
      <h3>{{ name }}</h3>
    </a>
  </div>
</template>

<script>
export default {
  name: 'SpecialtyCard',
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    }
  }
}
</script>

<style scoped>
/* Styles dành riêng cho specialty card nếu cần */
</style>
