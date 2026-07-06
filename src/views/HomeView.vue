<template>
  <div class="home">

    <!-- Hero Section -->
    <section class="hero grid-bg">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-inner">
        <div class="hero-badge badge badge-primary anim-fadeInUp">
          <span>🛡️</span> For the citizens of Dhaka
        </div>
        <h1 class="hero-title anim-fadeInUp" style="animation-delay:.1s">
          Together, <span class="text-gradient">We Decide.</span>
        </h1>
        <p class="hero-desc anim-fadeInUp" style="animation-delay:.2s">
          Report local issues, track their progress in real-time, and upvote what matters most to your community. A transparent path to a better city.
        </p>
        <div class="hero-actions anim-fadeInUp" style="animation-delay:.3s">
          <RouterLink to="/concerns/submit" class="btn btn-primary btn-lg">
            📍 Report a Concern
          </RouterLink>
          <RouterLink to="/concerns" class="btn btn-outline btn-lg">
            View Local Issues →
          </RouterLink>
        </div>
        <!-- Floating stat cards -->
        <div class="hero-stats anim-fadeInUp" style="animation-delay:.45s">
          <div class="stat-card">
            <span class="stat-num">72h</span>
            <span class="stat-label">First official response target</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">100%</span>
            <span class="stat-label">Transparent tracking</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">5,000+</span>
            <span class="stat-label">Active Dhaka citizens</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section features-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">How Awaz Works</h2>
          <p class="section-sub">We make it easy to voice your concerns and ensure they are heard by the right authorities.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card card" v-for="f in features" :key="f.title">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works — steps -->
    <section class="section steps-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Report in 3 Simple Steps</h2>
          <p class="section-sub">From concern to resolution, it only takes a minute to make your voice heard.</p>
        </div>
        <div class="steps-grid">
          <div class="step" v-for="(s, i) in steps" :key="s.title">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-icon">{{ s.icon }}</div>
            <span class="badge badge-primary step-label">Step {{ i + 1 }}</span>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Module cards -->
    <section class="section modules-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Explore Platform Modules</h2>
          <p class="section-sub">Dedicated surfaces for civic discussion, constitutional guidance, research, and public accountability.</p>
        </div>
        <div class="modules-grid">
          <RouterLink :to="m.href" class="module-card card" v-for="m in modules" :key="m.href">
            <div class="module-icon">{{ m.icon }}</div>
            <h3>{{ m.title }}</h3>
            <p>{{ m.desc }}</p>
            <span class="module-arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Timeline / Transparency -->
    <section class="section timeline-section">
      <div class="container">
        <div class="timeline-grid">
          <div class="timeline-text">
            <span class="badge badge-primary">🔍 Radical Transparency</span>
            <h2>Know exactly where your concern stands.</h2>
            <p>When you submit an issue on Awaz, it doesn't go into a black hole. We provide a clear, public timeline for every concern so you can hold the authorities accountable.</p>
            <RouterLink to="/concerns/submit" class="btn btn-primary">Start Tracking →</RouterLink>
          </div>
          <div class="timeline-demo card card-body">
            <h4>Status Timeline Example</h4>
            <div class="timeline-items">
              <div class="timeline-item resolved">
                <div class="tl-dot tl-resolved">✓</div>
                <div><strong>Resolved</strong><p>Pothole was patched by the road maintenance team.</p></div>
              </div>
              <div class="timeline-item">
                <div class="tl-dot tl-review"></div>
                <div><strong>Under Review</strong><p>Assigned to City Corporation Ward 12 desk.</p></div>
              </div>
              <div class="timeline-item">
                <div class="tl-dot tl-submitted"></div>
                <div><strong>Submitted</strong><p>Concern reported by verified citizen.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">What You Can Report</h2>
          <p class="section-sub">Awaz covers a wide range of civic concerns — from infrastructure to public safety.</p>
        </div>
        <div class="categories-grid">
          <RouterLink to="/concerns" class="category-card" v-for="c in categories" :key="c.label">
            <span class="cat-icon">{{ c.icon }}</span>
            <span class="cat-label">{{ c.label }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section faq-section" id="faq">
      <div class="container">
        <div class="section-head">
          <div class="faq-icon-wrap">❓</div>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-sub">Everything you need to know about reporting concerns on Awaz.</p>
        </div>
        <div class="faq-list">
          <div class="faq-item card" v-for="(faq, i) in faqs" :key="i">
            <button class="faq-q" @click="activeIdx = activeIdx === i ? -1 : i">
              <span>{{ faq.q }}</span>
              <span class="faq-chevron" :class="{ open: activeIdx === i }">›</span>
            </button>
            <Transition name="expand">
              <div class="faq-a" v-if="activeIdx === i"><p>{{ faq.a }}</p></div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="cta-bg" aria-hidden="true"></div>
      <div class="container cta-inner">
        <h2>Ready to improve your neighborhood?</h2>
        <p>Join thousands of Dhaka citizens who are already using Awaz to report issues and track resolutions.</p>
        <RouterLink to="/login" class="btn btn-primary btn-lg">Sign Up / Log In with Phone →</RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const activeIdx = ref(-1)

const features = [
  { icon: '📍', title: 'Pinpoint Issues', desc: 'Easily snap a photo and drop a GPS pin to report problems like broken streetlights, potholes, or waste management issues.' },
  { icon: '👍', title: 'Prioritize Together', desc: 'Browse concerns reported by others and upvote the ones that impact you. The community decides what needs immediate attention.' },
  { icon: '📊', title: 'Live Process Tracking', desc: 'No more guessing. Track the exact status of your reported issue — from submission to review and final resolution — with official updates.' },
]

const steps = [
  { icon: '📸', title: 'Snap & Pin', desc: 'Take a photo and mark the exact GPS location of the issue on the map.' },
  { icon: '✍️', title: 'Describe & Submit', desc: 'Add a title, describe the problem clearly, and submit your report.' },
  { icon: '🔍', title: 'Track & Resolve', desc: 'Follow the real-time timeline as authorities review and resolve your concern.' },
]

const modules = [
  { href: '/chatbot', icon: '🤖', title: 'Rights Chatbot', desc: 'Bangla-first rights guidance with citations and session memory.' },
  { href: '/research', icon: '🔬', title: 'Research Lab', desc: 'Open problems, grant applications, and milestone tracking.' },
  { href: '/collaboration', icon: '🤝', title: 'Collaboration', desc: 'Joint citizen-government workspace for civic solutions.' },
  { href: '/open-data', icon: '📂', title: 'Open Data Portal', desc: 'Access CC-BY-4.0 civic datasets and download full JSON.' },
]

const categories = [
  { icon: '🛣️', label: 'Roads & Potholes' },
  { icon: '💡', label: 'Streetlights' },
  { icon: '💧', label: 'Water & Drainage' },
  { icon: '🗑️', label: 'Waste & Sanitation' },
  { icon: '🛡️', label: 'Public Safety' },
  { icon: '🌳', label: 'Parks & Spaces' },
]

const faqs = [
  { q: 'Is Awaz free to use?', a: 'Yes. Awaz is completely free for all citizens of Dhaka. No subscriptions, no hidden fees.' },
  { q: 'Do I need to create an account?', a: 'You only need a Bangladeshi phone number. We verify your identity with a one-time OTP — no passwords to remember.' },
  { q: 'Who sees my reported concerns?', a: 'All submitted concerns are publicly visible to promote transparency. Your phone number is kept private.' },
  { q: 'How long does it take to get a response?', a: 'Our target is a first official update within 72 hours. You can track real-time progress on every concern.' },
  { q: 'Can I report concerns anonymously?', a: 'Currently, all reports are linked to a verified phone number to prevent abuse and ensure accountability.' },
]
</script>

<style scoped>
/* ── Hero ── */
.hero {
  position: relative;
  padding-block: 5rem 4rem;
  overflow: hidden;
}
@media (min-width: 768px) { .hero { padding-block: 7rem 5rem; } }

.hero-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 70%);
  pointer-events: none;
}
.hero-inner { text-align: center; position: relative; z-index: 1; }

