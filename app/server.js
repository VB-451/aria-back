import "./config/env.js";

import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js"
import ttsRoutes from "./routes/tts.routes.js";
import configurationRoutes from "./routes/configuration.routes.js"
import launcherRoutes from "./routes/launcher.routes.js"
import whitelistRoutes from "./routes/whitelist.router.js"
import notificationRoutes from "./routes/notifications.routes.js"
import { startWatchers } from "./startup/watchers.js";
import { loadConfig } from "./services/configuration/configuration.service.js";
import { loadWhitelist } from "./services/whitelist/whitelist.service.js";

await loadConfig()
await loadWhitelist()

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));

app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/conversation", conversationRoutes);
app.use("/tts", ttsRoutes);
app.use("/configuration", configurationRoutes);
app.use("/launcher", launcherRoutes)
app.use("/whitelist", whitelistRoutes)
app.use("/notifications", notificationRoutes)

startWatchers();

app.listen(4000, () =>
  console.log("🧠 Aria running locally on http://localhost:4000")
);