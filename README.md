# Simulador de Financiamento — Magik Empreendimentos

Simulador de capacidade de compra e sugestão de unidades para o time comercial da Magik, desenvolvido pela Beta Negócios · Assessoria Imobiliária.

## O que é

Um arquivo HTML único (`index.html`), sem dependências de servidor. Roda inteiro no navegador do corretor — celular, tablet ou desktop. Faz:

- Enquadramento na tabela de financiamento da Caixa (420 meses, com/sem redutor)
- Cálculo de subsídio, financiamento e capacidade total de compra
- Sugestão de unidades disponíveis compatíveis com o perfil do cliente
- Sugestão de reforço mensal para fechar unidades que quase cabem no orçamento

## Como está estruturado hoje

⚠️ **Estado atual (temporário):** os dados (tabela de preços das unidades e prazos de obra) estão embutidos diretamente no código do `index.html`, gerados a partir de arquivos Excel enviados manualmente. Isso significa que **toda vez que o estoque de unidades ou os prazos mudarem, o arquivo precisa ser regenerado.**

**Próximo passo planejado:** mover essas duas fontes de dados para o Google Sheets do cliente (Drive da Magik), publicado como link CSV, e trocar a leitura de dados fixa por uma busca ao vivo (`fetch`) direto no navegador. Isso elimina a necessidade de regenerar o arquivo a cada atualização de estoque. Ver seção "Próximos passos" abaixo.

## Como publicar (deploy)

### Opção 1 — Netlify (mais simples)
1. Crie uma conta em [netlify.com](https://netlify.com) (de preferência com e-mail da Magik, não pessoal).
2. Na tela inicial, arraste a pasta deste repositório (ou só o `index.html`) para a área de deploy manual ("Deploys" → arrastar arquivo).
3. Pronto — Netlify gera uma URL pública na hora. Depois dá pra configurar um domínio próprio (ex: `simulador.magikjc.com.br`) nas configurações do site.
4. Para deploy automático toda vez que o `index.html` for atualizado no GitHub, conecte o repositório em "Import from Git" em vez de fazer upload manual.

### Opção 2 — GitHub Pages
1. Suba este repositório para o GitHub (conta da Magik, idealmente).
2. Nas configurações do repositório → "Pages" → escolha a branch `main` e a pasta raiz.
3. GitHub gera uma URL do tipo `usuario.github.io/nome-do-repo`.

## Próximos passos (roadmap técnico)

1. **Coluna "Dormitórios"** — aguardando o cliente adicionar essa coluna na aba "Tabela de Preços" da planilha (Beta Negócios está convertendo um PDF publicado como ponto de partida).
2. **Migração para Google Sheets ao vivo** — trocar os arrays de dados fixos no `index.html` por `fetch()` direto de duas abas publicadas como CSV:
   - Aba "Tabela de Preços" (uma linha por unidade)
   - Aba "Prazos" (uma linha por empreendimento — prazo de obra em meses)
3. **Transferência de titularidade** — repositório GitHub e conta Netlify devem ser transferidos para uma conta institucional da Magik assim que definido com o cliente (ver conversa sobre propriedade do Drive/Sheets).

## Identidade visual

Paleta e tipografia (Poppins) alinhadas à identidade visual do site institucional da Magik (magikjc.com.br) em julho/2026. Logo embutido como base64 dentro do `index.html` — ao trocar o logo oficial, avisar a Beta Negócios para regenerar o arquivo.

## Responsáveis

- **Desenvolvimento e manutenção:** Beta Negócios · Assessoria Imobiliária
- **Fonte de dados (planilhas):** Magik Empreendimentos Imobiliários
