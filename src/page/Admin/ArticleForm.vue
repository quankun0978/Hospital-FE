<template>
  <AdminLayout
    :page-title="isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'"
    :breadcrumbs="[
      { name: 'Quản lý bài viết', path: '/admin/articles' },
      { name: isEditing ? 'Chỉnh sửa' : 'Thêm mới' },
    ]"
  >
    <div class="max-w-6xl mx-auto">
      <AppCard>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span class="text-red-500">*</span>
              </label>
              <AppInput
                v-model="formData.title"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL thân thiện)
              </label>
              <div class="relative">
                <AppInput
                  v-model="formData.slug"
                  placeholder="Slug sẽ được tạo tự động"
                  :disabled="autoGenerateSlug"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <AppSelect
                v-model="formData.category"
                :options="categoryOptions"
                placeholder="Chọn danh mục"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ngày xuất bản
              </label>
              <AppInputDate
                v-model="formData.publishedAt"
                placeholder="Chọn ngày xuất bản"
              />
            </div>
          </div>

          <!-- Ảnh đại diện -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div class="space-y-4">
              <!-- Hiển thị ảnh hiện tại -->
              <div v-if="formData.imageUrl" class="flex items-center space-x-4">
                <a-image
                  :src="getImageUrl(formData.imageUrl)"
                  :width="160"
                  :height="120"
                  class="object-cover rounded-lg border"
                />
                <div>
                  <p class="text-sm text-gray-600">Ảnh hiện tại</p>
                  <a-button 
                    size="small" 
                    danger 
                    @click="handleImageRemove"
                    :disabled="uploading"
                  >
                    Xóa ảnh
                  </a-button>
                </div>
              </div>
              
              <!-- Upload ảnh mới -->
              <a-upload
                :file-list="imageFileList"
                :before-upload="beforeUpload"
                :on-remove="handleImageRemove"
                list-type="picture-card"
                :show-upload-list="false"
                accept="image/*"
              >
                <div v-if="!formData.imageUrl">
                  <plus-outlined />
                  <div class="ant-upload-text">Tải ảnh lên</div>
                </div>
                <div v-else>
                  <edit-outlined />
                  <div class="ant-upload-text">Thay đổi</div>
                </div>
              </a-upload>
              
              <!-- Tùy chọn khác -->
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-500">hoặc</span>
                <button
                  type="button"
                  class="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="openImageLibrary"
                >
                  Chọn từ thư viện
                </button>
              </div>
              
              <!-- URL input -->
              <div>
                <AppInput
                  v-model="formData.imageUrl"
                  placeholder="Hoặc nhập đường dẫn ảnh trực tiếp"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả ngắn cho bài viết..."
            ></textarea>
          </div>

          <div>
            <CKEditor
              ref="ckEditorRef"
              v-model="formData.contentHtml"
              label="Nội dung bài viết"
              placeholder="Nhập nội dung bài viết..."
              :required="true"
              :min-height="400"
              @change="onContentChange"
              @ready="onEditorReady"
            />
          </div>

          <!-- Action buttons -->
          <div
            class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
          >
            <AppButton
              variant="outline"
              @click="handleCancel"
              :disabled="loading"
            >
              Hủy
            </AppButton>
            <AppButton type="submit" variant="primary" :loading="loading">
              {{ isEditing ? "Cập nhật" : "Xuất bản" }}
            </AppButton>
          </div>
        </form>
      </AppCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import articleApi from "@/api/articleApi";
import AdminLayout from "@/layouts/AdminLayout.vue";
import AppCard from "@/components/common/Card/Card.vue";
import AppButton from "@/components/common/Button/Button.vue";
import AppInput from "@/components/common/Input/Input.vue";
import AppInputDate from "@/components/common/Input/InputDate.vue";
import AppSelect from "@/components/common/Select/Select.vue";
import CKEditor from "@/components/common/Editor/CKEditor.vue";
import Message from "@/plugins/message";
import { generateSlug, getImage } from "@/common/function";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(false);
const uploading = ref(false);
const isEditing = computed(() => !!route.params.id);
const articleId = computed(() => route.params.id);
const autoGenerateSlug = ref(true);
const ckEditorRef = ref(null);
let editorInstance = null; // Không reactive để tránh proxy conflict

