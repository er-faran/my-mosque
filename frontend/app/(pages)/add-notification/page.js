"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [hour, setHour] = useState(14);
  const [minute, setMinute] = useState(7);
  const [message, setMessage] = useState("Rest" + minute);
  const [notifications, setNotifications] = useState([]);

  const addNotification = async () => {
    if (!message.trim()) return alert("Please enter a message");

    const newItem = { id: Date.now(), hour, minute, message };
    setNotifications((prev) => [...prev, newItem]);
    setMessage("");
    setHour(0);
    setMinute(0);

    // 👉 Send to API
    try {
      const res = await fetch("/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hour,
          minute,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      console.log("Saved to server:", data);
    } catch (err) {
      console.error("Failed to save on server:", err);
      alert("Failed to save notification on server.");
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // On component load
  useEffect(() => {
    const saved = localStorage.getItem("azan_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  // Whenever notifications change, update localStorage
  useEffect(() => {
    localStorage.setItem("azan_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const sendPush = async (message) => {
    try {
      const res = await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const result = await res.json();

      console.log("Push response:", result);
      // check permission for notification then show notification

      function notifyMe() {
        if (!("Notification" in window)) {
          // Check if the browser supports notifications
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          // Check whether notification permissions have already been granted;
          // if so, create a notification
          console.log("granted");

          navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) {
              console.log("inside granted");

              const resp = reg.showNotification("Hi there!", {
                body: "This is a notification from the service worker.",
              });
              console.log("resp", resp);

              resp
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });

          console.log("after granted");
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification("Hi there!");
              console.log("granted now", notification);
            }
          });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them anymore.
      }
      notifyMe();
    } catch (err) {
      console.error("Push error:", err);
    }
  };

  useEffect(() => {
    let lastSentIds = new Set();

    const checkForNotification = () => {
      console.log("debug_Checking for notifications...", notifications);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      notifications.forEach((n) => {
        const id = `${n.hour}:${n.minute}-${n.message}`;
        if (
          n.hour === currentHour &&
          n.minute === currentMinute &&
          !lastSentIds.has(id)
        ) {
          sendPush(n.message);
          lastSentIds.add(id);

          // Remove after 70 seconds to allow it again next day
          setTimeout(() => lastSentIds.delete(id), 70000);
        }
      });
    };

    const interval = setInterval(checkForNotification, 10000); // every minute
    return () => clearInterval(interval);
  }, [notifications]);

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const subscribeToPush = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push notifications are not supported.");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        // 👉 Send subscription to server
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        console.log("✅ Push subscription sent to server");
      } catch (error) {
        console.error("Push subscription error:", error);
      }
    };

    subscribeToPush();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">📣 Admin Notification Config</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Hour (0-23)</label>
          <input
            type="number"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Minute (0-59)</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Custom Message</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter message for Azan notification"
        />
      </div>

      <button
        onClick={addNotification}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ➕ Add Notification
      </button>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">🕑 Scheduled Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications scheduled yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                ⏰ {n.hour.toString().padStart(2, "0")}:
                {n.minute.toString().padStart(2, "0")} – {n.message}
              </span>
              <button
                onClick={() => removeNotification(n.id)}
                className="text-red-600 hover:underline"
              >
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// "use client";
// import { useState } from "react";

// export default function AddNotification() {
//   const [message, setMessage] = useState("");
//   const [hour, setHour] = useState("");
//   const [minute, setMinute] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await fetch("/api/send-push", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: "Azan Reminder",
//         message: `${hour}:${minute} - ${message}`,
//       }),
//     });
//     alert("Notification Sent");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-4">
//       <input
//         type="text"
//         placeholder="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className="border p-2"
//       />
//       <input
//         type="number"
//         placeholder="Hour"
//         value={hour}
//         onChange={(e) => setHour(e.target.value)}
//         className="border p-2"
//       />
//       <input
//         type="number"
//         placeholder="Minute"
//         value={minute}
//         onChange={(e) => setMinute(e.target.value)}
//         className="border p-2"
//       />
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//         Send Notification
//       </button>
//     </form>
//   );
// }
