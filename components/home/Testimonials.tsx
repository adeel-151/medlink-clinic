import { FaQuoteLeft } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

const testimonials = [
  { name: "John Peter", text: "Their doctors include highly qualified practitioners who came from a range of backgrounds and bring with them a diversity of skills and special interests. They also have registered nurses on staff.", rating: 5, initials: "JP" },
  { name: "Sarah Blake", text: "The administration and support staff all have exceptional people skills. The facility is clean, well-organized, and the wait times are minimal. Truly a top-tier medical experience.", rating: 5, initials: "SB" }
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-1280 grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
        {/* Left Content */}
        <div className="lg:col-span-1">
          <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Inspiring Stories!
          </h2>
          <p className="text-slate-600 mb-8">
            Hear what our patients have to say about their experiences with our dedicated team of medical professionals.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
               <div className="w-12 h-12 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">JP</div>
               <div className="w-12 h-12 rounded-full border-2 border-white bg-teal-200 flex items-center justify-center text-teal-800 font-bold text-xs">SB</div>
               <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">+2k</div>
            </div>
            <div className="text-sm font-bold text-slate-800">
              <span className="flex text-amber-400 mb-1">
                <FiStar className="fill-amber-400" /><FiStar className="fill-amber-400" /><FiStar className="fill-amber-400" /><FiStar className="fill-amber-400" /><FiStar className="fill-amber-400" />
              </span>
              4.9 from 2,000+ Reviews
            </div>
          </div>
        </div>

        {/* Right Cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="premium-card p-8 flex flex-col relative">
              <FaQuoteLeft className="text-teal-100 text-4xl absolute top-6 right-6 opacity-50" />
              <p className="text-slate-600 leading-relaxed italic mb-8 relative z-10 flex-grow">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center font-bold text-teal-700">
                  {t.initials}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900">{t.name}</span>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" size={12} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
