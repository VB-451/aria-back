import * as memoryService from "../services/memory/memory.service.js";
import * as routerService from "../services/llm/router.service.js";
import * as coreService from "../services/llm/core.service.js";
import * as memoryDecider from "../services/llm/memory-decider.service.js";
import { executeTool } from "../services/tools/toolExecutor.service.js";

export const process = async (userPrompt) => {
    
  const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    const stm = memoryService.getShortTermMemory();

    const route = await routerService.decide({
        userPrompt,
        stm,
        currentDateTime,
    });

    let toolData = null;

    if (route.function) {
        toolData = await executeTool(route.function, route.args);
    }

    const relevantMemories = await memoryService.getRelatedFacts(userPrompt, route.subjects);
    
    const finalResponse = await coreService.generate({
        userPrompt,
        stm,
        relevantMemories,
        toolData,
        currentDateTime,
    });

    console.log(`Final Response: ${finalResponse}`)

    const id = memoryService.addToShortTermMemory(userPrompt, finalResponse);

    handleMemorySave(userPrompt, finalResponse);

    return {
        step1_decision: route,
        reply: finalResponse,
        id,
        relevantMemories
    };
}

const handleMemorySave = async (userPrompt, finalResponse) => {
  try {
    const decision = await memoryDecider.shouldSave(userPrompt, finalResponse);

    if (decision?.fact) {
      await memoryService.storeNewFact(
        decision.fact,
        decision.subjects,
        decision.importance
      );
    }
  } catch (err) {
    console.error("Memory save failed:", err);
  }
};