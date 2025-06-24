<template>
  <div class="dropdown" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="[
        'dropdown-trigger',
        triggerClass,
        { 'active': isOpen }
      ]"
      :disabled="disabled"
    >
      <slot name="trigger" :isOpen="isOpen" :selectedValue="selectedValue">
        <span>{{ displayText }}</span>
        <svg
          :class="['dropdown-arrow', { 'rotate-180': isOpen }]"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 512 512"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M112 184l144 144 144-144"
          />
        </svg>
      </slot>
    </button>

    <transition name="dropdown">
      <div
        v-if="isOpen"
        :class="[
          'dropdown-menu',
          menuClass,
          positionClass
        ]"
      >
        <slot name="menu" :close="closeDropdown" :selectOption="selectOption">
          <div
            v-for="option in options"
            :key="getOptionValue(option)"
            @click="selectOption(option)"
            :class="[
              'dropdown-item',
              itemClass,
              { 
                'active': isSelected(option),
                'disabled': isOptionDisabled(option)
              }
            ]"
          >
            <slot name="option" :option="option" :isSelected="isSelected(option)">
              {{ getOptionLabel(option) }}
            </slot>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

// Component name for debugging
defineOptions({
  name: 'Dropdown'
});

const props = defineProps({
  // Dữ liệu
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number, Object, Array],
    default: null
  },
  
  // Hiển thị
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  
  // Styling
  triggerClass: {
    type: String,
    default: ''
  },
  menuClass: {
    type: String,
    default: ''
  },
  itemClass: {
    type: String,
    default: ''
  },
  
  // Behavior
  disabled: {
    type: Boolean,
    default: false
  },
  closeOnSelect: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'bottom-left', // bottom-left, bottom-right, top-left, top-right
    validator: (value) => ['bottom-left', 'bottom-right', 'top-left', 'top-right'].includes(value)
  },
  
  // Multiple selection
  multiple: {
    type: Boolean,
    default: false
  },
  
  // Search
  searchable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close']);

// Refs
const dropdownRef = ref(null);
const isOpen = ref(false);
const searchQuery = ref('');

// Computed
const selectedValue = computed(() => props.modelValue);

const displayText = computed(() => {
  if (!selectedValue.value) {
    return props.placeholder;
  }
  
  if (props.multiple && Array.isArray(selectedValue.value)) {
    if (selectedValue.value.length === 0) {
      return props.placeholder;
    }
    if (selectedValue.value.length === 1) {
      const option = props.options.find(opt => getOptionValue(opt) === selectedValue.value[0]);
      return option ? getOptionLabel(option) : selectedValue.value[0];
    }
    return `${selectedValue.value.length} selected`;
  }
  
  const option = props.options.find(opt => getOptionValue(opt) === selectedValue.value);
  return option ? getOptionLabel(option) : selectedValue.value;
});

const positionClass = computed(() => {
  const [vertical, horizontal] = props.position.split('-');
  return `dropdown-${vertical} dropdown-${horizontal}`;
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }
  
  return props.options.filter(option => {
    const label = getOptionLabel(option).toLowerCase();
    return label.includes(searchQuery.value.toLowerCase());
  });
});

// Methods
const getOptionValue = (option) => {
  return typeof option === 'object' ? option[props.valueKey] : option;
};

const getOptionLabel = (option) => {
  return typeof option === 'object' ? option[props.labelKey] : option;
};

const isSelected = (option) => {
  const value = getOptionValue(option);
  if (props.multiple && Array.isArray(selectedValue.value)) {
    return selectedValue.value.includes(value);
  }
  return selectedValue.value === value;
};

const isOptionDisabled = (option) => {
  return typeof option === 'object' && option.disabled;
};

const toggleDropdown = () => {
  if (props.disabled) return;
  
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const openDropdown = () => {
  isOpen.value = true;
  emit('open');
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = '';
  emit('close');
};

const selectOption = (option) => {
  const value = getOptionValue(option);
  
  if (isOptionDisabled(option)) return;
  
  let newValue;
  
  if (props.multiple) {
    const currentValue = Array.isArray(selectedValue.value) ? [...selectedValue.value] : [];
    const index = currentValue.indexOf(value);
    
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(value);
    }
    
    newValue = currentValue;
  } else {
    newValue = value;
  }
  
  emit('update:modelValue', newValue);
  emit('change', newValue, option);
  
  if (props.closeOnSelect && !props.multiple) {
    closeDropdown();
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  // Handle external value changes if needed
});
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dropdown-trigger:hover {
  border-color: #9ca3af;
}

.dropdown-trigger:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.dropdown-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dropdown-trigger.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.dropdown-arrow {
  color: #9ca3af;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.dropdown-arrow.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  z-index: 50;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 240px;
  overflow-y: auto;
  min-width: 100%;
}

.dropdown-bottom {
  top: 100%;
}

.dropdown-top {
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 4px;
}

.dropdown-left {
  left: 0;
}

.dropdown-right {
  right: 0;
}

.dropdown-item {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}

.dropdown-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dropdown-item.disabled:hover {
  background-color: transparent;
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
