<template>
  <div class="submit-page">
    <div class="container">
      <div class="submit-header">
        <RouterLink to="/concerns" class="back-link">← Back to Concerns</RouterLink>
        <h1>Report a Concern</h1>
        <p>Help improve Dhaka by reporting local issues. Please provide clear details and photos.</p>
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
                <span v-else>📍 Detect Real-time GPS</span>
              </button>
            </div>
            <div class="preset-row">
              <span class="preset-label">Quick Dhaka presets:</span>
              <button
                type="button"
                v-for="loc in quickLocations"
                :key="loc"
                class="preset-chip"
                @click="form.location = loc + ', Dhaka'"
              >
                {{ loc }}
              </button>
            </div>
            <span v-if="gpsStatus" class="form-hint" :class="{ 'hint-success': gpsSuccess, 'hint-error': !gpsSuccess }">{{ gpsStatus }}</span>
          </div>

          <!-- Photos Upload Section -->
          <div class="form-group">
            <div class="photo-header">
              <label class="form-label">Attach Photos (optional)</label>
              <span class="photo-count">{{ photos.length }}/4 photos</span>
            </div>
            
            <input
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              class="hidden-file-input"
              @change="handleFileChange"
            />

            <!-- Dropzone -->
            <div
              v-if="photos.length < 4"
              class="photo-dropzone"
              @dragover.prevent
              @dragenter.prevent
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <span class="upload-icon">📷</span>
              <div class="upload-text">
                <p class="upload-title"><strong>Click to upload photos</strong> or drag & drop</p>
                <p class="upload-sub">Supports JPG, PNG, WEBP (Max 4 photos)</p>
              </div>
            </div>

            <!-- Image Thumbnails Grid -->
            <div v-if="photos.length > 0" class="photo-preview-grid">
              <div v-for="(img, idx) in photos" :key="idx" class="photo-thumb-card">
                <img :src="img" alt="Concern photo preview" />
                <button type="button" class="remove-photo-btn" @click.stop="removePhoto(idx)" title="Remove image">
                  ✕
                </button>
                <span class="thumb-badge">Photo {{ idx + 1 }}</span>
              </div>
            </div>

            <div v-if="processingPhotos" class="processing-hint">
              <span class="spinner"></span> Processing image files...
            </div>
          </div>

          <!-- Login notice -->
          <div v-if="!authStore.isLoggedIn" class="login-notice">
            <p>⚠️ You need to <RouterLink to="/login">log in</RouterLink> before submitting a concern.</p>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="submitting || processingPhotos || !authStore.isLoggedIn" id="submit-btn">
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
              <li>Attach clear photos showing the issue from multiple angles</li>
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
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import api from '../services/api'

const store = useConcernsStore()
const authStore = useAuthStore()
const toast = useToastStore()

const categories = ['Roads & Potholes', 'Streetlights', 'Water & Drainage', 'Waste & Sanitation', 'Public Safety', 'Parks & Spaces']
const quickLocations = ['Mirpur 10', 'Dhanmondi 27', 'Gulshan 1', 'Uttara Sec 3', 'Farmgate', 'Mohakhali']

const form = reactive({ title: '', category: '', description: '', location: '' })
const photos = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const processingPhotos = ref(false)

const submitting = ref(false)
const submitted = ref(false)
const gpsLoading = ref(false)
const gpsStatus = ref('')
const gpsSuccess = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function removePhoto(index: number) {
  photos.value.splice(index, 1)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFiles(Array.from(target.files))
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

async function processFiles(files: File[]) {
  const imageFiles = files.filter(f => f.type.startsWith('image/')).slice(0, 4 - photos.value.length)
  if (imageFiles.length === 0) {
    toast.show('Please select valid image files (JPG, PNG, WEBP)', 'error')
    return
  }

  processingPhotos.value = true
  for (const file of imageFiles) {
    try {
      const base64 = await resizeAndCompressImage(file)
      if (photos.value.length < 4) {
        photos.value.push(base64)
      }
    } catch (e) {
      console.error('Error processing image:', e)
      toast.show('Failed to process image file', 'error')
    }
  }
  processingPhotos.value = false
}

function resizeAndCompressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function detectLocation() {
  gpsLoading.value = true
  gpsStatus.value = 'Detecting real-time location...'

  const applyGeocode = async (lat?: number, lon?: number, sourceName = 'GPS') => {
    try {
      const res = await api.get('/concerns/geocode', { params: { lat, lon } })
      const locText = res.data.location || 'Dhaka, Bangladesh'
      form.location = locText
      gpsStatus.value = `✓ ${locText}`
      gpsSuccess.value = true
      toast.show(`Location detected (${sourceName})!`, 'success')
    } catch {
      form.location = 'Mirpur 10, Dhaka'
      gpsStatus.value = '✓ Mirpur 10, Dhaka'
      gpsSuccess.value = true
    } finally {
      gpsLoading.value = false
    }
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyGeocode(pos.coords.latitude, pos.coords.longitude, 'Real-time GPS')
      },
      () => {
        // Fallback to server IP geocode seamlessly
        applyGeocode(undefined, undefined, 'Network IP')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )
  } else {
    applyGeocode(undefined, undefined, 'Network IP')
  }
}

