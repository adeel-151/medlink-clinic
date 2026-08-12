"use server";

import prisma from "@/lib/prisma";

export async function getDashboardMetrics() {
  const [totalPatients, totalAppointments, totalRevenue] = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
  ]);

  return {
    patients: totalPatients,
    appointments: totalAppointments,
    revenue: totalRevenue._sum.amount || 0,
  };
}

export async function getPrescriptions() {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return prescriptions.map((p: any) => ({
    id: p.id,
    patientName: `${p.patient.firstName} ${p.patient.lastName}`,
    doctorName: `Dr. ${p.doctor.firstName} ${p.doctor.lastName}`,
    medicines: p.medicines,
    dosage: p.dosage,
    duration: p.duration || "N/A",
    date: p.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    initials: `${p.patient.firstName[0]}${p.patient.lastName[0]}`.toUpperCase(),
  }));
}

export async function getAppointments() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { datetime: "asc" },
  });

  return appointments.map((a: any) => ({
    id: a.id,
    patient: `${a.patient.firstName} ${a.patient.lastName}`,
    doctor: `Dr. ${a.doctor.firstName} ${a.doctor.lastName}`,
    specialty: a.doctor.specialty,
    date: a.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: a.datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: a.status === "SCHEDULED" ? "Scheduled" : a.status === "COMPLETED" ? "Completed" : "Cancelled",
    initials: `${a.patient.firstName[0]}${a.patient.lastName[0]}`.toUpperCase(),
  }));
}

export async function getDoctors() {
  const doctors = await prisma.doctor.findMany({
    include: {
      _count: {
        select: { appointments: true }
      }
    }
  });

  return doctors.map((d: any) => ({
    id: d.id,
    name: `Dr. ${d.firstName} ${d.lastName}`,
    specialty: d.specialty,
    rating: d.rating,
    reviews: 124, // Mock
    experience: d.experienceYears ? `${d.experienceYears} years` : "10 years",
    nextSlot: "Today, 2:00 PM", // Mock
    patients: `${(d._count.appointments * 3) + 150}+`, // Mock based on appointments
    initials: `${d.firstName[0]}${d.lastName[0]}`.toUpperCase(),
  }));
}

export async function getPatients() {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
      _count: {
        select: { appointments: true }
      }
    }
  });

  return patients.map((p: any) => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    email: p.user.email || "No email",
    phone: p.phone || "No phone",
    dob: p.dateOfBirth?.toISOString().split('T')[0] || "N/A",
    visits: p._count.appointments,
    lastVisit: "Aug 10, 2026", // Mock
    initials: `${p.firstName[0]}${p.lastName[0]}`.toUpperCase(),
  }));
}

export async function getRecords() {
  const records = await prisma.medicalRecord.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r: any) => ({
    id: r.id,
    patient: `${r.patient.firstName} ${r.patient.lastName}`,
    doctor: `Dr. ${r.doctor.firstName} ${r.doctor.lastName}`,
    diagnosis: r.diagnoses,
    treatment: r.treatments,
    date: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    pInitials: `${r.patient.firstName[0]}${r.patient.lastName[0]}`.toUpperCase(),
  }));
}

// =======================
// CREATE MUTATIONS
// =======================

export async function createPatient(data: { firstName: string, lastName: string, email: string, phone: string, dateOfBirth: string }) {
  try {
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      user = await prisma.user.create({
        data: { email: `${Date.now()}_${data.email}`, password: "mockpassword", role: "PATIENT" }
      });
    } else {
      user = await prisma.user.create({
        data: { email: data.email, password: "mockpassword", role: "PATIENT" }
      });
    }

    await prisma.patient.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
      }
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}

export async function createDoctor(data: { firstName: string, lastName: string, specialty: string, experienceYears: number, email: string }) {
  try {
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      user = await prisma.user.create({
        data: { email: `${Date.now()}_${data.email}`, password: "mockpassword", role: "DOCTOR" }
      });
    } else {
      user = await prisma.user.create({
        data: { email: data.email, password: "mockpassword", role: "DOCTOR" }
      });
    }

    await prisma.doctor.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        specialty: data.specialty,
        experienceYears: data.experienceYears,
      }
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }
}

export async function createAppointment(data: { patientId: string, doctorId: string, datetime: string }) {
  await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      datetime: new Date(data.datetime),
      status: "SCHEDULED",
    }
  });
}

export async function createPrescription(data: { patientId: string, doctorId: string, medicines: string, dosage: string, duration: string }) {
  await prisma.prescription.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      medicines: data.medicines,
      dosage: data.dosage,
      duration: data.duration,
    }
  });
}

export async function createRecord(data: { patientId: string, doctorId: string, diagnoses: string, treatments: string, notes: string }) {
  await prisma.medicalRecord.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      diagnoses: data.diagnoses,
      treatments: data.treatments,
      notes: data.notes,
    }
  });
}

export async function getNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return notifications.map(n => ({
    id: n.id,
    message: n.message,
    isRead: n.isRead,
    time: n.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }));
}

export async function markNotificationAsRead(id: string) {
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}
