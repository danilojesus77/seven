"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

interface Servico {
  id: number;
  titulo: string;
  descricao_curta: string;
  categoria: string;
  categoria_cor: string;
}

interface Categoria {
  id: number;
  nome: string;
  cor: string;
}

function ServicosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("cat", cat);
    fetch(`/api/servicos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setServicos(data.servicos);
        setCategorias(data.categorias);
      })
      .finally(() => setLoading(false));
  }, [q, cat]);

  function selectCat(nome: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat !== nome) params.set("cat", nome);
    router.push(`/servicos?${params}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Catálogo de Serviços</h1>
        <SearchBar defaultValue={q} />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            router.push(`/servicos?${params}`);
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !cat
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
          }`}
        >
          Todos
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => selectCat(c.nome)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              cat === c.nome
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
            }`}
          >
            {c.nome}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Carregando...</div>
      ) : servicos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">Nenhum serviço encontrado.</p>
          <Link href="/servicos" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((s) => (
            <Link
              key={s.id}
              href={`/servicos/${s.id}`}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 text-white"
                style={{ backgroundColor: s.categoria_cor || "#64748b" }}
              >
                {s.categoria}
              </span>
              <h2 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                {s.titulo}
              </h2>
              <p className="text-sm text-slate-500 line-clamp-2">{s.descricao_curta}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vendas
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Execução
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Documentos
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicosPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-slate-400">Carregando...</div>}>
      <ServicosContent />
    </Suspense>
  );
}
