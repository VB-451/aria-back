import { spawn } from "child_process";
import path from "path";

const PIPER_ENGINE_LOCATION = process.env.PIPER_ENGINE_LOCATION;
const PIPER_TTS_MODEL_LOCATION = process.env.PIPER_TTS_MODEL_LOCATION;

export const generateSpeech = (text) => {
  return new Promise((resolve, reject) => {
    const filename = `output-${Date.now()}.wav`;
    const filePath = path.resolve(filename);

    const piper = spawn(PIPER_ENGINE_LOCATION, [
      "-m", PIPER_TTS_MODEL_LOCATION,
      "-f", filePath,
      "--length_scale", "1.3",
    ]);

    piper.stdin.write(text);
    piper.stdin.end();

    piper.on("close", () => {
      resolve(filePath);
    });

    piper.on("error", (err) => {
      reject(err);
    });
  });
};