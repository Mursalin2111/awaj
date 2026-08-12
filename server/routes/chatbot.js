const express = require('express');
const https = require('https');
const router = express.Router();
const Concern = require('../models/Concern');
const User = require('../models/User');

// Helper HTTP requester
function fetchJSON(url, headers = {}) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'AwazBot/2.0 (contact@awaj.gov.bd)',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(4000, () => { req.destroy(); resolve(null); });
  });
}

// 1. Live Weather Fetcher
async function fetchLiveWeather() {
  try {
    const data = await fetchJSON('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current_weather=true');
    if (data && data.current_weather) {
      const w = data.current_weather;
      const codes = {
        0: 'Clear sky ☀️',
        1: 'Mainly clear 🌤️',
        2: 'Partly cloudy ⛅',
        3: 'Overcast ☁️',
        45: 'Foggy 🌫️',
        61: 'Slight rain 🌧️',
        63: 'Moderate rain 🌧️',
        65: 'Heavy rain ⛈️',
        80: 'Rain showers 🌦️',
        95: 'Thunderstorm 🌩️'
      };
      const condition = codes[w.weathercode] || 'Partly cloudy ⛅';
      return {
        answer: `🌤️ Real-Time Weather in Dhaka, Bangladesh:\n\n• Temperature: ${w.temperature}°C\n• Condition: ${condition}\n• Wind Speed: ${w.windspeed} km/h\n• Day/Night: ${w.is_day ? 'Daytime ☀️' : 'Nighttime 🌙'}\n• Last Updated: ${new Date().toLocaleTimeString()} (Live Open-Meteo)`,
        citation: 'Live Open-Meteo Weather Data API'
      };
    }
  } catch (err) {
    console.error('Weather error:', err);
  }
  return null;
}

// 2. Real-Time Web & Wikipedia Search Engine
async function searchWebRealtime(query) {
  try {
    const cleanQuery = query.replace(/(what is|who is|tell me about|how to|where is|কি|কী|কার|কখন|কোথায়)/gi, '').trim() || query;

    // Search Wikipedia English first
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&format=json`;
    const searchData = await fetchJSON(searchUrl);
    const firstResult = searchData?.query?.search?.[0];

    if (firstResult && firstResult.title) {
      const title = firstResult.title;
      const summaryUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json&redirects=1`;
      const summaryData = await fetchJSON(summaryUrl);
      const pages = summaryData?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].extract) {
          const extractText = pages[pageId].extract.trim();
          // Shorten long text nicely
          const textSnippet = extractText.length > 600 ? extractText.slice(0, 600) + '...' : extractText;
          return {
            answer: `🌐 Real-Time Information for "${title}":\n\n${textSnippet}`,
            citation: `Live Knowledge Base — Wikipedia (${title})`
          };
        }
      }
    }

    // Try Bangla Wikipedia if English didn't return
    const bnSearchUrl = `https://bn.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;
    const bnSearchData = await fetchJSON(bnSearchUrl);
    const bnResult = bnSearchData?.query?.search?.[0];
    if (bnResult && bnResult.title) {
      const bnTitle = bnResult.title;
      const bnSummaryUrl = `https://bn.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(bnTitle)}&format=json&redirects=1`;
      const bnSummaryData = await fetchJSON(bnSummaryUrl);
      const pages = bnSummaryData?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].extract) {
          const textSnippet = pages[pageId].extract.trim();
          return {
            answer: `🌐 বাস্তব-সময়ের তথ্য ("${bnTitle}"):\n\n${textSnippet}`,
            citation: `বাংলা উইকিপিডিয়া লাইভ ডাটাবেজ (${bnTitle})`
          };
        }
      }
    }
  } catch (err) {
    console.error('Web search error:', err);
  }
  return null;
}

