<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Layout/Header/Header.vue'
import Footer from '@/components/Layout/Footer/Footer.vue'
import CozeChat from '@/components/AIConsultant/AIConsultant.vue'
import AICoze from '@/components/AIConsultant/AICoze.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
    CozeChat,
    AICoze
  },
  setup() {
    const route = useRoute()
    
    // Kiểm tra có phải trang admin không
    const isAdminPage = computed(() => {
      return route.path.startsWith('/admin')
    })
    
    return {
      isAdminPage
    }
  },
 

}
</script>

<template>
  <div class="app">
    <!-- Chỉ hiển thị Header và Footer khi không phải trang admin -->
    <template v-if="!isAdminPage">
      <Header/>
    </template>
    
    <router-view />
    
    <template v-if="!isAdminPage">
      <Footer/>
    </template>
    <!-- <CozeChat /> -->
    <AICoze />
  </div>
</template>

<style>
</style>
