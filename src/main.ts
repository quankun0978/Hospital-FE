import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import pinia from './store'  // Import pinia instance
import '@/assets/css/tailwind.css'
import '@/assets/css/styles.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

// Cấu hình toast toàn cục
app.use(Vue3Toastify, {
  autoClose: 3000,
  clearOnUrlChange: true,
  position: "top-right",
  timeout: 5000,
  pauseOnHover: true,
  closeOnClick: true,
  theme: "colored"
})

app.use(pinia)  // Sử dụng Pinia
app.use(router)
app.use(i18n)
app.mount('#app')