// ============================================================
// Decodificação do token fake (JWT-like) — compartilhado entre as rotas
// de auth e qualquer rota que precise saber "quem está logado" (ex:
// POST /api/lancamentos usa isso pra preencher usuarioRegistro).
// ============================================================

const { buscarPorEmail } = require("./usuarios");

function decodificarPayload(token) {
  const partes = String(token || "").split(".");
  if (partes.length !== 3) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8"));
  } catch (erro) {
    return null;
  }
}

function tokenDoRequest(req) {
  const authorization = req.headers.authorization || "";
  return authorization.replace(/^Bearer\s+/i, "").trim();
}

/** Usuário autenticado (sem senha) a partir do header Authorization, ou null. */
function usuarioAutenticadoDoRequest(req) {
  const token = tokenDoRequest(req);
  if (!token) return null;

  const payload = decodificarPayload(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    return null;
  }
  return buscarPorEmail(payload.email) || null;
}

module.exports = { decodificarPayload, tokenDoRequest, usuarioAutenticadoDoRequest };
