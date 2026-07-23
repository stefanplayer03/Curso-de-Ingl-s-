import type { Handler } from "@netlify/functions";
import { buildSystemInstruction, cleanJsonText } from "./_shared/prompt";

// Llama 3.3 70B na Groq: rápido e com ótima qualidade para conversação em inglês.
const GROQ_MODEL = "llama-3.3-70b-versatile";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método não permitido" }) };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GROQ_API_KEY não configurada nas variáveis de ambiente do Netlify.",
      }),
    };
  }

  try {
    const { history, level, immersionMode } = JSON.parse(event.body ?? "{}") as {
      history: { role: "student" | "tutor"; content: string }[];
      level: string;
      immersionMode?: boolean;
    };

    const messages = [
      { role: "system", content: buildSystemInstruction(level, immersionMode) },
      ...history.map((message) => ({
        role: message.role === "tutor" ? "assistant" : "user",
        content: message.content,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? "{}";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: cleanJsonText(rawText),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: String(error) }) };
  }
};
