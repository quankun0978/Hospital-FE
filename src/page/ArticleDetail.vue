<template>
  <div class="article-detail-page bg-slate-100">
    <div class="max-w-4xl mx-auto py-8">
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="loader"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>
      <template v-else-if="article">
        <!-- Breadcrumb -->
        <div class="flex text-sm mb-6 text-gray-500">
          <router-link to="/" class="hover:text-primary">
            Trang chủ
          </router-link>
          <span class="mx-2">/</span>
          <router-link to="/#news" class="hover:text-primary">
            Tin tức
          </router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-800">{{ article.title }}</span>
        </div>

        <main>
          <!-- Header bài viết -->
          <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {{ article.title }}
            </h1>

            <div class="flex items-center text-gray-500 text-sm mb-4">
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ article.authorName || "Admin" }}</span>
              </div>
              <span class="mx-3">•</span>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
                <time :datetime="article.publishedAt">
                  {{ formatDate(article.publishedAt) }}
                </time>
              </div>
              <span v-if="article.updatedAt" class="mx-3">•</span>
              <div v-if="article.updatedAt" class="flex items-center">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <time :datetime="article.updatedAt">
                  Cập nhật: {{ formatDate(article.updatedAt) }}
                </time>
              </div>
            </div>

            <!-- Mô tả ngắn -->
            <div
              v-if="article.description"
              class="text-gray-700 text-lg leading-relaxed mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-primary"
            >
              {{ article.description }}
            </div>

            <!-- Các nút chia sẻ -->
            <div class="flex items-center gap-3 py-4 border-t border-gray-200">
              <span class="text-sm font-medium text-gray-600">Chia sẻ:</span>
              <button
                @click="shareOnFacebook"
                class="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Facebook
              </button>
              <button
                @click="shareOnTwitter"
                class="flex items-center gap-2 px-3 py-1 bg-sky-500 text-white text-sm rounded hover:bg-sky-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
                Twitter
              </button>
              <button
                @click="copyLink"
                class="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Sao chép link
              </button>
            </div>
          </div>

          <!-- Nội dung bài viết -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div
              v-if="article.contentHtml"
              class="prose prose-lg max-w-none"
              v-html="article.contentHtml"
            ></div>
            <div
              v-else-if="article.content"
              class="prose prose-lg max-w-none whitespace-pre-wrap"
            >
              {{ article.content }}
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              Nội dung bài viết đang được cập nhật...
            </div>
          </div>
        </main>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import articleApi from "@/api/articleApi";
import Message from "@/plugins/message";

const route = useRoute();

// State
const article = ref(null);
const relatedArticles = ref([]);
const loading = ref(true);
const error = ref("");

// Hàm lấy chi tiết bài viết
const fetchArticleDetails = async () => {
  loading.value = true;
  error.value = "";

  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Không tìm thấy thông tin bài viết";
      loading.value = false;
      return;
    }

    // Gọi API lấy thông tin bài viết theo slug
    const response = await articleApi.getArticleBySlug(slug);

    if (response.succeeded && response.data) {
      article.value = response.data;

      // Lấy các bài viết liên quan
      await fetchRelatedArticles();
    } else {
      error.value = response.message || "Không thể tải thông tin bài viết";
    }
  } catch (err) {
    console.error("Lỗi khi lấy thông tin bài viết:", err);
    error.value = "Đã xảy ra lỗi khi tải thông tin bài viết";
  } finally {
    loading.value = false;
  }
};

// Hàm lấy bài viết liên quan
const fetchRelatedArticles = async () => {
  try {
    const response = await articleApi.getFeaturedArticles(4);

    if (response.succeeded && response.data) {
      // Lọc bỏ bài viết hiện tại
      relatedArticles.value = response.data
        .filter((item) => item.articleId !== article.value?.articleId)
        .slice(0, 3);
    }
  } catch (err) {
    console.error("Lỗi khi lấy bài viết liên quan:", err);
  }
};

// Hàm format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Hàm chia sẻ
const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(article.value?.title || "");
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
    "_blank"
  );
};

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(article.value?.title || "");
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    "_blank"
  );
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    Message.success("Đã sao chép link vào clipboard");
  } catch (err) {
    Message.error("Không thể sao chép link");
  }
};

// Hook lifecycle
onMounted(() => {
  fetchArticleDetails();
});
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text-primary {
  color: #2563eb;
}

.border-primary {
  border-color: #2563eb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  color: #374151;
  max-width: 65ch;
  line-height: 1.75;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 600;
  line-height: 1.25;
}

.prose h1 {
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
}

.prose h2 {
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
}

.prose h3 {
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
}

.prose ul,
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.prose strong {
  color: #111827;
  font-weight: 600;
}

.prose blockquote {
  font-weight: 500;
  font-style: italic;
  color: #111827;
  border-left-width: 0.25rem;
  border-left-color: #e5e7eb;
  quotes: "\201C""\201D""\2018""\2019";
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

.prose img {
  margin-top: 2em;
  margin-bottom: 2em;
  border-radius: 0.5rem;
}

.prose figure {
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose figure > * {
  margin-top: 0;
  margin-bottom: 0;
}

.prose figure figcaption {
  color: #6b7280;
  font-size: 0.875em;
  line-height: 1.4285714;
  margin-top: 0.8571429em;
}
</style>
