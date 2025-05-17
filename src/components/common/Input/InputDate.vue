<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">{{ label }}</label>
    <input 
      type="date" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="px-3 py-2 focus:ring-primary focus:border-primary block w-full border border-gray-200 rounded-md"
      :class="{ 'border-red-500': error }"
      :placeholder="placeholder"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineEmits(['update:modelValue']);

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});
</script>
