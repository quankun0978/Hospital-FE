<template>
  <div class="relative">
    <!-- Icon phía trái hoặc phải dựa vào iconPosition -->
    <div 
      v-if="iconPosition === 'left'"
      class="absolute bg-transparent flex items-center border-0 left-1 inset-y-0 p-2"
    >
      <img :src="icon" class="cursor-pointer object-cover" width="20" height="20" alt="Search">
    </div>
    
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :class="[
        'bg-white m-0 block w-full text-base placeholder:text-base flex-1 focus:outline-none',
        rounded ? 'rounded-full' : 'rounded-md',
        getBorderClass,
        getPaddingClass,
        additionalClasses
      ]"
    />
    
    <div 
      v-if="iconPosition === 'right'"
      class="absolute bg-transparent flex border-0 right-0 p-4 inset-y-0 items-center"
      @click="$emit('icon-click')"
    >
      <img :src="icon" class="cursor-pointer object-cover" width="20" height="20" alt="Search">
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputSearch',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'search'
    },
    name: {
      type: String,
      default: 'q'
    },
    placeholder: {
      type: String,
      default: 'Nhập từ khóa tìm kiếm...'
    },
    icon: {
      type: String,
      required: true
    },
    iconPosition: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    },
    rounded: {
      type: Boolean,
      default: true
    },
    borderType: {
      type: String,
      default: 'transparent',
      validator: (value) => ['transparent', 'slate', 'primary'].includes(value)
    },
    additionalClasses: {
      type: String,
      default: ''
    }
  },
  computed: {
    getBorderClass() {
      switch (this.borderType) {
        case 'transparent':
          return 'border-transparent focus:border-primary';
        case 'slate':
          return 'border-slate-200 focus:border-primary';
        case 'primary':
          return 'border-primary';
        default:
          return 'border-transparent focus:border-primary';
      }
    },
    getPaddingClass() {
      if (this.iconPosition === 'left') {
        return 'py-3 pl-10 pr-6';
      } else {
        return 'py-3 pr-9 pl-6';
      }
    }
  },
  emits: ['update:modelValue', 'icon-click']
};
</script>

<style scoped>
/* Custom styles nếu cần */
</style>
