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
              <p>{{ msg.text }}</p>
              <span v-if="msg.citation" class="citation">📜 {{ msg.citation }}</span>
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

interface Message { role: 'user' | 'bot'; text: string; citation?: string }

const input = ref('')
const thinking = ref(false)
const messagesEl = ref<HTMLElement>()
const messages = ref<Message[]>([
  {
    role: 'bot',
    text: 'আমাকে বাংলাদেশ সংবিধান সম্পর্কে জিজ্ঞেস করুন। Ask me about your rights under the Bangladesh Constitution — I\'ll answer with inline citations like [Article 33].',
    citation: 'Constitution of Bangladesh, Part III — Fundamental Rights'
  }
])

const quickPrompts = [
  'What are my fundamental rights?',
  'Article 32 — Right to life',
  'Can police detain me without reason?',
  'Right to free speech in Bangladesh'
]

// Each entry has a list of keywords and a response.
// The matcher scores every entry and picks the best match.
const knowledgeBase: { keywords: string[]; text: string; citation: string }[] = [
  {
    keywords: ['fundamental right', 'basic right', 'what rights', 'my rights', 'all rights', 'rights do i have'],
    text: 'The fundamental rights guaranteed under Part III of the Bangladesh Constitution include:\n\n• Right to equality before law [Art 27]\n• Protection against discrimination [Art 28]\n• Right to life and personal liberty [Art 32]\n• Protection against arbitrary arrest and detention [Art 33]\n• Freedom of thought, conscience and speech [Art 39]\n• Right to assemble peacefully [Art 37]\n• Right to form associations [Art 38]',
    citation: 'Constitution of Bangladesh, Part III (Articles 27–44) — Fundamental Rights'
  },
  {
    keywords: ['article 27', 'equality', 'equal before law', 'equal protection'],
    text: 'Under Article 27 of the Bangladesh Constitution, all citizens are equal before law and are entitled to equal protection of law. The State shall not discriminate against any citizen on grounds of religion, race, caste, sex, or place of birth.',
    citation: 'Constitution of Bangladesh, Article 27 — Equality before law'
  },
  {
    keywords: ['article 28', 'discrimination', 'discriminate', 'gender', 'religion', 'caste', 'race'],
    text: 'Article 28 prohibits the State from discriminating against any citizen on grounds of religion, race, caste, sex, or place of birth. Women shall have equal rights with men in all spheres of the State and public life.',
    citation: 'Constitution of Bangladesh, Article 28 — Discrimination on grounds of religion, etc.'
  },
  {
    keywords: ['article 32', 'right to life', 'life', 'personal liberty', 'liberty'],
    text: 'Article 32 guarantees that no person shall be deprived of life or personal liberty save in accordance with law. This is one of the most fundamental protections — the state cannot arbitrarily take away a person\'s life or freedom without due legal process.',
    citation: 'Constitution of Bangladesh, Article 32 — Protection of right to life and personal liberty'
  },
  {
    keywords: ['article 33', 'arrest', 'detain', 'detention', 'police', 'custody', 'magistrate', 'lawyer', 'legal practitioner'],
    text: 'Under Article 33, a person who is arrested:\n\n• Must be informed of the grounds of arrest immediately\n• Cannot be denied the right to consult and be defended by a lawyer of their choice\n• Must be produced before the nearest magistrate within 24 hours of arrest\n• Shall not be detained beyond this period without a magistrate\'s order\n\nPolice cannot detain you arbitrarily without stating a reason.',
    citation: 'Constitution of Bangladesh, Article 33 — Safeguards as to arrest and detention'
  },
  {
    keywords: ['article 39', 'free speech', 'freedom of speech', 'expression', 'press', 'media', 'speech', 'thought', 'conscience'],
    text: 'Article 39 guarantees freedom of thought, conscience and speech. Every citizen has the right to freedom of speech and expression, and freedom of the press — subject to reasonable restrictions for national security, public order, decency, morality, contempt of court, defamation, or incitement to an offence.',
    citation: 'Constitution of Bangladesh, Article 39 — Freedom of thought, conscience and speech'
  },
  {
    keywords: ['article 37', 'assemble', 'assembly', 'gathering', 'protest', 'demonstration', 'rally'],
    text: 'Article 37 guarantees every citizen the right to assemble and participate in public meetings and processions peacefully and without arms, subject to any reasonable restrictions imposed by law in the interests of public order or public health.',
    citation: 'Constitution of Bangladesh, Article 37 — Freedom of assembly'
  },
  {
    keywords: ['article 38', 'association', 'union', 'organization', 'form association', 'join'],
    text: 'Article 38 gives citizens the right to form associations or unions, subject to any reasonable restrictions imposed by law in the interests of morality or public order. No citizen can be compelled to join any association.',
    citation: 'Constitution of Bangladesh, Article 38 — Freedom of association'
  },
  {
    keywords: ['article 31', 'protection of law', 'right to protection', 'rule of law'],
    text: 'Article 31 declares that it is the right of every citizen to enjoy the protection of the law, and to be treated in accordance with law. In particular, no action detrimental to the life, liberty, body, reputation or property of any person shall be taken except in accordance with law.',
    citation: 'Constitution of Bangladesh, Article 31 — Right to protection of law'
  },
  {
    keywords: ['report concern', 'submit issue', 'report issue', 'how to report', 'report problem', 'file complaint'],
    text: 'On Awaz, you can report a civic concern in 3 simple steps:\n\n1. 📍 Go to "Report a Concern" and drop a GPS pin on the map\n2. ✍️ Describe the issue clearly, choose a category, and attach a photo if available\n3. 🔍 Track the real-time status — officials are expected to respond within 72 hours\n\nAll submitted concerns are public and trackable by the community.',
    citation: 'Awaz — Civic Reporting Platform Guidelines'
  },
  {
    keywords: ['right to vote', 'vote', 'election', 'electoral', 'article 122'],
    text: 'Article 122 of the Bangladesh Constitution guarantees every citizen aged 18 or above the right to vote in elections to Parliament, provided they are not declared by law to be ineligible. This right is a cornerstone of democratic participation.',
    citation: 'Constitution of Bangladesh, Article 122 — Qualifications for voters'
  },
  {
    keywords: ['education', 'right to education', 'article 17', 'school', 'primary education'],
    text: 'Article 17 of the Bangladesh Constitution obligates the State to adopt effective measures to establish a uniform, mass-oriented and universal system of education and to extend free and compulsory education to all children to such stage as may be determined by law.',
    citation: 'Constitution of Bangladesh, Article 17 — Free and compulsory education'
  },
  {
    keywords: ['health', 'right to health', 'article 18', 'medical', 'healthcare'],
    text: 'Article 18 places an obligation on the State to regard the raising of the level of nutrition and the improvement of public health as among its primary duties. The State shall also endeavour to prevent the consumption of alcoholic and other intoxicating drinks and of drugs which are injurious to health.',
    citation: 'Constitution of Bangladesh, Article 18 — Public health and morality'
  },
]

function findBestResponse(userText: string): { text: string; citation: string } {
  const lower = userText.toLowerCase()
  let bestScore = 0
  let bestIdx = -1

  knowledgeBase.forEach((entry, idx) => {
    let score = 0
    entry.keywords.forEach(kw => {
      if (lower.includes(kw)) score++
    })
    if (score > bestScore) {
      bestScore = score
      bestIdx = idx
    }
  })

  if (bestIdx >= 0) return knowledgeBase[bestIdx]

  // Fallback
  return {
    text: 'I can answer questions about your rights under the Bangladesh Constitution — such as freedom of speech, right to life, protection from unlawful arrest, right to equality, and more. You can also ask me about how to report a civic concern on Awaz. Try one of the quick prompts below to get started!',
    citation: 'Awaz — Constitutional Rights Chatbot'
  }
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || thinking.value) return
  messages.value.push({ role: 'user', text })
  input.value = ''
  thinking.value = true
  await nextTick()
  scrollToBottom()

  await new Promise(r => setTimeout(r, 1200))

  const resp = findBestResponse(text)
  messages.value.push({ role: 'bot', text: resp.text, citation: resp.citation })
  thinking.value = false
  await nextTick()
  scrollToBottom()
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
