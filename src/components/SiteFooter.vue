<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <!-- Brand & Platform Status -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">
            <img src="/logo.png" alt="Awaz Logo" class="footer-logo-img" />
            <span class="footer-logo-text">Awaz</span>
          </RouterLink>
          <p class="brand-desc">A civic platform for Dhaka residents to report issues, track live status, and shape local development.</p>
          <p class="brand-tagline">আওয়াজ — আপনার কণ্ঠস্বর</p>

          <!-- Live Operational Status Indicator -->
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">Awaz API: Operational</span>
          </div>
        </div>

        <!-- Links Grid -->
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
              <li><RouterLink to="/chatbot">AI Assistant</RouterLink></li>
              <li><RouterLink to="/leaderboard">Leaderboard</RouterLink></li>
              <li><RouterLink to="/open-data">Open Data</RouterLink></li>
              <li><RouterLink to="/dashboard">Analytics</RouterLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3 class="footer-col-title">Contact & Help</h3>
            <ul>
              <li><RouterLink to="/login">Sign In</RouterLink></li>
              <li><RouterLink to="/#faq">Help / FAQ</RouterLink></li>
              <li>
                <div class="contact-email-row">
                  <a href="mailto:awaz@gmail.com" class="email-link">📧 awaz@gmail.com</a>
                  <button class="copy-btn" @click="copyEmail" :title="copied ? 'Copied!' : 'Copy Email'">
                    {{ copied ? '✓ Copied' : '📋 Copy' }}
                  </button>
                </div>
                <span class="contact-hint">Questions or feedback? Reach out anytime.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Interactive Feedback & Questions Card -->
        <div class="footer-feedback-card">
          <div class="card-header">
            <h3>💬 Questions or Feedback?</h3>
            <p>Reach out anytime. We respond within 24 hours.</p>
          </div>

          <div v-if="submitted" class="feedback-success">
            <span>🎉 Thank you! Your message has been sent successfully.</span>
            <button class="btn-reset" @click="submitted = false">Send another</button>
          </div>

          <form v-else @submit.prevent="handleFeedbackSubmit" class="feedback-form">
            <div class="form-group-row">
              <input
                v-model="feedbackForm.name"
                type="text"
                class="feedback-input"
                placeholder="Your Name"
                required
              />
              <input
                v-model="feedbackForm.email"
                type="email"
                class="feedback-input"
                placeholder="Your Email"
                required
              />
            </div>
            <textarea
              v-model="feedbackForm.message"
              class="feedback-textarea"
              placeholder="Type your question or feedback here..."
              rows="3"
              required
            ></textarea>
            <button type="submit" class="btn btn-feedback-submit" :disabled="sending">
              <span v-if="sending" class="spinner-sm"></span>
              <span v-else>✉️ Send Feedback</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="footer-bottom">
        <p class="copyright">© {{ year }} Awaz — The Voice of People. Built for Dhaka. 🇧🇩</p>

        <div class="footer-bottom-right">
          <span class="legal-links">
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
          </span>

          <button class="btn-icon theme-toggle" @click="appStore.toggleTheme()" :aria-label="appStore.isDark ? 'Light mode' : 'Dark mode'">
            <span v-if="appStore.isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '../stores'
import { useToastStore } from '../stores/toast'
import api from '../services/api'

const appStore = useAppStore()
const toast = useToastStore()
const year = new Date().getFullYear()

const copied = ref(false)
const sending = ref(false)
const submitted = ref(false)

const feedbackForm = ref({
  name: '',
  email: '',
  message: ''
})

function copyEmail() {
  navigator.clipboard.writeText('awaz@gmail.com')
  copied.value = true
  toast.show('Email address copied to clipboard!', 'success')
  setTimeout(() => { copied.value = false }, 2500)
}

async function handleFeedbackSubmit() {
  if (!feedbackForm.value.message.trim()) return
  sending.value = true

  try {
    await api.post('/feedback', feedbackForm.value)
    sending.value = false
    submitted.value = true
    toast.show('Thank you! Your feedback has been received.', 'success')
    feedbackForm.value = { name: '', email: '', message: '' }
  } catch (err) {
    console.error('Feedback submit error:', err)
    sending.value = false
    toast.show('Failed to send feedback. Please try again.', 'error')
  }
}
</script>

