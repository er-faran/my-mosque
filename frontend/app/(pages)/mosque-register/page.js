import MosqueRegistrationForm from "@/app/components/MosqueRegistrationForm";
import Link from "next/link";
import { FaMosque } from "react-icons/fa";

export default function RegisterMosquePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 md:px-10 py-10 space-y-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <FaMosque /> Register Your Mosque
        </h1>
        <p className="text-lg text-gray-600">
          "The mosques of Allah are only to be maintained by those who believe
          in Allah and the Last Day..."
          <br />
          <span className="italic text-sm">— Surah At-Tawbah 9:18</span>
        </p>
        <p className="text-sm text-gray-500">
          After submitting, your mosque request will be reviewed for approval.
          Only verified mosques will be listed.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto">
        <MosqueRegistrationForm />
      </div>

      {/* Disclaimer and Hadith */}
      <div className="max-w-3xl mx-auto text-sm text-gray-600 space-y-4 text-center">
        <p>
          "Whoever builds a mosque for Allah, Allah will build for him a house
          like it in Paradise."
          <br />
          <span className="italic">
            — Sahih al-Bukhari 450, Sahih Muslim 533
          </span>
        </p>
        <p className="text-xs text-gray-500">
          Your information will be carefully reviewed. Ensure you provide
          accurate and valid details to prevent rejection.
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
