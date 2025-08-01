import webpush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:your@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default webpush;
