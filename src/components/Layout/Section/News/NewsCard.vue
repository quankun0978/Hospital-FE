<template>
  <article 
    class="group select-none relative snap-center shrink-0 last:mr-6 w-[280px] flex flex-col rounded-xl border overflow-hidden hover:shadow-md bg-white"
  >
    <router-link :to="post.link" class="relative block overflow-hidden border-b" :title="post.title">
      <div class="transition-transform hover:scale-105 overflow-hidden h-36 bg-slate-50">
        <img 
          v-if="post.imageUrl || post.image" 
          :src="getImageUrl(post.imageUrl || post.image)" 
          :alt="post.title" 
          width="300" 
          height="157"
          @error="onImageError"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
    </router-link>
    <div class="p-4">
      <router-link :to="post.link" :title="post.title" class="hover:text-primary relative">
        <h4 class="font-serif font-bold text-sm line-clamp-2">{{ post.title }}</h4>
      </router-link>
      <p v-if="post.description" class="text-xs text-gray-600 mt-2 line-clamp-2">{{ post.description }}</p>
      <div class="text-xs opacity-80 mt-4">
        <span class="font-medium" v-if="post.reviewer">{{ post.reviewer }}</span>
        <span class="mx-1" v-if="post.reviewer">·</span>
        <span v-if="post.date"><time :datetime="post.date">Cập nhật: {{ formatDate(post.date) }}</time></span>
      </div>
    </div>
  </article>
</template>

<script>
import { getImage } from '@/common/function'

export default {
  name: 'NewsCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    getImageUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return getImage(url);
    },
    onImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x157?text=No+Image';
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 