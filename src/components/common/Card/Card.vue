<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200"
    :class="[
      bordered ? 'border-gray-200' : 'border-transparent',
      hoverable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '',
      size === 'small' ? 'p-3' : size === 'large' ? 'p-6' : 'p-4',
      additionalClasses
    ]"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="title || $slots.title || extra || $slots.extra" class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <h3 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <slot name="title"></slot>
      </div>
      <div class="flex items-center space-x-2">
        <slot name="extra">
          <span v-if="extra" v-html="extra"></span>
        </slot>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Content -->
    <div v-else>
      <slot></slot>
    </div>

    <!-- Actions -->
    <div v-if="$slots.actions" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  extra: {
    type: String,
    default: ''
  },
  bordered: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  additionalClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>
</style> 