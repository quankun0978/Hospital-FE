<script>
import Header from '@/components/Layout/Header/Header.vue'
import Footer from '@/components/Layout/Footer/Footer.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    LanguageSwitcher,
  }
}
</script>

<template>
  <div class="app" >
    <Header/>
    <router-view />
    <Footer/>
  </div>
</template>

<style>
</style>
