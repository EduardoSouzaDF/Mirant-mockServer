// ============================================================
// Entidades e fixtures em memória do mock de "Outros Créditos/Débitos".
// ============================================================

const SITUACOES = ["Aberto", "Confirmado", "Enviado"];

const instituicoesResponsaveis = [
  { id: "0001", nome: "0001 - SICOOB" },
  { id: "0003", nome: "0003 - SICOOB NORTE" },
  { id: "0005", nome: "0005 - SICOOB LESTE" },
];

const instituicoes = [
  { id: "0001", nome: "0001 - SICOOB" },
  { id: "0002", nome: "0002 - SICOOB CENTRAL" },
  { id: "0003", nome: "0003 - SICOOB NORTE" },
  { id: "0004", nome: "0004 - SICOOB SUL" },
  { id: "0005", nome: "0005 - SICOOB LESTE" },
  { id: "0006", nome: "0006 - SICOOB OESTE" },
  { id: "0007", nome: "0007 - SICOOB CENTRO" },
];

const usuarios = [
  { id: "u-001", nome: "gearqc0300_00" },
  { id: "u-002", nome: "gearqc0300_01" },
  { id: "u-003", nome: "gearqc0300_02" },
  { id: "u-004", nome: "gearqc0300_03" },
];

let proximoId = 25;
let lotes = [
  {
    id: 1,
    instituicaoRespId: "0001",
    instituicaoId: "0001",
    valor: 500.0,
    quantidadeLancamentos: 3,
    usuarioRegistroId: "u-001",
    usuarioAprovacaoId: "u-002",
    situacao: "Confirmado",
    dataEntrada: "2026-04-20",
    dataHoraSituacao: "2026-04-21T09:12:00",
    lancamentos: [
      { id: 1, descricao: "Lançamento 1", valor: 200.0 },
      { id: 2, descricao: "Lançamento 2", valor: 150.0 },
      { id: 3, descricao: "Lançamento 3", valor: 150.0 },
    ],
  },
  {
    id: 2,
    instituicaoRespId: "0001",
    instituicaoId: "0002",
    valor: 1000.0,
    quantidadeLancamentos: 1,
    usuarioRegistroId: "u-001",
    usuarioAprovacaoId: null,
    situacao: "Aberto",
    dataEntrada: "2026-04-26",
    dataHoraSituacao: "2026-04-27T12:35:11",
    lancamentos: [{ id: 1, descricao: "Lançamento 1", valor: 1000.0 }],
  },
  {
    id: 3,
    instituicaoRespId: "0001",
    instituicaoId: "0002",
    valor: 250.75,
    quantidadeLancamentos: 2,
    usuarioRegistroId: "u-002",
    usuarioAprovacaoId: "u-001",
    situacao: "Enviado",
    dataEntrada: "2026-05-02",
    dataHoraSituacao: "2026-05-03T08:00:00",
    lancamentos: [
      { id: 1, descricao: "Lançamento 1", valor: 100.75 },
      { id: 2, descricao: "Lançamento 2", valor: 150.0 },
    ],
  },
  {
    id: 4,
    instituicaoRespId: "0001",
    instituicaoId: "0001",
    valor: 3200.5,
    quantidadeLancamentos: 5,
    usuarioRegistroId: "u-002",
    usuarioAprovacaoId: null,
    situacao: "Aberto",
    dataEntrada: "2026-05-10",
    dataHoraSituacao: "2026-05-10T15:45:30",
    lancamentos: [
      { id: 1, descricao: "Lançamento 1", valor: 500.0 },
      { id: 2, descricao: "Lançamento 2", valor: 700.5 },
      { id: 3, descricao: "Lançamento 3", valor: 500.0 },
      { id: 4, descricao: "Lançamento 4", valor: 800.0 },
      { id: 5, descricao: "Lançamento 5", valor: 700.0 },
    ],
  },
];

// ------------------------------------------------------------
// Mais 20 lotes (ids 5-24), gerados com variação de instituição,
// situação, valores e datas — para exercitar filtros e paginação.
// ------------------------------------------------------------
// Situações mescladas manualmente (não é um ciclo Aberto/Confirmado/Enviado
// repetindo em ordem) para os lotes 5-24, ~1/3 de cada situação.
const SITUACOES_MESCLADAS = [
  "Enviado", "Confirmado", "Aberto", "Confirmado", "Aberto",
  "Enviado", "Aberto", "Confirmado", "Enviado", "Aberto",
  "Confirmado", "Enviado", "Aberto", "Confirmado", "Enviado",
  "Aberto", "Confirmado", "Enviado", "Aberto", "Confirmado",
];

