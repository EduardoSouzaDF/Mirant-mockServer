// ============================================================
// Entidades e fixtures em memória do mock de "Outros Créditos/Débitos".
// ============================================================

const { primeiraContaDaInstituicao } = require("./contas-correntes");
const { criarLancamentoSeed, reservarProximoId } = require("./lancamentos");
const {
  instituicoes,
  instituicoesResponsaveis,
  buscarInstituicaoPorId,
} = require("./instituicoes");

const SITUACOES = ["Aberto", "Confirmado", "Enviado"];

const usuarios = [
  { id: "u-001", nome: "gearqc0300_00" },
  { id: "u-002", nome: "gearqc0300_01" },
  { id: "u-003", nome: "gearqc0300_02" },
  { id: "u-004", nome: "gearqc0300_03" },
];

// Lançamentos "legados" do seed: contaCorrenteId resolvido pela instituição
// do lote, situação Confirmado (já são dados históricos, não passaram pelo
// fluxo real de inclusão — que sempre cria Pendente).
function lancamentoSeed(instituicaoId, valor, descricao) {
  const conta = primeiraContaDaInstituicao(instituicaoId);
  return criarLancamentoSeed({
    contaCorrenteId: conta ? conta.id : null,
    valor,
    historico: "Lançamento Manual",
    estorno: false,
    documentos: [{ nome: "documento.pdf" }],
    descricao,
    situacao: "Confirmado",
  });
}

let proximoIdLote = 25;
let lotes = [
  {
    id: 1,
    instituicaoRespId: "0001",
    instituicaoId: "0001",
    usuarioRegistroId: "u-001",
    usuarioAprovacaoId: "u-002",
    situacao: "Confirmado",
    dataEntrada: "2026-04-20",
    dataHoraSituacao: "2026-04-21T09:12:00",
    lancamentos: [
      lancamentoSeed("0001", 200.0, "Lançamento 1"),
      lancamentoSeed("0001", 150.0, "Lançamento 2"),
      lancamentoSeed("0001", 150.0, "Lançamento 3"),
    ],
  },
  {
    id: 2,
    instituicaoRespId: "0001",
    instituicaoId: "0002",
    usuarioRegistroId: "u-001",
    usuarioAprovacaoId: null,
    situacao: "Aberto",
    dataEntrada: "2026-04-26",
    dataHoraSituacao: "2026-04-27T12:35:11",
    lancamentos: [lancamentoSeed("0002", 1000.0, "Lançamento 1")],
  },
  {
    id: 3,
    instituicaoRespId: "0001",
    instituicaoId: "0002",
    usuarioRegistroId: "u-002",
    usuarioAprovacaoId: "u-001",
    situacao: "Enviado",
    dataEntrada: "2026-05-02",
    dataHoraSituacao: "2026-05-03T08:00:00",
    lancamentos: [
      lancamentoSeed("0002", 100.75, "Lançamento 1"),
      lancamentoSeed("0002", 150.0, "Lançamento 2"),
    ],
  },
  {
    id: 4,
    instituicaoRespId: "0001",
    instituicaoId: "0001",
    usuarioRegistroId: "u-002",
    usuarioAprovacaoId: null,
    situacao: "Aberto",
    dataEntrada: "2026-05-10",
    dataHoraSituacao: "2026-05-10T15:45:30",
    lancamentos: [
      lancamentoSeed("0001", 500.0, "Lançamento 1"),
      lancamentoSeed("0001", 700.5, "Lançamento 2"),
      lancamentoSeed("0001", 500.0, "Lançamento 3"),
      lancamentoSeed("0001", 800.0, "Lançamento 4"),
      lancamentoSeed("0001", 700.0, "Lançamento 5"),
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

    const dia = String((i % 27) + 1).padStart(2, "0");
    const mes = String((i % 6) + 4).padStart(2, "0"); // meses 04 a 09
    const dataEntrada = `2026-${mes}-${dia}`;
    const hora = String(8 + (i % 10)).padStart(2, "0");
    const minuto = String((i * 7) % 60).padStart(2, "0");
    const dataHoraSituacao = `2026-${mes}-${dia}T${hora}:${minuto}:00`;

    const lancamentos = Array.from({ length: quantidadeLancamentos }, (_, idx) =>
      lancamentoSeed(instituicaoId, valorLancamento, `Lançamento ${idx + 1}`),
    );

    lotes.push({
      id: i,
      instituicaoRespId,
      instituicaoId,
      usuarioRegistroId,
      usuarioAprovacaoId,
      situacao,
      dataEntrada,
      dataHoraSituacao,
      lancamentos,
    });
  }
})();

// Os ids de lançamento do seed acima já consumiram alguns números — garante
// que novos lançamentos (criados via POST /api/lancamentos) não colidam.
reservarProximoId(
  lotes.reduce((max, lote) => {
    const maiorDoLote = lote.lancamentos.reduce((m, l) => Math.max(m, l.id), 0);
    return Math.max(max, maiorDoLote);
  }, 0) + 1,
);

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

/** Somatório do valor dos lançamentos do lote (valor não é mais um campo próprio). */
function calcularValorLote(lote) {
  return lote.lancamentos.reduce((soma, l) => soma + l.valor, 0);
}

function calcularQuantidadeLancamentos(lote) {
  return lote.lancamentos.length;
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
    usuarioRegistro: usuarioRegistro ? { id: usuarioRegistro.id, nome: usuarioRegistro.nome } : null,
    usuarioAprovacao: usuarioAprovacao ? { id: usuarioAprovacao.id, nome: usuarioAprovacao.nome } : null,
    situacao: lote.situacao,
    dataEntrada: lote.dataEntrada,
    dataHoraSituacao: lote.dataHoraSituacao,
    // valor/quantidadeLancamentos não são mais enviados prontos — o
    // frontend calcula a partir de `lancamentos` (spec 0005).
    lancamentos: lote.lancamentos,
  };
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
    if (valorDe !== undefined && calcularValorLote(lote) < valorDe) return false;
    if (valorAte !== undefined && calcularValorLote(lote) > valorAte) return false;
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
  return lote ? paraApi(lote) : undefined;
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

/**
 * Cria um lote novo (situação Aberto) para a instituição da conta
 * corrente informada, com o lançamento (já criado, situação Pendente)
 * dentro dele. Usado por POST /api/lancamentos (spec 0005).
 */
function criarLoteComLancamento(lancamento, instituicaoId) {
  const agora = new Date();
  const lote = {
    id: proximoIdLote++,
    instituicaoRespId: instituicaoId,
    instituicaoId,
    usuarioRegistroId: null,
    usuarioAprovacaoId: null,
    situacao: "Aberto",
    dataEntrada: agora.toISOString().slice(0, 10),
    dataHoraSituacao: agora.toISOString(),
    lancamentos: [lancamento],
  };
  lotes.push(lote);
  return paraApi(lote);
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
  criarLoteComLancamento,
  calcularValorLote,
  calcularQuantidadeLancamentos,
};
