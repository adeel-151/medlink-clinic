"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DepartmentsComponent from "@/components/home/Departments";

export default function DepartmentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-12">
        <DepartmentsComponent />
      </main>
      <Footer />
    </>
  );
}
