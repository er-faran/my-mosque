"use client";
import Image from "next/image";
import Link from "next/link";
import { FaMosque } from "react-icons/fa";
import heroSectionImage from "./(images)/mosque-hero-section.jpg";
import { useEffect, useRef, useState } from "react";
import PushSetup from "./components/PushSetup";

export default function LandingPage() {
  const features = [
    {
      title: "Secure Mosque Registration",
      desc: "Only verified mosques get listed through a human approval process.",
    },
    {
      title: "Centralized Management",
      desc: "Manage mosque details, prayer timings, and admin roles from one place.",
    },
    {
      title: "Prayer Time Notifications",
      desc: "Get reminders for Jamaat times and special announcements.",
    },
    {
      title: "Admin Dashboard",
      desc: "Admins can handle requests, post updates, and track activities.",
    },
    {
      title: "Community Engagement",
      desc: "Send updates and event invites to your local community.",
    },
    {
      title: "Find Nearest Mosques",
      desc: "Discover verified mosques near your location using maps.",
    },
    {
      title: "Join Community Events",
      desc: "Participate in Friday lectures, Iftar, and Eid programs near you.",
    },
  ];

  const scrollRef = useRef(null);

  const scroll = (direction = "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/sw.js")
  //       .then(() => console.log("✅ Service Worker registered"))
  //       .catch((err) => console.error("SW registration failed", err));
  //   }
  // }, []);

  // useEffect(() => {
  //   if ("serviceWorker" in navigator && "PushManager" in window) {
  //     navigator.serviceWorker.register("/sw.js").then(async (reg) => {
  //       // Check for existing subscription
  //       let subscription = await reg.pushManager.getSubscription();
  //       if (!subscription) {
  //         subscription = await reg.pushManager.subscribe({
  //           userVisibleOnly: true,
  //           applicationServerKey: urlBase64ToUint8Array(
  //             process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  //           ),
  //         });
  //       }
  //       // Send subscription to backend
  //       await fetch("/api/subscribe", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(subscription),
  //       });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    async function scheduleAzanNotifications() {
      const res = await fetch("/azanTimes.json");
      const azanTimes = await res.json();

      Notification.requestPermission().then(() => {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg.showNotification("Manual Test", {
            body: "This is a manual test notification.",
          });
        });
      });

      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            console.log("test in");

            reg.showNotification("Azan Reminder", {
              body: `It's time for test prayer!`,
            });
          }
        });
      }

      Object.entries(azanTimes).forEach(([prayer, time]) => {
        const [hour, minute] = time.split(":").map(Number);
        const now = new Date();
        const azanTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute,
          0,
          0
        );

        let delay = azanTime - now;
        if (delay < 0) {
          // If time has passed, schedule for tomorrow
          delay += 24 * 60 * 60 * 1000;
        }

        console.log("delay", delay);

        setTimeout(() => {
          if (Notification.permission === "granted") {
            navigator.serviceWorker.getRegistration().then((reg) => {
              if (reg) {
                reg.showNotification("Azan Reminder", {
                  body: `It's time for ${prayer} prayer!`,
                });
              }
            });
          }
        }, delay);
      });
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("inside");

      scheduleAzanNotifications();
    }
  }, []);

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");

  //   const raw = atob(base64);
  //   return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
  // }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <PushSetup />
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gradient-to-br from-blue-100 to-white">
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-blue-600 flex items-center gap-2">
              <FaMosque className="text-5xl" /> My Mosque
            </span>
            <span className="block">Stay Connected with Your Local Mosque</span>
          </h1>
          <p className="text-lg text-gray-600">
            A platform for Jamati members to stay updated with mosque
            announcements, prayer times, events, and more. Administrators can
            manage mosque profiles, roles, and activities easily.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
            >
              Register as Jamati
            </Link>
            <Link
              href="/mosque-register"
              className="border border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Register a Mosque
            </Link>
          </div>

          {/* Subtext for guidance */}
          <p className="text-sm text-gray-500 pt-2">
            Jamati users can register and stay informed. Mosque registration
            will go through a verification process by our Super Admin before
            being listed. Only verified mosques will be allowed to onboard their
            Imam, Motawalli, and other committee members.
          </p>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src={heroSectionImage}
            alt="Mosque Illustration"
            className="rounded-xl shadow-lg"
            width={400}
            height={500}
          />
          {/* <div>
            Image by
            <a href="https://pixabay.com/users/ledik-15177025/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4849160">
              Ledia Kokalari
            </a>
            from
            <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4849160">
              Pixabay
            </a>
          </div> */}
        </div>
      </section>

      <section className="px-6 md:px-20 py-16 bg-white relative">
        <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>

        <div className="relative flex justify-center items-center">
          {/* Slide left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 bg-white rounded-full shadow-md p-3 text-xl"
          >
            ←
          </button>

          {/* Current card */}
          <div className="w-full max-w-xl">
            <FeatureCard
              title={features[index].title}
              desc={features[index].desc}
            />
          </div>

          {/* Slide right */}
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 bg-white rounded-full shadow-md p-3 text-xl"
          >
            →
          </button>
        </div>

        {/* Optional: dot indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {features.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                index === i ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-20 py-16  bg-emerald-100 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to register your mosque?
        </h2>
        <p className="mb-6">
          Submit your mosque and help your community stay connected.
        </p>
        <Link
          href="/mosque-register"
          className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
        >
          Register Mosque
        </Link>
      </section>

      <section className="px-6 md:px-20 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl text-green-600 mb-4">🕌</div>
            <h4 className="font-semibold text-lg mb-2">Register Your Mosque</h4>
            <p className="text-gray-600">
              Submit mosque details for verification.
            </p>
          </div>
          <div>
            <div className="text-5xl text-blue-600 mb-4">🔍</div>
            <h4 className="font-semibold text-lg mb-2">Manual Review</h4>
            <p className="text-gray-600">
              Our team verifies your submission manually.
            </p>
          </div>
          <div>
            <div className="text-5xl text-yellow-600 mb-4">✅</div>
            <h4 className="font-semibold text-lg mb-2">Get Listed & Manage</h4>
            <p className="text-gray-600">
              Start managing your mosque from your dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 bg-gradient-to-r from-emerald-100 to-green-50">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            “The mosques of Allah are only to be maintained by those who believe
            in Allah and the Last Day...”
          </h2>
          <p className="text-sm text-gray-700 mb-4">— Surah At-Tawbah (9:18)</p>
          <p className="text-gray-600">
            Our mission is to digitally empower mosque management while
            preserving Islamic values and community service.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} My Mosque. Built with ❤️
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2 text-blue-600">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
