<template>
  <div>
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">{{ label }}</label>
    <select 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="px-3 py-2 focus:ring-primary focus:border-primary block w-full border border-gray-200 rounded-md"
      :class="{ 'border-red-500': error }"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineEmits(['update:modelValue']);

defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  }
});
</script>
