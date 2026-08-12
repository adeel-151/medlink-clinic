"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiPhone, FiCalendar, FiMapPin, FiClock } from "react-icons/fi";
import { FaStethoscope, FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import BookingModal from "./BookingModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ─── TOP UTILITY BAR ─── */}
      <div className="bg-slate-900 text-slate-300 py-2.5 hidden lg:block text-[13px] font-medium border-b border-slate-800">
        <div className="max-w-1280 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FiPhone className="text-teal-400" size={14} />
              <span>Emergency: <strong className="text-white">(021) 612-45741</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-teal-400" size={14} />
              <span>Mon - Fri: 8:00 AM - 7:00 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-teal-400" size={14} />
            <span>123 Healthcare Ave, Medical District, NY</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN NAVBAR ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-4"
            : "bg-white py-6"
        }`}
      >
        <div className="max-w-1280 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 bg-teal-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <FaStethoscope className="text-white text-xl" />
            </div>
            <div className="leading-none">
              <span className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                MedLink
              </span>
              <span className="block text-[11px] text-teal-700 font-bold tracking-[0.15em] uppercase mt-1">
                Medical Center
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold tracking-wide uppercase transition-colors ${
                  pathname === link.href ? "text-teal-700" : "text-slate-600 hover:text-teal-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href={(session.user as any)?.role === "PATIENT" ? "/dashboard/patient" : "/dashboard"}
                  className="flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors uppercase tracking-wide"
                >
                  <FaUserCircle size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-[13px] font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-teal-700 transition-colors uppercase tracking-wide"
              >
                <FaUserCircle size={18} className="text-teal-600" />
                Login
              </Link>
            )}
            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
            <Link
              href="/book"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[13px] font-bold text-white bg-slate-900 uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-teal-700 shadow-md"
            >
              <FiCalendar size={16} />
              Book Appointment
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* ─── MOBILE MENU ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-4 text-sm font-bold uppercase tracking-wider text-slate-800 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <Link
                    href="/auth/login"
                    className="btn-outline w-full text-center py-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Patient Portal
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-bold tracking-widest uppercase text-sm hover:bg-teal-700 transition-colors shadow-lg"
                  >
                    <FiCalendar size={18} />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <BookingModal />
    </>
  );
}
