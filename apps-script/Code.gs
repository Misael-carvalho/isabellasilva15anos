/**
 * Isabella Silva · 15 Anos — Backend gratuito com Google Sheets
 *
 * Como usar (passo a passo completo no README.md):
 *  1. Crie uma planilha no Google Sheets.
 *  2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 *  3. Execute a função "configurar" uma vez (autorize o acesso).
 *  4. Implantar > Nova implantação > Tipo "App da Web"
 *       Executar como: Eu  |  Quem pode acessar: Qualquer pessoa
 *  5. Copie a URL gerada (termina em /exec) e cole em assets/js/config.js -> apiUrl
 */

// true = recados só aparecem no site depois que você marcar "SIM" na coluna Aprovado
const MODERAR_RECADOS = false;

const ABAS = {
  rsvp:     { nome: 'Confirmações', colunas: ['Data', 'Nome', 'WhatsApp', 'Presença', 'Adultos', 'Crianças', 'Acompanhantes', 'Restrição alimentar', 'Mensagem'] },
  presente: { nome: 'Presentes',    colunas: ['Data', 'ID', 'Presente', 'Valor (R$)', 'Nome', 'Mensagem', 'Pix recebido?'] },
  recado:   { nome: 'Recados',      colunas: ['Data', 'Nome', 'Recado', 'Aprovado'] }
};

function configurar() {
  Object.keys(ABAS).forEach(function (k) { aba_(k); });
  SpreadsheetApp.getActive().toast('Planilha configurada! Agora faça a implantação como App da Web.');
}

function aba_(tipo) {
  const cfg = ABAS[tipo];
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(cfg.nome);
  if (!sh) {
    sh = ss.insertSheet(cfg.nome);
    sh.appendRow(cfg.colunas);
    sh.getRange(1, 1, 1, cfg.colunas.length).setFontWeight('bold').setBackground('#0b1628').setFontColor('#e3d5b4');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function txt_(v, max) {
  // Remove caracteres que o Sheets interpretaria como fórmula
  let s = String(v == null ? '' : v).trim().slice(0, max || 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

/** GET ?action=data -> contagem de presentes e recados públicos */
function doGet(e) {
  try {
    const presentes = {};
    const shP = aba_('presente');
    if (shP.getLastRow() > 1) {
      shP.getRange(2, 2, shP.getLastRow() - 1, 1).getValues().forEach(function (r) {
        const id = String(r[0]);
        if (id) presentes[id] = (presentes[id] || 0) + 1;
      });
    }

    const recados = [];
    const shR = aba_('recado');
    if (shR.getLastRow() > 1) {
      shR.getRange(2, 1, shR.getLastRow() - 1, 4).getValues().forEach(function (r) {
        const aprovado = String(r[3]).toUpperCase();
        if (MODERAR_RECADOS ? aprovado === 'SIM' : aprovado !== 'NÃO' && aprovado !== 'NAO') {
          recados.push({ nome: String(r[1]), mensagem: String(r[2]) });
        }
      });
    }
    recados.reverse();

    return json_({ ok: true, presentes: presentes, recados: recados.slice(0, 200) });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  }
}

/** POST {tipo: 'rsvp' | 'presente' | 'recado', ...} */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const d = JSON.parse(e.postData.contents || '{}');
    if (!ABAS[d.tipo]) return json_({ ok: false, erro: 'Tipo inválido' });
    const agora = new Date();
    const sh = aba_(d.tipo);

    if (d.tipo === 'rsvp') {
      if (!d.nome) return json_({ ok: false, erro: 'Nome obrigatório' });
      sh.appendRow([agora, txt_(d.nome, 100), txt_(d.telefone, 30), txt_(d.presenca, 10), txt_(d.adultos, 3),
        txt_(d.criancas, 3), txt_(d.acompanhantes, 300), txt_(d.restricao, 200), txt_(d.mensagem, 500)]);
    } else if (d.tipo === 'presente') {
      if (!d.nome || !d.id) return json_({ ok: false, erro: 'Dados incompletos' });
      sh.appendRow([agora, txt_(d.id, 40), txt_(d.presente, 100), Number(d.valor) || 0, txt_(d.nome, 100), txt_(d.mensagem, 300), '']);
    } else if (d.tipo === 'recado') {
      if (!d.nome || !d.mensagem) return json_({ ok: false, erro: 'Dados incompletos' });
      sh.appendRow([agora, txt_(d.nome, 60), txt_(d.mensagem, 500), MODERAR_RECADOS ? '' : 'SIM']);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}
