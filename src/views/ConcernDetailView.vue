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
            <span>👤 {{ concern.authorName || concern.author }}</span>
            <span>📅 {{ concern.createdAt }}</span>
          </div>
          <div class="detail-desc">
            <p>{{ concern.description }}</p>
          </div>

          <!-- Photo Gallery (Supabase Storage Evidence Images) -->
          <div class="detail-gallery">
            <h3>📷 Evidence Photos ({{ concern.photos?.length || 0 }})</h3>
            <div v-if="concern.photos && concern.photos.length > 0" class="gallery-grid">
              <div
                v-for="(photo, idx) in concern.photos"
                :key="idx"
                class="gallery-item"
                @click="!brokenPhotos[idx] && (activeModalPhoto = photo)"
              >
                <img
                  v-if="!brokenPhotos[idx]"
                  :src="photo"
                  :alt="`Evidence photo ${Number(idx) + 1}`"
                  @error="handleImgError(idx)"
                />
                <div v-else class="broken-img-placeholder">
                  <span>⚠️</span>
                  <p>Image unavailable</p>
                </div>
              </div>
            </div>
            <div v-else class="no-evidence-box">
              <span>🖼️</span>
              <p>No evidence photos attached to this concern report.</p>
            </div>
          </div>

          <!-- Vote -->
          <button
            :class="['vote-btn-lg', { voted: concern.voted }]"
            @click="handleVote"
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
                  <div class="tl-line" v-if="Number(i) < concern.updates.length - 1"></div>
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
          <!-- Authority Action Panel -->
          <div v-if="authStore.user?.role === 'authority' || authStore.user?.role === 'admin'" class="sidebar-card card card-body authority-panel">
            <h3>🏛️ Authority Action Panel</h3>
            <p class="authority-sub">Update official status & notify citizen.</p>
            
            <div class="form-group" style="margin-top:.75rem">
              <label class="form-label">Change Status</label>
              <select v-model="authorityStatus" class="form-select">
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div class="form-group" style="margin-top:.5rem">
              <label class="form-label">Official Progress Note</label>
              <textarea
                v-model="authorityNote"
                class="form-textarea"
                rows="3"
                placeholder="e.g. Municipal inspection team dispatched..."
              ></textarea>
            </div>

            <button
              class="btn btn-primary btn-sm"
              style="width:100%; justify-content:center; margin-top:.75rem"
              :disabled="updatingStatus"
              @click="handleStatusUpdate"
            >
              <span v-if="updatingStatus" class="spinner"></span>
              <span v-else>Update Status & Notify</span>
            </button>
          </div>

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
    <!-- Loading -->
    <div class="loading-state" v-else-if="loading">
      <span class="spinner"></span>
      <p>Loading concern...</p>
    </div>
    <div class="not-found" v-else>
      <p>Concern not found. It may have been removed or does not exist.</p>
      <RouterLink to="/concerns" class="btn btn-primary">← Back to Concerns</RouterLink>
    </div>
    <!-- Lightbox Modal -->
    <Transition name="fade">
      <div v-if="activeModalPhoto" class="lightbox-backdrop" @click="activeModalPhoto = null">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="activeModalPhoto = null">✕</button>
          <img :src="activeModalPhoto" alt="Enlarged photo" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const concern = ref<any>(null)
const loading = ref(true)
const activeModalPhoto = ref<string | null>(null)
const brokenPhotos = ref<Record<number, boolean>>({})

function handleImgError(index: number) {
  brokenPhotos.value[index] = true
}

const authorityStatus = ref('submitted')
const authorityNote = ref('')
const updatingStatus = ref(false)

async function fetchConcern() {
  loading.value = true
  try {
    const res = await api.get(`/concerns/${route.params.id}`)
    concern.value = { ...res.data, id: res.data._id || res.data.id }
    if (concern.value?.status) {
      authorityStatus.value = concern.value.status
    }
  } catch (err: any) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      toast.show('Access Denied: You can only view concerns reported by your own account.', 'error')
      router.push('/concerns')
    } else {
      concern.value = null
    }
  } finally {
    loading.value = false
  }
}

async function handleStatusUpdate() {
  if (!concern.value) return
  updatingStatus.value = true
  try {
    await api.post(`/concerns/${concern.value.id}/status`, {
      status: authorityStatus.value,
      note: authorityNote.value
    })
    toast.show('Official status updated and citizen notified!', 'success')
    authorityNote.value = ''
    await fetchConcern()
  } catch (error: any) {
    toast.show(error.response?.data?.error || 'Failed to update status', 'error')
  } finally {
    updatingStatus.value = false
  }
}

async function handleVote() {
  if (!authStore.isLoggedIn) {
    toast.show('Please log in to vote', 'info')
    router.push('/login')
    return
  }
  try {
    const res = await api.post(`/concerns/${concern.value.id}/vote`)
    concern.value.voted = res.data.voted
    concern.value.votes = res.data.votes
  } catch (error: any) {
    toast.show('Failed to vote', 'error')
  }
}

