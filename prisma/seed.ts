import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.company.createMany({
    data: [
      {
        name: "Empresa Exemplo",
        slug: "empresa-exemplo",
        city: "Picos",
        state: "PI",
      },
      { name: "DevTech", slug: "devtech", city: "Picos", state: "PI" },
      { name: "CodeWorks", slug: "codeworks", city: "Picos", state: "PI" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Empresas inseridas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
