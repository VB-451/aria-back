import { callLLM, callLLMStream } from "./llm.service.js";

export const generate = async ({ userPrompt, stm, relevantMemories, routeFunction, toolData, currentDateTime, onToken}) => {
    const prompt = `
Today is ${currentDateTime}.

${stm ? `
<previous_messages>
${stm}
</previous_messages>`
: ""
}
${relevantMemories ? `
<relevant_user_memories>
${relevantMemories}
</relevant_user_memories>` 
: ""
}
${toolData ? `
<funtion_data>
${toolData}
</function_data>` 
: ""
}
Respond naturally to the user's latest message:
${userPrompt}
`
    
    // console.log(`Final Prompt:  ${prompt}`)
    // const response = await callLLM(prompt, "aria-core", true)
    // return response;

    if (!onToken) {
        return await callLLM(prompt, "aria-core");
    }

    return await callLLMStream(prompt, "aria-core", onToken, routeFunction);
}