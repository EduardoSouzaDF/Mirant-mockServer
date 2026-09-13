const {
  listarFiltrosOpcoes,
  situacaoValida,
  paginacaoValida,
  buscarLotes,
  buscarLotePorId,
  atualizarSituacao,
  excluirLote,
} = require("../../src/lotes");

function numeroOuUndefined(valor) {
  if (valor === undefined || valor === "") return undefined;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : NaN;
}

module.exports = [
  // ----------------------------------------------------------
  // GET /api/filtros/lotes — opções para o painel de filtros
  // ----------------------------------------------------------
  {
    id: "get-filtros-lotes",
    url: "/api/filtros/lotes",
    method: "GET",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (_req, res) => {
            return res.status(200).json(listarFiltrosOpcoes());
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // GET /api/lotes — listagem paginada com filtros
  // ----------------------------------------------------------
  {
    id: "get-lotes",
    url: "/api/lotes",
    method: "GET",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
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
              page = "1",
              size = "10",
            } = req.query;

            if (!situacaoValida(situacao)) {
              return res.status(400).json({ message: "Situação inválida" });
            }

            const pageNum = Number(page);
            const sizeNum = Number(size);
            if (!paginacaoValida(pageNum, sizeNum)) {
              return res.status(400).json({ message: "Paginação inválida" });
            }

            const faixas = {
              idDe: numeroOuUndefined(idDe),
              idAte: numeroOuUndefined(idAte),
              valorDe: numeroOuUndefined(valorDe),
              valorAte: numeroOuUndefined(valorAte),
            };
            for (const [chave, valor] of Object.entries(faixas)) {
              if (Number.isNaN(valor)) {
                return res.status(400).json({ message: `Parâmetro ${chave} inválido` });
              }
            }

            const resultado = buscarLotes(
              {
                instituicaoRespId,
                instituicaoId,
                situacao,
                dataDe,
                dataAte,
                ...faixas,
              },
              pageNum,
              sizeNum,
            );
            return res.status(200).json(resultado);
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // GET /api/lotes/:id — detalhe do lote
  // ----------------------------------------------------------
  {
    id: "get-lote-id",
    url: "/api/lotes/:id",
    method: "GET",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
              return res.status(400).json({ message: "Id inválido" });
            }
            const lote = buscarLotePorId(id);
            if (!lote) {
              return res.status(404).json({ message: "Lote não encontrado" });
            }
            return res.status(200).json(lote);
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // POST /api/lotes/:id/confirmar — muda situação para Confirmado
  // ----------------------------------------------------------
  {
    id: "post-lote-confirmar",
    url: "/api/lotes/:id/confirmar",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const id = Number(req.params.id);
            const lote = atualizarSituacao(id, "Confirmado");
            if (!lote) {
              return res.status(404).json({ message: "Lote não encontrado" });
            }
            return res.status(200).json(lote);
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // POST /api/lotes/:id/enviar — muda situação para Enviado
  // ----------------------------------------------------------
  {
    id: "post-lote-enviar",
    url: "/api/lotes/:id/enviar",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const id = Number(req.params.id);
            const lote = atualizarSituacao(id, "Enviado");
            if (!lote) {
              return res.status(404).json({ message: "Lote não encontrado" });
            }
            return res.status(200).json(lote);
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // POST /api/lotes/:id/excluir — remove o lote do seed
  // ----------------------------------------------------------
  {
    id: "post-lote-excluir",
    url: "/api/lotes/:id/excluir",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const id = Number(req.params.id);
            const removido = excluirLote(id);
            if (!removido) {
              return res.status(404).json({ message: "Lote não encontrado" });
            }
            return res.status(204).send();
          },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // Placeholders — regra de negócio real fica para spec futura
  // ----------------------------------------------------------
  {
    id: "post-lote-incluir",
    url: "/api/lotes/incluir",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "json",
        options: { status: 200, body: { message: "OK (placeholder)" } },
      },
    ],
  },
  {
    id: "post-lote-alterar",
    url: "/api/lotes/:id/alterar",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "json",
        options: { status: 200, body: { message: "OK (placeholder)" } },
      },
    ],
  },
  {
    id: "post-lote-justificativa",
    url: "/api/lotes/:id/justificativa",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "json",
        options: { status: 200, body: { message: "OK (placeholder)" } },
      },
    ],
  },
];