<style scoped>
.site-footer {
  background: color-mix(in srgb, var(--color-surface-2) 85%, var(--color-bg));
  border-top: 1px solid var(--color-border);
  padding-block: 3.5rem 1.5rem;
  transition: all 0.3s ease;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}
@media (min-width: 1024px) {
  .footer-top {
    grid-template-columns: 240px 1fr 340px;
  }
}

/* Brand */
.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-size: 1.3rem;
  font-weight: 800;
  text-decoration: none;
  margin-bottom: .75rem;
}
.footer-logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}
.footer-logo-text {
  background: linear-gradient(135deg, var(--color-text) 30%, var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.brand-desc {
  font-size: .85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
.brand-tagline {
  font-size: .8rem;
  color: var(--color-text-subtle);
  margin-top: .5rem;
  font-style: italic;
}

/* Status Indicator */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .35rem .7rem;
  border-radius: 99px;
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  border: 1px solid var(--color-border);
  font-size: .75rem;
  margin-top: 1rem;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseDot 2s infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .6; transform: scale(1.15); }
}
.status-text {
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Links */
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
@media (max-width: 640px) {
  .footer-links { grid-template-columns: repeat(2, 1fr); }
}

.footer-col-title {
  font-size: .72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--color-text);
  margin-bottom: 1rem;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .65rem;
}
.footer-col a {
  font-size: .85rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}
.footer-col a:hover {
  color: var(--color-primary);
  transform: translateX(2px);
}

.contact-email-row {
  display: flex;
  align-items: center;
  gap: .4rem;
  flex-wrap: wrap;
}
.email-link {
  color: var(--color-primary) !important;
  font-weight: 600;
  font-size: .85rem;
}
.copy-btn {
  font-size: .7rem;
  font-weight: 600;
  padding: .15rem .45rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}
.copy-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.contact-hint {
  display: block;
  font-size: .75rem;
  color: var(--color-text-subtle);
  margin-top: .3rem;
}

/* Interactive Feedback Card */
.footer-feedback-card {
  background: color-mix(in srgb, var(--color-surface) 95%, transparent);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.25s ease;
}
.footer-feedback-card:focus-within {
  border-color: var(--color-primary);
}
.card-header h3 {
  font-size: .95rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
.card-header p {
  font-size: .78rem;
  color: var(--color-text-muted);
  margin: .25rem 0 0 0;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: .65rem;
}
.form-group-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .5rem;
}
@media (max-width: 480px) {
  .form-group-row { grid-template-columns: 1fr; }
}

.feedback-input, .feedback-textarea {
  width: 100%;
  padding: .5rem .75rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: .8rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}
.feedback-input:focus, .feedback-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}
.feedback-textarea {
  resize: vertical;
  min-height: 60px;
}

.btn-feedback-submit {
  padding: .55rem 1rem;
  border-radius: var(--radius-md);
  font-size: .82rem;
  font-weight: 700;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-feedback-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 40%, transparent);
}
.btn-feedback-submit:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.feedback-success {
  font-size: .82rem;
  color: #10b981;
  background: color-mix(in srgb, #10b981 12%, transparent);
  border: 1px solid color-mix(in srgb, #10b981 30%, transparent);
  padding: 1rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: .5rem;
}
.btn-reset {
  font-size: .72rem;
  background: none;
  border: underline;
  color: var(--color-text);
  cursor: pointer;
  align-self: flex-start;
  padding: 0;
}

/* Bottom Bar */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: 1rem;
}
.copyright {
  font-size: .8rem;
  color: var(--color-text-muted);
}
.footer-bottom-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.legal-links {
  font-size: .8rem;
  color: var(--color-text-subtle);
}
.legal-links a {
  text-decoration: none;
  color: var(--color-text-subtle);
  transition: color 0.2s ease;
}
.legal-links a:hover {
  color: var(--color-primary);
}
.theme-toggle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  border-color: var(--color-primary);
}
.btn-icon { background: none; border: none; }
.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
