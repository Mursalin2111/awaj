<template>
  <div class="login-page">
    <div class="login-card card card-body">
      <div class="login-logo">
        <div class="logo-mark">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="currentColor" opacity=".15"/>
            <path d="M7 18 Q14 6 21 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <circle cx="14" cy="19" r="2" fill="currentColor"/>
          </svg>
        </div>
        <span>Awaz</span>
      </div>
      <h1>Welcome back</h1>
      <p>Sign in with your Bangladeshi phone number</p>

      <form class="login-form" @submit.prevent="handleLogin" id="login-form">
        <div class="form-group">
          <label class="form-label" for="phone">Phone Number</label>
          <div class="phone-row">
            <span class="country-code">🇧🇩 +880</span>
            <input id="phone" v-model="phone" class="form-input" type="tel" placeholder="1XXXXXXXXX" required />
          </div>
        </div>

        <div v-if="otpSent" class="form-group">
          <label class="form-label" for="otp">One-Time Password (OTP)</label>
          <input id="otp" v-model="otp" class="form-input otp-input" type="text" placeholder="• • • • • •" maxlength="6" />
          <span class="form-hint">Enter the 6-digit code sent to your phone</span>
        </div>

        <button type="submit" class="btn btn-primary btn-lg login-btn" :disabled="loading" id="login-btn">
          <span v-if="loading" class="spinner"></span>
          <span v-else-if="!otpSent">Send OTP</span>
          <span v-else>Verify & Sign In</span>
        </button>
      </form>

      <Transition name="fade">
        <div class="login-success" v-if="success">
          ✅ Signed in successfully! Redirecting…
        </div>
      </Transition>

      <div class="login-divider"><hr class="divider"><span>or</span><hr class="divider"></div>

      <p class="signup-hint">Don't have an account? <RouterLink to="/login">Sign up</RouterLink> — it's free.</p>
      <p class="privacy-note">🔒 We only use your phone for verification. No spam ever.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useToastStore } from '../stores/toast'

const phone = ref('')
const otp = ref('')
const loading = ref(false)
const otpSent = ref(false)
const success = ref(false)
const router = useRouter()
const toast = useToastStore()

async function handleLogin() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1000))
  if (!otpSent.value) {
    otpSent.value = true
    toast.show('OTP sent to your phone number!', 'info')
  } else {
    success.value = true
    toast.show('Welcome to Awaz — The Voice of People!', 'success')
    setTimeout(() => router.push('/'), 1500)
  }
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 128px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  background: var(--color-bg);
}
.login-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
  padding: 2.5rem;
}
.login-logo { display: flex; align-items: center; justify-content: center; gap: .5rem; font-size: 1.5rem; font-weight: 800; color: var(--color-primary); margin-bottom: 1.25rem; }
.logo-mark { color: var(--color-primary); }
.login-card h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: .375rem; }
.login-card > p { font-size: .9rem; color: var(--color-text-muted); margin-bottom: 1.75rem; }
.login-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
.phone-row { display: flex; gap: .5rem; align-items: center; }
.country-code { padding: .625rem .75rem; background: var(--color-surface-2); border: 1.5px solid var(--color-border); border-radius: var(--radius-md); font-size: .875rem; white-space: nowrap; }
.otp-input { letter-spacing: .3em; font-size: 1.25rem; text-align: center; font-weight: 700; }
.login-btn { width: 100%; justify-content: center; margin-top: .5rem; }
.login-divider { display: flex; align-items: center; gap: .875rem; margin-block: 1.5rem; }
.login-divider hr { flex: 1; }
.login-divider span { font-size: .8rem; color: var(--color-text-subtle); }
.signup-hint { font-size: .875rem; color: var(--color-text-muted); margin-bottom: .5rem; }
.signup-hint a { color: var(--color-primary); font-weight: 600; }
.privacy-note { font-size: .78rem; color: var(--color-text-subtle); }
.login-success { background: color-mix(in srgb, var(--color-success) 10%, transparent); border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent); color: var(--color-success); border-radius: var(--radius-md); padding: .75rem 1rem; font-size: .875rem; font-weight: 600; margin-top: 1rem; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
