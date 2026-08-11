"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";
import { FaStethoscope, FaUserMd } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/auth/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-12 xl:px-20 max-w-2xl">
          <div className="w-20 h-20 mx-auto bg-teal-600 flex items-center justify-center mb-10 shadow-lg">
            <FaStethoscope className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Join <span className="text-teal-400">MedLink</span> Today
          </h2>
          <p className="text-slate-300 text-lg xl:text-xl leading-relaxed">
            Create your account to book appointments, access medical records,
            and connect with top healthcare professionals.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-600 flex items-center justify-center shadow-md">
              <FaStethoscope className="text-white text-xl" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              MedLink
            </span>
          </div>

          <div className="bg-white p-8 sm:p-10 shadow-2xl border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Create Account
            </h1>
            <p className="text-base text-slate-500 mb-8">
              Fill in the details to register your account
            </p>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "PATIENT" })}
                  className={`p-4 border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                    formData.role === "PATIENT"
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-slate-200 text-slate-500 hover:border-teal-200 hover:bg-slate-50"
                  }`}
                >
                  <FiUser className="text-2xl" />
                  <span className="text-sm font-bold uppercase tracking-wider">Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "DOCTOR" })}
                  className={`p-4 border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                    formData.role === "DOCTOR"
                      ? "border-teal-600 bg-teal-50 text-teal-800"
                      : "border-slate-200 text-slate-500 hover:border-teal-200 hover:bg-slate-50"
                  }`}
                >
                  <FaUserMd className="text-2xl" />
                  <span className="text-sm font-bold uppercase tracking-wider">Doctor</span>
                </button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">First Name</label>
                  <input
                    id="register-firstname"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Last Name</label>
                  <input
                    id="register-lastname"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center text-slate-400">
                      <FiLock size={16} />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-400 hover:text-teal-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Confirm</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center text-slate-400">
                      <FiLock size={16} />
                    </div>
                    <input
                      id="register-confirm-password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <FiArrowRight size={18} className="ml-2" />}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-teal-700 hover:text-teal-900 transition-colors ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
