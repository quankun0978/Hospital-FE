<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider :collapsed="collapsed" collapsible @collapse="collapsed = $event">
      <div class="">
        <div style="height: 32px; margin: 12px; display: flex; justify-content: center  ; color: white;">
          <span style="font-size: 26px; font-weight: bold; text-align: center;">Hospital</span>
        </div>
      </div>
      <a-menu :selectedKeys="selectedKeys" theme="dark" mode="inline" @select="handleMenuSelect">
        <a-menu-item key="dashboard">
          <pie-chart-outlined />
          <span>Dashboard</span>
        </a-menu-item>
        
        <a-sub-menu v-if="userRole === 'R1'" key="user-management">
          <template #title>
            <span>
              <user-outlined />
              <span>Quản lý người dùng</span>
            </span>
          </template>
          <a-menu-item key="users">
            <span>Danh sách người dùng</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="doctor-management">
          <template #title>
            <span>
              <team-outlined />
              <span>Quản lý bác sĩ</span>
            </span>
          </template>
          <a-menu-item key="doctors">
            <span>Danh sách bác sĩ</span>
          </a-menu-item>
          <a-menu-item key="schedules">
            <span>{{ userRole === 'R1' ? 'Quản lý lịch khám' : 'Lịch khám của tôi' }}</span>
          </a-menu-item>
          <a-menu-item key="appointments">
            <span>Quản lý lịch hẹn</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="userRole === 'R1'" key="clinic-management">
          <template #title>
            <span>
              <desktop-outlined />
              <span>Quản lý phòng khám</span>
            </span>
          </template>
          <a-menu-item key="clinics">
            <span>Danh sách phòng khám</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="userRole === 'R1'" key="specialty-management">
          <template #title>
            <span>
              <medicine-box-outlined />
              <span>Quản lý chuyên khoa</span>
            </span>
          </template>
          <a-menu-item key="specialties">
            <span>Danh sách chuyên khoa</span>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="userRole === 'R1'" key="article-management">
          <template #title>
            <span>
              <file-text-outlined />
              <span>Quản lý bài viết</span>
            </span>
          </template>
          <a-menu-item key="articles">
            <span>Danh sách bài viết</span>
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="reports">
          <bar-chart-outlined />
          <span>Báo cáo</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px">
        <div class="flex justify-between items-center h-full">
          <h2 class="text-lg font-semibold text-gray-900 m-0">{{ pageTitle }}</h2>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Xin chào,</span>
            <span class="text-sm font-medium text-gray-900">{{ userName }}</span>
            <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </a-layout-header>
      
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>
            <router-link to="/admin">Trang chủ</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path">
            <router-link v-if="crumb.path" :to="crumb.path">{{ crumb.name }}</router-link>
            <span v-else>{{ crumb.name }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        
        <div style="padding: 24px; background: #fff; min-height: 360px; border-radius: 6px;">
          <!-- Slot for page content -->
          <slot />
        </div>
      </a-layout-content>
      
      <a-layout-footer style="text-align: center">
        Hospital Management System ©2024 Created by Admin Team
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  BarChartOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue'

const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Trang quản trị'
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})

// Router
const router = useRouter()
const route = useRoute()

// Layout state
const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])

const authStore = useAuthStore()

// User info
const userName = computed(() => authStore.getUserName)
const userRole = computed(() => authStore.getUserRole)
const userInitials = computed(() => {
  if (!userName.value) return ""
  return userName.value.charAt(0).toUpperCase()
})

// Update selected menu based on current route
watch(() => route.path, (newPath) => {
  if (newPath.includes('/admin/users')) {
    selectedKeys.value = ['users']
  } else if (newPath.includes('/admin/clinics')) {
    selectedKeys.value = ['clinics']
  } else if (newPath.includes('/admin/doctors')) {
    selectedKeys.value = ['doctors']
  } else if (newPath.includes('/admin/schedules')) {
    selectedKeys.value = ['schedules']
  } else if (newPath.includes('/admin/appointments')) {
    selectedKeys.value = ['appointments']
  } else if (newPath.includes('/admin/specialties')) {
    selectedKeys.value = ['specialties']
  } else if (newPath.includes('/admin/articles')) {
    selectedKeys.value = ['articles']
  } else if (newPath.includes('/admin/reports')) {
    selectedKeys.value = ['reports']
  } else {
    selectedKeys.value = ['dashboard']
  }
}, { immediate: true })

// Navigation methods
const handleMenuSelect = ({ key }) => {
  selectedKeys.value = [key]
  
  // Navigate based on menu key
  switch (key) {
    case 'dashboard':
      navigateTo('/admin')
      break
    case 'users':
      navigateTo('/admin/users')
      break
    case 'clinics':
      navigateTo('/admin/clinics')
      break
    case 'doctors':
      navigateTo('/admin/doctors')
      break
    case 'schedules':
      navigateTo('/admin/schedules')
      break
    case 'appointments':
      navigateTo('/admin/appointments')
      break
    case 'specialties':
      navigateTo('/admin/specialties')
      break
    case 'articles':
      navigateTo('/admin/articles')
      break
    case 'reports':
      navigateTo('/admin/reports')
      break
    default:
      break
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  max-height: 24px;
  max-width: calc(100% - 16px);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style> 