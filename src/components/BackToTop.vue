<template>
  <Transition name="fade">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" aria-label="Back to top">
      ↑
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const visible = ref(false)
function onScroll() { visible.value = window.scrollY > 400 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 500;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-to-top:hover { background: var(--color-primary-light); transform: translateY(-2px); box-shadow: var(--shadow-glow); }
.fade-enter-active, .fade-leave-active { transition: opacity .25s, transform .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
