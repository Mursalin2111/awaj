<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">🏆 Community</span>
        <h1>University Leaderboard</h1>
        <p>Universities and research institutions ranked by their civic contributions — solved concerns, accepted research, and aggregate impact score.</p>
      </div>
    </div>
    <div class="container page-body">
      <div class="leaderboard-list">
        <div :class="['lb-card card card-body', { 'lb-top': i < 3 }]" v-for="(u, i) in universities" :key="u.id">
          <div class="lb-rank" :class="rankClass(i)">{{ i + 1 }}</div>
          <div class="lb-info">
            <h3>{{ u.name }}</h3>
            <p class="lb-location">{{ u.location }}</p>
          </div>
          <div class="lb-stats">
            <div class="lb-stat">
              <span class="lb-stat-num">{{ u.impact }}</span>
              <span class="lb-stat-label">Impact</span>
            </div>
            <div class="lb-stat">
              <span class="lb-stat-num">{{ u.solved }}</span>
              <span class="lb-stat-label">Solved</span>
            </div>
            <div class="lb-stat">
              <span class="lb-stat-num">{{ u.research }}</span>
              <span class="lb-stat-label">Research</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const universities = [
  { id: 1, name: 'BUET — Bangladesh University of Engineering & Technology', location: 'Dhaka', impact: 4850, solved: 28, research: 14 },
  { id: 2, name: 'University of Dhaka', location: 'Dhaka', impact: 4120, solved: 22, research: 11 },
  { id: 3, name: 'BRAC University', location: 'Dhaka', impact: 3680, solved: 19, research: 9 },
  { id: 4, name: 'Jahangirnagar University', location: 'Savar, Dhaka', impact: 2940, solved: 15, research: 7 },
  { id: 5, name: 'North South University', location: 'Dhaka', impact: 2510, solved: 13, research: 6 },
  { id: 6, name: 'Khulna University of Engineering & Technology', location: 'Khulna', impact: 1980, solved: 11, research: 5 },
]
function rankClass(i: number) {
  return i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'rank-default'
}
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); max-width: 580px; }
.page-body { padding-block: 2rem 4rem; }
.leaderboard-list { display: flex; flex-direction: column; gap: .875rem; }
.lb-card { display: flex; align-items: center; gap: 1.25rem; }
.lb-top { border-color: color-mix(in srgb, var(--color-accent) 40%, transparent); background: color-mix(in srgb, var(--color-accent) 5%, var(--color-surface)); }
.lb-rank { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900; flex-shrink: 0; }
.rank-gold   { background: #fef3c7; color: #d97706; border: 2px solid #fcd34d; }
.rank-silver { background: #f1f5f9; color: #64748b; border: 2px solid #cbd5e1; }
.rank-bronze { background: #fef3c7; color: #b45309; border: 2px solid #fbbf24; }
.rank-default { background: var(--color-surface-2); color: var(--color-text-muted); border: 2px solid var(--color-border); }
.lb-info { flex: 1; min-width: 0; }
.lb-info h3 { font-size: .95rem; font-weight: 700; }
.lb-location { font-size: .8rem; color: var(--color-text-muted); margin-top: .125rem; }
.lb-stats { display: flex; gap: 1.5rem; }
.lb-stat { display: flex; flex-direction: column; align-items: center; }
.lb-stat-num { font-size: 1.15rem; font-weight: 800; color: var(--color-primary); }
.lb-stat-label { font-size: .7rem; color: var(--color-text-subtle); }
@media (max-width: 640px) { .lb-stats { gap: .75rem; } .lb-stat-num { font-size: 1rem; } }
</style>
