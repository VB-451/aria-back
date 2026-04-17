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

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders?.();

    const sendEvent = (event, data) => {
      // console.log("SSE:", event, data);
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };


    const result = await chatOrchestrator.process(
      prompt,
      (token) => {
        sendEvent("token", token);
      },
      sendEvent
    );

    sendEvent("end", {
      id: result.id,
      step1_decision: result.step1_decision
    });

    res.end();

  } catch (err) {
    console.error(err);

    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ message: "Server error" })}\n\n`);

    res.end();
  }
};