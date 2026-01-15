'use client';

export default function NewReviewPage() {
  // TODO: Pegar companyId dos query params
  // const searchParams = useSearchParams();
  // const companyId = searchParams.get('companyId');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Criar Review</h1>

      <form className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Cargo e Senioridade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cargo/Área
            </label>
            <input
              type="text"
              placeholder="Frontend Developer"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Senioridade
            </label>
            <select className="w-full border rounded-lg px-4 py-2">
              <option value="jr">Júnior</option>
              <option value="pl">Pleno</option>
              <option value="sr">Sênior</option>
            </select>
          </div>
        </div>

        {/* Tipo de Contrato */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Contrato
          </label>
          <select className="w-full border rounded-lg px-4 py-2">
            <option value="clt">CLT</option>
            <option value="pj">PJ</option>
            <option value="estagio">Estágio</option>
          </select>
        </div>

        {/* Avaliação */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Avaliação Geral (1-5)
          </label>
          {/* TODO: Componente de estrelas */}
          <input
            type="number"
            min="1"
            max="5"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Pontos Positivos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pontos Positivos
          </label>
          <textarea
            rows={4}
            placeholder="O que você gostou..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Pontos Negativos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pontos Negativos
          </label>
          <textarea
            rows={4}
            placeholder="O que precisa melhorar..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-orange-500 text-white py-3 rounded-lg font-medium"
        >
          Publicar Review
        </button>
      </form>
    </div>
  );
}
