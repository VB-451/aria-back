import { callLLM } from "./llm.service.js";

export const decide = async ({ userPrompt, stm, currentDateTime }) => {
  const prompt = `
Today is ${currentDateTime}.

${stm ? `Latest interaction:\n${stm}` : ""}

Analyze the user's message and decide:
- if a function is needed
- what subjects are involved

Message: "${userPrompt}"
`;

  const response = await callLLM(prompt, "aria-router");

  try {
    return JSON.parse(response);
  } catch {
    return { function: null };
  }
};