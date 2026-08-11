"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { getDoctors, createDoctor } from "@/app/actions/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const specialties = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Ophthalmology",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [doctorsData, setDoctorsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    specialty: "Cardiology",
    experienceYears: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getDoctors();
    setDoctorsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createDoctor({
      ...formData,
      experienceYears: parseInt(formData.experienceYears) || 0
    });
    await loadData();
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ firstName: "", lastName: "", email: "", specialty: "Cardiology", experienceYears: "" });
  };

  const filtered = doctorsData.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesSpec =
      activeSpecialty === "All" || doc.specialty === activeSpecialty;
    return matchesSearch && matchesSpec;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
            Doctor Directory
          </h2>
          <p className="text-sm text-muted mt-1">
            Find and book appointments with our expert physicians
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="btn-primary text-sm">
            <FaUserMd />
            Add New Doctor
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">First Name</label>
                  <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Sarah" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Last Name</label>
                  <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Mitchell" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Email Address</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="dr.sarah@medlink.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Specialty</label>
                  <select 
                    required 
                    value={formData.specialty} 
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                    className="input-field appearance-none w-full"
                  >
                    {specialties.filter(s => s !== "All").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Experience (Years)</label>
                  <Input required type="number" min="0" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} placeholder="15" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Doctor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={fadeInUp} className="stat-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="doctor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
              placeholder="Search doctors by name..."
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <FiFilter className="text-muted shrink-0" />
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSpecialty === spec
                    ? "gradient-primary text-white shadow-md shadow-primary-500/25"
                    : "bg-primary-50 text-body hover:bg-primary-100"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filtered.map((doc) => (
            <motion.div
              key={doc.id}
              variants={fadeInUp}
              className="stat-card glass-card-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-lg font-extrabold text-white font-[family-name:var(--font-heading)] shrink-0">
                  {doc.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-heading font-[family-name:var(--font-heading)] truncate">
                    {doc.name}
                  </h3>
                  <span className="inline-block mt-1 text-xs font-semibold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                    {doc.specialty}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
                    <span className="text-xs font-semibold text-heading">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-muted">
                      ({doc.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <FiClock size={12} className="text-primary-500" />
                  {doc.experience}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <FiMapPin size={12} className="text-primary-500" />
                  {doc.patients} patients
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-primary-50 flex items-center gap-2">
                <FiCalendar className="text-primary-500" size={14} />
                <span className="text-xs font-medium text-heading">
                  Next: {doc.nextSlot}
                </span>
              </div>

              <button className="mt-4 btn-primary w-full justify-center text-sm">
                Book Appointment
                <FiArrowRight size={14} />
              </button>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <FaUserMd className="mx-auto text-4xl text-muted mb-3" />
              <p className="text-muted">No doctors found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
