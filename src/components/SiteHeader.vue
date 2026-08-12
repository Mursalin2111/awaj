<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <div class="header-pill">
      <!-- Logo -->
      <RouterLink to="/" class="logo" aria-label="Awaz Home">
        <img src="/logo.png" alt="Awaz Logo" class="logo-img" />
        <span class="logo-text">Awaz</span>
        <span class="logo-badge">PRO</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink to="/concerns" class="nav-link" :class="{ active: isActive('/concerns') }">
          <span class="nav-icon">📍</span> Concerns
        </RouterLink>

        <!-- Forum Dropdown -->
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger" @click="toggleDropdown('forum')" :class="{ active: forumOpen || isActive('/forum') || isActive('/collaboration') }">
            <span class="nav-icon">💬</span> Forum
            <svg class="chevron" :class="{ rotate: forumOpen }" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          <Transition name="dropdown-anim">
            <div class="dropdown-menu" v-show="forumOpen">
              <RouterLink to="/forum" class="dropdown-item" @click="forumOpen=false">
                <span class="dropdown-icon">💬</span>
                <div>
                  <p class="dropdown-label">Voice Forum</p>
                  <p class="dropdown-desc">Citizen proposals and debates</p>
                </div>
              </RouterLink>
              <RouterLink to="/collaboration" class="dropdown-item" @click="forumOpen=false">
                <span class="dropdown-icon">🤝</span>
                <div>
                  <p class="dropdown-label">Collaboration</p>
                  <p class="dropdown-desc">Joint citizen-government workspace</p>
                </div>
              </RouterLink>
            </div>
          </Transition>
        </div>

        <!-- Projects Dropdown -->
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger" @click="toggleDropdown('projects')" :class="{ active: projectsOpen || isActive('/projects') || isActive('/dashboard') }">
            <span class="nav-icon">📊</span> Projects
            <svg class="chevron" :class="{ rotate: projectsOpen }" width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          <Transition name="dropdown-anim">
            <div class="dropdown-menu" v-show="projectsOpen">
              <RouterLink to="/projects" class="dropdown-item" @click="projectsOpen=false">
                <span class="dropdown-icon">📊</span>
                <div>
                  <p class="dropdown-label">Project Tracker</p>
                  <p class="dropdown-desc">Track public project progress</p>
                </div>
              </RouterLink>
              <RouterLink to="/dashboard" class="dropdown-item" @click="projectsOpen=false">
                <span class="dropdown-icon">📈</span>
                <div>
                  <p class="dropdown-label">Analytics</p>
                  <p class="dropdown-desc">City health snapshot</p>
                </div>
              </RouterLink>
            </div>
          </Transition>
        </div>

        <RouterLink to="/chatbot" class="nav-link" :class="{ active: isActive('/chatbot') }">
          <span class="nav-icon">🤖</span> AI Bot
        </RouterLink>
        <RouterLink to="/research" class="nav-link" :class="{ active: isActive('/research') }">
          <span class="nav-icon">📚</span> Research
        </RouterLink>
      </nav>

      <!-- Right Header Actions -->
      <div class="header-actions">
        <button class="btn-icon theme-toggle" @click="appStore.toggleTheme()" :aria-label="appStore.isDark ? 'Light mode' : 'Dark mode'">
          <span v-if="appStore.isDark">☀️</span>
          <span v-else>🌙</span>
        </button>

        <RouterLink to="/concerns/submit" class="btn btn-report-glow">+ Report</RouterLink>

        <template v-if="authStore.isLoggedIn">
          <span :class="['role-badge', authStore.user?.role]">
            {{ authStore.user?.role === 'authority' ? '🏛️ Authority' : '👤 Citizen' }}
          </span>
          <span class="user-email">{{ authStore.user?.email }}</span>
          <button class="btn btn-outline-pill" @click="handleLogout">Logout</button>
        </template>
        <RouterLink v-else to="/login" class="btn btn-outline-pill">Log in</RouterLink>

        <button class="btn-icon hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span v-if="!mobileOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>

    <!-- Mobile Floating Navigation Dropdown -->
    <Transition name="mobile-anim">
      <div class="mobile-nav-pill" v-if="mobileOpen">
        <RouterLink to="/" class="mobile-link" @click="mobileOpen=false">🏠 Home</RouterLink>
        <RouterLink to="/concerns" class="mobile-link" @click="mobileOpen=false">📍 Concerns</RouterLink>
        <RouterLink to="/forum" class="mobile-link" @click="mobileOpen=false">💬 Forum</RouterLink>
        <RouterLink to="/collaboration" class="mobile-link" @click="mobileOpen=false">🤝 Collaboration</RouterLink>
        <RouterLink to="/projects" class="mobile-link" @click="mobileOpen=false">📊 Projects</RouterLink>
        <RouterLink to="/chatbot" class="mobile-link" @click="mobileOpen=false">🤖 AI Assistant</RouterLink>
        <RouterLink to="/research" class="mobile-link" @click="mobileOpen=false">📚 Research</RouterLink>
        <RouterLink to="/leaderboard" class="mobile-link" @click="mobileOpen=false">🏆 Leaderboard</RouterLink>
        <RouterLink to="/open-data" class="mobile-link" @click="mobileOpen=false">🌐 Open Data</RouterLink>

        <div class="mobile-actions">
          <RouterLink to="/concerns/submit" class="btn btn-report-glow w-full" @click="mobileOpen=false">+ Report a Concern</RouterLink>
          <template v-if="authStore.isLoggedIn">
            <button class="btn btn-outline-pill w-full" @click="handleLogout(); mobileOpen=false">Logout ({{ authStore.user?.email }})</button>
          </template>
          <RouterLink v-else to="/login" class="btn btn-outline-pill w-full" @click="mobileOpen=false">Log in</RouterLink>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Backdrop overlay -->
  <div v-if="mobileOpen || forumOpen || projectsOpen" class="nav-backdrop" @click="closeAll" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores'
