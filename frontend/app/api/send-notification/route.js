import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:235faran@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_VAPID_PRIVATE_KEY
);

export async function POST() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const subPath = path.resolve("./subscriptions.json");
  const schedulePath = path.resolve("./azan-schedule.json");

  let subs = [];
  let schedules = [];

  try {
    subs = JSON.parse(await fs.readFile(subPath, "utf-8"));
    schedules = JSON.parse(await fs.readFile(schedulePath, "utf-8"));
  } catch (err) {
    console.error("Error reading files:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const matchingSchedules = schedules.filter(
    (s) => s.hour === currentHour && s.minute === currentMinute
  );

  if (matchingSchedules.length === 0) {
    return NextResponse.json({ message: "No Azan schedule at this time" });
  }

  for (const schedule of matchingSchedules) {
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          sub,
          JSON.stringify({
            title: "⏰ Azan Reminder",
            body: schedule.message,
          })
        );
      } catch (err) {
        console.error("Push error:", err);
      }
    }
  }

  return NextResponse.json({ sent: true });
}
