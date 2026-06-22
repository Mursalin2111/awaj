<template>
  <div class="page-layout">
    <div class="page-hero">
      <div class="container">
        <span class="badge badge-primary">📈 Insights</span>
        <h1>City Analytics Dashboard</h1>
        <p>Real-time KPIs, concern trends, and city health snapshot for Dhaka.</p>
      </div>
    </div>
    <div class="container page-body">
      <div class="kpi-grid">
        <div class="kpi-card card card-body" v-for="k in kpis" :key="k.label">
          <div class="kpi-icon">{{ k.icon }}</div>
          <div class="kpi-body">
            <span class="kpi-num" :style="{ color: k.color }">{{ k.val }}</span>
            <span class="kpi-label">{{ k.label }}</span>
          </div>
          <span class="kpi-trend" :class="k.trend > 0 ? 'trend-up' : 'trend-down'">
            {{ k.trend > 0 ? '↑' : '↓' }} {{ Math.abs(k.trend) }}%
          </span>
        </div>
      </div>

      <div class="dash-grid">
        <div class="card card-body dash-widget">
          <h3>Top Concerns by Category</h3>
          <div class="bar-chart">
            <div class="bar-row" v-for="c in categories" :key="c.name">
              <span class="bar-label">{{ c.name }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: c.pct + '%', background: c.color }"></div>
              </div>
              <span class="bar-val">{{ c.count }}</span>
            </div>
          </div>
        </div>
        <div class="card card-body dash-widget">
          <h3>Status Breakdown</h3>
          <div class="donut-chart">
            <div class="donut-item" v-for="s in statusBreakdown" :key="s.label">
              <div class="donut-dot" :style="{ background: s.color }"></div>
              <span class="donut-label">{{ s.label }}</span>
              <span class="donut-pct">{{ s.pct }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card card-body recent-activity">
        <h3>Recent Platform Activity</h3>
        <div class="activity-list">
          <div class="act-item" v-for="a in activity" :key="a.id">
            <span class="act-icon">{{ a.icon }}</span>
            <div class="act-body">
              <p>{{ a.text }}</p>
              <span class="act-time">{{ a.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const kpis = [
  { icon: '⚠️', val: '1,247', label: 'Total Concerns', trend: 12, color: 'var(--color-primary)' },
  { icon: '✅', val: '834', label: 'Resolved', trend: 8, color: 'var(--color-success)' },
  { icon: '🕑', val: '38h', label: 'Avg Response Time', trend: -15, color: 'var(--color-accent)' },
  { icon: '👥', val: '5,241', label: 'Active Citizens', trend: 22, color: 'var(--color-info)' },
]
const categories = [
  { name: 'Roads', count: 387, pct: 85, color: '#0f766e' },
  { name: 'Drainage', count: 298, pct: 65, color: '#0ea5e9' },
  { name: 'Streetlights', count: 241, pct: 53, color: '#f59e0b' },
  { name: 'Waste', count: 198, pct: 43, color: '#8b5cf6' },
  { name: 'Safety', count: 123, pct: 27, color: '#ef4444' },
]
const statusBreakdown = [
  { label: 'Resolved', pct: 67, color: '#22c55e' },
  { label: 'Under Review', pct: 18, color: '#f59e0b' },
  { label: 'Submitted', pct: 13, color: '#3b82f6' },
  { label: 'Rejected', pct: 2, color: '#ef4444' },
]
const activity = [
  { id: 1, icon: '✅', text: 'Concern "Broken streetlight Mirpur 10" resolved by DNCC.', time: '2 hours ago' },
  { id: 2, icon: '📍', text: 'New concern submitted in Banani — Water logging on Road 11.', time: '4 hours ago' },
  { id: 3, icon: '👍', text: '50+ citizens upvoted the Dhanmondi cycling lane proposal.', time: '6 hours ago' },
  { id: 4, icon: '🔬', text: 'BUET applied for the Air Quality Monitoring research grant.', time: '1 day ago' },
  { id: 5, icon: '🏛️', text: 'DNCC Road Division approved the Mirpur Road Repair plan.', time: '1 day ago' },
]
</script>

<style scoped>
.page-hero { background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent); border-bottom: 1px solid var(--color-border); padding-block: 3rem 2rem; }
.page-hero h1 { font-size: 2rem; font-weight: 800; margin-block: .5rem; }
.page-hero p { color: var(--color-text-muted); }
.page-body { padding-block: 2rem 4rem; display: flex; flex-direction: column; gap: 1.5rem; }
.kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
@media (min-width: 768px) { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }
.kpi-card { display: flex; align-items: center; gap: 1rem; }
.kpi-icon { font-size: 1.75rem; flex-shrink: 0; }
.kpi-body { flex: 1; }
.kpi-num { display: block; font-size: 1.5rem; font-weight: 800; letter-spacing: -.02em; }
.kpi-label { display: block; font-size: .75rem; color: var(--color-text-muted); }
.kpi-trend { font-size: .75rem; font-weight: 700; padding: .2rem .4rem; border-radius: var(--radius-sm); }
.trend-up { background: color-mix(in srgb, var(--color-success) 12%, transparent); color: var(--color-success); }
.trend-down { background: color-mix(in srgb, var(--color-danger) 12%, transparent); color: var(--color-danger); }
.dash-grid { display: grid; gap: 1.25rem; }
@media (min-width: 768px) { .dash-grid { grid-template-columns: repeat(2, 1fr); } }
.dash-widget h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; }
.bar-chart { display: flex; flex-direction: column; gap: .875rem; }
.bar-row { display: flex; align-items: center; gap: .75rem; }
.bar-label { font-size: .8rem; color: var(--color-text-muted); min-width: 70px; }
.bar-track { flex: 1; height: 10px; background: var(--color-surface-2); border-radius: var(--radius-full); overflow: hidden; }
.bar-fill { height: 100%; border-radius: var(--radius-full); transition: width .6s ease; }
.bar-val { font-size: .8rem; font-weight: 700; min-width: 30px; text-align: right; color: var(--color-text); }
.donut-chart { display: flex; flex-direction: column; gap: .875rem; }
.donut-item { display: flex; align-items: center; gap: .75rem; }
.donut-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.donut-label { flex: 1; font-size: .875rem; color: var(--color-text); }
.donut-pct { font-size: .875rem; font-weight: 700; color: var(--color-text); }
.recent-activity h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
.activity-list { display: flex; flex-direction: column; gap: .75rem; }
.act-item { display: flex; gap: .875rem; align-items: flex-start; }
.act-icon { font-size: 1.1rem; flex-shrink: 0; }
.act-body p { font-size: .875rem; color: var(--color-text); line-height: 1.5; }
.act-time { font-size: .75rem; color: var(--color-text-subtle); }
</style>
