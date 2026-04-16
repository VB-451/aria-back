import * as memoryService from "../services/memory/memory.service.js";
import * as routerService from "../services/llm/router.service.js";
import * as coreService from "../services/llm/core.service.js";
import * as memoryDecider from "../services/llm/memory-decider.service.js";
import { executeTool } from "../services/tools/toolExecutor.service.js";

export const process = async (userPrompt, onToken) => {
    
  const now = new Date();
    const currentDateTime = new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now).replace(",", "");
    
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
    console.log(relevantMemories);
    
    const finalResponse = await coreService.generate({
        userPrompt,
        stm,
        relevantMemories,
        routeFunction: route.function,
        toolData,
        currentDateTime,
        onToken
    });

    // console.log(`Final Response: ${finalResponse}`)

    const counter = memoryService.getCounter();
    memoryService.addToShortTermMemory(userPrompt, finalResponse, route);
    
    handleMemorySave(userPrompt, finalResponse);

    return {
        step1_decision: route,
        reply: finalResponse,
        id: counter,
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