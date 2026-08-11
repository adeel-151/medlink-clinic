"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiBell,
  FiShield,
  FiSave,
  FiCamera,
} from "react-icons/fi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "security", label: "Security", icon: FiShield },
    { id: "notifications", label: "Notifications", icon: FiBell },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
          Settings
        </h2>
        <p className="text-sm text-muted mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "gradient-primary text-white shadow-md shadow-primary-500/25"
                : "bg-white text-body hover:bg-primary-50 border border-primary-100"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div variants={fadeInUp} className="stat-card">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-primary-50">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">
                DS
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-white border-2 border-primary-100 flex items-center justify-center text-primary-500 hover:bg-primary-50 transition-colors shadow-sm">
                <FiCamera size={14} />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading font-[family-name:var(--font-heading)]">
                Dr. Sarah Mitchell
              </h3>
              <span className="text-sm text-primary-500 font-medium">
                Cardiologist
              </span>
              <p className="text-xs text-muted mt-1">
                Member since January 2024
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  defaultValue="Sarah"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  defaultValue="Mitchell"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  defaultValue="sarah@medlink.com"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  defaultValue="+92 300 1234567"
                  className="input-field pl-11"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-heading mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                defaultValue="Board-certified cardiologist with 15 years of experience in interventional cardiology and preventive heart care."
                className="input-field resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary">
              <FiSave size={16} />
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div variants={fadeInUp} className="stat-card">
          <h3 className="text-lg font-bold text-heading font-[family-name:var(--font-heading)] mb-6">
            Change Password
          </h3>
          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Current Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button className="btn-primary">
              <FiSave size={16} />
              Update Password
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div variants={fadeInUp} className="stat-card">
          <h3 className="text-lg font-bold text-heading font-[family-name:var(--font-heading)] mb-6">
            Notification Preferences
          </h3>
          <div className="space-y-5">
            {[
              {
                title: "Appointment Reminders",
                desc: "Get notified about upcoming appointments",
              },
              {
                title: "New Patient Alerts",
                desc: "Receive alerts when new patients register",
              },
              {
                title: "Medical Record Updates",
                desc: "Notifications for medical record changes",
              },
              {
                title: "Email Notifications",
                desc: "Receive updates via email",
              },
              {
                title: "SMS Notifications",
                desc: "Receive updates via SMS",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-primary-50 last:border-0"
              >
                <div>
                  <span className="block text-sm font-medium text-heading">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted">{item.desc}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={idx < 3}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn-primary">
              <FiSave size={16} />
              Save Preferences
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
