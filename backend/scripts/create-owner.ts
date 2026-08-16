import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  const email = "YOUR_NEW_EMAIL@gmail.com";
  const password = "YOUR_NEW_PASSWORD";

  const passwordHash = await bcrypt.hash(password, 12);

  const owner = await prisma.user.upsert({
    where: { email },
    update: {
      password: passwordHash,
      role: "OWNER",
    },
    create: {
      email,
      password: passwordHash,
      role: "OWNER",
    },
  });

  console.log("OWNER CREATED/UPDATED");
  console.log("Email:", owner.email);
  console.log("Role:", owner.role);
}

main()
  .catch((error) => {
    console.error("OWNER SETUP FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });