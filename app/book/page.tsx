"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSpecialties, getDoctorsBySpecialty, getAvailableSlots, createAppointment } from "@/app/actions/booking";
import { FiChevronRight, FiChevronLeft, FiCalendar, FiClock, FiCheckCircle, FiUser } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BookingWizard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSpecialties() {
      const data = await getSpecialties();
      setSpecialties(data);
    }
    loadSpecialties();
  }, []);

  const handleSpecialtySelect = async (spec: string) => {
    setSelectedSpecialty(spec);
    setLoading(true);
    const docs = await getDoctorsBySpecialty(spec);
    setDoctors(docs);
    setLoading(false);
    setStep(2);
  };

  const handleDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc);
    setStep(3);
  };

  const handleDateSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedDoctor && date) {
      setLoading(true);
      const slots = await getAvailableSlots(selectedDoctor.id, date);
      setAvailableSlots(slots);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!session?.user?.email) {
      router.push("/auth/login?callbackUrl=/book");
      return;
    }

    try {
      setLoading(true);
      // Construct exact datetime string
      const datetimeString = `${selectedDate} ${selectedSlot}`;
      const dt = new Date(datetimeString); // Simplification for demo
      
      await createAppointment({
        doctorId: selectedDoctor.id,
        datetime: dt.toISOString(),
        reason,
        patientEmail: session.user.email
      });
      
      setStep(5); // Success step
    } catch (err: any) {
      alert(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 font-body flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-heading text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Book Your Appointment
          </h1>
          <p className="text-center text-muted mt-2">
            Schedule a visit with our top specialists in 4 easy steps.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className="absolute left-0 top-1/2 h-1 bg-teal-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {['Department', 'Doctor', 'Time', 'Confirm'].map((label, idx) => {
            const stepNumber = idx + 1;
            const active = step >= stepNumber;
            const isCurrent = step === stepNumber;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${active ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' : 'bg-gray-200 text-gray-400'}`}>
                  {step > stepNumber ? <FiCheckCircle size={20} /> : stepNumber}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isCurrent ? 'text-teal-700' : 'text-gray-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-10 flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Department */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-heading">Select Department</h2>
                {specialties.length === 0 ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specialties.map(spec => (
                      <button
                        key={spec}
                        onClick={() => handleSpecialtySelect(spec)}
                        className="p-4 rounded-2xl border-2 border-gray-100 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group flex justify-between items-center"
                      >
                        <span className="font-semibold text-gray-700 group-hover:text-teal-700">{spec}</span>
                        <FiChevronRight className="text-gray-400 group-hover:text-teal-500" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: Doctor */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <FiChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-heading">Select a {selectedSpecialty} Specialist</h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No doctors found for this department.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {doctors.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => handleDoctorSelect(doc)}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                          <FiUser size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-heading">Dr. {doc.firstName} {doc.lastName}</h3>
                          <p className="text-sm text-muted">{doc.experienceYears || 5}+ Years Experience • ⭐ {doc.rating || '4.8'}</p>
                        </div>
                        <FiChevronRight className="text-gray-400 group-hover:text-teal-500" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Time Slot */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <FiChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-heading">Choose Date & Time</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={handleDateSelect}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>

                  {selectedDate && (
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-700">Available Slots for Dr. {selectedDoctor?.lastName}</label>
                      {loading ? (
                        <div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>
                      ) : availableSlots.length === 0 ? (
                        <p className="text-red-500 text-sm">No slots available on this date.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {availableSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                selectedSlot === slot 
                                  ? 'border-teal-500 bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                                  : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    disabled={!selectedDate || !selectedSlot}
                    onClick={nextStep}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Confirmation
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Confirm */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <button onClick={prevStep} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <FiChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-heading">Confirm Appointment</h2>
                </div>

                <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100 space-y-4">
                  <div className="flex items-center gap-4 border-b border-teal-100 pb-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm">
                      <FiUser size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-teal-700 font-semibold uppercase tracking-wider">{selectedSpecialty}</p>
                      <h3 className="text-lg font-bold text-heading">Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <FiCalendar className="text-teal-600" size={18} />
                      {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <FiClock className="text-teal-600" size={18} />
                      {selectedSlot}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Reason for visit (Optional)</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none h-24"
                    placeholder="Briefly describe your symptoms or reason for visit..."
                  ></textarea>
                </div>

                {!session ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex gap-3 items-start">
                    <FiCheckCircle size={18} className="shrink-0 mt-0.5" />
                    <p>You need to be logged in as a patient to book this appointment. You will be asked to log in or create an account in the next step.</p>
                  </div>
                ) : (session.user as any)?.role !== "PATIENT" ? (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 text-sm flex gap-3 items-start">
                    <FiCheckCircle size={18} className="shrink-0 mt-0.5" />
                    <p>Only patients can book appointments. You are logged in as { (session.user as any)?.role }.</p>
                  </div>
                ) : null}

                <div className="pt-4 flex justify-end gap-3">
                  <button onClick={prevStep} className="px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleConfirm}
                    disabled={loading || Boolean(session && (session.user as any)?.role !== "PATIENT")}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : session ? "Confirm Booking" : "Login to Book"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Success */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10"
              >
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-heading">Booking Confirmed!</h2>
                <p className="text-muted max-w-md mx-auto">
                  Your appointment with Dr. {selectedDoctor?.lastName} on {selectedDate} at {selectedSlot} has been successfully scheduled.
                </p>
                <div className="pt-6">
                  <Link href="/dashboard/patient" className="btn-primary inline-flex">
                    Go to My Appointments
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
