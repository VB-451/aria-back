import fetch from "node-fetch";

const OLLAMA_URL = process.env.OLLAMA_URL;

export const callLLM = async (prompt, model) => {
  const response = await fetch(`${OLLAMA_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response?.trim();
};

export const callEmbeddings = async (text) => {
  const response = await fetch(`${OLLAMA_URL}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });
  const data = await response.json();
  return data.embedding;
};