<template>
  <article 
    class="group select-none relative snap-center shrink-0 last:mr-6 w-[280px] flex flex-col rounded-xl border overflow-hidden hover:shadow-md bg-white"
  >
    <router-link :to="post.link" class="relative block overflow-hidden border-b" :title="post.title">
      <div class="transition-transform hover:scale-105 overflow-hidden h-36 bg-slate-50">
        <img v-if="post.image" :src="post.image" :alt="post.title" width="300" height="157" />
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