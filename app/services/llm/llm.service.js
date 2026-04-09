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

export const callLLMStream = async (prompt, model, onToken) => {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      model,
      prompt,
      stream: true
    })
  });

  let buffer = "";
  let fullText = "";

  for await (const chunk of response.body) {
    buffer += chunk.toString();

    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;

      const data = JSON.parse(line);

      const token = data.response;
      if (!token) continue;

      fullText += token;
      onToken(token);
    }
  }

  return fullText;
};