import Link from "next/link";
import { FaUserMd } from "react-icons/fa";
import { FiAward, FiHeart, FiClock } from "react-icons/fi";

export default function About() {
  return (
    <section className="section-padding bg-white" id="about">
      <div className="max-w-1280 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        {/* Left Visual */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2673&auto=format&fit=crop" 
            alt="Medical professionals" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply" />
        </div>

        {/* Right Content */}
        <div>
          <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
            About MedLink
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Improving the Quality of Life Through Better Health.
          </h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            Our goal is to deliver quality of care in a courteous, respectful, and compassionate manner. We hope you will allow us to care for you and be the first choice for healthcare.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: FaUserMd, title: "Experienced Medical Team" },
              { icon: FiAward, title: "Advanced Technology" },
              { icon: FiHeart, title: "Patient-Centered Care" },
              { icon: FiClock, title: "24/7 Emergency Support" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <item.icon className="text-teal-600 text-lg" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base mt-3">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <Link href="#" className="btn-outline">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
