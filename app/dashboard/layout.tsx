"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaStethoscope } from "react-icons/fa";
import {
  FiGrid, FiBarChart2, FiUsers, FiCalendar, FiFileText,
  FiClipboard, FiSettings, FiLogOut, FiSearch, FiBell,
  FiMenu, FiX, FiChevronDown,
} from "react-icons/fi";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: FiGrid },
  { label: "Appointments", href: "/dashboard/appointments", icon: FiCalendar },
  { label: "Doctors", href: "/dashboard/doctors", icon: FiUsers },
  { label: "Patients", href: "/dashboard/patients", icon: FiClipboard },
  { label: "Records", href: "/dashboard/records", icon: FiFileText },
  { label: "Prescriptions", href: "/dashboard/prescriptions", icon: FiBarChart2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-dashboard flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 h-[72px] flex items-center justify-between border-b border-gray-50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] gradient-primary flex items-center justify-center shadow-[0_4px_12px_rgba(13,148,136,0.25)]">
              <FaStethoscope className="text-white text-sm" />
            </div>
            <div className="leading-none">
              <span className="text-base font-extrabold text-heading tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Med<span className="text-gradient">Link</span>
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary-50 transition-all"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pt-6 pb-4 space-y-1 overflow-y-auto">
          <span className="block px-4 pb-3 text-[10px] font-bold text-muted uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-heading)' }}>
            Main Menu
          </span>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <link.icon size={18} />
                <span style={{ fontFamily: 'var(--font-body)' }}>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-gray-50">
            <span className="block px-4 pb-3 text-[10px] font-bold text-muted uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-heading)' }}>
              Account
            </span>
            <Link href="/dashboard/settings" className={`sidebar-link ${pathname === "/dashboard/settings" ? "active" : ""}`}>
              <FiSettings size={18} />
              <span style={{ fontFamily: 'var(--font-body)' }}>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-4">
          <div className="gradient-primary rounded-[18px] p-5 text-center shadow-[0_4px_20px_rgba(13,148,136,0.2)]">
            <div className="w-10 h-10 mx-auto rounded-[12px] bg-white/20 flex items-center justify-center mb-3">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <h4 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Pro Features</h4>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed">Unlock advanced analytics and reports.</p>
            <button className="mt-3 bg-white text-primary-700 text-xs font-bold px-4 py-2.5 rounded-[10px] hover:bg-primary-50 transition-colors w-full" style={{ fontFamily: 'var(--font-heading)' }}>
              Upgrade Now
            </button>
          </div>
          <button className="mt-3 sidebar-link text-red-500 w-full hover:bg-red-50 hover:text-red-600">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100 h-[72px]">
          <div className="flex items-center justify-between px-5 lg:px-8 h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-muted hover:bg-primary-50 hover:text-primary-600 transition-all"
              >
                <FiMenu size={20} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-heading tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  {sidebarLinks.find((l) => l.href === pathname)?.label || "Dashboard"}
                </h1>
                <p className="text-[11px] text-muted font-medium hidden sm:block">Welcome back, Dr. Sarah</p>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={15} />
                <input
                  id="dashboard-search"
                  type="text"
                  placeholder="Search patients or files..."
                  className="input-field pl-11 py-2.5 bg-gray-50 border-transparent text-sm focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="relative p-2.5 rounded-[12px] bg-gray-50 text-muted hover:bg-primary-50 hover:text-primary-600 transition-all">
                <FiBell size={17} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-[12px] hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-[10px] gradient-primary flex items-center justify-center text-[11px] font-bold text-white">
                    DS
                  </div>
                  <FiChevronDown className={`text-muted transition-transform ${profileOpen ? "rotate-180" : ""}`} size={13} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden p-2"
                    >
                      <Link href="/dashboard/settings" className="block px-4 py-2.5 rounded-xl text-sm text-body hover:bg-primary-50 hover:text-primary-600 font-medium">
                        Profile Settings
                      </Link>
                      <Link href="/" className="block px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 font-medium">
                        Logout
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
