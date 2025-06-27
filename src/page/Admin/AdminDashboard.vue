<template>
  <AdminLayout 
    page-title="Trang quản trị"
    :breadcrumbs="[{ name: 'Dashboard' }]"
  >
    <div>
      <!-- Dashboard Content -->
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tổng người dùng</p>
              <p class="text-2xl font-semibold text-gray-900">
                <span v-if="loading" class="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
                <span v-else>{{ stats.totalUsers }}</span>
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</p>
              <p class="text-2xl font-semibold text-gray-900">
                <span v-if="loading" class="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
                <span v-else>{{ stats.todayAppointments }}</span>
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Bệnh nhân mới</p>
              <p class="text-2xl font-semibold text-gray-900">
                <span v-if="loading" class="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
                <span v-else>{{ stats.newPatients }}</span>
              </p>
            </div>
          </div>
        </AppCard>

        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Chờ xử lý</p>
              <p class="text-2xl font-semibold text-gray-900">
                <span v-if="loading" class="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
                <span v-else>{{ stats.pendingAppointments }}</span>
              </p>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <!-- Management Menu -->
        <div class="lg:col-span-1">
          <AppCard title="Quản lý hệ thống">
            <div class="space-y-2">
              <!-- Nút đặt lịch khám -->
              <button
                @click="navigateTo('/')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                Trang đặt lịch khám
              </button>
              
              <button
                v-if="userRole === 'R1'"
                @click="navigateTo('/admin/users')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                Quản lý người dùng
              </button>
              
              <button
                v-if="userRole === 'R1'"
                @click="navigateTo('/admin/doctors')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Quản lý bác sĩ
              </button>
              
              <button
                v-if="userRole === 'R1'"
                @click="navigateTo('/admin/clinics')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Quản lý phòng khám
              </button>
              
              <button
                v-if="userRole === 'R1'"
                @click="navigateTo('/admin/specialties')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6m-6 4h6"/>
                </svg>
                Quản lý chuyên khoa
              </button>
              
              <button
                @click="navigateTo('/admin/schedules')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                {{ userRole === 'R1' ? 'Quản lý lịch khám' : 'Lịch khám của tôi' }}
              </button>
              
              <button
                @click="navigateTo('/admin/appointments')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Quản lý lịch hẹn
              </button>
              
              <button
                v-if="userRole === 'R1'"
                @click="navigateTo('/admin/articles')"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
              >
                <svg class="mr-3 h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Quản lý bài viết
              </button>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppCard from '@/components/common/Card/Card.vue'
import adminApi from '@/api/adminApi'
import Message from '@/plugins/message'

// Router
const router = useRouter()

const authStore = useAuthStore()

// User info
const userName = computed(() => authStore.getUserName)
const userRole = computed(() => authStore.getUserRole)
const userInitials = computed(() => {
  if (!userName.value) return ""
  return userName.value.charAt(0).toUpperCase()
})

// Loading state
const loading = ref(false)

// Stats data
const stats = ref({
  totalUsers: 0,
  todayAppointments: 0,
  newPatients: 0,
  pendingAppointments: 0
})

// Load dashboard stats
const loadDashboardStats = async () => {
  try {
    loading.value = true
    const response = await adminApi.getDashboardStats()
    
    if (response.succeeded && response.data) {
      stats.value = {
        totalUsers: response.data.totalUsers || 0,
        todayAppointments: response.data.todayAppointments || 0,
        newPatients: response.data.newPatients || 0,
        pendingAppointments: response.data.pendingAppointments || 0
      }
    } else {
      Message.error('Không thể tải thống kê dashboard')
    }
  } catch (error) {
    console.error('Load dashboard stats error:', error)
    Message.error('Lỗi khi tải thống kê dashboard')
  } finally {
    loading.value = false
  }
}

// Navigation methods
const navigateTo = (path) => {
  router.push(path)
}

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  
  if (diff < 60 * 1000) {
    return 'Vừa xong'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} phút trước`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} giờ trước`
  } else {
    return time.toLocaleDateString('vi-VN')
  }
}

onMounted(() => {
  // Load dashboard data
  loadDashboardStats()
})
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