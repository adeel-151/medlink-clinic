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
  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <Hero />
        <Stats />
        <About />
        <Features />
        <Departments />
        <Doctors />
        <Testimonials />
        <EmergencyCTA />
      </main>

      <Footer />
      <BookingModal />
    </>
  );
}
