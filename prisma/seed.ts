import { PrismaClient } from './generated/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.prescription.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding mock data...')

  // Create Users
  const patientUser1 = await prisma.user.create({
    data: { email: 'patient1@medlink.com', role: 'PATIENT' }
  })
  const patientUser2 = await prisma.user.create({
    data: { email: 'patient2@medlink.com', role: 'PATIENT' }
  })
  const doctorUser1 = await prisma.user.create({
    data: { email: 'sarah@medlink.com', role: 'DOCTOR' }
  })
  const doctorUser2 = await prisma.user.create({
    data: { email: 'michael@medlink.com', role: 'DOCTOR' }
  })

  // Create Patients
  const patient1 = await prisma.patient.create({
    data: { userId: patientUser1.id, firstName: 'Ali', lastName: 'Ahmed', phone: '+923001234567' }
  })
  const patient2 = await prisma.patient.create({
    data: { userId: patientUser2.id, firstName: 'Fatima', lastName: 'Khan', phone: '+923007654321' }
  })

  // Create Doctors
  const doctor1 = await prisma.doctor.create({
    data: { userId: doctorUser1.id, firstName: 'Sarah', lastName: 'Mitchell', specialty: 'Cardiology', rating: 4.9 }
  })
  const doctor2 = await prisma.doctor.create({
    data: { userId: doctorUser2.id, firstName: 'Michael', lastName: 'Chen', specialty: 'Neurology', rating: 4.8 }
  })

  // Create Prescriptions
  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      medicines: 'Lisinopril 10mg, Aspirin 81mg',
      dosage: 'Once daily',
      duration: '30 days',
      instructions: 'Take after breakfast',
    }
  })
  
  await prisma.prescription.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      medicines: 'Sumatriptan 50mg',
      dosage: 'As needed',
      duration: 'As needed',
      instructions: 'Take at onset of migraine',
    }
  })

  // Create Appointments
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      datetime: new Date(),
      status: 'SCHEDULED',
      reason: 'Routine checkup'
    }
  })

  // Create Medical Records
  await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      diagnoses: 'Hypertension',
      treatments: 'ACE inhibitors, lifestyle changes',
      notes: 'Patient responded well to initial dosage.'
    }
  })

  await prisma.medicalRecord.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      diagnoses: 'Migraine',
      treatments: 'Sumatriptan, preventive therapy',
      notes: 'Advised to avoid triggers.'
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
