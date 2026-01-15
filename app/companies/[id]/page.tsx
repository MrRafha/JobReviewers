import Link from 'next/link';

// Exemplo de página de empresa
// URL: /companies/google ou /companies/123

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  // TODO: Buscar empresa do banco
  // const company = await getCompanyById(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Empresa ID: {params.id}
      </h1>

      {/* Info da empresa */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Nome da Empresa</h2>
        <p className="text-gray-600">São Paulo, SP</p>
      </div>

      {/* Botão para criar review */}
      <Link
        href={`/reviews/new?companyId=${params.id}`}
        className="inline-block bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-3 rounded-lg mb-8"
      >
        Avaliar Empresa
      </Link>

      {/* Lista de reviews */}
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="space-y-4">
        {/* ReviewCard components aqui */}
        <p className="text-gray-500">Carregando reviews...</p>
      </div>
    </div>
  );
}
