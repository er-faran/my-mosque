"use client";
import { useState } from "react";

export default function PushSetup() {
  const [status, setStatus] = useState("idle");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }

      await navigator.serviceWorker.register("/sw.js");
      const registration = await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      });

      await fetch("/api/save-subscription", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      setStatus("subscribed");
      setSubscribed(true);
    } catch (err) {
      console.error("Push setup error:", err);
      setStatus("error");
    }
  };

  const handleTestNotification = async () => {
    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
      });
      // if (res.ok) {
      //   alert("✅ Azan Test Notification Sent!");
      // } else {
      //   alert("❌ Notification Failed");
      // }
    } catch (err) {
      console.error("Send Notification Error:", err);
      alert("⚠️ Error sending test");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow max-w-sm mx-auto mt-6 text-center">
      <h3 className="text-lg font-semibold mb-2">Push Notifications</h3>
      <button
        onClick={handleSubscribe}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
      >
        Enable Notifications
      </button>

      {subscribed && (
        <button
          onClick={handleTestNotification}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Test Azan Notification
        </button>
      )}

      <p className="mt-2 text-sm text-gray-700">
        {status === "granted" && "✅ Permission granted"}
        {status === "denied" && "❌ Permission denied"}
        {status === "subscribed" && "🔔 Subscribed successfully!"}
        {status === "unsupported" && "🚫 Push not supported on this browser"}
        {status === "error" && "⚠️ Something went wrong"}
      </p>
    </div>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
