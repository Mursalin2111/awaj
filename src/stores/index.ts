import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

// Concerns mock store
export interface Concern {
  id: string
  title: string
  description: string
  category: string
  status: 'submitted' | 'under_review' | 'resolved' | 'rejected'
  votes: number
  voted: boolean
  location: string
  createdAt: string
  author: string
  photos: string[]
  updates: Array<{ date: string; note: string; status: string }>
}

export const useConcernsStore = defineStore('concerns', () => {
  const concerns = ref<Concern[]>([
    {
      id: '1',
      title: 'Broken streetlight on Mirpur 10',
      description: 'The main streetlight at the intersection of Mirpur 10 circle has been broken for over a month. This poses a safety hazard at night especially for pedestrians and cyclists.',
      category: 'Streetlights',
      status: 'under_review',
      votes: 142,
      voted: false,
      location: 'Mirpur 10, Dhaka',
      createdAt: '2026-06-01',
      author: 'Rahim Uddin',
      photos: [],
      updates: [
        { date: '2026-06-05', note: 'Assigned to City Corporation Ward 12 desk.', status: 'under_review' },
        { date: '2026-06-01', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
    {
      id: '2',
      title: 'Large pothole near Dhanmondi Lake',
      description: 'There is a massive pothole on Rd-27, near Dhanmondi Lake entrance. Several motorcycles have already been damaged. The pothole is about 1 meter wide and very deep.',
      category: 'Roads & Potholes',
      status: 'resolved',
      votes: 289,
      voted: false,
      location: 'Dhanmondi Road 27, Dhaka',
      createdAt: '2026-05-15',
      author: 'Salma Begum',
      photos: [],
      updates: [
        { date: '2026-05-28', note: 'Pothole was patched by the road maintenance team.', status: 'resolved' },
        { date: '2026-05-18', note: 'Assigned to DNCC maintenance unit.', status: 'under_review' },
        { date: '2026-05-15', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
    {
      id: '3',
      title: 'Garbage overflow at Banani market',
      description: 'The waste bins near Banani market are overflowing and garbage has spilled onto the sidewalk. This is creating unsanitary conditions and a terrible smell.',
      category: 'Waste & Sanitation',
      status: 'submitted',
      votes: 87,
      voted: false,
      location: 'Banani Market, Dhaka',
      createdAt: '2026-06-10',
      author: 'Kamal Hossain',
      photos: [],
      updates: [
        { date: '2026-06-10', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
    {
      id: '4',
      title: 'Water logging in Gulshan 2 after rain',
      description: 'Every time it rains, Gulshan Avenue near Gulshan 2 circle gets severely waterlogged. The drainage system appears completely blocked. Cars and rickshaws get stuck.',
      category: 'Water & Drainage',
      status: 'under_review',
      votes: 203,
      voted: false,
      location: 'Gulshan 2 Circle, Dhaka',
      createdAt: '2026-05-20',
      author: 'Nasreen Akter',
      photos: [],
      updates: [
        { date: '2026-05-25', note: 'WASA engineers scheduled for site inspection.', status: 'under_review' },
        { date: '2026-05-20', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
    {
      id: '5',
      title: 'Illegal parking blocking emergency exit',
      description: 'Vehicles are being illegally parked in front of the emergency exit of Dhaka Medical College Hospital. Ambulances cannot pass during peak hours.',
      category: 'Public Safety',
      status: 'resolved',
      votes: 175,
      voted: false,
      location: 'Dhaka Medical College, Dhaka',
      createdAt: '2026-05-10',
      author: 'Dr. Farhan Ali',
      photos: [],
      updates: [
        { date: '2026-05-17', note: 'Police deployed. No-parking signs installed.', status: 'resolved' },
        { date: '2026-05-12', note: 'Escalated to traffic police authority.', status: 'under_review' },
        { date: '2026-05-10', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
    {
      id: '6',
      title: 'Diseased trees in Ramna Park need attention',
      description: 'Several large trees in Ramna Park appear to have disease affecting their branches. Dead branches have been falling. Risk of injury to park visitors.',
      category: 'Parks & Spaces',
      status: 'submitted',
      votes: 64,
      voted: false,
      location: 'Ramna Park, Dhaka',
      createdAt: '2026-06-08',
      author: 'Tahmina Islam',
      photos: [],
      updates: [
        { date: '2026-06-08', note: 'Concern reported by verified citizen.', status: 'submitted' },
      ],
    },
  ])

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

  function toggleVote(id: string) {
    const c = concerns.value.find(c => c.id === id)
    if (c) {
      c.voted = !c.voted
      c.votes += c.voted ? 1 : -1
    }
  }

  function addConcern(concern: Omit<Concern, 'id' | 'votes' | 'voted' | 'updates'>) {
    concerns.value.unshift({
      ...concern,
      id: Date.now().toString(),
      votes: 0,
      voted: false,
      updates: [{ date: new Date().toISOString().split('T')[0], note: 'Concern reported by verified citizen.', status: 'submitted' }],
    })
  }

  return { concerns, filtered, sortBy, searchQuery, filterStatus, toggleVote, addConcern }
})