import { useAuthStore } from '../stores/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isScrolled = ref(false)
const mobileOpen = ref(false)
const forumOpen = ref(false)
const projectsOpen = ref(false)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function toggleDropdown(name: string) {
  if (name === 'forum') { forumOpen.value = !forumOpen.value; projectsOpen.value = false }
  if (name === 'projects') { projectsOpen.value = !projectsOpen.value; forumOpen.value = false }
}

function closeAll() {
  mobileOpen.value = false
  forumOpen.value = false
  projectsOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function onScroll() {
  isScrolled.value = window.scrollY > 15
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* Main Floating Header Wrapper — Supaste Style */
.site-header {
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Allows clicks through empty space */
  padding-inline: 1rem;
  box-sizing: border-box;
}

/* Floating Pill Navbar Container */
.header-pill {
  position: relative;
  pointer-events: auto; /* Enable clicks inside header */
  width: min(100%, 1280px);
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-radius: 9999px; /* Supaste Pill Shape */
  background: color-mix(in srgb, var(--color-surface) 85%, transparent);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  border: 1.5px solid color-mix(in srgb, var(--color-border) 60%, rgba(255, 255, 255, 0.18));
  box-shadow:
    0 16px 36px -10px rgba(0, 0, 0, 0.4),
    0 0 35px color-mix(in srgb, var(--color-primary) 16%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: supasteShimmer 4s infinite alternate;
}

/* Scrolled visual elevation */
.site-header.scrolled .header-pill {
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 20px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

@keyframes supasteShimmer {
  0% {
    border-color: color-mix(in srgb, var(--color-border) 70%, rgba(255, 255, 255, 0.1));
  }
  100% {
    border-color: color-mix(in srgb, var(--color-primary) 45%, rgba(255, 255, 255, 0.25));
  }
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--color-text);
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.logo:hover {
  transform: scale(1.03);
}
.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
}
.logo-text {
  letter-spacing: -.03em;
  background: linear-gradient(135deg, var(--color-text) 30%, var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.logo-badge {
  font-size: .62rem;
  font-weight: 800;
  padding: .15rem .45rem;
  border-radius: 99px;
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  letter-spacing: .05em;
}

/* Desktop Nav Items */
.desktop-nav {
  display: none;
  align-items: center;
  gap: .15rem;
  background: color-mix(in srgb, var(--color-surface-2) 40%, transparent);
  padding: .2rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
}
@media (min-width: 960px) {
  .desktop-nav { display: flex; }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .38rem .7rem;
  border-radius: 9999px;
  font-size: .83rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}
.nav-link:hover {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-surface) 80%, transparent);
  transform: translateY(-1px);
}
.nav-link.active {
  background: var(--color-primary);
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 40%, transparent);
}
.nav-icon {
  font-size: .9rem;
}

/* Chevron arrow */
.chevron {
  transition: transform 0.25s ease;
}
.chevron.rotate {
  transform: rotate(180deg);
}

/* Dropdown Menu — Supaste Glass Style */
.nav-dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + .75rem);
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--color-surface) 95%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid color-mix(in srgb, var(--color-border) 80%, rgba(255, 255, 255, 0.2));
  border-radius: 1.25rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
  padding: .6rem;
  min-width: 250px;
  z-index: 200;
}
.dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .65rem .8rem;
  border-radius: .85rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
