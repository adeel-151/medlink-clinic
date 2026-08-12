"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiUsers, FiCalendar, FiDollarSign, FiActivity,
  FiTrendingUp, FiArrowUpRight, FiChevronLeft, FiChevronRight, FiClock,
} from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDashboardMetrics } from "@/app/actions/dashboard";

const weeklyData = [
  { day: "Mon", value: 40 }, { day: "Tue", value: 65 },
  { day: "Wed", value: 50 }, { day: "Thu", value: 80 },
  { day: "Fri", value: 70 }, { day: "Sat", value: 45 },
  { day: "Sun", value: 30 },
];

const performanceData = [
  { label: "A", value: 60 }, { label: "B", value: 82 },
  { label: "C", value: 50 }, { label: "D", value: 90 },
  { label: "E", value: 72 },
];

const upcoming = [
  { title: "Team Sync", time: "10:00 AM – 11:00 AM" },
  { title: "Patient Review", time: "02:30 PM – 03:30 PM" },
  { title: "Staff Meeting", time: "04:00 PM – 05:00 PM" },
];

const recentActivity = [
  { title: "New report generated", by: "By Dr. Sarah", badge: "Success", badgeColor: "bg-green-50 text-green-600", time: "2m ago" },
  { title: "Server load warning", by: "System Monitor", badge: "Warning", badgeColor: "bg-yellow-50 text-yellow-600", time: "15m ago" },
  { title: "Client onboarding", by: "By Admin", badge: "Completed", badgeColor: "bg-blue-50 text-blue-600", time: "1h ago" },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const today = new Date().getDate();
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const fadeInUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState({ patients: 0, appointments: 0, revenue: 0 });

  useEffect(() => {
    if ((session?.user as any)?.role === "PATIENT") {
      router.push("/dashboard/patient");
    }
  }, [session, router]);

  useEffect(() => {
    async function fetchMetrics() {
      const data = await getDashboardMetrics();
      setMetrics(data);
    }
    fetchMetrics();
  }, []);

  const statCards = [
    { label: "Active Patients", value: metrics.patients.toString(), change: "+12%", sub: "vs last month", icon: FiUsers, iconBg: "#F0FDFA", iconColor: "#0D9488" },
    { label: "Revenue", value: `$${(metrics.revenue / 1000).toFixed(1)}k`, change: "+8.1%", sub: "vs last month", icon: FiDollarSign, iconBg: "#ECFDF5", iconColor: "#10B981" },
    { label: "Appointments", value: metrics.appointments.toString(), change: "0%", sub: "vs last month", icon: FiCalendar, iconBg: "#EFF6FF", iconColor: "#3B82F6" },
    { label: "System Health", value: "98%", change: "", sub: "Optimal", icon: FiActivity, iconBg: "#F5F3FF", iconColor: "#8B5CF6" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div key={card.label} variants={fadeInUp} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-muted font-medium" style={{ fontFamily: 'var(--font-body)' }}>{card.label}</span>
                <span className="block text-[1.75rem] font-extrabold text-heading mt-1 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{card.value}</span>
                <div className="flex items-center gap-1.5 mt-2">
                  {card.change && (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-success">
                      <FiTrendingUp size={11} />{card.change}
                    </span>
                  )}
                  <span className="text-[11px] text-muted">{card.sub}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: card.iconBg }}>
                <card.icon size={20} style={{ color: card.iconColor }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Revenue */}
            <motion.div variants={fadeInUp} className="stat-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-heading" style={{ fontFamily: 'var(--font-heading)' }}>Revenue Trends</h3>
                <span className="text-[10px] text-muted bg-gray-50 px-2.5 py-1 rounded-lg font-semibold">Weekly</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Performance */}
            <motion.div variants={fadeInUp} className="stat-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-heading" style={{ fontFamily: 'var(--font-heading)' }}>Performance</h3>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="value" fill="#0D9488" radius={[6, 6, 6, 6]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div variants={fadeInUp} className="stat-card">
            <h3 className="text-sm font-bold text-heading mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Recent Activity</h3>
            <div className="space-y-1">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5 px-3 rounded-[14px] hover:bg-gray-50 transition-colors -mx-1">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-[12px] bg-teal-50 flex items-center justify-center shrink-0">
                      <FiUsers className="text-teal-600" size={16} />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-heading">{item.title}</span>
                      <span className="text-xs text-muted">
                        {item.by}{" "}
                        <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted font-medium shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Calendar */}
          <motion.div variants={fadeInUp} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-heading" style={{ fontFamily: 'var(--font-heading)' }}>
                {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
              </h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-[8px] hover:bg-gray-50 text-muted transition-colors"><FiChevronLeft size={14} /></button>
                <button className="p-1.5 rounded-[8px] hover:bg-gray-50 text-muted transition-colors"><FiChevronRight size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1.5">
              {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
                <span key={d} className="text-center text-[10px] font-bold text-muted py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {[...Array(2)].map((_, i) => <span key={`b-${i}`} />)}
              {calendarDays.map((day) => (
                <button
                  key={day}
                  className={`w-full aspect-square rounded-[10px] text-xs font-medium flex items-center justify-center transition-all ${
                    day === today
                      ? "gradient-primary text-white shadow-[0_3px_12px_rgba(13,148,136,0.3)]"
                      : day < today
                      ? "text-muted/60 hover:bg-gray-50"
                      : "text-heading hover:bg-teal-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Upcoming */}
          <motion.div variants={fadeInUp} className="stat-card">
            <h3 className="text-sm font-bold text-heading mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Upcoming</h3>
            <div className="space-y-2.5">
              {upcoming.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-[14px] bg-teal-50/60 border border-teal-100/50">
                  <span className="block text-sm font-semibold text-heading">{item.title}</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted mt-1 font-medium">
                    <FiClock size={10} />{item.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Card */}
          <motion.div variants={fadeInUp} className="gradient-primary rounded-[20px] p-6 text-white shadow-[0_8px_32px_rgba(13,148,136,0.2)]">
            <div className="w-10 h-10 rounded-[12px] bg-white/20 flex items-center justify-center mb-3">
              <FiArrowUpRight className="text-white" size={18} />
            </div>
            <h4 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Pro Features</h4>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed">Unlock advanced analytics and infinite storage.</p>
            <button className="mt-4 bg-white text-teal-700 text-xs font-bold px-4 py-2.5 rounded-[10px] hover:bg-teal-50 transition-colors w-full" style={{ fontFamily: 'var(--font-heading)' }}>
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
