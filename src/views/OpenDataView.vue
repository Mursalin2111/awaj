<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">📂 Transparency</span>
        <h1>Open Data Portal</h1>
        <p>Access civic data and research datasets under CC BY 4.0 license.</p>
      </div>
    </div>
    <div class="container page-body">
      <!-- Tabs -->
      <div class="od-tabs">
        <button v-for="t in tabs" :key="t.key" :class="['tab-btn', { active: activeTab === t.key }]" @click="activeTab = t.key">{{ t.label }}</button>
      </div>

      <!-- Stats tab -->
      <div v-if="activeTab === 'stats'">
        <h2 class="od-section-title">Platform Statistics</h2>
        <div class="stats-grid">
          <div class="stat-box card card-body" v-for="s in platformStats" :key="s.label">
            <span class="stat-box-icon">{{ s.icon }}</span>
            <span class="stat-box-num">{{ s.val }}</span>
            <span class="stat-box-label">{{ s.label }}</span>
          </div>
        </div>
      </div>

      <!-- Concerns tab -->
      <div v-if="activeTab === 'concerns'">
        <div class="od-header">
          <h2 class="od-section-title">Top Concerns by Votes</h2>
          <button class="btn btn-outline btn-sm" @click="downloadJson">⬇ Download JSON</button>
        </div>
        <div class="od-table">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Votes</th></tr></thead>
            <tbody>
              <tr v-for="c in concerns" :key="c.id">
                <td>{{ c.title }}</td>
                <td><span class="badge badge-neutral">{{ c.category }}</span></td>
                <td><span :class="['badge', statusBadge(c.status)]">{{ c.status }}</span></td>
                <td class="votes-cell">{{ c.votes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- API tab -->
      <div v-if="activeTab === 'api'">
        <h2 class="od-section-title">API Documentation</h2>
        <div class="api-docs card card-body">
          <p class="api-label">License: <strong>CC BY 4.0</strong></p>
          <p class="api-label">All data is available under Creative Commons Attribution 4.0 International</p>
          <h4>Endpoints</h4>
          <div class="endpoints">
            <div class="endpoint" v-for="e in endpoints" :key="e.path">
              <span class="method" :class="e.method.toLowerCase()">{{ e.method }}</span>
              <code>{{ e.path }}</code>
              <span class="ep-desc">{{ e.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConcernsStore } from '../stores'

const store = useConcernsStore()
const concerns = store.concerns.slice().sort((a, b) => b.votes - a.votes).slice(0, 8)

const activeTab = ref('stats')
const tabs = [
  { key: 'stats', label: '📊 Stats' },
  { key: 'concerns', label: '📋 Concerns' },
  { key: 'api', label: '🔌 API Docs' },
]
const platformStats = [
  { icon: '⚠️', val: '1,247', label: 'Total Concerns' },
  { icon: '💬', val: '384', label: 'Proposals' },
  { icon: '🔬', val: '56', label: 'Research Problems' },
  { icon: '🏆', val: '128', label: 'Awards Given' },
  { icon: '👍', val: '8.4', label: 'Avg Concern Votes' },
  { icon: '✅', val: '67%', label: 'Resolution Rate' },
]
const endpoints = [
  { method: 'GET', path: '/api/concerns', desc: 'List all concerns' },
  { method: 'GET', path: '/api/concerns/:id', desc: 'Get a specific concern' },
  { method: 'POST', path: '/api/concerns', desc: 'Create a new concern' },
  { method: 'GET', path: '/api/proposals', desc: 'List proposals' },
  { method: 'GET', path: '/api/open-data', desc: 'Full dataset (CC-BY 4.0)' },
  { method: 'GET', path: '/api/statistics', desc: 'Platform statistics' },
]

function statusBadge(s: string) {
  return { submitted: 'badge-info', under_review: 'badge-warning', resolved: 'badge-success', rejected: 'badge-danger' }[s] ?? 'badge-neutral'
}

function downloadJson() {
  const data = JSON.stringify(concerns, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'awaj-concerns.json'; a.click()
}
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); }
.page-body { padding-block: 2rem 4rem; }
.od-tabs { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 2rem; }
.tab-btn { padding: .5rem 1rem; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); background: var(--color-surface-2); font-size: .875rem; font-weight: 500; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-fast); }
.tab-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.od-section-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; }
.od-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.od-header .od-section-title { margin-bottom: 0; }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-box { text-align: center; }
.stat-box-icon { font-size: 1.5rem; display: block; margin-bottom: .375rem; }
.stat-box-num { display: block; font-size: 1.75rem; font-weight: 800; color: var(--color-primary); }
.stat-box-label { display: block; font-size: .8rem; color: var(--color-text-muted); margin-top: .25rem; }

.od-table { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .875rem; }
th { text-align: left; padding: .75rem 1rem; font-size: .75rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .05em; border-bottom: 1.5px solid var(--color-border); }
td { padding: .875rem 1rem; border-bottom: 1px solid var(--color-border-light); vertical-align: middle; }
tr:hover td { background: var(--color-surface-2); }
.votes-cell { font-weight: 700; color: var(--color-primary); }

.api-docs h4 { margin-block: 1rem .75rem; font-size: 1rem; }
.api-label { font-size: .875rem; color: var(--color-text-muted); margin-bottom: .375rem; }
.endpoints { display: flex; flex-direction: column; gap: .625rem; }
.endpoint { display: flex; align-items: center; gap: .75rem; padding: .625rem .875rem; background: var(--color-surface-2); border-radius: var(--radius-md); flex-wrap: wrap; }
.method { padding: .2rem .5rem; border-radius: 4px; font-size: .7rem; font-weight: 700; letter-spacing: .05em; }
.method.get { background: #dcfce7; color: #15803d; }
.method.post { background: #dbeafe; color: #1d4ed8; }
[data-theme="dark"] .method.get { background: #14532d; color: #4ade80; }
[data-theme="dark"] .method.post { background: #1e3a5f; color: #60a5fa; }
code { font-size: .8rem; font-family: monospace; color: var(--color-primary); }
.ep-desc { font-size: .8rem; color: var(--color-text-muted); }
</style>
