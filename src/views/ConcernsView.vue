<template>
  <div class="concerns-page">
    <div class="concerns-hero">
      <div class="container">
        <h1>Citizen Concerns</h1>
        <p>Browse and upvote issues reported by verified citizens across Dhaka.</p>
      </div>
    </div>

    <div class="container concerns-body">
      <!-- Toolbar -->
      <div class="concerns-toolbar">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="store.searchQuery"
            class="form-input search-input"
            type="search"
            placeholder="Search concerns..."
            id="search-concerns"
          />
        </div>
        <div class="toolbar-right">
          <select v-model="store.filterStatus" class="form-select filter-select" id="filter-status">
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div class="sort-btns">
            <button :class="['sort-btn', { active: store.sortBy === 'votes' }]" @click="store.sortBy = 'votes'">
              👍 Most Voted
            </button>
            <button :class="['sort-btn', { active: store.sortBy === 'recent' }]" @click="store.sortBy = 'recent'">
              🕑 Recent
            </button>
          </div>
          <RouterLink to="/concerns/submit" class="btn btn-primary">+ Report</RouterLink>
        </div>
      </div>

      <!-- Results count -->
      <p class="results-count">{{ store.filtered.length }} concern{{ store.filtered.length !== 1 ? 's' : '' }} found</p>

      <!-- Cards -->
      <div class="concerns-grid" v-if="store.filtered.length">
        <TransitionGroup name="list-anim">
          <div class="concern-card card" v-for="c in store.filtered" :key="c.id">
            <div class="concern-card-body">
              <!-- Status + category -->
              <div class="concern-meta-top">
                <span :class="['badge', statusBadge(c.status)]">{{ formatStatus(c.status) }}</span>
                <span class="badge badge-neutral">{{ c.category }}</span>
              </div>
              <RouterLink :to="`/concerns/${c.id}`" class="concern-title">{{ c.title }}</RouterLink>
              <p class="concern-desc">{{ c.description }}</p>
              <div class="concern-meta-bottom">
                <span class="meta-item">📍 {{ c.location }}</span>
                <span class="meta-item">👤 {{ c.author }}</span>
                <span class="meta-item">📅 {{ c.createdAt }}</span>
              </div>
            </div>
            <div class="concern-card-actions">
              <button
                :class="['vote-btn', { voted: c.voted }]"
                @click="store.toggleVote(c.id)"
                :aria-label="c.voted ? 'Remove upvote' : 'Upvote this concern'"
                :id="`vote-${c.id}`"
              >
                <span class="vote-icon">{{ c.voted ? '👍' : '👍' }}</span>
                <span class="vote-count">{{ c.votes }}</span>
              </button>
              <RouterLink :to="`/concerns/${c.id}`" class="btn btn-ghost btn-sm">View →</RouterLink>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <div class="empty-state" v-else>
        <span>🔍</span>
        <p>No concerns found. Try adjusting your filters.</p>
        <RouterLink to="/concerns/submit" class="btn btn-primary">Be the first to report</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useConcernsStore } from '../stores'

const store = useConcernsStore()

function formatStatus(s: string) {
  return { submitted: 'Submitted', under_review: 'Under Review', resolved: 'Resolved', rejected: 'Rejected' }[s] ?? s
}
function statusBadge(s: string) {
  return { submitted: 'badge-info', under_review: 'badge-warning', resolved: 'badge-success', rejected: 'badge-danger' }[s] ?? 'badge-neutral'
}
</script>

<style scoped>
.concerns-hero {
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-primary) 10%, transparent),
    color-mix(in srgb, var(--color-primary) 4%, transparent)
  );
  border-bottom: 1px solid var(--color-border);
  padding-block: 3rem 2rem;
}
.concerns-hero h1 { font-size: 2rem; font-weight: 800; margin-bottom: .5rem; }
.concerns-hero p { color: var(--color-text-muted); }

.concerns-body { padding-block: 2rem; }

/* Toolbar */
.concerns-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: .875rem;
  margin-bottom: 1.25rem;
  align-items: center;
}
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); font-size: .9rem; pointer-events: none; }
.search-input { padding-left: 2.25rem; }
.toolbar-right {
  display: flex;
  flex-wrap: wrap;
  gap: .625rem;
  align-items: center;
}
.filter-select { width: auto; min-width: 130px; }
.sort-btns { display: flex; gap: .25rem; }
.sort-btn {
  padding: .5rem .875rem;
  border-radius: var(--radius-md);
  font-size: .8rem;
  font-weight: 500;
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.sort-btn.active, .sort-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.results-count { font-size: .85rem; color: var(--color-text-muted); margin-bottom: 1.25rem; }

/* Grid */
.concerns-grid { display: grid; gap: 1.25rem; }
@media (min-width: 768px) { .concerns-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1100px) { .concerns-grid { grid-template-columns: repeat(3, 1fr); } }

.concern-card.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  gap: 1rem;
  cursor: default;
}
.concern-meta-top { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .625rem; }
.concern-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  margin-bottom: .5rem;
  line-height: 1.4;
  transition: color var(--transition-fast);
}
.concern-title:hover { color: var(--color-primary); }
.concern-desc { font-size: .85rem; color: var(--color-text-muted); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.concern-meta-bottom { display: flex; flex-wrap: wrap; gap: .625rem; margin-top: .75rem; }
.meta-item { font-size: .75rem; color: var(--color-text-subtle); }

.concern-card-actions { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border-light); padding-top: .875rem; }

.vote-btn {
  display: flex; align-items: center; gap: .4rem;
  padding: .5rem .875rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface-2);
  cursor: pointer;
  font-size: .875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}
.vote-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, transparent); }
.vote-btn.voted { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 12%, transparent); }
.vote-count { font-weight: 700; }

.empty-state { text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.empty-state span { font-size: 3rem; }
.empty-state p { color: var(--color-text-muted); }

/* List animation */
.list-anim-enter-active, .list-anim-leave-active { transition: all .25s ease; }
.list-anim-enter-from, .list-anim-leave-to { opacity: 0; transform: translateY(10px); }
.list-anim-move { transition: transform .3s ease; }
</style>
