<template>
  <router-link :to="link" class="group relative snap-center shrink-0 sm:last:mr-6 w-[280px] flex flex-col rounded-xl border-overflow overflow-hidden hover:shadow-md">
    <div class="flex flex-1 flex-col text-gray-800 p-4">
      <div class="w-24 h-24 aspect-square relative rounded-md overflow-hidden flex-none mx-auto border border-slate-200">
        <img 
          width="96" 
          height="96" 
          :src="image" 
          :alt="name" 
          class="absolute w-full h-full object-cover" 
        />
      </div>
      <h3 class="text-base font-semibold mt-4 group-hover:underline group-hover:underline-offset-2 group-hover:text-primary">
        {{ name }}
      </h3>
      <h4 class="line-clamp-2 text-sm">{{ address }}</h4>
    </div>
  </router-link>
</template>

<script setup>
// Props
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '#'
  }
});
</script>

<style scoped>
/* Có thể thêm các styles đặc biệt cho clinic card nếu cần */
</style> 