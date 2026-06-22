<template>
  <div class="detail-page">
    <div class="container detail-body" v-if="concern">
      <RouterLink to="/concerns" class="back-link">← Back to Concerns</RouterLink>

      <div class="detail-grid">
        <!-- Main -->
        <div class="detail-main">
          <div class="detail-meta-top">
            <span :class="['badge', statusBadge(concern.status)]">{{ formatStatus(concern.status) }}</span>
            <span class="badge badge-neutral">{{ concern.category }}</span>
          </div>
          <h1 class="detail-title">{{ concern.title }}</h1>
          <div class="detail-info">
            <span>📍 {{ concern.location }}</span>
            <span>👤 {{ concern.author }}</span>
            <span>📅 {{ concern.createdAt }}</span>
          </div>
          <div class="detail-desc">
            <p>{{ concern.description }}</p>
          </div>

          <!-- Vote -->
          <button
            :class="['vote-btn-lg', { voted: concern.voted }]"
            @click="store.toggleVote(concern.id)"
            :id="`vote-detail-${concern.id}`"
          >
            <span>👍</span>
            <span>{{ concern.voted ? 'Upvoted' : 'Upvote' }}</span>
            <span class="vote-num">{{ concern.votes }}</span>
          </button>

          <!-- Timeline updates -->
          <div class="updates-section">
            <h2>Status Timeline <span class="live-badge">🔴 Live</span></h2>
            <p class="updates-sub">Live updates from authorities</p>
            <div class="timeline-list">
              <div class="tl-entry" v-for="(u, i) in concern.updates" :key="i">
                <div class="tl-dot-wrap">
                  <div :class="['tl-dot', `tl-${u.status}`]">
                    <span v-if="u.status === 'resolved'">✓</span>
                    <span v-else class="tl-dot-inner"></span>
                  </div>
                  <div class="tl-line" v-if="i < concern.updates.length - 1"></div>
                </div>
                <div class="tl-content">
                  <span :class="['badge', statusBadge(u.status)]">{{ formatStatus(u.status) }}</span>
                  <p class="tl-note">{{ u.note }}</p>
                  <span class="tl-date">{{ u.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="detail-sidebar">
          <div class="sidebar-card card card-body">
            <h3>Quick Actions</h3>
            <RouterLink to="/concerns/submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:.75rem">
              + Report Similar
            </RouterLink>
            <RouterLink to="/concerns" class="btn btn-outline" style="width:100%; justify-content:center; margin-top:.5rem">
              Browse All Concerns
            </RouterLink>
          </div>
          <div class="sidebar-card card card-body">
            <h3>Stats</h3>
            <div class="sidebar-stats">
              <div class="ss-item">
                <span class="ss-num">{{ concern.votes }}</span>
                <span class="ss-label">Upvotes</span>
              </div>
              <div class="ss-item">
                <span class="ss-num">{{ concern.updates.length }}</span>
                <span class="ss-label">Updates</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    <div class="not-found" v-else>
      <p>Concern not found. It may have been removed or does not exist.</p>
      <RouterLink to="/concerns" class="btn btn-primary">← Back to Concerns</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useConcernsStore } from '../stores'

const route = useRoute()
const store = useConcernsStore()
const concern = computed(() => store.concerns.find(c => c.id === route.params.id as string))

function formatStatus(s: string) {
  return { submitted: 'Submitted', under_review: 'Under Review', resolved: 'Resolved', rejected: 'Rejected' }[s] ?? s
}
function statusBadge(s: string) {
  return { submitted: 'badge-info', under_review: 'badge-warning', resolved: 'badge-success', rejected: 'badge-danger' }[s] ?? 'badge-neutral'
}
</script>

<style scoped>
.detail-page { padding-block: 2rem; }
.detail-body { max-width: 1100px; }
.back-link {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: .875rem; font-weight: 500; color: var(--color-text-muted);
  text-decoration: none; margin-bottom: 1.5rem;
  transition: color var(--transition-fast);
}
.back-link:hover { color: var(--color-primary); }

.detail-grid {
  display: grid;
  gap: 2rem;
}
@media (min-width: 900px) { .detail-grid { grid-template-columns: 1fr 300px; } }

.detail-meta-top { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .875rem; }
.detail-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -.02em; margin-bottom: .875rem; line-height: 1.3; }
.detail-info { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.25rem; }
.detail-info span { font-size: .85rem; color: var(--color-text-muted); }
.detail-desc { background: var(--color-surface-2); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; }
.detail-desc p { font-size: .95rem; color: var(--color-text); line-height: 1.75; }

.vote-btn-lg {
  display: inline-flex; align-items: center; gap: .625rem;
  padding: .875rem 1.75rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-border);
  background: var(--color-surface-2);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
  margin-bottom: 2rem;
}
.vote-btn-lg:hover { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, transparent); }
.vote-btn-lg.voted { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 12%, transparent); }
.vote-num { background: var(--color-primary); color: #fff; padding: .15rem .5rem; border-radius: var(--radius-full); font-size: .875rem; }

/* Updates */
.updates-section h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: .25rem; display: flex; align-items: center; gap: .5rem; }
.live-badge { font-size: .75rem; }
.updates-sub { font-size: .8rem; color: var(--color-text-muted); margin-bottom: 1.25rem; }

.timeline-list { display: flex; flex-direction: column; }
.tl-entry { display: flex; gap: .875rem; }
.tl-dot-wrap { display: flex; flex-direction: column; align-items: center; }
.tl-dot {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 700; color: #fff;
  flex-shrink: 0;
  background: var(--color-border);
  outline: 3px solid var(--color-bg);
}
.tl-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.tl-submitted { background: var(--color-text-subtle); }
.tl-under_review { background: var(--color-warning); }
.tl-resolved { background: var(--color-success); }
.tl-line { flex: 1; width: 2px; background: var(--color-border); margin-block: .25rem; min-height: 20px; }
.tl-content { padding-bottom: 1.25rem; }
.tl-note { font-size: .875rem; color: var(--color-text); margin-block: .25rem; }
.tl-date { font-size: .75rem; color: var(--color-text-subtle); }

/* Sidebar */
.sidebar-card { margin-bottom: 1rem; }
.sidebar-card h3 { font-size: .95rem; font-weight: 700; }
.sidebar-stats { display: flex; gap: 1.5rem; margin-top: .75rem; }
.ss-item { display: flex; flex-direction: column; }
.ss-num { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
.ss-label { font-size: .75rem; color: var(--color-text-muted); }

.not-found { text-align: center; padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
</style>
