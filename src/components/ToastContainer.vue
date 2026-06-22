<template>
  <div class="toast-container" aria-live="polite">
    <TransitionGroup name="toast-anim">
      <div v-for="t in toasts" :key="t.id" :class="['toast', `toast-${t.type}`]">
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toast'
const { toasts } = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.toast-anim-enter-active, .toast-anim-leave-active { transition: all .25s ease; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateX(16px); }
</style>
