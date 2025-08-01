// components/PushSetup.js
import { useEffect } from "react";

export default function PushSetup() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered", reg);
        })
        .catch(console.error);
    }
  }, []);

  const subscribeToPush = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await fetch("/api/save-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    alert("Subscribed to notifications!");
  };

  return (
    <button
      onClick={subscribeToPush}
      className="bg-blue-600 text-white p-2 rounded"
    >
      Enable Salah Reminders
    </button>
  );
}
