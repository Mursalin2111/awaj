<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">🤝 Co-Governance</span>
        <h1>Collaborative Decision-Making</h1>
        <p>Citizens, experts, and government authorities work together on solution plans and collaborative threads.</p>
      </div>
    </div>
    <div class="container page-body">
      <div class="collab-stats">
        <div class="cs-card card card-body" v-for="s in stats" :key="s.label">
          <span class="cs-num">{{ s.val }}</span>
          <span class="cs-label">{{ s.label }}</span>
        </div>
      </div>
      <h2 class="section-sub-title">Collaboration Threads</h2>
      <div class="threads-list">
        <div class="thread-card card card-body" v-for="t in threads" :key="t.id">
          <div class="thread-header">
            <h3>{{ t.title }}</h3>
            <span class="badge badge-success">Active</span>
          </div>
          <p class="thread-meta">💬 {{ t.messages }} messages · 👥 {{ t.participants }} participants · 📅 {{ t.date }}</p>
          <p class="thread-desc">{{ t.desc }}</p>
          <button class="btn btn-outline btn-sm">Join Thread →</button>
        </div>
      </div>

      <h2 class="section-sub-title" style="margin-top:2.5rem">Workflow</h2>
      <div class="workflow-steps">
        <div class="wf-step" v-for="(w, i) in workflow" :key="i">
          <div class="wf-num">{{ i + 1 }}</div>
          <p>{{ w }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { val: '8', label: 'Active Threads' },
  { val: '12', label: 'Solution Plans' },
  { val: '5', label: 'Approved Plans' },
]
const threads = [
  { id: 1, title: 'Mirpur Road Repair Coordination', messages: 34, participants: 12, date: '2026-06-15', desc: 'Joint thread between DNCC engineers, local residents, and traffic police to coordinate the Mirpur 1-10 road repair schedule.' },
  { id: 2, title: 'Gulshan Drainage System Overhaul', messages: 28, participants: 9, date: '2026-06-12', desc: 'Collaborative workspace for WASA engineers and environmental experts to plan the Gulshan drainage upgrade.' },
  { id: 3, title: 'Ramna Park Beautification Project', messages: 19, participants: 15, date: '2026-06-10', desc: 'Community-driven thread for planning Ramna Park revitalization with DNCC Parks division and landscape architects.' },
]
const workflow = [
  'Citizens report concerns publicly',
  'Experts submit solution plans',
  'Government approves and assigns',
  'Progress tracked transparently',
]
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); max-width: 580px; }
.page-body { padding-block: 2rem 4rem; }
.collab-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 640px) { .collab-stats { grid-template-columns: 1fr; } }
.cs-card { text-align: center; }
.cs-num { display: block; font-size: 2.25rem; font-weight: 800; color: var(--color-primary); }
.cs-label { display: block; font-size: .8rem; color: var(--color-text-muted); margin-top: .25rem; }
.section-sub-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
.threads-list { display: flex; flex-direction: column; gap: 1rem; }
.thread-card { }
.thread-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .375rem; }
.thread-header h3 { font-size: 1rem; font-weight: 700; }
.thread-meta { font-size: .8rem; color: var(--color-text-muted); margin-bottom: .625rem; }
.thread-desc { font-size: .875rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: .875rem; }
.workflow-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.wf-step { background: var(--color-surface-2); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: .625rem; }
.wf-num { width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); color: #fff; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.wf-step p { font-size: .875rem; color: var(--color-text-muted); }
</style>
