import { supabase } from '../lib/supabase'

export const BUCKET_NAME = 'concern-images'
export const MAX_FILE_SIZE_MB = 5
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export interface FileValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates file type and max file size before upload.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file type "${file.type || 'unknown'}". Only JPG, PNG, WEBP, and GIF images are allowed.`,
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`,
    }
  }

  return { valid: true }
}

/**
 * Uploads a single image to the Supabase Storage bucket 'concern-images'.
 * Path format: concerns/<userId>/<timestamp>_<random>.<ext>
 *
 * @param file The image file to upload
 * @param userId Unique identifier for the user or session
 * @returns Public URL of the uploaded image file
 */
export async function uploadConcernImage(file: File, userId: string = 'anon'): Promise<string> {
  // Validate file before initiating request
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
  }

  const fileExt = file.name.split('.').pop() || 'jpg'
  const uniqueId = Math.random().toString(36).substring(2, 9)
  const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
  const fileName = `${Date.now()}_${uniqueId}.${fileExt}`
  const filePath = `concerns/${sanitizedUserId}/${fileName}`

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('[Supabase Storage Error]:', error)
    throw new Error(`Upload to Supabase Storage failed: ${error.message}`)
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Could not retrieve public URL from Supabase Storage.')
  }

  return publicUrlData.publicUrl
}

/**
 * Uploads multiple images to Supabase Storage sequentially or concurrently.
 */
export async function uploadMultipleConcernImages(files: File[], userId: string = 'anon'): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const url = await uploadConcernImage(file, userId)
    urls.push(url)
  }
  return urls
}
