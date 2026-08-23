import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await prisma.user.deleteMany();
  console.log("🧹 Cleaned up existing records in users table.");

  const initialUsers = [
    {
      email: "admin@yearcounting.com",
      name: "System Admin",
      role: Role.ADMIN,
    },
    {
      email: "metages@yearcounting.com",
      name: "Metages Yibeltal",
      role: Role.ADMIN,
    },
    {
      email: "developer@yearcounting.com",
      name: "Lead Developer",
      role: Role.USER,
    },
    {
      email: "tester@yearcounting.com",
      name: "QA Analyst",
      role: Role.USER,
    },
  ];

  for (const user of initialUsers) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(
      `✅ Created user: ${createdUser.name} (${createdUser.email}) - Role: ${createdUser.role}`,
    );
  }

  console.log("✨ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during database seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
