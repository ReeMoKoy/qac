// api/chat.js
// Optimized serverless function for QAC AI router

export const config = {
  runtime: 'edge', // Fast edge runtime for low latency
};

// System personas tailored for Daily Life & Coding
const SYSTEM_PROMPTS = {
  base: `You are QAC AI, an intelligent AI assistant specialized in daily life tasks and software development.
Always provide clean, direct, and well-structured answers. When providing code, optimize it and explain the key logic.`,

  "QacAI-Flash-lite": `You are QacAI-Flash-lite. Provide direct, concise, and ultra-fast answers. Best suited for quick daily routines, fast answers, and simple scripting snippets.`,

  "QacAI-Flash": `You are QacAI-Flash. Provide balanced, clear, and comprehensive guidance for both daily life productivity and programming challenges.`,

  "QacAI-Ultra": `You are QacAI-Ultra. Provide advanced, deep reasoning. For coding, analyze edge cases, security, and algorithmic performance before writing thoroughly architected solutions.`
};

// Map QAC AI tiers to your underlying LLM provider model IDs
// (Example using standard Gemini/OpenAI endpoints)
const MODEL_MAPPING = {
  "QacAI-Flash-lite": "gemini-2.0-flash-lite", 
  "QacAI-Flash": "gemini-2.0-flash",
  "QacAI-Ultra": "gemini-1.5-pro" // or claude-3-5-sonnet / gpt-4o
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new
