// ============================================================
// Entidade Usuario — fixture em memória do mock.
// O usuário padrão é admin@mirante.com.br / 123456.
// ============================================================

// Prefixo "auth-" de propósito: não colide com os ids "u-NNN" da lista de
// usuários interna do lote (src/lotes.js) — são listas diferentes, e um
// lote criado via inclusão de lançamento (spec 0005) usa o usuário
// autenticado real como usuarioRegistro, não um dos placeholders.
const usuarios = [
  {
    id: "auth-001",
    nome: "Administrador",
    email: "admin@mirante.com.br",
    senha: "123456",
  },
];

// Busca usuário por email (case-insensitive).
function buscarPorEmail(email) {
  if (!email) {
    return undefined;
  }
  const normalizado = String(email).trim().toLowerCase();
  return usuarios.find((u) => u.email === normalizado);
}

// Retorna o usuário sem a senha (para respostas de API).
function semSenha(usuario) {
  const { senha: _senha, ...resto } = usuario;
  return resto;
}

module.exports = { usuarios, buscarPorEmail, semSenha };
