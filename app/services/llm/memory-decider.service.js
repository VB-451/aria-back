import { callLLM } from "./llm.service.js";

export const shouldSave = async (userPrompt, finalResponse) => {
    const prompt = `
<user_message>
${userPrompt}
</user_message>

<assistant_reply>
${finalResponse}
</assistant_reply>
`;
    const response = await callLLM(prompt, "aria-memory")
    
    try {
        return JSON.parse(response);
    } catch {
        return { function: null };
    }
}