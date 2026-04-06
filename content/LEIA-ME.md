# Conteúdo Base de Conhecimento

Coloque aqui os documentos da empresa que serão usados como base de conteúdo.
Após adicionar os arquivos, o conteúdo pode ser importado para o banco de dados pelo painel admin (em desenvolvimento).

## Estrutura

### `/content/servicos/`
Arquivos descritivos de cada serviço.
- Um arquivo por serviço
- Formato: Markdown (.md) ou texto puro (.txt)
- Nome sugerido: `nome-do-servico.md`
- Inclua as seções: Descrição, Como Vender, Como Executar

**Exemplo de conteúdo:**
```
# Consultoria em TI

## Descrição
Análise completa da infraestrutura tecnológica...

## Como Vender
Argumento principal: ...
Preço: ...

## Como Executar
Passo 1: ...
Passo 2: ...
```

### `/content/politicas/`
Políticas internas da empresa.
- Política de Atendimento
- Política de Uso de Equipamentos
- Código de Conduta
- Qualquer outra política interna

### `/content/cultura/`
Documentos sobre cultura da empresa.
- Missão, Visão e Valores
- Manifesto da empresa
- Guia de cultura
- Manual do colaborador

## Como importar o conteúdo

Por enquanto, o conteúdo é editado diretamente no banco de dados (data.db).
Em breve será disponibilizado um painel admin para edição via interface web.

Para editar agora:
1. Abra o arquivo `lib/db.ts`
2. Localize a função `seedData`
3. Edite os textos de cada serviço, política e conteúdo cultural
4. Delete o arquivo `data.db` para que o banco seja recriado com os novos dados
5. Reinicie o servidor com `npm run dev`
