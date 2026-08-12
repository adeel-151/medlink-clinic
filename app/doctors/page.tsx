import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorsComponent from "@/components/home/Doctors";
import BookingModal from "@/components/BookingModal";

export default function DoctorsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-12">
        <DoctorsComponent />
      </main>
      <Footer />
      <BookingModal />
    </>
  );
}
