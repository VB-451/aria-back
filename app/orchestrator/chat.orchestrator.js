import * as memoryService from "../services/memory/memory.service.js";
import * as conversationService from "../services/memory/conversation.service.js"
import * as routerService from "../services/llm/router.service.js";
import * as coreService from "../services/llm/core.service.js";
import * as memoryDecider from "../services/llm/memory-decider.service.js";
import { executeTool } from "../services/tools/toolExecutor.service.js";
import { returnAllNotifications } from "../services/notifications/notifications.service.js";
import { getCurrentDateTime } from "../utils/getCurrentDateTime.js";
import { getConfigParameter } from "../services/configuration/configuration.service.js";

export const process = async (userPrompt, onToken, eventSendFunction, regenerateNodeID, regenerateAnswer) => {

  const currentDateTime = getCurrentDateTime();

  const stm = conversationService.getLastInteractions(getConfigParameter("numberOfInteractionsContext"), regenerateNodeID);
  console.log(stm);
  
  
  const route = await routerService.decide({
    userPrompt,
    stm,
    currentDateTime,
  });

  console.log(route.function);
  

  let toolData = null;

  if (route.function) {
    toolData = await executeTool(route.function, route.args);
  }

  const relevantMemories = await memoryService.getRelatedFacts(userPrompt, route.subjects);
  
  eventSendFunction("start", {routeFunction: route.function})

  const notifications = returnAllNotifications();

  const finalResponse = await coreService.generate({
    userPrompt,
    stm,
    relevantMemories,
    routeFunction: route.function,
    toolData,
    currentDateTime,
    onToken,
    notifications
  });

  // console.log(`Final Response: ${finalResponse}`)

  let userMessageAppendResult;
  let assistantMessageAppendResult;

  if(!regenerateNodeID){
    userMessageAppendResult = conversationService.appendUserMessage(userPrompt)
    assistantMessageAppendResult = conversationService.appendAssistantMessage(finalResponse, route.function)
  } else if(regenerateAnswer) {
    assistantMessageAppendResult = conversationService.addSibling(regenerateNodeID, finalResponse, route.function, regenerateAnswer)
  } else {
    userMessageAppendResult = conversationService.addSibling(regenerateNodeID, userPrompt, null, regenerateAnswer);
    assistantMessageAppendResult = conversationService.appendAssistantMessage(finalResponse, route.function);
  }

  
  handleMemorySave(userPrompt, finalResponse);

  return {
    step1_decision: route,
    reply: finalResponse,
    id: assistantMessageAppendResult.id,
    parent_id: assistantMessageAppendResult.parentId,
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