// Image upload state
const imageFileList = ref([]);
const uploadedImageUrl = ref('');

// Form data
const formData = reactive({
  title: "",
  slug: "",
  description: "",
  content: "",
  contentHtml: "",
  category: "",
  imageUrl: "",
  publishedAt: new Date().toISOString().split("T")[0],
});

// Category options
const categoryOptions = [
  { value: "tin-tuc", label: "Tin tức" },
  { value: "suc-khoe", label: "Sức khỏe" },
  { value: "kien-thuc-y-khoa", label: "Kiến thức y khoa" },
  { value: "chuyen-gia", label: "Chuyên gia" },
  { value: "dich-vu", label: "Dịch vụ" },
  { value: "khac", label: "Khác" },
];

// Methods
const onContentChange = (htmlContent) => {
  // Cập nhật cả contentHtml và content
  formData.contentHtml = htmlContent;
  formData.content = htmlContent.replace(/<[^>]*>/g, "").trim();
};

const onEditorReady = (editor) => {
  console.log("CKEditor ready");
  editorInstance = editor;

  // Nếu đang edit và có content, set lại
  if (isEditing.value && formData.contentHtml) {
    console.log(
      "Setting initial content:",
      formData.contentHtml.substring(0, 100) + "..."
    );
    editor.setData(formData.contentHtml);
  }
};

// Auto-generate slug when title changes
watch(
  () => formData.title,
  (newTitle) => {
    if (autoGenerateSlug.value && newTitle) {
      formData.slug = generateSlug(newTitle);
    }
  }
);

const generateSlugFromTitle = () => {
  if (formData.title) {
    formData.slug = generateSlug(formData.title);
  }
};

// Image handling methods
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return getImage(url);
};

const onImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
};

// Image upload methods
const beforeUpload = async (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    Message.error('Chỉ được tải lên file hình ảnh!')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    Message.error('Kích thước file không được vượt quá 5MB!')
    return false
  }

  try {
    uploading.value = true
    const response = await articleApi.uploadImage(file)
    
    console.log('Upload image response:', response)
    
    if (response.succeeded) {
      uploadedImageUrl.value = response.data?.imageUrl || ''
      formData.imageUrl = uploadedImageUrl.value
      Message.success('Tải ảnh lên thành công!')
      
      imageFileList.value = [{
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: getImage(uploadedImageUrl.value)
      }]
    } else {
      console.error('Upload failed:', response)
      Message.error(response.message || 'Không thể tải ảnh lên')
    }
  } catch (error) {
    console.error('Upload error:', error)
    Message.error('Lỗi khi tải ảnh lên')
  } finally {
    uploading.value = false
  }

  return false
}

const handleImageRemove = () => {
  imageFileList.value = []
  uploadedImageUrl.value = ''
  formData.imageUrl = ''
};

const openImageLibrary = () => {
  // Simple image library - could be expanded with a proper image browser
  const imageUrls = [
    '/image/medical/0506c3aa-5d0a-4fe4-a51f-313861f1684e.jpg',
    '/image/medical/0a0ff871-c3c3-4110-a12f-4943ef5463a8.webp',
    '/image/medical/0dd3cd75-1970-4870-964e-a7a54f667c7c.jpg',
    '/image/medical/2b7bf2f1-b555-4aea-9a56-3968a5c6ea2b.jpg',
    '/image/medical/3dd59e6d-dc3c-4db6-b1e1-bb1b65f20bd8.jpg'
  ];
  
  const selectedUrl = prompt(
    'Chọn một URL ảnh:\n' + 
    imageUrls.map((url, idx) => `${idx + 1}. ${url}`).join('\n') +
    '\n\nNhập số thứ tự (1-' + imageUrls.length + ') hoặc nhập URL trực tiếp:'
  );
  
  if (selectedUrl && selectedUrl.trim()) {
    const num = parseInt(selectedUrl);
    if (num >= 1 && num <= imageUrls.length) {
      formData.imageUrl = imageUrls[num - 1];
    } else if (selectedUrl.includes('/') || selectedUrl.includes('http')) {
      formData.imageUrl = selectedUrl.trim();
    }
  }
};

