"use client";

import { Suspense, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function BookingModalInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get('modal') === 'booking';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Delay resetting state to prevent UI flicker while closing
      setTimeout(() => setStep(1), 300);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('modal');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-0">
        {step === 1 ? (
          <div className="p-8">
            <DialogHeader className="mb-6 text-left">
              <div className="w-12 h-12 rounded-none bg-teal-50 flex items-center justify-center mb-6">
                <FaUserMd className="text-teal-700 text-xl" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Book Appointment
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Select your preferred doctor and time slot.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Select Department</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10">
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Select Doctor</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10">
                  <option>Dr. Sarah Mitchell</option>
                  <option>Dr. Michael Chen</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Date</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input type="date" className="pl-9 bg-slate-50 text-sm h-12" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Time</label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input type="time" className="pl-9 bg-slate-50 text-sm h-12" required />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 text-center flex flex-col items-center justify-center min-h-[400px] bg-slate-900 text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
            >
              <FiCheckCircle className="text-teal-400 text-6xl mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Booking Confirmed!
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Your appointment has been successfully scheduled. We have sent the details to your email.
            </p>
            <Button onClick={() => handleClose(false)} variant="outline" className="w-full text-slate-900 h-12 text-base">
              Done
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BookingModal() {
  return (
    <Suspense fallback={null}>
      <BookingModalInner />
    </Suspense>
  );
}