function formatStatus(s: string) {
  return { submitted: 'Submitted', under_review: 'Under Review', resolved: 'Resolved', rejected: 'Rejected' }[s] ?? s
}
function statusBadge(s: string) {
  return { submitted: 'badge-info', under_review: 'badge-warning', resolved: 'badge-success', rejected: 'badge-danger' }[s] ?? 'badge-neutral'
}

onMounted(() => fetchConcern())
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

.detail-grid { display: grid; gap: 2rem; }
@media (min-width: 900px) { .detail-grid { grid-template-columns: 1fr 300px; } }

.detail-meta-top { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .875rem; }
.detail-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -.02em; margin-bottom: .875rem; line-height: 1.3; }
.detail-info { display: flex; flex-wrap: wrap; gap: .75rem; margin-bottom: 1.25rem; }
.detail-info span { font-size: .85rem; color: var(--color-text-muted); }
.detail-desc { background: var(--color-surface-2); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; }
.detail-desc p { font-size: .95rem; color: var(--color-text); line-height: 1.75; }

.vote-btn-lg {
  display: inline-flex; align-items: center; gap: .625rem;
  padding: .875rem 1.75rem; border-radius: var(--radius-full);
  border: 2px solid var(--color-border); background: var(--color-surface-2);
  cursor: pointer; font-size: 1rem; font-weight: 700; color: var(--color-text-muted);
  transition: all var(--transition-fast); margin-bottom: 2rem;
}
.vote-btn-lg:hover { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, transparent); }
.vote-btn-lg.voted { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 12%, transparent); }
.vote-num { background: var(--color-primary); color: #fff; padding: .15rem .5rem; border-radius: var(--radius-full); font-size: .875rem; }

.updates-section h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: .25rem; display: flex; align-items: center; gap: .5rem; }
.live-badge { font-size: .75rem; }
.updates-sub { font-size: .8rem; color: var(--color-text-muted); margin-bottom: 1.25rem; }

.timeline-list { display: flex; flex-direction: column; }
.tl-entry { display: flex; gap: .875rem; }
.tl-dot-wrap { display: flex; flex-direction: column; align-items: center; }
.tl-dot {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 700; color: #fff; flex-shrink: 0;
  background: var(--color-border); outline: 3px solid var(--color-bg);
}
.tl-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.tl-submitted { background: var(--color-text-subtle); }
.tl-under_review { background: var(--color-warning); }
.tl-resolved { background: var(--color-success); }
.tl-line { flex: 1; width: 2px; background: var(--color-border); margin-block: .25rem; min-height: 20px; }
.tl-content { padding-bottom: 1.25rem; }
.tl-note { font-size: .875rem; color: var(--color-text); margin-block: .25rem; }
.tl-date { font-size: .75rem; color: var(--color-text-subtle); }

.sidebar-card { margin-bottom: 1rem; }
.sidebar-card h3 { font-size: .95rem; font-weight: 700; }

.authority-panel {
  border: 1.5px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
}
.authority-sub { font-size: .75rem; color: var(--color-text-muted); margin-top: .2rem; }

.sidebar-stats { display: flex; gap: 1.5rem; margin-top: .75rem; }
.ss-item { display: flex; flex-direction: column; }
.ss-num { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
.ss-label { font-size: .75rem; color: var(--color-text-muted); }

.loading-state { text-align: center; padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.loading-state p { color: var(--color-text-muted); }
.not-found { text-align: center; padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

.detail-gallery { margin-block: 1.5rem; }
.detail-gallery h3 { font-size: 1rem; font-weight: 700; margin-bottom: .75rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
.gallery-item { aspect-ratio: 4/3; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); cursor: pointer; transition: transform var(--transition-fast); position: relative; background: var(--color-surface-2); }
.gallery-item:hover { transform: scale(1.03); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }

.broken-img-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 100%; height: 100%; background: var(--color-surface-2); color: var(--color-text-muted);
  font-size: .8rem; gap: .25rem; text-align: center; padding: .5rem;
}

.no-evidence-box {
  display: flex; align-items: center; gap: .75rem;
  padding: 1rem 1.25rem; border-radius: var(--radius-lg);
  background: var(--color-surface-2); border: 1px dashed var(--color-border);
  color: var(--color-text-muted); font-size: .875rem;
}

.lightbox-backdrop {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px); z-index: 1000; display: flex;
  align-items: center; justify-content: center; padding: 2rem;
}
.lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; }
.lightbox-content img { max-width: 100%; max-height: 85vh; border-radius: var(--radius-lg); object-fit: contain; }
.lightbox-close {
  position: absolute; top: -40px; right: 0; background: none;
  border: none; color: #fff; font-size: 1.5rem; cursor: pointer;
}
</style>
