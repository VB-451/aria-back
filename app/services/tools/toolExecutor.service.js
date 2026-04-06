import { toolRegistry } from "./toolRegistry.js";

export async function executeTool(toolName, args = {}) {
  const tool = toolRegistry[toolName];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  if (typeof tool.exec !== "function") {
    throw new Error(`Tool "${toolName}" is missing an exec function`);
  }

  const data = await tool.exec(args);

  if (typeof tool.buildPrompt !== "function") {
    return "Not a function";
  }

  const prompt = tool.buildPrompt(args, data);

  return prompt;
}