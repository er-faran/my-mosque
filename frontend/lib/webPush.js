import webpush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.NEXT_VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:235faran@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export default webpush;
