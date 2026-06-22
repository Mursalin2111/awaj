<p align="center">
  <img src="public/awaj-icon.svg" alt="Awaj Logo" width="80" />
</p>

<h1 align="center">আওয়াজ — Awaj</h1>

<p align="center">
  <em>Together, We Decide</em>
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-42b883?style=flat-square&logo=vue.js" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite" />
  <img alt="Pinia" src="https://img.shields.io/badge/Pinia-3-f7c948?style=flat-square&logo=pinia" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" />
  <img alt="Vue Router" src="https://img.shields.io/badge/Vue_Router-4-42b883?style=flat-square" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

**Awaj** (আওয়াজ — meaning *Voice* in Bengali) is a forward-thinking digital civic platform designed to address the evolving needs of **smart governance, community engagement**, and **public accountability** in urban Bangladesh. Built on **Vue 3 + Vite**, it enables Dhaka citizens to report, prioritise, and track urban concerns in Bangla and English, so officials can respond transparently within 72 hours of submission.

> **Primary User for MVP:** Citizens — government officials will join in Phase 2 once volume and workflows are validated.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Features](#features)
- [Design System](#design-system)
- [State Management](#state-management)
- [Scripts Reference](#scripts-reference)
- [Contributing](#contributing)
- [Team](#team)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Vue 3 (Composition API · `<script setup>`) |
| **Build Tool** | Vite 8 |
| **Routing** | Vue Router 4 (lazy-loaded routes) |
| **State** | Pinia 3 |
| **Language** | TypeScript 5.9 |
| **Styling** | Vanilla CSS (custom design system — zero external CSS frameworks) |
| **Fonts** | Inter · Noto Sans Bengali (Google Fonts) |
| **Icons** | SVG inline + emoji system icons |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone & install

```bash
git clone <repo-url>
cd awaj
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

---

## Project Structure

```
awaj/
├── public/
│   └── awaj-icon.svg          # Brand favicon (SVG)
├── src/
│   ├── assets/                # Static assets
│   ├── components/            # Reusable Vue components
│   │   ├── SiteHeader.vue     # Sticky nav with desktop mega-menu & mobile hamburger
│   │   ├── SiteFooter.vue     # Footer with link columns & theme toggle
│   │   ├── BackToTop.vue      # Floating back-to-top button
│   │   └── ToastContainer.vue # Auto-dismiss toast notifications
│   ├── router/
│   │   └── index.ts           # Vue Router 4 — all 14 routes (lazy-loaded)
│   ├── stores/
│   │   ├── index.ts           # App store (theme/locale) + Concerns store (Pinia)
│   │   └── toast.ts           # Toast notification store
│   ├── views/                 # Page-level Vue components (one per route)
│   │   ├── HomeView.vue
│   │   ├── ConcernsView.vue
│   │   ├── ConcernDetailView.vue
│   │   ├── SubmitView.vue
│   │   ├── ForumView.vue
│   │   ├── ProjectsView.vue
│   │   ├── ChatbotView.vue
│   │   ├── ResearchView.vue
│   │   ├── CollaborationView.vue
│   │   ├── LeaderboardView.vue
│   │   ├── OpenDataView.vue
│   │   ├── DashboardView.vue
│   │   ├── LoginView.vue
│   │   └── NotFoundView.vue
│   ├── App.vue                # Root component — layout shell + page transitions
│   ├── main.ts                # App entry point
│   └── style.css              # Global design system (CSS variables, utilities)
├── index.html                 # Root HTML with SEO meta + Google Fonts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, features, how-it-works steps, platform modules, timeline, categories, FAQ accordion, CTA |
| `/concerns` | Citizen Concerns | Search, filter by status, sort by votes / recent, 3-column card grid, live upvoting |
| `/concerns/:id` | Concern Detail | Full description, live status timeline, vote button, sidebar quick-actions |
| `/concerns/submit` | Report a Concern | GPS location detection, category select, photo upload note, tips sidebar |
| `/forum` | Voice Forum | Citizen proposals with voting pills and tab navigation |
| `/projects` | Project Tracker | Government infrastructure projects with progress bars, budgets, KPI stats |
| `/chatbot` | Rights Chatbot | Bangla-first AI chat with typing indicator, quick-prompt chips, mock RAG responses |
| `/research` | Research Lab | Grant-backed civic problems, searchable, with how-it-works sidebar |
| `/collaboration` | Collaboration | Joint citizen-government threads, solution plans, co-governance workflow |
| `/leaderboard` | Leaderboard | University rankings with gold / silver / bronze medals |
| `/open-data` | Open Data Portal | Platform stats grid, sortable concerns table, JSON download, API reference |
| `/dashboard` | Analytics | KPI cards with trend indicators, bar charts, status breakdown, activity feed |
| `/login` | Sign In | Two-step phone OTP flow with country-code picker |
| `/*` | 404 | Gradient error code with navigation links |

---

## Features

### 🏛️ Civic Engagement
- **Concern Reporting** — Submit geo-tagged concerns with GPS pin detection
- **Proposal Forum** — Propose, discuss, and vote on civic solutions
- **Upvoting System** — Live vote toggling with Pinia state (no page reload)
- **Status Tracking** — Visual timeline from submission → review → resolution

### 🛡️ Administration & Transparency
- **Project Tracker** — Monitor civic infrastructure with progress bars and budgets
- **Analytics Dashboard** — KPI cards, category bar charts, status breakdown
- **Open Data Portal** — CC-BY-4.0 data export as downloadable JSON

### 🔬 Research & Innovation
- **Research Lab** — Grant-funded open civic problems from government ministries
- **Collaboration Threads** — Cross-sector joint workspaces
- **University Leaderboard** — Ranked research contributions

### 🤖 AI & Intelligence
- **Rights Chatbot** — Constitutional guidance with Bangla-first UX and mock RAG citations
- **Quick Prompts** — Pre-built context chips for common questions

### 👤 User Experience
- **Phone OTP Login** — Two-step verification flow
- **Dark / Light Mode** — `prefers-color-scheme` aware, `localStorage` persisted
- **Toast Notifications** — Auto-dismissing success / error / info toasts
- **Page Transitions** — Smooth fade + slide between all routes
- **Back to Top** — Floating button appears after 400px scroll
- **Responsive** — Mobile-first with hamburger nav and adaptive grids
- **Accessible** — Skip link, ARIA labels, semantic HTML, keyboard-navigable

---

## Design System

All styling lives in `src/style.css` using **CSS Custom Properties** — no CSS framework dependency.

```css
/* Brand tokens */
--color-primary:       #0f766e;   /* Deep teal */
--color-primary-light: #14b8a6;
--color-accent:        #f59e0b;   /* Warm amber */

/* Semantic surfaces */
--color-bg:            #f8fafc;   /* Page background */
--color-surface:       #ffffff;   /* Cards */
--color-surface-2:     #f1f5f9;   /* Subtle sections */
--color-border:        #e2e8f0;

/* Typography */
--font-sans: 'Inter', 'Noto Sans Bengali', system-ui, sans-serif;
```

Dark mode is applied via `[data-theme="dark"]` on `<html>`.

---

## State Management

### App Store (`stores/index.ts`)
```ts
const appStore = useAppStore()
appStore.toggleTheme()   // switches dark ↔ light
appStore.setLocale('bn') // 'en' | 'bn'
```

### Concerns Store (`stores/index.ts`)
```ts
const store = useConcernsStore()
store.filtered          // reactive computed list (search + filter + sort)
store.toggleVote(id)    // live upvote / unvote
store.addConcern({...}) // add a new concern
```

### Toast Store (`stores/toast.ts`)
```ts
const toast = useToastStore()
toast.show('Submitted!', 'success')  // 'success' | 'error' | 'info'
```

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server at `localhost:5173` |
| `build` | `npm run build` | TypeScript check + production bundle |
| `preview` | `npm run preview` | Preview production bundle locally |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit with conventional commits: `git commit -m "feat: add map view"`
4. Push and open a Pull Request

---

## Team

| Name | Contact |
|---|---|
| **Md Shahadat Hossain** | [mdsahadathossainemon@gmail.com](mailto:mdsahadathossainemon@gmail.com) |
| **Ahmad Jamil** | [ahmadjamilwork2001@gmail.com](mailto:ahmadjamilwork2001@gmail.com) |
| **Rahat Hossain Himel** | [himelhasan1215@gmail.com](mailto:himelhasan1215@gmail.com) |

---

<p align="center">
  <sub>Built with ❤️ for the citizens of Dhaka — আওয়াজ তুলুন, পরিবর্তন আনুন।</sub>
</p>
