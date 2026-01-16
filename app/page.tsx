'use client';

import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar busca de empresas
    console.log('Buscar:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Container principal */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        
        {/* Logo JR com gradiente */}
        <div className="mb-12">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-[#22C55E] to-[#F59E0B] bg-clip-text text-transparent">
            JR
          </h1>
          <p className="text-center text-gray-600 text-sm mt-2">JobReviewers</p>
        </div>

        {/* Barra de pesquisa */}
        <form onSubmit={handleSearch} className="w-full mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar empresa..."
              className="w-full px-6 py-4 pr-14 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#22C55E] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#22C55E] to-[#F59E0B] rounded-xl hover:opacity-90 transition-opacity"
            >
              {/* Ícone de busca SVG */}
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Texto motivacional */}
        <p className="text-center text-gray-700 text-lg max-w-xl leading-relaxed">
          Vamos te ajudar a saber onde vai ser ou não seu próximo emprego!
        </p>

        {/* Detalhes decorativos */}
        <div className="mt-16 flex gap-8">
          <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
          <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
        </div>
      </div>
    </div>
  );
}
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
