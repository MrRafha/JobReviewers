import Link from "next/link";

export default function AdminReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Denúncias</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-gray-700">
          O painel de denúncias ainda não está conectado ao banco de dados nesta
          branch de correção.
        </p>
        <p className="text-gray-600">
          Para evitar ações enganosas, os controles de ocultar/ignorar foram
          removidos até que o fluxo real esteja implementado.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-black px-4 py-2 text-white"
        >
          Voltar para início
        </Link>
      </div>
    </div>
  );
}
