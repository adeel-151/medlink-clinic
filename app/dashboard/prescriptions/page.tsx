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
          <div ref={pdfTemplateRef} className="w-[800px] bg-white relative overflow-hidden" style={{ width: '800px', minHeight: '1100px', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: '"Arial", sans-serif', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Area */}
            <div style={{ position: 'relative', padding: '40px 40px 20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Diagonal Dark Blue Slash in Background */}
              <div style={{ position: 'absolute', top: 0, left: '50%', width: '40px', height: '100%', backgroundColor: '#0f172a', transform: 'skewX(-20deg)', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '100%', backgroundColor: '#f8fafc', zIndex: 0, opacity: 0.5 }}></div>

              {/* Left: Doctor Info */}
              <div style={{ zIndex: 10, maxWidth: '300px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0d9488', margin: 0, letterSpacing: '-0.5px' }}>
                  {activePdfData.doctorName}
                </h1>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', margin: '4px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Qualification
                </p>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
                </p>
              </div>

              {/* Right: Hospital Info */}
              <div style={{ zIndex: 10, textAlign: 'right', maxWidth: '300px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0, letterSpacing: '1px' }}>
                  HOSPITAL NAME
                </h2>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', margin: '4px 0', letterSpacing: '1px' }}>
                  SLOGAN HERE
                </p>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet do
                </p>
              </div>
            </div>

            {/* Top Bars (Teal + Light Cyan) */}
            <div style={{ width: '100%' }}>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#0d9488' }}></div>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#ffffff' }}></div>
              <div style={{ width: '100%', backgroundColor: '#e0f2fe', border: '1px solid #0d9488', padding: '8px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Patient Name: <span style={{ fontWeight: 'normal' }}>{activePdfData.patientName}</span></span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Age: <span style={{ fontWeight: 'normal' }}>--</span></span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a' }}>Date: <span style={{ fontWeight: 'normal' }}>{activePdfData.date}</span></span>
              </div>
            </div>

            {/* Body Area */}
            <div style={{ display: 'flex', flex: 1, minHeight: '650px' }}>
              {/* Left Column (Narrow, Light Grey) */}
              <div style={{ width: '25%', backgroundColor: '#f8fafc', padding: '40px 20px', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0d9488', margin: '0 0 4px 0' }}>C/C</h4>
                </div>
                <div style={{ marginBottom: '30px', marginTop: '120px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0d9488', margin: '0 0 4px 0' }}>D/E</h4>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0d9488', margin: '0 0 4px 0' }}>BP=</h4>
                </div>
              </div>

              {/* Right Column (Wide, White, Watermark) */}
              <div style={{ width: '75%', padding: '40px', position: 'relative' }}>
                {/* Watermark SVG Data URI for simple medical heart cross */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }}>
                  <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                    <line x1="12" y1="8" x2="12" y2="14"></line>
                    <line x1="9" y1="11" x2="15" y2="11"></line>
                  </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a', fontFamily: '"Times New Roman", serif', marginBottom: '30px' }}>
                    <span style={{ color: '#0f172a' }}>R</span><span style={{ fontSize: '24px' }}>x</span>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 15px 0' }}>
                      {activePdfData.medicines}
                    </h3>
                    <div style={{ display: 'flex', gap: '40px', color: '#334155' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Dosage</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{activePdfData.dosage}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Duration</span>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{activePdfData.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Area */}
            <div style={{ width: '100%', height: '80px', display: 'flex' }}>
              {/* Left Dark Blue block */}
              <div style={{ width: '35%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', clipPath: 'polygon(0 0, 90% 0, 100% 100%, 0 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '20px' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}>📞</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', display: 'block', opacity: 0.8 }}>Call Now</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>000 12345 6149</span>
                  </div>
                </div>
              </div>

              {/* Right Light Cyan block */}
              <div style={{ width: '65%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingLeft: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#0d9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#ffffff', fontSize: '10px' }}>📍</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 'bold' }}>Address Here Number 123</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#0d9488', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#ffffff', fontSize: '10px' }}>🌐</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 'bold' }}>www.yourname.com</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
