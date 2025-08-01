"use client";
// pages/test-notify.js
export default function TestNotify() {
  const send = async () => {
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Salah Reminder",
        body: "Time for Maghrib Salah in 5 minutes.",
      }),
    });
  };

  return <button onClick={send}>Send Test Notification</button>;
}
