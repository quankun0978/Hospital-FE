<template>
  <button
    :class="[
      'transition-colors btn focus:outline-none shadow',
      variantClasses,
      fullWidthClass,
      disabledClasses,
      additionalClasses,
      roundedClasses
    ]"
    :type="type"
    :disabled="disabled"
    @click="()=>handleClick()"
  >
    <!-- Icon trước nếu có -->
    <span v-if="iconLeft" class="inline-block mr-2">
      <img
        v-if="typeof iconLeft === 'string'"
        :src="iconLeft"
        width="20"
        height="20"
        alt=""
      />
      <slot v-else name="icon-left"></slot>
    </span>

    <!-- Nội dung chính -->
    <span><slot /></span>

    <!-- Icon sau nếu có -->
    <span v-if="iconRight" class="inline-block ml-2">
      <img
        v-if="typeof iconRight === 'string'"
        :src="iconRight"
        width="20"
        height="20"
        alt=""
      />
      <slot v-else name="icon-right"></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "outline", "text", "disable", "danger", "success"].includes(
          value
        ),
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    rounded: {
      type: String,
      default: "md",
      validator: (value) => ["none", "sm", "md", "lg", "full"].includes(value),
    },
    type: {
      type: String,
      default: "button",
      validator: (value) => ["button", "submit", "reset"].includes(value),
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: [String, Boolean],
      default: false,
    },
    iconRight: {
      type: [String, Boolean],
      default: false,
    },
    additionalClasses: {
      type: String,
      default: "",
    },
  },
  computed: {
    variantClasses() {
      switch (this.variant) {
        case "primary":
          return "btn-primary";
        case "outline":
          return "btn-outline";
        case "text":
          return "bg-transparent text-gray-700 hover:bg-gray-100";
        case "disable":
          return "btn-primary bg-gray-300 hover:bg-gray-300 hover:cursor-not-allowed";
        case "danger":
          return "bg-red-500 text-white hover:bg-red-600";
        case "success":
          return "bg-green-500 text-white hover:bg-green-600";
        default:
          return "bg-primary text-white hover:bg-blue-600";
      }
    },
    sizeClasses() {
      switch (this.size) {
        case "sm":
          return "py-1.5 px-3 text-sm";
        case "md":
          return "py-2 px-4 text-sm";
        case "lg":
          return "py-3 px-6 text-lg";
        default:
          return "py-2 px-4 text-base";
      }
    },
    roundedClasses() {
      switch (this.rounded) {
        case "none":
          return "rounded-none";
        case "sm":
          return "rounded";
        case "md":
          return "rounded-md";
        case "lg":
          return "rounded-lg";
        case "full":
          return "rounded-full";
        default:
          return "rounded-md";
      }
    },
    fullWidthClass() {
      return this.fullWidth ? "w-full" : "";
    },
    disabledClasses() {
      return this.disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
    },
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style scoped></style>
