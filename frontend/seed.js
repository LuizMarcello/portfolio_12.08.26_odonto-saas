const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  const clinic = await prisma.clinic.upsert({
    where: { slug: "sorriso-perfeito" },
    update: {},
    create: {
      name: "Sorriso Perfeito",
      slug: "sorriso-perfeito",
      credits: 100,
    },
  });

  console.log("Created clinic:", clinic);

  const dentist = await prisma.dentist.create({
    data: {
      name: "Dr. João Silva",
      specialty: "Ortodontia",
      clinicId: clinic.id,
    },
  });

  console.log("Created dentist:", dentist);
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
