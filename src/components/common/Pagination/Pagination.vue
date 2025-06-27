<template>
  <div class="flex justify-center flex-wrap gap-1 text-xs font-medium p-4">
    <!-- Nút Previous -->
    <button
      v-if="currentPage > 1"
      @click="goToPage(currentPage - 1)"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-50"
      :aria-label="t('pagination.prevPage')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-3 w-3"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Các trang -->
    <template v-for="page in visiblePages" :key="page">
      <!-- Trang thường -->
      <button
        v-if="typeof page === 'number'"
        @click="goToPage(page)"
        :class="[
          'block border h-8 leading-8 rounded text-center w-8',
          page === currentPage
            ? 'bg-blue-600 border-blue-600 text-white hover:text-white'
            : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>
      
      <!-- Dấu ... -->
      <span
        v-else
        class="block h-8 w-8 pt-1 text-center leading-8 text-gray-900"
      >
        ...
      </span>
    </template>

    <!-- Nút Next -->
    <button
      v-if="currentPage < totalPages"
      @click="goToPage(currentPage + 1)"
      class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 hover:bg-gray-50"
      :aria-label="t('pagination.nextPage')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-3 w-3"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  totalResults: {
    type: Number,
    default: 0
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
});

// Emits
const emit = defineEmits(['page-change']);

// Computed
const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisiblePages } = props;
  const pages = [];
  
  if (totalPages <= maxVisiblePages) {
    // Hiển thị tất cả các trang
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Logic phức tạp hơn cho nhiều trang
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    if (currentPage <= halfVisible + 1) {
      // Gần đầu
      for (let i = 1; i <= maxVisiblePages - 2; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfVisible) {
      // Gần cuối
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Ở giữa
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - halfVisible + 1; i <= currentPage + halfVisible - 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
  }
  
  return pages;
});

// Methods
const goToPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
/* Component-specific styles */
</style>
