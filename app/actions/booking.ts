"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSpecialties() {
  const doctors = await prisma.doctor.findMany({
    select: { specialty: true },
    distinct: ['specialty'],
  });
  
  // If no doctors exist yet in the database, return some default specialties so the UI still works
  if (doctors.length === 0) {
    return ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Practice"];
  }

  return doctors.map(d => d.specialty);
}

export async function getDoctorsBySpecialty(specialty: string) {
  const doctors = await prisma.doctor.findMany({
    where: { specialty },
    include: {
      user: {
        select: { image: true }
      }
    }
  });
  return doctors;
}

export async function getAvailableSlots(doctorId: string, date: string) {
  // Mock available slots for the given date (9 AM to 5 PM)
  const allSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  // In a real app, we'd query the Appointment table for this doctor on this date
  // and remove booked slots. For now, we'll just return all slots as available.
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      datetime: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        not: "CANCELLED"
      }
    }
  });

  const bookedTimes = bookedAppointments.map(app => {
    return app.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  });

  // Filter out booked slots
  return allSlots.filter(slot => !bookedTimes.includes(slot));
}

export async function createAppointment(data: { doctorId: string, datetime: string, reason?: string, patientEmail: string }) {
  // First, find the patient by email
  const user = await prisma.user.findUnique({
    where: { email: data.patientEmail },
    include: { patient: true }
  });

  if (!user || !user.patient) {
    throw new Error("Patient not found. Please log in as a patient to book.");
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: user.patient.id,
      doctorId: data.doctorId,
      datetime: new Date(data.datetime),
      reason: data.reason,
      status: "SCHEDULED"
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/patient");
  
  return appointment;
}
