import "./config/env.js";

import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import ttsRoutes from "./routes/tts.routes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
}));

app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/tts", ttsRoutes);

app.listen(4000, () =>
  console.log("🧠 Aria running locally on http://localhost:4000")
);