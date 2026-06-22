import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/concerns', name: 'concerns', component: () => import('../views/ConcernsView.vue') },
    { path: '/concerns/submit', name: 'submit', component: () => import('../views/SubmitView.vue') },
    { path: '/concerns/:id', name: 'concern-detail', component: () => import('../views/ConcernDetailView.vue') },
    { path: '/forum', name: 'forum', component: () => import('../views/ForumView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/research', name: 'research', component: () => import('../views/ResearchView.vue') },
    { path: '/chatbot', name: 'chatbot', component: () => import('../views/ChatbotView.vue') },
    { path: '/collaboration', name: 'collaboration', component: () => import('../views/CollaborationView.vue') },
    { path: '/leaderboard', name: 'leaderboard', component: () => import('../views/LeaderboardView.vue') },
    { path: '/open-data', name: 'open-data', component: () => import('../views/OpenDataView.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
})

export default router
