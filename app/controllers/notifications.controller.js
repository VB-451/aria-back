import { notificationEvents } from "../events/notifications.events.js"

export const getNotificationSSE = (req, res) =>{
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("connection established");

    const listener = (notification) => {
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
    };

    notificationEvents.on("notification", listener);

    req.on("close", () => {
        notificationEvents.off("notification", listener);
        console.log("connection off");
        res.end();
    });

}