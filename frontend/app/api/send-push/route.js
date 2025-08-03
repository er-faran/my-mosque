// import { NextResponse } from "next/server";
// import webpush from "@/lib/webPush";
// import { getSubscriptions } from "@/lib/subscriptionStore";

// export async function POST(request) {
//   const { message } = await request.json();

//   const payload = JSON.stringify({
//     title: "⏰ Azan Reminder",
//     body: message,
//   });

//   const subscriptions = getSubscriptions(); // ✅ Now shared
//   console.log("Active subscriptions:", subscriptions);

//   const results = await Promise.all(
//     subscriptions.map((sub) =>
//       webpush.sendNotification(sub, payload).catch((err) => {
//         console.error("Notification error:", err);
//       })
//     )
//   );

//   return NextResponse.json({ success: true, sent: results.length });
// }

import { NextResponse } from "next/server";
import webpush from "@/lib/webPush";
import { getSubscriptions } from "@/lib/subscriptionStore";

export async function POST(request) {
  const { title, message } = await request.json();
  const subscriptionsObj = getSubscriptions();
  console.log("subs", subscriptionsObj);

  // subscriptionsObj is a key-value object, convert to array of values
  const subscriptions = Object.values(subscriptionsObj);

  const sendNotifications = subscriptions.map((sub) =>
    webpush
      .sendNotification(sub, JSON.stringify({ title, body: message }))
      .catch((err) => {
        console.error("Push Error", err);
      })
  );

  await Promise.all(sendNotifications);

  return NextResponse.json({ ok: true, message, title });
}
