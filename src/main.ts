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
import Antd from 'ant-design-vue';
const app = createApp(App);



app.use(pinia); // Sử dụng Pinia trước auth plugin
app.use(authPlugin); // Auth middleware plugin
app.use(constants);
app.use(router);
app.use(Antd)
app.mount("#app");