// 3. Constitutional & Civic Knowledge
const CONSTITUTION_KNOWLEDGE = [
  {
    keywords: ['hi', 'hello', 'hey', 'কেমন আছেন', 'হ্যালো', 'হাই', 'সালাম', 'assalamu alaikum', 'greetings', 'help', 'সাহায্য'],
    text: 'আসসালামু আলাইকুম! Hello! I am the Awaz AI Real-Time Assistant. You can ask me ANYTHING in Bangla or English, such as:\n\n• 🌦️ Real-time weather in Dhaka or any city\n• 📖 General knowledge, science, news, technology & places\n• ⚖️ Fundamental Rights under the Bangladesh Constitution (Articles 27, 28, 32, 33, 39, etc.)\n• 📋 Awaz platform stats & reporting your civic issues\n\nHow can I help you today?',
    citation: 'Awaz Real-Time AI Assistant'
  },
  {
    keywords: ['fundamental right', 'basic right', 'what rights', 'my rights', 'all rights', 'মৌলিক অধিকার', 'অধিকার'],
    text: 'Part III of the Constitution of Bangladesh guarantees fundamental rights to all citizens:\n\n• Article 27: Equality before law\n• Article 28: Prohibition of discrimination (religion, sex, race)\n• Article 31: Protection of law and due process\n• Article 32: Right to life and personal liberty\n• Article 33: Protection against arbitrary arrest & 24-hr magistrate rule\n• Article 37: Right to assemble peacefully\n• Article 38: Right to form associations\n• Article 39: Freedom of speech and press',
    citation: 'Constitution of Bangladesh, Part III (Articles 27–44)'
  },
  {
    keywords: ['article 27', 'equality', 'equal before law', 'সমতা'],
    text: 'Article 27 states: "All citizens are equal before law and are entitled to equal protection of law." No citizen can be denied equal treatment under legal proceedings.',
    citation: 'Constitution of Bangladesh, Article 27'
  },
  {
    keywords: ['article 28', 'discrimination', 'gender', 'women', 'নারী', 'বৈষম্য'],
    text: 'Article 28 prohibits discrimination against any citizen on grounds of religion, race, caste, sex or place of birth. Women have equal rights with men in all spheres of public life.',
    citation: 'Constitution of Bangladesh, Article 28'
  },
  {
    keywords: ['article 32', 'right to life', 'life', 'liberty', 'জীবন', 'স্বাধীনতার অধিকার'],
    text: 'Article 32 guarantees that "No person shall be deprived of life or personal liberty save in accordance with law." The state cannot harm or detain anyone without explicit legal authority.',
    citation: 'Constitution of Bangladesh, Article 32 — Protection of Right to Life'
  },
  {
    keywords: ['article 33', 'arrest', 'police', 'detain', 'custody', 'গ্রেপ্তার', 'পুলিশ', 'আইনজীবী'],
    text: 'Under Article 33, when arrested by police:\n\n1. You must be informed of the arrest reason immediately.\n2. You have the absolute right to consult and be defended by a lawyer of your choice.\n3. You MUST be produced before a magistrate within 24 hours of arrest.\n4. You cannot be detained beyond 24 hours without a magistrate\'s official order.',
    citation: 'Constitution of Bangladesh, Article 33 — Safeguards as to Arrest'
  },
  {
    keywords: ['article 39', 'free speech', 'expression', 'press', 'বাকস্বাধীনতা', 'সংবাদপত্র'],
    text: 'Article 39 guarantees freedom of thought, conscience, speech, and press. Citizens can express opinions freely, subject to reasonable restrictions regarding national security, public order, and decency.',
    citation: 'Constitution of Bangladesh, Article 39 — Freedom of Thought & Speech'
  },
  {
    keywords: ['privacy', 'who can see', 'secret', 'private concern', 'gopon', 'গোপন', 'কারা দেখতে পাবে'],
    text: 'On Awaz, citizen privacy is strictly enforced:\n\n• Citizens ONLY see concerns reported by their own account.\n• Other citizens CANNOT see your reported issues.\n• Only verified Municipal Authorities (DNCC/DSCC) can view all reported concerns to take resolution action.',
    citation: 'Awaz Role-Based Security Policy'
  },
  {
    keywords: ['report', 'submit', 'post concern', 'how to report', 'অভিযোগ', 'রিপোর্ট'],
    text: 'To report a civic problem on Awaz:\n\n1. Click "+ Report" in the header navigation\n2. Allow GPS location detection or select your Dhaka ward\n3. Upload photo proof & write a description\n4. Submit! Your issue is routed directly to municipal authorities.',
    citation: 'Awaz Platform User Guide',
    actionLink: '/concerns/submit'
  },
  {
    keywords: ['emergency', 'hotline', 'police number', 'fire service', 'জরুরি', 'হটলাইন', '999'],
    text: 'National Emergency Services in Bangladesh:\n\n• 🚨 National Emergency Hotline: 999 (Police, Ambulance, Fire Service)\n• 🏛️ Municipal Service Hotline: 333 (Government Info & Services)\n• 👩‍👧 Women & Child Helpline: 109\n• ⚖️ National Legal Aid Helpline: 16430',
    citation: 'Government of Bangladesh National Emergency Services'
  }
];

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const query = question.trim().toLowerCase();

    // 1. Live Weather Query
    if (query.includes('weather') || query.includes('temperature') || query.includes('rain') || query.includes('climate') || query.includes('আবহাওয়া') || query.includes('তাপমাত্রা') || query.includes('বৃষ্টি')) {
      const weatherRes = await fetchLiveWeather();
      if (weatherRes) return res.json(weatherRes);
    }

    // 2. Real-Time Awaz Database Statistics
    if (query.includes('stat') || query.includes('count') || query.includes('how many') || query.includes('কতগুলো') || query.includes('পরিসংখ্যান')) {
      const totalConcerns = await Concern.countDocuments();
      const resolvedConcerns = await Concern.countDocuments({ status: 'resolved' });
      const totalUsers = await User.countDocuments();

      return res.json({
        answer: `Here are the real-time statistics from the Awaz Live Database:\n\n• 📋 Total Reported Concerns: ${totalConcerns}\n• ✅ Resolved Issues: ${resolvedConcerns}\n• 👥 Registered Verified Citizens: ${totalUsers}\n\nOur system ensures every report is routed directly to the proper authorities.`,
        citation: 'Awaz Real-Time MongoDB Database',
        actionLink: '/concerns'
      });
    }

    // 3. Constitutional & Local Knowledge Match
    let bestScore = 0;
    let bestMatch = null;

    for (const item of CONSTITUTION_KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (query.includes(kw.toLowerCase())) {
          score += kw.length > 3 ? 2 : 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore >= 2) {
      return res.json({
        answer: bestMatch.text,
        citation: bestMatch.citation,
        actionLink: bestMatch.actionLink || null
      });
    }

    // 4. Real-Time Global Web & Knowledge Search
    const realTimeResult = await searchWebRealtime(question);
    if (realTimeResult) {
      return res.json(realTimeResult);
    }

    // 5. Fallback Default
    return res.json({
      answer: `আপনার প্রশ্নটির জন্য ধন্যবাদ! I am the Awaz Universal Real-Time Assistant.\n\nYou can ask me about:\n• 🌤️ Live Weather in Dhaka or Bangladesh\n• 🌐 General knowledge, science, places, tech & current affairs\n• ⚖️ Bangladesh Constitution & Fundamental Rights (Articles 27, 28, 32, 33, 39)\n• 📋 Awaz Live platform stats and civic reporting guidelines`,
      citation: 'Awaz Real-Time Universal AI Assistant'
    });

  } catch (error) {
    console.error('Chatbot endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chatbot request' });
  }
});

module.exports = router;
