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
          
          <!-- Hiển thị khi không có bài viết -->
          <div v-if="posts.length === 0" class="w-full text-center py-8 text-gray-500">
            <div class="flex flex-col items-center">
              <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p class="text-gray-500">{{ currentTab.label }} hiện tại chưa có bài viết nào để hiển thị.</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import NewsCard from './NewsCard.vue';
import searchIcon from '@/assets/images/search.svg';
import InputSearch from '@/components/common/Input/InputSearch.vue';
import articleApi from '@/api/articleApi';
import Message from '@/plugins/message';

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
          label: 'Tất cả', 
          placeholder: 'Nhập từ khóa tìm kiếm...',
          type: 'all',
          category: null
        },
        { 
          label: 'Sức khỏe', 
          placeholder: 'Tìm kiếm bài viết về sức khỏe...',
          type: 'health',
          category: 'suc-khoe'
        },
        { 
          label: 'Kiến thức y khoa', 
          placeholder: 'Tìm kiếm bài viết về y khoa...',
          type: 'medical',
          category: 'kien-thuc-y-khoa'
        },
        { 
          label: 'Dịch vụ', 
          placeholder: 'Tìm kiếm bài viết về dịch vụ...',
          type: 'service',
          category: 'dich-vu'
        }
      ],
      posts: []
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
    async fetchData() {
      try {
        this.loading = true;
        
        const currentTab = this.tabs[this.selectedTab];
        let response;
        
        if (currentTab.category) {
          // Gọi API theo category
          response = await articleApi.getArticlesByCategory(currentTab.category, {
            pageNumber: 1,
            pageSize: 6,
            sortBy: 'publishedat',
            sortOrder: 'desc'
          });
        } else {
          // Gọi API lấy bài viết nổi bật cho tab "Tất cả"
          response = await articleApi.getFeaturedArticles(6);
        }
        
        if (response.succeeded && response.data) {
          // Chuyển đổi dữ liệu từ API sang format của component
          const articles = Array.isArray(response.data) ? response.data : [];
          this.posts = articles.map(article => ({
            id: article.articleId,
            title: article.title,
            slug: article.slug,
            link: `/articles/${article.slug}`,
            image:article.imageUrl , // Placeholder image
            reviewer: article.authorName || 'Admin',
            date: article.publishedAt,
            description: article.description
          }));
        } else {
          console.error('Lỗi khi lấy dữ liệu bài viết:', response.message);
          this.posts = [];
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        this.posts = [];
      } finally {
        this.loading = false;
      }
    },
    async handleSearch() {
      if (!this.searchText.trim()) {
        this.fetchData();
        return;
      }

      try {
        this.loading = true;
        
        const currentTab = this.tabs[this.selectedTab];
        let response;
        
        if (currentTab.category) {
          // Tìm kiếm trong category cụ thể
          response = await articleApi.getArticlesByCategory(currentTab.category, {
            pageNumber: 1,
            pageSize: 6,
            searchTerm: this.searchText,
            sortBy: 'publishedat',
            sortOrder: 'desc'
          });
        } else {
          // Tìm kiếm tất cả bài viết
          response = await articleApi.getArticles({
            pageNumber: 1,
            pageSize: 6,
            searchTerm: this.searchText,
            sortBy: 'publishedat',
            sortOrder: 'desc'
          });
        }
        
        if (response.succeeded && response.data) {
          const articles = response.data.data || response.data || [];
          this.posts = articles.map(article => ({
            id: article.articleId,
            title: article.title,
            slug: article.slug,
            link: `/articles/${article.slug}`,
            image: 'https://cdn.youmed.vn/tin-tuc/wp-content/uploads/2023/05/Dalieu.png?width=300',
            reviewer: article.authorName || 'Admin',
            date: article.publishedAt,
            description: article.description
          }));
          
          if (this.posts.length === 0) {
            Message.info('Không tìm thấy bài viết nào phù hợp');
          }
        } else {
          this.posts = [];
          Message.info('Không tìm thấy bài viết nào phù hợp');
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        Message.error('Có lỗi xảy ra khi tìm kiếm');
        this.posts = [];
      } finally {
        this.loading = false;
      }
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