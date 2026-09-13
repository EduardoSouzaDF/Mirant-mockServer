// ============================================================
// Entidade Usuario — fixture em memória do mock.
// O usuário padrão é admin@mirante.com.br / 123456.
// ============================================================

const usuarios = [
  {
    id: "u-001",
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
