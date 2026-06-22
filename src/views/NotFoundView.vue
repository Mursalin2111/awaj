<template>
  <div class="not-found">
    <div class="nf-content">
      <div class="nf-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for has wandered off. Let's get you back on track.</p>
      <div class="nf-actions">
        <RouterLink to="/" class="btn btn-primary">🏠 Go Home</RouterLink>
        <button class="btn btn-outline" @click="$router.back()">← Go Back</button>
      </div>
      <RouterLink to="/concerns" class="explore-link">Or browse all citizen concerns →</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 128px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}
.nf-content { max-width: 480px; }
.nf-code {
  font-size: 7rem;
  font-weight: 900;
  letter-spacing: -.04em;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: .5rem;
}
.nf-content h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: .75rem; }
.nf-content p { color: var(--color-text-muted); margin-bottom: 2rem; line-height: 1.7; }
.nf-actions { display: flex; gap: .875rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.25rem; }
.explore-link { font-size: .875rem; color: var(--color-primary); text-decoration: none; font-weight: 500; transition: opacity var(--transition-fast); }
.explore-link:hover { opacity: .8; }
</style>
