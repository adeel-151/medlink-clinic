const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@medlink.com";
  const password = "password123";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log("User found:", user.email, "Role:", user.role);
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log("Password valid:", isPasswordValid);
}

main().catch(console.error).finally(() => prisma.$disconnect());
