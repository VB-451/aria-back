import * as chatOrchestrator from "../orchestrator/chat.orchestrator.js";

export const askMessage = async (req, res) => {
  const { prompt, regenerateSiblingNodeID, answerBool } = req.body;
  console.log(regenerateSiblingNodeID);
  
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
      sendEvent,
      regenerateSiblingNodeID,
      answerBool
    );

    sendEvent("end", {
      id: result.id,
      parent_id: result.parent_id,
      step1_decision: result.step1_decision,
      relevantMemories: result.relevantMemories,
    });

    res.end();

  } catch (err) {
    console.error(err);

    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ message: "Server error" })}\n\n`);

    res.end();
  }
};