.hero-badge { margin-bottom: 1.25rem; gap: .35rem; font-size: .8rem; }

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -.03em;
  line-height: 1.08;
  margin-bottom: 1.25rem;
  color: var(--color-text);
}

.hero-desc {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--color-text-muted);
  max-width: 580px;
  margin-inline: auto;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .875rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .3rem;
  min-width: 140px;
  box-shadow: var(--shadow-sm);
}
.stat-num { font-size: 1.75rem; font-weight: 800; color: var(--color-primary); letter-spacing: -.02em; }
.stat-label { font-size: .75rem; color: var(--color-text-muted); text-align: center; line-height: 1.4; }

/* ── Section shared ── */
.section-head { text-align: center; margin-bottom: 3rem; }
.section-title { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -.02em; margin-bottom: .75rem; }
.section-sub { font-size: 1.05rem; color: var(--color-text-muted); max-width: 520px; margin-inline: auto; }

/* ── Features ── */
.features-section { background: var(--color-surface-2); }
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.feature-card.card { padding: 2rem; }
.feature-card:hover { transform: translateY(-4px); }
.feature-icon { font-size: 2.25rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: .5rem; }
.feature-card p { font-size: .9rem; color: var(--color-text-muted); line-height: 1.65; }

/* ── Steps ── */
.steps-section { background: var(--color-bg); }
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  position: relative;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: .5rem;
  position: relative;
}
.step-num { display: none; }
.step-icon {
  width: 72px; height: 72px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: 2px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: .5rem;
  transition: all var(--transition-base);
}
.step:hover .step-icon {
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-color: var(--color-primary);
  transform: scale(1.05);
}
.step-label { font-size: .7rem; }
.step h3 { font-size: 1.05rem; font-weight: 700; }
.step p { font-size: .875rem; color: var(--color-text-muted); max-width: 200px; line-height: 1.6; }

