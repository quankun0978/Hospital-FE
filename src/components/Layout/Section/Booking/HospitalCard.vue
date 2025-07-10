<template>
  <a :href="link" class="select-none snap-start group relative shrink-0 sm:last:mr-6 w-[280px] flex flex-col rounded-xl border-overflow overflow-hidden hover:shadow-md">
    <div class="h-32 relative overflow-hidden bg-gray-100">
      <img 
        width="300" 
        height="157" 
        :src="bannerImage" 
        :alt="`${name} Banner`" 
        class="absolute w-full object-center"
      >
    </div>
    <div class="relative ml-4 -mt-14 w-28 h-28 aspect-square overflow-hidden  bg-white rounded-lg ">
      <img 
        width="96" 
        height="96" 
        :src="logoImage" 
        :alt="name" 
        class="absolute w-full h-full object-cover"
      />
    </div>
    <div class="flex flex-1 flex-col text-gray-800 p-4">
      <h3 class="text-base font-semibold group-hover:underline group-hover:underline-offset-2 group-hover:text-primary">
        {{ name }}
      </h3>
      <h4 class="line-clamp-2 text-sm">{{ address }}</h4>
      <ul class="pt-3">
        <li v-if="weekdayHours" class="text-sm">
          <h4>
            <span class=" w-24 mr-2">{{ weekday }}:</span>
            {{ weekdayHours }}
          </h4>
        </li>
        <li v-if="weekendHours" class="text-sm">
          <h4>
            <span class=" w-24 mr-2">{{ weekend }}:</span>
            {{ weekendHours }}
          </h4>
        </li>
      </ul>
    </div>
  </a>
</template>

<script>
export default {
  name: 'HospitalCard',
  props: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: ''
    },
    bannerImage: {
      type: String,
      required: true
    },
    logoImage: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    },
    weekdayHours: {
      type: String,
      default: '7h30 - 16h30'
    },
    weekendHours: {
      type: String,
      default: '7h30 - 11h30'
    },
    weekday: {
      type: String,
      default: 'Thứ 2 - Thứ 6'
    },
    weekend: {
      type: String,
      default: 'Thứ 7 - Chủ nhật'
    }
  },
  setup() {
    return {};
  }
}
</script>

<style scoped>
/* Có thể thêm các styles đặc biệt cho hospital card nếu cần */
</style> 
