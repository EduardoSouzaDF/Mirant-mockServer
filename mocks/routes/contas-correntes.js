const {
  buscarContaCorrentePorNumero,
  listarContasCorrentes,
} = require("../../src/contas-correntes");
const { buscarInstituicaoPorId } = require("../../src/instituicoes");

function comInstituicao(conta) {
  const instituicao = buscarInstituicaoPorId(conta.instituicaoId);
  return { conta, instituicao: instituicao || null };
}

module.exports = [
  // ----------------------------------------------------------
  // GET /api/contas-correntes — sem `numero`: lista todas as contas (pro
  // select pesquisável do frontend). Com `numero`: busca uma só (aceita
  // "agencia-conta" ou só o número da conta) e devolve a instituição
  // titular; 404 se não achar.
  // ----------------------------------------------------------
  {
    id: "get-contas-correntes",
    url: "/api/contas-correntes",
    method: "GET",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const { numero } = req.query;
            if (!numero) {
              return res.status(200).json({ contas: listarContasCorrentes().map(comInstituicao) });
            }
            const conta = buscarContaCorrentePorNumero(numero);
            if (!conta) {
              return res.status(404).json({ message: "Conta corrente não encontrada" });
            }
            return res.status(200).json(comInstituicao(conta));
          },
        },
      },
    ],
  },
];
