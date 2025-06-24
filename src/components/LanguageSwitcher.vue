<template>
  <div class="language-switcher">
    <button @click="toggleDropdown" class="language-toggle">
      <img 
        :src="getCurrentLanguageIcon()" 
        :alt="currentLang" 
        width="24" 
        height="24" 
        class="language-flag"
      />
    </button>
    
    <div v-if="isDropdownOpen" class="language-menu">
      <button 
        v-for="option in languageOptions"
        :key="option.value"
        class="language-item" 
        :class="{ active: currentLang === option.value }" 
        @click="switchLanguage(option.value)"
      >
        <img :src="option.icon" :alt="option.label" width="20" height="20" />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from '../i18n/useI18n';

const { locale, changeLocale } = useI18n();
const currentLang = ref(locale.value);
const isDropdownOpen = ref(false);

// Danh sách ngôn ngữ có sẵn
const languageOptions = [
  {
    value: 'vi',
    label: 'Tiếng Việt',
    icon: '/src/assets/images/vi.svg'
  },
  {
    value: 'en', 
    label: 'English',
    icon: '/src/assets/images/en.svg'
  }
];

// Methods
const getCurrentLanguageIcon = () => {
  const currentOption = languageOptions.find(opt => opt.value === currentLang.value);
  return currentOption ? currentOption.icon : languageOptions[0].icon;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const switchLanguage = (langValue) => {
  currentLang.value = langValue;
  changeLocale(langValue);
  localStorage.setItem('locale', langValue);
  isDropdownOpen.value = false;
};

// Đóng dropdown khi click bên ngoài
const closeDropdown = (event) => {
  const target = event.target;
  const langSwitcher = document.querySelector('.language-switcher');
  
  if (langSwitcher && !langSwitcher.contains(target)) {
    isDropdownOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  // Kiểm tra ngôn ngữ đã lưu
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && languageOptions.some(opt => opt.value === savedLocale)) {
    currentLang.value = savedLocale;
    changeLocale(savedLocale);
  }
  
  // Thêm event listener
  document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
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
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.language-toggle:hover {
  background-color: #f3f4f6;
}

.language-flag {
  border-radius: 2px;
}

.language-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 100;
  width: 160px;
}

.language-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #374151;
  cursor: pointer;
  gap: 8px;
  transition: background-color 0.2s;
}

.language-item:hover {
  background-color: #f3f4f6;
}

.language-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.language-item img {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}
</style> 