/* ── Modules ── */
.modules-section { background: var(--color-surface-2); }
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}
.module-card.card {
  padding: 1.5rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}
.module-card:hover { transform: translateY(-4px); }
.module-icon { font-size: 1.75rem; margin-bottom: .75rem; }
.module-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: .375rem; }
.module-card p { font-size: .85rem; color: var(--color-text-muted); line-height: 1.55; }
.module-arrow {
  position: absolute;
  bottom: 1.25rem;
  right: 1.25rem;
  font-size: 1.1rem;
  color: var(--color-primary);
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-base);
}
.module-card:hover .module-arrow { opacity: 1; transform: translateX(0); }

/* ── Timeline ── */
.timeline-section { background: var(--color-bg); }
.timeline-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 768px) { .timeline-grid { grid-template-columns: 1fr 1fr; } }

.timeline-text { display: flex; flex-direction: column; gap: 1rem; }
.timeline-text h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; letter-spacing: -.02em; }
.timeline-text p { color: var(--color-text-muted); line-height: 1.7; }
.timeline-demo h4 { font-size: 1rem; font-weight: 700; margin-bottom: 1.25rem; }

.timeline-items { display: flex; flex-direction: column; gap: 1.25rem; position: relative; }
.timeline-items::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 8px; bottom: 8px;
  width: 2px;
  background: var(--color-border);
}
.timeline-item { display: flex; gap: 1rem; align-items: flex-start; }
.tl-dot {
  width: 24px; height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .75rem;
  font-weight: 700;
  color: #fff;
  background: var(--color-border);
  outline: 4px solid var(--color-surface);
}
.tl-resolved { background: var(--color-success); }
.tl-review { background: var(--color-warning); }
.tl-submitted { background: var(--color-text-subtle); }
.timeline-item strong { display: block; font-size: .875rem; margin-bottom: .2rem; }
.timeline-item p { font-size: .8rem; color: var(--color-text-muted); }

/* ── Categories ── */
.categories-section { background: var(--color-surface-2); }
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (min-width: 640px) { .categories-grid { grid-template-columns: repeat(6, 1fr); } }

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .625rem;
  padding: 1.25rem .75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
}
.category-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}
.cat-icon { font-size: 1.75rem; }
.cat-label { font-size: .8rem; font-weight: 600; color: var(--color-text); text-align: center; }

/* ── FAQ ── */
.faq-section { background: var(--color-bg); }
.faq-icon-wrap { font-size: 2rem; margin-bottom: .5rem; }
.faq-list { max-width: 680px; margin-inline: auto; display: flex; flex-direction: column; gap: .625rem; }
.faq-item.card { overflow: hidden; padding: 0; }
.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: .95rem;
  font-weight: 600;
  color: var(--color-text);
  gap: 1rem;
}
.faq-q:hover { background: var(--color-surface-2); }
.faq-chevron { font-size: 1.25rem; transition: transform .2s; flex-shrink: 0; color: var(--color-primary); }
.faq-chevron.open { transform: rotate(90deg); }
.faq-a { padding: 0 1.25rem 1.1rem; }
.faq-a p { font-size: .9rem; color: var(--color-text-muted); line-height: 1.7; }
.expand-enter-active, .expand-leave-active { transition: all .2s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 200px; }

/* ── CTA ── */
.cta-section { position: relative; overflow: hidden; }
.cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--color-primary) 12%, transparent),
    color-mix(in srgb, var(--color-accent) 8%, transparent)
  );
  pointer-events: none;
}
.cta-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.cta-inner h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -.02em; }
.cta-inner p { color: var(--color-text-muted); max-width: 480px; line-height: 1.65; }
</style>
