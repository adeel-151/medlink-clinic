"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { getAppointments, getPatients, getDoctors, createAppointment } from "@/app/actions/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";

const statusConfig: Record<AppointmentStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Scheduled: { color: "text-blue-600", bg: "bg-blue-50", icon: FiClock },
  Completed: { color: "text-green-600", bg: "bg-green-50", icon: FiCheck },
  Cancelled: { color: "text-red-600", bg: "bg-red-50", icon: FiX },
};

const tabs: AppointmentStatus[] = ["Scheduled", "Completed", "Cancelled"];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AppointmentStatus | "All">("All");
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    datetime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [apts, pats, docs] = await Promise.all([
      getAppointments(),
      getPatients(),
      getDoctors()
    ]);
    setAppointmentsData(apts);
    setPatients(pats);
    setDoctors(docs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createAppointment(formData);
    await loadData();
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ patientId: "", doctorId: "", datetime: "" });
  };

  const filtered = appointmentsData.filter((apt) => {
    const matchSearch =
      apt.patient.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" || apt.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
            Appointments
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage and track all appointment schedules
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="btn-primary text-sm">
            <FiPlus />
            New Appointment
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Select Patient</label>
                <select 
                  required 
                  value={formData.patientId} 
                  onChange={e => setFormData({...formData, patientId: e.target.value})}
                  className="input-field appearance-none w-full"
                >
                  <option value="" disabled>Choose a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Select Doctor</label>
                <select 
                  required 
                  value={formData.doctorId} 
                  onChange={e => setFormData({...formData, doctorId: e.target.value})}
                  className="input-field appearance-none w-full"
                >
                  <option value="" disabled>Choose a doctor...</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Date & Time</label>
                <Input required type="datetime-local" value={formData.datetime} onChange={e => setFormData({...formData, datetime: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <FiClock className="text-blue-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              {appointmentsData.filter((a) => a.status === "Scheduled").length}
            </span>
            <span className="block text-xs text-muted">Upcoming</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <FiCheck className="text-green-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              {appointmentsData.filter((a) => a.status === "Completed").length}
            </span>
            <span className="block text-xs text-muted">Completed</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <FiAlertCircle className="text-red-500" size={22} />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
              {appointmentsData.filter((a) => a.status === "Cancelled").length}
            </span>
            <span className="block text-xs text-muted">Cancelled</span>
          </div>
        </div>
      </motion.div>

      {/* Search & Tabs */}
      <motion.div variants={fadeInUp} className="stat-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="appointment-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
              placeholder="Search by patient or doctor..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "All"
                  ? "gradient-primary text-white shadow-md shadow-primary-500/25"
                  : "bg-primary-50 text-body hover:bg-primary-100"
              }`}
            >
              All
            </button>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "gradient-primary text-white shadow-md shadow-primary-500/25"
                    : "bg-primary-50 text-body hover:bg-primary-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Appointments Table */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <motion.div variants={fadeInUp} className="stat-card overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider">Patient</th>
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider">Doctor</th>
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Time</th>
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-muted uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => {
                const config = statusConfig[apt.status as AppointmentStatus];
                return (
                  <tr
                    key={apt.id}
                    className="border-b border-primary-50 last:border-0 hover:bg-primary-50/50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-white">
                          {apt.initials}
                        </div>
                        <span className="text-sm font-medium text-heading">
                          {apt.patient}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-body">{apt.doctor}</span>
                      <span className="block text-xs text-muted">{apt.specialty}</span>
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-sm text-body">
                        <FiCalendar size={12} className="text-primary-500" />
                        {apt.date}
                      </span>
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-sm text-body">
                        <FiClock size={12} className="text-primary-500" />
                        {apt.time}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}
                      >
                        <config.icon size={10} />
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 text-muted">
                        <FiMoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto text-3xl text-muted mb-2" />
              <p className="text-sm text-muted">No appointments found.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
