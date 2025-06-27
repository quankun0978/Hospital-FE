<template>
  <section :id="id" class="bg-white">
    <div class="max-w-7xl mx-auto relative" :class="{ 'pt-10': !isFirst }">
      <div class="flex justify-between items-center px-4 gap-4">
        <div class="flex items-center gap-2">
          <div>
            <h2 class="text-lg md:text-xl font-bold mb-0">{{ title }}</h2>
            <p class="hidden md:block text-sm">{{ description }}</p>
          </div>
        </div>
        <AppButton
          v-if="!useDetailsView"
          :rounded="'full'"
          variant="primary"
          size="sm"
          :iconRight="true"
          additionalClasses="group hover:bg-blue-900 py-1.5 px-3 text-sm"
          @click="goToViewMore"
        >
          <span class="font-semibold whitespace-nowrap">Xem thêm</span>
          <template #icon-right>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="">
              <g fill-rule="evenodd">
                <path stroke-width="2" stroke="currentColor" fill="none" d="M0 5h8" class="opacity-0 group-hover:opacity-100 transition-opacity"></path>
                <path stroke-width="2" stroke="currentColor" fill="none" d="M1 1l4 4-4 4" class="group-hover:translate-x-1 transition-transform"></path>
              </g>
            </svg>
          </template>
        </AppButton>
      </div>

      <!-- Navigation buttons for desktop -->
      <div v-if="!useDetailsView && showNavButtons" class="hidden nav-buttons md:block">
        <button 
          ref="prevButton"
          aria-label="prev" 
          class="prev w-9 h-9 flex items-center justify-center z-20 absolute left-0 inset-y-1/2 bg-white rounded-full shadow-th disabled:hidden hover:bg-primary hover:text-white"
          title="Trang trước"
          @click="scrollPrev"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14"><path d="M6.94 1.082 8.363 2.603l-4.318 4.619 4.318 4.619-1.423 1.522-5.741-6.141z" fill="currentColor"></path></svg>
        </button>
        <button 
          ref="nextButton"
          aria-label="next" 
          class="next w-9 h-9 flex items-center justify-center z-20 absolute right-0 inset-y-1/2 bg-white rounded-full shadow-th disabled:hidden hover:bg-primary hover:text-white"
          title="Trang sau"
          @click="scrollNext"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14"><path d="M4.06 1.082 2.637 2.603l4.318 4.619-4.318 4.619 1.423 1.522 5.741-6.141z" fill="currentColor"></path></svg>
        </button>
      </div>

      <!-- Items container -->
      <div 
        v-if="!useDetailsView" 
        ref="scrollContainer"
        :class="itemsContainerClass" 
        class="relative flex pt-8 pb-4 mx-4 gap-4 overflow-x-auto custom-scroll-bar"
      >
        <slot></slot>
      </div>

      <!-- Details view for specialty cards -->
      <div v-if="useDetailsView" class="px-4 md:px-6">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import bookingIcon from '@/assets/images/booking.svg';
import AppButton from '@/components/common/Button/Button.vue';

// Template refs
const scrollContainer = ref(null);
const prevButton = ref(null);
const nextButton = ref(null);

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  viewMoreLink: {
    type: String,
    default: '#'
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  showNavButtons: {
    type: Boolean,
    default: true
  },
  itemsContainerClass: {
    type: String,
    default: ''
  },
  useDetailsView: {
    type: Boolean,
    default: false
  }
});

// Methods
const goToViewMore = () => {
  // Chuyển đến link xem thêm
  window.location.href = props.viewMoreLink;
};

const scrollPrev = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' });
  }
};

const scrollNext = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' });
  }
};

// Lifecycle hooks
onMounted(() => {
  // Không cần gọi initializeNavButtons vì đã sử dụng refs và event handlers trực tiếp
});

onBeforeUnmount(() => {
  // Không cần dọn dẹp event listeners vì đã sử dụng Vue event binding (@click)
});
</script>

<style scoped>
/* Có thể thêm các styles đặc biệt cho component này */
</style>
