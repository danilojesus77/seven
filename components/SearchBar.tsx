"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  defaultValue?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ defaultValue = "", autoFocus }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/servicos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/servicos");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por serviço ou categoria..."
        autoFocus={autoFocus}
        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base shadow-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        Buscar
      </button>
    </form>
  );
}
