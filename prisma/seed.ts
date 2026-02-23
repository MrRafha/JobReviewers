import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.company.createMany({
    data: [
      // Empresas da página inicial
      { name: "Nubank", slug: "nubank", city: "São Paulo", state: "SP" },
      { name: "IFPI", slug: "ifpi", city: "Teresina", state: "PI" },
      { name: "Samsung", slug: "samsung", city: "Campinas", state: "SP" },
      {
        name: "Mercado Livre",
        slug: "mercado-livre",
        city: "São Paulo",
        state: "SP",
      },
      { name: "iFood", slug: "ifood", city: "Osasco", state: "SP" },
      { name: "Ambev", slug: "ambev", city: "São Paulo", state: "SP" },
      { name: "Globo", slug: "globo", city: "Rio de Janeiro", state: "RJ" },
      { name: "Totvs", slug: "totvs", city: "São Paulo", state: "SP" },
      {
        name: "XP Investimentos",
        slug: "xp-investimentos",
        city: "São Paulo",
        state: "SP",
      },
      // Empresas adicionais
      {
        name: "Itaú Unibanco",
        slug: "itau-unibanco",
        city: "São Paulo",
        state: "SP",
      },
      { name: "Bradesco", slug: "bradesco", city: "Osasco", state: "SP" },
      {
        name: "Magazine Luiza",
        slug: "magazine-luiza",
        city: "Franca",
        state: "SP",
      },
      { name: "PagSeguro", slug: "pagseguro", city: "São Paulo", state: "SP" },
      { name: "Stone", slug: "stone", city: "Rio de Janeiro", state: "RJ" },
      { name: "C6 Bank", slug: "c6-bank", city: "São Paulo", state: "SP" },
      {
        name: "Banco Inter",
        slug: "banco-inter",
        city: "Belo Horizonte",
        state: "MG",
      },
      { name: "Locaweb", slug: "locaweb", city: "São Paulo", state: "SP" },
      { name: "CI&T", slug: "ci-and-t", city: "Campinas", state: "SP" },
      { name: "Vtex", slug: "vtex", city: "Rio de Janeiro", state: "RJ" },
      { name: "Loft", slug: "loft", city: "São Paulo", state: "SP" },
      {
        name: "QuintoAndar",
        slug: "quintoandar",
        city: "São Paulo",
        state: "SP",
      },
      { name: "Creditas", slug: "creditas", city: "São Paulo", state: "SP" },
      { name: "Loggi", slug: "loggi", city: "São Paulo", state: "SP" },
      {
        name: "Wildlife Studios",
        slug: "wildlife-studios",
        city: "São Paulo",
        state: "SP",
      },
      {
        name: "MadeiraMadeira",
        slug: "madeiramadeira",
        city: "Curitiba",
        state: "PR",
      },
      { name: "Hotmart", slug: "hotmart", city: "Belo Horizonte", state: "MG" },
      {
        name: "RD Station",
        slug: "rd-station",
        city: "Florianópolis",
        state: "SC",
      },
      { name: "Movile", slug: "movile", city: "Campinas", state: "SP" },
      { name: "PicPay", slug: "picpay", city: "Vitória", state: "ES" },
      { name: "99", slug: "99", city: "São Paulo", state: "SP" },
      { name: "Dock", slug: "dock", city: "São Paulo", state: "SP" },
      {
        name: "Embraer",
        slug: "embraer",
        city: "São José dos Campos",
        state: "SP",
      },
      {
        name: "TOTVS Techfin",
        slug: "totvs-techfin",
        city: "São Paulo",
        state: "SP",
      },
      { name: "Elo7", slug: "elo7", city: "São Paulo", state: "SP" },
      { name: "Neon", slug: "neon", city: "São Paulo", state: "SP" },
      {
        name: "Zup Innovation",
        slug: "zup-innovation",
        city: "Uberlândia",
        state: "MG",
      },
      { name: "Gympass", slug: "gympass", city: "São Paulo", state: "SP" },
      { name: "Olist", slug: "olist", city: "Curitiba", state: "PR" },
      {
        name: "Vivo (Telefônica)",
        slug: "vivo-telefonica",
        city: "São Paulo",
        state: "SP",
      },
      {
        name: "Tim Brasil",
        slug: "tim-brasil",
        city: "Rio de Janeiro",
        state: "RJ",
      },
      { name: "Claro", slug: "claro", city: "São Paulo", state: "SP" },
      { name: "Natura", slug: "natura", city: "São Paulo", state: "SP" },
      { name: "WEG", slug: "weg", city: "Jaraguá do Sul", state: "SC" },
      { name: "Suzano", slug: "suzano", city: "São Paulo", state: "SP" },
      { name: "Vale", slug: "vale", city: "Rio de Janeiro", state: "RJ" },
      {
        name: "Petrobras",
        slug: "petrobras",
        city: "Rio de Janeiro",
        state: "RJ",
      },
      { name: "B3", slug: "b3", city: "São Paulo", state: "SP" },
      { name: "Cielo", slug: "cielo", city: "Barueri", state: "SP" },
      { name: "Serpro", slug: "serpro", city: "Brasília", state: "DF" },
      { name: "EBANX", slug: "ebanx", city: "Curitiba", state: "PR" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ 50 empresas inseridas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
