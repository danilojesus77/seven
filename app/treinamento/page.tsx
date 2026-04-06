"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import MarkdownContent from "@/components/MarkdownContent";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Como vender consultoria em TI?",
  "Quais são os valores da empresa?",
  "Como executar manutenção preventiva?",
  "Qual o SLA de atendimento ao cliente?",
  "O que fazer no primeiro dia de trabalho?",
  "Como lidar com objeções de preço?",
];

function TreinamentoContent() {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("modo") === "onboarding";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOnboarding && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Olá, bem-vindo(a) ao time!\n\nSou o assistente de treinamento. Posso te ajudar com:\n\n- **Onboarding:** O que fazer nos primeiros dias\n- **Serviços:** Como vender e executar cada serviço\n- **Políticas:** Regras e procedimentos da empresa\n- **Cultura:** Missão, visão e valores\n\nPor onde quer começar?",
        },
      ]);
    }
  }, [isOnboarding, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.error) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `⚠️ ${data.error}` },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Erro ao conectar. Verifique sua conexão e tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Agente de Treinamento</h1>
        <p className="text-sm text-slate-500">
          Tire dúvidas sobre serviços, cultura, políticas e processos da empresa.
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 p-4 space-y-4 mb-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center gap-6 py-8">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-medium mb-1">Como posso te ajudar?</p>
              <p className="text-sm text-slate-400">Clique em uma sugestão ou digite sua pergunta.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownContent content={msg.content} />
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mr-2 mt-0.5">
              <svg className="w-3.5 h-3.5 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-slate-400">
              Pensando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Faça uma pergunta..."
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default function TreinamentoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20 text-slate-400">Carregando...</div>}>
      <TreinamentoContent />
    </Suspense>
  );
}
