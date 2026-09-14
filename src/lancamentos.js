// ============================================================
// Entidade Lancamento — fixture em memória do mock.
// Relação N:1 com ContaCorrente. Ids globais (não reiniciam por lote).
// ============================================================

const ENUM_HISTORICO = ["Lançamento Manual"];

let proximoId = 1;

/** Usado só na carga inicial do seed, pra garantir ids únicos. */
function reservarProximoId(valorMinimo) {
  if (valorMinimo >= proximoId) {
    proximoId = valorMinimo;
  }
}

function historicoValido(historico) {
  return ENUM_HISTORICO.includes(historico);
}

/**
 * Cria um Lancamento novo (situação sempre "Pendente"). `documentos` é a
 * lista de arquivos anexados pelo formulário — vira Arquivo (id/nome/
 * pathUrl mockado).
 */
function criarLancamento({ contaCorrenteId, valor, historico, estorno, documentos, descricao }) {
  const lancamento = {
    id: proximoId++,
    contaCorrenteId,
    valor,
    historico,
    estorno: !!estorno,
    documentos: (documentos || []).map((doc, indice) => ({
      id: indice + 1,
      nome: doc.nome,
      pathUrl: `/mock-files/${Date.now()}-${indice}-${doc.nome}`,
    })),
    descricao: descricao || "",
    situacao: "Pendente",
  };
  return lancamento;
}

/** Usado só ao montar o seed inicial (lançamentos "legados", já existentes). */
function criarLancamentoSeed({ contaCorrenteId, valor, historico, estorno, documentos, descricao, situacao }) {
  const lancamento = criarLancamento({ contaCorrenteId, valor, historico, estorno, documentos, descricao });
  lancamento.situacao = situacao || lancamento.situacao;
  return lancamento;
}

module.exports = {
  ENUM_HISTORICO,
  historicoValido,
  criarLancamento,
  criarLancamentoSeed,
  reservarProximoId,
};
