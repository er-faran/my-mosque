self.addEventListener("push", function (e) {
  const data = e.data?.json() || {};
  const title = data.title || "Salah Reminder";
  const options = {
    body: data.body || "Time for Salah. Prepare yourself.",
    icon: "/icons/icon-192x192.png",
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
