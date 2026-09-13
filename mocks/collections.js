// Collections do mock — cada collection define qual variant usar por rota.
// A collection ativa é a "base" (ver mocks.config.js); as demais são cenários
// alternativos para testes (herdam de "base" com "from").
module.exports = [
  {
    id: "base",
    routes: [
      "post-auth-login:login-sucesso",
      "post-auth-reset-password:sucesso",
      "get-auth-me:sucesso",
      "get-filtros-lotes:sucesso",
      "get-lotes:sucesso",
      "get-lote-id:sucesso",
      "post-lote-confirmar:sucesso",
      "post-lote-enviar:sucesso",
      "post-lote-excluir:sucesso",
      "post-lote-incluir:sucesso",
      "post-lote-alterar:sucesso",
      "post-lote-justificativa:sucesso",
    ],
  },
  {
    id: "login-email-nao-encontrado",
    from: "base",
    routes: ["post-auth-login:email-nao-encontrado"],
  },
  {
    id: "login-senha-incorreta",
    from: "base",
    routes: ["post-auth-login:senha-incorreta"],
  },
  {
    id: "erro-servidor",
    from: "base",
    routes: ["post-auth-login:erro-servidor"],
  },
];
