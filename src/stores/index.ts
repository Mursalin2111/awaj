import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export type Theme = 'light' | 'dark'
export type Locale = 'en' | 'bn'

export const useAppStore = defineStore('app', () => {
  const theme = ref<Theme>((localStorage.getItem('awaj-theme') as Theme) || 'light')
  const locale = ref<Locale>((localStorage.getItem('awaj-locale') as Locale) || 'en')

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('awaj-theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function setLocale(l: Locale) {
    locale.value = l
    localStorage.setItem('awaj-locale', l)
  }

  function initTheme() {
    const saved = localStorage.getItem('awaj-theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = saved || (prefersDark ? 'dark' : 'light')
    theme.value = resolved
    document.documentElement.setAttribute('data-theme', resolved)
  }

  return { theme, locale, isDark, toggleTheme, setLocale, initTheme }
})

// Concerns store — now fetches from API
export interface Concern {
  id: string
  _id?: string
  title: string
  description: string
  category: string
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected'
  votes: number
  voted: boolean
  location: string
  createdAt: string
  author: string
  authorName: string
  photos: string[]
  updates: Array<{ date: string; note: string; status: string }>
}

export const useConcernsStore = defineStore('concerns', () => {
  const concerns = ref<Concern[]>([])
  const loading = ref(false)
  const sortBy = ref<'recent' | 'votes'>('votes')
  const searchQuery = ref('')
  const filterStatus = ref<string>('all')

  const filtered = computed(() => {
    let list = [...concerns.value]
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    }
    if (filterStatus.value !== 'all') {
      list = list.filter(c => c.status === filterStatus.value)
    }
    return list.sort((a, b) =>
      sortBy.value === 'votes' ? b.votes - a.votes : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  async function fetchConcerns() {
    loading.value = true
    try {
      const res = await api.get('/concerns', {
        params: {
          search: searchQuery.value || undefined,
          status: filterStatus.value !== 'all' ? filterStatus.value : undefined,
          sort: sortBy.value,
        },
      })
      concerns.value = res.data.map((c: any) => ({
        ...c,
        id: c._id || c.id,
        author: c.authorName || 'Anonymous',
      }))
    } catch (error) {
      console.error('Failed to fetch concerns:', error)
    } finally {
      loading.value = false
    }
  }

  async function toggleVote(id: string) {
    try {
      const res = await api.post(`/concerns/${id}/vote`)
      const c = concerns.value.find(c => c.id === id || c._id === id)
      if (c) {
        c.voted = res.data.voted
        c.votes = res.data.votes
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // User not logged in — handle in UI
        throw new Error('LOGIN_REQUIRED')
      }
      console.error('Vote error:', error)
    }
  }

  async function addConcern(concern: { title: string; description: string; category: string; location: string; photos?: string[] }) {
    try {
      const res = await api.post('/concerns', concern)
      concerns.value.unshift({
        ...res.data,
        id: res.data._id || res.data.id,
        author: res.data.authorName || 'You',
        voted: false,
      })
      return res.data
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('LOGIN_REQUIRED')
      }
      throw error
    }
  }

  return { concerns, loading, filtered, sortBy, searchQuery, filterStatus, fetchConcerns, toggleVote, addConcern }
})
