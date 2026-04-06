import * as chatOrchestrator from "../orchestrator/chat.orchestrator.js";
import * as memoryService from "../services/memory/memory.service.js";

export const getLastMessages = (req, res) => {
  try {
    res.json({
      interactions: memoryService.getShortTermArray(),
      counter: memoryService.getCounter(),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAllMessages = (req, res) => {
  memoryService.deleteShortTerm();
  res.send("Short memory deleted");
};

export const deleteMessage = (req, res) => {
  const { index } = req.body;
  memoryService.deleteFromIndex(index);
  res.send("Messages deleted");
};

export const askMessage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const result = await chatOrchestrator.process(prompt);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};