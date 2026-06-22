<template>
  <div class="submit-page">
    <div class="container">
      <div class="submit-header">
        <RouterLink to="/concerns" class="back-link">← Back to Concerns</RouterLink>
        <h1>Report a Concern</h1>
        <p>Help improve Dhaka by reporting local issues. Please provide clear details.</p>
      </div>

      <div class="submit-layout">
        <form class="submit-form card card-body" @submit.prevent="handleSubmit" id="submit-concern-form">
          <!-- Title -->
          <div class="form-group">
            <label class="form-label" for="concern-title">Title *</label>
            <input
              id="concern-title"
              v-model="form.title"
              class="form-input"
              type="text"
              placeholder="e.g., Broken streetlight on Mirpur 10"
              required
              minlength="5"
            />
            <span class="form-hint">At least 5 characters</span>
          </div>

          <!-- Category -->
          <div class="form-group">
            <label class="form-label" for="concern-category">Category *</label>
            <select id="concern-category" v-model="form.category" class="form-select" required>
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label" for="concern-desc">Description *</label>
            <textarea
              id="concern-desc"
              v-model="form.description"
              class="form-textarea"
              rows="4"
              placeholder="Provide details like nearest landmark (e.g. opposite to Square Hospital)..."
              required
            ></textarea>
          </div>

          <!-- Location -->
          <div class="form-group">
            <label class="form-label" for="concern-location">Location *</label>
            <div class="location-row">
              <input
                id="concern-location"
                v-model="form.location"
                class="form-input"
                type="text"
                placeholder="e.g., Mirpur 10, Dhaka"
                required
              />
              <button type="button" class="btn btn-outline btn-sm gps-btn" @click="detectLocation" :disabled="gpsLoading">
                <span v-if="gpsLoading" class="spinner"></span>
                <span v-else>📍 GPS</span>
              </button>
            </div>
            <span v-if="gpsStatus" class="form-hint" :class="{ 'hint-success': gpsSuccess, 'hint-error': !gpsSuccess }">{{ gpsStatus }}</span>
          </div>

          <!-- Photos note -->
          <div class="form-group">
            <label class="form-label">Photos (optional)</label>
            <div class="photo-upload">
              <span>📷</span>
              <p>Photo upload will be available after sign-in.</p>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="submitting" id="submit-btn">
            <span v-if="submitting" class="spinner"></span>
            <span v-else>Submit Concern</span>
          </button>

          <!-- Success -->
          <Transition name="fade">
            <div class="success-msg" v-if="submitted">
              <span>✅</span>
              <p>Concern submitted successfully! <RouterLink to="/concerns">View all concerns</RouterLink></p>
            </div>
          </Transition>
        </form>

        <!-- Tips sidebar -->
        <aside class="submit-tips">
          <div class="card card-body tips-card">
            <h3>📋 Tips for a great report</h3>
            <ul>
              <li>Be specific about the location (nearest landmark or intersection)</li>
              <li>Describe the problem clearly — who is affected and how severely</li>
              <li>Attach photos if possible (available after sign-in)</li>
              <li>Choose the right category so it reaches the correct authority</li>
              <li>Check if a similar concern has already been reported</li>
            </ul>
          </div>
          <div class="card card-body tips-card">
            <h3>⏱️ What happens next?</h3>
            <ol>
              <li>Your concern is publicly listed and open for upvotes</li>
              <li>Authorities receive notification within minutes</li>
              <li>First official status update within 72 hours</li>
              <li>Track resolution in real-time via the concern page</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useConcernsStore } from '../stores'
import { useToastStore } from '../stores/toast'

const store = useConcernsStore()
const toast = useToastStore()

const categories = ['Roads & Potholes', 'Streetlights', 'Water & Drainage', 'Waste & Sanitation', 'Public Safety', 'Parks & Spaces']

const form = reactive({ title: '', category: '', description: '', location: '' })
const submitting = ref(false)
const submitted = ref(false)
const gpsLoading = ref(false)
const gpsStatus = ref('')
const gpsSuccess = ref(false)

async function detectLocation() {
  if (!navigator.geolocation) { gpsStatus.value = 'Geolocation not supported.'; return }
  gpsLoading.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.location = `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
      gpsStatus.value = '✓ Location detected'
      gpsSuccess.value = true
      gpsLoading.value = false
    },
    () => {
      gpsStatus.value = 'Could not detect location. Please check permissions.'
      gpsSuccess.value = false
      gpsLoading.value = false
    }
  )
}

async function handleSubmit() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 900))
  store.addConcern({
    title: form.title,
    description: form.description,
    category: form.category,
    status: 'submitted',
    location: form.location,
    createdAt: new Date().toISOString().split('T')[0],
    author: 'You',
    photos: [],
  })
  submitting.value = false
  submitted.value = true
  toast.show('Concern submitted successfully!', 'success')
  Object.assign(form, { title: '', category: '', description: '', location: '' })
}
</script>

<style scoped>
.submit-page { padding-block: 2rem 4rem; }
.submit-header { margin-bottom: 2rem; }
.back-link { display: inline-flex; align-items: center; gap: .35rem; font-size: .875rem; font-weight: 500; color: var(--color-text-muted); text-decoration: none; margin-bottom: 1rem; transition: color var(--transition-fast); }
.back-link:hover { color: var(--color-primary); }
.submit-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: .375rem; }
.submit-header p { color: var(--color-text-muted); }

.submit-layout {
  display: grid;
  gap: 2rem;
}
@media (min-width: 900px) { .submit-layout { grid-template-columns: 1fr 320px; } }

.submit-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-hint { font-size: .78rem; color: var(--color-text-subtle); }
.hint-success { color: var(--color-success) !important; }
.hint-error { color: var(--color-danger) !important; }

.location-row { display: flex; gap: .5rem; }
.location-row .form-input { flex: 1; }
.gps-btn { white-space: nowrap; flex-shrink: 0; }

.photo-upload {
  background: var(--color-surface-2);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: .875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .375rem;
}
.photo-upload span { font-size: 1.5rem; }

.submit-btn { width: 100%; justify-content: center; gap: .5rem; }

.success-msg {
  display: flex; align-items: center; gap: .75rem;
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent);
  border-radius: var(--radius-md);
  padding: .875rem 1rem;
  font-size: .9rem;
}
.success-msg a { color: var(--color-primary); font-weight: 600; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Tips */
.tips-card { margin-bottom: 1rem; }
.tips-card h3 { font-size: .95rem; font-weight: 700; margin-bottom: .875rem; }
.tips-card ul, .tips-card ol { padding-left: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
.tips-card li { font-size: .85rem; color: var(--color-text-muted); line-height: 1.5; }
</style>
