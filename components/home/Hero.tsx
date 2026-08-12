import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { FaUserMd, FaHeartbeat } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2753&auto=format&fit=crop" 
          alt="Cinematic Hospital"
          className="w-full h-full object-cover object-center animate-out fade-out zoom-out-105 duration-[20s] ease-out fill-mode-forwards"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-teal-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-1280 w-full pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Typography */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-teal-500/10 border border-teal-500/20 backdrop-blur-md text-teal-400 text-sm font-bold tracking-widest uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Premium Healthcare
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[1.05] tracking-tight mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
              Exceptional Care.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">
                Extraordinary Results.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 border-l-2 border-teal-500 pl-6">
              Experience world-class medical treatment in a state-of-the-art facility. 
              Our award-winning specialists are dedicated to your complete wellbeing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="?modal=booking"
                scroll={false}
                className="inline-flex items-center justify-center h-14 px-8 text-base bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_40px_rgba(13,148,136,0.3)] transition-all hover:shadow-[0_0_60px_rgba(13,148,136,0.5)] font-medium rounded-lg"
              >
                Book Appointment
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base text-white border-white/20 bg-white/5 hover:bg-white/10 hover:text-white rounded-none backdrop-blur-sm"
              >
                <Link href="#departments">Explore Specialties</Link>
              </Button>
            </div>
          </div>

          {/* Floating Cinematic Cards */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-none shadow-2xl transform translate-x-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <FaUserMd size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-wide">Top Specialists</h4>
                  <p className="text-slate-400 text-sm">Board-certified experts</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
                <FiCheckCircle /> Verified Professionals
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-none shadow-2xl transform -translate-x-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <FaHeartbeat size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-wide">Advanced Tech</h4>
                  <p className="text-slate-400 text-sm">Modern medical equipment</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-bold">
                <FiCheckCircle /> Next-Gen Diagnostics
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
        <span className="text-slate-400 text-xs tracking-[0.3em] uppercase mb-2">Scroll</span>
        <FiChevronDown className="text-teal-400" size={24} />
      </div>
    </section>
  );
}
