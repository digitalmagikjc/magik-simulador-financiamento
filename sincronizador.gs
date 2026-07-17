/**
 * SINCRONIZADOR DE DADOS — Simulador de Financiamento Magik
 * ------------------------------------------------------------
 * O que este script faz:
 *   A cada execução (rodando sozinho, num gatilho por tempo), ele olha a pasta
 *   "Arquivos prontos" no Drive. Se algum dos CSVs de lá foi criado ou alterado
 *   desde a última vez que rodou, ele lê o conteúdo e substitui os dados da aba
 *   correspondente deste Google Sheets — que é o mesmo Sheets publicado na web
 *   e consultado ao vivo pelo simulador (index.html).
 *
 * O que este script NÃO faz:
 *   Não lê PDF. Não chama nenhuma IA. Não tem custo. Só lê CSV (texto puro,
 *   já pronto) e escreve nas abas — por isso é seguro rodar 100% sozinho.
 *
 * SOBRE A ABA "Prazos":
 *   Este mesmo Google Sheets também tem uma aba chamada "Prazos" (empreendimento
 *   → meses até a entrega), preenchida manualmente pelo time do cliente — isso é
 *   proposital, não um esquecimento. O script abaixo NUNCA toca nessa aba (ela não
 *   está no FILE_MAP), então pode conviver no mesmo arquivo sem risco de ser
 *   sobrescrita.
 *
 * COMO INSTALAR (uma única vez):
 *   1. Abra o Google Sheets que o simulador vai consultar.
 *   2. Menu Extensões → Apps Script.
 *   3. Apague o conteúdo padrão e cole este arquivo inteiro.
 *   4. Preencha a constante FOLDER_ID abaixo com o ID da pasta "Arquivos prontos"
 *      (fica na URL do Drive: .../folders/AQUI-ESTÁ-O-ID).
 *   5. Preencha a constante SHEET_ID com o ID desta própria planilha
 *      (fica na URL do Sheets: .../spreadsheets/d/AQUI-ESTÁ-O-ID/edit).
 *   6. (Opcional) Preencha ALERT_EMAIL com um e-mail para receber aviso se algo falhar.
 *   7. Na barra de funções (topo do editor), selecione "configurarGatilho" e clique em Executar.
 *      Na primeira vez, o Google vai pedir autorização — aceite (é a sua própria conta).
 *   8. Pronto. A partir daqui roda sozinho, de hora em hora.
 *
 * COMO TESTAR MANUALMENTE (sem esperar o gatilho):
 *   No editor, selecione a função "atualizarDados" e clique em Executar.
 *   Veja o resultado na aba "Log" que o script cria sozinho na primeira execução.
 */

// ==================== CONFIGURAÇÃO — preencha aqui ====================

const FOLDER_ID = 'COLOQUE_AQUI_O_ID_DA_PASTA_ARQUIVOS_PRONTOS';
const SHEET_ID = 'COLOQUE_AQUI_O_ID_DA_PLANILHA_GOOGLE_SHEETS';
const ALERT_EMAIL = ''; // opcional: 'alguem@magikjc.com.br' — deixe vazio para não enviar e-mail

// Nome do arquivo no Drive → nome da aba no Sheets que ele deve alimentar
const FILE_MAP = {
  'tabela_precos.csv': 'tabela_precos',
  'tabela_caixa_sem_redutor.csv': 'tabela_caixa_sem_redutor',
  'tabela_caixa_com_redutor.csv': 'tabela_caixa_com_redutor',
  'dormitorios.csv': 'dormitorios',
};

const LOG_SHEET_NAME = 'Log';

// ==================== NÃO PRECISA MEXER DAQUI PRA BAIXO ====================

function configurarGatilho() {
  // remove gatilhos antigos desta função, para não duplicar
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'atualizarDados') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('atualizarDados')
    .timeBased()
    .everyHours(1)
    .create();
  log_('Gatilho configurado: atualizarDados vai rodar a cada 1 hora.');
  atualizarDados(); // roda uma vez agora, para já popular o Sheets
}

function atualizarDados() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const props = PropertiesService.getScriptProperties();
  let alguemAtualizou = false;
  const erros = [];

  Object.keys(FILE_MAP).forEach(fileName => {
    try {
      const files = folder.getFilesByName(fileName);
      if (!files.hasNext()) {
        log_(`Arquivo "${fileName}" não encontrado na pasta — pulei.`);
        return;
      }
      const file = files.next();
      const lastUpdated = file.getLastUpdated().getTime();
      const propKey = 'lastUpdated_' + fileName;
      const lastProcessed = Number(props.getProperty(propKey) || 0);

      if (lastUpdated <= lastProcessed) {
        return; // sem mudança desde a última vez, não faz nada
      }

      const csvText = file.getBlob().getDataAsString('UTF-8');
      const rows = Utilities.parseCsv(csvText);

      if (!rows || rows.length < 2) {
        throw new Error(`Arquivo "${fileName}" veio vazio ou sem linhas de dado.`);
      }

      const sheetName = FILE_MAP[fileName];
      escreverAba_(sheetName, rows);

      props.setProperty(propKey, String(lastUpdated));
      alguemAtualizou = true;
      log_(`"${fileName}" atualizado com sucesso: ${rows.length - 1} linha(s) na aba "${sheetName}".`);
    } catch (e) {
      erros.push(`${fileName}: ${e.message}`);
      log_(`ERRO ao processar "${fileName}": ${e.message}`);
    }
  });

  if (erros.length > 0 && ALERT_EMAIL) {
    MailApp.sendEmail(
      ALERT_EMAIL,
      'Simulador Magik — erro ao atualizar dados',
      'O sincronizador encontrou problema(s):\n\n' + erros.join('\n') +
      '\n\nOs demais arquivos (se houver) foram processados normalmente. Confira a aba "Log" no Sheets para detalhes.'
    );
  }

  if (!alguemAtualizou && erros.length === 0) {
    log_('Nenhum arquivo novo desde a última verificação. Nada a fazer.');
  }
}

function escreverAba_(sheetName, rows) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
}

function log_(mensagem) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!logSheet) {
    logSheet = ss.insertSheet(LOG_SHEET_NAME);
    logSheet.appendRow(['Data/Hora', 'Mensagem']);
    logSheet.setFrozenRows(1);
  }
  logSheet.appendRow([new Date(), mensagem]);
  Logger.log(mensagem);
}
