import { FaUserMd } from "react-icons/fa";
import { FiShield, FiClock, FiActivity, FiAward, FiHeart } from "react-icons/fi";

const features = [
  { icon: FaUserMd, title: "Qualified Doctors", desc: "Board-certified physicians with decades of experience." },
  { icon: FiShield, title: "Trusted Care", desc: "Evidence-based treatment following latest guidelines." },
  { icon: FiClock, title: "24/7 Emergency", desc: "Round-the-clock emergency services for critical care." },
  { icon: FiActivity, title: "Medical Research", desc: "Cutting-edge clinical trials and research programs." },
  { icon: FiAward, title: "Modern Facility", desc: "State-of-the-art equipment for accurate diagnosis." },
  { icon: FiHeart, title: "Quality Care", desc: "Patient-centered approach for every individual." },
];

export default function Features() {
  return (
    <section className="section-padding bg-slate-50 border-y border-slate-100">
      <div className="max-w-1280">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Why Patients Choose MedLink
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="premium-card p-8 flex gap-5 items-start group">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
