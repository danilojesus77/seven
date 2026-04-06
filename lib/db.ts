import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      descricao TEXT,
      cor TEXT DEFAULT '#3B82F6',
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao_curta TEXT,
      categoria_id INTEGER REFERENCES categorias(id),
      ativo INTEGER DEFAULT 1,
      criado_em TEXT DEFAULT (datetime('now')),
      atualizado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS servico_vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
      conteudo TEXT NOT NULL,
      atualizado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS servico_execucao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
      conteudo TEXT NOT NULL,
      atualizado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS servico_documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT,
      tipo TEXT DEFAULT 'link',
      url TEXT,
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS conteudo_empresa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      ordem INTEGER DEFAULT 0,
      atualizado_em TEXT DEFAULT (datetime('now'))
    );
  `)

  // Seed data if empty
  const count = (db.prepare('SELECT COUNT(*) as n FROM categorias').get() as { n: number }).n
  if (count === 0) {
    seedData(db)
  }
}

function seedData(db: Database.Database) {
  const insertCat = db.prepare('INSERT INTO categorias (nome, descricao, cor) VALUES (?, ?, ?)')
  const insertServico = db.prepare('INSERT INTO servicos (titulo, descricao_curta, categoria_id) VALUES (?, ?, ?)')
  const insertVendas = db.prepare('INSERT INTO servico_vendas (servico_id, conteudo) VALUES (?, ?)')
  const insertExec = db.prepare('INSERT INTO servico_execucao (servico_id, conteudo) VALUES (?, ?)')
  const insertDoc = db.prepare('INSERT INTO servico_documentos (servico_id, nome, descricao, tipo) VALUES (?, ?, ?, ?)')
  const insertEmpresa = db.prepare('INSERT INTO conteudo_empresa (tipo, titulo, conteudo, ordem) VALUES (?, ?, ?, ?)')

  db.transaction(() => {
    // Categorias
    const cat1 = insertCat.run('Consultoria', 'Serviços de consultoria especializada', '#3B82F6')
    const cat2 = insertCat.run('Instalação', 'Serviços de instalação e configuração', '#10B981')
    const cat3 = insertCat.run('Manutenção', 'Serviços de manutenção preventiva e corretiva', '#F59E0B')
    const cat4 = insertCat.run('Treinamento', 'Capacitação e treinamento de equipes', '#8B5CF6')

    // Serviço 1
    const s1 = insertServico.run('Consultoria em TI', 'Análise e diagnóstico completo de infraestrutura tecnológica', cat1.lastInsertRowid)
    insertVendas.run(s1.lastInsertRowid, `## Como vender Consultoria em TI

**Público-alvo:** Empresas de médio e grande porte que precisam modernizar ou otimizar sua infraestrutura de TI.

**Argumentos de venda:**
- Redução de custos operacionais em até 30%
- Identificação de gargalos e riscos de segurança
- Roadmap tecnológico personalizado
- Suporte especializado com profissionais certificados

**Preços:**
- Diagnóstico básico: R$ 2.500
- Consultoria completa (30 dias): R$ 8.000
- Acompanhamento mensal: R$ 3.500/mês

**Objeções comuns:**
- *"É caro"* → Mostre o ROI: economia média de R$ 15.000/ano após implementação
- *"Já temos uma equipe"* → Complementamos sua equipe com visão externa e especializada

**Próximos passos após venda:**
1. Reunião de kickoff com equipe técnica do cliente
2. Enviar contrato e NDA
3. Agendar visita técnica inicial`)

    insertExec.run(s1.lastInsertRowid, `## Como executar Consultoria em TI

### Fase 1 — Levantamento (Dias 1-5)
1. Reunião inicial com stakeholders do cliente
2. Mapeamento de todos os sistemas existentes
3. Entrevistas com equipe técnica interna
4. Análise de documentação existente

### Fase 2 — Diagnóstico (Dias 6-15)
1. Auditoria de infraestrutura (servidores, redes, storage)
2. Análise de segurança e vulnerabilidades
3. Avaliação de performance dos sistemas
4. Revisão de processos e fluxos de trabalho

### Fase 3 — Relatório (Dias 16-25)
1. Compilar todos os dados coletados
2. Identificar pontos críticos e prioridades
3. Elaborar relatório executivo e técnico
4. Criar plano de ação com cronograma e custos

### Fase 4 — Apresentação (Dias 26-30)
1. Apresentar resultados para diretoria
2. Validar plano de ação
3. Definir próximos passos
4. Entregar documentação final

**Ferramentas necessárias:** Acesso VPN ao ambiente do cliente, ferramentas de análise de rede`)

    insertDoc.run(s1.lastInsertRowid, 'Modelo de Contrato', 'Contrato padrão para consultoria em TI', 'documento')
    insertDoc.run(s1.lastInsertRowid, 'Checklist de Levantamento', 'Lista completa de verificação para fase inicial', 'documento')
    insertDoc.run(s1.lastInsertRowid, 'Template de Relatório', 'Modelo de relatório final de consultoria', 'documento')

    // Serviço 2
    const s2 = insertServico.run('Instalação de Redes', 'Projeto e instalação de infraestrutura de rede cabeada e wireless', cat2.lastInsertRowid)
    insertVendas.run(s2.lastInsertRowid, `## Como vender Instalação de Redes

