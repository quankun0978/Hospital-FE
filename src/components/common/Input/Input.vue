<template>
  <div class="ant-form-item">
    <div class="ant-form-item-control">
      <label v-if="label" :for="id" class="block mb-1 text-sm font-medium text-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div class="relative flex items-center mt-1">
        <!-- Prefix slot (mã vùng điện thoại hoặc icon) -->
        <span v-if="usePrefix" class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">
          <slot name="prefix"></slot>
        </span>
        
        <input
          :id="id"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :type="showPassword ? 'text' : type"
          :placeholder="placeholder"
          :maxlength="maxlength"
          :pattern="pattern"
          :inputmode="inputmode"
          :required="required"
          :disabled="disabled"
          :class="[
            'px-3 py-2 focus:ring-primary focus:border-primary block w-full shadow-sm rounded-md placeholder:text-sm border border-gray-200',
            { 'border-red-500': error },
            { 'rounded-l-none': usePrefix },
            { 'rounded-r-md': true },
            { 'rounded-l-md': !usePrefix },
            additionalClasses
          ]"
        />
        <img
          v-if="type === 'password'"
          @click="togglePasswordVisibility"
          width="20"
          height="20"
          class="absolute top-[11px]  right-[10px] cursor-pointer"
          :src="showPassword ? 'https://youmed.vn/dat-kham/assets/img/booking/svg/Show.svg' : 'https://youmed.vn/dat-kham/assets/img/booking/svg/Hide.svg'"
        />
      </div>
      <div v-if="helpText" class="mt-2 text-sm text-gray-500">{{ helpText }}</div>
      <div v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CustomInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'search'].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: [String, Number],
      default: undefined
    },
    minlength: {
      type: [String, Number],
      default: undefined
    },
    pattern: {
      type: String,
      default: undefined
    },
    inputmode: {
      type: String,
      default: undefined
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    usePrefix: {
      type: Boolean,
      default: false
    },
    additionalClasses: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const showPassword = ref(false);

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      showPassword,
      togglePasswordVisibility
    };
  }
};
</script>

<style scoped>

</style>
