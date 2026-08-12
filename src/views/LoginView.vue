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

      <!-- Mode Tabs -->
      <div class="auth-tabs">
        <button
          type="button"
          :class="['tab-btn', { active: activeTab === 'citizen' }]"
          @click="activeTab = 'citizen'; resetForm()"
        >
          👤 Citizen Login
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: activeTab === 'authority' }]"
          @click="activeTab = 'authority'; resetForm()"
        >
          🏛️ Authority Portal
        </button>
      </div>

      <!-- Header title -->
      <template v-if="activeTab === 'citizen'">
        <h1>{{ !codeSent ? 'Citizen Verification' : 'Check your email' }}</h1>
        <p v-if="!codeSent">Sign in or create a citizen account with your email</p>
        <p v-else>We've sent a 6-digit verification code to <strong>{{ email }}</strong></p>
      </template>
      <template v-else>
        <h1>🏛️ Authority Portal Sign In</h1>
        <p>Enter your unique Municipal Authority ID and password</p>
      </template>

      <div v-if="errorMsg" class="login-error">{{ errorMsg }}</div>

      <!-- Form: Citizen Email Code Login -->
      <form v-if="activeTab === 'citizen'" class="login-form" @submit.prevent="handleCitizenLogin">
        <div class="form-group" v-if="!codeSent">
          <label class="form-label" for="email">Email Address</label>
          <div class="email-row">
            <span class="email-icon">✉️</span>
            <input id="email" v-model="email" class="form-input" type="email" placeholder="you@example.com" required />
          </div>
        </div>

        <div class="form-group" v-if="codeSent">
          <label class="form-label" for="code">Verification Code</label>
          <input id="code" v-model="code" class="form-input code-input" type="text" placeholder="• • • • • •" maxlength="6" required />
          <span class="form-hint">Enter the 6-digit code sent to your email</span>
        </div>

        <button type="submit" class="btn btn-primary btn-lg login-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else-if="!codeSent">Send Verification Code</span>
          <span v-else>Verify & Sign In</span>
        </button>

        <div v-if="codeSent" class="code-actions">
          <button type="button" class="link-btn" @click="resetForm">← Use a different email</button>
          <button type="button" class="link-btn" @click="resendCode" :disabled="resendCooldown > 0">
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
          </button>
        </div>
      </form>

      <!-- Form: Authority Unique ID & Password Login -->
      <form v-else class="login-form" @submit.prevent="handleAuthorityLogin">
        <div class="form-group">
          <label class="form-label" for="authorityId">Authority ID / Email</label>
          <input
            id="authorityId"
            v-model="authorityId"
            class="form-input"
            type="text"
            placeholder="e.g. AUTH-101 or authority@awaj.gov.bd"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            class="form-input"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-lg login-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign In as Authority</span>
        </button>
      </form>

      <Transition name="fade">
        <div class="login-success" v-if="success">
          ✅ Signed in successfully! Redirecting…
        </div>
      </Transition>

      <div class="login-divider"><hr class="divider"><span>Awaz Civic Portal</span><hr class="divider"></div>
      <p class="privacy-note">🔒 Private and encrypted authorization system.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '../stores/toast'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const activeTab = ref<'citizen' | 'authority'>('citizen')
const email = ref('')
const code = ref('')
const authorityId = ref('')
const password = ref('')

const loading = ref(false)
const codeSent = ref(false)
const success = ref(false)
const errorMsg = ref('')
const resendCooldown = ref(0)
const router = useRouter()
const toast = useToastStore()
const authStore = useAuthStore()

let cooldownTimer: ReturnType<typeof setInterval> | null = null

function startCooldown() {
  resendCooldown.value = 30
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function handleCitizenLogin() {
  loading.value = true
  errorMsg.value = ''

  try {
    if (!codeSent.value) {
      await api.post('/auth/send-code', { email: email.value })
      codeSent.value = true
      startCooldown()
      toast.show(`Verification code sent to ${email.value}`, 'info')
    } else {
      const res = await api.post('/auth/verify-code', {
        email: email.value,
        code: code.value,
      })
      authStore.login(res.data.token, res.data.user)
      success.value = true
      toast.show('Signed in successfully!', 'success')
      setTimeout(() => router.push('/concerns'), 1200)
    }
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Something went wrong. Please try again.'
    errorMsg.value = msg
    toast.show(msg, 'error')
  } finally {
    loading.value = false
  }
}

async function handleAuthorityLogin() {
  loading.value = true
  errorMsg.value = ''

  try {
    const res = await api.post('/auth/authority-login', {
      authorityId: authorityId.value,
      password: password.value,
    })
    authStore.login(res.data.token, res.data.user)
    success.value = true
    toast.show('Signed in as Municipal Authority!', 'success')
    setTimeout(() => router.push('/concerns'), 1200)
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Invalid Authority ID or password.'
    errorMsg.value = msg
    toast.show(msg, 'error')
  } finally {
    loading.value = false
  }
}

async function resendCode() {
  loading.value = true
  errorMsg.value = ''
  try {
    await api.post('/auth/send-code', { email: email.value })
    startCooldown()
    toast.show(`New code sent to ${email.value}`, 'info')
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Failed to resend code.'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

function resetForm() {
  codeSent.value = false
  code.value = ''
  authorityId.value = ''
  password.value = ''
  errorMsg.value = ''
  resendCooldown.value = 0
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
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

.auth-tabs {
  display: flex;
  background: var(--color-surface-2);
  padding: 4px;
  border-radius: var(--radius-lg);
  gap: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
}
.tab-btn {
  flex: 1;
  padding: .5rem .75rem;
  font-size: .82rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.tab-btn.active {
  background: var(--color-surface);
  color: var(--color-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.authority-credentials-box {
  margin-top: 1rem;
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-radius: var(--radius-md);
  padding: .75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .25rem;
  font-size: .8rem;
  text-align: left;
}
.box-title { font-weight: 700; color: var(--color-primary); }
.authority-credentials-box code { font-family: monospace; font-size: .78rem; color: var(--color-text-muted); }
.authority-credentials-box code strong { color: var(--color-text); }

.login-card h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: .375rem; }
.login-card > p { font-size: .9rem; color: var(--color-text-muted); margin-bottom: 1.75rem; }
.login-card > p strong { color: var(--color-text); font-weight: 600; }
.login-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }

.login-error {
  background: color-mix(in srgb, var(--color-danger) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  padding: .625rem 1rem;
  font-size: .85rem;
  font-weight: 500;
  margin-bottom: .5rem;
}

.email-row { display: flex; gap: .5rem; align-items: center; }
.email-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .625rem .75rem;
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}

.code-input { letter-spacing: .3em; font-size: 1.25rem; text-align: center; font-weight: 700; }
.login-btn { width: 100%; justify-content: center; margin-top: .5rem; }

.code-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: .25rem;
}
.link-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: .8rem;
  font-weight: 500;
  cursor: pointer;
  padding: .25rem 0;
  transition: opacity var(--transition-fast);
}
.link-btn:hover { opacity: .75; }
.link-btn:disabled { color: var(--color-text-subtle); cursor: default; opacity: .6; }

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
