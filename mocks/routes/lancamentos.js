const { buscarContaCorrentePorId } = require("../../src/contas-correntes");
const { historicoValido, criarLancamento } = require("../../src/lancamentos");
const { criarLoteComLancamento } = require("../../src/lotes");
const { usuarioAutenticadoDoRequest } = require("../../src/auth-token");

module.exports = [
  // ----------------------------------------------------------
  // POST /api/lancamentos — cria um lançamento (situação Pendente) e um
  // lote novo (situação Aberto) para a instituição da conta corrente.
  // ----------------------------------------------------------
  {
    id: "post-lancamentos",
    url: "/api/lancamentos",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const { contaCorrenteId, valor, historico, estorno, documentos, descricao } =
              req.body || {};

            const conta = buscarContaCorrentePorId(Number(contaCorrenteId));
            if (!conta) {
              return res.status(400).json({ message: "Conta corrente inválida" });
            }
            if (typeof valor !== "number" || valor <= 0) {
              return res.status(400).json({ message: "Valor deve ser maior que zero" });
            }
            if (!historicoValido(historico)) {
              return res.status(400).json({ message: "Histórico inválido" });
            }
            if (!Array.isArray(documentos) || documentos.length === 0) {
              return res.status(400).json({ message: "Anexe ao menos um documento" });
            }

            const lancamento = criarLancamento({
              contaCorrenteId: conta.id,
              valor,
              historico,
              estorno,
              documentos,
              descricao,
            });
            // usuarioRegistro do lote é o usuário autenticado no token
            // (não um placeholder do seed).
            const usuarioAutenticado = usuarioAutenticadoDoRequest(req);
            const lote = criarLoteComLancamento(
              lancamento,
              conta.instituicaoId,
              usuarioAutenticado ? usuarioAutenticado.id : null,
            );
            return res.status(201).json(lote);
          },
        },
      },
    ],
  },
];
