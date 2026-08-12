import Link from "next/link";
import { FiStar } from "react-icons/fi";

import prisma from "@/lib/prisma";

export default async function Doctors() {
  let fetchedDoctors: any[] = [];
  try {
    fetchedDoctors = await prisma.doctor.findMany({
      take: 3,
      orderBy: { rating: 'desc' },
    });
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
  }

  const displayDoctors = fetchedDoctors.length > 0 
    ? fetchedDoctors.map(d => ({
        name: `Dr. ${d.firstName} ${d.lastName}`,
        specialty: d.specialty,
        rating: d.rating,
        patients: d.bio || "1k+",
        initials: `${d.firstName[0]}${d.lastName[0]}`
      }))
    : [
        { name: "Dr. Sarah Mitchell", specialty: "Cardiologist", rating: 4.9, patients: "2.4k+", initials: "SM" },
        { name: "Dr. Michael Chen", specialty: "Neurologist", rating: 4.8, patients: "1.8k+", initials: "MC" },
        { name: "Dr. Emily Rodriguez", specialty: "Pediatrician", rating: 4.9, patients: "3.1k+", initials: "ER" },
      ];
  return (
    <section className="section-padding bg-slate-50 border-t border-slate-100" id="doctors">
      <div className="max-w-1280">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
              Expert Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Meet Our Specialists
            </h2>
          </div>
          <Link href="#doctors" className="btn-outline whitespace-nowrap">
            View All Doctors
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDoctors.map((doctor, idx) => {
            const doctorImages = [
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2670&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2670&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1594824436998-d50d6f30a905?q=80&w=2670&auto=format&fit=crop"
            ];
            
            return (
            <div key={doctor.name} className="premium-card overflow-hidden flex flex-col h-full group">
              {/* Image Placeholder */}
              <div className="aspect-[4/3] relative overflow-hidden">
                 <img 
                   src={doctorImages[idx]} 
                   alt={doctor.name} 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                 <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end text-white">
                    <div>
                      <h3 className="text-xl font-bold">{doctor.name}</h3>
                      <p className="text-teal-300 text-sm font-medium">{doctor.specialty}</p>
                    </div>
                 </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <FiStar className="text-amber-400 fill-amber-400" size={16} />
                    {doctor.rating}
                  </div>
                  <div className="text-slate-500 font-medium">
                    {doctor.patients} patients
                  </div>
                </div>
                <Link href="?modal=booking" scroll={false} className="btn-outline w-full mt-auto inline-flex items-center justify-center">
                  Book Appointment
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
