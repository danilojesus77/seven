import { getDb } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(): string {
  const db = getDb();

  const servicos = db
    .prepare(
      `SELECT s.titulo, s.descricao_curta, c.nome as categoria,
              sv.conteudo as vendas, se.conteudo as execucao
       FROM servicos s
       LEFT JOIN categorias c ON s.categoria_id = c.id
       LEFT JOIN servico_vendas sv ON sv.servico_id = s.id
       LEFT JOIN servico_execucao se ON se.servico_id = s.id
       WHERE s.ativo = 1`
    )
    .all() as Array<{
    titulo: string;
    descricao_curta: string;
    categoria: string;
    vendas: string;
    execucao: string;
  }>;

  const empresa = db
    .prepare("SELECT tipo, titulo, conteudo FROM conteudo_empresa ORDER BY tipo, ordem")
    .all() as Array<{ tipo: string; titulo: string; conteudo: string }>;

  let context = `# Base de Conhecimento da Empresa\n\n`;

  const empresaByTipo: Record<string, typeof empresa> = {};
  for (const item of empresa) {
    if (!empresaByTipo[item.tipo]) empresaByTipo[item.tipo] = [];
    empresaByTipo[item.tipo].push(item);
  }

  if (empresaByTipo.cultura) {
    context += `## Cultura e Valores\n`;
    for (const item of empresaByTipo.cultura) {
      context += `### ${item.titulo}\n${item.conteudo}\n\n`;
    }
  }

  if (empresaByTipo.politica) {
    context += `## Políticas da Empresa\n`;
    for (const item of empresaByTipo.politica) {
      context += `### ${item.titulo}\n${item.conteudo}\n\n`;
    }
  }

  if (empresaByTipo.onboarding) {
    context += `## Onboarding\n`;
    for (const item of empresaByTipo.onboarding) {
      context += `### ${item.titulo}\n${item.conteudo}\n\n`;
    }
  }

  context += `## Serviços Oferecidos\n\n`;
  for (const s of servicos) {
    context += `### ${s.titulo} (${s.categoria})\n`;
    context += `${s.descricao_curta}\n\n`;
    if (s.vendas) context += `**Como vender:**\n${s.vendas}\n\n`;
    if (s.execucao) context += `**Como executar:**\n${s.execucao}\n\n`;
    context += `---\n\n`;
  }

  return `Você é o assistente de treinamento interno da empresa. Seu papel é ajudar colaboradores a entender os serviços oferecidos, a cultura, as políticas e os processos internos.

Responda sempre em português brasileiro. Seja direto, claro e útil. Use formatação markdown quando for útil para organizar a resposta.

Baseie suas respostas exclusivamente nas informações abaixo. Se não souber algo, diga que não tem essa informação no momento e sugira falar com o gestor.

${context}`;
}

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY não configurada. Adicione ao arquivo .env.local" },
      { status: 500 }
    );
  }

  const systemPrompt = buildSystemPrompt();

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ reply: text });
}
