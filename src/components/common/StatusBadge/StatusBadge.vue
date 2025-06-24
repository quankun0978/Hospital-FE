<template>
  <span 
    class="px-2 py-1 text-xs font-medium rounded-full"
    :class="badgeClasses"
  >
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['success', 'error', 'warning', 'info', 'default'].includes(value)
  },
  text: {
    type: String,
    required: true
  }
})

const badgeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    case 'info':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})
</script>

<style scoped>
</style> 