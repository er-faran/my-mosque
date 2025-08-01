"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import mosqueImage from "../../(images)/mosque-hero-section.jpg"; // Replace with your downloaded image path

const roles = ["Jamati", "Imam", "Motawalli"];

const StepLogin = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    toast.success(`${selectedRole} login successful!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 flex flex-col lg:flex-row items-center justify-evenly">
      {/* Left Image Section */}
      <div className="flex flex-row gap-5 w-full lg:w-1/2 max-w-md flex-1 bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-start flex-col gap-5">
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:underline mb-4"
          >
            Select Role
          </button>
          <button
            onClick={() => setStep(2)}
            className="text-blue-600 hover:underline mb-4"
          >
            Login as {selectedRole || "Select Role"}
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center gap-2 justify-center text-blue-700">
            <FaUserShield /> {step === 1 ? "Select Role" : "Login"}
          </h2>

          {step === 1 && (
            <div className="space-y-4">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    // setStep(2);
                  }}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 underline"
                >
                  Change Role
                </button>

                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Login as {selectedRole}
                </button>
              </div>
            </div>
          )}

          {/* next button */}
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Right Login Box */}
      <div className="hidden lg:block w-1/3 text-right p-6">
        <Image
          src={mosqueImage}
          alt="Login Illustration"
          className="rounded-xl shadow-xl"
          width={400}
          height={60}
        />
        {/* <p className="text-xs text-center mt-2 text-gray-400">
          Image by{" "}
          <a
            href="https://pixabay.com/users/ledik-15177025/"
            className="underline"
          >
            ledik
          </a>{" "}
          from{" "}
          <a href="https://pixabay.com/" className="underline">
            Pixabay
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default StepLogin;
