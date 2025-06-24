// src/plugins/constants.ts

export const constants = {
  ROUTE_PERMISSION: [
    "/appointment-step",
    "/patient-record",
  ]
};

export default {
  install(app: any) {
    app.config.globalProperties.$constants = constants;
  },
};

// Nếu muốn hỗ trợ TypeScript (IntelliSense), thêm type sau:
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $constants: typeof constants;
  }
}