<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[1000] overflow-y-auto"
      @click="handleMaskClick"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-[#00000073]  transition-opacity backdrop-blur-sm"></div>
      
      <!-- Modal container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all animate-fade-in"
          :class="sizeClasses"
          @click.stop
        >
          <!-- Header -->
          <div v-if="showHeader" class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              <slot name="title">{{ title }}</slot>
            </h3>
            <button
              v-if="closable"
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div v-if="showFooter" class="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer">
              <AppButton
                v-if="showCancelButton"
                variant="outline" 
                @click="handleCancel"
                :disabled="loading"
              >
                {{ cancelText }}
              </AppButton>
              <AppButton
                v-if="showOkButton"
                variant="primary"
                @click="handleOk"
                :disabled="loading"
              >
                <div v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loadingText }}
                </div>
                <span v-else>{{ okText }}</span>
              </AppButton>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, watch } from 'vue'
import AppButton from '../Button/Button.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 'md'
  },
  closable: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showOkButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: 'Xác nhận'
  },
  cancelText: {
    type: String,
    default: 'Hủy'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Đang xử lý...'
  }
})

const emit = defineEmits(['update:visible', 'ok', 'cancel', 'close'])

const sizeClasses = computed(() => {
  switch (props.width) {
    case 'sm':
      return 'w-full max-w-md'
    case 'md':
      return 'w-full max-w-lg'
    case 'lg':
      return 'w-full max-w-2xl'
    case 'xl':
      return 'w-full max-w-4xl'
    default:
      if (typeof props.width === 'number') {
        return `w-[${props.width}px]`
      }
      return props.width
  }
})

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

// Prevent body scroll when modal is open
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style> 
