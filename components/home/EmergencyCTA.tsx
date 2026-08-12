import { FiPhone, FiCalendar } from "react-icons/fi";

import Link from "next/link";

export default function EmergencyCTA() {
  return (
    <section className="bg-slate-900 py-20 lg:py-24" id="contact">
      <div className="max-w-1280 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Need Emergency Medical Help?
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
          Call our emergency team anytime, 24/7. We are always here to provide immediate medical assistance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="tel:+102161245741" className="btn-primary bg-teal-600 hover:bg-teal-500">
            <FiPhone size={18} />
            Call Emergency
          </a>
          <Link href="?modal=booking" scroll={false} className="btn-outline-white inline-flex items-center justify-center gap-2">
            <FiCalendar size={18} />
            Book Online
          </Link>
        </div>
      </div>
    </section>
  );
}
