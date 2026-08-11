"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiCalendar,
  FiUser,
  FiDownload,
  FiEye,
  FiClipboard,
} from "react-icons/fi";
import { getPrescriptions, getPatients, getDoctors, createPrescription } from "@/app/actions/dashboard";
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

export default function PrescriptionsPage() {
  const [search, setSearch] = useState("");
  const [prescriptionsData, setPrescriptionsData] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [activePdfData, setActivePdfData] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    medicines: "",
    dosage: "",
    duration: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [presc, pats, docs] = await Promise.all([
      getPrescriptions(),
      getPatients(),
      getDoctors()
    ]);
    setPrescriptionsData(presc);
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
    await createPrescription(formData);
    await loadData();
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ patientId: "", doctorId: "", medicines: "", dosage: "", duration: "" });
  };

  const filtered = prescriptionsData.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.medicines.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = async (prescription: any) => {
    setActivePdfData(prescription);
    
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
        pdf.save(`Prescription_${prescription.patientName.replace(" ", "_")}.pdf`);
        setActivePdfData(null);
      }
    }, 100);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-heading font-[family-name:var(--font-heading)]">
            Prescriptions
          </h2>
          <p className="text-sm text-muted mt-1">
            Manage and issue patient prescriptions
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="btn-primary text-sm">
            <FiPlus />
            New Prescription
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Issue Prescription</DialogTitle>
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
                <label className="text-xs font-semibold text-heading">Prescribing Doctor</label>
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
                <label className="text-xs font-semibold text-heading">Medicines</label>
                <Input required value={formData.medicines} onChange={e => setFormData({...formData, medicines: e.target.value})} placeholder="e.g. Amoxicillin 500mg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Dosage</label>
                  <Input required value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="1 tab, twice a day" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-heading">Duration</label>
                  <Input required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="5 days" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Prescription"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={fadeInUp} className="stat-card">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="prescriptions-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
            placeholder="Search by patient name or medicine..."
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((prescription) => (
            <motion.div
              key={prescription.id}
              variants={fadeInUp}
              className="stat-card glass-card-hover group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start border-b border-primary-50 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-sm font-extrabold text-white">
                      {prescription.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-heading">
                        {prescription.patientName}
                      </h3>
                      <span className="text-xs text-muted flex items-center gap-1 mt-1">
                        <FiUser size={10} />
                        {prescription.doctorName}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-full">
                    <FiCalendar size={10} className="text-primary-500" />
                    {prescription.date}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FiClipboard className="text-primary-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-0.5">
                        Medicines
                      </span>
                      <p className="text-sm text-heading font-medium leading-relaxed">
                        {prescription.medicines}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-primary-50 rounded-xl">
                    <div>
                      <span className="text-[10px] font-semibold text-primary-500 uppercase">
                        Dosage
                      </span>
                      <p className="text-xs text-heading font-medium mt-0.5">
                        {prescription.dosage}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-primary-500 uppercase">
                        Duration
                      </span>
                      <p className="text-xs text-heading font-medium mt-0.5">
                        {prescription.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary-50 flex items-center justify-end gap-2">
                <Dialog>
                  <DialogTrigger className="icon-btn-secondary" title="View Details">
                    <FiEye size={18} />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Prescription Details</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase">Patient Name</p>
                          <h3 className="text-lg font-bold text-slate-900">{prescription.patientName}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-500 uppercase">Date</p>
                          <p className="text-sm font-semibold text-slate-700">{prescription.date}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Prescribing Doctor</p>
                        <p className="text-base font-semibold text-slate-800 flex items-center gap-2">
                          <FiUser className="text-teal-600" />
                          {prescription.doctorName}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-bold text-teal-600 uppercase mb-1">Medicines</p>
                        <p className="text-base font-bold text-teal-900 bg-teal-50 p-4 rounded-lg border border-teal-100">
                          {prescription.medicines}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Dosage</p>
                          <p className="text-sm text-slate-700 font-semibold">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Duration</p>
                          <p className="text-sm text-slate-700 font-semibold">{prescription.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button 
                        onClick={() => downloadPDF(prescription)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-semibold"
                      >
                        <FiDownload size={16} />
                        Download PDF
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
                <button 
                  onClick={() => downloadPDF(prescription)}
                  className="icon-btn"
                  title="Download PDF"
                >
                  <FiDownload size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FiClipboard className="mx-auto text-3xl text-muted mb-2" />
              <p className="text-sm text-muted">No prescriptions found.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Hidden PDF Template */}
      {activePdfData && (
        <div className="fixed top-[2000px] left-[-2000px] opacity-0 pointer-events-none">
          <div ref={pdfTemplateRef} className="w-[800px] bg-white relative overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '40px', minHeight: '1050px', border: '1px solid #e2e8f0', fontFamily: '"Arial", sans-serif' }}>
            
            {/* Watermark */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', opacity: 0.04, fontSize: '120px', fontWeight: '900', color: '#0d9488', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', letterSpacing: '-0.05em' }}>
              MEDLINK CLINIC
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Header */}
              <div style={{ borderBottom: '3px solid #0d9488', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#0d9488', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '32px', fontWeight: 'bold' }}>
                    +
                  </div>
                  <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0d9488', margin: 0, fontFamily: '"Georgia", serif', letterSpacing: '-0.5px' }}>
                      MEDLINK CLINIC
                    </h1>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>123 Health Ave, Medical District, NY 10001</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Tel: +1 (555) 123-4567 | www.medlink.com</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Prescription</h2>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0d9488', margin: '8px 0 4px 0' }}>Rx-{String(activePdfData.id).substr(0,8).toUpperCase()}</p>
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
                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>{activePdfData.patientName}</strong>
                      </td>
                      <td style={{ width: '50%', padding: '0 0 10px 10px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>Prescribing Doctor</span>
                        <strong style={{ fontSize: '18px', color: '#0f172a' }}>{activePdfData.doctorName}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Body Content */}
              <div style={{ minHeight: '400px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '64px', fontWeight: 'bold', color: '#0d9488', fontFamily: '"Georgia", serif', lineHeight: '1', opacity: 0.8 }}>Rx</span>
                  <div style={{ flex: 1, borderTop: '2px dashed #e2e8f0', marginTop: '32px' }}></div>
                </div>
                
                <div style={{ marginBottom: '40px', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '25px' }}>
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#115e59', margin: '0 0 20px 0', borderBottom: '1px solid #99f6e4', paddingBottom: '15px' }}>
                    {activePdfData.medicines}
                  </h4>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '50%' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0d9488', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Dosage Instructions</span>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{activePdfData.dosage}</span>
                        </td>
                        <td style={{ width: '50%' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0d9488', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Duration</span>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{activePdfData.duration}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures & Footer */}
              <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                  <div style={{ width: '300px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: 'bold' }}>Valid for 30 days from prescription date.</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0', fontStyle: 'italic' }}>Dispense as written unless generic substitution is permitted.</p>
                  </div>
                  <div style={{ width: '250px', textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '10px', minHeight: '60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '36px', color: '#0f172a' }}>{activePdfData.doctorName}</span>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Doctor's Signature</p>
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
