const stats = [
  { value: "15k+", label: "Happy Patients" },
  { value: "50+", label: "Expert Doctors" },
  { value: "20+", label: "Departments" },
  { value: "98%", label: "Satisfaction" },
];

export default function Stats() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-1280 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <span className="block text-3xl md:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </span>
              <span className="block text-sm font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
