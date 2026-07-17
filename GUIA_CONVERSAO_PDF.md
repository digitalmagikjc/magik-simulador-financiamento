# Guia de Atualização de Dados — Simulador de Financiamento Magik

Este guia é para quem, do lado do cliente, for responsável por atualizar as planilhas que alimentam o simulador. Não precisa saber programar. Precisa só de uma conta no [claude.ai](https://claude.ai) (gratuita já é suficiente) e acesso de edição ao Google Sheets do simulador.

**Regra geral:** sempre que um arquivo novo (PDF ou Excel) chegar, ele precisa virar uma atualização na aba correta do Google Sheets. Este guia mostra como fazer isso em poucos minutos, sem depender de ninguém da Beta Negócios.

---

## Quando usar este guia

| Situação | O que fazer |
|---|---|
| Chegou um Excel novo de preços/unidades | Não precisa de prompt — copie e cole as colunas direto na aba "Tabela de Preços" do Sheets. |
| Preencher prazo de obra de um empreendimento | Não precisa de prompt — edite direto a aba "Prazos" no Sheets. |
| Chegou um **PDF** novo (tabela da Caixa, ou tabela de dormitórios/preços) | Use um dos prompts abaixo. |

---

## Passo a passo (vale para qualquer um dos prompts abaixo)

1. Abra [claude.ai](https://claude.ai) e inicie uma conversa nova.
2. Anexe o arquivo PDF (ícone de clipe/anexo).
3. Copie e cole o prompt correspondente (abaixo) na mensagem, junto com o PDF anexado.
4. O Claude vai responder só com uma tabela em formato CSV (texto separado por vírgulas).
5. **Confira antes de usar:** conte quantas linhas vieram e compare com o que você espera (ex: "eu sei que são 426 unidades disponíveis" — se vier 380 ou 470, algo saiu errado, peça pra ele conferir de novo ou refazer).
6. Copie o resultado e cole no Google Sheets: use **Dados → Dividir texto em colunas** (ou cole direto se o Sheets já separar automaticamente por vírgula) na aba correta.

---

## Prompt 1 — Tabelas de financiamento da Caixa (Com/Sem Redutor)

```
Você vai receber um PDF com uma tabela de financiamento habitacional da Caixa Econômica Federal (420 meses). Extraia TODAS as linhas da tabela, sem pular nenhuma e sem resumir, e devolva em formato CSV com exatamente estas colunas, nesta ordem:

FAIXA,RENDA,SUBSIDIO_COM_DEPENDENTE,FINANCIAMENTO,SUBSIDIO_SEM_DEPENDENTE,PRIMEIRA_PRESTACAO,VALOR_AVALIACAO,TAXA_NOMINAL,TAXA_EFETIVA

Regras obrigatórias:
- Números em formato decimal simples: sem "R$", sem separador de milhar, ponto como separador decimal (ex: 56132.57, não "R$ 56.132,57").
- Percentuais sem o símbolo % (ex: 4.75, não "4,75%").
- Onde o PDF mostrar "-" (sem valor), escreva 0.
- Na coluna FAIXA, repita o número da faixa (ex: FAIXA 1, FAIXA 2...) em TODA linha correspondente, mesmo que no PDF ela apareça só uma vez como cabeçalho de seção.
- Não invente, não arredonde, não interprete — copie os valores exatamente como aparecem no PDF.
- Devolva SOMENTE o CSV puro, sem nenhum texto explicativo antes, depois, ou comentários no meio. Nem "aqui está a tabela:", nada. Só o CSV, começando pela linha de cabeçalho.
- Ao final, em uma linha separada começando com "#", informe quantas linhas de dados você extraiu (ex: # Total: 122 linhas), para eu poder conferir.
```

## Prompt 2 — PDF de unidades / dormitórios

```
Você vai receber um PDF com uma tabela de unidades disponíveis de um empreendimento imobiliário. Extraia TODAS as linhas, sem pular nenhuma, e devolva em formato CSV com exatamente estas colunas, nesta ordem:

EMPREENDIMENTO,BLOCO,UNIDADE,DORMITORIOS

Regras obrigatórias:
- Mantenha o nome do EMPREENDIMENTO exatamente como está escrito no PDF, com acentos e maiúsculas iguais ao original — não abrevie, não traduza, não corrija.
- Se o PDF tiver outras colunas além dessas quatro (metragem, vaga, valor etc.), ignore-as — extraia só as quatro pedidas.
- Se alguma unidade não tiver a informação de dormitórios visível, escreva "NAO_INFORMADO" nessa célula, não deixe em branco e não invente um número.
- Devolva SOMENTE o CSV puro, sem texto explicativo antes, depois, ou comentários no meio.
- Ao final, em uma linha separada começando com "#", informe quantas linhas de dados você extraiu (ex: # Total: 426 linhas), para eu poder conferir.
```

---

## O que fazer se o resultado parecer errado

- Número de linhas muito diferente do esperado → peça na mesma conversa: "Confira de novo, você pulou linhas. Refaça a extração completa."
- Algum valor obviamente errado (ex: um financiamento de R$ 5,00) → aponte a linha específica e peça correção, não confie cegamente em números que destoam muito dos vizinhos.
- PDF escaneado (foto, não texto real) → esse tipo de prompt funciona pior. Nesse caso, é melhor pedir pro emissor do PDF (Caixa, Dommus etc.) uma versão em texto/Excel, se existir.

---

## Responsáveis

- **Quem faz essa conversão:** time do cliente (Magik), sem depender da Beta Negócios.
- **Quem mantém este guia:** Beta Negócios · Assessoria Imobiliária — atualizar se as colunas do Sheets mudarem.
