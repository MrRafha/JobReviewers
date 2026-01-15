export default function AdminReportsPage() {
  // TODO: Buscar denúncias do banco
  // TODO: Verificar se usuário é admin (middleware)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Denúncias</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Review</th>
                <th className="text-left py-3 px-4">Motivo</th>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">#123</td>
                <td className="py-3 px-4">Conteúdo inapropriado</td>
                <td className="py-3 px-4">14/01/2026</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    Pendente
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-red-600 hover:underline mr-4">
                    Ocultar
                  </button>
                  <button className="text-gray-600 hover:underline">
                    Ignorar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
