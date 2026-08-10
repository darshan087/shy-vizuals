import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

const createOwner = async () => {
  const email = "shyvizuals@gmail.com";
  const password = "ShyVizuals@123";

  const existingOwner = await prisma.user.findUnique({
    where: { email },
  });

  if (existingOwner) {
    console.log("Owner already exists.");
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const owner = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "OWNER",
    },
  });

  console.log("Owner created successfully:");
  console.log(owner.email);

  await prisma.$disconnect();
};

createOwner().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});