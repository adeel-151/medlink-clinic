"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) setError("Invalid email or password");
      else router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-12 xl:px-20 max-w-2xl">
          <div className="w-20 h-20 mx-auto bg-teal-600 flex items-center justify-center mb-10 shadow-lg">
            <FaStethoscope className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome Back to <span className="text-teal-400">MedLink</span>
          </h2>
          <p className="text-slate-300 text-lg xl:text-xl leading-relaxed">
            Access your dashboard, manage appointments, and connect with your healthcare team securely.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-teal-600 flex items-center justify-center shadow-md">
              <FaStethoscope className="text-white text-xl" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              MedLink
            </span>
          </div>

          <div className="bg-white p-8 sm:p-12 shadow-2xl border border-slate-100 relative">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Sign In
            </h1>
            <p className="text-base text-slate-500 mb-10">
              Enter your credentials to access your account
            </p>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                    placeholder="doctor@medlink.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-none border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer" />
                  <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Remember me</span>
                </label>
                <Link href="#" className="text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <FiArrowRight size={18} className="ml-2" />}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-bold text-teal-700 hover:text-teal-900 transition-colors ml-1">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
