import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyCTA from "@/components/home/EmergencyCTA";
import BookingModal from "@/components/BookingModal";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col justify-center">
        <EmergencyCTA />
      </main>
      <Footer />
      <BookingModal />
    </>
  );
}