**Público-alvo:** Empresas em expansão, novas sedes, reformas de escritório.

**Argumentos de venda:**
- Projeto técnico completo incluso
- Garantia de 2 anos em toda instalação
- Certificação das redes após conclusão
- Equipe certificada (CCNA, CompTIA Network+)

**Preços:**
- Ponto de rede cabeado: R$ 180/ponto
- Rede wireless corporativa: R$ 1.200/access point + configuração
- Projeto técnico: R$ 1.500 (isento acima de 20 pontos)

**Diferenciais competitivos:**
- Certificamos todos os pontos com relatório
- Utilizamos apenas cabos Cat6 ou superior
- Documentação completa da infraestrutura entregue`)

    insertExec.run(s2.lastInsertRowid, `## Como executar Instalação de Redes

### Pré-instalação
1. Receber projeto técnico aprovado
2. Fazer visita técnica ao local
3. Listar materiais necessários e solicitar compra
4. Agendar datas com cliente (minimizar impacto operacional)

### Instalação
1. Passar cabos nos caminhos definidos em projeto
2. Instalar canaletas/eletrocalhas conforme necessário
3. Crimpagem e identificação de todos os pontos
4. Instalação dos patch panels e switches
5. Configuração de equipamentos ativos (switches, APs)

### Certificação e entrega
1. Testar todos os pontos com certificador (Fluke ou similar)
2. Gerar relatório de certificação
3. Documentar toda a infraestrutura (plantas, diagrama de rede)
4. Treinamento básico para equipe do cliente
5. Assinar termo de aceite`)

    insertDoc.run(s2.lastInsertRowid, 'Folha de Materiais Padrão', 'Lista de materiais utilizados nas instalações', 'documento')
    insertDoc.run(s2.lastInsertRowid, 'Template de Projeto', 'Modelo de projeto técnico de rede', 'documento')

    // Serviço 3
    const s3 = insertServico.run('Manutenção Preventiva de TI', 'Programa mensal de manutenção preventiva em equipamentos e sistemas', cat3.lastInsertRowid)
    insertVendas.run(s3.lastInsertRowid, `## Como vender Manutenção Preventiva

**Argumento principal:** Prevenir é mais barato que remediar. Cada hora de downtime custa em média R$ 5.000 às empresas.

**Pacotes:**
- **Básico** (até 10 estações): R$ 890/mês
- **Intermediário** (11-30 estações): R$ 1.990/mês
- **Completo** (31-80 estações): R$ 3.500/mês
- **Enterprise** (80+): sob consulta

**O que inclui:**
- Visita mensal presencial
- Atualização de sistemas e antivírus
- Limpeza física dos equipamentos
- Relatório mensal de saúde do parque
- Suporte remoto ilimitado

**Dica de venda:** Ofereça o primeiro mês grátis para empresas que nunca tiveram contrato de manutenção.`)

    insertExec.run(s3.lastInsertRowid, `## Como executar Manutenção Preventiva

### Checklist mensal — por estação de trabalho
- [ ] Limpeza física (soprador de ar, pano antiestático)
- [ ] Verificar temperatura (usar HWMonitor)
- [ ] Atualizar Windows/macOS
- [ ] Atualizar drivers críticos
- [ ] Verificar e atualizar antivírus
- [ ] Checar espaço em disco (alertar se < 15% livre)
- [ ] Verificar logs de erros no Event Viewer
- [ ] Testar backup do usuário

### Checklist mensal — infraestrutura
- [ ] Verificar switches e roteadores (logs, firmware)
- [ ] Testar nobreaks (autonomia e estado da bateria)
- [ ] Verificar servidores (temperatura, RAID, espaço)
- [ ] Testar restore de backup aleatório
- [ ] Revisar regras de firewall

### Entrega
1. Preencher relatório no sistema
2. Enviar relatório por email para responsável
3. Registrar qualquer achado crítico e escalar se necessário`)

    insertDoc.run(s3.lastInsertRowid, 'Checklist de Manutenção', 'Lista completa de verificações mensais', 'documento')
    insertDoc.run(s3.lastInsertRowid, 'Modelo de Relatório Mensal', 'Template para relatório de manutenção', 'documento')

    // Serviço 4
    const s4 = insertServico.run('Treinamento em Segurança da Informação', 'Capacitação de colaboradores em boas práticas de segurança digital', cat4.lastInsertRowid)
    insertVendas.run(s4.lastInsertRowid, `## Como vender Treinamento em Segurança da Informação

**Contexto:** Com o aumento de ataques de phishing e ransomware, empresas precisam capacitar seus colaboradores.

**Formatos:**
- Treinamento presencial (4h): R$ 2.800 (até 20 pessoas)
- Treinamento online ao vivo (2h): R$ 1.500 (ilimitado)
- Curso gravado com certificado: R$ 45/usuário/ano

