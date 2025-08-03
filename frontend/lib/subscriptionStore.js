import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "subscriptions.json");

export function addSubscription(subscription) {
  let subscriptions = {};
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    if (fileContent.trim()) {
      subscriptions = JSON.parse(fileContent);
    }
  }

  // Add or update subscription by endpoint
  subscriptions[subscription.endpoint] = subscription;
  fs.writeFileSync(filePath, JSON.stringify(subscriptions, null, 2));
}

export function getSubscriptions() {
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    if (fileContent.trim()) {
      return JSON.parse(fileContent);
    }
  }
  return {};
}
