<template>
  <div class="px-4 md:px-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center mt-10 py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
      <span class="ml-2 text-gray-600">Đang tải chuyên khoa...</span>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="mt-10 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-red-600 text-center">{{ error }}</p>
      <button
        @click="fetchSpecialties"
        class="mt-2 mx-auto block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Thử lại
      </button>
    </div>

    <!-- Content -->
    <details
      v-else
      class="group flex flex-row flex-wrap mt-10 [&_summary::-webkit-details-marker]:hidden"
      open
    >
      <summary class="grid grid-cols-3 lg:grid-cols-6">
        <SpecialtyCard
          v-for="item in showAll ? specialties : specialties.slice(0, 12)"
          :key="item.id || item.name"
          :name="item.name"
          :image="item.image"
          :link="item.link"
        />
        <div
          v-if="!showAll && specialties.length > 10"
          class="col-span-3 lg:col-span-6 flex flex-1 justify-center pt-4"
        >
          <button
            @click.stop.prevent="showAll = true"
            class="bg-white cursor-pointer rounded-full px-3 py-1.5 shadow flex items-center group hover:bg-primary hover:text-white transition-all"
          >
            <span class="text-sm font-medium mr-2">Xem thêm</span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <g fill-rule="evenodd">
                <path
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  d="M1 1l4 4-4 4"
                ></path>
              </g>
            </svg>
          </button>
        </div>
        <div
          v-else-if="showAll && specialties.length > 10"
          class="col-span-3 lg:col-span-6 flex flex-1 justify-center pt-4"
        >
          <button
            @click.stop.prevent="showAll = false"
            class="bg-white cursor-pointer rounded-full px-3 py-1.5 shadow flex items-center group hover:bg-primary hover:text-white transition-all"
          >
            <span class="text-sm font-medium mr-2">Ẩn bớt</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              style="transform: rotate(270deg)"
            >
              <g fill-rule="evenodd">
                <path
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  d="M1 1l4 4-4 4"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </summary>
    </details>
  </div>
</template>

<script>
import SpecialtyCard from "./SpecialtyCard.vue";
import specialityApi from "../../../../api/specialityApi";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default {
  name: "SpecialtyContainer",
  components: { SpecialtyCard },
  data() {
    return {
      showAll: false,
      specialties: [],
      loading: false,
      error: null,
    };
  },
  async mounted() {
    await this.fetchSpecialties();
  },
  methods: {
    async fetchSpecialties() {
      this.loading = true;
      this.error = null;

      try {
        const response = await specialityApi.getSpecialties({
          pageNumber: 1,
          pageSize: 100, // Lấy nhiều để hiển thị đầy đủ
        });

        if (
          response &&
          response.succeeded &&
          response.data &&
          response.data.length > 0
        ) {
          this.specialties = response.data.map((specialty) => ({
            id: specialty.specialtyId,
            name: specialty.name,
            image: apiUrl + specialty.imageUrl,
            link: specialty.link || `/chuyen-khoa/${specialty.slug}`, // Tạo link từ slug
            description: specialty.description,
          }));
        } else {
          throw new Error("Không thể lấy dữ liệu chuyên khoa");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
        this.error =
          "Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
