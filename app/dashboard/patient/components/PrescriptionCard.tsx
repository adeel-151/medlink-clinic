"use client";

import { FiFileText, FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";

export default function PrescriptionCard({ presc }: { presc: any }) {
  
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MedLink Clinic", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Prescription", 150, 25);
    
    // Body
    doc.setTextColor(50, 50, 50);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", 20, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient ID: ${presc.patientId.slice(0, 8).toUpperCase()}`, 20, 70);
    doc.text(`Date: ${new Date(presc.createdAt).toLocaleDateString()}`, 20, 78);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Information", 120, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Dr. ${presc.doctor.firstName} ${presc.doctor.lastName}`, 120, 70);
    doc.text(`${presc.doctor.specialty}`, 120, 78);
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);
    
    // Medicines
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Rx", 20, 110);
    
    doc.setFontSize(12);
    doc.text("Medicine:", 35, 110);
    doc.setFont("helvetica", "normal");
    doc.text(presc.medicines, 35, 120);
    
    doc.setFont("helvetica", "bold");
    doc.text("Dosage:", 35, 135);
    doc.setFont("helvetica", "normal");
    doc.text(presc.dosage, 35, 145);
    
    if (presc.instructions) {
      doc.setFont("helvetica", "bold");
      doc.text("Instructions:", 35, 160);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(presc.instructions, 150);
      doc.text(lines, 35, 170);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated prescription.", 105, 280, { align: "center" });

    doc.save(`Prescription_${new Date(presc.createdAt).toLocaleDateString().replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <FiFileText className="text-teal-400" />
          <span className="text-xs text-slate-300 font-medium">
            {new Date(presc.createdAt).toLocaleDateString()}
          </span>
        </div>
        <button 
          onClick={handleDownload}
          className="p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-teal-500 hover:text-white" 
          title="Download PDF"
        >
          <FiDownload size={14} />
        </button>
      </div>
      <h3 className="font-bold text-white text-sm mb-1">{presc.medicines}</h3>
      <p className="text-xs text-slate-300 mb-2">Dosage: {presc.dosage}</p>
      <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
        Dr. {presc.doctor.lastName}
      </div>
    </div>
  );
}
