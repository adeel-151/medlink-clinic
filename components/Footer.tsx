import Link from "next/link";
import { FaStethoscope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Doctors", href: "#doctors" },
  { label: "Departments", href: "#departments" },
  { label: "Contact", href: "#contact" },
];

const departments = [
  "Neurology", 
  "Cardiology", 
  "Orthopedics", 
  "Pediatrics", 
  "Ophthalmology",
  "Pulmonology"
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-1280 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center">
                <FaStethoscope className="text-white text-lg" />
              </div>
              <div className="leading-none text-white">
                <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  MedLink
                </span>
                <span className="block text-[10px] text-teal-400 font-semibold tracking-wider uppercase mt-1">
                  Medical Center
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pe-4">
              Comprehensive healthcare delivered by experienced doctors, advanced technology, and a team that puts your wellbeing first.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Departments */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              Departments
            </h4>
            <ul className="space-y-3">
              {departments.map((dept) => (
                <li key={dept}>
                  <Link href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                    {dept}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-teal-500 mt-1 shrink-0" size={16} />
                <span className="text-sm text-slate-400 leading-relaxed">
                  123 Healthcare Ave, Medical District<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-teal-500 shrink-0" size={16} />
                <span className="text-sm text-slate-400">(021) 612-45741</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-teal-500 shrink-0" size={16} />
                <span className="text-sm text-slate-400">info@medlink-clinic.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="text-teal-500 mt-1 shrink-0" size={16} />
                <span className="text-sm text-slate-400 leading-relaxed">
                  Mon-Fri: 8:00 AM – 7:00 PM<br />Emergency: 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-1280 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 MedLink Medical Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <div className="flex gap-4 ml-2">
              <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook"><FaFacebookF size={16} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter"><FaTwitter size={16} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn"><FaLinkedinIn size={16} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram"><FaInstagram size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
