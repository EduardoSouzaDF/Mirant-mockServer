// ============================================================
// Entidade Instituicao — fixture em memória do mock, compartilhada por
// lotes, contas-correntes e lançamentos.
// ============================================================

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

function buscarInstituicaoPorId(id) {
  return instituicoes.find((i) => i.id === id);
}

module.exports = {
  instituicoes,
  instituicoesResponsaveis,
  buscarInstituicaoPorId,
};
