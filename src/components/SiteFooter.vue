<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">
            <img src="/logo.png" alt="Awaz Logo" class="footer-logo-img" />
            <span>Awaz</span>
          </RouterLink>
          <p class="brand-desc">A civic platform for Dhaka residents to report issues, follow progress, and help prioritize what gets fixed first.</p>
          <p class="brand-tagline">আওয়াজ — আপনার কণ্ঠস্বর</p>
        </div>

        <!-- Links grid -->
        <div class="footer-links">
          <div class="footer-col">
            <h3 class="footer-col-title">Explore</h3>
            <ul>
              <li><RouterLink to="/">Overview</RouterLink></li>
              <li><RouterLink to="/concerns">Browse Concerns</RouterLink></li>
              <li><RouterLink to="/concerns/submit">Report Concern</RouterLink></li>
              <li><RouterLink to="/collaboration">Collaboration</RouterLink></li>
              <li><RouterLink to="/forum">Forum</RouterLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-col-title">Resources</h3>
            <ul>
              <li><RouterLink to="/research">Research Lab</RouterLink></li>
              <li><RouterLink to="/chatbot">Rights Chatbot</RouterLink></li>
              <li><RouterLink to="/leaderboard">Leaderboard</RouterLink></li>
              <li><RouterLink to="/open-data">Open Data</RouterLink></li>
              <li><RouterLink to="/dashboard">Analytics</RouterLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-col-title">Contact</h3>
            <ul>
              <li><RouterLink to="/login">Sign In</RouterLink></li>
              <li><RouterLink to="/#faq">Help / FAQ</RouterLink></li>
              <li>
                <a href="mailto:support@awaz.app" class="email-link">support@awaz.app</a>
                <span class="contact-hint">Questions or feedback? Reach out anytime.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© {{ year }} Awaz — The Voice of People. Built for Dhaka. 🇧🇩</p>
        <div class="footer-bottom-right">
          <span class="legal-links">
            <a href="#">Privacy</a> · <a href="#">Terms</a>
          </span>
          <button class="btn-icon theme-toggle" @click="appStore.toggleTheme()" :title="appStore.isDark ? 'Light mode' : 'Dark mode'">
            <span v-if="appStore.isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAppStore } from '../stores'

const appStore = useAppStore()
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--color-surface-2);
  border-top: 1px solid var(--color-border);
  padding-block: 3rem 1.5rem;
}
.footer-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .footer-top { grid-template-columns: 260px 1fr; }
}

/* Brand */
.footer-logo {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
  text-decoration: none;
  margin-bottom: .75rem;
}
.footer-logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}
.brand-desc { font-size: .875rem; color: var(--color-text-muted); line-height: 1.6; max-width: 220px; }
.brand-tagline { font-size: .8rem; color: var(--color-text-subtle); margin-top: .5rem; font-style: italic; }

/* Links */
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
@media (max-width: 640px) {
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}

.footer-col-title {
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--color-text);
  margin-bottom: .875rem;
}
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: .625rem; }
.footer-col a {
  font-size: .875rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.footer-col a:hover { color: var(--color-primary); }
.email-link { color: var(--color-primary) !important; font-size: .8rem; }
.contact-hint { display: block; font-size: .75rem; color: var(--color-text-subtle); margin-top: .15rem; }

/* Bottom bar */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: .75rem;
}
.copyright { font-size: .8rem; color: var(--color-text-muted); }
.footer-bottom-right { display: flex; align-items: center; gap: 1rem; }
.legal-links { font-size: .8rem; color: var(--color-text-subtle); }
.legal-links a { text-decoration: none; transition: color var(--transition-fast); }
.legal-links a:hover { color: var(--color-primary); }
.theme-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  font-size: .9rem;
  transition: all var(--transition-fast);
}
.theme-toggle:hover { border-color: var(--color-primary); }
.btn-icon { background: none; border: none; cursor: pointer; }
</style>
