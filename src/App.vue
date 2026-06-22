<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <div class="app-shell">
    <SiteHeader />
    <main id="main-content" class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
    <BackToTop />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import BackToTop from './components/BackToTop.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useAppStore } from './stores'

const appStore = useAppStore()
onMounted(() => appStore.initTheme())
</script>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content { flex: 1; }

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
