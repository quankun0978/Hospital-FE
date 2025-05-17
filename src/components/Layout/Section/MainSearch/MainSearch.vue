<template>
  <section id="main-search" class="relative overflow-hidden bg-primary">
    <div class="relative z-20 max-w-7xl mx-auto px-4 py-16 lg:px-6 md:min-h-[520px] flex flex-col justify-center">
      <div class="max-w-4xl w-full mx-auto">
        <div class="flex flex-col justify-center items-center text-center">
          <h1 class="text-white text-xl md:text-4xl">{{ t('components.section.mainSearch.title') }}</h1>
          <p class="text-white text-sm md:text-lg mt-2 mb-0">
            {{ t('components.section.mainSearch.description') }}
          </p>
        </div>
        <div class="wrapper-search flex flex-col gap-3 pt-6">
          <form method="GET" action="#" @submit.prevent="handleSearch">
            <InputSearch
              v-model="searchQuery"
              name="q"
              :placeholder="t('components.section.mainSearch.placeholder')"
              :icon="searchIcon"
              iconPosition="right"
              borderType="transparent"
              :showClearButton="true"
              @icon-click="handleSearch"
            />
            <!-- <input type="hidden" name="type" value="all" /> -->
          </form>
        </div>
      </div>
    </div>
    <div class="absolute z-0 bottom-0 right-0">
      <img width="676" height="520" src="https://cdn.youmed.vn/wp-content/themes/youmed/images/your-medical-booking.webp"
        alt="YouMed" class="opacity-40 lg:opacity-100 block">
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from '@/i18n/useI18n';
import searchIcon from '@/assets/images/search.svg';
import InputSearch from '@/components/common/Input/InputSearch.vue';

const { t } = useI18n();
const searchQuery = ref('');

// Khai báo emit events
const emit = defineEmits(['search']);

// Phương thức xử lý tìm kiếm
const handleSearch = () => {
  console.log('Tìm kiếm:', searchQuery.value);
  emit('search', searchQuery.value);
};
</script>

<style scoped>
/* Các style đặc biệt cho section tìm kiếm có thể được thêm vào đây */
</style>
