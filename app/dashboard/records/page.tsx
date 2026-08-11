"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiUser,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import { getRecords, getPatients, getDoctors, createRecord } from "@/app/actions/dashboard";
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

export default function RecordsPage() {
  const [search, setSearch] = useState("");
  const [recordsData, setRecordsData] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [activePdfData, setActivePdfData] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnoses: "",
    treatments: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [recs, pats, docs] = await Promise.all([
      getRecords(),
      getPatients(),
      getDoctors()
    ]);
    setRecordsData(recs);
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
    await createRecord(formData);
    await loadData();
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ patientId: "", doctorId: "", diagnoses: "", treatments: "", notes: "" });
  };

  const filtered = recordsData.filter(
    (r) =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = async (record: any) => {
    setActivePdfData(record);
    
    setTimeout(async () => {
      if (pdfTemplateRef.current) {
        const html2canvas = (await import("html2canvas")).default;
        const jsPDF = (await import("jspdf")).default;
        
        const canvas = await html2canvas(pdfTemplateRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Medical_Record_${record.patient.replace(" ", "_")}.pdf`);
        setActivePdfData(null);
      }
    }, 100);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
            Medical Records
          </h2>
          <p className="text-sm text-muted mt-1">
            View and manage patient medical records
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="btn-primary text-sm">
            <FiPlus />
            New Record
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
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
                <label className="text-xs font-semibold text-heading">Attending Doctor</label>
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
                <label className="text-xs font-semibold text-heading">Diagnosis</label>
                <Input required value={formData.diagnoses} onChange={e => setFormData({...formData, diagnoses: e.target.value})} placeholder="e.g. Hypertension" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Treatment Plan</label>
                <Input required value={formData.treatments} onChange={e => setFormData({...formData, treatments: e.target.value})} placeholder="e.g. Prescribed ACE Inhibitors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-heading">Additional Notes</label>
                <Input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Any additional remarks..." />
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={fadeInUp} className="stat-card">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="records-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Search by patient name or diagnosis..."
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <motion.div variants={stagger} className="space-y-4">
          {filtered.map((record) => (
            <motion.div
              key={record.id}
              variants={fadeInUp}
              className="stat-card glass-card-hover"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <FiFileText className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-heading font-[family-name:var(--font-heading)]">
                        {record.patient}
                      </h3>
                      <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-bold">
                        REC-{String(record.id).substr(0,8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <FiUser size={10} />
                        {record.doctor}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <FiCalendar size={10} />
                        {record.date}
                      </span>
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-red-50">
                        <span className="text-[10px] font-bold text-red-500 uppercase">
                          Diagnosis
                        </span>
                        <p className="text-xs text-red-800 font-semibold mt-1">
                          {record.diagnosis}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50">
                        <span className="text-[10px] font-bold text-green-600 uppercase">
                          Treatment
                        </span>
                        <p className="text-xs text-green-800 font-semibold mt-1">
                          {record.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger className="icon-btn-secondary" title="View Details">
                      <FiEye size={18} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Medical Record Details</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Patient</p>
                            <h3 className="text-lg font-bold text-slate-900">{record.patient}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 uppercase">Date</p>
                            <p className="text-sm font-semibold text-slate-700">{record.date}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Attending Doctor</p>
                          <p className="text-base font-semibold text-slate-800 flex items-center gap-2">
                            <FiUser className="text-teal-600" />
                            {record.doctor}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold text-red-500 uppercase mb-1">Diagnosis</p>
                          <p className="text-sm text-slate-700 bg-red-50 p-3 rounded-lg border border-red-100 leading-relaxed">
                            {record.diagnosis}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase mb-1">Treatment Plan</p>
                          <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100 leading-relaxed">
                            {record.treatment}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <button 
                          onClick={() => downloadPDF(record)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-semibold"
                        >
                          <FiDownload size={16} />
                          Download PDF
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button 
                    onClick={() => downloadPDF(record)}
                    className="icon-btn"
                    title="Download PDF"
                  >
                    <FiDownload size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="mx-auto text-3xl text-muted mb-2" />
              <p className="text-sm text-muted">No medical records found.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Hidden PDF Template for Records */}
      {activePdfData && (
        <div className="fixed top-[2000px] left-[-2000px] opacity-0 pointer-events-none">
          <div ref={pdfTemplateRef} className="w-[800px] bg-white relative overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '40px', minHeight: '1050px', border: '1px solid #e2e8f0', fontFamily: '"Arial", sans-serif' }}>
            
            {/* Watermark */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', opacity: 0.04, fontSize: '120px', fontWeight: '900', color: '#0f766e', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', letterSpacing: '-0.05em' }}>
              MEDLINK CLINIC
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Header */}
              <div style={{ borderBottom: '3px solid #0f766e', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#0f766e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '32px', fontWeight: 'bold' }}>
                    +
                  </div>
                  <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f766e', margin: 0, fontFamily: '"Georgia", serif', letterSpacing: '-0.5px' }}>
                      MEDLINK CLINIC
                    </h1>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>123 Health Ave, Medical District, NY 10001</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Tel: +1 (555) 123-4567 | www.medlink.com</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Medical Record</h2>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f766e', margin: '8px 0 4px 0' }}>REC-{String(activePdfData.id).substr(0,8).toUpperCase()}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Date: {activePdfData.date}</p>
                </div>
              </div>

              {/* Patient Info Table */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%', padding: '0 10px 10px 0' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Patient Name</span>
                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>{activePdfData.patient}</strong>
                      </td>
                      <td style={{ width: '50%', padding: '0 0 10px 10px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Attending Doctor</span>
                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>{activePdfData.doctor}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Body Content */}
              <div style={{ minHeight: '400px' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f766e', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px', letterSpacing: '1px' }}>Primary Diagnosis</h4>
                  <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: 0, padding: '15px', backgroundColor: '#fff1f2', borderLeft: '4px solid #e11d48', borderRadius: '0 8px 8px 0' }}>
                    {activePdfData.diagnosis}
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f766e', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px', letterSpacing: '1px' }}>Treatment Plan & Notes</h4>
                  <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: 0, padding: '15px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a', borderRadius: '0 8px 8px 0' }}>
                    {activePdfData.treatment}
                  </p>
                </div>
              </div>

              {/* Signatures & Footer */}
              <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                  <div style={{ width: '250px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontStyle: 'italic' }}>Confidential Medical Record. This document is intended solely for the use of the individual or entity to whom it is addressed.</p>
                  </div>
                  <div style={{ width: '250px', textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '10px', minHeight: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '36px', color: '#0f172a' }}>{activePdfData.doctor}</span>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Authorized Signature</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                    Generated electronically on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
