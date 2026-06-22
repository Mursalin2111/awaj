<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <div class="container header-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo" aria-label="Awaj Home">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="14" fill="currentColor" opacity=".15"/>
            <path d="M7 18 Q14 6 21 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <circle cx="14" cy="19" r="2" fill="currentColor"/>
          </svg>
        </div>
        <span class="logo-text">Awaj</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink to="/concerns" class="nav-link" :class="{ active: isActive('/concerns') }">Concerns</RouterLink>
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger" @click="toggleDropdown('forum')" :class="{ active: forumOpen }">
            Forum
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          <div class="dropdown-menu" v-show="forumOpen">
            <RouterLink to="/forum" class="dropdown-item" @click="forumOpen=false">
              <span class="dropdown-icon">💬</span>
              <div><p class="dropdown-label">Voice Forum</p><p class="dropdown-desc">Citizen proposals and debates</p></div>
            </RouterLink>
            <RouterLink to="/collaboration" class="dropdown-item" @click="forumOpen=false">
              <span class="dropdown-icon">🤝</span>
              <div><p class="dropdown-label">Collaboration</p><p class="dropdown-desc">Joint citizen-government workspace</p></div>
            </RouterLink>
          </div>
        </div>
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger" @click="toggleDropdown('projects')" :class="{ active: projectsOpen }">
            Projects
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>
          </button>
          <div class="dropdown-menu" v-show="projectsOpen">
            <RouterLink to="/projects" class="dropdown-item" @click="projectsOpen=false">
              <span class="dropdown-icon">📊</span>
              <div><p class="dropdown-label">Project Tracker</p><p class="dropdown-desc">Track public project progress</p></div>
            </RouterLink>
            <RouterLink to="/dashboard" class="dropdown-item" @click="projectsOpen=false">
              <span class="dropdown-icon">📈</span>
              <div><p class="dropdown-label">Analytics</p><p class="dropdown-desc">City health snapshot</p></div>
            </RouterLink>
          </div>
        </div>
        <RouterLink to="/chatbot" class="nav-link" :class="{ active: isActive('/chatbot') }">Chatbot</RouterLink>
        <RouterLink to="/research" class="nav-link" :class="{ active: isActive('/research') }">Research</RouterLink>
      </nav>

      <!-- Right actions -->
      <div class="header-actions">
        <button class="btn-icon" @click="appStore.toggleTheme()" :aria-label="appStore.isDark ? 'Light mode' : 'Dark mode'">
          <span v-if="appStore.isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
        <RouterLink to="/concerns/submit" class="btn btn-primary btn-sm">+ Report</RouterLink>
        <RouterLink to="/login" class="btn btn-outline btn-sm">Log in</RouterLink>
        <button class="btn-icon hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span v-if="!mobileOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <Transition name="slide-down">
      <div class="mobile-nav" v-if="mobileOpen">
        <RouterLink to="/" class="mobile-link" @click="mobileOpen=false">Home</RouterLink>
        <RouterLink to="/concerns" class="mobile-link" @click="mobileOpen=false">Concerns</RouterLink>
        <RouterLink to="/forum" class="mobile-link" @click="mobileOpen=false">Forum</RouterLink>
        <RouterLink to="/collaboration" class="mobile-link" @click="mobileOpen=false">Collaboration</RouterLink>
        <RouterLink to="/projects" class="mobile-link" @click="mobileOpen=false">Projects</RouterLink>
        <RouterLink to="/chatbot" class="mobile-link" @click="mobileOpen=false">Chatbot</RouterLink>
        <RouterLink to="/research" class="mobile-link" @click="mobileOpen=false">Research</RouterLink>
        <RouterLink to="/leaderboard" class="mobile-link" @click="mobileOpen=false">Leaderboard</RouterLink>
        <RouterLink to="/open-data" class="mobile-link" @click="mobileOpen=false">Open Data</RouterLink>
        <div class="mobile-actions">
          <RouterLink to="/concerns/submit" class="btn btn-primary" @click="mobileOpen=false">+ Report a Concern</RouterLink>
          <RouterLink to="/login" class="btn btn-outline" @click="mobileOpen=false">Log in</RouterLink>
        </div>
      </div>
    </Transition>
  </header>
  <!-- Backdrop -->
  <div v-if="mobileOpen || forumOpen || projectsOpen" class="nav-backdrop" @click="closeAll" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAppStore } from '../stores'

const appStore = useAppStore()
const route = useRoute()

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

function onScroll() { isScrolled.value = window.scrollY > 12 }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--color-bg) 95%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.site-header.scrolled {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 64px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--color-primary);
  flex-shrink: 0;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}
.logo:hover { opacity: .85; }
.logo-icon { color: var(--color-primary); }
.logo-text { letter-spacing: -.02em; }

/* Desktop nav */
.desktop-nav {
  display: none;
  align-items: center;
  gap: .25rem;
  flex: 1;
  justify-content: center;
}
@media (min-width: 1024px) { .desktop-nav { display: flex; } }

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .5rem .875rem;
  border-radius: var(--radius-md);
  font-size: .875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
.nav-link:hover, .nav-link.active {
  background: var(--color-surface-2);
  color: var(--color-text);
}

/* Dropdown */
.nav-dropdown { position: relative; }
.dropdown-menu {
  position: absolute;
  top: calc(100% + .5rem);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: .5rem;
  min-width: 240px;
  z-index: 200;
}
.dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .625rem .75rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background var(--transition-fast);
}
.dropdown-item:hover { background: var(--color-surface-2); }
.dropdown-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: .1rem; }
.dropdown-label { font-size: .875rem; font-weight: 500; color: var(--color-text); }
.dropdown-desc { font-size: .75rem; color: var(--color-text-muted); margin-top: .1rem; }

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-left: auto;
}
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background var(--transition-fast);
}
.btn-icon:hover { background: var(--color-surface-2); }
.hamburger { display: flex; }
@media (min-width: 1024px) {
  .hamburger { display: none; }
  .header-actions .btn { display: inline-flex; }
}

/* Mobile nav */
.mobile-nav {
  position: absolute;
  top: 64px;
  left: 0; right: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: .25rem;
  z-index: 99;
}
.mobile-link {
  display: block;
  padding: .75rem 1rem;
  border-radius: var(--radius-md);
  font-size: .95rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.mobile-link:hover, .mobile-link.router-link-active {
  background: var(--color-surface-2);
  color: var(--color-text);
}
.mobile-actions { display: flex; flex-direction: column; gap: .5rem; margin-top: .75rem; padding-top: .75rem; border-top: 1px solid var(--color-border); }

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
}

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
