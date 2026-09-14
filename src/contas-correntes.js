// ============================================================
// Entidade ContaCorrente — fixture em memória do mock.
// Relação N:1 com Instituicao (id vem de src/lotes.js hoje; se um dia
// virar módulo próprio, mover as instituições pra cá).
// ============================================================

const contasCorrentes = [
  { id: 1, agencia: 1, conta: 100011, instituicaoId: "0001" },
  { id: 2, agencia: 1, conta: 100012, instituicaoId: "0001" },
  { id: 3, agencia: 2, conta: 200021, instituicaoId: "0002" },
  { id: 4, agencia: 3, conta: 300031, instituicaoId: "0003" },
  { id: 5, agencia: 4, conta: 400041, instituicaoId: "0004" },
  { id: 6, agencia: 5, conta: 500051, instituicaoId: "0005" },
  { id: 7, agencia: 6, conta: 600061, instituicaoId: "0006" },
  { id: 8, agencia: 7, conta: 700071, instituicaoId: "0007" },
];

/** Busca por número da conta (aceita "agencia-conta" ou só o número da conta). */
function buscarContaCorrentePorNumero(numero) {
  if (!numero) return undefined;
  const texto = String(numero).trim();
  return contasCorrentes.find((c) => {
    if (String(c.conta) === texto) return true;
    if (`${c.agencia}-${c.conta}` === texto) return true;
    return false;
  });
}

function buscarContaCorrentePorId(id) {
  return contasCorrentes.find((c) => c.id === id);
}

function primeiraContaDaInstituicao(instituicaoId) {
  return contasCorrentes.find((c) => c.instituicaoId === instituicaoId);
}

function listarContasPorInstituicao(instituicaoId) {
  return contasCorrentes.filter((c) => c.instituicaoId === instituicaoId);
}

function listarContasCorrentes() {
  return contasCorrentes;
}

module.exports = {
  contasCorrentes,
  buscarContaCorrentePorNumero,
  buscarContaCorrentePorId,
  primeiraContaDaInstituicao,
  listarContasCorrentes,
  listarContasPorInstituicao,
};