const loadArticle = async () => {
  if (!isEditing.value) return;

  try {
    loading.value = true;
    const response = await articleApi.getArticleById(articleId.value);

    if (response.succeeded && response.data) {
      const article = response.data;

      formData.title = article.title || "";
      formData.slug = article.slug || "";
      formData.description = article.description || "";
      formData.content = article.content || "";
      formData.contentHtml = article.contentHtml || "";
      formData.category = article.category || "";
      formData.imageUrl = article.imageUrl || "";

      // Set image file list if article has image
      if (article.imageUrl) {
        imageFileList.value = [{
          uid: '1',
          name: 'article-image.jpg',
          status: 'done',
          url: getImage(article.imageUrl)
        }]
      }

      // Format date for input
      if (article.publishedAt) {
        formData.publishedAt = new Date(article.publishedAt)
          .toISOString()
          .split("T")[0];
      }

      // Disable auto-generate slug when editing
      autoGenerateSlug.value = false;

      // Set content to editor after a delay to ensure it's ready
      setTimeout(() => {
        if (editorInstance && formData.contentHtml) {
          console.log(
            "Setting content to editor after load:",
            formData.contentHtml.substring(0, 100) + "..."
          );
          editorInstance.setData(formData.contentHtml);
        }
      }, 200);
    } else {
      Message.error("Không thể tải thông tin bài viết");
      router.push("/admin/articles");
    }
  } catch (error) {
    console.error("Load article error:", error);
    Message.error("Lỗi khi tải thông tin bài viết");
    router.push("/admin/articles");
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  if (!formData.title.trim()) {
    Message.error("Vui lòng nhập tiêu đề bài viết");
    return false;
  }

  // Đảm bảo có content từ CKEditor
  let currentContentHtml = formData.contentHtml;
  if (editorInstance && editorInstance.getData) {
    currentContentHtml = editorInstance.getData();
  }

  // Kiểm tra nội dung thực tế (loại bỏ HTML tags và whitespace)
  const textContent = currentContentHtml.replace(/<[^>]*>/g, "").trim();

  if (!textContent) {
    Message.error("Vui lòng nhập nội dung bài viết");
    return false;
  }

  if (!formData.publishedAt) {
    Message.error("Vui lòng chọn ngày xuất bản");
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  // Đợi một chút để CKEditor sync dữ liệu
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!validateForm()) return;

  try {
    loading.value = true;

    // Lấy nội dung cuối cùng từ CKEditor
    let finalContentHtml = formData.contentHtml;
    if (editorInstance && editorInstance.getData) {
      finalContentHtml = editorInstance.getData();
    }

    // Tạo content text từ HTML (loại bỏ tags)
    const finalContent = finalContentHtml.replace(/<[^>]*>/g, "").trim();

              const finalImageUrl = uploadedImageUrl.value || formData.imageUrl

    const submitData = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      description: formData.description.trim(),
      content: finalContent,
      contentHtml: finalContentHtml,
      category: formData.category,
      imageUrl: finalImageUrl.trim(),
      publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : new Date().toISOString(),
    };

    if (isEditing.value) {
      const response = await articleApi.updateArticle(
        articleId.value,
        submitData
      );

      if (response.succeeded) {
        Message.success("Cập nhật bài viết thành công");
        router.push("/admin/articles");
      } else {
        Message.error(response.message || "Không thể cập nhật bài viết");
      }
    } else {
      const response = await articleApi.createArticle(submitData);

      if (response.succeeded) {
        Message.success("Tạo bài viết thành công");
        router.push("/admin/articles");
      } else {
        Message.error(response.message || "Không thể tạo bài viết");
      }
    }
  } catch (error) {
    console.error("Submit error:", error);
    Message.error("Lỗi khi xử lý dữ liệu");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/admin/articles");
};

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadArticle();
  }
});
</script>

<style scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

:deep(.ant-form-item) {
  margin-bottom: 0px;
}
</style>