(function gerarLotesAdicionais() {
  const instituicoesIds = instituicoes.map((i) => i.id);
  const respIds = instituicoesResponsaveis.map((r) => r.id);
  const usuariosIds = usuarios.map((u) => u.id);

  for (let i = 5; i <= 24; i++) {
    const situacao = SITUACOES_MESCLADAS[i - 5];
    const instituicaoId = instituicoesIds[i % instituicoesIds.length];
    const instituicaoRespId = respIds[i % respIds.length];
    const usuarioRegistroId = usuariosIds[i % usuariosIds.length];
    const usuarioAprovacaoId =
      situacao === "Aberto" ? null : usuariosIds[(i + 1) % usuariosIds.length];

    const quantidadeLancamentos = (i % 4) + 1;
    const valorLancamento = Number((50 + i * 37.5).toFixed(2));
    const valor = Number((valorLancamento * quantidadeLancamentos).toFixed(2));

    const dia = String((i % 27) + 1).padStart(2, "0");
    const mes = String((i % 6) + 4).padStart(2, "0"); // meses 04 a 09
    const dataEntrada = `2026-${mes}-${dia}`;
    const hora = String(8 + (i % 10)).padStart(2, "0");
    const minuto = String((i * 7) % 60).padStart(2, "0");
    const dataHoraSituacao = `2026-${mes}-${dia}T${hora}:${minuto}:00`;

    const lancamentos = Array.from({ length: quantidadeLancamentos }, (_, idx) => ({
      id: idx + 1,
      descricao: `Lançamento ${idx + 1}`,
      valor: valorLancamento,
    }));

    lotes.push({
      id: i,
      instituicaoRespId,
      instituicaoId,
      valor,
      quantidadeLancamentos,
      usuarioRegistroId,
      usuarioAprovacaoId,
      situacao,
      dataEntrada,
      dataHoraSituacao,
      lancamentos,
    });
  }
})();

function buscarInstituicaoPorId(id) {
  return instituicoes.find((i) => i.id === id);
}

function buscarUsuarioPorId(id) {
  return id ? usuarios.find((u) => u.id === id) : undefined;
}

function listarFiltrosOpcoes() {
  return {
    instituicoes,
    instituicoesResponsaveis,
    situacoes: SITUACOES,
  };
}

function situacaoValida(situacao) {
  return !situacao || situacao === "Todas" || SITUACOES.includes(situacao);
}

function paginacaoValida(page, size) {
  return Number.isInteger(page) && page > 0 && Number.isInteger(size) && size > 0;
}

function paraApi(lote) {
  const resp = buscarInstituicaoPorId(lote.instituicaoRespId);
  const instituicao = buscarInstituicaoPorId(lote.instituicaoId);
  const usuarioRegistro = buscarUsuarioPorId(lote.usuarioRegistroId);
  const usuarioAprovacao = buscarUsuarioPorId(lote.usuarioAprovacaoId);

  return {
    id: lote.id,
    resp: resp ? { id: resp.id, nome: resp.nome } : null,
    instituicao: instituicao ? { id: instituicao.id, nome: instituicao.nome } : null,
    valor: lote.valor,
    quantidadeLancamentos: lote.quantidadeLancamentos,
    usuarioRegistro: usuarioRegistro ? { id: usuarioRegistro.id, nome: usuarioRegistro.nome } : null,
    usuarioAprovacao: usuarioAprovacao ? { id: usuarioAprovacao.id, nome: usuarioAprovacao.nome } : null,
    situacao: lote.situacao,
    dataEntrada: lote.dataEntrada,
    dataHoraSituacao: lote.dataHoraSituacao,
  };
}

function paraApiDetalhe(lote) {
  return { ...paraApi(lote), lancamentos: lote.lancamentos };
}

function buscarLotes(filtro, page, size) {
  const {
    instituicaoRespId,
    instituicaoId,
    situacao,
    idDe,
    idAte,
    valorDe,
    valorAte,
    dataDe,
    dataAte,
  } = filtro;

  const filtrados = lotes.filter((lote) => {
    if (instituicaoRespId && lote.instituicaoRespId !== instituicaoRespId) return false;
    if (instituicaoId && lote.instituicaoId !== instituicaoId) return false;
    if (situacao && situacao !== "Todas" && lote.situacao !== situacao) return false;
    if (idDe !== undefined && lote.id < idDe) return false;
    if (idAte !== undefined && lote.id > idAte) return false;
    if (valorDe !== undefined && lote.valor < valorDe) return false;
    if (valorAte !== undefined && lote.valor > valorAte) return false;
    if (dataDe && lote.dataEntrada < dataDe) return false;
    if (dataAte && lote.dataEntrada > dataAte) return false;
    return true;
  });

  const total = filtrados.length;
  const inicio = (page - 1) * size;
  const pagina = filtrados.slice(inicio, inicio + size).map(paraApi);

  return {
    data: pagina,
    total,
    page,
    size,
    hasNext: inicio + size < total,
    hasPrevious: page > 1,
  };
}

function buscarLotePorId(id) {
  const lote = lotes.find((l) => l.id === id);
  return lote ? paraApiDetalhe(lote) : undefined;
}

function atualizarSituacao(id, situacao) {
  const lote = lotes.find((l) => l.id === id);
  if (!lote) return undefined;
  lote.situacao = situacao;
  lote.dataHoraSituacao = new Date().toISOString();
  return paraApi(lote);
}

/** Aplica a mesma situação a vários lotes de uma vez (uma chamada, N ids). */
function atualizarSituacaoEmMassa(ids, situacao) {
  const atualizados = [];
  for (const id of ids) {
    const lote = atualizarSituacao(id, situacao);
    if (lote) atualizados.push(lote);
  }
  return atualizados;
}

function excluirLote(id) {
  const indice = lotes.findIndex((l) => l.id === id);
  if (indice === -1) return false;
  lotes.splice(indice, 1);
  return true;
}

function proximoIdLote() {
  return proximoId++;
}

module.exports = {
  SITUACOES,
  listarFiltrosOpcoes,
  situacaoValida,
  paginacaoValida,
  buscarLotes,
  buscarLotePorId,
  atualizarSituacao,
  atualizarSituacaoEmMassa,
  excluirLote,
  proximoIdLote,
};
