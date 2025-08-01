// pages/api/send-notification.js
import webpush from "@/lib/webPush";
import { subscriptions } from "./save-subscription";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, body } = req.body;

    const notifications = subscriptions.map((sub) =>
      webpush.sendNotification(
        sub,
        JSON.stringify({
          title,
          body,
        })
      )
    );

    try {
      await Promise.all(notifications);
      res.status(200).json({ message: "Notifications sent" });
    } catch (err) {
      console.error("Error sending notifications", err);
      res.status(500).json({ message: "Error sending notifications" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
