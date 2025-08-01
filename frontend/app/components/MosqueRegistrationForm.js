"use client";
import { apiClient } from "@/api/apiClient";
import endPoints from "@/api/apiEndpoint";
import { useState } from "react";
import {
  FaMosque,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaUserAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

export default function MosqueRegistrationForm() {
  const [formData, setFormData] = useState({
    mosqueName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    googleMapsLink: "",
    establishedYear: "",
    mosqueType: "Jama Masjid",
    imamName: "",
    contactName: "",
    phone: "",
    email: "",
    registrationNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, verified: false };
      const res = await apiClient.post(endPoints.REGISTER_MOSQUE, payload);
      console.log("Response:", res);
      if (res.verified === false && res.id) {
        toast.success("Mosque registration submitted for review.");
        setFormData({
          name: "",
          address: "",
          city: "",
          country: "",
          contactPerson: "",
          phone: "",
          email: "",
          registrationNumber: "",
          googleMapLink: "",
          description: "",
        });
      } else {
        toast.error("Submission failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaMosque /> Register Mosque
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="mosqueName"
            value={formData.mosqueName}
            onChange={handleChange}
            className="input"
            placeholder="Mosque Name"
            required
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input"
            placeholder="Full Address"
            required
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input"
            placeholder="City"
            required
          />
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="input"
            placeholder="State / Province"
            required
          />
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="input"
            placeholder="Country"
            required
          />
          <input
            name="googleMapsLink"
            value={formData.googleMapsLink}
            onChange={handleChange}
            className="input"
            placeholder="Google Maps Link"
            required
          />
          <input
            name="establishedYear"
            value={formData.establishedYear}
            onChange={handleChange}
            className="input"
            placeholder="Established Year"
            type="number"
          />
          <select
            name="mosqueType"
            value={formData.mosqueType}
            onChange={handleChange}
            className="input"
          >
            <option>Jama Masjid</option>
            <option>Small Mosque</option>
            <option>Eidgah</option>
          </select>
        </div>

        <hr />

        <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <FaUserAlt /> Contact & Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="imamName"
            value={formData.imamName}
            onChange={handleChange}
            className="input"
            placeholder="Imam Name"
            required
          />
          <input
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="input"
            placeholder="Contact Person"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="Phone Number"
            type="tel"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="Email"
            type="email"
            required
          />
          <input
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="input"
            placeholder="Govt. Registration Number (optional)"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Submit Registration
        </button>
      </form>

      <style jsx>{`
        .input {
          @apply p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300;
        }
      `}</style>
    </div>
  );
}
