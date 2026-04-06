"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";

interface Documento {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  url: string | null;
}

interface ServicoDetail {
  servico: {
    id: number;
    titulo: string;
    descricao_curta: string;
    categoria: string;
    categoria_cor: string;
  };
  vendas: string;
  execucao: string;
  documentos: Documento[];
}

type Tab = "vendas" | "execucao" | "documentos";

const tabs: { id: Tab; label: string }[] = [
  { id: "vendas", label: "Vendas" },
  { id: "execucao", label: "Execução" },
  { id: "documentos", label: "Documentos" },
];

export default function ServicoPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ServicoDetail | null>(null);
  const [tab, setTab] = useState<Tab>("vendas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/servicos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Serviço não encontrado");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        Carregando...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">{error || "Serviço não encontrado."}</p>
        <Link href="/servicos" className="text-blue-600 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const { servico, vendas, execucao, documentos } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/servicos" className="hover:text-blue-600">Serviços</Link>
        <span>/</span>
        <span className="text-slate-900">{servico.titulo}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white mb-3"
          style={{ backgroundColor: servico.categoria_cor || "#64748b" }}
        >
          {servico.categoria}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{servico.titulo}</h1>
        <p className="text-slate-500">{servico.descricao_curta}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {t.label}
              {t.id === "documentos" && documentos.length > 0 && (
                <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {documentos.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "vendas" && (
            vendas ? <MarkdownContent content={vendas} /> : <Empty label="Nenhuma informação de vendas cadastrada." />
          )}
          {tab === "execucao" && (
            execucao ? <MarkdownContent content={execucao} /> : <Empty label="Nenhuma informação de execução cadastrada." />
          )}
          {tab === "documentos" && (
            documentos.length === 0 ? (
              <Empty label="Nenhum documento cadastrado." />
            ) : (
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-600 hover:underline text-sm"
                        >
                          {doc.nome}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-900 text-sm">{doc.nome}</span>
                      )}
                      {doc.descricao && (
                        <p className="text-xs text-slate-500 mt-0.5">{doc.descricao}</p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 mt-1 capitalize">{doc.tipo}</span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-slate-400 text-sm">{label}</div>
  );
}
