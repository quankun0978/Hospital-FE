<template>
  <section id="expert-board" class="bg-white">
    <div class="max-w-7xl mx-auto px-4 py-3 md:py-4">
      <h3 class="text-xl font-bold mb-4">Đội ngũ chuyên gia</h3>
      <div class="bg-white p-4 lg:p-6 border-2 border-primary rounded-xl flex flex-col md:flex-row-reverse gap-6">
        <div class="md:basis-1/3 flex flex-col justify-center items-center">
          <div class="lg:max-w-sm">
            <p class="font-bold text-gray-700 font-serif md:text-lg mb-6">
              Đội ngũ bác sĩ giỏi chuyên môn, tận tâm với nghề
            </p>
            <button 
              class="bg-primary inline-flex text-white items-center rounded-full px-5 py-2 group cursor-pointer hover:bg-blue-900">
              <p class="font-medium mr-1">Xem đội ngũ</p>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" class="ml-2">
                <g fill-rule="evenodd">
                  <path stroke-width="2" stroke="currentColor" fill="none" d="M0 5h8"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"></path>
                  <path stroke-width="2" stroke="currentColor" fill="none" d="M1 1l4 4-4 4"
                    class="group-hover:translate-x-1 transition-transform"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div class="md:basis-2/3 gap-6 grid grid-cols-1 md:grid-cols-2">
          <a v-for="doctor in doctors" :key="doctor.id" :href="doctor.link" class="col-span-1 group flex items-center gap-4">
            <div class="relative rounded-full overflow-hidden w-24 h-24 bg-slate-200">
              <img width="96" height="96" :src="doctor.image" :alt="doctor.name">
            </div>
            <div class="flex-1">
              <h4 class="font-medium group-hover:text-primary">{{ doctor.name }}</h4>
              <p class="text-sm">{{ doctor.specialty }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
const doctors = ref([
  {
    id: 1,
    name: 'ThS.BS Nguyễn Hồng Vân Khánh',
    specialty: 'Gan mật tụy - Ghép gan, Nhi',
    image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2022/06/thac-si-bac-si-nguyen-hong-van-khanh.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  },
  {
    id: 2,
    name: 'ThS.BS Đinh Thị Lan Phương',
    specialty: 'Tai - Mũi - Họng',
    image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2021/10/ThS.BS-Dinh-Thi-Lan-Phuong-e1634182944376-1.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  },
  {
    id: 3,
    name: 'ThS.BS Vũ Thành Đô',
    specialty: 'Tim - Thận - Khớp - Nội tiết',
    image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2019/11/bac-si-vu-thanh-do.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  },
  {
    id: 4,
    name: 'ThS.BS Phan Lê Nam',
    specialty: 'Sản phụ khoa',
    image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2021/12/267636163_171685651818403_5100084637370954109_n.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  },
  {
    id: 5,
    name: 'Dược sĩ Dương Anh Hoàng',
    specialty: 'Dược',
    image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2021/02/duong-anh-hoang-300x300.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  },
  {
    id: 6,
    name: 'ThS.BS Nguyễn Trung Nghĩa',
    specialty: 'Tâm thần',
    image: 'https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2019/09/bac-si-nguyen-trung-nghia.jpg?width=140&aspect_ratio=1:1',
    link: '#'
  }
]);
</script>

<style scoped>
/* Styles riêng cho ProfessionalSection nếu cần */
</style>

