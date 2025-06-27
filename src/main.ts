import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import authPlugin from "./plugins/auth";
import 'ant-design-vue/dist/reset.css'; // Import pinia instance
import "@/assets/css/tailwind.css";
import "@/assets/css/ant.css";
import constants from "./plugins/constants";
import "@/assets/css/styles.css";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "vue3-toastify/dist/index.css";
import Antd from 'ant-design-vue';
const app = createApp(App);

// Cấu hình toast toàn cục
app.use(Vue3Toastify, {
  autoClose: 3000,
  clearOnUrlChange: true,
  position: "top-right",
  timeout: 5000,
  pauseOnHover: true,
  closeOnClick: true,
  theme: "colored",
});

app.use(pinia); // Sử dụng Pinia trước auth plugin
app.use(authPlugin); // Auth middleware plugin
app.use(constants);
app.use(router);
app.use(Antd)
app.mount("#app");
