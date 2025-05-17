<template>
  <div class="language-switcher">
    <button @click="toggleDropdown" class="language-toggle">
      <img v-if="currentLang === 'en'" width="24" height="24" src="../assets/images/en.svg" :alt="currentLang" />
      <img v-else width="24" height="24" src="../assets/images/vi.svg" :alt="currentLang" /> 
    </button>
    
    <div v-if="isDropdownOpen" class="language-menu">
      <button 
        class="language-item" 
        :class="{ active: currentLang === 'en' }" 
        @click="switchLanguage('en')"
      >
        <img src="../assets/images/en.svg" alt="English" />
        <span>English</span>
      </button>
      <button 
        class="language-item" 
        :class="{ active: currentLang === 'vi' }" 
        @click="switchLanguage('vi')"
      >
        <img src="../assets/images/vi.svg" alt="Tiếng Việt" />
        <span>Tiếng Việt</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from '../i18n/useI18n';

const { locale, changeLocale, t } = useI18n();
const currentLang = ref(locale.value);
const isDropdownOpen = ref(false);

// Hiển thị/ẩn dropdown menu
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Đóng dropdown khi click bên ngoài
const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const langSwitcher = document.querySelector('.language-switcher');
  
  if (langSwitcher && !langSwitcher.contains(target)) {
    isDropdownOpen.value = false;
  }
};

// Lấy đường dẫn icon ngôn ngữ
const getLanguageIcon = (lang: string) => {
  return lang === 'en' 
    ? '../assets/images/en.svg'
    : '../assets/images/vi.svg';
};

// Thay đổi ngôn ngữ khi người dùng chọn
const switchLanguage = (lang: string) => {
  currentLang.value = lang;
  changeLocale(lang);
  isDropdownOpen.value = false;
};

onMounted(() => {
  // Kiểm tra ngôn ngữ đã lưu
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    currentLang.value = savedLocale;
    changeLocale(savedLocale);
  }
  
  // Thêm sự kiện click toàn trang để đóng dropdown
  document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
  // Xóa sự kiện khi component bị hủy
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-toggle img {
  width: 24px;
  height: 24px;
}

.language-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: #1e1e2d;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  width: 150px;
}

.language-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  gap: 8px;
  transition: background-color 0.2s;
}

.language-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.language-item.active {
  background-color: rgba(255, 255, 255, 0.05);
}

.language-item img {
  width: 20px;
  height: 20px;
}
</style> 