import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Global toast functions
export const showToast = {
  success: (message: string) => {
    toast(message, {
      type: 'success',
      position: 'top-right',
      theme: 'colored',
      autoClose: 30000
    })
  },
  error: (message: string) => {
    toast(message, {
      type: 'error',
      position: 'top-right',
      theme: 'colored',
      autoClose: 30000
    })
  },
  info: (message: string) => {
    toast(message, {
      type: 'info',
      position: 'top-right',
      theme: 'colored',
      autoClose: 30000
    })
  },
  warning: (message: string) => {
    toast(message, {
      type: 'warning',
      position: 'top-right',
      theme: 'colored',
      autoClose: 30000
    })
  }
}

// Legacy support
export const useToast = () => {
  return showToast
}

// Vue plugin
const plugin = {
  install: (app: any) => {
    app.config.globalProperties.$toast = showToast
  }
}

export default plugin 