**Temas abordados:**
- Phishing e engenharia social
- Senhas seguras e autenticação em dois fatores
- Uso seguro de e-mail e internet
- Proteção de dados (LGPD)
- Procedimentos de incidente

**Argumento LGPD:** A lei exige que empresas adotem medidas técnicas e administrativas. O treinamento é evidência de conformidade.`)

    insertExec.run(s4.lastInsertRowid, `## Como executar Treinamento em Segurança da Informação

### Preparação (1 semana antes)
1. Confirmar número de participantes
2. Personalizar apresentação com o logo e contexto do cliente
3. Testar ambiente (projetor, internet, plataforma se online)
4. Enviar convites com link/local para participantes

### Durante o treinamento
1. Introdução: cenário atual de ameaças (15 min)
2. Phishing na prática: exemplos reais (30 min)
3. Senhas e autenticação (20 min)
4. E-mail e navegação segura (20 min)
5. LGPD resumida (15 min)
6. Quiz e dúvidas (20 min)

### Pós-treinamento
1. Enviar certificados digitais em até 48h
2. Disponibilizar material de apoio (PDF)
3. Enviar relatório de participação para RH/TI
4. Agendar simulação de phishing (opcional, cobrado à parte)`)

    insertDoc.run(s4.lastInsertRowid, 'Apresentação Padrão', 'Slides do treinamento (personalizável)', 'documento')
    insertDoc.run(s4.lastInsertRowid, 'Material do Participante', 'PDF para distribuir aos participantes', 'documento')
    insertDoc.run(s4.lastInsertRowid, 'Modelo de Certificado', 'Template de certificado de conclusão', 'documento')

    // Conteúdo da empresa
    insertEmpresa.run('cultura', 'Nossa Missão', 'Entregar soluções tecnológicas que transformam negócios, com excelência técnica, ética e foco total no sucesso do cliente.', 1)
    insertEmpresa.run('cultura', 'Nossa Visão', 'Ser a parceira tecnológica de referência para empresas que buscam crescimento sustentável e inovação digital.', 2)
    insertEmpresa.run('cultura', 'Nossos Valores', `**Excelência:** Buscamos sempre o melhor resultado em tudo que fazemos.

**Transparência:** Comunicação clara e honesta com clientes e colegas.

**Compromisso:** Cumprimos o que prometemos, sempre.

**Aprendizado contínuo:** Nunca paramos de evoluir.

**Trabalho em equipe:** Juntos somos mais fortes.`, 3)

    insertEmpresa.run('politica', 'Política de Atendimento ao Cliente', `## Atendimento ao Cliente

**SLA de atendimento:**
- Incidentes críticos (sistema fora): resposta em até 1 hora
- Alta prioridade: resposta em até 4 horas
- Normal: resposta em até 1 dia útil
- Baixa prioridade: resposta em até 3 dias úteis

**Canais de atendimento:**
- WhatsApp Business: horário comercial (8h-18h, seg-sex)
- E-mail: até 24h úteis
- Telefone: emergências fora do horário

**Regras importantes:**
- Sempre abrir chamado no sistema antes de iniciar qualquer atendimento
- Nunca prometer prazo sem verificar agenda da equipe
- Comunicar cliente sobre qualquer atraso com antecedência mínima de 2h`, 1)

    insertEmpresa.run('politica', 'Política de Uso de Equipamentos', `## Equipamentos da Empresa

**Notebooks e equipamentos:**
- São de uso exclusivamente profissional
- Não instalar softwares sem autorização do gestor de TI
- Reportar qualquer dano imediatamente ao RH
- Ao desligar da empresa, entregar em até 48 horas

**Dados e senhas:**
- Nunca compartilhar senhas com colegas ou clientes
- Utilizar VPN para acessar sistemas internos remotamente
- Bloquear tela ao se ausentar do computador (Win+L)`, 2)

    insertEmpresa.run('onboarding', 'Boas-vindas ao Time!', `# Bem-vindo(a) à equipe!

Estamos muito felizes em ter você com a gente. Este guia vai te ajudar nos primeiros dias.

## Primeiros passos

1. **Acesso aos sistemas:** Solicite ao seu gestor os acessos necessários no primeiro dia
2. **E-mail corporativo:** Configure seu assinatura padrão conforme modelo enviado pelo RH
3. **WhatsApp do time:** Peça para ser adicionado ao grupo do seu setor
4. **Reunião com o gestor:** Agende uma reunião 1:1 na primeira semana

## O que você precisa saber

- As reuniões de time acontecem toda **segunda-feira às 9h**
- Usamos o Slack para comunicação interna
- Ponto eletrônico: registre entradas e saídas pelo app HR
- Dúvidas sobre RH: fale com [nome do RH] via WhatsApp

## Dicas dos veteranos

- Não tenha vergonha de perguntar — a equipe está aqui para ajudar
- Use o agente de treinamento para tirar dúvidas sobre serviços e políticas
- Participe dos treinamentos internos quinzenais`, 1)
  })()
}
