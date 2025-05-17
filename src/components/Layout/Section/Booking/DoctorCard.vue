<template>
  <div class="select-none snap-start group flex flex-col shrink-0 last:mr-4 md:last:mr-6 w-[280px] max-w-[80%] border border-slate-200 rounded-xl overflow-hidden hover:shadow-md">
    <div class="p-4 gap-4 flex flex-col flex-1 items-stretch">
      <a :href="link" :title="`${t('components.section.booking.doctor.bookAppointment')} ${name}`" class="w-24 h-24 rounded-full overflow-hidden border border-slate-200 mx-auto">
        <img 
          width="96" 
          height="96" 
          :src="image" 
          :alt="name"
          class="w-24 h-24 object-cover" 
        />
      </a>
      <div class="text-center flex flex-col items-center text-gray-800">
        <a :href="link" :title="`${t('components.section.booking.doctor.bookAppointment')} ${name}`">
          <h3 class="text-base font-semibold group-hover:underline underline-offset-2 group-hover:text-primary">
            {{ title }} {{ name }}
          </h3>
        </a>
        <ul class="flex items-center my-1 overflow-hidden">
          <li v-for="(specialty, index) in specialties" :key="index" class="text-sm font-medium text-gray-600 relative specialties line-clamp-1">
            <h4>{{ specialty }}</h4>
          </li>
        </ul>
        <h4 v-if="hospital" class="text-sm line-clamp-1">{{ hospital }}</h4>
      </div>
    </div>
    <a :href="link" :title="`${t('components.section.booking.doctor.bookAppointment')} ${name}`" class="px-4 py-2 flex items-center border-t justify-between group-hover:text-primary">
      <span class="font-semibold whitespace-nowrap text-sm">{{ t('components.section.booking.doctor.bookAppointment') }}</span>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="ml-2">
        <g fill-rule="evenodd">
          <path stroke-width="2" stroke="currentColor" fill="none" d="M0 5h8"
            class="opacity-0 group-hover:opacity-100 transition-opacity"></path>
          <path stroke-width="2" stroke="currentColor" fill="none" d="M1 1l4 4-4 4"
            class="group-hover:translate-x-1 transition-transform"></path>
        </g>
      </svg>
    </a>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n/useI18n';

const { t } = useI18n();

// Props
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'BS.'
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '#'
  },
  specialties: {
    type: Array,
    default: () => []
  },
  hospital: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Có thể thêm các styles đặc biệt cho doctor card nếu cần */
</style> 