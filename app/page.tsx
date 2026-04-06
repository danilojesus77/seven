import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Base de Conhecimento
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto">
          Consulte serviços, políticas, processos e tire dúvidas com o agente de treinamento.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar autoFocus />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/servicos"
          className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
            Catálogo de Serviços
          </h2>
          <p className="text-sm text-slate-500">
            Veja todos os serviços com informações de vendas, execução e documentos.
          </p>
        </Link>

        <Link
          href="/treinamento"
          className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-purple-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">
            Agente de Treinamento
          </h2>
          <p className="text-sm text-slate-500">
            Tire dúvidas sobre serviços, cultura e políticas da empresa com IA.
          </p>
        </Link>

        <Link
          href="/treinamento?modo=onboarding"
          className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
            Onboarding
          </h2>
          <p className="text-sm text-slate-500">
            Material para novos colaboradores: cultura, políticas e primeiros passos.
          </p>
        </Link>
      </div>
    </div>
  );
}
