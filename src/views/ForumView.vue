<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">💬 Voice Forum</span>
        <h1>Citizen Forum</h1>
        <p>Propose, discuss, and vote on civic solutions with fellow citizens and experts.</p>
      </div>
    </div>
    <div class="container page-body">
      <div class="forum-toolbar">
        <button class="btn btn-primary">+ New Proposal</button>
        <div class="tab-group">
          <button :class="['tab-btn', { active: tab === 'proposals' }]" @click="tab='proposals'">Proposals</button>
          <button :class="['tab-btn', { active: tab === 'discussions' }]" @click="tab='discussions'">Discussions</button>
        </div>
      </div>
      <div class="proposals-list">
        <div class="card card-body proposal-item" v-for="p in proposals" :key="p.id">
          <div class="proposal-header">
            <div>
              <h3>{{ p.title }}</h3>
              <p class="proposal-meta">by {{ p.author }} · {{ p.date }} · {{ p.comments }} comments</p>
            </div>
            <div class="proposal-votes">
              <button class="vote-pill">▲ {{ p.votes }}</button>
            </div>
          </div>
          <p class="proposal-desc">{{ p.desc }}</p>
          <div class="proposal-tags">
            <span class="badge badge-neutral" v-for="t in p.tags" :key="t">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tab = ref('proposals')
const proposals = [
  { id: 1, title: 'Install solar street lights on Mirpur roads', author: 'Rahim', date: '2026-06-10', votes: 312, comments: 24, desc: 'Proposal to install 50 solar-powered LED streetlights along Mirpur Road 1-10 to reduce electricity costs and improve safety.', tags: ['Infrastructure', 'Energy', 'Safety'] },
  { id: 2, title: 'Create dedicated cycling lanes in Dhanmondi', author: 'Salma', date: '2026-06-08', votes: 278, comments: 31, desc: 'Requesting dedicated cycling lanes along Dhanmondi Lake road to encourage eco-friendly transportation and reduce traffic.', tags: ['Transport', 'Environment'] },
  { id: 3, title: 'Launch weekly waste collection schedule', author: 'Kamal', date: '2026-06-05', votes: 195, comments: 18, desc: 'A consistent, transparent waste collection schedule for each ward to reduce garbage overflow issues across the city.', tags: ['Sanitation', 'Planning'] },
  { id: 4, title: 'Improve drainage before monsoon season', author: 'Nasreen', date: '2026-05-28', votes: 156, comments: 42, desc: 'Urgent proposal to clean and upgrade drainage canals across Dhaka before the June monsoon season begins.', tags: ['Drainage', 'Emergency'] },
]
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); }
.page-body { padding-block: 2rem 4rem; }
.forum-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
.tab-group { display: flex; gap: .25rem; }
.tab-btn { padding: .5rem 1rem; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); background: var(--color-surface-2); font-size: .875rem; font-weight: 500; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-fast); }
.tab-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.proposals-list { display: flex; flex-direction: column; gap: 1rem; }
.proposal-item { }
.proposal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: .75rem; }
.proposal-header h3 { font-size: 1rem; font-weight: 700; margin-bottom: .25rem; }
.proposal-meta { font-size: .8rem; color: var(--color-text-muted); }
.vote-pill { padding: .375rem .875rem; border-radius: var(--radius-full); background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary); font-weight: 700; font-size: .875rem; border: 1.5px solid color-mix(in srgb, var(--color-primary) 25%, transparent); cursor: pointer; white-space: nowrap; transition: all var(--transition-fast); }
.vote-pill:hover { background: var(--color-primary); color: #fff; }
.proposal-desc { font-size: .875rem; color: var(--color-text-muted); margin-bottom: .875rem; line-height: 1.6; }
.proposal-tags { display: flex; gap: .375rem; flex-wrap: wrap; }
</style>
