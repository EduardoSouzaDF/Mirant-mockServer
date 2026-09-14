const {
  buscarContaCorrentePorNumero,
} = require("../../src/contas-correntes");
const { buscarInstituicaoPorId } = require("../../src/instituicoes");

module.exports = [
  // ----------------------------------------------------------
  // GET /api/contas-correntes?numero=... — busca conta corrente pelo
  // número (ou "agencia-conta") e devolve a instituição titular.
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
              return res.status(400).json({ message: "Informe o número da conta" });
            }
            const conta = buscarContaCorrentePorNumero(numero);
            if (!conta) {
              return res.status(404).json({ message: "Conta corrente não encontrada" });
            }
            const instituicao = buscarInstituicaoPorId(conta.instituicaoId);
            return res.status(200).json({ conta, instituicao: instituicao || null });
          },
        },
      },
    ],
  },
];
