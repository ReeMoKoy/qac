// api/chat.js
export const config = {
  runtime: 'edge', // Ultra-fast edge runtime for low-latency streaming
};

// Specialized System Prompts for Daily Life & Coding
const SYSTEM_PROMPTS = {
  "QacAI-Flash-lite": `You are QacAI-Flash-lite, a fast and lightweight daily assistant.
Keep answers concise, direct, and actionable. Perfect for quick planning, reminders, quick questions, and short code snippets. Avoid unnecessary chatter.`,

  "QacAI-Flash": `You are QacAI-Flash, a balanced daily life and coding assistant.
For daily life: Provide helpful, practical, and well-structured answers.
For coding: Provide clean, bug-free, well-commented code with concise explanations.`,

  "QacAI-Ultra": `You are QacAI-Ultra, an advanced reasoning engine for complex coding and deep analysis.
For coding: Always consider edge cases, performance, architecture, and maintainability. Format code with comments and explain technical trade-offs in detail.`
};

// Map QAC AI models to underlying provider model IDs
// (Adjust keys to match your preferred backend provider: OpenRouter, Gemini, OpenAI, etc.)
const MODEL_MAPPING = {
  "QacAI-Flash-lite": "google/gemini-2.0-flash-lite-preview-02-05:free",
  "QacAI-Flash": "google/gemini-2.0-flash-001",
  "QacAI-Ultra": "anthropic/claude-3.5-sonnet" // or openai/gpt-4o / google/gemini-1.5-pro
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { messages, model = "QacAI-Flash" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format." }), { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI_API_KEY is not configured in Vercel settings." }), { status: 500 });
    }

    const selectedModel = MODEL_MAPPING[model] || MODEL_MAPPING["QacAI-Flash"];
    const systemPrompt = SYSTEM_PROMPTS[model] || SYSTEM_PROMPTS["QacAI-Flash"];

    // Example upstream call using OpenRouter / OpenAI compatible endpoint
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://qac-murex.vercel.app",
        "X-Title": "QAC AI"
      },
      body: JSON.stringify({
        model: selectedModel,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), { status: response.status });
    }

    // Stream the response back to client directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
