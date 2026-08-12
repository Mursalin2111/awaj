<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">🔬 Knowledge</span>
        <h1>Research Lab</h1>
        <p>Open civic problems posted by government ministries with grant-backed funding. Universities and experts can apply.</p>
      </div>
    </div>
    <div class="container page-body">
      <div class="research-layout">
        <div class="research-main">
          <input v-model="search" class="form-input" type="search" placeholder="Search by title or ministry…" id="search-research" @input="debouncedFetch" />
          <div v-if="loading" class="loading-state"><span class="spinner"></span><p>Loading...</p></div>
          <template v-else>
            <p class="results-count">{{ problems.length }} open problem{{ problems.length !== 1 ? 's' : '' }}</p>
            <div class="research-list">
              <div class="research-card card card-body" v-for="r in problems" :key="r.id">
                <div class="res-header">
                  <h3>{{ r.title }}</h3>
                  <span class="grant-badge">{{ r.grant }}</span>
                </div>
                <p class="res-ministry">🏛️ {{ r.ministry }}</p>
                <p class="res-desc">{{ r.desc }}</p>
                <div class="res-footer">
                  <span class="res-applicants">👥 {{ r.applicants }} applicants</span>
                  <div class="res-tags">
                    <span class="badge badge-neutral" v-for="t in r.tags" :key="t">{{ t }}</span>
                  </div>
                  <button class="btn btn-primary btn-sm">Apply Now</button>
                </div>
              </div>
            </div>
          </template>
        </div>
        <aside class="research-sidebar">
          <div class="card card-body sidebar-info">
            <h3>How it works</h3>
            <ul>
              <li>Expert and university review panel</li>
              <li>Phased bKash or bank transfer disbursement</li>
              <li>Milestone verification before next tranche</li>
              <li>Public progress feed for citizens</li>
            </ul>
          </div>
          <div class="card card-body sidebar-info">
            <h3>Public outcomes</h3>
            <ul>
              <li>Project progress feed</li>
              <li>University contribution leaderboard</li>
              <li>Citizen-facing impact summaries</li>
              <li>Open data results under CC BY 4.0</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'

const search = ref('')
const problems = ref<any[]>([])
const loading = ref(true)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedFetch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchResearch(), 300)
}

async function fetchResearch() {
  loading.value = true
  try {
    const res = await api.get('/research', { params: { search: search.value || undefined } })
    problems.value = res.data
  } catch { problems.value = [] }
  finally { loading.value = false }
}

onMounted(() => fetchResearch())
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); max-width: 580px; }
.page-body { padding-block: 2rem 4rem; }
.research-layout { display: grid; gap: 2rem; }
@media (min-width: 900px) { .research-layout { grid-template-columns: 1fr 280px; } }
.research-main { display: flex; flex-direction: column; gap: 1.25rem; }
.results-count { font-size: .85rem; color: var(--color-text-muted); }
.research-list { display: flex; flex-direction: column; gap: 1rem; }
.res-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: .5rem; }
.res-header h3 { font-size: 1rem; font-weight: 700; }
.grant-badge { background: color-mix(in srgb, var(--color-success) 12%, transparent); color: var(--color-success); padding: .25rem .625rem; border-radius: var(--radius-full); font-size: .8rem; font-weight: 700; white-space: nowrap; }
.res-ministry { font-size: .8rem; color: var(--color-text-muted); margin-bottom: .625rem; }
.res-desc { font-size: .875rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: .875rem; }
.res-footer { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
.res-applicants { font-size: .8rem; color: var(--color-text-subtle); }
.res-tags { display: flex; gap: .35rem; flex: 1; }
.sidebar-info { margin-bottom: 1rem; }
.sidebar-info h3 { font-size: .95rem; font-weight: 700; margin-bottom: .75rem; }
.sidebar-info ul { padding-left: 1.1rem; display: flex; flex-direction: column; gap: .5rem; }
.sidebar-info li { font-size: .85rem; color: var(--color-text-muted); line-height: 1.5; }
.loading-state { text-align: center; padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.loading-state p { color: var(--color-text-muted); }
</style>
