<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">📊 Government</span>
        <h1>Project Tracker</h1>
        <p>Monitor ongoing civic infrastructure projects — budgets, milestones, and real-time progress across all government departments.</p>
      </div>
    </div>
    <div class="container page-body">
      <!-- Stats -->
      <div class="proj-stats">
        <div class="ps-card card card-body" v-for="s in stats" :key="s.label">
          <span class="ps-num" :style="{ color: s.color }">{{ s.val }}</span>
          <span class="ps-label">{{ s.label }}</span>
        </div>
      </div>
      <!-- Filter -->
      <div class="proj-filter">
        <button v-for="f in filters" :key="f" :class="['filter-btn', { active: activeFilter === f }]" @click="activeFilter = f">{{ f }}</button>
      </div>
      <!-- Projects -->
      <div class="proj-grid">
        <div class="project-card card card-body" v-for="p in filteredProjects" :key="p.id">
          <div class="proj-header">
            <span :class="['badge', p.statusClass]">{{ p.status }}</span>
            <span class="proj-deadline">📅 {{ p.deadline }}</span>
          </div>
          <h3>{{ p.name }}</h3>
          <p class="proj-owner">🏛️ {{ p.owner }}</p>
          <div class="proj-progress">
            <div class="prog-bar">
              <div class="prog-fill" :style="{ width: p.progress + '%' }"></div>
            </div>
            <span class="prog-pct">{{ p.progress }}%</span>
          </div>
          <div class="proj-budget">
            <span>💰 Allocated: {{ p.allocated }}</span>
            <span>Spent: {{ p.spent }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const activeFilter = ref('All')
const filters = ['All', 'In Progress', 'Planning', 'Completed']
const stats = [
  { val: '24', label: 'Total Projects', color: 'var(--color-primary)' },
  { val: '14', label: 'Active', color: 'var(--color-success)' },
  { val: '6', label: 'Completed', color: 'var(--color-info)' },
  { val: '67%', label: 'Avg Progress', color: 'var(--color-accent)' },
]
const projects = [
  { id: 1, name: 'Mirpur Road Resurfacing Phase II', owner: 'DNCC Road Division', status: 'In Progress', statusClass: 'badge-success', progress: 72, deadline: '2026-09-30', allocated: '৳2.4Cr', spent: '৳1.7Cr', category: 'In Progress' },
  { id: 2, name: 'Gulshan Drainage Canal Upgrade', owner: 'WASA Dhaka', status: 'Planning', statusClass: 'badge-info', progress: 18, deadline: '2026-12-31', allocated: '৳5.1Cr', spent: '৳0.9Cr', category: 'Planning' },
  { id: 3, name: 'Dhanmondi Lake Revitalization', owner: 'DNCC Parks', status: 'Completed', statusClass: 'badge-neutral', progress: 100, deadline: '2026-04-15', allocated: '৳1.2Cr', spent: '৳1.18Cr', category: 'Completed' },
  { id: 4, name: 'Ramna Park Solar Lighting', owner: 'DNCC Energy', status: 'In Progress', statusClass: 'badge-success', progress: 55, deadline: '2026-08-15', allocated: '৳0.8Cr', spent: '৳0.44Cr', category: 'In Progress' },
  { id: 5, name: 'Old Dhaka Drainage Network', owner: 'DSCC Engineering', status: 'Planning', statusClass: 'badge-info', progress: 8, deadline: '2027-03-01', allocated: '৳8.7Cr', spent: '৳0.7Cr', category: 'Planning' },
  { id: 6, name: 'Mohakhali Flyover Repair', owner: 'RHD Dhaka', status: 'Completed', statusClass: 'badge-neutral', progress: 100, deadline: '2026-03-01', allocated: '৳3.5Cr', spent: '৳3.48Cr', category: 'Completed' },
]
const filteredProjects = computed(() => activeFilter.value === 'All' ? projects : projects.filter(p => p.category === activeFilter.value))
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); max-width: 580px; }
.page-body { padding-block: 2rem 4rem; }
.proj-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 640px) { .proj-stats { grid-template-columns: repeat(2, 1fr); } }
.ps-card { text-align: center; }
.ps-num { display: block; font-size: 2rem; font-weight: 800; letter-spacing: -.02em; }
.ps-label { display: block; font-size: .8rem; color: var(--color-text-muted); margin-top: .25rem; }
.proj-filter { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.filter-btn { padding: .5rem 1rem; border-radius: var(--radius-full); border: 1.5px solid var(--color-border); background: var(--color-surface-2); font-size: .85rem; font-weight: 500; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-fast); }
.filter-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
.proj-grid { display: grid; gap: 1.25rem; }
@media (min-width: 768px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .proj-grid { grid-template-columns: repeat(3, 1fr); } }
.proj-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .75rem; }
.proj-deadline { font-size: .75rem; color: var(--color-text-subtle); }
.project-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: .375rem; }
.proj-owner { font-size: .8rem; color: var(--color-text-muted); margin-bottom: 1rem; }
.proj-progress { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
.prog-bar { flex: 1; height: 8px; background: var(--color-surface-2); border-radius: var(--radius-full); overflow: hidden; }
.prog-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light)); border-radius: var(--radius-full); transition: width .6s ease; }
.prog-pct { font-size: .8rem; font-weight: 700; color: var(--color-primary); min-width: 36px; text-align: right; }
.proj-budget { display: flex; justify-content: space-between; font-size: .8rem; color: var(--color-text-muted); }
</style>
