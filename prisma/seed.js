const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding users...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medlink.com' },
    update: {},
    create: {
      email: 'admin@medlink.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  // Create Doctor
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@medlink.com' },
    update: {},
    create: {
      email: 'doctor@medlink.com',
      password: passwordHash,
      role: 'DOCTOR',
    },
  });

  // Create Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@medlink.com' },
    update: {},
    create: {
      email: 'patient@medlink.com',
      password: passwordHash,
      role: 'PATIENT',
    },
  });

  console.log("Users created successfully!");
  console.log("------------------------");
  console.log("Admin: admin@medlink.com / password123");
  console.log("Doctor: doctor@medlink.com / password123");
  console.log("Patient: patient@medlink.com / password123");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
