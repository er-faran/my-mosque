// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export async function POST(request) {
//   const body = await request.json();
//   const filePath = path.resolve(process.cwd(), "subscriptions.json");

//   // Read existing subscriptions
//   let subscriptions = [];
//   if (fs.existsSync(filePath)) {
//     subscriptions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//   }

//   // Avoid duplicates
//   if (!subscriptions.find((sub) => sub.endpoint === body.endpoint)) {
//     subscriptions.push(body);
//     fs.writeFileSync(filePath, JSON.stringify(subscriptions));
//   }

//   return NextResponse.json({ ok: true });
// }

import { NextResponse } from "next/server";
import { addSubscription } from "@/lib/subscriptionStore";

export async function POST(request) {
  const subscription = await request.json();
  addSubscription(subscription);
  return NextResponse.json({ ok: true });
}
