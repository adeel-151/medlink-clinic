"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-1280 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Our Services</h1>
          <p className="text-lg text-slate-600">
            A comprehensive list of our medical services will be updated here soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
