import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados antigos (se necessário)
  // await prisma.report.deleteMany({});
  // await prisma.review.deleteMany({});
  // await prisma.user.deleteMany({});
  // await prisma.company.deleteMany({});

  //Criar usuários
  const users = await prisma.user.createMany({
    data: [
      {
        email: "dev1@example.com",
        handle: "Dev_8321",
        verifiedEmail: true,
      },
      {
        email: "dev2@example.com",
        handle: "Backend_Pro",
        verifiedEmail: true,
      },
      {
        email: "dev3@example.com",
        handle: "Frontend_Stars",
        verifiedEmail: true,
      },
      {
        email: "dev4@example.com",
        handle: "QA_Master",
        verifiedEmail: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Usuários criados");

  const allUsers = await prisma.user.findMany();

  const companies = await prisma.company.createMany({
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

  console.log("✅ Empresas criadas");

  const devtech = await prisma.company.findUnique({
    where: { slug: "devtech" },
  });

  const codeWorks = await prisma.company.findUnique({
    where: { slug: "codeworks" },
  });

  const empresaExemplo = await prisma.company.findUnique({
    where: { slug: "empresa-exemplo" },
  });

  if (devtech && allUsers.length >= 2) {
    await prisma.review.createMany({
      data: [
        {
          companyId: devtech.id,
          userId: allUsers[0].id,
          roleArea: "Frontend Developer",
          seniority: "PL",
          contractType: "CLT",
          workMode: "REMOTO",
          year: 2024,
          ratingOverall: 4,
          pros: "Ótimo ambiente de trabalho, excelente time e grande oportunidade de crescimento profissional.",
          cons: "Salário poderia ser mais competitivo, falta de flexibilidade em algumas decisões técnicas.",
          hidden: false,
        },
        {
          companyId: devtech.id,
          userId: allUsers[1].id,
          roleArea: "Backend Developer",
          seniority: "SR",
          contractType: "CLT",
          workMode: "HIBRIDO",
          year: 2023,
          ratingOverall: 5,
          pros: "Empresa com visão clara, liderança forte e investimento em educação dos colaboradores.",
          cons: "Às vezes demandas mudam muito rápido sem aviso prévio.",
          hidden: false,
        },
        {
          companyId: devtech.id,
          userId: allUsers[2].id,
          roleArea: "Full Stack Developer",
          seniority: "JR",
          contractType: "CLT",
          workMode: "PRESENCIAL",
          year: 2024,
          ratingOverall: 3,
          pros: "Bom para aprender, mentores disponíveis e suporte do time.",
          cons: "Infraestrutura antiga, processos burocráticos, poucos benefícios.",
          hidden: false,
        },
      ],
    });

    console.log("✅ Reviews da DevTech criados");
  }

  // Criar reviews para CodeWorks
  if (codeWorks && allUsers.length >= 2) {
    await prisma.review.createMany({
      data: [
        {
          companyId: codeWorks.id,
          userId: allUsers[1].id,
          roleArea: "QA Engineer",
          seniority: "PL",
          contractType: "CLT",
          workMode: "REMOTO",
          year: 2024,
          ratingOverall: 5,
          pros: "Empresa que realmente se importa com qualidade, testes são prioritários, equipe engajada.",
          cons: "Nenhum ponto negativo significativo até agora.",
          hidden: false,
        },
        {
          companyId: codeWorks.id,
          userId: allUsers[3].id,
          roleArea: "DevOps",
          seniority: "SR",
          contractType: "PJ",
          workMode: "REMOTO",
          year: 2024,
          ratingOverall: 4,
          pros: "Liberdade total de trabalho, cliente respeitoso, projetos interessantes.",
          cons: "Alguns atrasos em pagamento, falta de benefícios para PJs.",
          hidden: false,
        },
      ],
    });

    console.log("✅ Reviews da CodeWorks criados");
  }

  // Criar reviews para Empresa 
  if (empresaExemplo && allUsers.length >= 1) {
    await prisma.review.createMany({
      data: [
        {
          companyId: empresaExemplo.id,
          userId: allUsers[0].id,
          roleArea: "Product Manager",
          seniority: "PL",
          contractType: "CLT",
          workMode: "HIBRIDO",
          year: 2024,
          ratingOverall: 4,
          pros: "Empresa em crescimento, muitas oportunidades de impacto, time colaborativo.",
          cons: "Às vezes falta planejamento a longo prazo, mudanças frequentes de prioridade.",
          hidden: false,
        },
      ],
    });

    console.log("✅ Reviews da Empresa Exemplo criados");
  }

  console.log("🎉 Seed completado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
