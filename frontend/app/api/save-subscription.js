// pages/api/save-subscription.js

let subscriptions = []; // In-memory; you can use DB here

export default function handler(req, res) {
  if (req.method === "POST") {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: "Subscription saved" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Export this to be used elsewhere
export { subscriptions };
