import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";

  const db = getDb();

  let sql = `
    SELECT s.id, s.titulo, s.descricao_curta, c.nome as categoria, c.cor as categoria_cor
    FROM servicos s
    LEFT JOIN categorias c ON s.categoria_id = c.id
    WHERE s.ativo = 1
  `;
  const params: string[] = [];

  if (q) {
    sql += ` AND (s.titulo LIKE ? OR s.descricao_curta LIKE ? OR c.nome LIKE ?)`;
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (cat) {
    sql += ` AND c.nome = ?`;
    params.push(cat);
  }

  sql += ` ORDER BY s.titulo`;

  const servicos = db.prepare(sql).all(...params);

  const categorias = db
    .prepare("SELECT id, nome, cor FROM categorias ORDER BY nome")
    .all();

  return NextResponse.json({ servicos, categorias });
}
