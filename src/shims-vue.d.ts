declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-toastification' {
  import { Plugin } from 'vue'
  const plugin: Plugin
  export default plugin
}

declare module '@/plugins/toast' {
  import { Plugin } from 'vue'
  
  export interface ToastFunctions {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
  }
  
  export const showToast: ToastFunctions
  export const useToast: () => ToastFunctions
  
  const plugin: Plugin
  export default plugin
}

// Mở rộng Vue instance với $toast
declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: {
      success: (message: string) => void
      error: (message: string) => void
      info: (message: string) => void
      warning: (message: string) => void
    }
  }
} 