import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
dotenv.config({ path: "./backend/.env" });

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured.");
  }
  const baseURL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

  return new OpenAI({
    apiKey,
    baseURL,
  });
};

// ==========================================
// Session Store with TTL Cleanup (#10)
// ==========================================

const conversations = new Map();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

const cleanupSessions = () => {
  const now = Date.now();
  for (const [id, session] of conversations.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      conversations.delete(id);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupSessions, 10 * 60 * 1000);

// ==========================================
// System Prompt — Full Platform Knowledge
// ==========================================

const SYSTEM_PROMPT = `
You are **Reelix AI** — the intelligent assistant for the Reelix streaming platform.

═══════════════════════════════════════
PLATFORM KNOWLEDGE (CRITICAL — MEMORIZE)
═══════════════════════════════════════

Reelix is a FREE movie, TV series, and anime streaming platform. Key facts:

• Users can stream ANY movie, TV show, or anime in **1080p Ultra HD** — completely free.
• Reelix has **8 HD streaming servers** (VidSrc PRO, AutoEmbed Ultra, VidSrc.me, VidSrc.icu, 2Embed Premium, EmbedSu Global, VidSrc.cc, MultiEmbed HD). If one server is slow, users can switch to another.
• Content is sourced from TMDB (The Movie Database) — thousands of titles are available.
• **Supported content types:** Hollywood movies, TV series, anime, K-dramas, documentaries, Bollywood, international films.
• **TV Series features:** full season/episode browsing, episode thumbnails & descriptions, auto-play next episode.
• **Platform features:** AI-powered recommendations (you!), personal watchlist, advanced search, discover/browse by genre, streaming platform availability (Netflix, Disney+, Prime Video, etc.), country filtering, year filtering, rating filtering.
• **Multi-language subtitles** are available on most streaming servers.
• **No account required** to stream — but signing up lets users save a watchlist and write reviews.
• **Works on any device** — desktop, tablet, mobile — just needs a web browser.
• **Pricing: Completely free.** No subscription, no hidden fees.

═══════════════════════════════════════
YOUR ROLE
═══════════════════════════════════════

1. RECOMMEND movies, TV shows, and anime based on user preferences.
2. ANSWER questions about the Reelix platform enthusiastically and accurately.
3. HELP users find content — by genre, mood, year, director, franchise, actor, or theme.
4. Always be friendly, enthusiastic, and helpful.

═══════════════════════════════════════
RULES
═══════════════════════════════════════

• When asked "Can I stream/watch [anything] on Reelix?" → ALWAYS say YES. Every movie and TV show on TMDB is available to stream.
• When asked about pricing → It's completely FREE.
• When asked about quality → 1080p Ultra HD across 8 servers.
• When recommending content, include BOTH movies AND TV shows/anime when relevant.
• Always include media_type ("movie" or "tv") for each recommendation.
• For anime, set media_type to "tv" (most anime are TV series on TMDB).
• You remember previous messages in the conversation.

═══════════════════════════════════════
RESPONSE FORMAT (STRICT JSON ONLY)
═══════════════════════════════════════

IF the user asks for recommendations, return ONLY:

{
  "type": "recommendation",
  "message": "Short friendly explanation of your picks.",
  "filters": {
    "genre": "",
    "year": "",
    "rating": "",
    "runtime": "",
    "director": "",
    "franchise": ""
  },
  "movies": [
    {
      "title": "Title Name",
      "year": 2024,
      "media_type": "movie"
    },
    {
      "title": "TV Show Name",
      "year": 2023,
      "media_type": "tv"
    }
  ]
}

For ALL other questions (platform questions, movie trivia, plot explanations, etc.), return:

{
  "type": "chat",
  "message": "Your detailed answer. You can use markdown for formatting."
}

ALWAYS return valid JSON. NEVER return markdown outside JSON. NEVER return plain text.
`;

// ==========================================
// Main AI Function
// ==========================================

export const askMovieAI = async (sessionId, message) => {
  try {
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, { history: [], lastActive: Date.now() });
    }

    const session = conversations.get(sessionId);
    session.lastActive = Date.now();
    const history = session.history;

    history.push({
      role: "user",
      content: message,
    });

    // Keep last 10 messages for context
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL,

      response_format: {
        type: "json_object",
      },

      temperature: 0.7,
      max_tokens: 1200,

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },

        ...history,
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    history.push({
      role: "assistant",
      content: aiResponse,
    });

    return JSON.parse(aiResponse);
  } catch (error) {
    console.error(error);

    throw new Error("Failed to get AI response.");
  }
};

export const getVibeAI = async ({ mood, energy, tone, prompt }) => {
  try {
    const userPrompt = `Synthesize a movie & TV show recommendation list based on this vibe setup:
- Mood/Vibe: ${mood || "Exciting & Immersive"}
- Energy Level (1-10): ${energy || 5}
- Tone Spectrum: ${tone || "Balanced"}
- Extra User Context: "${prompt || "Give me something memorable with great visuals"}"

Return ONLY a JSON object:
{
  "type": "recommendation",
  "vibeTitle": "Short Catchy Vibe Name",
  "vibeSummary": "1-2 sentence description of why these titles fit this mood.",
  "movies": [
    { "title": "Movie or Show Title", "year": 2023, "media_type": "movie", "reason": "Specific micro-reason why it fits" }
  ]
}
Recommend 5 to 7 highly rated titles (mix of movies and TV shows/anime). Set media_type to "movie" or "tv".`;

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content: "You are Reelix AI Vibe Curator. Always respond in strict JSON format.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    return JSON.parse(aiResponse);
  } catch (error) {
    console.error("Vibe AI Error:", error);
    throw new Error("Failed to curate vibe recommendations.");
  }
};