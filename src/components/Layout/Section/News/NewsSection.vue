<template>
  <section id="news" class="bg-primary/10">
    <div class="max-w-7xl mx-auto py-4 md:py-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center px-4">
        <div
          class="inline-flex font-semibold rounded-full border border-slate-200 bg-slate-100 p-1 overflow-x-auto hide-scroll-bar">
          <h3 
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="selectTab(index)"
            :class="{'tab-active': selectedTab === index}"
            class="inline-block rounded-full px-4 py-2 text-sm focus:relativ text-gray-700 hover:text-primary cursor-pointer whitespace-nowrap"
          >
            {{ tab.label }}
          </h3>
        </div>
        <form class="relative flex-1">
          <InputSearch
            v-model="searchText" 
            :placeholder="currentTab.placeholder"
            :icon="searchIcon"
            iconPosition="left"
            borderType="slate"
            additionalClasses="md:py-2"
            @icon-click="handleSearch"
          />
        </form>
      </div>
      <div class="relative post-items flex flex-row gap-4 overflow-x-auto p-4 custom-scroll-bar">
        <!-- Skeleton loaders khi đang tải -->
        <template v-if="loading">
          <div 
            v-for="index in 4" 
            :key="'skeleton-'+index"
            class="group relative snap-center shrink-0 last:mr-6 w-[280px] flex flex-col rounded-xl border overflow-hidden animate-pulse bg-white"
          >
            <div class="relative block overflow-hidden border-b">
              <div class="w-full h-36 bg-slate-50"></div>
            </div>
            <div class="flex flex-1 flex-col justify-between p-4">
              <div class="bg-slate-100 h-5 rounded-full w-full"></div>
              <div class="bg-slate-100 h-5 mt-1 rounded-full w-2/3"></div>
              <div class="flex flex-1 gap-4 items-end mt-6">
                <div class="bg-slate-100 h-4 rounded-full w-1/2"></div>
                <div class="bg-slate-100 h-4 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Bài viết tin tức -->
        <template v-else>
          <NewsCard
            v-for="(post, index) in posts"
            :key="'post-'+index"
            :post="post"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import NewsCard from './NewsCard.vue';
import searchIcon from '@/assets/images/search.svg';
import InputSearch from '@/components/common/Input/InputSearch.vue';

export default {
  name: 'NewsSection',
  components: {
    NewsCard,
    InputSearch
  },
  setup() {
    return {
      searchIcon
    }
  },
  data() {
    return {
      loading: false,
      selectedTab: 0,
      searchText: '',
      tabs: [
        { 
          label: 'Thuốc', 
          placeholder: 'Nhập tên thuốc cần tìm...',
          type: 'duoc' 
        },
        { 
          label: 'Dược liệu', 
          placeholder: 'Nhập tên dược liệu cần tìm...',
          type: 'duoc-lieu' 
        },
        { 
          label: 'Bệnh', 
          placeholder: 'Nhập tên bệnh, triệu chứng cần tìm...',
          type: 'trieu-chung-benh' 
        },
        { 
          label: 'Cơ thể', 
          placeholder: 'Nhập tên bộ phận cơ thể...',
          type: 'hieu-ve-co-the-ban' 
        }
      ],
      posts: [
        {
          id: 1,
          title: 'Những điều cần biết về bệnh tiểu đường type 2',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dalieu.png?width=300',
          reviewer: 'BS. Nguyễn Văn A',
          date: '2023-06-15'
        },
        {
          id: 2,
          title: 'Phương pháp điều trị cao huyết áp hiệu quả',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/timmach.png?width=300',
          reviewer: 'TS. Trần Thị B',
          date: '2023-06-10'
        },
        {
          id: 3,
          title: 'Cách phòng ngừa các bệnh về đường hô hấp',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Hohap.png?width=300',
          reviewer: 'ThS. Lê Văn C',
          date: '2023-06-05'
        },
        {
          id: 4,
          title: 'Chế độ dinh dưỡng cho người mắc bệnh gout',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dinhduong.png?width=300',
          reviewer: 'PGS.TS. Phạm Thị D',
          date: '2023-06-01'
        },
        {
          id: 5,
          title: 'Chế độ dinh dưỡng cho người mắc bệnh gout',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dinhduong.png?width=300',
          reviewer: 'PGS.TS. Phạm Thị D',
          date: '2023-06-01'
        },
        {
          id: 6,
          title: 'Chế độ dinh dưỡng cho người mắc bệnh gout',
          link: '#',
          image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dinhduong.png?width=300',
          reviewer: 'PGS.TS. Phạm Thị D',
          date: '2023-06-01'
        }
      ]
    };
  },
  computed: {
    currentTab() {
      return this.tabs[this.selectedTab];
    }
  },
  methods: {
    selectTab(index) {
      if (this.selectedTab !== index) {
        this.selectedTab = index;
        this.fetchData();
      }
    },
    fetchData() {
      // Mô phỏng việc fetch dữ liệu
      this.loading = true;
      
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    handleSearch() {
      console.log('Tìm kiếm:', this.searchText, 'Loại:', this.currentTab.type);
      // Xử lý tìm kiếm ở đây
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style> 