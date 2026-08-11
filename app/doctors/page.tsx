"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorsComponent from "@/components/home/Doctors";
import BookingModal from "@/components/BookingModal";

export default function DoctorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-12">
        <DoctorsComponent onBookAppointment={() => setIsModalOpen(true)} />
      </main>
      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
