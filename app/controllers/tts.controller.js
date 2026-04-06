import { generateSpeech } from "../services/tts/tts.service.js";

export const generateVoice = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const filePath = await generateSpeech(text);

    res.sendFile(filePath, () => {
      import("fs").then(fs => {
        fs.unlink(filePath, () => {});
      });
    });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "TTS failed" });
  }
};