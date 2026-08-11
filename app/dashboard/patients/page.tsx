"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiCalendar,
  FiUser,
  FiEdit2,
} from "react-icons/fi";
import { getPatients, createPatient } from "@/app/actions/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [patientsData, setPatientsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getPatients();
    setPatientsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createPatient(formData);
    await loadData();
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "" });
  };

  const filtered = patientsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
            Patients
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage patient records and information
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="btn-primary text-sm">
            <FiPlus />
            Add Patient
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">First Name</label>
                  <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Ali" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Last Name</label>
                  <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Ahmed" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Email Address</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ali@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Phone Number</label>
                <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+92 300 1234567" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Date of Birth</label>
                <Input required type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Patient"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <FiUser className="text-primary-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              {patientsData.length}
            </span>
            <span className="block text-xs text-muted">Total Patients</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <FiCalendar className="text-green-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              {patientsData.reduce((acc, p) => acc + p.visits, 0)}
            </span>
            <span className="block text-xs text-muted">Total Visits</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <FiPlus className="text-blue-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              3
            </span>
            <span className="block text-xs text-muted">New This Week</span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeInUp} className="stat-card">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="patient-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Search patients by name or email..."
          />
        </div>
      </motion.div>

      {/* Patient Cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((patient) => (
            <motion.div
              key={patient.id}
              variants={fadeInUp}
              className="stat-card glass-card-hover group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-lg font-extrabold text-white font-[family-name:var(--font-heading)]">
                    {patient.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-heading font-[family-name:var(--font-heading)]">
                      {patient.name}
                    </h3>
                    <span className="text-xs text-muted font-bold">
                      ID: PAT-{String(patient.id).substr(0,8).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-2 pb-2">
                  <button className="icon-btn-secondary" title="Edit Patient">
                    <FiEdit2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-body">
                  <FiMail size={14} className="text-primary-500 shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-body">
                  <FiPhone size={14} className="text-primary-500 shrink-0" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-body">
                  <FiCalendar size={14} className="text-primary-500 shrink-0" />
                  Last visit: {patient.lastVisit}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary-50 flex items-center justify-between">
                <div className="text-xs text-muted">Last visited: {patient.lastVisit}</div>
                <button className="btn-outline text-xs">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <FiUser className="mx-auto text-4xl text-muted mb-3" />
              <p className="text-muted">No patients found.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
