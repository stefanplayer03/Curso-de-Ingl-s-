import type { Handler } from "@netlify/functions";
import { buildSystemInstruction, cleanJsonText } from "./_shared/prompt";

const GEMINI_MODEL = "gemini-2.0-flash";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método não permitido" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GEMINI_API_KEY não configurada nas variáveis de ambiente do Netlify.",
      }),
    };
  }

  try {
    const { history, level, immersionMode } = JSON.parse(event.body ?? "{}") as {
      history: { role: "student" | "tutor"; content: string }[];
      level: string;
      immersionMode?: boolean;
    };

    const contents = history.map((message) => ({
      role: message.role === "tutor" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemInstruction(level, immersionMode) }] },
          contents,
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errorText }) };
    }

    const data = await response.json();
    const rawText: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: cleanJsonText(rawText),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: String(error) }) };
  }
};
