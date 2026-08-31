<template>
  <Transition name="fade">
    <div v-if="showPrompt" class="modal-overlay">
      <div class="modal-content card">
        <div class="modal-header">
          <div class="modal-icon">👋</div>
          <h2>Welcome to Awaz!</h2>
          <p>It looks like you're new here. What should we call you?</p>
        </div>
        
        <form @submit.prevent="submitName" class="name-form">
          <div class="form-group">
            <label for="userName" class="form-label">Full Name</label>
            <input 
              id="userName" 
              v-model="nameInput" 
              type="text" 
              class="form-input" 
              placeholder="e.g. Salma Begum"
              required 
              minlength="2"
            />
          </div>
          
          <div v-if="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else>Continue →</span>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()

// Show prompt if the user is logged in, but their name is empty or null
const showPrompt = computed(() => {
  if (!authStore.isLoggedIn || !authStore.user) return false
  return !authStore.user.name || authStore.user.name.trim() === ''
})

const nameInput = ref('')
const loading = ref(false)
const error = ref('')

async function submitName() {
  const trimmed = nameInput.value.trim()
  if (!trimmed) {
    error.value = 'Please enter your name.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const res = await api.put('/auth/profile', { name: trimmed })
    // Update the auth store with the new user object
    authStore.login(authStore.token!, res.data.user)
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save name. Try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 26, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 440px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
  animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  0% { transform: scale(0.95) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: wave 2.5s infinite;
  transform-origin: bottom right;
}

@keyframes wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.modal-header p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.error-msg {
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
  background: color-mix(in srgb, var(--color-danger) 15%, transparent);
  padding: 0.5rem;
  border-radius: var(--radius-md);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
