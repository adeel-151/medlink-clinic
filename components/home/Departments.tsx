import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { FaBrain, FaHeartbeat, FaBone, FaBaby, FaEye, FaLungs } from "react-icons/fa";

const departments = [
  { icon: FaBrain, name: "Neurology", desc: "Expert neurological care for brain and nervous system disorders." },
  { icon: FaHeartbeat, name: "Cardiology", desc: "Advanced heart care with state-of-the-art diagnostic technology." },
  { icon: FaBone, name: "Orthopedics", desc: "Comprehensive musculoskeletal care and joint replacements." },
  { icon: FaBaby, name: "Pediatrics", desc: "Caring for children's health from newborn to adolescence." },
  { icon: FaEye, name: "Ophthalmology", desc: "Complete eye care with laser surgery and vision correction." },
  { icon: FaLungs, name: "Pulmonology", desc: "Expert diagnosis and treatment for respiratory conditions." },
];

export default function Departments() {
  return (
    <section className="section-padding bg-white" id="departments">
      <div className="max-w-1280">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
            Specializations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Medical Departments
          </h2>
          <p className="text-slate-600 text-lg">
            Comprehensive care across multiple specialties for your whole family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div key={dept.name} className="premium-card p-8 flex flex-col h-full">
              <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <dept.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{dept.name}</h3>
              <p className="text-slate-600 mb-8 flex-grow">{dept.desc}</p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors mt-auto">
                Learn More <FiArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