.dropdown-item:hover {
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface-2));
  transform: translateX(2px);
}
.dropdown-icon { font-size: 1.2rem; flex-shrink: 0; }
.dropdown-label { font-size: .875rem; font-weight: 600; color: var(--color-text); }
.dropdown-desc { font-size: .75rem; color: var(--color-text-muted); margin-top: .1rem; }

/* Right Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: .4rem;
}

.theme-toggle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  background: color-mix(in srgb, var(--color-surface-2) 60%, transparent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  transform: scale(1.08);
  border-color: var(--color-primary);
}

/* Glowing Supaste Call-to-action button */
.btn-report-glow {
  padding: .42rem .95rem;
  border-radius: 9999px;
  font-size: .82rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 80%, #000) 100%);
  border: none;
  box-shadow: 0 4px 18px color-mix(in srgb, var(--color-primary) 45%, transparent);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.btn-report-glow:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 65%, transparent);
}

/* Outline Pill Button */
.btn-outline-pill {
  padding: .38rem .85rem;
  border-radius: 9999px;
  font-size: .8rem;
  font-weight: 600;
  color: var(--color-text);
  border: 1.5px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.btn-outline-pill:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.role-badge {
  font-size: .68rem; font-weight: 700; padding: .2rem .55rem; border-radius: 99px;
  display: inline-flex; align-items: center; white-space: nowrap;
}
.role-badge.authority { background: color-mix(in srgb, var(--color-primary) 18%, transparent); color: var(--color-primary); border: 1px solid var(--color-primary); }
.role-badge.citizen { background: var(--color-surface-2); color: var(--color-text-muted); border: 1px solid var(--color-border); }

.user-email {
  font-size: .75rem;
  color: var(--color-text-muted);
  max-width: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: none;
}
@media (min-width: 1250px) {
  .user-email { display: inline-block; }
}

.hamburger {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
@media (min-width: 960px) {
  .hamburger { display: none; }
}

/* Mobile Pill Navigation Drawer */
.mobile-nav-pill {
  position: absolute;
  top: 72px;
  left: 1rem;
  right: 1rem;
  pointer-events: auto;
  background: color-mix(in srgb, var(--color-surface) 95%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1.5px solid color-mix(in srgb, var(--color-border) 80%, rgba(255, 255, 255, 0.2));
  border-radius: 1.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: .4rem;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
  z-index: 999;
}
.mobile-link {
  display: block;
  padding: .75rem 1rem;
  border-radius: 99px;
  font-size: .95rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
}
.mobile-link:hover, .mobile-link.router-link-active {
  background: var(--color-primary);
  color: #ffffff;
}
.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: .6rem;
  margin-top: .75rem;
  padding-top: .75rem;
  border-top: 1px solid var(--color-border);
}
.w-full { width: 100%; text-align: center; }

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
}

/* Dropdown & Mobile Animations */
.dropdown-anim-enter-active, .dropdown-anim-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-anim-enter-from, .dropdown-anim-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px) scale(0.95);
}

.mobile-anim-enter-active, .mobile-anim-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-anim-enter-from, .mobile-anim-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
</style>
