const { buscarPorEmail, semSenha } = require("../../src/usuarios");
const { decodificarPayload } = require("../../src/auth-token");

// ============================================================
// Token fake — payload codificado em base64url + assinatura fake
// (formato JWT-like). Não é segurança real, é mock.
// ============================================================
const TOKEN_EXPIRACAO_SEG = 60 * 60; // 1 hora

function codificarBase64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

function gerarToken(usuario) {
  const agora = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    iat: agora,
    exp: agora + TOKEN_EXPIRACAO_SEG,
  };
  const assinatura = codificarBase64url({ sig: "assinatura-fake-do-mock" });
  return `${codificarBase64url(header)}.${codificarBase64url(payload)}.${assinatura}`;
}

module.exports = [
  // ----------------------------------------------------------
  // POST /api/auth/login — valida credenciais e devolve o token
  // ----------------------------------------------------------
  {
    id: "post-auth-login",
    url: "/api/auth/login",
    method: "POST",
    variants: [
      {
        // Variant padrão (collection base): valida o corpo de verdade e
        // responde 200 (sucesso) ou 400/401 (erros) conforme o payload.
        id: "login-sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const { email, senha } = req.body || {};
            if (!email || !senha) {
              return res.status(400).json({ message: "Informe email e senha" });
            }
            const usuario = buscarPorEmail(email);
            if (!usuario) {
              return res.status(401).json({ message: "Email não encontrado" });
            }
            if (usuario.senha !== senha) {
              return res.status(401).json({ message: "Senha incorreta" });
            }
            return res.status(200).json({
              token: gerarToken(usuario),
              user: semSenha(usuario),
            });
          },
        },
      },
      {
        // Variants estáticas — usadas por collections alternativas em testes.
        id: "email-nao-encontrado",
        type: "json",
        options: {
          status: 401,
          body: { message: "Email não encontrado" },
        },
      },
      {
        id: "senha-incorreta",
        type: "json",
        options: {
          status: 401,
          body: { message: "Senha incorreta" },
        },
      },
      {
        id: "erro-servidor",
        type: "json",
        options: {
          status: 500,
          body: { message: "Servidor indisponível" },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // POST /api/auth/reset-password — sempre OK (fake)
  // ----------------------------------------------------------
  {
    id: "post-auth-reset-password",
    url: "/api/auth/reset-password",
    method: "POST",
    variants: [
      {
        id: "sucesso",
        type: "json",
        options: {
          status: 200,
          body: { message: "OK — senha redefinida (mock)" },
        },
      },
    ],
  },

  // ----------------------------------------------------------
  // GET /api/auth/me — valida o token Bearer e devolve o usuário
  // ----------------------------------------------------------
  {
    id: "get-auth-me",
    url: "/api/auth/me",
    method: "GET",
    variants: [
      {
        id: "sucesso",
        type: "middleware",
        options: {
          middleware: (req, res) => {
            const authorization = req.headers.authorization || "";
            const token = authorization.replace(/^Bearer\s+/i, "").trim();
            if (!token) {
              return res.status(401).json({ message: "Token não informado" });
            }
            const payload = decodificarPayload(token);
            if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
              return res
                .status(401)
                .json({ message: "Token inválido ou expirado" });
            }
            const usuario = buscarPorEmail(payload.email);
            if (!usuario) {
              return res
                .status(401)
                .json({ message: "Usuário não encontrado" });
            }
            return res.status(200).json({ user: semSenha(usuario) });
          },
        },
      },
    ],
  },
];