async function handleSubmit() {
  submitting.value = true
  try {
    await store.addConcern({
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      photos: photos.value,
    })
    submitted.value = true
    toast.show('Concern submitted successfully with photos!', 'success')
    Object.assign(form, { title: '', category: '', description: '', location: '' })
    photos.value = []
  } catch (error: any) {
    if (error.message === 'LOGIN_REQUIRED') {
      toast.show('Please log in to submit a concern', 'info')
    } else {
      toast.show('Failed to submit concern. Please try again.', 'error')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.submit-page { padding-block: 2rem 4rem; }
.submit-header { margin-bottom: 2rem; }
.back-link { display: inline-flex; align-items: center; gap: .35rem; font-size: .875rem; font-weight: 500; color: var(--color-text-muted); text-decoration: none; margin-bottom: 1rem; transition: color var(--transition-fast); }
.back-link:hover { color: var(--color-primary); }
.submit-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: .375rem; }
.submit-header p { color: var(--color-text-muted); }

.submit-layout { display: grid; gap: 2rem; }
@media (min-width: 900px) { .submit-layout { grid-template-columns: 1fr 320px; } }

.submit-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-hint { font-size: .78rem; color: var(--color-text-subtle); }
.hint-success { color: var(--color-success) !important; }
.hint-error { color: var(--color-danger) !important; }

.location-row { display: flex; gap: .5rem; }
.location-row .form-input { flex: 1; }
.gps-btn { white-space: nowrap; flex-shrink: 0; }

.preset-row { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; margin-top: .5rem; }
.preset-label { font-size: .75rem; color: var(--color-text-subtle); font-weight: 500; }
.preset-chip {
  font-size: .72rem;
  padding: .2rem .55rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.preset-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.hidden-file-input { display: none; }

.photo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .375rem; }
.photo-count { font-size: .75rem; color: var(--color-text-muted); font-weight: 600; }

.photo-dropzone {
  background: var(--color-surface-2);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all var(--transition-fast);
}
.photo-dropzone:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface-2));
}
.upload-icon { font-size: 2rem; flex-shrink: 0; }
.upload-text { text-align: left; }
.upload-title { font-size: .9rem; color: var(--color-text); margin-bottom: .2rem; }
.upload-sub { font-size: .75rem; color: var(--color-text-muted); }

.photo-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: .75rem;
  margin-top: .75rem;
}
.photo-thumb-card {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: #000;
}
.photo-thumb-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  font-size: .75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}
.remove-photo-btn:hover { background: var(--color-danger); }
.thumb-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: .65rem;
  padding: 2px 6px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.processing-hint {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .8rem;
  color: var(--color-primary);
  margin-top: .5rem;
}

.login-notice {
  background: color-mix(in srgb, var(--color-warning) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-warning) 30%, transparent);
  border-radius: var(--radius-md); padding: .75rem 1rem;
  font-size: .875rem; color: var(--color-text-muted);
}
.login-notice a { color: var(--color-primary); font-weight: 600; }

.submit-btn { width: 100%; justify-content: center; gap: .5rem; }

.success-msg {
  display: flex; align-items: center; gap: .75rem;
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent);
  border-radius: var(--radius-md); padding: .875rem 1rem; font-size: .9rem;
}
.success-msg a { color: var(--color-primary); font-weight: 600; }
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.tips-card { margin-bottom: 1rem; }
.tips-card h3 { font-size: .95rem; font-weight: 700; margin-bottom: .875rem; }
.tips-card ul, .tips-card ol { padding-left: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
.tips-card li { font-size: .85rem; color: var(--color-text-muted); line-height: 1.5; }
</style>
