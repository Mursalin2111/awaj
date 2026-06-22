<template>
  <div class="chatbot-page">
    <div class="container chatbot-inner">
      <div class="chatbot-header">
        <span class="badge badge-primary">🤖 Constitutional Chatbot</span>
        <h1>Bangla-first Rights Guidance</h1>
        <p>Retrieval-augmented answers from the Bangladesh Constitution. Ask about your rights, Article numbers, or civic situations.</p>
      </div>

      <div class="chat-window card">
        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['msg', msg.role === 'user' ? 'msg-user' : 'msg-bot']"
          >
            <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
            <div class="msg-bubble">
              <p>{{ msg.text }}</p>
              <span v-if="msg.citation" class="citation">📜 Cited: {{ msg.citation }}</span>
            </div>
          </div>
          <div class="msg msg-bot" v-if="thinking">
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble thinking"><span></span><span></span><span></span></div>
          </div>
        </div>
        <div class="chat-input-row">
          <input
            v-model="input"
            class="form-input chat-input"
            type="text"
            placeholder="Ask about a right, an Article number, or a situation..."
            @keyup.enter="sendMessage"
            id="chatbot-input"
            :disabled="thinking"
          />
          <button class="btn btn-primary send-btn" @click="sendMessage" :disabled="!input.trim() || thinking" id="send-btn">
            {{ thinking ? '...' : 'Ask' }}
          </button>
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="quick-prompts">
        <p class="prompt-label">Try asking:</p>
        <div class="prompt-chips">
          <button class="prompt-chip" v-for="q in quickPrompts" :key="q" @click="usePrompt(q)">{{ q }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message { role: 'user' | 'bot'; text: string; citation?: string }

const input = ref('')
const thinking = ref(false)
const messagesEl = ref<HTMLElement>()
const messages = ref<Message[]>([
  { role: 'bot', text: 'আমাকে বাংলাদেশ সংবিধান সম্পর্কে জিজ্ঞেস করুন। Ask me about your rights under the Bangladesh Constitution. I\'ll answer with inline citations like [Article 33].', citation: 'Constitution of Bangladesh, Part III — Fundamental Rights' }
])

const quickPrompts = ['What are my fundamental rights?', 'Article 32 — Right to life', 'Can police detain me without reason?', 'Right to free speech in Bangladesh']

const mockResponses: Record<string, { text: string; citation: string }> = {
  default: {
    text: 'Under the Constitution of Bangladesh [Article 27], all citizens are equal before law and entitled to equal protection of law. The State shall not discriminate against any citizen on the grounds of religion, race, caste, sex, or place of birth.',
    citation: 'Constitution of Bangladesh, Article 27 — Equality before law'
  },
  'fundamental rights': {
    text: 'The fundamental rights guaranteed under Part III of the Bangladesh Constitution include: Right to equality [Art 27], Protection against discrimination [Art 28], Right to life and personal liberty [Art 32], Protection against arbitrary arrest and detention [Art 33], and Freedom of thought and conscience [Art 39].',
    citation: 'Constitution of Bangladesh, Part III (Articles 27-44) — Fundamental Rights'
  },
  'article 32': {
    text: 'Article 32 guarantees that no person shall be deprived of life or personal liberty save in accordance with law. This is one of the most fundamental protections ensuring the state cannot arbitrarily take away a person\'s life or freedom.',
    citation: 'Constitution of Bangladesh, Article 32 — Protection of right to life and personal liberty'
  },
  'detain': {
    text: 'Under Article 33, a person who is arrested shall be informed of the grounds of arrest and shall not be denied the right to consult and be defended by a legal practitioner of his choice. Every person who is arrested and detained in custody shall be produced before the nearest magistrate within twenty-four hours.',
    citation: 'Constitution of Bangladesh, Article 33 — Safeguards as to arrest and detention'
  },
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || thinking.value) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  thinking.value = true
  await nextTick()
  messagesEl.value?.scrollTo({ top: 9999, behavior: 'smooth' })

  await new Promise(r => setTimeout(r, 1400))

  const key = Object.keys(mockResponses).find(k => text.toLowerCase().includes(k)) || 'default'
  const resp = mockResponses[key]
  messages.value.push({ role: 'bot', text: resp.text, citation: resp.citation })
  thinking.value = false
  await nextTick()
  messagesEl.value?.scrollTo({ top: 9999, behavior: 'smooth' })
}

function usePrompt(q: string) { input.value = q; sendMessage() }
</script>

<style scoped>
.chatbot-page { padding-block: 2rem 4rem; }
.chatbot-inner { max-width: 760px; }
.chatbot-header { text-align: center; margin-bottom: 2rem; }
.chatbot-header h1 { font-size: 1.75rem; font-weight: 800; margin-block: .5rem; }
.chatbot-header p { color: var(--color-text-muted); font-size: .9rem; }

.chat-window { display: flex; flex-direction: column; height: 480px; overflow: hidden; }
.chat-messages { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.msg { display: flex; gap: .75rem; align-items: flex-start; }
.msg-user { flex-direction: row-reverse; }
.msg-avatar { font-size: 1.25rem; flex-shrink: 0; }
.msg-bubble {
  max-width: 75%;
  padding: .75rem 1rem;
  border-radius: var(--radius-lg);
  font-size: .9rem;
  line-height: 1.65;
}
.msg-bot .msg-bubble { background: var(--color-surface-2); border: 1px solid var(--color-border); border-top-left-radius: 4px; }
.msg-user .msg-bubble { background: var(--color-primary); color: #fff; border-bottom-right-radius: 4px; }
.citation { display: block; font-size: .75rem; margin-top: .5rem; opacity: .7; font-style: italic; }

/* Thinking dots */
.thinking { display: flex; gap: .35rem; align-items: center; padding: 1rem !important; }
.thinking span { width: 8px; height: 8px; border-radius: 50%; background: var(--color-primary); animation: bounce .8s ease infinite; }
.thinking span:nth-child(2) { animation-delay: .15s; }
.thinking span:nth-child(3) { animation-delay: .3s; }
@keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

.chat-input-row { display: flex; gap: .5rem; padding: 1rem; border-top: 1px solid var(--color-border); }
.chat-input { flex: 1; }
.send-btn { flex-shrink: 0; }

/* Quick prompts */
.quick-prompts { margin-top: 1.25rem; }
.prompt-label { font-size: .8rem; color: var(--color-text-muted); margin-bottom: .625rem; }
.prompt-chips { display: flex; flex-wrap: wrap; gap: .5rem; }
.prompt-chip { padding: .4rem .875rem; border-radius: var(--radius-full); border: 1.5px solid var(--color-border); background: var(--color-surface); font-size: .8rem; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-fast); }
.prompt-chip:hover { border-color: var(--color-primary); color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 8%, transparent); }
</style>
