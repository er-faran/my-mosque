self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received:", event);

  let data = {};
  try {
    data = event.data.json(); // Use the payload sent from backend
  } catch (e) {
    data = { title: "Azan Reminder", body: "It's time for prayer!" };
  }

  const title = data.title || "Azan Reminder";
  const options = {
    body: data.body || "It's time for prayer!",
  };
  console.log("debug_options", options);

  event.waitUntil(self.registration.showNotification(title, options));
});
