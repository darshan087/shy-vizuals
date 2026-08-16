import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

async function main() {
  const email = "darshudarshu087@gmail.com";
  const password = "Darshu@2005";

  const passwordHash = await bcrypt.hash(password, 12);

  const owner = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
      role: "OWNER",
    },

    create: {
      email,
      passwordHash,
      role: "OWNER",
    },
  });

  console.log("================================");
  console.log("OWNER SETUP SUCCESS");
  console.log("Email:", owner.email);
  console.log("Role:", owner.role);
  console.log("================================");
}

main()
  .catch((error) => {
    console.error("OWNER SETUP FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });