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
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
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
              <p class="text-2xl font-semibold text-gray-900">{{ stats.todayAppointments }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Doanh thu tháng</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(stats.monthlyRevenue) }}</p>
            </div>
          </div>
        </AppCard>

        <AppCard hoverable>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Chờ xử lý</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.pendingRequests }}</p>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z"/>
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

        <!-- Recent Activities -->
        <div class="lg:col-span-2">
          <AppCard title="Hoạt động gần đây">
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(activity, index) in recentActivities" :key="index">
                  <div class="relative pb-8" :class="index === recentActivities.length - 1 ? 'pb-0' : ''">
                    <span
                      v-if="index !== recentActivities.length - 1"
                      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    ></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span
                          class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                          :class="activity.type === 'user' ? 'bg-blue-500' : activity.type === 'appointment' ? 'bg-green-500' : 'bg-yellow-500'"
                        >
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path v-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            <path v-else-if="activity.type === 'appointment'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z"/>
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1"/>
                          </svg>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">{{ activity.description }}</p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          {{ formatTime(activity.time) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
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

// Stats data
const stats = ref({
  totalUsers: 1248,
  todayAppointments: 32,
  monthlyRevenue: 125000000,
  pendingRequests: 8
})

// Recent activities
const recentActivities = ref([
  {
    type: 'user',
    description: 'Nguyễn Văn A đã đăng ký tài khoản mới',
    time: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  },
  {
    type: 'appointment',
    description: 'Đặt lịch khám với BS. Trần Thị B',
    time: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
  },
  {
    type: 'payment',
    description: 'Thanh toán thành công cho lịch hẹn #1234',
    time: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  {
    type: 'user',
    description: 'Cập nhật thông tin hồ sơ bệnh nhân',
    time: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  }
])

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
  // Can add API calls here to load real data
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