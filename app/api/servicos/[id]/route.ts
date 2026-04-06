import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const servico = db
    .prepare(
      `SELECT s.id, s.titulo, s.descricao_curta, c.nome as categoria, c.cor as categoria_cor
       FROM servicos s
       LEFT JOIN categorias c ON s.categoria_id = c.id
       WHERE s.id = ? AND s.ativo = 1`
    )
    .get(id);

  if (!servico) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }

  const vendas = db
    .prepare("SELECT conteudo FROM servico_vendas WHERE servico_id = ?")
    .get(id) as { conteudo: string } | undefined;

  const execucao = db
    .prepare("SELECT conteudo FROM servico_execucao WHERE servico_id = ?")
    .get(id) as { conteudo: string } | undefined;

  const documentos = db
    .prepare(
      "SELECT id, nome, descricao, tipo, url FROM servico_documentos WHERE servico_id = ? ORDER BY nome"
    )
    .all(id);

  return NextResponse.json({
    servico,
    vendas: vendas?.conteudo || "",
    execucao: execucao?.conteudo || "",
    documentos,
  });
}
