import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { FiCalendar, FiClock, FiFileText, FiDownload } from "react-icons/fi";
import Link from "next/link";
import PrescriptionCard from "./components/PrescriptionCard";

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "PATIENT") {
    redirect("/auth/login");
  }

  // Fetch patient data
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      patient: {
        include: {
          appointments: {
            include: { doctor: true },
            orderBy: { datetime: 'asc' }
          },
          prescriptions: {
            include: { doctor: true },
            orderBy: { createdAt: 'desc' }
          },
          medicalRecords: {
            include: { doctor: true },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  const patient = user?.patient;

  if (!patient) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
          <h2 className="text-xl font-bold mb-2">Patient Profile Not Found</h2>
          <p>Please contact administration to complete your profile setup.</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = patient.appointments.filter(a => new Date(a.datetime) > new Date() && a.status === "SCHEDULED");
  const pastAppointments = patient.appointments.filter(a => new Date(a.datetime) <= new Date() || a.status !== "SCHEDULED");

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-heading" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome back, {patient.firstName}! 👋
        </h1>
        <p className="text-muted mt-2">Here is a summary of your health journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-heading" style={{ fontFamily: 'var(--font-heading)' }}>Upcoming Appointments</h2>
              <Link href="/book" className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">
                Book New
              </Link>
            </div>
            
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <FiCalendar className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500 font-medium">No upcoming appointments.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(app => (
                  <div key={app.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-gray-100 hover:border-teal-200 transition-colors bg-gradient-to-r hover:from-teal-50/50 hover:to-transparent">
                    <div className="bg-teal-100 text-teal-700 w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold uppercase">{app.datetime.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-extrabold leading-none">{app.datetime.getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-heading text-lg">Dr. {app.doctor.firstName} {app.doctor.lastName}</h3>
                      <p className="text-sm text-teal-700 font-medium">{app.doctor.specialty}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <FiClock size={14} />
                          {app.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Records */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-bold text-heading mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Recent Medical Records</h2>
            
            {patient.medicalRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No medical records found.</div>
            ) : (
              <div className="space-y-4">
                {patient.medicalRecords.map(record => (
                  <div key={record.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{record.diagnoses}</h3>
                      <span className="text-xs text-gray-400 font-medium">{record.createdAt.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{record.treatments}</p>
                    <p className="text-xs font-medium text-teal-600">By Dr. {record.doctor.lastName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Prescriptions */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Prescriptions</h2>
            
            {patient.prescriptions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No prescriptions found.</div>
            ) : (
              <div className="space-y-4">
                {patient.prescriptions.map(presc => (
                  <PrescriptionCard key={presc.id} presc={presc} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
