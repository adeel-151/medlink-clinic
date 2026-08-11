"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutComponent from "@/components/home/About";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-12">
        <AboutComponent />
      </main>
      <Footer />
    </>
  );
}
