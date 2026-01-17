import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-orange-500 bg-clip-text text-transparent">
            JobReviewers
          </h1>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Avaliações Anônimas de Empresas
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubra experiências reais de profissionais sobre empresas.
        </p>

        <Link
          href="/companies"
          className="inline-block bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition"
        >
          Explorar Empresas
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Por que JobReviewers?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h4 className="text-xl font-semibold mb-2">
                Anonimato Seguro
              </h4>
              <p className="text-gray-600">
                Seus dados pessoais são privados.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="text-xl font-semibold mb-2">
                Contas Verificadas
              </h4>
              <p className="text-gray-600">
                Mais credibilidade nas avaliações.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-2">
                Informação Real
              </h4>
              <p className="text-gray-600">
                Decida sua carreira com base em dados reais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
