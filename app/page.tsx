"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import About from "@/components/home/About";
import Features from "@/components/home/Features";
import Departments from "@/components/home/Departments";
import Doctors from "@/components/home/Doctors";
import Testimonials from "@/components/home/Testimonials";
import EmergencyCTA from "@/components/home/EmergencyCTA";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <Hero onBookAppointment={() => setIsModalOpen(true)} />
        <Stats />
        <About />
        <Features />
        <Departments />
        <Doctors onBookAppointment={() => setIsModalOpen(true)} />
        <Testimonials />
        <EmergencyCTA onBookAppointment={() => setIsModalOpen(true)} />
      </main>

      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
