import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import webpush from "web-push";

const subscriptionsPath = path.join(process.cwd(), "subscriptions.json");
const scheduledMessagesPath = path.join(
  process.cwd(),
  "scheduled-messages.json"
);

// Set VAPID keys from env
webpush.setVapidDetails(
  "mailto:admin@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_VAPID_PRIVATE_KEY
);

export async function GET() {
  try {
    // Read stored subscriptions
    const subscriptionsRaw = await fs.readFile(subscriptionsPath, "utf8");
    const subscriptions = JSON.parse(subscriptionsRaw);

    // Read scheduled messages
    const messagesRaw = await fs.readFile(scheduledMessagesPath, "utf8");
    const scheduled = JSON.parse(messagesRaw);

    // Get current time (rounded to min)
    const now = new Date();
    const currentHr = now.getHours();
    const currentMin = now.getMinutes();

    const messagesToSend = scheduled.filter((msg) => {
      return msg.hour === currentHr && msg.minute === currentMin;
    });

    for (const msg of messagesToSend) {
      for (const sub of subscriptions) {
        await webpush.sendNotification(
          sub,
          JSON.stringify({ title: "Salah Reminder", body: msg.message })
        );
      }
    }

    return NextResponse.json({
      ok: true,
      sent: messagesToSend.length,
      time: `${currentHr}:${currentMin}`,
    });
  } catch (err) {
    console.error("Cron job error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
