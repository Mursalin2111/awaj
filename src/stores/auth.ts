import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('awaj-token'))
  const user = ref<AuthUser | null>(
    localStorage.getItem('awaj-user')
      ? JSON.parse(localStorage.getItem('awaj-user')!)
      : null
  )

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function login(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('awaj-token', newToken)
    localStorage.setItem('awaj-user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('awaj-token')
    localStorage.removeItem('awaj-user')
  }

  async function fetchUser() {
    try {
      const res = await api.get('/auth/me')
      user.value = res.data.user
      localStorage.setItem('awaj-user', JSON.stringify(res.data.user))
    } catch {
      logout()
    }
  }

  return { token, user, isLoggedIn, login, logout, fetchUser }
})
