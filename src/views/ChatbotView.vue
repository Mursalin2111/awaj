<template>
  <div class="chatbot-page">
    <div class="container chatbot-inner">

      <!-- Header -->
      <div class="chatbot-header">
        <span class="badge badge-primary">🤖 Constitutional Chatbot</span>
        <h1>Bangla-first Rights Guidance</h1>
        <p>Retrieval-augmented answers from the Bangladesh Constitution. Ask about your rights, Article numbers, or civic situations.</p>
      </div>

      <!-- Chat Window -->
      <div class="chat-window card">
        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['msg', msg.role === 'user' ? 'msg-user' : 'msg-bot']"
          >
            <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
            <div class="msg-bubble">
              <p style="white-space: pre-line;">{{ msg.text }}</p>
              <span v-if="msg.citation" class="citation">📜 {{ msg.citation }}</span>
              <RouterLink v-if="msg.actionLink" :to="msg.actionLink" class="btn btn-primary btn-sm chat-action-btn">
                Open Page →
              </RouterLink>
            </div>
          </div>

          <!-- Thinking indicator -->
          <div class="msg msg-bot" v-if="thinking">
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble thinking"><span></span><span></span><span></span></div>
          </div>
        </div>

        <!-- Input Row -->
        <div class="chat-input-row">
          <input
            v-model="input"
            class="form-input chat-input"
            type="text"
            placeholder="Ask about a right, an Article number, or a civic situation..."
            @keyup.enter="sendMessage"
            id="chatbot-input"
            :disabled="thinking"
            autocomplete="off"
          />
          <button
            class="btn btn-primary send-btn"
            @click="sendMessage"
            :disabled="!input.trim() || thinking"
            id="send-btn"
          >
            <svg v-if="!thinking" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span v-else class="spinner-sm"></span>
          </button>
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="quick-prompts">
        <p class="prompt-label">💡 Try asking:</p>
        <div class="prompt-chips">
          <button
            class="prompt-chip"
            v-for="q in quickPrompts"
            :key="q"
            @click="usePrompt(q)"
            :disabled="thinking"
          >{{ q }}</button>
        </div>
      </div>

      <!-- Info bar -->
      <div class="info-bar">
        <span>⚠️ This chatbot provides general legal information only — not legal advice. Always consult a qualified lawyer for your specific situation.</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

interface Message {
  role: 'user' | 'bot'
  text: string
  citation?: string
  actionLink?: string
}

const input = ref('')
const thinking = ref(false)
const messagesEl = ref<HTMLElement>()
const messages = ref<Message[]>([
  {
    role: 'bot',
    text: 'আসসালামু আলাইকুম! Ask me anything about your Fundamental Rights under the Bangladesh Constitution or how to use Awaz in real-time!',
    citation: 'Awaz Real-Time Constitutional & Civic Assistant'
  }
])

const quickPrompts = [
  '🌤️ Weather in Dhaka today',
  '🚇 Tell me about Dhaka Metro Rail',
  '⚖️ What are my fundamental rights?',
  '📋 How many concerns are reported on Awaz?',
  '🔒 Who can see my reported concerns?'
]

async function sendMessage() {
  const text = input.value.trim()
  if (!text || thinking.value) return

  // Push user message
  messages.value.push({ role: 'user', text })
  input.value = ''
  thinking.value = true
  await nextTick()
  scrollToBottom()

  try {
    // Real-time backend query
    const res = await api.post('/chatbot/ask', { question: text })
    const fullAnswer = res.data.answer || 'No response available.'
    const citation = res.data.citation
    const actionLink = res.data.actionLink

    thinking.value = false

    // Push bot message container
    const botMsgIndex = messages.value.length
    messages.value.push({
      role: 'bot',
      text: '',
      citation,
      actionLink
    })

    // Real-time streaming character typing effect
    let charIdx = 0
    const chunkSize = 3
    const interval = setInterval(() => {
      if (charIdx < fullAnswer.length) {
        messages.value[botMsgIndex].text += fullAnswer.slice(charIdx, charIdx + chunkSize)
        charIdx += chunkSize
        scrollToBottom()
      } else {
        messages.value[botMsgIndex].text = fullAnswer
        clearInterval(interval)
        scrollToBottom()
      }
    }, 15)

  } catch (err) {
    console.error('Chatbot error:', err)
    thinking.value = false
    messages.value.push({
      role: 'bot',
      text: 'Sorry, I had trouble connecting to the real-time assistant. Please check your internet connection.',
      citation: 'Awaz Network Diagnostic'
    })
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
}

function usePrompt(q: string) {
  if (thinking.value) return
  input.value = q
  sendMessage()
}
</script>

<style scoped>
.chatbot-page {
  padding-block: 2.5rem 4rem;
  min-height: calc(100vh - 64px);
  background: var(--color-bg);
}

.chatbot-inner {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Header */
.chatbot-header {
  text-align: center;
  padding-bottom: .5rem;
}
.chatbot-header h1 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  margin-block: .625rem .375rem;
  letter-spacing: -.02em;
}
.chatbot-header p {
  color: var(--color-text-muted);
  font-size: .9rem;
  max-width: 520px;
  margin-inline: auto;
  line-height: 1.6;
}

/* Chat window */
.chat-window {
  display: flex;
  flex-direction: column;
  height: clamp(420px, 55vh, 560px);
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;
}

/* Scrollbar inside chat */
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 99px; }

/* Messages */
.msg {
  display: flex;
  gap: .75rem;
  align-items: flex-start;
  animation: msgIn .2s ease both;
}
.msg-user { flex-direction: row-reverse; }

@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.msg-avatar {
  font-size: 1.2rem;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  margin-top: .1rem;
}

.msg-bubble {
  max-width: 72%;
  padding: .8rem 1rem;
  border-radius: var(--radius-lg);
  font-size: .875rem;
  line-height: 1.7;
}
.msg-bot .msg-bubble {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-top-left-radius: 4px;
  color: var(--color-text);
}
.msg-user .msg-bubble {
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg-bubble p { margin: 0; }
.citation {
  display: block;
  font-size: .72rem;
  margin-top: .5rem;
  opacity: .65;
  font-style: italic;
}
.chat-action-btn {
  margin-top: .6rem;
  display: inline-flex;
  font-size: .75rem;
  padding: .3rem .75rem;
}

/* Thinking dots */
.thinking {
  display: flex;
  gap: .35rem;
  align-items: center;
  padding: .9rem 1rem !important;
  min-width: 64px;
}
.thinking span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce .8s ease infinite;
  flex-shrink: 0;
}
.thinking span:nth-child(2) { animation-delay: .15s; }
.thinking span:nth-child(3) { animation-delay: .3s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Input row */
.chat-input-row {
  display: flex;
  gap: .625rem;
  padding: .875rem 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}
.chat-input {
  flex: 1;
  border-radius: var(--radius-full) !important;
  padding-inline: 1rem !important;
}
.send-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Spinner in send button */
.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Quick prompts */
.quick-prompts { }
.prompt-label {
  font-size: .8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: .625rem;
}
.prompt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
.prompt-chip {
  padding: .45rem 1rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  font-size: .8rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.prompt-chip:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  transform: translateY(-1px);
}
.prompt-chip:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* Info bar */
.info-bar {
  font-size: .75rem;
  color: var(--color-text-subtle);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: .625rem 1rem;
  text-align: center;
  line-height: 1.5;
}
</style>
